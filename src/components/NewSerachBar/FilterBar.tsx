// // import { FC, useState, useEffect, useMemo } from "react";
// // import { SearchIcon, Filter, TrendingUp, Zap } from "lucide-react";

// // // Define categories outside the component if they are static
// // const initialCategories = [
// //   "Sports",
// //   "Politics",
// //   "Entertainment",
// //   "Breaking News",
// //   "Europa League",
// //   "Trump Cabinet",
// //   "US Election",
// //   "Games",
// //   "Donald Trump",
// //   "La Liga",
// //   "Crypto",
// // ];

// // interface FilterBarProps {
// //   onFilterChange: (filters: {
// //     searchTerm: string;
// //     selectedCategories: string[];
// //     isNew: boolean;
// //   }) => void;
// // }

// // export const FilterBar: FC<FilterBarProps> = ({ onFilterChange }) => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
// //   const [isNewFilterActive, setIsNewFilterActive] = useState(false);

// //   // Effect to call onFilterChange when any filter state changes
// //   useEffect(() => {
// //     onFilterChange({
// //       searchTerm,
// //       selectedCategories,
// //       isNew: isNewFilterActive,
// //     });
// //   }, [searchTerm, selectedCategories, isNewFilterActive, onFilterChange]);

// //   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     setSearchTerm(event.target.value);
// //   };

// //   const handleNewButtonClick = () => {
// //     setIsNewFilterActive((prev) => !prev);
// //   };

// //   const handleCategoryClick = (category: string) => {
// //     setSelectedCategories((prevSelected) => {
// //       if (prevSelected.includes(category)) {
// //         return prevSelected.filter((c) => c !== category); // Deselect
// //       } else {
// //         return [...prevSelected, category]; // Select
// //       }
// //     });
// //   };

// //   // Memoized sorted categories: selected ones first, then unselected
// //   const orderedCategories = useMemo(() => {
// //     const unselected = initialCategories.filter(
// //       (cat) => !selectedCategories.includes(cat)
// //     );
// //     // Selected categories are added in the order they were selected, maintaining their selection order at the front
// //     return [...selectedCategories, ...unselected];
// //   }, [selectedCategories]);

// //   return (
// //     <div className="w-full bg-gradient-to-r from-[#1C1C27] via-[#1E1E2A] to-[#1C1C27] border-b border-gray-700/30 shadow-lg backdrop-blur-sm">
// //       <div className="max-w-[1360px] mx-auto p-4">
// //         {/* Header Section */}
// //         <div className="flex items-center justify-between mb-4">
// //           <div className="flex items-center space-x-3">
// //             <div className="flex items-center space-x-2">
// //               <Filter className="h-5 w-5 text-secondary" />
// //               <h2 className="text-lg font-semibold text-white">
// //                 Event Filters
// //               </h2>
// //             </div>
// //             {(selectedCategories.length > 0 ||
// //               searchTerm ||
// //               isNewFilterActive) && (
// //               <div className="flex items-center space-x-2">
// //                 <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
// //                 <span className="text-xs text-secondary font-medium">
// //                   {selectedCategories.length +
// //                     (searchTerm ? 1 : 0) +
// //                     (isNewFilterActive ? 1 : 0)}{" "}
// //                   active filters
// //                 </span>
// //               </div>
// //             )}
// //           </div>

// //           {/* Clear All Filters Button */}
// //           {(selectedCategories.length > 0 ||
// //             searchTerm ||
// //             isNewFilterActive) && (
// //             <button
// //               onClick={() => {
// //                 setSelectedCategories([]);
// //                 setSearchTerm("");
// //                 setIsNewFilterActive(false);
// //               }}
// //               className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-gray-700/40"
// //             >
// //               Clear All
// //             </button>
// //           )}
// //         </div>

// //         {/* Main Filter Controls */}
// //         <div className="flex flex-col lg:flex-row gap-4">
// //           <div className="flex gap-3 items-center">
// //             {/* New/Hot Button */}
// //             <button
// //               className={`hidden lg:flex items-center space-x-2 sm:space-x-3 md:space-x-4 gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 focus:outline-none relative overflow-hidden group
// //                           ${
// //                             isNewFilterActive
// //                               ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/25 border border-secondary/30"
// //                               : "bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-300 hover:from-secondary/20 hover:to-secondary/10 hover:text-secondary border border-gray-600/40 hover:border-secondary/40"
// //                           }`}
// //               onClick={handleNewButtonClick}
// //             >
// //               <Zap
// //                 className={`h-4 w-4 transition-transform duration-300 ${
// //                   isNewFilterActive ? "animate-pulse" : "group-hover:scale-110"
// //                 }`}
// //               />
// //               <span>Hot Events</span>
// //               {isNewFilterActive && (
// //                 <TrendingUp className="h-3 w-3 animate-bounce" />
// //               )}
// //             </button>

