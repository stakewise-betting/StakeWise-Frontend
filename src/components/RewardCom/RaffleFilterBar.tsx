import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, Zap, Clock, Trophy } from 'lucide-react';
import axios from 'axios';

interface RaffleFilterProps {
  onFilterChange: (filteredRaffles: any[]) => void;
  allRaffles: any[];
}

interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  showFilters: boolean;
}

const RaffleFilterBar: React.FC<RaffleFilterProps> = ({ onFilterChange, allRaffles }) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    showFilters: false
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch unique categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Using your backend endpoint to get all raffles and extract categories
        const response = await axios.get('/api/raffles/all');
        const raffles = response.data.data || [];
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(raffles.map((raffle: any) => raffle.category).filter(Boolean))
        ) as string[];
        
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to extracting from allRaffles prop
        const fallbackCategories = Array.from(
          new Set(allRaffles.map(raffle => raffle.category).filter(Boolean))
        ) as string[];
        setCategories(['all', ...fallbackCategories]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [allRaffles]);

  // Filter raffles based on current filter state
  const filteredRaffles = useMemo(() => {
    let filtered = [...allRaffles];

    // Filter by search term (raffle name)
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(raffle => 
        raffle.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (filters.selectedCategory && filters.selectedCategory !== 'all') {
      filtered = filtered.filter(raffle => 
        raffle.category === filters.selectedCategory
      );
    }

    return filtered;
  }, [allRaffles, filters]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filteredRaffles);
  }, [filteredRaffles, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ 
      ...prev, 
      selectedCategory: category,
      showFilters: false 
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategory: 'all',
      showFilters: false
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.selectedCategory !== 'all';

  return (
    <div className="mb-8">
      {/* Main Filter Bar */}
      <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E27625] transition-colors duration-200" size={20} />
              <input
                type="text"
                placeholder="Search raffles by name..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#1C1C27] border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E27625] focus:border-transparent transition-all duration-200"
              />
              {filters.searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
              className="flex items-center gap-2 bg-[#1C1C27] border border-gray-600 rounded-lg px-4 py-3 text-white hover:border-[#E27625] transition-all duration-200 min-w-[160px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter size={18} />
                <span className="text-sm font-medium">
                  {filters.selectedCategory === 'all' ? 'All Categories' : filters.selectedCategory}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform duration-200 ${
                  filters.showFilters ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {filters.showFilters && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C27] border border-gray-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-400">Loading categories...</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors ${
                        filters.selectedCategory === category 
                          ? 'bg-[#E27625] text-white' 
                          : 'text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {category === 'all' ? (
                          <Trophy size={16} />
                        ) : category.toLowerCase().includes('hot') ? (
                          <Zap size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                        {category === 'all' ? 'All Categories' : category}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-400">Active filters:</span>
              {filters.searchTerm && (
                <span className="bg-[#E27625] text-white px-3 py-1 rounded-full text-xs font-medium">
                  Search: "{filters.searchTerm}"
                </span>
              )}
              {filters.selectedCategory !== 'all' && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Category: {filters.selectedCategory}
                </span>
              )}
              <span className="text-gray-400 ml-2">
                {filteredRaffles.length} raffle{filteredRaffles.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-gray-400 text-sm font-medium mr-2">Quick filters:</span>
        {categories.filter(cat => cat !== 'all').slice(0, 4).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              filters.selectedCategory === category
                ? 'bg-[#E27625] text-white'
                : 'bg-[#1C1C27] border border-orange-500 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RaffleFilterBar;