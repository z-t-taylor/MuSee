import React, { useState, useEffect, useMemo } from "react";
import { UserExhibition } from "../api/userExhibition";
import { ExhibitionCard } from "./ExhibitionCard";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { Link } from "react-router-dom";
import { Loader } from "./Loader";

interface ExhibitionListProps {
  exhibitions?: UserExhibition[];
}

export const ExhibitionList: React.FC<ExhibitionListProps> = ({
  exhibitions = [],
}) => {
  const [filter, setFilter] = useState<UserExhibition[]>(exhibitions);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<Error | null>(null);
  const [sortOption, setSortOption] = useState<
    "title-asc" | "title-desc" | "added-asc" | "added-desc"
  >("added-asc");

  useEffect(() => {
    setLoading(true);
    try {
      setFilter(exhibitions);
    } catch (error) {
      setErr(error as Error);
    } finally {
      setLoading(false);
    }
  }, [exhibitions]);

  const sortedExhibitions = useMemo(() => {
    return [...filter].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      const addedA = new Date(a.createdAt).getTime();
      const addedB = new Date(b.createdAt).getTime();

      switch (sortOption) {
        case "title-asc":
          return titleA.localeCompare(titleB);
        case "title-desc":
          return titleB.localeCompare(titleA);
        case "added-asc":
          return addedA - addedB;
        case "added-desc":
          return addedB - addedA;
        default:
          return 0;
      }
    });
  }, [filter, sortOption]);

  const handleSearch = (query: string) => {
    const filteredExhibitions = exhibitions?.filter((exhibition) =>
      exhibition.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilter(filteredExhibitions || []);
  };
  return (
    <div>
      {err && <p>Error: {err.message}</p>}
      {loading ? (
        <Loader initialMessage="Loading exhibitions…" loading={loading} />
      ) : sortedExhibitions.length === 0 && !err ? (
        <div>
          <p className="flex justify-center mt-2 mb-1">
            No exhibitions found.{" "}
          </p>
          <Link
            to={"/"}
            className="text-blue-600 underline hover:text-blue-800"
          >
            <p className="flex justify-center text-center pb-12">
              Click here find to artworks and create an exhibition
            </p>
          </Link>
        </div>
      ) : (
        <>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for exhibitions..."
          />
          <div className="flex justify-between pt-2">
            <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            <p className="pt-1">
              <span className="pr-2 pl-2">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="border px-2 py-1 rounded"
                aria-label="sort"
              >
                <option value="added-asc">Recently Added</option>
                <option value="added-desc">Oldest Added</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </p>
          </div>
          <h2 className="italic my-4">Exhibitions:</h2>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 pb-6"
                : "flex flex-col gap-4 items-center my-auto"
            }
          >
            {sortedExhibitions.map((exhibition) => (
              <ExhibitionCard
                key={exhibition.exhibitionId}
                exhibition={exhibition}
              />
            ))}
          </div>{" "}
        </>
      )}
    </div>
  );
};
