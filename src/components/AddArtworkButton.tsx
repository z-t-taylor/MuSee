import { UserExhibitionArtwork } from "../api/userExhibition";
import { userExhibitionStore } from "../store/exhibitionStore";

interface Props {
  artwork: UserExhibitionArtwork;
}

export const AddArtworkButton: React.FC<Props> = ({ artwork }) => {
  const addArtwork = userExhibitionStore((state) => state.addArtwork);
  const selectedArtworks = userExhibitionStore(
    (state) => state.selectedArtworks
  );
  const isAlreadyExhibited = selectedArtworks.some(
    (art) => art.id === artwork.id
  );

  return (
    <button
      onClick={() => addArtwork(artwork)}
      disabled={isAlreadyExhibited}
      className={`px-4 py-2 rounded ${
        isAlreadyExhibited
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 text-white"
      }`}
    >
      {isAlreadyExhibited ? "Added" : "Add to Exhibition"}
    </button>
  );
};
