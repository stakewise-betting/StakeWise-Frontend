// import * as React from "react";
// import { ChevronDown, Calendar, Check } from "lucide-react";

// interface FilterItem {
//   name: string;
//   count: number;
// }

// interface FilterSidebarProps {
//   title: string;
//   items: FilterItem[];
// }

// export default function FilterSidebar({ title, items }: FilterSidebarProps) {
//   const [isOpen, setIsOpen] = React.useState(true);
//   const [checkedItems, setCheckedItems] = React.useState<{[key: string]: boolean}>({});

//   const isDateFilter = title === "Date Range";

//   const toggleCheckbox = (itemName: string) => {
//     setCheckedItems(prev => ({
//       ...prev,
//       [itemName]: !prev[itemName]
//     }));
//   };

//   return (
//     <div className="w-full bg-[#1C1C27] overflow-hidden">
//       <div 
//         className="flex w-full items-center justify-between py-2 px-3 cursor-pointer hover:bg-[#393A53] transition-colors duration-150 rounded-lg"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-white">{title}</span>
//         <ChevronDown
//           className={`h-5 w-5 text-white transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </div>
      
//       {isOpen && (
//         <div className="flex flex-col mt-1">
//           {isDateFilter && (
//             <div className="flex items-center justify-between py-1 px-3 text-white hover:bg-[#262636] transition-colors duration-150 cursor-pointer rounded-lg">
//               <span>Select Date</span>
//               <Calendar className="h-5 w-5 text-white" />
//             </div>
//           )}
          
//           {items.map((item) => (
//             <div 
//               key={item.name} 
//               className="flex items-center justify-between py-1 px-3 hover:bg-[#262636] transition-colors duration-150 cursor-pointer rounded-lg"
//               onClick={() => toggleCheckbox(item.name)}
//             >
//               <label className="flex items-center cursor-pointer w-full">
//                 <div className={`h-4 w-4 border border-blue-500 rounded flex items-center justify-center ${checkedItems[item.name] ? 'bg-blue-500' : ''}`}>
//                   {checkedItems[item.name] && (
//                     <Check className="h-3 w-3 text-white" />
//                   )}
//                 </div>
//                 <span className="ml-3 text-white">{item.name}</span>
//               </label>
//               <span className="text-white">{item.count}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




// Added Calender to Select Date Section
import * as React from "react";
import { ChevronDown, Calendar, Check, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

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
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const dateSelectRef = React.useRef<HTMLDivElement>(null);

  const isDateFilter = title === "Date Range";

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current && 
        !calendarRef.current.contains(event.target as Node) &&
        dateSelectRef.current && 
        !dateSelectRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCheckbox = (itemName: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(undefined);
  };

  return (
    <div 
      className="w-full bg-[#1C1C27] overflow-visible relative" 
      ref={calendarRef}
    >
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
        <div className="flex flex-col mt-1 relative">
          {isDateFilter && (
            <div className="relative z-20">
              <div 
                ref={dateSelectRef}
                className="flex items-center justify-between py-1 px-3 text-white hover:bg-[#262636] transition-colors duration-150 cursor-pointer rounded-lg"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <span>
                  {selectedDate 
                    ? format(selectedDate, 'PPP') 
                    : 'Select Date'}
                </span>
                <div className="flex items-center space-x-2">
                  {selectedDate && (
                    <button 
                      onClick={clearDate}
                      className="hover:bg-gray-700 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {isCalendarOpen && (
                <div 
                  className="absolute left-0 right-0 z-50 mt-1 bg-[#262636] rounded-lg shadow-lg border border-gray-700"
                  style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '100%',
                    maxWidth: '100%'
                  }}
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="text-white w-full"
                    classNames={{
                      root: "p-3 w-full", 
                      caption: "flex justify-center items-center relative",
                      nav: "flex items-center",
                      nav_button: "h-6 w-6 bg-transparent hover:bg-[#393A53] text-white rounded-full",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      head: "flex",
                      head_cell: "text-xs font-medium text-gray-400 w-9 text-center",
                      cell: "h-9 w-9 text-center text-sm p-0 hover:bg-[#393A53] rounded-full",
                      day: "h-9 w-9 text-white hover:bg-[#393A53] rounded-full",
                      day_selected: "bg-blue-500 text-white hover:bg-blue-600 rounded-full",
                      day_today: "border border-blue-500 text-white",
                      day_outside: "text-gray-500 opacity-50",
                    }}
                  />
                </div>
              )}
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