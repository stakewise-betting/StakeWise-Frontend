import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchAndFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // You can add more props here if the "New" or "Trending" buttons
  // need to trigger actions in the parent component, e.g.:
  // onNewClick?: () => void;
  // onTrendingClick?: () => void;
}

export default function SearchAndFilterSection({
  searchQuery,
  onSearchChange,
}: SearchAndFilterSectionProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <div className="relative bg-gradient-to-r from-[#333447] to-[#404153] rounded-xl p-[1px] shadow-lg">
          <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A1A1AA]" />
            <Input
              className="pl-12 pr-4 py-3 bg-transparent placeholder-[#A1A1AA] text-white border-none focus:border-transparent outline-none focus:outline-none focus:ring-0 rounded-xl"
              placeholder="Search events by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button
        variant="secondary"
        className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold px-6 py-3 shadow-lg shadow-[#10B981]/20 transition-all duration-300 hover:scale-105"
      >
        New
      </Button>
      <Button
        variant="secondary"
        className="bg-gradient-to-r from-[#F59E0B] to-[#E27625] hover:from-[#E27625] hover:to-[#D97919] text-white font-semibold px-6 py-3 shadow-lg shadow-[#F59E0B]/20 transition-all duration-300 hover:scale-105"
      >
        Trending
      </Button>
    </div>
  );
}
