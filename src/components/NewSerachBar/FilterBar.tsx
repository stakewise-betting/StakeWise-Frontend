import { FC, useState, useEffect, useMemo } from "react";
import { SearchIcon, Filter, TrendingUp, Zap } from "lucide-react";

// Define categories outside the component if they are static
const initialCategories = [
  "Crypto",
  "La Liga",
  "Trump Presidency",
  "Breaking News",
  "Europa League",
  "Trump Cabinet",
  "US Election",
  "Games",
  "Donald Trump",
  "Politics",
  "Sports",
];

interface FilterBarProps {
  onFilterChange: (filters: {
    searchTerm: string;
    selectedCategories: string[];
    isNew: boolean;
  }) => void;
}

export const FilterBar: FC<FilterBarProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewFilterActive, setIsNewFilterActive] = useState(false);

  // Effect to call onFilterChange when any filter state changes
  useEffect(() => {
    onFilterChange({
      searchTerm,
      selectedCategories,
      isNew: isNewFilterActive,
    });
  }, [searchTerm, selectedCategories, isNewFilterActive, onFilterChange]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewButtonClick = () => {
    setIsNewFilterActive((prev) => !prev);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((c) => c !== category); // Deselect
      } else {
        return [...prevSelected, category]; // Select
      }
    });
  };

  // Memoized sorted categories: selected ones first, then unselected
  const orderedCategories = useMemo(() => {
    const unselected = initialCategories.filter(
      (cat) => !selectedCategories.includes(cat)
    );
    // Selected categories are added in the order they were selected, maintaining their selection order at the front
    return [...selectedCategories, ...unselected];
  }, [selectedCategories]);

  return (
    <div className="w-full bg-gradient-to-r from-[#1C1C27] via-[#1E1E2A] to-[#1C1C27] border-b border-gray-700/30 shadow-lg backdrop-blur-sm">
      <div className="max-w-[1360px] mx-auto p-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold text-white">
                Event Filters
              </h2>
            </div>
            {(selectedCategories.length > 0 ||
              searchTerm ||
              isNewFilterActive) && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-xs text-secondary font-medium">
                  {selectedCategories.length +
                    (searchTerm ? 1 : 0) +
                    (isNewFilterActive ? 1 : 0)}{" "}
                  active filters
                </span>
              </div>
            )}
          </div>

          {/* Clear All Filters Button */}
          {(selectedCategories.length > 0 ||
            searchTerm ||
            isNewFilterActive) && (
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSearchTerm("");
                setIsNewFilterActive(false);
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-gray-700/40"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Main Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-3 items-center">
            {/* New/Hot Button */}
            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 focus:outline-none relative overflow-hidden group
                          ${
                            isNewFilterActive
                              ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/25 border border-secondary/30"
                              : "bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-300 hover:from-secondary/20 hover:to-secondary/10 hover:text-secondary border border-gray-600/40 hover:border-secondary/40"
                          }`}
              onClick={handleNewButtonClick}
            >
              <Zap
                className={`h-4 w-4 transition-transform duration-300 ${
                  isNewFilterActive ? "animate-pulse" : "group-hover:scale-110"
                }`}
              />
              <span>Hot Events</span>
              {isNewFilterActive && (
                <TrendingUp className="h-3 w-3 animate-bounce" />
              )}
            </button>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <SearchIcon
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Search events, teams, or categories..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-800/20 text-white rounded-xl border border-gray-600/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 focus:bg-gray-800/30 transition-all duration-300 backdrop-blur-sm hover:border-gray-500/30 hover:bg-gray-800/25"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-2">
              {orderedCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none relative overflow-hidden group border
                              ${
                                selectedCategories.includes(category)
                                  ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20 border-secondary/30 transform scale-105"
                                  : "bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-gray-300 hover:from-gray-700/60 hover:to-gray-600/60 hover:text-white border-gray-600/40 hover:border-gray-500/60 hover:scale-105"
                              }`}
                >
                  <span className="relative z-10">{category}</span>
                  {selectedCategories.includes(category) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scrollbar hiding for all browsers */}
      <style>{`
        .scrollbar-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* WebKit browsers */
        }
      `}</style>
    </div>
  );
};
