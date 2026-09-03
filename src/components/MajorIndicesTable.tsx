import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { IndexAsset, Region, TechnicalRating } from '../types';

interface MajorIndicesTableProps {
  indices: IndexAsset[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  onSelectIndex: (index: IndexAsset) => void;
  flashingAssets?: Record<string, 'up' | 'down'>;
}

type SortField = 'symbol' | 'lastPrice' | 'change' | 'changePercent';
type SortOrder = 'asc' | 'desc';

export const MajorIndicesTable: React.FC<MajorIndicesTableProps> = ({
  indices,
  selectedRegion,
  onSelectRegion,
  onSelectIndex,
  flashingAssets = {},
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredIndices = useMemo(() => {
    let list = indices.filter((item) => item.region === selectedRegion);

    if (sortField) {
      list = [...list].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (Number(valA) - Number(valB)) : (Number(valB) - Number(valA));
      });
    }

    return list;
  }, [indices, selectedRegion, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortField(null);
        setSortOrder('desc');
      }
    } else {
      setSortField(field);
      setSortOrder('desc');
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

  const renderTrendSvg = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const width = 80;
    const height = 20;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return (
      <svg
        className={`w-20 h-5 inline-block stroke-current fill-none ${
          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
        }`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path d={`M ${coords.join(' L ')}`} />
      </svg>
    );
  };

  return (
    <section className="bg-white border border-[#e0e3eb] rounded-2xl overflow-hidden shadow-xs mb-12">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-[#e0e3eb] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#131722]">Major World Indices</h3>
          <p className="text-xs sm:text-sm text-[#787b86] mt-0.5">
            Real-time performance across global financial hubs
          </p>
        </div>

        {/* Region filter switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {(['Americas', 'Europe', 'Asia'] as Region[]).map((region) => {
            const isActive = selectedRegion === region;
            return (
              <button
                key={region}
                id={`filter-region-${region.toLowerCase()}`}
                onClick={() => onSelectRegion(region)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-gray-100 text-[#131722] shadow-2xs font-bold'
                    : 'hover:bg-gray-100 text-[#787b86] hover:text-[#131722]'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="text-xs text-[#787b86] uppercase border-b border-[#e0e3eb] bg-gray-50/50 select-none">
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center gap-1">
                  <span>Index</span>
                  {sortField === 'symbol' &&
                    (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('lastPrice')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last</span>
                  {sortField === 'lastPrice' &&
                    (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('change')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Chg</span>
                  {sortField === 'change' &&
                    (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Chg %</span>
                  {sortField === 'changePercent' &&
                    (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
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
                7D Trend
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e0e3eb]">
            {filteredIndices.map((row) => {
              const isPositive = row.change >= 0;
              const flash = flashingAssets[row.id];

              return (
                <tr
                  key={row.id}
                  id={`index-row-${row.id}`}
                  onClick={() => onSelectIndex(row)}
                  className={`hover:bg-gray-50/90 transition-colors cursor-pointer ${
                    flash === 'up' ? 'tick-up' : flash === 'down' ? 'tick-down' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: row.badgeBgColor }}
                        className="w-6 h-6 rounded-full text-[10px] text-white font-bold flex items-center justify-center flex-shrink-0"
                      >
                        {row.badgeText}
                      </span>
                      <div>
                        <span className="text-[#131722] font-bold hover:text-[#2962ff] transition-colors">
                          {row.symbol}
                        </span>
                        <span className="block text-xs text-[#787b86] font-normal">
                          {row.exchange}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-medium text-[#131722]">
                    {row.lastPrice.toLocaleString(undefined, {
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
                    {row.change.toFixed(2)}
                  </td>

                  <td
                    className={`py-3.5 px-4 text-right font-semibold ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {row.changePercent.toFixed(2)}%
                  </td>

                  <td className="py-3.5 px-4 text-right text-[#787b86] hidden sm:table-cell">
                    {row.high?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-right text-[#787b86] hidden sm:table-cell">
                    {row.low?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {renderBadgeRating(row.technicalRating)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {renderTrendSvg(row.sparkline, isPositive)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
