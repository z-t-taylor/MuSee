import axios from "axios";
import pMap from "p-map";

import {
  adaptAICToArtwork,
  AICArtworkListResponse,
  AICSingleArtworkResponse,
} from "./aic";
import { Artwork } from "./types";
import { adaptMetToArtwork, MetAPIBaseResponse } from "./met";
import { checkImageExists } from "../util/checkImageExists";
import { filteredValidImages } from "../util/filteredValidImages";

export type ArtFilterType =
  | "all"
  | "paintings"
  | "prints"
  | "photographs"
  | "sculpture"
  | "ceramics"
  | "furniture";

export const aicQueries: Record<ArtFilterType, string> = {
  all: "",
  paintings: "Painting",
  photographs: "Photograph",
  sculpture: "Sculpture",
  prints: "Print",
  ceramics: "Ceramics",
  furniture: "Furniture",
} as const;

export const metQueries: Record<ArtFilterType, string> = {
  all: "",
  paintings: "paintings",
  prints: "prints",
  photographs: "photographs",
  sculpture: "sculpture",
  ceramics: "ceramics",
  furniture: "furniture",
} as const;

const apiAIC = axios.create({
  baseURL: "https://api.artic.edu/api/v1/artworks",
  timeout: 8000,
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
    const params = new URLSearchParams({
      "query[bool][must][][term][is_public_domain]": "true",
      "query[bool][must][][exists][field]": "image_id",
      fields: [
        "id",
        "title",
        "artist_display",
        "image_id",
        "date_display",
        "thumbnail",
        "category_titles",
        "department_title",
        "is_public_domain",
      ].join(","),
      limit: batchSize.toString(),
      offset: offset.toString(),
    });

    const response = await apiAIC.get<AICArtworkListResponse>("/search", {
      params,
    });

    const filteredData = response.data.data.filter(
      (artwork) => artwork.image_id && artwork.is_public_domain
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
      `/${id}?fields=id,title,artist_display,image_id,date_display,thumbnail,medium_display,description,place_of_origin,style_titles,exhibition_history,department_title,is_public_domain`
    );

    if ((response.status === 429 || response.status >= 500) && retries > 0) {
      return fetchSingleAICArtwork(id, retries - 1);
    }
    if (response.status === 403) {
      console.error("Forbidden access to image. Skipping this artwork.");
      return null;
    }
    if (!response.data.data.image_id || !response.data.data.is_public_domain)
      return null;

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
  limit: number = 20
): Promise<Artwork[]> => {
  try {
    const offset = (page - 1) * limit;

    const params = {
      q: query,
      "query[term][is_public_domain]": "true",
      fields: [
        "id",
        "title",
        "artist_display",
        "image_id",
        "date_display",
        "thumbnail",
        "medium_display",
        "category_titles",
        "is_public_domain",
      ].join(","),
      limit: limit.toString(),
      offset: offset.toString(),
    };

    const response = await apiAIC.get<AICArtworkListResponse>("/search", {
      params,
    });

    const filtered = response.data.data.filter(
      (artwork) =>
        artwork.image_id && artwork.thumbnail && artwork.is_public_domain
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
          return null;
        }
      })
    );

    const validArtworks = artworks.filter((art): art is Artwork => !!art);
    return validArtworks.slice(0, limit);
  } catch (error) {
    return [];
  }
};

const filterAICArtworks = async (
  type: ArtFilterType,
  page: number = 1,
  limit: number = 32,
  signal?: AbortSignal
): Promise<Artwork[]> => {
  try {
    const desiredLimit = limit;
    let validArtworks: Artwork[] = [];
    let currentPage = page;
    const batchSize = 48;

    while (validArtworks.length < desiredLimit) {
      if (signal?.aborted) {
        return [];
      }
      const offset = (currentPage - 1) * batchSize;
      const termValue = aicQueries[type];
      if (!termValue) break;

      const params = new URLSearchParams({
        "query[bool][must][][term][artwork_type_title.keyword]": termValue,
        "query[bool][must][][term][is_public_domain]": "true",
        "query[bool][must][][exists][field]": "image_id",
        fields: [
          "id",
          "title",
          "artist_display",
          "image_id",
          "thumbnail",
          "category_titles",
          "artwork_type_title",
          "medium_display",
          "date_display",
        ].join(","),
        limit: batchSize.toString(),
        offset: offset.toString(),
      });

      const response = await apiAIC.get<AICArtworkListResponse>("/search", {
        params,
        signal,
      });

      const validated = await pMap(
        response.data.data,
        async (artwork): Promise<Artwork | null> => {
          if (!artwork.image_id || !artwork.thumbnail) return null;

          const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
          return (await checkImageExists(imageUrl))
            ? adaptAICToArtwork({
                ...artwork,
                style_titles: artwork.category_titles || [],
              })
            : null;
        },
        { concurrency: 5 }
      );

      const newValid = validated.filter((art): art is Artwork => !!art);
      validArtworks = [...validArtworks, ...newValid].slice(0, desiredLimit);

      currentPage++;

      if (
        response.data.data.length < batchSize ||
        validArtworks.length >= desiredLimit
      ) {
        break;
      }
    }
    return validArtworks.slice(0, desiredLimit);
  } catch (error) {
    return [];
  }
};

const apiMet = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
  timeout: 8000,
});

