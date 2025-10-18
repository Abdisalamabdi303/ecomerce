'use client';

import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchProducts } from '@/lib/api/hooks';
import { useCart } from '@/lib/api/hooks';

interface CollectionDetailProps {
  slug: string;
}

const CollectionDetail = ({ slug }: CollectionDetailProps) => {
  const { data: searchData, isLoading, error } = useSearchProducts(slug, 0, 50);
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // Filter and sort products
  const products = searchData?.items || [];
  const filteredProducts = products
    .filter(product => 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.priceWithTax.min - b.priceWithTax.min;
        case 'price-high':
          return b.priceWithTax.min - a.priceWithTax.min;
        case 'name':
        default:
          return a.productName.localeCompare(b.productName);
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loading Collection...
            </h1>
            <p className="text-xl text-white/70">
              Discovering our curated fragrances...
            </p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="matte rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-white/10" />
                <div className="p-4">
                  <div className="h-5 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-6 bg-white/10 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/collections"
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Collections</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 capitalize">
              {slug.replace(/-/g, ' ')}
            </h1>
            <div className="glass p-8 rounded-2xl max-w-md mx-auto">
              <p className="text-white/70 mb-4">
                {error ? 'Unable to load collection at the moment.' : 'No products found in this collection.'}
              </p>
              <p className="text-white/50 text-sm">
                {error ? 'Please check your connection and try again.' : 'Products may be added soon.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/collections"
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Collections</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 capitalize">
            {slug.replace(/-/g, ' ')}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover our carefully curated selection of luxury fragrances in this exclusive collection.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="glass rounded-2xl p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-white/70" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-white/70">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.productId}
                className="group matte rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  {product.productAsset?.preview ? (
                    <img
                      src={product.productAsset.preview}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-white/50 text-2xl font-bold">
                        {product.productName.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Quick Add Button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleAddToCart(product.productId)}
                      className="glass px-6 py-3 rounded-full text-white font-bold hover:bg-white/10 transition-all duration-200"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300 cursor-pointer">
                      {product.productName}
                    </h3>
                  </Link>
                  
                  {product.description && (
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">
                      {product.currencyCode} {product.priceWithTax.min.toLocaleString()}
                    </div>
                    
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-white/30 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-white/60">
              {searchTerm 
                ? `No products match "${searchTerm}"`
                : 'No products available in this collection'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;

