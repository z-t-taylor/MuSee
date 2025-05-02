import { Artwork } from "./types";

interface AICArtworkBaseResponse {
  id: number;
  title: string;
  artist_display: string | undefined;
  thumbnail?: {
    lqip?: string;
    alt_text?: string;
  };
  image_id: string;
  date_display: string | undefined;
  category_titles?: string[];
  department_title?: string | string[];
  classification_title?: string;
}

export interface AICSingleArtworkResponse {
  data: AICArtworkBaseResponse & {
    place_of_origin?: string;
    main_reference_number: string;
    description?: string;
    medium_display?: string;
    style_titles?: string | string[];
    exhibition_history?: string;
  };
}

export interface AICArtworkListResponse {
  data: AICArtworkBaseResponse[];
  pagination: {
    limit: number;
    offset: number;
    current_page: number;
    total_pages: number;
    previous_url: string;
    next_url: string;
  };
}

export const adaptAICToArtwork = (
  item: AICArtworkBaseResponse & Partial<AICSingleArtworkResponse["data"]>
): Artwork => ({
  id: item.id.toString(),
  title: item.title,
  artist: item.artist_display || undefined,
  creationDate: item.date_display || undefined,
  image: {
    imageURL: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
    altText: item.thumbnail?.alt_text ?? item.title,
    thumbnail: item.thumbnail?.lqip,
  },
  medium: item.medium_display,
  origin: item.place_of_origin,
  styles:
    item.style_titles || item.classification_title || item.department_title,
  description: item.description,
  exhibitionHistory: item.exhibition_history,
  museumSource: "aic",
  museumLink: `https://www.artic.edu/artworks/${item.id}`,
});
