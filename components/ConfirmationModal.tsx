
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { AlertIcon } from './icons/AlertIcon';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-[#4A2C2A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div
        className="bg-[#E8DDCB]/60 backdrop-blur-xl border border-[#D7C0AE]/50 rounded-2xl shadow-2xl w-full max-w-md text-[#4A2C2A] flex flex-col overflow-hidden animate-fade-in relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#A95C68]/20 mb-4">
                <AlertIcon />
            </div>
            <h2 id="confirmation-title" className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-[#6D4C41]/80">{message}</p>
        </div>

        <div className="p-4 bg-[#4A2C2A]/5 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#4A2C2A]/10 hover:bg-[#4A2C2A]/20 text-[#4A2C2A] font-bold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-[#A95C68] hover:bg-[#934b56] text-white font-bold py-3 rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;