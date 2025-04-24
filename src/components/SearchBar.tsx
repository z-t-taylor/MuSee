import { useState } from "react";

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={placeholder}
            className="p-2 pr-10 pl-8 border border-gray-300 rounded-[2vw] w-full"
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute pr-2 right-3 top-1/2 transform -translate-y-1/2 text-black-75"
            >
              X
            </button>
          )}
        </div>
      </form>
    </>
  );
};
