'use client';

import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSearchResults } from '@/lib/api/hooks';
import Link from 'next/link';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: searchResults, isLoading } = useSearchResults(searchTerm);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearchTerm = (term: string) => {
    if (term.trim() && !recentSearches.includes(term.trim())) {
      const newSearches = [term.trim(), ...recentSearches].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && searchTerm.trim()) {
      saveSearchTerm(searchTerm);
    }
  };

  const handleSearchClick = (term: string) => {
    setSearchTerm(term);
    saveSearchTerm(term);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 glass backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-6 pt-20">
        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for luxury fragrances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-16 pr-16 py-6 bg-white/10 border border-white/20 rounded-2xl text-white text-xl placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
          />
          <button
            onClick={handleClose}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading && searchTerm ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-white/70">Searching...</p>
            </div>
          ) : searchTerm && searchResults?.items ? (
            <div className="space-y-4">
              {searchResults.items.length > 0 ? (
                <>
                  <p className="text-white/70 text-sm flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Found {searchResults.totalItems} results
                  </p>
                  {searchResults.items.map((product) => (
                    <Link
                      key={product.productId}
                      href={`/product/${product.slug}`}
                      onClick={handleClose}
                      className="block glass p-4 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        {product.productAsset?.preview && (
                          <img
                            src={product.productAsset.preview}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">
                            {product.productName}
                          </h3>
                          <p className="text-white/70 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-primary font-bold">
                            {product.currencyCode} {product.priceWithTax.min.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">No products found</p>
                  <p className="text-white/50 text-sm mt-2">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          ) : !searchTerm && recentSearches.length > 0 ? (
            <div className="space-y-4">
              <p className="text-white/70 text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Searches
              </p>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchClick(search)}
                    className="w-full text-left glass p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white/80"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Start typing to search products</p>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-white/70 text-sm mb-4">Popular Searches:</p>
          <div className="flex flex-wrap gap-3">
            {['Tom Ford', 'Dior', 'Chanel', 'Maison Francis Kurkdjian', 'Creed'].map((term) => (
              <button
                key={term}
                onClick={() => handleSearchClick(term)}
                className="px-4 py-2 glass rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;