'use client';

import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, MapPin, Truck } from 'lucide-react';
import { useCart, useCheckout, useShippingMethods } from '@/lib/api/hooks';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading } = useCart();
  const { data: shippingMethods } = useShippingMethods();
  const { setShippingAddress, setShippingMethod, addMpesaPayment, isLoading } = useCheckout();
  
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: '',
    streetLine1: '',
    city: '',
    countryCode: 'KE',
    phoneNumber: '',
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('');

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setShippingAddress(address);
      setStep(2);
    } catch (error) {
      console.error('Failed to set address:', error);
    }
  };

  const handleShippingSubmit = async () => {
    try {
      await setShippingMethod(selectedShippingMethod);
      setStep(3);
    } catch (error) {
      console.error('Failed to set shipping:', error);
    }
  };

  const handlePayment = async () => {
    try {
      await addMpesaPayment(mpesaPhoneNumber);
      // Handle payment success
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-white/70">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.lines.length) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Link
            href="/"
            className="glass px-8 py-3 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Shopping</span>
          </Link>
          <div className="text-white/60">
            Step {step} of 3
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Shipping Address</h2>
                    <p className="text-white/70">Where should we deliver your order?</p>
                  </div>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={address.phoneNumber}
                        onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                        placeholder="254XXXXXXXXX"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address.streetLine1}
                      onChange={(e) => setAddress({ ...address, streetLine1: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Country</label>
                      <select
                        value={address.countryCode}
                        onChange={(e) => setAddress({ ...address, countryCode: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors duration-200"
                      >
                        <option value="KE">Kenya</option>
                        <option value="UG">Uganda</option>
                        <option value="TZ">Tanzania</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all duration-300"
                  >
                    Continue to Shipping
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Shipping Method</h2>
                    <p className="text-white/70">Choose how you'd like your order delivered</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {shippingMethods?.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedShippingMethod === method.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      onClick={() => setSelectedShippingMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-bold">{method.name}</h3>
                          <p className="text-white/70 text-sm">{method.description}</p>
                        </div>
                        <div className="text-primary font-bold">
                          KES {method.priceWithTax.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleShippingSubmit}
                  disabled={!selectedShippingMethod || isLoading}
                  className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all duration-300"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">M-PESA Payment</h2>
                    <p className="text-white/70">Complete your purchase with M-PESA</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">M-PESA Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={mpesaPhoneNumber}
                      onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                      placeholder="254XXXXXXXXX"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                    />
                    <p className="text-white/60 text-sm mt-2">
                      You'll receive an STK push notification to complete the payment
                    </p>
                  </div>

                  <div className="glass p-4 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Smartphone className="h-6 w-6 text-primary" />
                      <span className="text-white font-bold">M-PESA STK Push</span>
                    </div>
                    <p className="text-white/70 text-sm">
                      We'll send a payment request to your phone. Enter your M-PESA PIN when prompted.
                    </p>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={!mpesaPhoneNumber || isLoading}
                    className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all duration-300"
                  >
                    {isLoading ? 'Processing...' : 'Pay with M-PESA'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.lines.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white/50" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.productVariant.name}</h4>
                      <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-white font-bold">
                      KES {(item.productVariant.priceWithTax * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>KES {cart.totalWithTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-primary">KES {cart.totalWithTax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


