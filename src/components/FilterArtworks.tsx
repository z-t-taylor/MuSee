import { ArtFilterType } from "../api/apiCalls";

interface FilterArtworksProps {
  currentFilter: ArtFilterType;
  onFilterChange: (filter: ArtFilterType) => void;
}

export const FilterArtworks: React.FC<FilterArtworksProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const filters: ArtFilterType[] = [
    "all",
    "paintings",
    "prints",
    "photographs",
    "sculpture",
    "ceramics",
    "furniture",
  ];

  const formatFilterLabel = (filter: ArtFilterType) => {
    return filter.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          aria-pressed={currentFilter === filter}
          className={`
          px-4 py-2 rounded-xl border 
          transition-all duration-200 ease-in-out
          whitespace-nowrap cursor-pointer
          ${
            currentFilter === filter
              ? "bg-[#195183] text-white border-[#195183]"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }
        `}
        >
          {formatFilterLabel(filter)}
        </button>
      ))}
    </div>
  );
};
