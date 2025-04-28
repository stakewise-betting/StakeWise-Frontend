import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

interface ErrorPopupProps {
  message: string;
  onConfirm: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-md w-full p-6 bg-[#1C1C27] rounded-lg shadow-lg animate-in fade-in zoom-in duration-300">
        <Alert className="bg-red-900/20 border-red-900 text-white mb-4">
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
          <AlertTitle className="text-lg font-bold mb-2">Error</AlertTitle>
          <AlertDescription className="text-sm">{message}</AlertDescription>
        </Alert>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;