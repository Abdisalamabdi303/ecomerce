import { requestGql } from './client';
import type { Collection, ProductDetail, Cart, AddressInput } from './client';

// GraphQL Queries and Mutations with memoization and caching

// Collections Query
export const COLLECTIONS_QUERY = `
  query Collections {
    collections {
      items {
        id
        name
        slug
        description
        featuredAsset {
          preview
        }
      }
    }
  }
`;

// Search Products Query
export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($term: String!, $skip: Int = 0, $take: Int = 10) {
    search(
      input: {
        term: $term
        skip: $skip
        take: $take
      }
    ) {
      totalItems
      items {
        productId
        productName
        slug
        description
        currencyCode
        priceWithTax {
          min
          max
        }
        productAsset {
          preview
        }
      }
    }
  }
`;

// Product Detail Query
export const PRODUCT_QUERY = `
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      description
      variants {
        id
        name
        price
        priceWithTax
        stockLevel
        options {
          code
          name
        }
      }
      featuredAsset {
        preview
      }
      assets {
        preview
      }
    }
  }
`;

// Active Cart Query
export const ACTIVE_CART_QUERY = `
  query ActiveCart {
    activeOrder {
      id
      code
      totalQuantity
      totalWithTax
      lines {
        id
        quantity
        productVariant {
          id
          name
          price
          priceWithTax
        }
      }
      shippingAddress {
        fullName
        streetLine1
        city
      }
      shippingLines {
        shippingMethod {
          name
          description
        }
        priceWithTax
      }
    }
  }
`;

// Shipping Methods Query
export const SHIPPING_METHODS_QUERY = `
  query ShippingMethods {
    eligibleShippingMethods {
      id
      name
      description
      price
      priceWithTax
    }
  }
