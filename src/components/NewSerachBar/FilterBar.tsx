import { FC, useState, useEffect, useMemo } from "react";
import { FlameIcon, SearchIcon } from 'lucide-react';

// Define categories outside the component if they are static
const initialCategories = [
  'Crypto', 'La Liga', 'Trump Presidency', 'Breaking News',
  'Europa League', 'Trump Cabinet', 'US Election', 'Games',
  'Donald Trump', 'Politics', 'Sports',
];

interface FilterBarProps {
  onFilterChange: (filters: {
    searchTerm: string;
    selectedCategories: string[];
    isNew: boolean;
  }) => void;
}

export const FilterBar: FC<FilterBarProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewFilterActive, setIsNewFilterActive] = useState(false);

  // Effect to call onFilterChange when any filter state changes
  useEffect(() => {
    onFilterChange({ searchTerm, selectedCategories, isNew: isNewFilterActive });
  }, [searchTerm, selectedCategories, isNewFilterActive, onFilterChange]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewButtonClick = () => {
    setIsNewFilterActive(prev => !prev);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(c => c !== category); // Deselect
      } else {
        return [...prevSelected, category]; // Select
      }
    });
  };

  // Memoized sorted categories: selected ones first, then unselected
  const orderedCategories = useMemo(() => {
    const unselected = initialCategories.filter(cat => !selectedCategories.includes(cat));
    // Selected categories are added in the order they were selected, maintaining their selection order at the front
    return [...selectedCategories, ...unselected];
  }, [selectedCategories]);

  return (
    <div className="w-full bg-[#1C1C23] p-2">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row gap-4">
        <div className="flex gap-[10px] items-center">
          <button
            className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out focus:outline-none
                        ${isNewFilterActive
                          ? 'bg-secondary text-white border border-transparent ring-2 ring-offset-1 ring-offset-[#1C1C23] ring-secondary shadow-md' // Use secondary color from your tailwind config
                          : 'bg-[#E27625] text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75' // Default state from image
                        }`}
            onClick={handleNewButtonClick}
          >
            <FlameIcon size={15} />
            <span>New</span>
          </button>
          <div className="relative flex-1 md:w-64">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8488AC]"
              size={15}
            />
            <input
              type="text"
              placeholder="Search Here"
              className="text-sm w-full pl-10 pr-4 py-2 bg-[#1C1C27] text-white rounded-lg border border-[#8488AC] placeholder-[#8488AC] focus:outline-none focus:ring-2 focus:ring-[#F15A2B] transition-colors duration-200 ease-in-out"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div
          className="text-sm overflow-x-auto flex-1 -mx-4 px-4 md:mx-0 md:px-0"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE 10+
          }}
        >
          <div
            className="flex gap-[10px] min-w-max"
            style={{
              overflow: 'hidden', // Inner div does not need overflow hidden if parent handles scroll
            }}
          >
            {orderedCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out whitespace-nowrap focus:outline-none
                            ${selectedCategories.includes(category)
                              ? 'bg-secondary border border-transparent ring-2 ring-offset-1 ring-offset-[#1C1C23] ring-secondary shadow-md' // Use secondary for selected
                              : 'bg-[#333447] hover:bg-[#4a4b60] focus:ring-2 focus:ring-[#F15A2B] focus:ring-opacity-75'
                            }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Hide scrollbar for WebKit browsers */}
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};