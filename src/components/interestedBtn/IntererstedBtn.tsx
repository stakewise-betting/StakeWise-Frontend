import  { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const InterestedBtn = () => {
  const [isInterested, setIsInterested] = useState(false);
  const [count, setCount] = useState(99); // Initial count value

  const handleClick = () => {
    if (!isInterested) {
      setCount(count + 1);
    } else {
      setCount(count - 1);
    }
    setIsInterested(!isInterested);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center px-2 py-1 bg-orange text-white rounded-md shadow hover:bg focus:outline-none"
    >
      {/* Star Icon */}
      <span className="mr-1">
        {isInterested ? (
          <FaStar size={15} />
        ) : (
            <FaRegStar size={15} />
        )}
      </span>
      {/* Text */}
      <span className="mr-1 text-sm my-auto">Interested</span>
      {/* Divider */}
      <span className="mr-1 ">|</span>
      {/* Count */}
      <span className="text-sm">{count}+</span>
    </button>
  );
};

export default InterestedBtn;