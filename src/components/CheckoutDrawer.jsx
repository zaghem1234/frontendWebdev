import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function CheckoutDrawer() {
  const { isOpen, closeCart, cartItems, removeItem, updateQuantity, getCartTotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm" 
        onClick={closeCart}
      ></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-surface-container-lowest shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
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

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-surface-container-low border-t border-outline-variant">
            <div className="flex justify-between items-center mb-6">
              <span className="font-body-md text-on-surface-variant">Subtotal</span>
              <span className="font-headline-lg text-[24px] text-primary">${getCartTotal().toFixed(2)}</span>
            </div>
            <p className="text-center mb-4 text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest">
              Shipping & taxes calculated at checkout
            </p>
            <button className="w-full bg-primary text-on-primary py-4 rounded-full font-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-[0.98]">
              Proceed to Checkout
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