// //             {/* Search Input */}
// //             <div className="relative flex-1 min-w-[280px] max-w-md">
// //               <SearchIcon
// //                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300"
// //                 size={16}
// //               />
// //               <input
// //                 type="text"
// //                 placeholder="Search events, teams, or categories..."
// //                 className="w-full pl-12 pr-4 py-2.5 bg-gray-800/20 text-white rounded-xl border border-gray-600/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 focus:bg-gray-800/30 transition-all duration-300 hover:border-gray-500/30 hover:bg-gray-800/25"
// //                 value={searchTerm}
// //                 onChange={handleSearchChange}
// //               />
// //               {searchTerm && (
// //                 <button
// //                   onClick={() => setSearchTerm("")}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
// //                 >
// //                   ×
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           {/* Category Pills */}
// //           <div className="flex-1 overflow-x-auto scrollbar-hide">
// //             <div className="flex gap-2 min-w-max pb-2">
// //               {orderedCategories.map((category) => (
// //                 <button
// //                   key={category}
// //                   onClick={() => handleCategoryClick(category)}
// //                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none relative overflow-hidden group border
// //                               ${
// //                                 selectedCategories.includes(category)
// //                                   ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20 border-secondary/30 transform scale-105"
// //                                   : "bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-gray-300 hover:from-gray-700/60 hover:to-gray-600/60 hover:text-white border-gray-600/40 hover:border-gray-500/60 hover:scale-105"
// //                               }`}
// //                 >
// //                   <span className="relative z-10">{category}</span>
// //                   {selectedCategories.includes(category) && (
// //                     <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent animate-pulse"></div>
// //                   )}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Enhanced scrollbar hiding for all browsers */}
// //       <style>{`
// //         .scrollbar-hide {
// //           scrollbar-width: none; /* Firefox */
// //           -ms-overflow-style: none; /* IE 10+ */
// //         }
// //         .scrollbar-hide::-webkit-scrollbar {
// //           display: none; /* WebKit browsers */
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };








// //StakeWise-Frontend/src/components/NewSerachBar/FilterBar.tsx
// import { FC, useState, useEffect, useMemo } from "react";
// import { FlameIcon, SearchIcon } from 'lucide-react';

// // Define categories outside the component if they are static
// const initialCategories = [
//   'Crypto', 'La Liga', 'Trump Presidency', 'Breaking News',
//   'Europa League', 'Trump Cabinet', 'US Election', 'Games',
//   'Donald Trump', 'Politics', 'Sports',
// ];

// interface FilterBarProps {
//   onFilterChange: (filters: {
//     searchTerm: string;
//     selectedCategories: string[];
//     isNew: boolean;
//   }) => void;
// }

// export const FilterBar: FC<FilterBarProps> = ({ onFilterChange }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [isNewFilterActive, setIsNewFilterActive] = useState(false);

//   // Effect to call onFilterChange when any filter state changes
//   useEffect(() => {
//     onFilterChange({ searchTerm, selectedCategories, isNew: isNewFilterActive });
//   }, [searchTerm, selectedCategories, isNewFilterActive, onFilterChange]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleNewButtonClick = () => {
//     setIsNewFilterActive(prev => !prev);
//   };

//   const handleCategoryClick = (category: string) => {
//     setSelectedCategories(prevSelected => {
//       if (prevSelected.includes(category)) {
//         return prevSelected.filter(c => c !== category); // Deselect
//       } else {
//         return [...prevSelected, category]; // Select
//       }
//     });
//   };

//   // Memoized sorted categories: selected ones first, then unselected
//   const orderedCategories = useMemo(() => {
//     const unselected = initialCategories.filter(cat => !selectedCategories.includes(cat));
//     // Selected categories are added in the order they were selected, maintaining their selection order at the front
//     return [...selectedCategories, ...unselected];
//   }, [selectedCategories]);

//   return (
//     <div className="w-full bg-[#1C1C23] p-2">
//       <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row gap-4">
//         <div className="flex gap-[10px] items-center">
//           <button
//             className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out focus:outline-none
//                         ${isNewFilterActive
//                           ? 'bg-secondary text-white border border-transparent ring-2 ring-offset-1 ring-offset-[#1C1C23] ring-secondary shadow-md' // Use secondary color from your tailwind config
//                           : 'bg-[#E27625] text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75' // Default state from image
//                         }`}
//             onClick={handleNewButtonClick}
//           >
//             <FlameIcon size={15} />
//             <span>New</span>
//           </button>
//           <div className="relative flex-1 md:w-64">
//             <SearchIcon
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8488AC]"
//               size={15}
//             />
//             <input
//               type="text"
//               placeholder="Search Here"
//               className="text-sm w-full pl-10 pr-4 py-2 bg-[#1C1C27] text-white rounded-lg border border-[#8488AC] placeholder-[#8488AC] focus:outline-none focus:ring-2 focus:ring-[#F15A2B] transition-colors duration-200 ease-in-out"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>

