import React, { useState } from 'react';
import { MarketAsset, MarketCategory } from '../types';

interface MarketMoversGridProps {
  stocks: MarketAsset[];
  crypto: MarketAsset[];
  currencies: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onNavigateCategory: (category: MarketCategory) => void;
  flashingAssets?: Record<string, 'up' | 'down'>;
}

export const MarketMoversGrid: React.FC<MarketMoversGridProps> = ({
  stocks,
  crypto,
  currencies,
  onSelectAsset,
  onNavigateCategory,
  flashingAssets = {},
}) => {
  const [expandedSection, setExpandedSection] = useState<{
    stocks: boolean;
    crypto: boolean;
    currencies: boolean;
  }>({
    stocks: false,
    crypto: false,
    currencies: false,
  });

  const toggleExpand = (section: 'stocks' | 'crypto' | 'currencies', category: MarketCategory) => {
    setExpandedSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderColumn = (
    title: string,
    items: MarketAsset[],
    sectionKey: 'stocks' | 'crypto' | 'currencies',
    targetCategory: MarketCategory
  ) => {
    const isExpanded = expandedSection[sectionKey];
    const displayItems = isExpanded ? items : items.slice(0, 4);

    return (
      <div className="border border-[#e0e3eb] rounded-2xl p-5 bg-white shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-[#131722] flex items-center gap-1.5">
              {title}
            </h3>
            <button
              onClick={() => toggleExpand(sectionKey, targetCategory)}
              className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
            >
              {isExpanded ? 'Show less' : 'See all'}
            </button>
          </div>

          <div className="space-y-3">
            {displayItems.map((item) => {
              const isPositive = item.change >= 0;
              const flash = flashingAssets[item.id];

              return (
                <div
                  key={item.id}
                  id={`mover-card-${item.id}`}
                  onClick={() => onSelectAsset(item)}
                  className={`flex items-center justify-between p-2 rounded-xl hover:bg-[#f0f3fa] transition-colors cursor-pointer ${
                    flash === 'up' ? 'tick-up' : flash === 'down' ? 'tick-down' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: item.badgeBgColor }}
                      className="w-9 h-9 rounded-full text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs"
                    >
                      {item.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#131722]">
                        {item.symbol}
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-[140px] sm:max-w-[180px]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-sm text-[#131722]">
                      {item.lastPrice < 1
                        ? item.lastPrice.toFixed(4)
                        : item.lastPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View in full screener button */}
        <div className="mt-4 pt-3 border-t border-[#f0f3fa] flex justify-end">
          <button
            onClick={() => onNavigateCategory(targetCategory)}
            className="text-[11px] font-semibold text-[#787b86] hover:text-[#2962ff] transition-colors"
          >
            Explore all {title.toLowerCase()} →
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderColumn('Most Active Stocks', stocks, 'stocks', 'stocks')}
      {renderColumn('Crypto Market', crypto, 'crypto', 'crypto')}
      {renderColumn('Currencies & Commodities', currencies, 'currencies', 'forex')}
    </section>
  );
};
