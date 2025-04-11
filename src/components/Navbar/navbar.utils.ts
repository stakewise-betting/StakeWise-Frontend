// src/components/navbar/navbar.utils.ts

/**
 * Formats a timestamp into a relative time string (e.g., "5 min ago", "yesterday").
 * @param timestamp - The timestamp in milliseconds.
 * @returns A formatted string representing the relative time.
 */
export const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
  
    if (seconds < 5) return `just now`;
    if (seconds < 60) return `${seconds} sec ago`;
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
  
    const days = Math.floor(hours / 24);
    if (days === 1) return `yesterday`;
    if (days < 7) return `${days} days ago`;
  
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };