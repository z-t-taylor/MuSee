import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setLoading(true);
    try {
      setFilter(exhibitions);
      setLoading(false);
    } catch (error) {
      setErr(error as Error);
    }
  }, [exhibitions]);

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
      <div className="flex justify-start pt-2">
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <p className="mb-2 text-[#195183]">Loading..</p>
          <CircularProgress />
        </div>
      ) : exhibitions.length === 0 && !err ? (
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
            {filter.map((exhibition) => (
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
