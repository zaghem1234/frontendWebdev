import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('verdant_popup_dismissed');
    if (!isDismissed) {
      // Small delay to let the initial page load first
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPopup = () => {
    localStorage.setItem('verdant_popup_dismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 relative border border-outline-variant">
        <button 
          onClick={dismissPopup}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="h-48 bg-primary-container relative overflow-hidden">
           <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB45jwkCwrMjzJCQanMmjlWI_1-FRkiTpBbgi7whY03_XQER9BJkzWMHaNKetavtPRxInKOr23yuRA6-DGDBWRU-Ngc-odl61AaAWXnoV4V0OuMNqmIPlBT6d1Pu4PRgDKWnVa9lNTklPWbUWzTQF7Oic6iqcKqec1JSsdAfvrNxcYA5di5CnCsOFkOKUADHDdLpcGZvBBVbOO4LC7filY8PiVW5oeMCQwEv1o08uVCC9Z0ZJCXpom9KRCsZdZAv0Y4AUdEZ8GxE4g" 
              alt="Promo background"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
           />
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="font-headline-lg text-headline-lg text-on-primary-container mb-2">Welcome to your Oasis</h2>
           </div>
        </div>
        
        <div className="p-8 text-center bg-surface">
          <p className="font-body-md text-on-surface-variant mb-6">
            Join our newsletter and receive a 15% discount on your first order. We promise to only send you the greenest of news.
          </p>
          
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-surface-container-low border border-outline focus:border-primary focus:ring-1 focus:ring-primary text-body-md px-4 py-3 rounded-lg"
            />
            <button 
              onClick={dismissPopup}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
            >
              Claim My Discount
            </button>
          </div>
          
          <button 
            onClick={dismissPopup}
            className="mt-4 font-label-md text-[12px] text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
