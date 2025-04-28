import React, { useState, useEffect } from "react";
import { UserExhibition } from "../api/userExhibition";
import { ExhibitionCard } from "./ExhibitionCard";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";

interface ExhibitionListProps {
  exhibitions?: UserExhibition[];
}

export const ExhibitionList: React.FC<ExhibitionListProps> = ({
  exhibitions = [],
}) => {
  const [filter, setFilter] = useState<UserExhibition[]>(exhibitions);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setFilter(exhibitions);
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
      <div className="flex justify-end pt-2">
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
      </div>
      <h1>Exhibitions:</h1>
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
      </div>
    </div>
  );
};
