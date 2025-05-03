// components/NewSearchBar/FilterBar.tsx
import { FlameIcon, SearchIcon } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { cn } from "@/lib/utils";

// Rename this list - these are now keyword suggestions
const initialKeywords = [
  'Crypto',
  'La Liga',
  'Trump Presidency',
  'Breaking News',
  'Europa League',
  'Trump Cabinet',
  'US Election',
  'Games',
  'Entertainment',
  'Politics',
  'Sports',
];

interface FilterBarProps {
  // Pass selectedKeywords array instead of selectedCategories
  onFilterChange: (searchTerm: string, selectedKeywords: string[], isNewActive: boolean) => void;
}

export const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Rename state: selectedCategories -> selectedKeywords
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isNewActive, setIsNewActive] = useState<boolean>(false);

  // Debounce the filter change function
  const debouncedFilterChange = useCallback(
    // Pass keywords array
    debounce((term: string, keywords: string[], newActive: boolean) => {
      onFilterChange(term, keywords, newActive);
    }, 300),
    [onFilterChange]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    // Pass selectedKeywords to debounced call
    debouncedFilterChange(newSearchTerm, selectedKeywords, isNewActive);
  };

  // Rename handler: handleCategoryClick -> handleKeywordClick
  const handleKeywordClick = (keyword: string) => {
    // Logic remains the same, but operates on selectedKeywords
    const newSelectedKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter((k) => k !== keyword)
      : [...selectedKeywords, keyword];

    setSelectedKeywords(newSelectedKeywords);
    // Trigger filter change immediately, passing selectedKeywords
    onFilterChange(searchTerm, newSelectedKeywords, isNewActive);
  };

  const handleNewClick = () => {
    const newActiveState = !isNewActive;
    setIsNewActive(newActiveState);
    // Trigger filter change immediately, passing selectedKeywords
    onFilterChange(searchTerm, selectedKeywords, newActiveState);
  };


  // Rename memoized variable: displayedCategories -> displayedKeywords
  const displayedKeywords = useMemo(() => {
    const unselected = initialKeywords
      .filter((kw) => !selectedKeywords.includes(kw))
      .sort();
    // Operates on selectedKeywords
    return [...selectedKeywords, ...unselected];
  }, [selectedKeywords]);

  return (
    <div className="w-full bg-[#1C1C23] p-2">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row gap-4">
        {/* Search and New Button */}
        <div className="flex gap-[10px] items-center">
          {/* --- "New" Button --- */}
          <button
            onClick={handleNewClick} // Add click handler
            className={cn(
              "text-sm flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C23]",
              isNewActive
               ? "bg-[#E27625] border border-[#FF9A56] focus:ring-[#FF9A56]" // Active style
               : "bg-[#333447] hover:bg-opacity-80 focus:ring-[#9747FF]" // Inactive style (removed hover border)
            )}
          >
            <FlameIcon size={15} />
            <span>New</span>
          </button>
          {/* --- Search Input --- */}
          <div className="relative flex-1 md:w-64">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8488AC]"
              size={15}
            />
            <input
              type="text"
              placeholder="Search Events"
              value={searchTerm}
              onChange={handleSearchChange}
              className="text-sm w-full pl-10 pr-4 py-2 bg-[#1C1C27] text-white rounded-lg border border-[#8488AC] placeholder-[#8488AC] focus:outline-none focus:ring-2 focus:ring-[#F15A2B]"
            />
          </div>
        </div>

        {/* Scrollable keywords bar */}
        <div
          className="text-sm overflow-x-auto flex-1 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Map over displayedKeywords */}
          <div className="flex gap-[10px] min-w-max">
            {displayedKeywords.map((keyword) => {
              // Check against selectedKeywords
              const isSelected = selectedKeywords.includes(keyword);
              return (
                <button
                  key={keyword}
                  // Call handleKeywordClick
                  onClick={() => handleKeywordClick(keyword)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-white transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C23]",
                    isSelected
                      ? "bg-[#E27625] border border-[#FF9A56] focus:ring-[#FF9A56]"
                      : "bg-[#333447] hover:bg-opacity-80 focus:ring-[#9747FF]"
                  )}
                >
                  {/* Display the keyword */}
                  {keyword}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Hide scrollbar style */}
      <style>{` div::-webkit-scrollbar { display: none; } `}</style>
    </div>
  );
};