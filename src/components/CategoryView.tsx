import React from 'react';
import { MarketAsset, MarketCategory, TechnicalRating } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CategoryViewProps {
  category: MarketCategory;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  flashingAssets?: Record<string, 'up' | 'down'>;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  assets,
  onSelectAsset,
  flashingAssets = {},
}) => {
  const getCategoryTitle = () => {
    switch (category) {
      case 'indices':
        return 'Global Stock Indices';
      case 'stocks':
        return 'Active Stocks & Equity Screener';
      case 'crypto':
        return 'Cryptocurrency Market Overview';
      case 'forex':
        return 'Forex Exchange Rates';
      case 'futures':
        return 'Commodities & Energy Futures';
      case 'bonds':
        return 'Government Sovereign Bond Yields';
      case 'world_economy':
        return 'Macroeconomic Global Indicators';
      default:
        return 'Markets Overview';
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case 'indices':
        return 'Monitor benchmark composite equities performance across world exchanges.';
      case 'stocks':
        return 'Real-time prices, volume leaders, and technical ratings for major corporations.';
      case 'crypto':
        return 'Live spot rates, 24h market momentum, and circulating market caps.';
      case 'forex':
        return 'Currencies cross rates and major foreign exchange pairs.';
      case 'futures':
        return 'Crude oil, gold, silver, agricultural, and energy contract prices.';
      case 'bonds':
        return 'Sovereign Treasury yields tracking monetary policy and interest rate expectations.';
      case 'world_economy':
        return 'GDP growth, inflation rates, and central bank benchmark policy rates.';
      default:
        return 'Live financial market benchmarks and asset prices.';
    }
  };

  const renderBadgeRating = (rating?: TechnicalRating) => {
    switch (rating) {
      case 'Strong Buy':
      case 'Buy':
        return (
          <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#e7f7f4] text-[#089981] border border-[#b2e5dc]">
            {rating}
          </span>
        );
      case 'Sell':
      case 'Strong Sell':
        return (
          <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#fdecee] text-[#f23645] border border-[#fccfd3]">
            {rating}
          </span>
        );
      case 'Neutral':
      default:
        return (
          <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded bg-gray-100 text-[#787b86] border border-gray-200">
            Neutral
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#e0e3eb] rounded-2xl overflow-hidden shadow-xs mb-12 animate-in fade-in duration-150">
      <div className="p-5 sm:p-6 border-b border-[#e0e3eb] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#131722]">{getCategoryTitle()}</h3>
          <p className="text-xs sm:text-sm text-[#787b86] mt-0.5">{getCategoryDescription()}</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-[#787b86]">
          {assets.length} instruments tracked
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="text-xs text-[#787b86] uppercase border-b border-[#e0e3eb] bg-gray-50/50">
              <th className="py-3 px-4 font-semibold" scope="col">
                Symbol & Name
              </th>
              <th className="py-3 px-4 font-semibold text-right" scope="col">
                Last Price
              </th>
              <th className="py-3 px-4 font-semibold text-right" scope="col">
                Change
              </th>
              <th className="py-3 px-4 font-semibold text-right" scope="col">
                Change %
              </th>
              <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell" scope="col">
                High
              </th>
              <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell" scope="col">
                Low
              </th>
              <th className="py-3 px-4 font-semibold text-center" scope="col">
                Technical Rating
              </th>
              <th className="py-3 px-4 font-semibold text-right" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e3eb]">
            {assets.map((item) => {
              const isPositive = item.change >= 0;
              const flash = flashingAssets[item.id];

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectAsset(item)}
                  className={`hover:bg-gray-50/90 transition-colors cursor-pointer ${
                    flash === 'up' ? 'tick-up' : flash === 'down' ? 'tick-down' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: item.badgeBgColor }}
                        className="w-7 h-7 rounded-full text-[11px] text-white font-bold flex items-center justify-center flex-shrink-0"
                      >
                        {item.badgeText}
                      </span>
                      <div>
                        <span className="text-[#131722] font-bold hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="block text-xs text-[#787b86] font-normal">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-medium text-[#131722]">
                    {item.lastPrice < 1
                      ? item.lastPrice.toFixed(4)
                      : item.lastPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </td>

                  <td
                    className={`py-3.5 px-4 text-right font-medium ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {item.change.toFixed(2)}
                  </td>

                  <td
                    className={`py-3.5 px-4 text-right font-semibold ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </td>

                  <td className="py-3.5 px-4 text-right text-[#787b86] hidden sm:table-cell">
                    {item.high?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-right text-[#787b86] hidden sm:table-cell">
                    {item.low?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {renderBadgeRating(item.technicalRating)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(item);
                      }}
                      className="text-xs font-semibold text-[#2962ff] hover:underline"
                    >
                      Chart →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
