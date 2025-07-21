import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always display first page, last page, current page, and one page before and after current
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - 1 && i <= currentPage + 1) // Current page and neighbors
      ) {
        pages.push(i);
      }
    }

    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-3">
      <Button
        variant="secondary"
        size="icon"
        className="bg-gradient-to-r from-[#333447] to-[#404153] text-white hover:from-[#404153] hover:to-[#525266] border border-[#525266] transition-all duration-300 hover:scale-105 shadow-lg"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {pageNumbers.map((page, index) => {
        // Add ellipsis
        if (index > 0 && pageNumbers[index - 1] !== page - 1) {
          return (
            <React.Fragment key={`ellipsis-${page}`}>
              <span className="text-[#A1A1AA] px-2 font-medium">...</span>
              <Button
                key={page}
                variant={currentPage === page ? "default" : "secondary"}
                className={
                  currentPage === page
                    ? "bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white hover:from-[#F59E0B] hover:to-[#E27625] shadow-lg shadow-[#E27625]/30 font-semibold"
                    : "bg-gradient-to-r from-[#333447] to-[#404153] text-white hover:from-[#404153] hover:to-[#525266] border border-[#525266] transition-all duration-300 hover:scale-105"
                }
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            </React.Fragment>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "secondary"}
            className={
              currentPage === page
                ? "bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white hover:from-[#F59E0B] hover:to-[#E27625] shadow-lg shadow-[#E27625]/30 font-semibold transition-all duration-300"
                : "bg-gradient-to-r from-[#333447] to-[#404153] text-white hover:from-[#404153] hover:to-[#525266] border border-[#525266] transition-all duration-300 hover:scale-105"
            }
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="secondary"
        size="icon"
        className="bg-gradient-to-r from-[#333447] to-[#404153] text-white hover:from-[#404153] hover:to-[#525266] border border-[#525266] transition-all duration-300 hover:scale-105 shadow-lg"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Pagination;
