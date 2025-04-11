import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryTagProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryTag: React.FC<CategoryTagProps> = ({ 
  label, 
  isActive = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors",
        isActive 
          ? "bg-theme-orange text-white" 
          : "bg-[#333447] text-white/80 hover:bg-gray-700"
      )}
    >
      {label}
    </button>
  );
};

export default CategoryTag;