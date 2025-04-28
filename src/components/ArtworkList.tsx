import React, { useState, useEffect } from "react";
import { Artwork } from "../api/types";
import { fetchAllArtworks, searchAllArtworks } from "../api/apiCalls";
import { ArtworkCard } from "./ArtworkCard";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { getPageNumbers } from "../util/getPageNumbers";
import CircularProgress from "@mui/material/CircularProgress";

export const ArtworkList: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [results, setResults] = useState<Artwork[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [sortOption, setSortOption] = useState<
    "title-asc" | "title-desc" | "date-asc" | "date-desc"
  >("title-asc");

  const artworksPerPage = 16;
  const artToShow = results ?? artworks;

  useEffect(() => {
    if (!isSearching) {
      const getArtworks = async () => {
        setLoading(true);
        try {
          const art = await fetchAllArtworks();
          setArtworks(art);
          setLoading(false);
        } catch (error) {
          setErr(error as Error);
        }
      };
      getArtworks();
    }
  }, [currentPage, isSearching]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchAllArtworks(query);
      setIsSearching(true);
      setCurrentPage(1);
      setResults(results);
      setLoading(false);
    } catch (error) {
      setErr(error as Error);
    }
  };

  const handleClearSearch = () => {
    setResults(null);
    setIsSearching(false);
    setCurrentPage(1);
  };

  const sortedArtToShow = [...artToShow].sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "date-asc":
        return (
          parseInt(a.creationDate ?? "0", 10) -
          parseInt(b.creationDate ?? "0", 10)
        );
      case "date-desc":
        return (
          parseInt(b.creationDate ?? "0", 10) -
          parseInt(a.creationDate ?? "0", 10)
        );
      default:
        return 0;
    }
  });

  const lastItemIndex = currentPage * artworksPerPage;
  const firstItemIndex = lastItemIndex - artworksPerPage;
  const currentArtworks = sortedArtToShow.slice(firstItemIndex, lastItemIndex);

  const totalPages = Math.ceil(artToShow.length / artworksPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="artwork-list">
      <SearchBar onSearch={handleSearch} placeholder="Search artworks..." />
      {isSearching && (
        <div className="flex justify-end mt-2">
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Clear Search
          </button>
        </div>
      )}
      {err && <p>Error: {err.message}</p>}
      <div className="flex justify-end pt-2">
        <div>
          <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>
        <div className="flex col-auto">
          <p className="pt-1">
            <span className="pr-2 pl-2">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
            >
              <option value="title-asc">A-Z</option>
              <option value="title-desc">Z-A</option>
              <option value="date-asc">Oldest to Newest</option>
              <option value="date-desc">Newest to Oldest</option>
            </select>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <p className="mb-2 text-[#195183]">Loading..</p>
          <CircularProgress />
        </div>
      ) : currentArtworks.length === 0 && !err ? (
        <p className="flex justify-center pb-12">Sorry, no artworks found. </p>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 pb-6"
              : "flex flex-col gap-4 items-center my-auto"
          }
        >
          {currentArtworks.map((art) => (
            <ArtworkCard key={art.id} artwork={art} viewMode={viewMode} />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-2">...</span>
              ) : (
                <button
                  onClick={() => setCurrentPage(Number(page))}
                  className={`px-3 py-1 border rounded ${
                    page === currentPage ? "bg-blue-50" : ""
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              currentPage < totalPages ? prev + 1 : prev
            )
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
