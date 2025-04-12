import React from "react";
import { Artwork } from "../api/types";
import { Link } from "react-router-dom";

interface ArtworkCardProps {
  artwork: Artwork;
}
export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  return (
    <div className="artwork-card">
      <Link
        to={`/artwork/${artwork.museumSource}/${artwork.id}`}
        className="artwork-link"
      >
        <img
          src={artwork.image?.imageURL}
          alt={artwork.image?.alt_text || artwork.title}
          loading="lazy"
        />
        <h2>{artwork.title}</h2>
      </Link>
    </div>
  );
};
