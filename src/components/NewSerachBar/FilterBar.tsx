import { FlameIcon, SearchIcon } from 'lucide-react'
const categories = [
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
]

export const FilterBar = () => {
  return (
    <div className="w-full bg-[#1C1C23] p-2">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row gap-4">
        <div className="flex gap-[10px] items-center">
          <button className="text-sm flex items-center gap-2 bg-[#E27625] text-white px-4 py-2 rounded-lg transition-colors hover:border border-[#9747FF]">
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
              className="text-sm w-full pl-10 pr-4 py-2 bg-[#1C1C27] text-white rounded-lg border border-[#8488AC] placeholder-[#8488AC] focus:outline-none focus:ring-2 focus:ring-[#F15A2B]"
            />
          </div>
        </div>

        {/* Scrollable categories bar with hidden scrollbar */}
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
              overflow: 'hidden',
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg bg-[#333447] text-white hover:border border-[#9747FF] transition-colors whitespace-nowrap"
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
  )
}