import React from "react";
import { UserExhibition } from "../api/userExhibition";
import { userExhibitionStore } from "../store/exhibitionStore";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const handleRemove = (exhibitionId: string) => {
    removeExhibition(exhibitionId);
  };

  return (
    <div className="flex flex-col items-center gap-4 border rounded pt-1 pb-3 px-4 text-center">
      <Link
        to={`/exhibitions/${exhibition.slug}`}
        className="w-full"
        aria-label={`select ${exhibition.title} exhibition`}
      >
        {firstArtwork?.image?.imageURL && (
          <div>
            <img
              className="w-full h-[40vh] object-cover rounded"
              src={firstArtwork.image.imageURL}
              alt={firstArtwork.image.altText || firstArtwork.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "MuSee/public/mona-lisa placeholder.png";
              }}
            />
          </div>
        )}
        <div className="flex justify-start mt-2 px-2">
          <h2 className="text-md font-semibold hover:underline">
            {exhibition.title}
          </h2>
        </div>
      </Link>
      <div className="w-full flex justify-end mt-2">
        <button
          onClick={() => {
            handleRemove(exhibition.exhibitionId);
          }}
          aria-label="Remove exhibition"
          className="text-gray-600 hover:bg-blue-50 hover:text-black border hover:border-0 px-3 py-1 rounded-xl transition-colors"
        >
          <DeleteIcon className="text-red-500" />
        </button>
      </div>
    </div>
  );
};
