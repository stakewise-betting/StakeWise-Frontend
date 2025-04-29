import React, { useState, useRef } from 'react';
import { Search, Flame, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import CategoryTag from './CategoryTag';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  label: string;
}

const categories: Category[] = [
    { id: 'new', label: 'New' },
  { id: 'la-liga', label: 'La Liga' },
  { id: 'trump-presidency', label: 'Trump Presidency' },
  { id: 'breaking-news', label: 'Breaking News' },
  { id: 'europa-league', label: 'Europa League' },
  { id: 'trump-cabinet', label: 'Trump Cabinet' },
  { id: 'us-election', label: 'US Election' },
  { id: 'games', label: 'Games' },
  { id: 'entertainment', label: 'Entertainment' },
];

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement your search logic here
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const scrollTags = (direction: 'left' | 'right') => {
    if (tagsContainerRef.current) {
      const container = tagsContainerRef.current;
      const scrollAmount = container.clientWidth * 0.5;
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="w-full bg-[#1C1C27] text-white">
      <div className={cn(
        "w-full max-w-full mx-auto px-20",
        isMobile ? "py-3" : "py-4"
      )}>
        {/* Desktop: single row, Mobile: stacked layout */}
        <div className={cn(
          "flex gap-3",
          isMobile ? "flex-col" : "flex-row items-center"
        )}>
          {/* Top section with button and search */}
          <div className={cn(
            "flex items-center gap-2",
            isMobile ? "w-full" : "w-auto"
          )}>
            <button 
              className="flex-shrink-0 flex items-center gap-1.5 bg-[#E27625] text-white px-3 py-1.5 rounded-md font-medium"
            >
              <Flame size={16} />
              <span>Top</span>
            </button>
            
            <form onSubmit={handleSearch} className={cn(
              "relative",
              isMobile ? "flex-1" : "w-64"
            )}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8488AC]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by market"
                  className="w-full bg-[#1C1C27] border border-[#8488AC] rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-[#8488AC] focus:outline-none focus:ring-1 focus:ring-theme-orange focus:border-theme-orange"
                />
              </div>
            </form>
          </div>
          
          {/* Categories section */}
          <div className={cn(
            "relative",
            isMobile ? "w-full" : "flex-1"
          )}>
            <div 
              ref={tagsContainerRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth py-1"
            >
              {categories.map((category) => (
                <CategoryTag
                  key={category.id}
                  label={category.label}
                  isActive={activeCategory === category.id}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
            
            <button 
              onClick={() => scrollTags('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#333447] backdrop-blur-sm p-1 rounded-full"
            >
              <ChevronRight size={18} className="text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;