
import React from 'react';
import { Book } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onDelete: (id: number) => void;
  isAdminMode: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onDelete, isAdminMode }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when delete is clicked
    onDelete(book.id);
  };

  return (
    <div
      className="group cursor-pointer perspective-1000"
      onClick={() => onSelect(book)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onSelect(book); }}
      aria-label={`View details for ${book.title}`}
    >
      <div className="relative w-full aspect-[2/3] rounded-lg shadow-lg overflow-hidden transition-all duration-500 transform-style-3d transform group-hover:scale-105 group-hover:rotate-y-10 group-hover:shadow-2xl">
        {isAdminMode && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 z-10 p-2 bg-black/40 rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500/80 hover:text-white"
            aria-label={`Delete ${book.title}`}
          >
            <TrashIcon />
          </button>
        )}

        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-white font-bold text-md drop-shadow-md truncate">{book.title}</h3>
          <p className="text-white/80 text-sm drop-shadow-sm truncate">{book.author}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
