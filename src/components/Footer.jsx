import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-16 bg-surface-container-lowest border-t border-outline-variant/30 mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <span className="font-headline-md text-headline-md text-primary font-bold block">Plant Beauty</span>
          <p className="font-body-md text-on-surface-variant text-sm leading-relaxed max-w-sm">
            Nurturing your indoor forest with premium, handpicked tropical plants. Transformed directly from our green nursery to your cozy home.
          </p>
          <div className="flex gap-3 pt-2">
            <a 
              href="https://facebook.com/plantbeauty" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-primary/5 hover:bg-primary hover:text-on-primary text-primary p-3 rounded-full transition-all duration-300 flex items-center justify-center"
              aria-label="Visit our Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="mailto:info@plantbeauty.com" 
              className="bg-primary/5 hover:bg-primary hover:text-on-primary text-primary p-3 rounded-full transition-all duration-300 flex items-center justify-center"
              aria-label="Email us"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Business details and contacts */}
        <div className="space-y-4">
          <h4 className="font-headline-sm text-headline-sm text-primary">Get in Touch</h4>
          <div className="space-y-3 font-body-md text-sm text-on-surface-variant">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Nursery Block:</strong> Plaza #14, Sector D-12, Islamabad, Pakistan
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <a href="mailto:support@plantbeauty.com" className="hover:underline hover:text-primary transition-all">
                support@plantbeauty.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <a href="tel:+923001234567" className="hover:underline hover:text-primary transition-all">
                +92 (300) 123-4567
              </a>
            </div>
          </div>
        </div>

        {/* Google Maps Location Finder */}
        <div className="space-y-4">
          <h4 className="font-headline-sm text-headline-sm text-primary">Our Location</h4>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Come visit our tropical garden nursery, explore healthy plants in person, and chat with our head botanist!
          </p>
          <a 
            href="https://maps.google.com/?q=Islamabad,+Pakistan" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-xs px-5 py-3 rounded-full hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-0"
          >
            <span>Open in Google Maps</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Copyright line */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-t border-outline-variant/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body-md text-on-surface-variant">
        <span>© 2026 Plant Beauty. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="#" className="hover:underline hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:underline hover:text-primary transition-colors">Shipping Info</Link>
          <Link to="#" className="hover:underline hover:text-primary transition-colors">Return Policy</Link>
        </div>
      </div>
    </footer>
  );
}
