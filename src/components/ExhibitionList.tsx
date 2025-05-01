import React, { useState, useEffect, useMemo } from "react";
import { UserExhibition } from "../api/userExhibition";
import { ExhibitionCard } from "./ExhibitionCard";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

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
      setLoading(false);
    } catch (error) {
      setErr(error as Error);
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
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search for exhibitions..."
      />
      {err && <p>Error: {err.message}</p>}
      <div className="flex justify-between pt-2">
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        <p className="pt-1">
          <span className="pr-2 pl-2">Sort:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="border px-2 py-1 rounded"
          >
            <option value="added-asc">Recently Added</option>
            <option value="added-desc">Oldest Added</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </p>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <p className="mb-2 text-[#195183]">Loading..</p>
          <CircularProgress />
        </div>
      ) : sortedExhibitions.length === 0 && !err ? (
        <p className="flex justify-center pb-12">
          No exhibitions found.{" "}
          <Link
            to={"/"}
            className="text-blue-600 underline hover:text-blue-800"
          >
            <p className="flex justify-center pb-12">
              Click here add to artworks to an exhibition
            </p>
          </Link>
        </p>
      ) : (
        <>
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
