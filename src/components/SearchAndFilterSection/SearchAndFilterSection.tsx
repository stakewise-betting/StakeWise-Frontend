import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchAndFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Add more props here if the "New" or "Trending" buttons
  // onNewClick?: () => void;
  // onTrendingClick?: () => void;
}

export default function SearchAndFilterSection({
  searchQuery,
  onSearchChange,
}: SearchAndFilterSectionProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1 border-2 border-[#333447] rounded-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8488AC]" />
        <Input
          className="pl-10 bg-[#1C1C27] placeholder-[#8488AC] text-white border-none focus:border-transparent outline-none focus:outline-none focus:ring-0"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="secondary" className="bg-[#333447] hover:bg-[#4A4E68]">
        New
      </Button>
      <Button variant="secondary" className="bg-[#333447] hover:bg-[#4A4E68]">
        Trending
      </Button>
    </div>
  );
}