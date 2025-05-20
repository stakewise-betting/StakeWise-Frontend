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
      className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 flex items-center justify-center"
      onClick={onClose}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-card rounded-lg shadow-xl max-w-sm w-full overflow-hidden border border-gray-700 m-4 animate-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-admin-danger/10 sm:mx-0 sm:h-10 sm:w-10">
              <RiErrorWarningLine
                className="h-6 w-6 text-admin-danger"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-lg leading-6 font-semibold text-dark-primary"
                id="modal-title"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-sub">{message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-primary/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-700/60">
          <button
            type="button"
            className={`${dangerButtonClasses} w-full sm:ml-3 sm:w-auto`}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming && (
              <AiOutlineLoading3Quarters
                className="animate-spin mr-1.5"
                size={16}
              />
            )}
            {isConfirming ? "Processing..." : confirmButtonText}
          </button>
          <button
            type="button"
            className={`${cancelButtonClasses} mt-3 w-full sm:mt-0 sm:w-auto`}
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
