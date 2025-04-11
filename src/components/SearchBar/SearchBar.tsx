import React, { useState } from "react";
import { FaFire, FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const BarComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    console.log("Search Query:", event.target.value);
  };

  return (
    <div className="bg-primary flex items-center px-16 py-5 gap-2 w-full overflow-x-auto whitespace-nowrap border-gray-700">
      {/* Fire Icon Button */}
      <button className="flex items-center px-3 py-2 bg-secondary text-[#ffffff] rounded-md text-sm font-semibold">
        <FaFire className="mr-1" /> Top
      </button>

      {/* Search Bar with Icon */}
      <div className="flex items-center flex-grow max-w-md px-3 py-2 bg-primary rounded-md border border-gray-600">
        <FaSearch className="text-accent mr-2" />
        <input
          type="text"
          placeholder="Search by market"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-transparent outline-none w-full placeholder-accent text-accent"
        />
      </div>

      {/* Category Tabs */}
      {[
        "New",
        "Sports",
        "Politics",
        "Breaking News",
        "Europa League",
        "Trump Cabinet",
        "US Election",
        "Games",
      ].map((tab, index) => (
        <button
          key={index}
          className="px-3 py-2 bg-card rounded-md text-sm text-accent border border-gray-600"
        >
          {tab}
        </button>
      ))}

      {/* Forward Arrow */}
      <button className="flex items-center px-3 py-2 bg-card rounded-md text-sm text-accent border border-gray-600">
        <IoIosArrowForward className="text-xl"/>
      </button>
    </div>
  );
};

export default BarComponent;
