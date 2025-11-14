
import React from 'react';
import { Book } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onDelete: (id: number) => void;
  isAdminMode: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-[#A1887F]">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {halfStar && (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z"/></svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-5 h-5 fill-current text-[#D7C0AE]" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
       <span className="ml-2 text-[#6D4C41] text-sm font-medium">{rating.toFixed(1)} / 5.0</span>
    </div>
  );
};

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose, onDelete, isAdminMode }) => {
  return (
    <div
      className="fixed inset-0 bg-[#4A2C2A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-title"
    >
      <div
        className="bg-[#E8DDCB]/60 backdrop-blur-xl border border-[#D7C0AE]/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] text-[#4A2C2A] flex flex-col md:flex-row overflow-hidden animate-fade-in relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6D4C41] hover:text-[#4A2C2A] transition-colors z-10 p-1 rounded-full bg-[#4A2C2A]/10 hover:bg-[#4A2C2A]/20"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        <div className="w-full md:w-1/3 h-64 md:h-auto flex-shrink-0">
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col overflow-y-auto modal-scrollbar">
          <div className="flex-grow">
            <h2 id="book-title" className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h2>
            <p className="text-lg text-[#6D4C41]/80 mb-4">{book.author}</p>
            <div className="mb-6">
              <StarRating rating={book.rating} />
            </div>
            <p className="text-base leading-relaxed text-[#4A2C2A]">
              {book.description}
            </p>
          </div>
          
          {(book.purchaseUrl || isAdminMode) && (
            <div className="mt-6 pt-6 border-t border-[#D7C0AE]/50 flex-shrink-0 flex flex-col gap-3">
              {book.purchaseUrl && (
                <a
                  href={book.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#8D6E63] hover:bg-[#795548] text-white font-bold py-3 rounded-lg transition-colors"
                  aria-label={`Purchase ${book.title}`}
                >
                  <ShoppingCartIcon />
                  <span>Buy Now</span>
                </a>
              )}
              {isAdminMode && (
                <button
                  onClick={() => onDelete(book.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#A95C68]/90 hover:bg-[#A95C68] text-white font-bold py-3 rounded-lg transition-colors"
                  aria-label={`Delete ${book.title}`}
                >
                  <TrashIcon />
                  <span>Delete Book</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;