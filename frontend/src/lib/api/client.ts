import { GraphQLClient } from 'graphql-request';
import { cache } from 'react';

// Build an absolute URL for all environments
function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // In the browser, target Next.js proxy to preserve cookies
    return `${window.location.origin}/api/shop`;
  }
  // On the server/RSC, use an absolute backend URL
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:3000/shop-api'
  );
}
const API_URL = getApiUrl();

// Create GraphQL client with caching and performance optimizations
export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lightweight retry wrapper around graphql-request
export async function requestGql<T = any>(query: string, variables?: Record<string, any>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await graphqlClient.request<T>(query, variables);
    } catch (error: any) {
      lastError = error;
      // Retry on network errors or 5xx responses
      const status = error?.response?.status as number | undefined;
      const isRetriable = status ? status >= 500 : true;
      if (i < attempts - 1 && isRetriable) {
        await new Promise(r => setTimeout(r, 150 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError as Error;
}

// Cached fetch wrapper for better performance
export const cachedFetch = cache(async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Cache-Control': 'max-age=300',
      ...options?.headers,
    },
    // Same-origin proxy means cookies are automatically sent by the browser
  });
  return response;
});

// Type definitions for better type safety
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset?: {
    preview: string;
  };
}

export interface Product {
  productId: string;
  productName: string;
  slug: string;
  description: string;
  currencyCode: string;
  priceWithTax: {
    min: number;
    max: number;
  };
  productAsset?: {
    preview: string;
  };
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    priceWithTax: number;
    stockLevel: string;
    options: Array<{
      code: string;
      name: string;
    }>;
  }>;
  featuredAsset?: {
    preview: string;
  };
  assets: Array<{
    preview: string;
  }>;
}

export interface CartItem {
  id: string;
  quantity: number;
  productVariant: {
    id: string;
    name: string;
    price: number;
    priceWithTax: number;
  };
}

export interface Cart {
  id: string;
  code: string;
  totalQuantity: number;
  totalWithTax: number;
  lines: CartItem[];
}

export interface AddressInput {
  fullName: string;
  streetLine1: string;
  city: string;
  countryCode: string;
  phoneNumber: string;
}