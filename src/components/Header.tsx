import React, { useState } from 'react';
import { Search, Globe, User, ChevronDown, Check, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  activeNav?: string;
  onSelectNav?: (nav: string) => void;
  liveUpdatesEnabled: boolean;
  onToggleLiveUpdates: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  activeNav = 'Markets',
  onSelectNav,
  liveUpdatesEnabled,
  onToggleLiveUpdates,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navItems = ['Products', 'Community', 'Markets', 'Brokers'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e0e3eb] shadow-xs">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Global Search */}
        <div className="flex items-center gap-6 flex-1 max-w-xl">
          <a
            id="brand-logo"
            aria-label="TradingView Home"
            className="flex items-center gap-2 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav?.('Markets');
            }}
          >
            {/* Authentic TradingView Geometric 'TV' Icon */}
            <svg
              className="w-8 h-6 text-[#131722] group-hover:text-[#2962ff] transition-colors"
              fill="currentColor"
              viewBox="0 0 36 28"
            >
              <path d="M14 22H7V6h7v16zm15 0h-7V13h7v9zm-7-11h-8V6h8v5z" />
            </svg>
          </a>

          {/* Search Bar with Ctrl+K shortcut indicator */}
          <div className="relative w-full max-w-sm hidden sm:block">
            <button
              id="global-search-trigger"
              onClick={onOpenSearch}
              type="button"
              className="w-full flex items-center justify-between bg-[#f0f3fa] text-xs font-normal text-[#787b86] pl-9 pr-3 py-2 rounded-full border border-transparent hover:bg-[#e7eaf2] hover:border-[#e0e3eb] transition-all text-left"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787b86]">
                <Search className="w-4 h-4" />
              </div>
              <span>Search (Ctrl+K)</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-white rounded border border-gray-300 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#131722]">
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                id={`nav-${item.toLowerCase()}`}
                onClick={() => onSelectNav?.(item)}
                className={`py-5 transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
                    : 'text-[#131722] hover:text-[#2962ff]'
                }`}
              >
                {item}
              </button>
            );
          })}

          {/* More dropdown */}
          <div className="relative">
            <button
              id="nav-more-dropdown"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="hover:text-[#2962ff] transition-colors flex items-center gap-1 text-[#131722] cursor-pointer py-5"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5 mt-0.5 text-[#787b86]" />
            </button>

            {isMoreOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#e0e3eb] py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    showToast('Economic Calendar opened');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa] transition-colors"
                >
                  Economic Calendar
                </button>
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    showToast('Earnings Calendar opened');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa] transition-colors"
                >
                  Earnings Calendar
                </button>
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    showToast('Stock Heatmap opened');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa] transition-colors"
                >
                  Market Heatmap
                </button>
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    showToast('Pine Script Editor opened');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa] transition-colors"
                >
                  Pine Script™ Editor
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time simulation indicator / toggle button */}
          <button
            id="live-ticker-toggle"
            onClick={onToggleLiveUpdates}
            title={liveUpdatesEnabled ? 'Live market updates active' : 'Live market updates paused'}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#e0e3eb] hover:bg-[#f0f3fa] transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveUpdatesEnabled ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className="text-[#787b86] text-[11px]">
              {liveUpdatesEnabled ? 'Live Feed' : 'Paused'}
            </span>
          </button>

          {/* Mobile search button */}
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-full hover:bg-gray-100 text-[#131722]"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              id="language-selector-btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold hover:text-[#2962ff] transition-colors py-1.5 px-2 rounded-md hover:bg-gray-100"
            >
              <Globe className="w-4 h-4" />
              <span>{selectedLang}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-[#e0e3eb] py-1 z-50">
                {['EN', 'ES', 'DE', 'FR', 'JA', 'ZH'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLangOpen(false);
                      showToast(`Language switched to ${lang}`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#131722] hover:bg-[#f0f3fa]"
                  >
                    <span>{lang}</span>
                    {selectedLang === lang && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User profile icon */}
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="User profile"
              className="text-[#131722] hover:text-[#2962ff] p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-[#e0e3eb] p-3 z-50">
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <div className="text-xs font-bold text-[#131722]">Guest Trader</div>
                  <div className="text-[11px] text-[#787b86]">Pro Plan (Demo Trial)</div>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    showToast('Watchlist opened');
                  }}
                  className="w-full text-left py-1.5 text-xs text-[#131722] hover:text-[#2962ff]"
                >
                  My Watchlists
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    showToast('Trading alerts opened');
                  }}
                  className="w-full text-left py-1.5 text-xs text-[#131722] hover:text-[#2962ff]"
                >
                  Price Alerts
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    showToast('Account settings opened');
                  }}
                  className="w-full text-left py-1.5 text-xs text-[#131722] hover:text-[#2962ff]"
                >
                  Settings & Security
                </button>
              </div>
            )}
          </div>

          {/* Call to Action Button */}
          <button
            id="get-started-btn"
            onClick={() => showToast('Welcome to TradingView! Sign-up flow initiated.')}
            className="btn-tv-gradient text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-full transition-all duration-200 shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get started</span>
          </button>
        </div>
      </div>

      {/* Quick feedback notification toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131722] text-white text-xs py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#089981]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
};
