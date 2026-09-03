import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { MarketAsset } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or window listener
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'indices', label: 'Indices' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'forex', label: 'Forex' },
    { key: 'futures', label: 'Commodities & Futures' },
  ];

  const filtered = allAssets.filter((item) => {
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.exchange.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#e0e3eb] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#787b86] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbols, companies, cryptocurrencies, or indices..."
            className="w-full text-base sm:text-lg font-medium text-[#131722] placeholder-[#787b86] outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#f0f3fa] flex items-center gap-2 overflow-x-auto no-scrollbar bg-gray-50/60">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedFilter === f.key
                  ? 'bg-[#131722] text-white'
                  : 'bg-white border border-gray-200 text-[#787b86] hover:text-[#131722]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-gray-100 p-2 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#787b86]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for AAPL, BTC, S&P 500, or Gold</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectAsset(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f0f3fa] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: item.badgeBgColor }}
                      className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center flex-shrink-0"
                    >
                      {item.badgeText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff]">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#787b86]">{item.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="font-bold text-sm text-[#131722]">
                        {item.lastPrice < 1
                          ? item.lastPrice.toFixed(4)
                          : item.lastPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </div>
                      <div
                        className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3 inline" />
                        ) : (
                          <TrendingDown className="w-3 h-3 inline" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-right text-[11px] text-[#787b86]">
          Press <kbd className="font-mono bg-white px-1.5 py-0.5 border rounded">ESC</kbd> to exit • Click any asset for full chart analysis
        </div>
      </div>
    </div>
  );
};
