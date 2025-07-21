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
  const [checkedItems, setCheckedItems] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCheckbox = (itemName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
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
    <div className="w-full bg-gradient-to-br from-[#333447] to-[#2A2A3E] rounded-xl overflow-hidden border border-[#404153] shadow-lg">
      <div
        className="flex w-full items-center justify-between py-4 px-4 cursor-pointer hover:bg-gradient-to-r hover:from-[#404153] hover:to-[#333447] transition-all duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white font-medium group-hover:text-[#E27625] transition-colors duration-200">
          {title}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-white transition-all duration-200 group-hover:text-[#E27625] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div
          className="flex flex-col bg-gradient-to-b from-[#2A2A3E] to-[#333447] relative"
          ref={calendarRef}
        >
          {isDateFilter && (
            <div className="relative z-20 border-b border-[#404153]">
              <div
                ref={dateSelectRef}
                className="flex items-center justify-between py-3 px-4 text-white hover:bg-gradient-to-r hover:from-[#404153] hover:to-[#525266] transition-all duration-200 cursor-pointer group"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <span className="group-hover:text-[#3B82F6] transition-colors duration-200">
                  {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                </span>
                <div className="flex items-center space-x-2">
                  {selectedDate && (
                    <button
                      onClick={clearDate}
                      className="hover:bg-[#525266] rounded-full p-1 transition-colors duration-200"
                    >
                      <X className="h-4 w-4 text-white hover:text-[#EF4444]" />
                    </button>
                  )}
                  <Calendar className="h-5 w-5 text-white group-hover:text-[#3B82F6] transition-colors duration-200" />
                </div>
              </div>

              {isCalendarOpen && (
                <div
                  className="absolute left-0 right-0 z-50 mt-1 bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl shadow-2xl border border-[#525266]"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    width: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="text-white w-full"
                    classNames={{
                      root: "p-4 w-full",
                      caption: "flex justify-center items-center relative mb-4",
                      nav: "flex items-center",
                      nav_button:
                        "h-8 w-8 bg-gradient-to-r from-[#404153] to-[#525266] hover:from-[#525266] hover:to-[#404153] text-white rounded-full transition-all duration-200",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      head: "flex mb-2",
                      head_cell:
                        "text-xs font-medium text-[#A1A1AA] w-9 text-center",
                      cell: "h-9 w-9 text-center text-sm p-0 hover:bg-gradient-to-r hover:from-[#525266] hover:to-[#404153] rounded-lg transition-all duration-200",
                      day: "h-9 w-9 text-white hover:bg-gradient-to-r hover:from-[#525266] hover:to-[#404153] rounded-lg transition-all duration-200",
                      day_selected:
                        "bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#1D4ED8] hover:to-[#1E40AF] rounded-lg shadow-lg",
                      day_today:
                        "border-2 border-[#E27625] text-white rounded-lg",
                      day_outside: "text-[#6B7280] opacity-50",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {items.map((item, index) => (
            <div
              key={item.name}
              className={`flex items-center justify-between py-3 px-4 hover:bg-gradient-to-r hover:from-[#404153] hover:to-[#525266] transition-all duration-200 cursor-pointer group ${
                index < items.length - 1 ? "border-b border-[#404153]/50" : ""
              }`}
              onClick={() => toggleCheckbox(item.name)}
            >
              <label className="flex items-center cursor-pointer w-full">
                <div
                  className={`h-5 w-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                    checkedItems[item.name]
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] border-[#3B82F6] shadow-lg shadow-[#3B82F6]/30"
                      : "border-[#525266] hover:border-[#3B82F6]"
                  }`}
                >
                  {checkedItems[item.name] && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="ml-3 text-white group-hover:text-[#E5E5E5] transition-colors duration-200 font-medium">
                  {item.name}
                </span>
              </label>
              <span className="bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
