
import React, { useState, useEffect } from 'react';
import { Book } from './types';
import { BOOKS } from './constants';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import AddBookModal from './components/AddBookModal';
import { PlusIcon } from './components/icons/PlusIcon';
import SkeletonCard from './components/SkeletonCard';
import { LockIcon } from './components/icons/LockIcon';
import { UnlockIcon } from './components/icons/UnlockIcon';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Simulate fetching books from an API
    setTimeout(() => {
      setBooks(BOOKS);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseDetailModal = () => {
    setSelectedBook(null);
  };

  const handleAddBook = (newBookData: Omit<Book, 'id'>) => {
    setIsAddingBook(true);
    // Simulate an API call to add the book
    setTimeout(() => {
      const newBook: Book = {
        ...newBookData,
        id: Date.now(), // Use timestamp for a simple unique ID
      };
      setBooks(prevBooks => [newBook, ...prevBooks]);
      setIsAddingBook(false);
      setIsAddBookModalOpen(false);
    }, 1000);
  };

  const handleDeleteBook = (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      // If the deleted book was the one selected, close the modal
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(null);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 text-black">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-16">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-4xl md:text-6xl font-bold text-black">My Book Collection</h1>
            <div className="flex items-center gap-2">
              {isAdminMode && (
                <button
                  onClick={() => setIsAddBookModalOpen(true)}
                  className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-full p-3 text-black hover:bg-white/80 transition-all shadow-md hover:shadow-lg"
                  aria-label="Add new book"
                >
                  <PlusIcon />
                </button>
              )}
               <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-full p-3 text-black hover:bg-white/80 transition-all shadow-md hover:shadow-lg"
                  aria-label={isAdminMode ? "Disable Admin Mode" : "Enable Admin Mode"}
                >
                  {isAdminMode ? <UnlockIcon /> : <LockIcon />}
                </button>
            </div>
          </div>
          <p className="text-lg md:text-xl text-black/70">
            {isAdminMode ? "Admin mode enabled. You can now add and delete books." : "A relaxing journey through words and wonders"}
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)
            : books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={handleSelectBook}
                  onDelete={handleDeleteBook}
                  isAdminMode={isAdminMode}
                />
              ))}
        </div>
      </main>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={handleCloseDetailModal}
          onDelete={handleDeleteBook}
          isAdminMode={isAdminMode}
        />
      )}
      
      {isAddBookModalOpen && (
        <AddBookModal
          onClose={() => setIsAddBookModalOpen(false)}
          onAddBook={handleAddBook}
          isAdding={isAddingBook}
        />
      )}
    </div>
  );
};

export default App;
