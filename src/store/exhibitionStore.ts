import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserExhibitionArtwork } from "../api/userExhibition";

interface Exhibition {
  id: string;
  name: string;
  artworks: UserExhibitionArtwork[];
  createdAt: Date;
}

interface ExhibitionStore {
  exhibitions: Exhibition[];
  selectedArtworks: UserExhibitionArtwork[];
  addArtwork: (artwork: UserExhibitionArtwork, exhibitionId?: string) => void;
  removeArtwork: (id: string) => void;
  createExhibition: (name: string) => Exhibition;
}

export const userExhibitionStore = create<ExhibitionStore>()(
  persist(
    (set, get) => ({
      exhibitions: [],
      selectedArtworks: [],
      addArtwork: (artwork, exhibitionId) => {
        if (exhibitionId) {
          set({
            exhibitions: get().exhibitions.map((exhibition) =>
              exhibition.id === exhibitionId
                ? { ...exhibition, artworks: [...exhibition.artworks, artwork] }
                : exhibition
            ),
          });
        } else {
          set({ selectedArtworks: [...get().selectedArtworks, artwork] });
        }
      },
      removeArtwork: (id) =>
        set({
          selectedArtworks: get().selectedArtworks.filter(
            (art) => art.id !== id
          ),
          exhibitions: get().exhibitions.map((ex) => ({
            ...ex,
            artworks: ex.artworks.filter((art) => art.id !== id),
          })),
        }),
      createExhibition: (name) => {
        const newExhibition: Exhibition = {
          id: crypto.randomUUID(),
          name,
          artworks: [],
          createdAt: new Date(),
        };
        set({ exhibitions: [...get().exhibitions, newExhibition] });
        return newExhibition;
      },
    }),
    {
      name: "exhibition-storage",
      partialize: (state) => ({
        exhibitions: state.exhibitions,
        selectedArtworks: state.selectedArtworks,
      }),
    }
  )
);
