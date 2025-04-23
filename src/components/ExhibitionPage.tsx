import { Link, useParams } from "react-router-dom";
import { userExhibitionStore } from "../store/exhibitionStore";

interface ExhibitionIdParams {
  [key: string]: string;
}

export const ExhibitionPage: React.FC = () => {
  const { id } = useParams<ExhibitionIdParams>();
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  const removeArtwork = userExhibitionStore((state) => state.removeArtwork);

  const exhibition = exhibitions.find((exhibit) => exhibit.exhibitionId === id);
  if (!exhibition) return <div>Exhibition not found</div>;

  const handleRemove = (artworkId: string) => {
    removeArtwork(artworkId);
  };

  return (
    <div>
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
          {exhibition.artworks.map((artwork) => (
            <div key={artwork.id} className="border p-2 rounded hover:shadow">
              <img
                src={artwork.image?.imageURL}
                alt={
                  artwork.image?.altText ?? `Artwork titled ${artwork.title}`
                }
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
      )}
    </div>
  );
};
