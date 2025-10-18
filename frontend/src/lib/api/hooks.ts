'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { api } from './queries';
import type { Collection, Product, ProductDetail, Cart, AddressInput } from './client';

// Query Keys for cache management
export const queryKeys = {
  collections: ['collections'] as const,
  products: (term: string, skip: number, take: number) => ['products', term, skip, take] as const,
  product: (slug: string) => ['product', slug] as const,
  cart: ['cart'] as const,
  shippingMethods: ['shipping-methods'] as const,
} as const;

// Collections Hook with caching
export const useCollections = () => {
  return useQuery({
    queryKey: queryKeys.collections,
    queryFn: api.getCollections,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Products Search Hook with pagination
export const useSearchProducts = (term: string, skip = 0, take = 10) => {
  return useQuery({
    queryKey: queryKeys.products(term, skip, take),
    queryFn: () => api.searchProducts(term, skip, take),
    enabled: term.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Product Detail Hook with caching
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => api.getProduct(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Cart Hook with optimistic updates
export const useCart = () => {
  const queryClient = useQueryClient();
  
  const cartQuery = useQuery({
    queryKey: queryKeys.cart,
    queryFn: api.getActiveCart,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Add to Cart Mutation with optimistic updates
  const addToCartMutation = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      api.addToCart(variantId, quantity),
    onMutate: async ({ variantId, quantity }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });
      
      // Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart);
      
      // Optimistically update cart
      if (previousCart) {
        queryClient.setQueryData<Cart>(queryKeys.cart, (old) => ({
          ...old!,
          totalQuantity: old!.totalQuantity + quantity,
        }));
      }
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
    },
    onSettled: () => {
      // Refetch cart after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  // Update Cart Item Mutation
  const updateCartItemMutation = useMutation({
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
      api.updateCartItem(lineId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  // Remove from Cart Mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (lineId: string) => api.removeFromCart(lineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  // Memoized cart actions
  const cartActions = useMemo(
    () => ({
      addToCart: (variantId: string, quantity: number = 1) =>
        addToCartMutation.mutate({ variantId, quantity }),
      updateCartItem: (lineId: string, quantity: number) =>
        updateCartItemMutation.mutate({ lineId, quantity }),
      removeFromCart: (lineId: string) =>
        removeFromCartMutation.mutate(lineId),
      isLoading: addToCartMutation.isPending || 
                 updateCartItemMutation.isPending || 
                 removeFromCartMutation.isPending,
    }),
    [addToCartMutation, updateCartItemMutation, removeFromCartMutation]
  );

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,
    ...cartActions,
  };
};

// Shipping Methods Hook
export const useShippingMethods = () => {
  return useQuery({
    queryKey: queryKeys.shippingMethods,
    queryFn: api.getShippingMethods,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Checkout Mutations
export const useCheckout = () => {
  const queryClient = useQueryClient();

  const setShippingAddressMutation = useMutation({
    mutationFn: (input: AddressInput) => api.setShippingAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  const setShippingMethodMutation = useMutation({
    mutationFn: (methodId: string) => api.setShippingMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  const addMpesaPaymentMutation = useMutation({
    mutationFn: (phoneNumber: string) => api.addMpesaPayment(phoneNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });

  return {
    setShippingAddress: setShippingAddressMutation.mutate,
    setShippingMethod: setShippingMethodMutation.mutate,
    addMpesaPayment: addMpesaPaymentMutation.mutate,
    isLoading: setShippingAddressMutation.isPending ||
               setShippingMethodMutation.isPending ||
               addMpesaPaymentMutation.isPending,
    error: setShippingAddressMutation.error ||
           setShippingMethodMutation.error ||
           addMpesaPaymentMutation.error,
  };
};

// Debounced search hook for better performance
export const useDebouncedSearch = (term: string, delay = 300) => {
  const [debouncedTerm, setDebouncedTerm] = useState(term);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
    }, delay);

    return () => clearTimeout(timer);
  }, [term, delay]);

  return debouncedTerm;
};

// Memoized search results
export const useSearchResults = (term: string) => {
  const debouncedTerm = useDebouncedSearch(term);
  return useSearchProducts(debouncedTerm);
};