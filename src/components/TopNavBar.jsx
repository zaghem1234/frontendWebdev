import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

export default function TopNavBar() {
  const { openCart, cartItems } = useCartStore();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-primary">
          Verdant Oasis
        </Link>
        
        <div className="hidden md:flex items-center gap-gutter">
          <Link to="/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Shop</Link>
          <Link to="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Care Guides</Link>
          <Link to="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Our Story</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-primary p-2 rounded-full hover:bg-black/5 transition-colors">search</button>
          
          <button 
            onClick={openCart}
            className="relative text-primary p-2 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-error text-on-error text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
          
          <Link to="/admin" className="material-symbols-outlined text-primary p-2 rounded-full hover:bg-black/5 transition-colors">person</Link>
        </div>
      </div>
    </nav>
  );
}
