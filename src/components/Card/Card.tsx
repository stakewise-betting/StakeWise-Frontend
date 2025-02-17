import { useState } from "react";
import React from "react";
import {
  FaPlus,
  FaMinus,
  FaArrowUp,
  FaStar,
  FaRegStar,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { ButtonOutline } from "../Buttons/Buttons";
import { CardData } from "../../data/data";

const BettingPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState<number>(0);
  const minBetAmount = 5;

  const handleIncrement = () => {
    setBetAmount(betAmount + 1);
  };

  const handleDecrement = () => {
    if (betAmount > 0) {
      setBetAmount(betAmount - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card text-white p-4 rounded-md w-80 relative">
        <button
          className="absolute top-2 right-2 text-white text-lg"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src="https://via.placeholder.com/40" // Replace with the actual image URL
              alt="Max Verstappen"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-bold text-lg">Max Verstappen</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sub text-sm mb-2">Outcome</p>
          <div className="flex gap-4">
            <button className="flex-1 bg-green text-white py-2 rounded-md font-semibold">
              Yes $96.4
            </button>
            <button className="flex-1 bg-primary text-white py-2 rounded-md font-semibold">
              No $4.2
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sub text-sm mb-2">Amount</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                className="p-2 bg-primary rounded-md"
                onClick={handleDecrement}
                disabled={betAmount <= 0}
              >
                <FaMinus className="text-white" />
              </button>
              <span className="text-white font-semibold">${betAmount}</span>
              <button
                className="p-2 bg-primary rounded-md"
                onClick={handleIncrement}
              >
                <FaPlus className="text-white" />
              </button>
            </div>
            <span className="text-sub text-sm">Min $5.00</span>
          </div>
        </div>

        <button
          className={`w-full py-2 rounded-md font-semibold ${
            betAmount >= minBetAmount
              ? "bg-green text-white"
              : "bg-primary text-sub"
          }`}
          disabled={betAmount < minBetAmount}
        >
          Bet Now
        </button>

        <div className="mt-4 text-center text-sub text-sm">
          <p>Potential return</p>
          <p className="font-bold text-white">$0.00 (0.00%)</p>
        </div>

        <div className="mt-4 text-center text-sub text-xs">
          <p>
            By Betting, you agree to the{" "}
            <span className="text-secondary underline">Terms of Use</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Card = () => {
  const [showMore, setShowMore] = useState(false);
  const [interestedCards, setInterestedCards] = useState<number[]>([]);
  const [showBettingPanel, setShowBettingPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const toggleInterested = (index: number) => {
    setInterestedCards((prev) =>
      prev.includes(index)
        ? prev.filter((cardIndex) => cardIndex !== index)
        : [...prev, index]
    );
  };

  const filteredCards =
    selectedCategory === "All"
      ? CardData
      : CardData.filter((card) => card.category === selectedCategory);

  const displayedCards = showMore ? filteredCards : filteredCards.slice(0, 16);

  return (
    <div className="relative">
      {showBettingPanel && (
        <BettingPanel onClose={() => setShowBettingPanel(false)} />
      )}

      <div className="px-4 lg:px-16">
        {/* <div className="flex justify-center mb-4 space-x-4">
          {["All", "Sports", "Politics"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-secondary text-white"
                  : "bg-primary text-sub hover:bg-secondary hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {displayedCards.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-between max-h-100 max-w-[350px] p-3 pb-7 rounded-lg bg-card shadow-md text-accent relative transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
              onClick={() => setShowBettingPanel(true)}
            >
              <div
                className="absolute top-3 right-3 cursor-pointer text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleInterested(index);
                }}
              >
                {interestedCards.includes(index) ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-400" />
                )}
              </div>

              <div className="flex items-center">
                <img
                  src={item.image}
                  alt="Thumbnail"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <h3 className="text-sm font-semibold text-accent line-clamp-2">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-xs text-gray-400">$11.3m Vol.</p>

              <div className="flex justify-between items-center mt-4">
                <ButtonOutline className="flex items-center justify-center w-[45%] px-2 py-1 text-xs font-semibold text-green border-green/50 bg-green/30 hover:bg-green hover:text-white rounded-lg transition-all">
                  Buy Yes
                  <div className="flex flex-col ml-2">
                    <FaChevronUp />
                    <FaChevronUp className="-mt-2" />
                  </div>
                </ButtonOutline>

                <ButtonOutline className="flex items-center justify-center w-[45%] px-2 py-1 text-xs font-semibold text-red border-red/50 bg-red/30 hover:bg-red hover:text-white rounded-lg transition-all">
                  Buy No
                  <div className="flex flex-col ml-2">
                    <FaChevronDown />
                    <FaChevronDown className="-mt-2" />
                  </div>
                </ButtonOutline>
              </div>

              <div className="flex items-center mt-4">
                <div className="flex-1 flex items-center relative">
                  <div className="h-1 w-[73%] bg-green rounded-l-full"></div>
                  <div className="h-1 w-[27%] bg-red rounded-r-full"></div>

                  {/* Green text under the green line */}
                  <span className="absolute bottom-[-20px] left-0 text-green text-xs">
                    73% Yes
                  </span>
                  {/* Red text under the red line */}
                  <span className="absolute bottom-[-20px] right-0 text-red text-xs">
                    26% No
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length > 16 && (
          <div className="flex justify-center mt-6">
            <ButtonOutline
              onClick={() => setShowMore(!showMore)}
              className="flex items-center px-4 py-2 bg-secondary text-white rounded-md text-sm  border-0"
            >
              {showMore ? "Show Less" : "Show More"}
            </ButtonOutline>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
