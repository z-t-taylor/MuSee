import axios from "axios";
import {
  adaptAICToArtwork,
  AICArtworkListResponse,
  AICSingleArtworkResponse,
} from "./aic";
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

  const artworks = await Promise.all(
    response.data.data.map((artwork) =>
      fetchSingleAICArtwork(artwork.id.toString())
    )
  );
  return artworks.filter((art): art is Artwork => art !== null);
};

const fetchSingleAICArtwork = async (id: string): Promise<Artwork | null> => {
  try {
    const response = await apiAIC.get<AICSingleArtworkResponse>(
      `/${id}?fields=id,title,artist_display,image_id,date_display,thumbnail,medium_display,description,place_of_origin,style_titles,exhibition_history `
    );

    const data = response.data.data;

    const formattedStyles = Array.isArray(data.style_titles)
      ? data.style_titles.join(", ")
      : data.style_titles;

    return adaptAICToArtwork({ ...data, style_titles: formattedStyles });
  } catch (error) {
    console.log(`Error: ${error}`);
    return null;
  }
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
