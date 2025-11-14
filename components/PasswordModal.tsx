
import React, { useState } from 'react';
import { ADMIN_PASSWORD } from '../constants';
import { CloseIcon } from './icons/CloseIcon';
import { KeyIcon } from './icons/KeyIcon';

interface PasswordModalProps {
  onClose: () => void;
  onPasswordVerified: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onPasswordVerified }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Simulate network delay for verification
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onPasswordVerified();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setIsVerifying(false);
    }, 500);
  };

  const inputStyles = "w-full bg-[#E8DDCB]/50 border border-[#D7C0AE]/50 rounded-lg p-3 pl-10 text-[#4A2C2A] placeholder-[#6D4C41]/70 focus:outline-none focus:ring-2 focus:ring-[#6D4C41] transition-all disabled:opacity-50";

  return (
    <div
      className="fixed inset-0 bg-[#4A2C2A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div
        className="bg-[#E8DDCB]/60 backdrop-blur-xl border border-[#D7C0AE]/50 rounded-2xl shadow-2xl w-full max-w-sm text-[#4A2C2A] flex flex-col overflow-hidden animate-fade-in relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 flex-shrink-0 border-b border-[#D7C0AE]/50">
           <h2 id="password-modal-title" className="text-2xl font-bold text-center">Enter Admin Password</h2>
           <button
             onClick={onClose}
             className="absolute top-4 right-4 text-[#6D4C41] hover:text-[#4A2C2A] transition-colors z-10 p-1 rounded-full bg-[#4A2C2A]/10 hover:bg-[#4A2C2A]/20"
             aria-label="Close modal"
           >
             <CloseIcon />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-4">
          <fieldset disabled={isVerifying} className="relative flex items-center">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6D4C41]/60">
                <KeyIcon />
             </div>
             <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputStyles}
                required
                autoFocus
              />
          </fieldset>
          
          {error && <p className="text-[#A95C68] text-sm text-center -mt-2">{error}</p>}
          
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#4A2C2A]/10 hover:bg-[#4A2C2A]/20 text-[#4A2C2A] font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-[#4A2C2A] hover:bg-[#3E2723] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isVerifying || !password}
            >
              {isVerifying ? 'Verifying...' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;