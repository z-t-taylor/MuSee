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
  return (
    <div
      className={`relative border p-4 rounded-xl hover:shadow ${
        viewMode === "list" ? "w-full md:w-[30%]" : "w-full"
      }`}
    >
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
          className="w-full h-[250px] object-cover rounded"
        />
        <h3 className="my-2 pb-12 font-bold text-start">
          {artwork.title || "Untitled"}
        </h3>
      </Link>
      <div className="absolute bottom-4 right-4 mt-1">
        <AddArtworkButton artwork={artwork} variant="icon" />
      </div>
    </div>
  );
};
