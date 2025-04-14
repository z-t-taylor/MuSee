import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Artwork } from "../api/types";
import { fetchAllArtworks } from "../api/apiCalls";

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

  return (
    <div className="artwork-single-page">
      {err ? (
        <p>Error: {err.message}</p>
      ) : !artwork ? (
        <p>Loading..</p>
      ) : (
        <>
          <h1>Title: {artwork.title}</h1>
          <h2>Artist: {artwork.artist || "Unknown"}</h2>
          <img
            src={artwork.image?.imageURL}
            alt={artwork.image?.alt_text || artwork.title}
            loading="lazy"
          />
          <h3>Creation: {artwork.creationDate}</h3>
          {artwork.description && (
            <p>
              About:
              {artwork.description?.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </p>
          )}
          <p>Medium: {artwork.medium}</p>
          <p>Culture: {artwork.origin || "Unknown"}</p>
          <p>Classification: {artwork.styles}</p>
          {artwork.exhibition_history && (
            <ul>
              Exhibition History:
              {artwork.exhibition_history
                ?.split(/\n\n|;\s*/)
                .map((history, i) => (
                  <li key={i}>
                    {history.trim()}
                    {!history.trim().endsWith(".") && "."}
                  </li>
                ))}
            </ul>
          )}
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
