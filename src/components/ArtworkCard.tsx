import React from "react";
import { Artwork } from "../api/types";

interface ArtworkCardProps {
  artwork: Artwork;
}
export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  return (
    <div className="artwork-card">
      <img
        src={artwork.image?.imageURL}
        alt={artwork.image?.alt_text || artwork.title}
        loading="lazy"
      />
      <h2>{artwork.title}</h2>
      <h3>{artwork.artist}</h3>
    </div>
  );
};
