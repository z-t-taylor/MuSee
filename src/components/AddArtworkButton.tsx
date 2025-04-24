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
            ? `px-4 py-2 rounded ${
                isAlreadyExhibited
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`
            : `p-2 rounded-full ${
                isAlreadyExhibited
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-blue-50"
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
          <p>+</p>
        )}
      </button>
      <ExhibitionSelectionModel
        show={showModal}
        artworkTitle={artwork.title}
        onAddToExhibition={handleAdd}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};
