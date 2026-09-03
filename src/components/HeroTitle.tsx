import React, { useState } from 'react';
import { ChevronDown, Sparkles, SlidersHorizontal } from 'lucide-react';
import { MarketCategory } from '../types';

interface HeroTitleProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  onFilterQuickMarket?: (region: string) => void;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({
  selectedCategory,
  onSelectCategory,
  onFilterQuickMarket,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories: { key: MarketCategory; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'indices', label: 'Indices' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'forex', label: 'Forex' },
    { key: 'futures', label: 'Futures' },
    { key: 'bonds', label: 'Bonds' },
    { key: 'world_economy', label: 'World Economy' },
  ];

  const marketRegions = [
    { name: 'All Global Markets', filter: 'all' },
    { name: 'US Equities & Treasuries', filter: 'us' },
    { name: 'European Exchanges', filter: 'europe' },
    { name: 'Asia-Pacific Hubs', filter: 'asia' },
    { name: 'Emerging Markets', filter: 'emerging' },
  ];

  return (
    <section className="pt-8 sm:pt-10 pb-6 text-center relative">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Main Title with Dropdown Chevron */}
        <div className="relative inline-block">
          <div
            id="hero-markets-title-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center justify-center gap-3 cursor-pointer group select-none transition-transform"
            role="button"
            tabIndex={0}
          >
            <h1 className="text-3xl sm:text-4xl md:text-[46px] font-extrabold tracking-tight text-[#131722]">
              Markets, everywhere
            </h1>
            <ChevronDown
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#131722] stroke-[3.5] transform transition-transform duration-200 group-hover:translate-y-0.5 ${
                isDropdownOpen ? 'rotate-180 text-[#2962ff]' : ''
              }`}
            />
          </div>

          {/* Markets Quick Switcher Menu */}
          {isDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-2xl shadow-xl border border-[#e0e3eb] p-2 z-30 text-left animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 text-[11px] font-semibold text-[#787b86] uppercase tracking-wider">
                Select Market Focus
              </div>
              {marketRegions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onFilterQuickMarket?.(region.filter);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#131722] hover:bg-[#f0f3fa] rounded-xl transition-colors cursor-pointer"
                >
                  <span>{region.name}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#2962ff] opacity-70" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation category pills / sub-tabs */}
        <div className="mt-8 flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 py-2 px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                id={`category-pill-${cat.key}`}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#131722] text-white shadow-xs scale-[1.02]'
                    : 'bg-[#f0f3fa] hover:bg-[#e4e7ef] text-[#131722]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
