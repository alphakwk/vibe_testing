import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Sliders,
  DollarSign,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { MarketAsset } from '../types';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; time: string } | null>(null);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Generate synthetic timeframe chart data based on the asset's current price and sparkline
  const chartData = useMemo(() => {
    if (!asset) return [];
    const base = asset.lastPrice;
    const count = 30;
    const result: { time: string; price: number }[] = [];

    // Seeded curve based on asset.sparkline
    const spark = asset.sparkline.length > 0 ? asset.sparkline : [10, 12, 11, 13, 15, 14, 16];
    const trendMultiplier = asset.change >= 0 ? 1 : -1;

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const sparkIdx = Math.floor(progress * (spark.length - 1));
      const sparkVal = spark[sparkIdx] || 10;
      
      // Normalized variation
      const randomJitter = Math.sin(i * 1.5) * (base * 0.004) + Math.cos(i * 0.8) * (base * 0.003);
      const trendEffect = (progress - 0.5) * (asset.change || base * 0.015);
      const calculatedPrice = base + trendEffect + randomJitter;

      // Format time label based on timeframe
      let timeLabel = '';
      if (selectedTimeframe === '1D') {
        const hour = 9 + Math.floor((i / count) * 7);
        const min = (i % 4) * 15;
        timeLabel = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      } else if (selectedTimeframe === '5D') {
        timeLabel = `Day ${Math.floor(i / 6) + 1} 1${(i % 6) * 2}:00`;
      } else if (selectedTimeframe === '1M') {
        timeLabel = `Oct ${Math.floor((i / count) * 30) + 1}`;
      } else {
        timeLabel = `Period ${i + 1}`;
      }

      result.push({
        time: timeLabel,
        price: Number(calculatedPrice.toFixed(asset.lastPrice < 1 ? 4 : 2)),
      });
    }

    return result;
  }, [asset, selectedTimeframe]);

  if (!asset) return null;

  const isPositive = asset.change >= 0;
  const timeframes: Timeframe[] = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'ALL'];

  // SVG dimensions for responsive chart
  const svgWidth = 600;
  const svgHeight = 220;
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const points = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * svgWidth;
    const y = svgHeight - ((d.price - minPrice) / priceRange) * (svgHeight - 40) - 20;
    return { x, y, price: d.price, time: d.time };
  });

  const pathD = points.length > 0 ? `M ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}` : '';
  const areaD = points.length > 0 ? `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z` : '';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * svgWidth;

    let closest = points[0];
    let minDiff = Infinity;
    points.forEach((p) => {
      const diff = Math.abs(p.x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = p;
      }
    });

    if (closest) {
      setHoveredPoint(closest);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccessMsg(`Successfully submitted ${orderType} order for ${asset.symbol}!`);
    setTimeout(() => {
      setOrderSuccessMsg(null);
      setTradeModalOpen(false);
    }, 2000);
  };

  const displayPrice = hoveredPoint ? hoveredPoint.price : asset.lastPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-[#e0e3eb] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: asset.badgeBgColor }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs"
            >
              {asset.badgeText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#131722]">{asset.symbol}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-[#787b86]">
                  {asset.exchange}
                </span>
                {asset.technicalRating && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-[#e7f7f4] text-[#089981] border border-[#b2e5dc]">
                    {asset.technicalRating}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#787b86] font-medium">{asset.name}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className={`p-2 rounded-full border transition-colors ${
                isWatchlisted
                  ? 'bg-blue-50 border-[#2962ff] text-[#2962ff]'
                  : 'border-gray-200 text-[#787b86] hover:bg-gray-100'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isWatchlisted ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setOrderType('BUY');
                setTradeModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              <span>Trade</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-[#787b86] hover:text-[#131722] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Price & Change Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#131722]">
                {displayPrice < 1
                  ? displayPrice.toFixed(4)
                  : displayPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </div>
              <div
                className={`text-sm font-bold flex items-center gap-1.5 mt-1 ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isPositive ? '+' : ''}
                  {asset.change.toFixed(2)}
                </span>
                <span>
                  ({isPositive ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%)
                </span>
                <span className="text-[#787b86] font-normal text-xs ml-2">Today</span>
              </div>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="flex items-center gap-1 bg-[#f0f3fa] p-1 rounded-xl">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-white text-[#131722] shadow-2xs'
                      : 'text-[#787b86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="relative bg-[#fafbfc] border border-[#e0e3eb] rounded-2xl p-4 overflow-hidden">
            {hoveredPoint && (
              <div className="absolute top-3 left-4 text-xs font-mono bg-white/90 px-2.5 py-1 rounded-md border border-gray-200 shadow-xs z-10">
                <span className="text-[#787b86] mr-2">{hoveredPoint.time}</span>
                <span className="font-bold text-[#131722]">
                  ${hoveredPoint.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <svg
              className="w-full h-52 cursor-crosshair"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? '#089981' : '#f23645'}
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? '#089981' : '#f23645'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="#e0e3eb" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="#e0e3eb" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="#e0e3eb" strokeDasharray="3 3" strokeWidth="1" />

              {/* Shaded Area */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Trend Path */}
              <path
                d={pathD}
                fill="none"
                stroke={isPositive ? '#089981' : '#f23645'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover Crosshair */}
              {hoveredPoint && (
                <>
                  <line
                    x1={hoveredPoint.x}
                    y1={0}
                    x2={hoveredPoint.x}
                    y2={svgHeight}
                    stroke="#787b86"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <line
                    x1={0}
                    y1={hoveredPoint.y}
                    x2={svgWidth}
                    y2={hoveredPoint.y}
                    stroke="#787b86"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="5"
                    fill={isPositive ? '#089981' : '#f23645'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </>
              )}
            </svg>
          </div>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#f0f3fa] p-3.5 rounded-xl">
              <span className="text-xs text-[#787b86] block">Day Range</span>
              <span className="text-sm font-bold text-[#131722]">
                {asset.low?.toLocaleString() || '—'} - {asset.high?.toLocaleString() || '—'}
              </span>
            </div>

            <div className="bg-[#f0f3fa] p-3.5 rounded-xl">
              <span className="text-xs text-[#787b86] block">Open</span>
              <span className="text-sm font-bold text-[#131722]">
                {asset.open?.toLocaleString() || asset.lastPrice.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#f0f3fa] p-3.5 rounded-xl">
              <span className="text-xs text-[#787b86] block">Prev. Close</span>
              <span className="text-sm font-bold text-[#131722]">
                {asset.previousClose?.toLocaleString() || (asset.lastPrice - asset.change).toLocaleString()}
              </span>
            </div>

            <div className="bg-[#f0f3fa] p-3.5 rounded-xl">
              <span className="text-xs text-[#787b86] block">Volume / Cap</span>
              <span className="text-sm font-bold text-[#131722]">
                {asset.volume || asset.marketCap || 'N/A'}
              </span>
            </div>
          </div>

          {/* Description & Technical Summary */}
          <div className="border-t border-[#e0e3eb] pt-4">
            <h4 className="text-sm font-bold text-[#131722] mb-1.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#2962ff]" />
              About {asset.name}
            </h4>
            <p className="text-xs sm:text-sm text-[#787b86] leading-relaxed">
              {asset.description ||
                `${asset.name} is actively traded on ${asset.exchange} with comprehensive live technical analysis, order book depth, and historical performance tracking.`}
            </p>
          </div>
        </div>

        {/* Trade Order Modal Popup */}
        {tradeModalOpen && (
          <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-lg text-[#131722]">Place Order: {asset.symbol}</h3>
                <button onClick={() => setTradeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {orderSuccessMsg ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-semibold">{orderSuccessMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleExecuteTrade} className="space-y-4">
                  <div className="flex rounded-xl bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => setOrderType('BUY')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                        orderType === 'BUY' ? 'bg-[#089981] text-white shadow-xs' : 'text-gray-600'
                      }`}
                    >
                      BUY
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('SELL')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                        orderType === 'SELL' ? 'bg-[#f23645] text-white shadow-xs' : 'text-gray-600'
                      }`}
                    >
                      SELL
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Execution Price</label>
                    <input
                      type="text"
                      readOnly
                      value={`$${asset.lastPrice.toLocaleString()}`}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      defaultValue={10}
                      min={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#2962ff] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-opacity ${
                      orderType === 'BUY' ? 'bg-[#089981] hover:opacity-90' : 'bg-[#f23645] hover:opacity-90'
                    }`}
                  >
                    Confirm {orderType} Order
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
