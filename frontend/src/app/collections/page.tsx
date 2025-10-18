'use client';

import { useState } from 'react';
import { useCollections } from '@/lib/api/hooks';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function CollectionsPage() {
  const { data: collections, isLoading, error } = useCollections();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter collections based on search term
  const filteredCollections = collections?.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Collections
            </h1>
            <p className="text-xl text-white/70">
              Loading our curated collections...
            </p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/10" />
                <div className="p-6">
                  <div className="h-6 bg-white/10 rounded mb-3" />
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Collections
            </h1>
            <div className="glass p-8 rounded-2xl max-w-md mx-auto">
              <p className="text-white/70 mb-4">
                Unable to load collections at the moment.
              </p>
              <p className="text-white/50 text-sm">
                Please check your connection and try again.
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
            href="/"
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Collections
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover our carefully curated collections of luxury fragrances, each one a testament to craftsmanship and sophistication.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
            />
          </div>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300"
              >
                {/* Collection Image */}
                <div className="aspect-video relative overflow-hidden">
                  {collection.featuredAsset?.preview ? (
                    <img
                      src={collection.featuredAsset.preview}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-white/50 text-lg font-bold">
                        {collection.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Collection Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-white/70 text-sm line-clamp-3">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-white/30 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">No collections found</h3>
            <p className="text-white/60">
              {searchTerm 
                ? `No collections match "${searchTerm}"`
                : 'No collections available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
