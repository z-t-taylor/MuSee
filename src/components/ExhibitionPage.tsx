import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { userExhibitionStore } from "../store/exhibitionStore";
import { ViewToggle } from "./ViewToggle";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { UserExhibitionArtwork } from "../api/userExhibition";

export const ExhibitionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  const removeArtwork = userExhibitionStore((state) => state.removeArtwork);
  const removeExhibition = userExhibitionStore(
    (state) => state.removeExhibition
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [confirmDeleteExhibit, setConfirmDeleteExhibit] = useState(false);
  const [confirmDeleteArt, setConfirmDeleteArt] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<
    | "title-asc"
    | "title-desc"
    | "added-asc"
    | "added-desc"
    | "created-asc"
    | "created-desc"
  >("added-asc");

  const exhibition = exhibitions.find((exhibit) => exhibit.slug === slug);

  const sortedArtworks = useMemo(() => {
    if (!exhibition) return [];

    return [...exhibition.artworks].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      const createdA = new Date(a.creationDate ?? 0).getTime();
      const createdB = new Date(b.creationDate ?? 0).getTime();
      const addedA = new Date(a.addedAt).getTime();
      const addedB = new Date(b.addedAt).getTime();

      switch (sortOption) {
        case "title-asc":
          return titleA.localeCompare(titleB);
        case "title-desc":
          return titleB.localeCompare(titleA);
        case "created-asc":
          return createdA - createdB;
        case "created-desc":
          return createdB - createdA;
        case "added-asc":
          return addedA - addedB;
        case "added-desc":
          return addedB - addedA;
        default:
          return 0;
      }
    });
  }, [exhibition, sortOption]);

  if (exhibitions.length > 0 && !exhibition) {
    return (
      <div>
        <p className="text-center pb-12">Exhibition not found</p>
      </div>
    );
  }
  if (!exhibition) {
    return (
      <div className="flex flex-col items-center justify-center mt-4 space-y-4">
        <p className="mb-2 text-[#195183]">Loading...</p>
        <CircularProgress />
      </div>
    );
  }

  const handleRemove = (artworkId: string) => {
    removeArtwork(artworkId);
  };
  const handleRemoveExhibition = (exhibitionId: string) => {
    removeExhibition(exhibitionId);
  };

  return (
    <div>
      <div className="flex flex-col mt-10">
        <div className="w-full md:w-1/3">
          <h2 className="italic mb-4">Exhibition:</h2>
          <h1 className="text-2xl font-bold">{exhibition.title}</h1>
          {exhibition.description && (
            <p className="mt-2">{exhibition.description}</p>
          )}
        </div>
        <div className="w-full flex justify-end mt-2">
          <button
            onClick={() => {
              setConfirmDeleteExhibit(true);
            }}
            aria-label="Remove exhibition"
            className="text-gray-600 hover:bg-blue-50 hover:text-black border hover:border-0 px-3 py-1 rounded-xl transition-colors"
          >
            <DeleteIcon className="text-red-500" />
          </button>
          <ConfirmDeleteModal
            open={confirmDeleteExhibit}
            title="Delete exhibition?"
            description={`This will permanently remove “${exhibition.title}”. Are you sure?`}
            onCancel={() => setConfirmDeleteExhibit(false)}
            onConfirm={() => {
              handleRemoveExhibition(exhibition.exhibitionId);
              setConfirmDeleteExhibit(false);
            }}
          />
        </div>
      </div>
      {exhibition.artworks.length === 0 ? (
        <p className="flex justify-center pb-12">
          This exhibition has no artworks yet.{" "}
          <Link
            to={"/"}
            className="text-blue-600 underline hover:text-blue-800"
          >
            <p className="flex justify-center pb-12">{`Click here to add to ${exhibition.title}`}</p>
          </Link>
        </p>
      ) : (
        <div className="grid gap-4">
          <div className="flex justify-between py-3">
            <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            <p className="pt-1">
              <span className="pr-2 pl-2">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as typeof sortOption)
                }
                className="border px-2 py-1 rounded"
              >
                <option value="added-asc">Recently Added</option>
                <option value="added-desc">Oldest Added</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="created-asc">Newest-Oldest</option>
                <option value="created-desc">Oldest-Newest </option>
              </select>
            </p>
          </div>
          <div
            className={
              viewMode === "list"
                ? "flex flex-col gap-4 items-center"
                : "grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch"
            }
          >
            {sortedArtworks.map((artwork: UserExhibitionArtwork) => (
              <div
                key={artwork.id}
                className={`relative border p-4 rounded-xl hover:shadow ${
                  viewMode === "list" ? "w-[40%]" : "w-full"
                }`}
              >
                <img
                  src={artwork.image?.imageURL}
                  alt={
                    artwork.image?.altText ?? `Artwork titled ${artwork.title}`
                  }
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "MuSee/public/mona-lisa placeholder.png";
                  }}
                  className="rounded-lg"
                />
                <h3 className="my-2 font-bold">{artwork.title || "Unknown"}</h3>
                <div className="flex">
                  <p className="font-bold text-sm pr-5">Artist:</p>
                  <p className="italic w-2/3 pl-1">
                    {artwork.artist || "Unknown"}
                  </p>
                </div>
                <div className=" flex mb-4 mt-1">
                  <p className="font-bold text-sm">Medium:</p>
                  <p className="italic w-2/3 pl-1">
                    {artwork.medium || "Unknown"}
                  </p>
                </div>
                <Link
                  to={`/artwork/${artwork.museumSource}/${artwork.id}`}
                  className="hover:underline hover:italic mb-2 pb-1"
                >
                  <p className="text-sm">See artwork in detail</p>
                </Link>
                <div className="absolute bottom-4 right-4 mt-1">
                  <button
                    onClick={() => {
                      setConfirmDeleteArt(artwork.id);
                    }}
                    className="text-gray-600 hover:bg-blue-50 hover:text-black border hover:border-0 px-3 py-1 rounded-xl transition-colors"
                  >
                    <DeleteIcon className="text-red-500" />
                  </button>
                  <ConfirmDeleteModal
                    open={confirmDeleteArt === artwork.id}
                    title="Delete artwork?"
                    description={`This will permanently remove “${artwork.title}”. Are you sure?`}
                    onCancel={() => {
                      setConfirmDeleteArt(null);
                    }}
                    onConfirm={() => {
                      handleRemove(artwork.id);
                      setConfirmDeleteArt(null);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