`;

// Mutations
export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($variantId: ID!, $quantity: Int!) {
    addItemToOrder(
      productVariantId: $variantId,
      quantity: $quantity
    ) {
      ... on Order {
        id
        code
        totalQuantity
        totalWithTax
        lines {
          productVariant {
            name
            price
          }
          quantity
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = `
  mutation UpdateCartItem($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(
      orderLineId: $lineId,
      quantity: $quantity
    ) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESS_MUTATION = `
  mutation SetShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order {
        id
        shippingAddress {
          fullName
          streetLine1
          city
          postalCode
          country
          phoneNumber
        }
      }
    }
  }
`;

export const SET_SHIPPING_METHOD_MUTATION = `
  mutation SetShipping($methodId: ID!) {
    setOrderShippingMethod(shippingMethodId: $methodId) {
      ... on Order {
        id
        shipping
        totalWithTax
      }
    }
  }
`;

export const ADD_MPESA_PAYMENT_MUTATION = `
  mutation AddMpesaPayment($phoneNumber: String!) {
    addPaymentToOrder(
      input: {
        method: "mpesa-payment-method"
        metadata: {
          phoneNumber: $phoneNumber
        }
      }
    ) {
      ... on Order {
        id
        state
        payments {
          id
          state
          metadata
        }
      }
    }
  }
`;

// Enhanced error handling
const handleApiError = (error: unknown, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  
  if (error && typeof error === 'object' && 'response' in error) {
    const graphqlError = error as { response: { errors?: Array<{ message: string }> } };
    // GraphQL errors
    const graphqlErrors = graphqlError.response.errors;
    if (graphqlErrors) {
      throw new Error(graphqlErrors.map((e) => e.message).join(', '));
    }
  } else if (error && typeof error === 'object' && 'request' in error) {
    // Network errors
    throw new Error('Network error: Unable to connect to the server');
  } else {
    // Other errors
    const errorMessage = error instanceof Error ? error.message : `Failed to ${operation}`;
    throw new Error(errorMessage);
  }
};

// API Functions with caching and error handling
export const api = {
  // Collections
  getCollections: async (): Promise<Collection[]> => {
    try {
      const data = await requestGql(COLLECTIONS_QUERY) as { collections?: { items: Collection[] } };
      return data.collections?.items || [];
    } catch (error) {
      handleApiError(error, 'fetch collections');
      return [];
    }
  },

  // Products
  searchProducts: async (term: string, skip = 0, take = 10) => {
    try {
      const data = await requestGql(SEARCH_PRODUCTS_QUERY, {
        term,
        skip,
        take,
      }) as { search?: { totalItems: number; items: any[] } };
      return data.search || { totalItems: 0, items: [] };
    } catch (error) {
      handleApiError(error, 'search products');
      return { totalItems: 0, items: [] };
    }
  },

  getProduct: async (slug: string): Promise<ProductDetail | null> => {
    try {
      const data = await requestGql(PRODUCT_QUERY, { slug }) as { product?: ProductDetail };
      return data.product || null;
    } catch (error) {
      handleApiError(error, 'fetch product');
      return null;
    }
  },

  // Cart Operations
  getActiveCart: async (): Promise<Cart | null> => {
    try {
      const data = await requestGql(ACTIVE_CART_QUERY) as { activeOrder?: Cart };
      return data.activeOrder || null;
    } catch (error) {
      // Cart might not exist yet, which is normal
      if (error && typeof error === 'object' && 'response' in error) {
        const graphqlError = error as { response: { errors?: Array<{ message: string }> } };
        if (graphqlError.response?.errors?.some((e) => e.message.includes('No active order'))) {
          return null;
        }
      }
      handleApiError(error, 'fetch cart');
      return null;
    }
  },

  addToCart: async (variantId: string, quantity: number) => {
    try {
      const data = await requestGql(ADD_TO_CART_MUTATION, {
        variantId,
        quantity,
      }) as { addItemToOrder: any };
      return data.addItemToOrder;
    } catch (error) {
      handleApiError(error, 'add to cart');
      throw error;
    }
  },

  updateCartItem: async (lineId: string, quantity: number) => {
    try {
      const data = await requestGql(UPDATE_CART_ITEM_MUTATION, {
        lineId,
        quantity,
      }) as { adjustOrderLine: any };
      return data.adjustOrderLine;
    } catch (error) {
      handleApiError(error, 'update cart item');
      throw error;
    }
  },

  removeFromCart: async (lineId: string) => {
    try {
      const data = await requestGql(REMOVE_FROM_CART_MUTATION, {
        lineId,
      }) as { removeOrderLine: any };
      return data.removeOrderLine;
    } catch (error) {
      handleApiError(error, 'remove from cart');
      throw error;
    }
  },

  // Checkout
  getShippingMethods: async () => {
    try {
      const data = await requestGql(SHIPPING_METHODS_QUERY) as { eligibleShippingMethods: any[] };
      return data.eligibleShippingMethods;
    } catch (error) {
      handleApiError(error, 'fetch shipping methods');
      return [];
    }
  },

  setShippingAddress: async (input: AddressInput) => {
    try {
      const data = await requestGql(SET_SHIPPING_ADDRESS_MUTATION, {
        input,
      }) as { setOrderShippingAddress: any };
      return data.setOrderShippingAddress;
    } catch (error) {
      handleApiError(error, 'set shipping address');
      throw error;
    }
  },

  setShippingMethod: async (methodId: string) => {
    try {
      const data = await requestGql(SET_SHIPPING_METHOD_MUTATION, {
        methodId,
      }) as { setOrderShippingMethod: any };
      return data.setOrderShippingMethod;
    } catch (error) {
      handleApiError(error, 'set shipping method');
      throw error;
    }
  },

  // Payment
  addMpesaPayment: async (phoneNumber: string) => {
    try {
      const data = await requestGql(ADD_MPESA_PAYMENT_MUTATION, {
        phoneNumber,
      }) as { addPaymentToOrder: any };
      return data.addPaymentToOrder;
    } catch (error) {
      handleApiError(error, 'add M-PESA payment');
      throw error;
    }
  },
};