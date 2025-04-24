import React from "react";
import { Artwork } from "../api/types";
import { Link } from "react-router-dom";
import { AddArtworkButton } from "./AddArtworkButton";

interface ArtworkCardProps {
  artwork: Artwork;
  viewMode: "grid" | "list";
}
export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  viewMode,
}) => {
  const imageClass =
    viewMode === "grid"
      ? "w-full h-[300px] object-cover rounded"
      : "w-[300px] h-[300px] object-contain rounded";

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
          className={imageClass}
        />
        <h2 className="items-center w-[300px]">
          {artwork.title || "Untitled"} by {artwork.artist || "Unknown"}
        </h2>
      </Link>
      <div className="flex justify-end pt-2">
        <AddArtworkButton artwork={artwork} variant="icon" />
      </div>
    </div>
  );
};
