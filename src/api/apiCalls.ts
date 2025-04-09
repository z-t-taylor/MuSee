import axios from "axios";
import { adaptAICToArtwork, AICArtworkListResponse } from "./aic";
import { Artwork } from "./types";
import { adaptMetToArtwork, MetAPIBaseResponse } from "./met";

const apiAIC = axios.create({
  baseURL: "https://api.artic.edu/api/v1/artworks",
});

export const fetchAICArtworkList = async (
  page: number = 1,
  limit: number = 10
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

export const fetchMetArtworkList = async (): Promise<Artwork[]> => {
  const { data: baseData } = await apiMet.get<MetAPIBaseResponse>("/objects");
  const publicDomainIDs = baseData.objectIDs.slice(0, 10);

  const artworks = await Promise.all(
    publicDomainIDs.map(async (id: number) => {
      const { data } = await apiMet.get(`/object/${id}`);
      return data.isPublicDomain ? adaptMetToArtwork(data) : null;
    })
  );
  return artworks.filter((art): art is Artwork => art !== null);
};

export const fetchAllArtworks = async (): Promise<Artwork[]> => {
  const [aic, met] = await Promise.all([
    fetchAICArtworkList(),
    fetchMetArtworkList(),
  ]);
  return [...aic, ...met];
};
