
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

  const inputStyles = "w-full bg-white/50 border border-white/30 rounded-lg p-3 pl-10 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/50 transition-all disabled:opacity-50";

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div
        className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl w-full max-w-sm text-black flex flex-col overflow-hidden animate-fade-in relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 flex-shrink-0 border-b border-white/30">
           <h2 id="password-modal-title" className="text-2xl font-bold text-center">Enter Admin Password</h2>
           <button
             onClick={onClose}
             className="absolute top-4 right-4 text-black/60 hover:text-black transition-colors z-10 p-1 rounded-full bg-black/10 hover:bg-black/20"
             aria-label="Close modal"
           >
             <CloseIcon />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-4">
          <fieldset disabled={isVerifying} className="relative flex items-center">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
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
          
          {error && <p className="text-red-600 text-sm text-center -mt-2">{error}</p>}
          
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-black/10 hover:bg-black/20 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
