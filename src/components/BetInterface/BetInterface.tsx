import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Star, Link2, FileText } from "lucide-react";

interface BetInterfaceProps {
  eventData: {
    id: string;
    name: string;
    description: string;
    imageURL: string;
    options: string[];
    startTime: number;
    endTime: number;
    isCompleted: boolean;
    winningOption: string;
    prizePool: string;
  };
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

export default function BetInterface({
  eventData,
  selectedOption,
  setSelectedOption,
}: BetInterfaceProps) {
  const [showMore, setShowMore] = useState(false);
  const displayedOptions = showMore
    ? eventData.options
    : eventData.options.slice(0, 3);
  const endDate = new Date(eventData.endTime * 1000).toLocaleDateString();

  return (
    <div className="lg:col-span-2">
      <div className="rounded-lg overflow-hidden bg-[#1C1C27]">
        <div className="p-6">
          <div className="flex items-start gap-6 mb-4">
            <img
              src={eventData.imageURL}
              alt={eventData.name}
              width={80}
              height={80}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">{eventData.name}</h1>
            </div>
          </div>

          <div className="mt-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>{eventData.prizePool} ETH Vol.</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{endDate}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="rounded-md p-2 text-gray-400 hover:bg-gray-800">
                <Star className="h-5 w-5" />
              </button>
              <button className="rounded-md p-2 text-gray-400 hover:bg-gray-800">
                <Link2 className="h-5 w-5" />
              </button>
              <button className="rounded-md p-2 text-gray-400 hover:bg-gray-800">
                <FileText className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-2">
            <div className="flex justify-between px-4 text-sm text-gray-400">
              <span>OUTCOME</span>
              <span>OPTION</span>
            </div>

            {displayedOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#333447] rounded-lg"
              >
                <div
                  className={`flex items-center gap-4 ${
                    selectedOption === option ? "text-[#00BD58]" : ""
                  }`}
                >
                  <span>{option}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedOption(option)}
                    className="rounded-md bg-[#00BD58] px-4 py-2 text-white hover:bg-[#0c923d]"
                  >
                    Buy Yes
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showMore && eventData.options.length > 3 && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="rounded-md border border-gray-700 bg-[#E27625] px-4 py-1.5 text-sm text-[#ffffff] hover:bg-[#be7c4a] hover:text-white"
                onClick={() => setShowMore(true)}
              >
                See more
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-[#1C1C27] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Rules</h2>
        <div className="space-y-4 text-slate-400">
          <p>{eventData.description}</p>
        </div>
      </div>
    </div>
  );
}
