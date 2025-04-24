import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userExhibitionStore } from "../store/exhibitionStore";
import { ViewToggle } from "./ViewToggle";

interface ExhibitionIdParams {
  [key: string]: string;
}

export const ExhibitionPage: React.FC = () => {
  const { id } = useParams<ExhibitionIdParams>();
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  const removeArtwork = userExhibitionStore((state) => state.removeArtwork);
  const removeExhibition = userExhibitionStore(
    (state) => state.removeExhibition
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const exhibition = exhibitions.find((exhibit) => exhibit.exhibitionId === id);
  if (!exhibition) return <div>Exhibition not found</div>;

  const handleRemove = (artworkId: string) => {
    removeArtwork(artworkId);
  };
  const handleRemoveExhibition = (exhibitionId: string) => {
    removeExhibition(exhibitionId);
  };

  return (
    <div>
      <div>
        <button
          onClick={() => {
            handleRemoveExhibition(exhibition.exhibitionId);
          }}
          className="text-gray-600 hover:text-red-500"
        >
          Delete Exhibition
        </button>
      </div>
      <h1>{exhibition.title}</h1>
      {exhibition.description && <p>{exhibition.description}</p>}
      {exhibition.artworks.length === 0 ? (
        <p>
          This exhibition has no artworks yet.{" "}
          <Link
            to={"/"}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Click here to add to ${exhibition.title}
          </Link>
        </p>
      ) : (
        <div className="grid gap-4">
          <div>
            <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
          </div>
          <div
            className={
              viewMode === "list"
                ? "flex flex-col gap-4"
                : "grid grid-cols-2 md:grid-cols-4 gap-4"
            }
          >
            {exhibition.artworks.map((artwork) => (
              <div key={artwork.id} className="border p-2 rounded hover:shadow">
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
                />
                <h2>Title: {artwork.title}</h2>
                <h3>Artist: {artwork.artist}</h3>
                <button
                  onClick={() => handleRemove(artwork.id)}
                  className="text-gray-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
