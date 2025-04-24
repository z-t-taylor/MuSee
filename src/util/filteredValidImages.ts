import { Artwork } from "../api/types";
import { checkImageExists } from "./checkImageExists";

export const filteredValidImages = async <T extends Artwork>(
  artworks: T[],
  getImageUrl: (artwork: T) => string
): Promise<T[]> => {
  const check = await Promise.all(
    artworks.map((artwork) => checkImageExists(getImageUrl(artwork)))
  );
  return artworks.filter((_, i) => check[i]);
};
