import type React from "react";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OnlineUsersCounterProps {
  wsUrl: string;
  className?: string;
}

const OnlineUsersCounter: React.FC<OnlineUsersCounterProps> = ({
  wsUrl,
  className,
}) => {
  const [count, setCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [, setIsIncreasing] = useState<boolean | null>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    let previousCount = count;

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "onlineUsers" && typeof msg.count === "number") {
          setIsIncreasing(msg.count > previousCount);
          previousCount = msg.count;
          setCount(msg.count);
        }
      } catch {
        // non-JSON or unexpected message; ignore
      }
    };

    ws.addEventListener("message", handleMessage);

    ws.addEventListener("open", () => {
      console.log("WS connected");
      setIsConnected(true);
    });

    ws.addEventListener("close", () => {
      console.log("WS disconnected");
      setIsConnected(false);
    });

    ws.addEventListener("error", (err) => {
      console.error("WS error", err);
      setIsConnected(false);
    });

    return () => {
      ws.removeEventListener("message", handleMessage);
      ws.close();
    };
  }, [wsUrl, count]);

  return (
    <Card
      className={cn(
        "w-auto inline-flex shadow-md overflow-hidden border-none bg-[#333447]",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Users className="h-4 w-4 text-white" />
                  {isConnected ? (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  ) : (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-center">
                  <p className=" text-sm">online: {count}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineUsersCounter;
