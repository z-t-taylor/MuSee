import { useState } from "react";
import { userExhibitionStore } from "../store/exhibitionStore";
import { ExhibitionSelectionModal } from "./ExhibitionSelectionModal";
import { Artwork } from "../api/types";
import { UserExhibitionArtwork } from "../api/userExhibition";

interface Props {
  artwork: Artwork;
  variant?: "button" | "icon";
}

export const AddArtworkButton: React.FC<Props> = ({
  artwork,
  variant = "button",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const addArtwork = userExhibitionStore((state) => state.addArtwork);
  const exhibitions = userExhibitionStore((state) => state.exhibitions);

  const handleAdd = (exhibitionId?: string) => {
    if (!exhibitionId) return;

    const artworkWithDate: UserExhibitionArtwork = {
      ...artwork,
      addedAt: new Date().toISOString(),
    };
    const targetExhibition = exhibitions.find(
      (exhibit) => exhibit.exhibitionId === exhibitionId
    );

    if (targetExhibition?.artworks.some((a) => a.id === artwork.id)) {
      setErrorMessage("This artwork is already in this exhibition");
      setShowModal(false);
      return;
    }

    addArtwork(artworkWithDate, exhibitionId);
    setShowModal(false);
  };

  return (
    <>
      {errorMessage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-label="alert box"
        >
          <div className="bg-white py-6 px-8 rounded-xl max-w-md mx-4 flex flex-col">
            <p className="text-black mb-4 flex-1">{errorMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setErrorMessage(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                aria-label="OK"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowModal(true)}
        className={
          variant === "button"
            ? "px-4 py-2 rounded-xl border text-[#195183] border-[#195183] hover:bg-[#195183] hover:text-white"
            : "p-2 rounded-full border text-[#195183] border-[#195183] hover:bg-blue-50"
        }
        aria-label="Add to exhibition"
      >
        {variant === "button" ? (
          "Add to Exhibition"
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
      <ExhibitionSelectionModal
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
