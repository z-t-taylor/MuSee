import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Artwork } from "../api/types";
import { fetchAllArtworks } from "../api/apiCalls";
import { AddArtworkButton } from "./AddArtworkButton";

interface ArtworkIDParams {
  [key: string]: string | undefined;
}

export const ArtworkSinglePage: React.FC = () => {
  const { museumSource, id } = useParams<ArtworkIDParams>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const artworks = await fetchAllArtworks();

        const foundArtwork = artworks.find(
          (art) => art.id === id && art.museumSource === museumSource
        );
        console.log(
          "Fetching artwork with ID:",
          id,
          "and Museum Source:",
          museumSource
        );
        setArtwork(foundArtwork || null);
      } catch (error) {
        setErr(error as Error);
      }
    };
    if (museumSource && id) {
      fetchArtwork();
    }
  }, [museumSource, id]);

  function decodeHTMLEntities(text: string) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  }

  return (
    <div className="artwork-single-page">
      {err ? (
        <p>Error: {err.message}</p>
      ) : !artwork ? (
        <p>Loading..</p>
      ) : (
        <>
          <h1>Title: {artwork.title}</h1>
          <img
            src={artwork.image?.imageURL}
            alt={artwork.image?.altText || artwork.title}
            loading="lazy"
          />
          <AddArtworkButton artwork={artwork} variant="button" />
          <h2>Artist: {artwork.artist || "Unknown"}</h2>
          <h3>Creation: {artwork.creationDate}</h3>
          <div>
            {artwork.description && (
              <div className="artwork-description">
                <p>About:</p>
                {artwork.description
                  .split("</p>")
                  .map((chunk) =>
                    chunk
                      .replace(/<p>/g, "")
                      .replace(/<em>/g, '"')
                      .replace(/<\/em>/g, '"')
                      .trim()
                  )
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p key={i}>{decodeHTMLEntities(paragraph)}</p>
                  ))}
              </div>
            )}
            <p>Medium: {artwork.medium}</p>
            <p>Culture: {artwork.origin || "Unknown"}</p>
            <p>Classification: {artwork.styles}</p>
            {artwork.exhibitionHistory && (
              <ul>
                Exhibition History:
                {artwork.exhibitionHistory
                  ?.split(/\n\n|;\s*/)
                  .map((history, i) => (
                    <li key={i}>
                      {history.trim()}
                      {!history.trim().endsWith(".") && "."}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <a
            href={artwork.museumLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here for more info
          </a>
        </>
      )}
    </div>
  );
};
