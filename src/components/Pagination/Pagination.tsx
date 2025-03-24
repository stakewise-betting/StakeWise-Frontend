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
    <div className="flex items-center justify-end space-x-2 mt-8">
      <Button
        variant="secondary"
        size="icon"
        className="bg-[#333447] text-white hover:bg-[#4A4E68]"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) => {
        // Add ellipsis
        if (index > 0 && pageNumbers[index - 1] !== page - 1) {
          return (
            <React.Fragment key={`ellipsis-${page}`}>
              <span className="text-gray-500">...</span>
              <Button
                key={page}
                variant={currentPage === page ? "default" : "secondary"}
                className={
                  currentPage === page
                    ? "bg-[#FF6934] text-white hover:bg-[#FF8254]"
                    : "bg-[#333447] text-white hover:bg-[#4A4E68]"
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
                ? "bg-[#E27625] text-white hover:bg-[#ff8254c9]"
                : "bg-[#333447] text-white hover:bg-[#4A4E68]"
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
        className="bg-[#333447] text-white hover:bg-[#4A4E68]"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;