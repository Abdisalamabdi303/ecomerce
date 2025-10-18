'use client';

import { Search, User, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/api/hooks';

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

const Header = ({ onSearchClick, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const navigationItems = [
    { name: 'Collections', href: '/collections' },
    { name: 'Signature', href: '/collections/signature' },
    { name: 'Discovery', href: '/collections/discovery' },
    { name: 'Gift Sets', href: '/collections/gift-sets' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                <span className="gradient-text">MAISON</span>
                <span className="text-white ml-1">LUXE</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/90 hover:text-white transition-colors duration-200 font-medium underline-animation"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={onSearchClick}
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              <Search className="h-6 w-6" />
            </button>
            <button className="text-white/90 hover:text-white transition-colors duration-200">
              <User className="h-6 w-6" />
            </button>
            <button 
              onClick={onCartClick}
              className="relative text-white/90 hover:text-white transition-colors duration-200"
            >
              <ShoppingBag className="h-6 w-6" />
              {cart && cart.totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass mt-4 rounded-lg p-4 animate-scale-in">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

