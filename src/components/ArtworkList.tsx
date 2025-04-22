import React, { useState, useEffect } from "react";
import { Artwork } from "../api/types";
import { fetchAllArtworks, searchAllArtworks } from "../api/apiCalls";
import { ArtworkCard } from "./ArtworkCard";
import { SearchBar } from "./SearchBar";

export const ArtworkList: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [results, setResults] = useState<Artwork[] | null>(null);

  const handleSearch = async (query: string) => {
    try {
      const results = await searchAllArtworks(query);
      setResults(results);
    } catch (error) {
      setErr(error as Error);
    }
  };

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
      <SearchBar onSearch={handleSearch} placeholder="Search artworks..." />
      {err && <p>Error: {err.message}</p>}
      {artworks.length === 0 && !err && <p>Loading..</p>}
      {(results ?? artworks).map((art) => (
        <ArtworkCard key={art.id} artwork={art} />
      ))}
    </div>
  );
};
