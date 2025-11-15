import React, { useState } from 'react';
import { Book } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { GoogleGenAI, Type } from '@google/genai';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

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
  const [isbn, setIsbn] = useState('');
  const [tags, setTags] = useState('');
  
  const [formError, setFormError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  const handleSearch = async () => {
    if (!isbn) return;
    setIsSearching(true);
    setSearchError('');
    setFormError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          description: { type: Type.STRING },
          coverUrl: { type: Type.STRING },
          rating: { type: Type.NUMBER, description: 'A rating out of 5. Can be a float.' },
          purchaseUrl: { type: Type.STRING, description: 'A link to purchase the book. Can be an empty string.' },
          tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 3-5 relevant tags or keywords for the book, like "Fantasy", "Science Fiction", "Coming-of-Age".' },
        },
        required: ['title', 'author', 'description', 'coverUrl', 'rating'],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find book details for ISBN: ${isbn}. Provide title, author, a detailed description, a high-resolution cover image URL, an average user rating out of 5 (e.g., 4.5), a purchase link if available, and a few relevant genre or topic tags.`,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const bookData = JSON.parse(response.text);
      
      setTitle(bookData.title || '');
      setAuthor(bookData.author || '');
      setDescription(bookData.description || '');
      setCoverUrl(bookData.coverUrl || '');
      setRating(bookData.rating || '');
      setPurchaseUrl(bookData.purchaseUrl || '');
      setTags(bookData.tags?.join(', ') || '');

    } catch (e) {
      console.error(e);
      setSearchError('Could not find book details. Please check the ISBN or enter details manually.');
    } finally {
      setIsSearching(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !coverUrl || !description || rating === '' || rating < 0 || rating > 5) {
      setFormError('Please fill in all fields correctly. Rating must be between 0 and 5.');
      return;
    }
    setFormError('');

    const processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    onAddBook({
      title,
      author,
      coverUrl,
      description,
      rating: Number(rating),
      purchaseUrl,
      isbn,
      tags: processedTags,
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

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-4 overflow-y-auto modal-scrollbar">
            <fieldset disabled={isAdding}>
              <div>
                <label htmlFor="isbn-search" className="block text-sm font-medium text-[#4A2C2A] mb-1">Find with ISBN (optional)</label>
                <div className="flex items-center gap-2">
                    <input
                        id="isbn-search"
                        type="text"
                        placeholder="e.g., 9780321765723"
                        value={isbn}
                        onChange={e => {
                            setIsbn(e.target.value);
                            setSearchError('');
                        }}
                        className={inputStyles}
                        disabled={isSearching}
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="flex-shrink-0 bg-[#4A2C2A] text-white p-3 rounded-lg hover:bg-[#3E2723] transition-colors disabled:bg-[#4A2C2A]/50 disabled:cursor-not-allowed h-[46px] w-[46px] flex items-center justify-center"
                        disabled={isSearching || !isbn}
                        aria-label="Find book by ISBN"
                    >
                        {isSearching ? <SpinnerIcon /> : <SearchIcon />}
                    </button>
                </div>
                {searchError && <p className="text-[#A95C68] text-sm mt-2">{searchError}</p>}
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[#D7C0AE]/50" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[#E8DDCB]/60 px-2 text-sm text-[#6D4C41] backdrop-blur-sm">Or Enter Details Manually</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <input type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} className={inputStyles} required />
                <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className={inputStyles} required />
                <input type="url" placeholder="Cover Image URL" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className={inputStyles} required />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className={`${inputStyles} h-24 resize-none`} required />
                <input type="number" placeholder="Rating (0.0 - 5.0)" value={rating} onChange={e => setRating(e.target.value === '' ? '' : parseFloat(e.target.value))} min="0" max="5" step="0.1" className={inputStyles} required />
                <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} className={inputStyles} />
                <input type="url" placeholder="Purchase Link (Optional)" value={purchaseUrl} onChange={e => setPurchaseUrl(e.target.value)} className={inputStyles} />
              </div>
            </fieldset>
          </div>
          
          <div className="p-6 md:p-8 flex-shrink-0 border-t border-[#D7C0AE]/50">
            {formError && <p className="text-[#A95C68] text-sm text-center mb-4">{formError}</p>}
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="w-full bg-[#4A2C2A]/10 hover:bg-[#4A2C2A]/20 text-[#4A2C2A] font-bold py-3 rounded-lg transition-colors disabled:opacity-50" disabled={isAdding}>
                Cancel
              </button>
              <button type="submit" className="w-full bg-[#4A2C2A] hover:bg-[#3E2723] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Book'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;