//         <div
//           className="text-sm overflow-x-auto flex-1 -mx-4 px-4 md:mx-0 md:px-0"
//           style={{
//             scrollbarWidth: 'none', // Firefox
//             msOverflowStyle: 'none', // IE 10+
//           }}
//         >
//           <div
//             className="flex gap-[10px] min-w-max"
//             style={{
//               overflow: 'hidden', // Inner div does not need overflow hidden if parent handles scroll
//             }}
//           >
//             {orderedCategories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => handleCategoryClick(category)}
//                 className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out whitespace-nowrap focus:outline-none
//                             ${selectedCategories.includes(category)
//                               ? 'bg-secondary border border-transparent ring-2 ring-offset-1 ring-offset-[#1C1C23] ring-secondary shadow-md' // Use secondary for selected
//                               : 'bg-[#333447] hover:bg-[#4a4b60] focus:ring-2 focus:ring-[#F15A2B] focus:ring-opacity-75'
//                             }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//       {/* Hide scrollbar for WebKit browsers */}
//       <style>
//         {`
//           div::-webkit-scrollbar {
//             display: none;
//           }
//         `}
//       </style>
//     </div>
//   );
// };








//StakeWise-Frontend/src/components/NewSerachBar/FilterBar.tsx
import { FC, useState, useEffect, useMemo } from "react";
import { FlameIcon, SearchIcon } from 'lucide-react';

// Define categories outside the component if they are static
const initialCategories = [
  'Crypto', 'La Liga', 'AI Model', 'Breaking News',
  'NBA Champion', 'Trump Cabinet', 'Games',
  'Donald Trump','Fed', 'Politics', 'Sports', 'Europa League',
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
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">
        {/* Main Filter Container with Glass Morphism */}
        <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl shadow-xl border border-[#333447] backdrop-blur-lg">
          <div className="p-6">
            {/* Top Section: Search and New Button */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6">
              {/* New Button */}
              <div className="flex-shrink-0">
                <button
                  className={`group relative inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#252538] ${
                    isNewFilterActive
                      ? 'bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white shadow-xl shadow-[#E27625]/40 scale-105 focus:ring-[#E27625]/50'
                      : 'bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#F59E0B] hover:to-[#E27625] hover:text-white hover:shadow-lg hover:shadow-[#F59E0B]/30 focus:ring-[#333447]/50'
                  }`}
                  onClick={handleNewButtonClick}
                >
                  <div className="relative">
                    <FlameIcon size={18} className={`transition-all duration-300 ${isNewFilterActive ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                    {isNewFilterActive && (
                      <div className="absolute inset-0 animate-ping">
                        <FlameIcon size={18} className="opacity-30" />
                      </div>
                    )}
                  </div>
                  <span className="font-bold tracking-wide">New</span>
                  {isNewFilterActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md md:max-w-6xl">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E27625] to-[#F59E0B] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-[#333447] to-[#404153] rounded-xl p-[1px] shadow-lg">
                    <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-xl relative">
                      <SearchIcon
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] group-hover:text-[#E27625] transition-colors duration-300"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search betting events..."
                        className="w-full pl-12 pr-4 py-3.5 bg-transparent text-white placeholder-[#A1A1AA] border-none focus:outline-none rounded-xl text-sm font-medium transition-all duration-300"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      {searchTerm && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-[#E27625] rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 pb-2 ">
                <h3 className="text-sm font-semibold text-white tracking-wide">Categories</h3>
                {selectedCategories.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E27625] rounded-full animate-pulse"></div>
                    <span className="text-xs text-[#E27625] font-medium">
                      {selectedCategories.length} selected
                    </span>
                  </div>
                )}
              </div>

              {/* Category Pills Container */}
              <div className="relative">
                <div
                  className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <div className="flex gap-3 min-w-max pr-4">
                    {orderedCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`group relative inline-flex items-center px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#252538] ${
                          selectedCategories.includes(category)
                            ? 'bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white shadow-lg shadow-[#E27625]/30 scale-105 focus:ring-[#E27625]/50'
                            : 'bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white hover:shadow-md focus:ring-[#333447]/50'
                        }`}
                      >
                        <span className="relative z-10">{category}</span>
                        {selectedCategories.includes(category) && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E27625] to-[#F59E0B] rounded-xl animate-pulse opacity-20"></div>
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Fade overlay for scroll indication */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#252538] to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || selectedCategories.length > 0 || isNewFilterActive) && (
              <div className="mt-6 pt-4 border-t border-[#404153]/30">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#A1A1AA] font-medium">Active filters:</span>
                  {isNewFilterActive && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E27625]/20 text-[#E27625] rounded-md border border-[#E27625]/30">
                      <FlameIcon size={12} />
                      New
                    </span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-md border border-[#3B82F6]/30">
                      <SearchIcon size={12} />
                      "{searchTerm}"
                    </span>
                  )}
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-[#10B981]/20 text-[#10B981] rounded-md border border-[#10B981]/30"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hide scrollbar for WebKit browsers */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};