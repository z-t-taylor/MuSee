import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
}

interface CacheStore {
  cache: Record<string, CacheEntry>;
  setCache: <T>(key: string, data: T) => void;
  getCache: <T>(ket: string) => CacheEntry<T> | undefined;
  clearCache: (key: string) => void;
}

export const useCacheStore = create<CacheStore>()(
  persist(
    (set, get) => ({
      cache: {},
      setCache: (key, data) =>
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: { data, timestamp: Date.now() },
          },
        })),
      getCache: (key) => get().cache[key],
      clearCache: (key) => {
        set((state) => {
          const { [key]: _, ...rest } = state.cache;
          return { cache: rest };
        });
      },
    }),
    {
      name: "zustand-cache-store",
      partialize: (state) => ({ cache: state.cache }),
    }
  )
);
