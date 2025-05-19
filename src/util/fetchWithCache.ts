import { useCacheStore } from "../store/cacheStore";

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheDuration = DEFAULT_CACHE_DURATION
): Promise<T> {
  const cacheEntry = useCacheStore.getState().getCache<T>(key);

  if (cacheEntry) {
    const isFresh = Date.now() - cacheEntry.timestamp < cacheDuration;
    if (isFresh) return cacheEntry.data;
  }

  const data = await fetcher();
  useCacheStore.getState().setCache(key, data);
  return data;
}
