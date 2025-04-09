import React, { useState, useEffect } from "react";
import { Artwork } from "../api/types";
import { fetchAllArtworks } from "../api/apiCalls";
import { ArtworkCard } from "./ArtworkCard";

export const ArtworkList: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    const getArtworks = async () => {
      try {
        const art = await fetchAllArtworks();
        setArtworks(art);
      } catch (error) {
        setErr(error as Error);
      }
    };
    getArtworks();
  }, []);

  return (
    <div className="artwork-list">
      {err && <p>Error: {err.message}</p>}
      {artworks.length === 0 && !err && <p>Loading..</p>}
      {artworks.map((art) => (
        <ArtworkCard key={art.id} artwork={art} />
      ))}
    </div>
  );
};
