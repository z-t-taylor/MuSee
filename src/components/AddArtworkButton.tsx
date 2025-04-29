import { useState } from "react";
import { userExhibitionStore } from "../store/exhibitionStore";
import { ExhibitionSelectionModel } from "./ExhibitionSelectionModal";
import { Artwork } from "../api/types";

interface Props {
  artwork: Artwork;
  variant?: "button" | "icon";
}

export const AddArtworkButton: React.FC<Props> = ({
  artwork,
  variant = "button",
}) => {
  const [showModal, setShowModal] = useState(false);
  const addArtwork = userExhibitionStore((state) => state.addArtwork);
  const selectedArtworks = userExhibitionStore(
    (state) => state.selectedArtworks
  );
  const isAlreadyExhibited = selectedArtworks.some(
    (art) => art.id === artwork.id
  );

  const handleAdd = (exhibitionId?: string) => {
    const artworkWithDate = {
      ...artwork,
      addedAt: new Date().toISOString(),
    };
    addArtwork(artworkWithDate, exhibitionId);
    console.log(
      "Store exhibitions after add:",
      userExhibitionStore.getState().exhibitions
    );
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => (isAlreadyExhibited ? null : setShowModal(true))}
        disabled={isAlreadyExhibited}
        className={
          variant === "button"
            ? `px-4 py-2 rounded-xl border ${
                isAlreadyExhibited
                  ? "bg-gray-400 cursor-not-allowed border-transparent"
                  : "text-[#195183] border-[#195183] hover:bg-[#195183] hover:text-white"
              }`
            : `p-2 rounded-full border ${
                isAlreadyExhibited
                  ? "text-gray-400"
                  : "text-[#195183] border-[#195183] hover:bg-blue-50"
              }`
        }
        aria-label={
          isAlreadyExhibited ? "Artwork already added" : "Add to exhibition"
        }
      >
        {variant === "button" ? (
          isAlreadyExhibited ? (
            "Added"
          ) : (
            "Add to Exhibition"
          )
        ) : (
          <div>
            <p
              className="text-[#195183] pl-2 pr-2 text-sm"
              aria-label="Add artwork to exhibition"
            >
              Add +
            </p>
          </div>
        )}
      </button>
      <ExhibitionSelectionModel
        show={showModal}
        artworkTitle={artwork.title}
        artworkImage={artwork.image.imageURL}
        artworkImageAlt={artwork.image.altText || artwork.title}
        onAddToExhibition={handleAdd}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};
