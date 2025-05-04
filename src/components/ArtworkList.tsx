import React, { useState, useEffect } from "react";
import { Artwork } from "../api/types";
import {
  fetchAllArtworks,
  searchAllArtworks,
  ArtFilterType,
  filterAllArtworks,
} from "../api/apiCalls";
import { ArtworkCard } from "./ArtworkCard";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { getPageNumbers } from "../util/getPageNumbers";
import { parseYear } from "../util/parseYear";
import { FilterArtworks } from "./FilterArtworks";
import { Loader } from "./Loader";

export const ArtworkList: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [results, setResults] = useState<Artwork[] | null>(null);
  const [currentFilter, setCurrentFilter] = useState<ArtFilterType>("all");
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
    let isActive = true;

    const getArtworks = async () => {
      try {
        const art =
          currentFilter === "all"
            ? await fetchAllArtworks()
            : await filterAllArtworks(currentFilter);
        if (isActive) setArtworks(art);
      } catch (error) {
        if (isActive) setErr(error as Error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    if (!isSearching) getArtworks();
    return () => {
      isActive = false;
    };
  }, [currentFilter, isSearching]);

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

  const handleFilterChange = (filter: ArtFilterType) => {
    setCurrentFilter(filter);
    setResults(null);
    setIsSearching(false);
    setCurrentPage(1);
    setLoading(true);
  };

  const sortedArtToShow = [...artToShow].sort((a, b) => {
    const createdA = parseYear(a.creationDate);
    const createdB = parseYear(b.creationDate);
    switch (sortOption) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "date-asc":
        return createdA - createdB;
      case "date-desc":
        return createdB - createdA;
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
    <>
      {err && (
        <p className="text-center pb-12 mt-8">
          Error loading artworks: {err.message}
        </p>
      )}
      {loading ? (
        <Loader initialMessage="Loading artworks…" loading={loading} />
      ) : currentArtworks.length === 0 && !err ? (
        <p className="flex justify-center pb-12">Sorry, no artworks found. </p>
      ) : (
        <>
          <div>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search artworks..."
            />
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
            <FilterArtworks
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="flex justify-between pt-2 mt-2">
            <div className="flex gap-4">
              <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            </div>
            <div className="flex col-auto">
              <p className="pt-1">
                <span className="pr-2 pl-2">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="border px-2 py-1 rounded ml-1"
                >
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="date-asc">Artwork Newest</option>
                  <option value="date-desc">Artwork Oldest</option>
                </select>
              </p>
            </div>
          </div>
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
          <div className="flex justify-center items-center gap-1 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hidden md:block md:px-4 md:py-2 md:border md:rounded-xl md:disabled:opacity-50 md:text-base"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="md:hidden px-4 py-2 border rounded-xl disabled:opacity-50 text-sm"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-2">...</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(Number(page))}
                      className={`px-4 py-1 text-sm md:text-base border rounded-lg ${
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
              className="px-4 md:px-6 py-2 border rounded-xl disabled:opacity-50 text-sm md:text-base"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};
