import { useState } from "react";
import { userExhibitionStore } from "../store/exhibitionStore";

interface ModalProps {
  show: boolean;
  artworkTitle: string;
  artworkImage: string;
  artworkImageAlt: string;
  onAddToExhibition: (exhibitionId?: string) => void;
  onCancel: () => void;
}

export const ExhibitionSelectionModal: React.FC<ModalProps> = ({
  show,
  artworkTitle,
  artworkImage,
  artworkImageAlt,
  onAddToExhibition,
  onCancel,
}) => {
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  const createExhibition = userExhibitionStore(
    (state) => state.createExhibition
  );
  const [newExhibitionName, setNewExhibitionName] = useState("");
  const [newExhibitionDescription, setNewExhibitionDescription] = useState("");
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string>();

  if (!show) return null;

  return (
    <div className="fixed inset-0 p-4 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 pb-0 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-center">
          <img
            src={artworkImage}
            alt={artworkImageAlt}
            className="w-[60%] rounded-xl mb-2"
          />
        </div>
        <h2 className="text-base font-bold font-sans">Add: </h2>
        <h3 className="text-xl font-semibold font-sans mb-4 italic">
          {artworkTitle}
        </h3>

        <div className="space-y-4">
          {exhibitions.length > 0 && (
            <div className="border rounded-xl p-4">
              <h3 className="font-medium mb-2">To existing exhibition:</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {exhibitions.map((exhibition) => (
                  <li key={exhibition.exhibitionId}>
                    <button
                      onClick={() =>
                        setSelectedExhibitionId(exhibition.exhibitionId)
                      }
                      className={`w-full text-left pl-4 p-2 border rounded-xl ${
                        selectedExhibitionId === exhibition.exhibitionId
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {exhibition.title} ({exhibition.artworks.length}{" "}
                      {exhibition.artworks.length === 1
                        ? "artwork"
                        : "artworks"}
                      )
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border rounded-xl p-4">
            <h3 className="font-medium mb-3">
              {exhibitions.length > 0
                ? "Or create new exhibition:"
                : "Create new exhibition:"}
            </h3>
            <input
              type="text"
              name="selection-modal"
              placeholder="Exhibition name (required)"
              value={newExhibitionName}
              onChange={(e) => {
                setNewExhibitionName(e.target.value);
                setSelectedExhibitionId(undefined);
              }}
              className="w-full p-2 border rounded-xl"
              aria-label="Enter name for new exhibition"
              required
            />
            <div>
              <textarea
                placeholder="Exhibition description (optional)"
                value={newExhibitionDescription}
                maxLength={300}
                onChange={(e) => {
                  setNewExhibitionDescription(e.target.value);
                  setSelectedExhibitionId(undefined);
                }}
                className="w-full p-2 border rounded-xl min-h-[150px] text-sm font-sans mt-1"
                aria-label="Enter optional description for new exhibition"
              />
              <div
                className={`text-sm mt-1 ${
                  newExhibitionDescription.length >= 300
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
                Characters: {newExhibitionDescription.length}/300
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 border-t bg-white pt-2 pb-6 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border hover:bg-gray-100 rounded-xl"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (newExhibitionName) {
                  const exhibition = createExhibition(
                    newExhibitionName,
                    newExhibitionDescription
                  );
                  onAddToExhibition(exhibition.exhibitionId);
                } else if (selectedExhibitionId) {
                  onAddToExhibition(selectedExhibitionId);
                }
              }}
              disabled={!newExhibitionName && !selectedExhibitionId}
              className="px-4 py-2 bg-[#195183] text-white rounded-xl disabled:bg-gray-300"
              aria-label="Confirm"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
