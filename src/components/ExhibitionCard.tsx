import { useState } from "react";
import { UserExhibition } from "../api/userExhibition";
import { userExhibitionStore } from "../store/exhibitionStore";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import placeholder from "../assets/mona-lisa-placeholder.png";

interface ExhibitionCardProps {
  exhibition: UserExhibition;
}
export const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  exhibition,
}) => {
  const removeExhibition = userExhibitionStore(
    (state) => state.removeExhibition
  );
  const [confirmDeleteExhibit, setConfirmDeleteExhibit] = useState(false);
  const firstArtwork = exhibition.artworks[0];

  const handleRemove = (exhibitionId: string) => {
    removeExhibition(exhibitionId);
  };

  return (
    <div className="relative flex flex-col items-center gap-4 border rounded-xl py-3 px-4 pb-8">
      <Link
        to={`/exhibitions/${exhibition.slug}`}
        aria-label={`select ${exhibition.title} exhibition`}
      >
        {firstArtwork?.image?.imageURL && (
          <div>
            <img
              src={firstArtwork.image.imageURL || placeholder}
              alt={firstArtwork.image.altText || firstArtwork.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }}
              loading="lazy"
              className="w-full md:w-[20vw] h-full md:h-[50vh] object-cover rounded"
            />
          </div>
        )}
        <div className="flex justify-start mt-1 md:mt-2 px-2 pb-8">
          <h2 className="text-start text-sm md:text-md font-semibold hover:underline hover:italic break-words">
            {exhibition.title}
          </h2>
        </div>
      </Link>
      <div className="absolute bottom-2 right-4">
        <button
          onClick={() => {
            setConfirmDeleteExhibit(true);
          }}
          aria-label="Remove exhibition"
          className="text-gray-600 hover:bg-blue-50 hover:text-black border hover:border-0 px-3 py-1 rounded-xl transition-colors"
        >
          <DeleteIcon className="text-red-500" />
        </button>
        <ConfirmDeleteModal
          open={confirmDeleteExhibit}
          title="Delete exhibition?"
          description={`This will permanently remove “${exhibition.title}”. Are you sure?`}
          onCancel={() => setConfirmDeleteExhibit(false)}
          onConfirm={() => {
            handleRemove(exhibition.exhibitionId);
            setConfirmDeleteExhibit(false);
          }}
        />
      </div>
    </div>
  );
};
