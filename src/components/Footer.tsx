import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const links = [
    { name: 'Terms of service', id: 'terms' },
    { name: 'Privacy policy', id: 'privacy' },
    { name: 'Cookies', id: 'cookies' },
    { name: 'Support', id: 'support' },
  ];

  return (
    <footer className="mt-auto border-t border-[#e0e3eb] py-8 text-xs text-[#787b86] bg-[#fafbfc]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-4 text-black inline" fill="currentColor" viewBox="0 0 36 28">
            <path d="M14 22H7V6h7v16zm15 0h-7V13h7v9zm-7-11h-8V6h8v5z" />
          </svg>
          <span>© 2024 TradingView</span>
        </div>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveModal(link.name)}
              className="hover:underline text-[#787b86] hover:text-[#131722] cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>

      {/* Info Popup for Footer Links */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[#131722] mb-2">{activeModal}</h3>
            <p className="text-xs text-[#787b86] leading-relaxed mb-4">
              TradingView is an advanced financial charting and social network used by over 50 million traders
              and investors worldwide to spot opportunities across global markets.
            </p>
            <div className="text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#131722] text-white rounded-lg text-xs font-semibold hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
