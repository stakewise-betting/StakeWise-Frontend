import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: number; // Unix timestamp in seconds
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000); // Convert to seconds
      const difference = endTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (60 * 60 * 24)),
        hours: Math.floor((difference % (60 * 60 * 24)) / (60 * 60)),
        minutes: Math.floor((difference % (60 * 60)) / 60),
        seconds: Math.floor(difference % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [endTime]);

  if (isExpired) {
    return (
      <div className="bg-red-900/30 text-red-300 p-3 rounded-lg text-center">
        Event Ended
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-3 rounded-lg">
      <p className="text-xs uppercase tracking-wider text-indigo-400 mb-1">
        Event Ends In
      </p>
      <div className="flex justify-between items-center">
        <div className="text-center">
          <span className="text-2xl font-bold">{timeLeft.days}</span>
          <p className="text-xs text-gray-400">Days</p>
        </div>
        <span className="text-xl mx-1">:</span>
        <div className="text-center">
          <span className="text-2xl font-bold">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <p className="text-xs text-gray-400">Hours</p>
        </div>
        <span className="text-xl mx-1">:</span>
        <div className="text-center">
          <span className="text-2xl font-bold">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <p className="text-xs text-gray-400">Mins</p>
        </div>
        <span className="text-xl mx-1">:</span>
        <div className="text-center">
          <span className="text-2xl font-bold">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <p className="text-xs text-gray-400">Secs</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
