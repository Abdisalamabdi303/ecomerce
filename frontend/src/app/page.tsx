'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedCollection from '@/components/FeaturedCollection';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import Cart from '@/components/Cart';
import { useToast } from '@/components/Toast';

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { ToastContainer } = useToast();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        onSearchClick={() => setIsSearchOpen(true)} 
        onCartClick={() => setIsCartOpen(true)}
      />
      
      {/* Search Overlay */}
      <SearchBar 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Cart Overlay */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Collection */}
        <FeaturedCollection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
