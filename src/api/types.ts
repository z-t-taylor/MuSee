export interface Artwork {
  id: string;
  title: string;
  artist?: string;
  creationDate?: string;
  image: {
    imageURL: string;
    altText?: string;
    thumbnail?: string;
  };
  medium?: string;
  origin?: string;
  styles?: string | string[];
  classification?: string;
  description?: string;
  exhibitionHistory?: string;
  museumSource: "aic" | "met";
  museumLink?: string;
}
