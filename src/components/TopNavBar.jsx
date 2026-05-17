import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function TopNavBar() {
  const { openCart, cartItems, searchQuery, setSearchQuery, openAccount } = useCartStore();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // Auto redirect to shop page if they start searching on another page
    if (location.pathname !== '/' && val.trim() !== '') {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-primary">
          Plant Beauty
        </Link>
        
        <div className="hidden md:flex items-center gap-gutter">
          <Link to="/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Shop</Link>
          <Link to="/care-guide" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Care Guides</Link>
          <Link to="/our-story" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Our Story</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Slide-out Search Input */}
          <div className="flex items-center gap-2 relative">
            {showSearch && (
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-3 py-1 bg-surface-container border border-outline-variant/60 rounded-full text-xs focus:outline-none focus:border-primary w-32 sm:w-48 bg-white/70 animate-in slide-in-from-right duration-200"
              />
            )}
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className="material-symbols-outlined text-primary p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              {showSearch ? 'close' : 'search'}
            </button>
          </div>
          
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
          
          <button 
            onClick={openAccount}
            className="material-symbols-outlined text-primary p-2 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center"
          >
            person
          </button>
        </div>
      </div>
    </nav>
  );
}
