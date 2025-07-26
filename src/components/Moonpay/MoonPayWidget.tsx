// components/Moonpay/MoonPayWidget.tsx
import React, { useEffect, useRef } from "react";

interface MoonPayWidgetProps {
  apiKey: string;
  walletAddress: string;
}

const MoonPayWidget: React.FC<MoonPayWidgetProps> = ({
  apiKey,
  walletAddress,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://buy-sandbox.moonpay.com?apiKey=${apiKey}`;
    }
  }, [apiKey, walletAddress]);

  return (
    <div className="w-full max-w-lg mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        title="MoonPay Widget"
        className="w-full h-[600px]"
        allow="accelerometer; autoplay; camera; gyroscope; payment"
      />
    </div>
  );
};

export default MoonPayWidget;
