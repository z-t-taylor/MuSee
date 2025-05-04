import { useState } from "react";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search..",
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          <input
            type="text"
            name="search-bar"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={placeholder}
            className="p-2 pr-16 pl-8 border border-gray-300 rounded-xl md:rounded-[2vw] w-full"
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-16 top-1/2 transform -translate-y-1/2 text-black-75"
            >
              X
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#195183] text-white px-3 py-1 text-sm rounded-lg md:rounded-[1vw] hover:bg-gray-500"
          >
            <SearchSharpIcon />
          </button>
        </div>
      </form>
    </>
  );
};
