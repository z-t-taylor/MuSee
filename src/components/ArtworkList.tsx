import React, { useState, useEffect } from "react";
import { Artwork } from "../api/types";
import { fetchAllArtworks, searchAllArtworks } from "../api/apiCalls";
import { ArtworkCard } from "./ArtworkCard";
import { SearchBar } from "./SearchBar";

export const ArtworkList: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [results, setResults] = useState<Artwork[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const artworksPerPage = 12;
  const artToShow = results ?? artworks;
  const lastItemIndex = currentPage * artworksPerPage;
  const firstItemIndex = lastItemIndex - artworksPerPage;
  const currentArtworks = artToShow.slice(firstItemIndex, lastItemIndex);

  const handleSearch = async (query: string) => {
    try {
      const results = await searchAllArtworks(query);
      setCurrentPage(1);
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
      {currentArtworks.map((art) => (
        <ArtworkCard key={art.id} artwork={art} />
      ))}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>Page {currentPage}</span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              lastItemIndex < artToShow.length ? prev + 1 : prev
            )
          }
          disabled={lastItemIndex >= artToShow.length}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
