export interface Artwork {
  id: string;
  title: string;
  artist?: string;
  creationDate?: string;
  image?: {
    imageURL?: string;
    alt_text?: string;
    thumbnail?: string;
  };
  medium?: string;
  origin?: string;
  styles?: Array<string>;
  description?: string;
  exhibition_history?: string;
  museumSource: "aic" | "rijksmuseum" | "smithsonian";
  museumLink?: string;
}
