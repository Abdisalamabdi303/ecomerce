'use client';

import { ShoppingBag, X, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/api/hooks';
import Link from 'next/link';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cart, updateCartItem, removeFromCart, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    setIsUpdating(lineId);
    try {
      await updateCartItem(lineId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    setIsUpdating(lineId);
    try {
      await removeFromCart(lineId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 glass backdrop-blur-xl">
      <div className="max-w-lg mx-auto px-6 pt-20 h-full flex flex-col">
        <div className="glass rounded-2xl p-6 flex flex-col h-full max-h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-white">Shopping Bag</h2>
              <p className="text-white/60 text-sm mt-1">
                {cart?.totalQuantity || 0} item{(cart?.totalQuantity || 0) !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {cart?.lines && cart.lines.length > 0 ? (
              cart.lines.map((item) => (
                <div key={item.id} className="glass p-4 rounded-xl">
                  <div className="flex items-start space-x-4">
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-8 w-8 text-white/50" />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold truncate">{item.productVariant.name}</h3>
                      <p className="text-primary font-bold text-lg">
                        KES {item.productVariant.priceWithTax.toLocaleString()}
                      </p>
                      <p className="text-white/60 text-sm">
                        Each • {item.quantity} × KES {item.productVariant.priceWithTax.toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating === item.id}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/70 text-sm">Quantity</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isUpdating === item.id || item.quantity <= 1}
                        className="p-2 glass rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-white font-bold px-4 py-2 glass rounded-lg min-w-[3rem] text-center">
                        {isUpdating === item.id ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating === item.id}
                        className="p-2 glass rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="h-20 w-20 text-white/30 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Your bag is empty</h3>
                <p className="text-white/60 mb-8">
                  Discover our collection of luxury fragrances
                </p>
                <button
                  onClick={onClose}
                  className="glass px-8 py-3 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout */}
          {cart && cart.lines.length > 0 && (
            <div className="flex-shrink-0 space-y-4">
              {/* Summary */}
              <div className="glass p-4 rounded-xl">
                <div className="flex justify-between items-center text-white mb-2">
                  <span className="text-lg">Subtotal</span>
                  <span className="text-lg font-bold">
                    KES {cart.totalWithTax.toLocaleString()}
                  </span>
                </div>
                <p className="text-white/60 text-sm">
                  Shipping calculated at checkout
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full glass py-4 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;




