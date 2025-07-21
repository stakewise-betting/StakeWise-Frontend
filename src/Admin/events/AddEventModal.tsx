// components/admin/events/AddEventModal.tsx
import React from "react";
import { createPortal } from "react-dom";
import { EventForm } from "./EventForm";
import { X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any; // Define contract type if possible
  web3: any; // Define Web3 type if possible
  onEventCreated: () => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  contract,
  web3,
  onEventCreated,
}) => {
  if (!isOpen) return null;

  // Effect to handle body scroll lock
  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  const modalContent = (
    // 1. Overlay with maximum z-index and full coverage
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ zIndex: 99999 }}
    >
      {/* 2. Modal Content container matching Dashboard theme */}
      <div
        className="relative bg-[#1C1C27] text-dark-primary rounded-xl shadow-2xl w-full max-w-5xl lg:max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-700/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3. Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-30 h-10 w-10 rounded-lg bg-black/20 border border-gray-700/60 text-dark-secondary hover:text-dark-primary hover:bg-secondary/20 hover:border-secondary/50 transition-all duration-300"
          onClick={onClose}
          aria-label="Close event creation form"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Modal Header matching Dashboard style */}
        <div className="p-6 border-b border-gray-700/60 bg-gradient-to-r from-[#1C1C27] to-primary/20 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-secondary/20 border border-gray-700/60 shadow-lg">
              <PlusCircle className="h-8 w-8 text-secondary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-dark-primary">
                Create New Event
              </h1>
              <p className="text-dark-secondary text-lg">
                Set up a new betting event with all the details
              </p>
            </div>
          </div>
        </div>

        {/* 5. Modal Body - Contains the EventForm */}
        <div className="flex-grow overflow-hidden">
          <EventForm
            contract={contract}
            web3={web3}
            onEventCreated={() => {
              onEventCreated();
            }}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document root level
  return createPortal(modalContent, document.body);
};
