import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IndexAsset } from '../types';

interface IndicesQuickStripProps {
  indices: IndexAsset[];
  onSelectIndex: (index: IndexAsset) => void;
  onViewAllIndices: () => void;
  flashingAssets?: Record<string, 'up' | 'down'>;
}

export const IndicesQuickStrip: React.FC<IndicesQuickStripProps> = ({
  indices,
  onSelectIndex,
  onViewAllIndices,
  flashingAssets = {},
}) => {
  // Helper to generate a smooth SVG curve path from sparkline points
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const width = 60;
    const height = 30;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      // Invert y because SVG y goes down
      const y = height - ((p - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const d = `M ${coords.join(' L ')}`;

    return (
      <svg
        className={`w-full h-full stroke-current fill-none ${
          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
        }`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path d={d} />
      </svg>
    );
  };

  return (
    <section className="mb-10">
      {/* Header Link */}
      <div
        id="indices-strip-header"
        onClick={onViewAllIndices}
        className="flex items-center gap-1.5 mb-4 group cursor-pointer w-fit select-none"
        role="button"
        tabIndex={0}
      >
        <h2 className="text-2xl font-bold tracking-tight text-[#131722] group-hover:text-[#2962ff] transition-colors">
          Indices
        </h2>
        <ChevronRight className="w-5 h-5 mt-0.5 text-[#131722] group-hover:text-[#2962ff] transition-colors stroke-[2.5]" />
      </div>

      {/* Quick Ticker Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {indices.map((item) => {
          const isPositive = item.change >= 0;
          const flash = flashingAssets[item.id];

          return (
            <div
              key={item.id}
              id={`ticker-card-${item.id}`}
              onClick={() => onSelectIndex(item)}
              className={`bg-[#f0f3fa] hover:bg-[#e7eaf2] p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 border border-transparent hover:border-[#e0e3eb] hover:shadow-xs ${
                flash === 'up' ? 'tick-up ring-1 ring-[#089981]/30' : flash === 'down' ? 'tick-down ring-1 ring-[#f23645]/30' : ''
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  style={{ backgroundColor: item.badgeBgColor }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-2xs"
                >
                  {item.badgeText}
                </div>
                <div>
                  <div className="font-bold text-[15px] leading-snug text-[#131722]">
                    {item.symbol}
                  </div>
                  <div className="text-xs text-[#787b86] font-medium">
                    {item.exchange}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[15px] font-bold text-[#131722]">
                  {item.lastPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  <span>
                    {isPositive ? '+' : ''}
                    {item.change.toFixed(2)}
                  </span>
                  <span>
                    ({isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Mini SVG Sparkline */}
              <div className="w-16 h-8 ml-2 flex-shrink-0">
                {renderSparkline(item.sparkline, isPositive)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
