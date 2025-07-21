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
      <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-700/50 text-red-200 p-6 rounded-xl text-center backdrop-blur-sm shadow-2xl">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-lg font-semibold tracking-wider uppercase">
            Event Ended
          </span>
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 p-6 rounded-xl shadow-2xl">
      <div className="text-center mb-4">
        <p className="text-sm uppercase tracking-widest text-indigo-300 font-semibold mb-1">
          Event Ends In
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto"></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <div className="text-3xl font-bold text-white mb-1 font-mono">
            {timeLeft.days}
          </div>
          <p className="text-xs text-indigo-300 uppercase tracking-wide font-medium">
            Days
          </p>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <div className="text-3xl font-bold text-white mb-1 font-mono">
            {timeLeft.hours.toString().padStart(2, "0")}
          </div>
          <p className="text-xs text-indigo-300 uppercase tracking-wide font-medium">
            Hours
          </p>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <div className="text-3xl font-bold text-white mb-1 font-mono">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </div>
          <p className="text-xs text-indigo-300 uppercase tracking-wide font-medium">
            Minutes
          </p>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <div className="text-3xl font-bold text-white mb-1 font-mono">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </div>
          <p className="text-xs text-indigo-300 uppercase tracking-wide font-medium">
            Seconds
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
