import React from "react";
import { Artwork } from "../api/types";
import { Link } from "react-router-dom";
import { AddArtworkButton } from "./AddArtworkButton";
import placeholder from "../assets/mona-lisa-placeholder.png";

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
      ? "w-full h-[250px] object-cover rounded"
      : "w-[300px] h-full object-contain rounded";

  return (
    <div className="flex flex-col h-full">
      <Link
        to={`/artwork/${artwork.museumSource}/${artwork.id}`}
        className="flex flex-col h-full"
      >
        <img
          src={artwork.image?.imageURL || placeholder}
          alt={artwork.image?.altText || artwork.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholder;
          }}
          loading="lazy"
          className={imageClass}
        />
        <h2 className="items-center w-full font-sans mt-2 mb-4 line-clamp-2 min-h-[3rem]">
          {artwork.title || "Untitled"} by {artwork.artist || "Unknown"}
        </h2>
      </Link>
      <div className="flex justify-end">
        <AddArtworkButton artwork={artwork} variant="icon" />
      </div>
    </div>
  );
};
