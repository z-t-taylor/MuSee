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

const fetchAICArtworkList = async (
  page: number = 1,
  limit: number = 32
): Promise<Artwork[]> => {
  const desiredLimit = limit;
  let validArtworks: Artwork[] = [];
  let currentPage = page;
  const batchSize = 48;

  while (validArtworks.length < desiredLimit) {
    const offset = (currentPage - 1) * batchSize;
    const response = await apiAIC.get<AICArtworkListResponse>(
      `/?limit=${batchSize}&offset=${offset}&fields=id,title,artist_display,image_id,date_display,thumbnail,category_titles,department_title`
    );

    const filteredData = response.data.data.filter(
      (artwork) => artwork.image_id !== null && artwork.image_id !== ""
    );

    const artworkPromises = filteredData.map((artwork) =>
      fetchSingleAICArtwork(artwork.id.toString())
    );
    const results = await Promise.all(artworkPromises);

    for (const artwork of results) {
      if (validArtworks.length >= desiredLimit) break;
      if (artwork) validArtworks.push(artwork);
    }

    currentPage++;

    if (response.data.data.length < batchSize) break;
  }

  return validArtworks.slice(0, desiredLimit);
};

const fetchSingleAICArtwork = async (
  id: string,
  retries: number = 3
): Promise<Artwork | null> => {
  try {
    const response = await apiAIC.get<AICSingleArtworkResponse>(
      `/${id}?fields=id,title,artist_display,image_id,date_display,thumbnail,medium_display,description,place_of_origin,style_titles,exhibition_history,department_title`
    );

    if (response.status === 403 && retries > 0) {
      return fetchSingleAICArtwork(id, retries - 1);
    }

    if (!response.data.data.image_id) return null;

    const imageUrl = `https://www.artic.edu/iiif/2/${response.data.data.image_id}/full/843,/0/default.jpg`;
    const imageExists = await checkImageExists(imageUrl);

    return imageExists ? adaptAICToArtwork(response.data.data) : null;
  } catch (error) {
    return null;
  }
};

const searchAICArtworks = async (
  query: string,
  page: number = 1,
  limit: number = 96
): Promise<Artwork[]> => {
  try {
    const offset = (page - 1) * limit;
    const response = await apiAIC.get<AICArtworkListResponse>("/search", {
      params: {
        q: query,
        fields:
          "id,title,artist_display,image_id,date_display,thumbnail,medium_display,category_titles",
        limit,
        offset,
      },
    });

    const filtered = response.data.data.filter(
      (artwork) => artwork.image_id && artwork.thumbnail
    );

    const artworks = await Promise.all(
      filtered.map(async (artwork) => {
        try {
          const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
          const imageExists = await checkImageExists(imageUrl);

          return imageExists
            ? adaptAICToArtwork({
                ...artwork,
                style_titles: artwork.category_titles || [],
              })
            : null;
        } catch (error) {
          console.error(`Error processing artwork ${artwork.id}:`, error);
          return null;
        }
      })
    );

    const validArtworks = artworks.filter(
      (art): art is Artwork => art !== null
    );
    return validArtworks.slice(0, limit);
  } catch (error) {
    console.error("AIC Search Error Details:", {
      error: error instanceof Error ? error.message : "Unknown error",
      query,
      page,
      limit,
    });
    return [];
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

    let artworks: (Artwork | null)[] = [];
    let totalValidArtworks = 0;
    let currentIndex = 0;

    while (
      totalValidArtworks < 32 &&
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
    const response = await apiMet.get<MetAPIBaseResponse>(
      `/search?hasImages=true&q=${query}`
    );

    if (!response.data.objectIDs?.length) return [];

    const artworks = await Promise.all(
      response.data.objectIDs.slice(0, 96).map(async (id) => {
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
