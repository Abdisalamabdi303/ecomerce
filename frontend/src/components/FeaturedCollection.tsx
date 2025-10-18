'use client';

import { ShoppingBag, Star, Plus } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useSearchProducts, useCart } from '@/lib/api/hooks';
import Link from 'next/link';

// Mock product data for demonstration (replace with actual API data)
const mockProducts = [
  {
    productId: '1',
    productName: 'Noir de Noir',
    slug: 'noir-de-noir',
    description: 'A mysterious blend of dark roses and black truffle',
    currencyCode: 'KES',
    priceWithTax: { min: 45000, max: 45000 },
    productAsset: {
      preview: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    tag: 'Bestseller',
    rating: 4.9
  },
  {
    productId: '2',
    productName: 'Amber Absolute',
    slug: 'amber-absolute',
    description: 'Warm amber with hints of vanilla and sandalwood',
    currencyCode: 'KES',
    priceWithTax: { min: 42000, max: 42000 },
    productAsset: {
      preview: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    tag: 'New',
    rating: 4.8
  },
  {
    productId: '3',
    productName: 'Oud Wood',
    slug: 'oud-wood',
    description: 'Exotic oud with rosewood and cardamom',
    currencyCode: 'KES',
    priceWithTax: { min: 55000, max: 55000 },
    productAsset: {
      preview: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    tag: 'Limited',
    rating: 5.0
  }
];

interface ProductCardProps {
  product: typeof mockProducts[0];
  index: number;
  onAddToCart: (productId: string) => void;
}

const ProductCard = memo(({ product, index, onAddToCart }: ProductCardProps) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.productId);
  }, [product.productId, onAddToCart]);

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(product.rating)
            ? 'text-primary fill-current'
            : 'text-white/30'
        }`}
      />
    ));
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Bestseller':
        return 'bg-primary text-black';
      case 'New':
        return 'bg-secondary text-white';
      case 'Limited':
        return 'bg-red-600 text-white';
      default:
        return 'bg-white/20 text-white';
    }
  };

  return (
    <div
      className="group relative matte rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.productAsset?.preview}
          alt={product.productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Glass Overlay on Hover */}
        <div className="glass-overlay flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="glass px-6 py-3 rounded-full text-white font-bold flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Tag Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getTagStyle(product.tag)}`}
          >
            {product.tag}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          {renderStars()}
          <span className="text-sm text-white/60 ml-2">
            ({product.rating})
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300 cursor-pointer">
            {product.productName}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {product.currencyCode} {product.priceWithTax.min.toLocaleString()}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="p-3 glass rounded-full text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
            aria-label={`Add ${product.productName} to cart`}
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

const FeaturedCollection = () => {
  // Use the search API to get featured products
  const { data: searchData, isLoading, error } = useSearchProducts('luxury perfume', 0, 3);
  const { addToCart, isLoading: isAddingToCart } = useCart();
  
  // Use real API data if available, otherwise fall back to mock data for demo
  const products = searchData?.items && searchData.items.length > 0 ? searchData.items.map((item: any) => ({
    ...item,
    tag: 'Bestseller', // This could be added to your API as a custom field
    rating: 4.8 // This could be added to your API as a custom field
  })) : mockProducts;

  const handleAddToCart = useCallback(async (productId: string) => {
    try {
      // For demo purposes, we'll use the first variant
      // In a real app, you'd let users select variants
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // You could show a toast notification here
    }
  }, [addToCart]);

  if (error) {
    return (
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Signature Collection
            </h2>
            <div className="glass p-8 rounded-2xl max-w-md mx-auto">
              <p className="text-white/70 mb-4">
                Unable to load products at the moment.
              </p>
              <p className="text-white/50 text-sm">
                Please check your connection and try again.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Signature Collection
            </h2>
            <p className="text-xl text-white/70">
              Loading our most coveted fragrances...
            </p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="matte rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-white/10" />
                <div className="p-6">
                  <div className="h-4 bg-white/10 rounded mb-3" />
                  <div className="h-6 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-white/10 rounded w-24" />
                    <div className="h-10 w-10 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Signature Collection
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover our most coveted fragrances, each one a masterpiece of luxury and sophistication
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any, index: number) => (
            <ProductCard
              key={product.productId}
              product={product}
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 animate-fade-in">
          <Link
            href="/collections"
            className="inline-block glass px-12 py-4 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;




