import React from "react";
import { Artwork } from "../api/types";
import { Link } from "react-router-dom";
import { AddArtworkButton } from "./AddArtworkButton";

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
          alt={artwork.image?.altText || artwork.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "MuSee/public/mona-lisa placeholder.png";
          }}
          loading="lazy"
        />
        <h2>
          {artwork.title || "Untitled"} by {artwork.artist || "Unknown"}
        </h2>
      </Link>
      <AddArtworkButton artwork={artwork} variant="icon" />
    </div>
  );
};