const fetchMetArtworkList = async (
  type: keyof typeof metQueries = "paintings"
): Promise<Artwork[]> => {
  try {
    const { data: searchData } = await apiMet.get<MetAPIBaseResponse>(
      "/search",
      {
        params: {
          hasImages: true,
          q: metQueries[type],
        },
      }
    );

    if (!searchData.objectIDs?.length) return [];

    let validArtworks: Artwork[] = [];
    let currentIndex = 0;

    while (
      validArtworks.length < 32 &&
      currentIndex < searchData.objectIDs.length
    ) {
      const id = searchData.objectIDs[currentIndex];

      try {
        const { data: objectData } = await apiMet.get(`/objects/${id}`);

        if (
          objectData?.isPublicDomain &&
          objectData?.primaryImage &&
          objectData?.message !== "Not a valid object"
        ) {
          validArtworks.push(adaptMetToArtwork(objectData));
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.error("Met artwork not found (404). Skipping this artwork.");
          return [];
        }
      }

      currentIndex++;
    }

    return await filteredValidImages(
      validArtworks,
      (artwork) => artwork.image.imageURL
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error("Met artwork not found (404). Skipping this artwork.");
      return [];
    }
    return [];
  }
};

const fetchSingleMetArtwork = async (id: string): Promise<Artwork | null> => {
  try {
    const { data } = await apiMet.get(`/objects/${id}`);
    if (data?.isPublicDomain && data?.primaryImage) {
      return adaptMetToArtwork(data);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const searchMetArtworks = async (query: string): Promise<Artwork[]> => {
  try {
    const { data: searchData } = await apiMet.get<MetAPIBaseResponse>(
      `/search?hasImages=true&q=${query}`
    );

    if (!searchData.objectIDs?.length) return [];

    const artworks = await Promise.all(
      searchData.objectIDs.slice(0, 20).map(async (id) => {
        try {
          const { data } = await apiMet.get(`/objects/${id}`);

          return data?.isPublicDomain && data?.primaryImage
            ? adaptMetToArtwork(data)
            : null;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.error(
              "Met artwork not found (404). Skipping this artwork."
            );
            return [];
          }
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
    return [];
  }
};

const filterMetArtworks = async (type: ArtFilterType): Promise<Artwork[]> => {
  try {
    const { data: searchData } = await apiMet.get<MetAPIBaseResponse>(
      "/search",
      { params: { hasImages: true, q: metQueries[type] } }
    );
    if (!searchData.objectIDs?.length) return [];

    const batchSize = 5;
    const allArtworks: Artwork[] = [];
    let currentIndex = 0;

    while (
      allArtworks.length < 32 &&
      currentIndex < searchData.objectIDs.length
    ) {
      const batch = searchData.objectIDs.slice(
        currentIndex,
        currentIndex + batchSize
      );

      const batchData = await Promise.all(
        batch.map(async (id) => {
          try {
            const { data } = await apiMet.get(`/objects/${id}`);
            return data;
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              console.error(
                "Met artwork not found (404). Skipping this artwork."
              );
              return [];
            }
            return null;
          }
        })
      );

      for (const art of batchData) {
        if (
          art &&
          art.isPublicDomain &&
          art.primaryImage &&
          art.classification
            ?.toLowerCase()
            .includes(metQueries[type].toLowerCase())
        ) {
          allArtworks.push(adaptMetToArtwork(art));
        }
        if (allArtworks.length >= 32) break;
      }

      currentIndex += batchSize;
    }
    return await filteredValidImages(allArtworks, (art) => art.image.imageURL);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error("Met artwork not found (404). Skipping this artwork.");
      return [];
    }
    return [];
  }
};

export const fetchArtworkById = async (
  museumSource: string,
  id: string
): Promise<Artwork | null> => {
  if (museumSource === "aic") {
    return fetchSingleAICArtwork(id);
  } else if (museumSource === "met") {
    return fetchSingleMetArtwork(id);
  } else {
    throw new Error(`Unknown museumSource: ${museumSource}`);
  }
};

export const fetchAllArtworks = async (): Promise<Artwork[]> => {
  const [aicResults, metResults] = await Promise.all([
    fetchAICArtworkList(),
    fetchMetArtworkList(),
  ]);
  const merged: Artwork[] = [];
  const unique = new Set<string>();

  for (const art of [...aicResults, ...metResults]) {
    if (!unique.has(art.id)) {
      unique.add(art.id);
      merged.push(art);
    }
  }
  return merged;
};

export const searchAllArtworks = async (query: string): Promise<Artwork[]> => {
  const [aicResults, metResults] = await Promise.all([
    searchAICArtworks(query),
    searchMetArtworks(query),
  ]);

  const merged: Artwork[] = [];
  const unique = new Set<string>();

  for (const art of [...aicResults, ...metResults]) {
    if (!unique.has(art.id)) {
      unique.add(art.id);
      merged.push(art);
    }
  }
  return merged;
};

export const filterAllArtworks = async (
  type: ArtFilterType
): Promise<Artwork[]> => {
  try {
    const [aicResults, metResults] = await Promise.all([
      filterAICArtworks(type),
      filterMetArtworks(type),
    ]);

    const unique = new Set<string>();
    const merged: Artwork[] = [];

    for (const art of [...aicResults, ...metResults]) {
      if (!unique.has(art.id)) {
        unique.add(art.id);
        merged.push(art);
      }
    }

    return merged;
  } catch (error) {
    return [];
  }
};
