import * as React from "react";
import { ChevronDown, Calendar, Check } from "lucide-react";

interface FilterItem {
  name: string;
  count: number;
}

interface FilterSidebarProps {
  title: string;
  items: FilterItem[];
}

export default function FilterSidebar({ title, items }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [checkedItems, setCheckedItems] = React.useState<{[key: string]: boolean}>({});

  const isDateFilter = title === "Date Range";

  const toggleCheckbox = (itemName: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <div className="w-full bg-[#1C1C27] overflow-hidden">
      <div 
        className="flex w-full items-center justify-between py-2 px-3 cursor-pointer hover:bg-[#393A53] transition-colors duration-150 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      
      {isOpen && (
        <div className="flex flex-col mt-1">
          {isDateFilter && (
            <div className="flex items-center justify-between py-1 px-3 text-white hover:bg-[#262636] transition-colors duration-150 cursor-pointer rounded-lg">
              <span>Select Date</span>
              <Calendar className="h-5 w-5 text-white" />
            </div>
          )}
          
          {items.map((item) => (
            <div 
              key={item.name} 
              className="flex items-center justify-between py-1 px-3 hover:bg-[#262636] transition-colors duration-150 cursor-pointer rounded-lg"
              onClick={() => toggleCheckbox(item.name)}
            >
              <label className="flex items-center cursor-pointer w-full">
                <div className={`h-4 w-4 border border-blue-500 rounded flex items-center justify-center ${checkedItems[item.name] ? 'bg-blue-500' : ''}`}>
                  {checkedItems[item.name] && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="ml-3 text-white">{item.name}</span>
              </label>
              <span className="text-white">{item.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}