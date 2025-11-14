
import React, { useState } from 'react';
import { Book } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (book: Omit<Book, 'id'>) => void;
  isAdding: boolean;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook, isAdding }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !coverUrl || !description || rating === '' || rating < 0 || rating > 5) {
      setError('Please fill in all fields correctly. Rating must be between 0 and 5.');
      return;
    }
    setError('');
    onAddBook({
      title,
      author,
      coverUrl,
      description,
      rating: Number(rating),
      purchaseUrl,
    });
  };

  const inputStyles = "w-full bg-[#E8DDCB]/50 border border-[#D7C0AE]/50 rounded-lg p-3 text-[#4A2C2A] placeholder-[#6D4C41]/70 focus:outline-none focus:ring-2 focus:ring-[#6D4C41] transition-all disabled:opacity-50";

  return (
    <div
      className="fixed inset-0 bg-[#4A2C2A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-title"
    >
      <div
        className="bg-[#E8DDCB]/60 backdrop-blur-xl border border-[#D7C0AE]/50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] text-[#4A2C2A] flex flex-col overflow-hidden animate-fade-in relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 flex-shrink-0 border-b border-[#D7C0AE]/50">
           <h2 id="add-book-title" className="text-2xl font-bold text-center">Add a New Book</h2>
           <button
             onClick={onClose}
             className="absolute top-4 right-4 text-[#6D4C41] hover:text-[#4A2C2A] transition-colors z-10 p-1 rounded-full bg-[#4A2C2A]/10 hover:bg-[#4A2C2A]/20"
             aria-label="Close modal"
           >
             <CloseIcon />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-4 overflow-y-auto modal-scrollbar">
          <fieldset disabled={isAdding}>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={inputStyles}
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className={inputStyles}
                required
              />
              <input
                type="url"
                placeholder="Cover Image URL"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                className={inputStyles}
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`${inputStyles} h-32 resize-none`}
                required
              />
              <input
                type="number"
                placeholder="Rating (0.0 - 5.0)"
                value={rating}
                onChange={e => setRating(e.target.value === '' ? '' : parseFloat(e.target.value))}
                min="0"
                max="5"
                step="0.1"
                className={inputStyles}
                required
              />
              <input
                type="url"
                placeholder="Purchase Link (Optional)"
                value={purchaseUrl}
                onChange={e => setPurchaseUrl(e.target.value)}
                className={inputStyles}
              />
            </div>
          </fieldset>
          
          {error && <p className="text-[#A95C68] text-sm">{error}</p>}
          
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#4A2C2A]/10 hover:bg-[#4A2C2A]/20 text-[#4A2C2A] font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-[#4A2C2A] hover:bg-[#3E2723] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;