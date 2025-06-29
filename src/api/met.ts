import { Artwork } from "./types";

export interface MetAPIBaseResponse {
  objectIDs: number[] | null;
}

interface MetSingleArtworkResponse {
  objectID: number;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  objectDate: string;
  artistNationality: string;
  country?: string;
  culture?: string;
  medium: string;
  classification: string;
  objectURL: string;
}

export const adaptMetToArtwork = (item: MetSingleArtworkResponse): Artwork => ({
  id: item.objectID.toString(),
  title: item.title,
  artist: item.artistDisplayName,
  creationDate: item.objectDate,
  image: {
    imageURL: item.primaryImage || item.primaryImageSmall,
    altText: `${item.title} by ${item.artistDisplayName}`,
    thumbnail: item.primaryImageSmall,
  },
  medium: item.medium,
  origin: item.culture || item.country || item.artistNationality,
  styles: item.classification,
  classification: item.classification,
  description: item.artistDisplayBio || undefined,
  exhibitionHistory: undefined,
  museumSource: "met",
  museumLink: item.objectURL,
});
