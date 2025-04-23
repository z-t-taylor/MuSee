import React from "react";
import { UserExhibition } from "../api/userExhibition";
import { Link } from "react-router-dom";

interface ExhibitionCardProps {
  exhibition: UserExhibition;
}
export const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  exhibition,
}) => {
  const firstArtwork = exhibition.artworks[0];

  return (
    <div>
      <Link to={`/exhibitions/${exhibition.exhibitionId}`}>
        {firstArtwork?.image?.imageURL && (
          <img
            src={firstArtwork.image.imageURL}
            alt={firstArtwork.image.altText || firstArtwork.title}
          />
        )}
        <h2>{exhibition.title}</h2>
        {exhibition.description && <p>{exhibition.description}</p>}
      </Link>
    </div>
  );
};

export default ExhibitionCard;
