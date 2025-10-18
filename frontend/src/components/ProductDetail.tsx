'use client';

import { ArrowLeft, ShoppingBag, Star, Heart, Share2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useProduct, useCart } from '@/lib/api/hooks';
import Link from 'next/link';

interface ProductDetailProps {
  slug: string;
}

const ProductDetail = ({ slug }: ProductDetailProps) => {
  const { data: product, isLoading, error } = useProduct(slug);
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant) return;
    
    try {
      await addToCart(selectedVariant, quantity);
      // Show success message or toast
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [product, selectedVariant, quantity, addToCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-white/10 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-white/10 rounded animate-pulse w-1/4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <p className="text-white/70 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="glass px-8 py-3 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Set default variant if none selected
  if (!selectedVariant && product.variants.length > 0) {
    setSelectedVariant(product.variants[0].id);
  }

  const currentVariant = product.variants.find(v => v.id === selectedVariant);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Collections</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={product.assets[selectedImage]?.preview || product.featuredAsset?.preview}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.assets.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.assets.map((asset, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={asset.preview}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Product Name */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'text-primary fill-current' : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/60 text-sm">(4.8) • 127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                KES {currentVariant?.priceWithTax.toLocaleString()}
              </div>
              <div className="text-white/60">
                {product.variants.length > 1 && 'Starting from '}
                KES {Math.min(...product.variants.map(v => v.priceWithTax)).toLocaleString()}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedVariant === variant.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-white font-bold">{variant.name}</div>
                      <div className="text-primary text-sm">
                        KES {variant.priceWithTax.toLocaleString()}
                      </div>
                      {variant.stockLevel === 'IN_STOCK' ? (
                        <div className="text-green-400 text-xs mt-1">In Stock</div>
                      ) : (
                        <div className="text-red-400 text-xs mt-1">Out of Stock</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 glass rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                >
                  -
                </button>
                <span className="text-white font-bold text-lg px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 glass rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!currentVariant || currentVariant.stockLevel !== 'IN_STOCK' || isAddingToCart}
                className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 glass py-3 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </button>
                <button className="flex-1 glass py-3 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white">Product Details</h3>
              <div className="space-y-2 text-white/70">
                <div className="flex justify-between">
                  <span>Brand:</span>
                  <span className="text-white">Maison Luxe</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span className="text-white">{currentVariant?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className={currentVariant?.stockLevel === 'IN_STOCK' ? 'text-green-400' : 'text-red-400'}>
                    {currentVariant?.stockLevel === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


