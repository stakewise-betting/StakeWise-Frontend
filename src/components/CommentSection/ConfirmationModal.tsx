// src/components/CommentSystem/ConfirmationModal.tsx
import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  dangerButtonClasses: string; // Pass these from CommentSection for consistency
  cancelButtonClasses: string; // Pass these from CommentSection for consistency
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isConfirming,
  title,
  message,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  dangerButtonClasses,
  cancelButtonClasses,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 flex items-center justify-center p-4"
      onClick={onClose}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-2xl shadow-2xl max-w-md w-full border border-[#404153] transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] shadow-lg shadow-[#EF4444]/30">
              <RiErrorWarningLine
                className="h-8 w-8 text-white"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-xl font-bold text-white mb-3"
                id="modal-title"
              >
                {title}
              </h3>
              <p className="text-[#A1A1AA] leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#333447] to-[#404153] px-8 py-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl border-t border-[#525266]">
          <button
            type="button"
            className={`${cancelButtonClasses} flex-1 sm:flex-initial`}
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            className={`${dangerButtonClasses} flex-1 sm:flex-initial min-w-[120px]`}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming && (
              <AiOutlineLoading3Quarters
                className="animate-spin mr-2"
                size={16}
              />
            )}
            {isConfirming ? "Deleting..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
