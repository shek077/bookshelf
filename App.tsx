
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
import PasswordModal from './components/PasswordModal';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });


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

  const requestDeleteBook = (bookId: number) => {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;

    setConfirmationState({
      isOpen: true,
      title: 'Delete Book',
      message: `Are you sure you want to permanently delete "${bookToDelete.title}"? This action cannot be undone.`,
      onConfirm: () => confirmDeleteBook(bookId),
    });
  };

  const confirmDeleteBook = (bookId: number) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    if (selectedBook && selectedBook.id === bookId) {
      setSelectedBook(null);
    }
    closeConfirmationModal();
  };

  const closeConfirmationModal = () => {
    setConfirmationState({ isOpen: false, title: '', message: '', onConfirm: null });
  };


  const handleAdminToggle = () => {
    if (isAdminMode) {
      // If admin mode is on, just turn it off. No password needed.
      setIsAdminMode(false);
    } else {
      // If admin mode is off, open the password prompt.
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordVerified = () => {
    setIsAdminMode(true);
    setIsPasswordModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5EFE6] text-[#4A2C2A]">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-16">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-4xl md:text-6xl font-bold text-[#4A2C2A]">My Book Collection</h1>
            <div className="flex items-center gap-2">
              {isAdminMode && (
                <button
                  onClick={() => setIsAddBookModalOpen(true)}
                  className="bg-[#E8DDCB]/60 backdrop-blur-xl border border-[#D7C0AE]/50 rounded-full p-3 text-[#4A2C2A] hover:bg-[#E8DDCB]/80 transition-all shadow-md hover:shadow-lg"
                  aria-label="Add new book"
                >
                  <PlusIcon />
                </button>
              )}
               <button
                  onClick={handleAdminToggle}
                  className="bg-[#E8DDCB]/60 backdrop-blur-xl border border-[#D7C0AE]/50 rounded-full p-3 text-[#4A2C2A] hover:bg-[#E8DDCB]/80 transition-all shadow-md hover:shadow-lg"
                  aria-label={isAdminMode ? "Disable Admin Mode" : "Enable Admin Mode"}
                >
                  {isAdminMode ? <UnlockIcon /> : <LockIcon />}
                </button>
            </div>
          </div>
          <p className="text-lg md:text-xl text-[#6D4C41]/80">
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
                  onDelete={requestDeleteBook}
                  isAdminMode={isAdminMode}
                />
              ))}
        </div>
      </main>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={handleCloseDetailModal}
          onDelete={requestDeleteBook}
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

      {isPasswordModalOpen && (
        <PasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onPasswordVerified={handlePasswordVerified}
        />
      )}

      {confirmationState.isOpen && (
        <ConfirmationModal
          title={confirmationState.title}
          message={confirmationState.message}
          onConfirm={confirmationState.onConfirm!}
          onClose={closeConfirmationModal}
        />
      )}
    </div>
  );
};

export default App;