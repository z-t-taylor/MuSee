import axios from "axios";
import {
  adaptAICToArtwork,
  AICArtworkListResponse,
  AICSingleArtworkResponse,
} from "./aic";
import { Artwork } from "./types";
import { adaptMetToArtwork, MetAPIBaseResponse } from "./met";
import { checkImageExists } from "../util/checkImageExists";
import { filteredValidImages } from "../util/filteredValidImages";

const apiAIC = axios.create({
  baseURL: "https://api.artic.edu/api/v1/artworks",
});

export const fetchAICArtworkList = async (
  page: number = 1,
  limit: number = 12
): Promise<Artwork[]> => {
  const offset = (page - 1) * limit;
  const response = await apiAIC.get<AICArtworkListResponse>(
    `/?limit=${limit}&offset=${offset}&fields=id,title,artist_display,image_id,date_display,thumbnail,category_titles`
  );

  const filteredData = response.data.data.filter(
    (artwork) => artwork.image_id !== null && artwork.image_id !== ""
  );

  const artworks = await Promise.all(
    filteredData.map((artwork) => fetchSingleAICArtwork(artwork.id.toString()))
  );
  const withImage = artworks.filter((art): art is Artwork => art !== null);
  return await filteredValidImages(
    withImage,
    (artwork) => artwork.image.imageURL
  );
};

const fetchSingleAICArtwork = async (id: string): Promise<Artwork | null> => {
  try {
    const response = await apiAIC.get<AICSingleArtworkResponse>(
      `/${id}?fields=id,title,artist_display,image_id,date_display,thumbnail,medium_display,description,place_of_origin,style_titles,exhibition_history `
    );

    const data = response.data.data;
    const imageUrl = `https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg`;

    const imageExists = await checkImageExists(imageUrl);
    if (!imageExists) {
      return null;
    }

    const formattedStyles = Array.isArray(data.style_titles)
      ? data.style_titles.join(", ")
      : data.style_titles;

    return adaptAICToArtwork({ ...data, style_titles: formattedStyles });
  } catch (error) {
    console.log(`Error: ${error}`);
    return null;
  }
};

const searchAICArtworks = async (
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<Artwork[]> => {
  const offset = (page - 1) * limit;
  const response = await apiAIC.get<AICArtworkListResponse>(
    `/search?q=${encodeURIComponent(
      query
    )}&fields=id,title,artist_display,image_id,date_display,category_titles,thumbnail&limit=${limit}&offset=${offset}`
  );

  if (!response.data.data.length) return [];

  const filtered = response.data.data.filter(
    (artwork) =>
      artwork.image_id !== null &&
      artwork.image_id !== "" &&
      artwork.category_titles?.includes("AIC Archives")
  );
  const artworks = await Promise.all(
    filtered.map((artwork) => fetchSingleAICArtwork(artwork.id.toString()))
  );
  const withImage = artworks.filter((art): art is Artwork => art !== null);
  return await filteredValidImages(
    withImage,
    (artwork) => artwork.image.imageURL
  );
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

    let artworks: (Artwork | null)[] = [];
    let totalValidArtworks = 0;
    let currentIndex = 0;

    while (
      totalValidArtworks < 12 &&
      currentIndex < searchData.objectIDs.length
    ) {
      const id = searchData.objectIDs[currentIndex];

      try {
        const { data } = await apiMet.get(`/objects/${id}`);

        if (data?.message === "Not a valid object") {
          artworks.push(null);
        } else if (data?.isPublicDomain && data?.primaryImage) {
          artworks.push(adaptMetToArtwork(data));
        } else {
          artworks.push(null);
        }
      } catch (error) {
        console.log(`Error fetching object ${id}: ${error}`);
        artworks.push(null);
      }

      currentIndex++;

      const validArtworks = artworks.filter(
        (art): art is Artwork => art !== null
      );
      totalValidArtworks = validArtworks.length;
    }

    const validArtworks = artworks.filter(
      (art): art is Artwork => art !== null
    );
    return await filteredValidImages(
      validArtworks,
      (artwork) => artwork.image.imageURL
    );
  } catch (error) {
    console.log(`Error: ${error}`);
    return [];
  }
};

const searchMetArtworks = async (query: string): Promise<Artwork[]> => {
  try {
    const res = await apiMet.get<MetAPIBaseResponse>(
      `/search?hasImages=true&q=${query}`
    );

    if (!res.data.objectIDs?.length) return [];

    const artworks = await Promise.all(
      res.data.objectIDs.slice(0, 12).map(async (id) => {
        try {
          const { data } = await apiMet.get(`/objects/${id}`);

          return data?.isPublicDomain && data?.primaryImage
            ? adaptMetToArtwork(data)
            : null;
        } catch (error) {
          return null;
        }
      })
    );

    const validArtworks = artworks.filter(
      (art): art is Artwork => art !== null
    );
    return await filteredValidImages(
      validArtworks,
      (artwork) => artwork.image.imageURL
    );
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

export const searchAllArtworks = async (query: string): Promise<Artwork[]> => {
  const [aic, met] = await Promise.all([
    searchAICArtworks(query),
    searchMetArtworks(query),
  ]);

  return [...aic, ...met];
};
