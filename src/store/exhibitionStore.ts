import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserExhibitionArtwork } from "../api/userExhibition";

interface ExhibitionStore {
  selectedArtworks: UserExhibitionArtwork[];
  addArtwork: (artwork: UserExhibitionArtwork) => void;
  removeArtwork: (id: string) => void;
}

export const userExhibitionStore = create<ExhibitionStore>()(
  persist(
    (set, get) => ({
      selectedArtworks: [],
      addArtwork: (artwork) =>
        set({ selectedArtworks: [...get().selectedArtworks, artwork] }),
      removeArtwork: (id) =>
        set({
          selectedArtworks: get().selectedArtworks.filter(
            (art) => art.id !== id
          ),
        }),
    }),
    { name: "exhibition-storage" }
  )
);
