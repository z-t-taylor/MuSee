import React, { useState, useEffect } from "react";
import { UserExhibition } from "../api/userExhibition";
import ExhibitionCard from "./ExhibitionCard";
import { SearchBar } from "./SearchBar";

interface ExhibitionListProps {
  exhibitions?: UserExhibition[];
}

export const ExhibitionList: React.FC<ExhibitionListProps> = ({
  exhibitions = [],
}) => {
  const [filter, setFilter] = useState<UserExhibition[]>(exhibitions);

  useEffect(() => {
    setFilter(exhibitions);
  }, [exhibitions]);

  const handleSearch = (query: string) => {
    const filteredExhibitions = exhibitions?.filter((exhibition) => {
      exhibition.title.toLowerCase().includes(query.toLowerCase());
    });
    setFilter(filteredExhibitions || []);
  };
  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search for exhibitions..."
      />
      {filter.map((exhibition) => (
        <ExhibitionCard key={exhibition.exhibitionId} exhibition={exhibition} />
      ))}
    </div>
  );
};
