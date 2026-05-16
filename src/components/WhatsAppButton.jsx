import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = "1234567890"; // Replace with actual number
  const message = "Hi! I have a question about plant care.";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-8 right-8 z-[100] group">
      <div className="absolute bottom-full right-0 mb-4 scale-0 group-hover:scale-100 transition-transform origin-bottom-right duration-300">
        <div className="bg-surface-container-lowest glass-card p-4 rounded-2xl shadow-xl w-64 border border-outline-variant">
          <p className="font-label-md text-primary text-[12px] uppercase mb-1">Live Support</p>
          <p className="font-body-md text-on-surface mb-0">Ask our plant experts anything!</p>
        </div>
      </div>
      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-[0_8px_30px_rgb(37,211,102,0.4)]"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-2.32 0-4.591 1.255-5.593 3.256-.354.704-.394 1.507-.113 2.235l-1.325 3.96 4.1-.1c.321.084.649.127.979.127a6.002 6.002 0 005.952-6c0-3.308-2.692-6-6-6zm0-2c4.418 0 8 3.582 8 8a8.003 8.003 0 01-14.776 4.148L2 22l5.852-1.226A7.99 7.99 0 0112.031 22c4.418 0 8-3.582 8-8s-3.582-8-8-8z"></path>
        </svg>
      </a>
    </div>
  );
}
