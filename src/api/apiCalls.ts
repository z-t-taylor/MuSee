import axios from "axios";
import { adaptAICToArtwork, AICArtworkListResponse } from "./aic";
import { Artwork } from "./types";
import { adaptMetToArtwork, MetAPIBaseResponse } from "./met";

const apiAIC = axios.create({
  baseURL: "https://api.artic.edu/api/v1/artworks",
});

export const fetchAICArtworkList = async (
  page: number = 1,
  limit: number = 12
): Promise<Artwork[]> => {
  const offset = (page - 1) * limit;
  const response = await apiAIC.get<AICArtworkListResponse>(
    `/?limit=${limit}&offset=${offset}&fields=id,title,artist_display,image_id,date_display,thumbnail`
  );
  return response.data.data.map(adaptAICToArtwork);
};

export const fetchSingleAICArtwork = async (id: string) => {
  const response = await apiAIC.get(`/${id}`);
  return adaptAICToArtwork(response.data);
};

const apiMet = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
});

const metQueries = {
  paintings: "paintings",
  prints: "prints",
  sculptures: "sculpture",
  ceramics: "ceramics",
} as const;

export const fetchMetArtworkList = async (
  type: keyof typeof metQueries = "paintings"
): Promise<Artwork[]> => {
  try {
    const { data: searchData } = await apiMet.get<MetAPIBaseResponse>(
      `/search?hasImages=true&q=${metQueries[type]}`
    );

    if (!searchData.objectIDs?.length) return [];

    const artworks = await Promise.all(
      searchData.objectIDs.slice(0, 12).map(async (id) => {
        try {
          const { data } = await apiMet.get(`/objects/${id}`);

          if (data?.message === "Not a valid object") {
            return null;
          }

          return data?.isPublicDomain && data?.primaryImage
            ? adaptMetToArtwork(data)
            : null;
        } catch (error) {
          console.log(`Error: ${error}`);
          return null;
        }
      })
    );

    return artworks.filter((art): art is Artwork => art !== null);
  } catch (error) {
    console.log(`Error: ${error}`);
    return [];
  }
};

export const fetchAllArtworks = async (): Promise<Artwork[]> => {
  const [aic, met] = await Promise.all([
    fetchAICArtworkList(),
    fetchMetArtworkList(),
  ]);
  return [...aic, ...met];
};
