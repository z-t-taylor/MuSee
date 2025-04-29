import { useState } from "react";
import { userExhibitionStore } from "../store/exhibitionStore";

interface ModalProps {
  show: boolean;
  artworkTitle: string;
  onAddToExhibition: (exhibitionId?: string) => void;
  onCancel: () => void;
}

export const ExhibitionSelectionModel: React.FC<ModalProps> = ({
  show,
  artworkTitle,
  onAddToExhibition,
  onCancel,
}) => {
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  const createExhibition = userExhibitionStore(
    (state) => state.createExhibition
  );
  const [newExhibitionName, setNewExhibitionName] = useState("");
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string>();

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold font-sans mb-4">
          Add "{artworkTitle}"
        </h2>

        <div className="space-y-4">
          {exhibitions.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Add to existing exhibition:</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {exhibitions.map((exhibition) => (
                  <li key={exhibition.exhibitionId}>
                    <button
                      onClick={() =>
                        setSelectedExhibitionId(exhibition.exhibitionId)
                      }
                      className={`w-full text-left p-2 rounded ${
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

          <div>
            <h3 className="font-medium mb-2">
              {exhibitions.length > 0
                ? "Or create new exhibition"
                : "Create new exhibition"}
            </h3>
            <input
              type="text"
              placeholder="Exhibition name"
              value={newExhibitionName}
              onChange={(e) => {
                setNewExhibitionName(e.target.value);
                setSelectedExhibitionId(undefined);
              }}
              className="w-full p-2 border rounded"
              aria-label="Enter name for new exhibition"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (newExhibitionName) {
                const exhibition = createExhibition(newExhibitionName);
                onAddToExhibition(exhibition.exhibitionId);
              } else if (selectedExhibitionId) {
                onAddToExhibition(selectedExhibitionId);
              }
            }}
            disabled={!newExhibitionName && !selectedExhibitionId}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
            aria-label="Confirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
