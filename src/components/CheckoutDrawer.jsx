import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle, ArrowLeft, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../lib/supabase';

export default function CheckoutDrawer() {
  const { isOpen, closeCart, cartItems, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();

  // Wizard States: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState('cart');

  // Checkout Form Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [onlineSender, setOnlineSender] = useState('');

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isOpen) return null;

  // Calculation parameters
  const subtotal = getCartTotal();
  const deliveryCharges = subtotal > 150 ? 0 : 15;
  const totalAmount = subtotal + deliveryCharges;
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const estDelivery = "2 to 3 Working Days 🚚";

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create Order record in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: null, // Guest checkout
          subtotal: subtotal,
          status: 'Pending',
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          payment_method: paymentMethod + (onlineSender ? ` (Sender: ${onlineSender})` : ''),
          delivery_charges: deliveryCharges,
          total_amount: totalAmount
        })
        .select()
        .single();

      if (orderError) throw orderError;
      const orderId = orderData.id;
      setPlacedOrderId(orderId);

      // 2. Create Order Items records in Supabase
      const itemsToInsert = cartItems.map(item => ({
        order_id: orderId,
        plant_id: item.id,
        quantity: item.quantity,
        pot_size: item.potSize,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Clear cart & transition step
      clearCart();
      setStep('success');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Error placing your order. Make sure you ran the orders_migration.sql script in Supabase SQL editor!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('cart');
    setEmail('');
    setPhone('');
    setAddress('');
    setPaymentMethod('COD');
    setOnlineSender('');
    setPlacedOrderId('');
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm" 
        onClick={closeCart}
      ></div>
      
      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-surface-container-lowest shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* ======================================= */}
        {/* VIEW 1: CART LIST                       */}
        {/* ======================================= */}
        {step === 'cart' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant">
              <h2 className="font-headline-md text-headline-md text-primary">Your Cart</h2>
              <button onClick={closeCart} className="text-on-surface-variant hover:text-primary">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
                  <span className="material-symbols-outlined text-6xl mb-4 text-outline-variant">shopping_basket</span>
                  <p className="font-body-md">Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.potSize}`} className="flex gap-4 border-b border-outline-variant pb-6 last:border-0 last:pb-0">
                    <img 
                      src={item.image_url || 'https://placehold.co/80x80/2d4a2d/ffffff?text=Plant'} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-label-md text-[14px] text-on-surface">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.id, item.potSize)}
                            className="text-on-surface-variant hover:text-error"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[12px] text-on-surface-variant mt-1 font-label-md uppercase">{item.potSize} Pot</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 border border-outline-variant rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.potSize, item.quantity - 1)}
                            className="text-on-surface-variant hover:text-primary"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-label-md text-[12px]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.potSize, item.quantity + 1)}
                            className="text-on-surface-variant hover:text-primary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-headline-md text-[16px] text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Cart Subtotal */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-surface-container-low border-t border-outline-variant">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-headline-lg text-[24px] text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-center mb-4 text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest">
                  Shipping & taxes calculated at checkout
                </p>
                <button 
                  onClick={() => setStep('checkout')}
                  className="w-full bg-primary text-on-primary py-4 rounded-full font-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* ======================================= */}
        {/* VIEW 2: CHECKOUT DETAILS FORM           */}
        {/* ======================================= */}
        {step === 'checkout' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant">
              <button 
                onClick={() => setStep('cart')}
                className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Cart
              </button>
              <h2 className="font-headline-md text-headline-sm text-primary">Checkout details</h2>
              <button onClick={closeCart} className="text-on-surface-variant hover:text-primary">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Pricing & Estimate Summary */}
                <div className="glass-card p-4 bg-primary/5 rounded-xl border border-primary/15 space-y-2">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Quantity of items:</span>
                    <span className="font-bold text-on-surface">{totalQuantity} plants</span>
                  </div>
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Bill Amount:</span>
                    <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Delivery Charges:</span>
                    <span className="font-bold text-on-surface">{deliveryCharges === 0 ? "FREE" : `$${deliveryCharges.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-outline-variant/10 pt-2 flex justify-between text-sm font-bold text-primary">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-1 text-[10px] text-on-surface-variant leading-relaxed text-center">
                    🚚 Estimated Delivery Time: <strong className="text-primary">{estDelivery}</strong>
                  </div>
                </div>

                {/* 2. Customer Contact fields */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider font-bold">Contact details</h3>
                  
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1 font-medium">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. buyer@gmail.com"
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1 font-medium">Cell / Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0312-3456789"
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1 font-medium">Complete Delivery Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, Province, Zip code"
                      rows="3"
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* 3. Payment Method Select */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider font-bold">Payment Method</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-black/[0.01]'}`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('JazzCash')}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${paymentMethod === 'JazzCash' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-black/[0.01]'}`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>JazzCash Mobile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('EasyPaisa')}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${paymentMethod === 'EasyPaisa' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-black/[0.01]'}`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>EasyPaisa Mobile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Stripe')}
                      className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${paymentMethod === 'Stripe' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-black/[0.01]'}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Credit Card / Stripe</span>
                    </button>
                  </div>

                  {/* Advance Online Payment Guidance Details */}
                  {paymentMethod !== 'COD' && (
                    <div className="glass-card p-4 bg-secondary-container/20 border border-secondary-container rounded-xl space-y-3 animate-fade-in">
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        To pay via <strong>{paymentMethod}</strong>, please transfer the exact bill amount <strong>${totalAmount.toFixed(2)}</strong> to our account:
                      </p>
                      <div className="bg-white/60 p-2.5 rounded-lg border border-outline-variant/30 text-xs font-mono text-center">
                        <div>Account ID: <strong>0300-1234567</strong></div>
                        <div className="text-[10px] mt-0.5 text-on-surface-variant">Name: Plant Beauty Boutique</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-on-surface mb-1">Sender's Account Name / Reference ID</label>
                        <input 
                          type="text"
                          value={onlineSender}
                          onChange={(e) => setOnlineSender(e.target.value)}
                          placeholder="Sender Name or Transaction ID"
                          className="w-full px-2.5 py-1.5 bg-white border border-outline-variant rounded-md text-xs focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Button Footer */}
              <div className="p-6 bg-surface-container-low border-t border-outline-variant mt-auto">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary py-4 rounded-full font-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    `Place Order (${paymentMethod === 'COD' ? 'COD' : 'Pay Advance'})`
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ======================================= */}
        {/* VIEW 3: SUCCESS CONFIRMATION SCREEN      */}
        {/* ======================================= */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <CheckCircle className="w-20 h-20 text-primary animate-bounce" />
            
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">Order successfully placed!</h2>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Thank you for shopping at **Plant Beauty**! Your booking has been recorded.
              </p>
            </div>

            <div className="w-full bg-primary/5 rounded-2xl border border-primary/10 p-5 space-y-2 text-left">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Order Reference:</span>
                <span className="font-mono text-primary font-bold">{placedOrderId ? placedOrderId.slice(0, 13) : '...'}-PB</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Payment Plan:</span>
                <span className="font-bold text-on-surface">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Amount Billed:</span>
                <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Estimated Arrival:</span>
                <span className="font-bold text-on-surface">{estDelivery}</span>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <a
                href={`https://wa.me/1234567890?text=Hi%20Plant%20Beauty!%20My%20order%20reference%20is%20${placedOrderId}%20and%20I%20chose%20${paymentMethod}.%20Please%20confirm%20my%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25d366] text-white py-3.5 rounded-full font-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                WhatsApp Confirmation
              </a>

              <button
                onClick={handleReset}
                className="w-full bg-primary text-on-primary py-3.5 rounded-full font-label-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
