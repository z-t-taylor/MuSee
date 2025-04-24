import React from "react";
import { UserExhibition } from "../api/userExhibition";
import { userExhibitionStore } from "../store/exhibitionStore";
import { Link } from "react-router-dom";

interface ExhibitionCardProps {
  exhibition: UserExhibition;
}
export const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  exhibition,
}) => {
  const removeExhibition = userExhibitionStore(
    (state) => state.removeExhibition
  );
  const firstArtwork = exhibition.artworks[0];
  console.log("Artworks in exhibition:", exhibition.artworks);

  const handleRemove = (exhibitionId: string) => {
    removeExhibition(exhibitionId);
  };

  return (
    <div>
      <Link to={`/exhibitions/${exhibition.exhibitionId}`}>
        {firstArtwork?.image?.imageURL && (
          <img
            className="w-full h-48 object-cover"
            src={firstArtwork.image.imageURL}
            alt={firstArtwork.image.altText || firstArtwork.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "MuSee/public/mona-lisa placeholder.png";
            }}
          />
        )}
        <h2>{exhibition.title}</h2>
        {exhibition.description && <p>{exhibition.description}</p>}
      </Link>
      <button
        onClick={() => {
          handleRemove(exhibition.exhibitionId);
        }}
        className="text-gray-600 hover:text-red-500"
      >
        Delete
      </button>
    </div>
  );
};

export default ExhibitionCard;
