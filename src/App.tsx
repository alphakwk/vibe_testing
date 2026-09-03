import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroTitle } from './components/HeroTitle';
import { IndicesQuickStrip } from './components/IndicesQuickStrip';
import { MajorIndicesTable } from './components/MajorIndicesTable';
import { MarketMoversGrid } from './components/MarketMoversGrid';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { CategoryView } from './components/CategoryView';
import { Footer } from './components/Footer';

import {
  TOP_INDICES,
  WORLD_INDICES,
  ACTIVE_STOCKS,
  CRYPTO_MARKET,
  CURRENCIES_COMMODITIES,
  BONDS_DATA,
  WORLD_ECONOMY_DATA,
  ALL_ASSETS,
} from './data/marketData';

import { IndexAsset, MarketAsset, MarketCategory, Region } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('overview');
  const [selectedRegion, setSelectedRegion] = useState<Region>('Americas');
  const [activeNav, setActiveNav] = useState('Markets');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(true);

  // Dynamic state for assets to allow subtle real-time price updates
  const [topIndices, setTopIndices] = useState<IndexAsset[]>(TOP_INDICES);
  const [worldIndices, setWorldIndices] = useState<IndexAsset[]>(WORLD_INDICES);
  const [stocks, setStocks] = useState<MarketAsset[]>(ACTIVE_STOCKS);
  const [crypto, setCrypto] = useState<MarketAsset[]>(CRYPTO_MARKET);
  const [currencies, setCurrencies] = useState<MarketAsset[]>(CURRENCIES_COMMODITIES);
  const [bonds, setBonds] = useState<MarketAsset[]>(BONDS_DATA);
  const [worldEconomy, setWorldEconomy] = useState<MarketAsset[]>(WORLD_ECONOMY_DATA);

  // Flashing asset state to highlight price changes
  const [flashingAssets, setFlashingAssets] = useState<Record<string, 'up' | 'down'>>({});

  // Simulated live ticker pulse
  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      // Pick a random collection
      const pools = ['topIndices', 'worldIndices', 'stocks', 'crypto', 'currencies'];
      const chosenPool = pools[Math.floor(Math.random() * pools.length)];

      const updateAssetPrice = (item: MarketAsset) => {
        const deltaFactor = (Math.random() * 0.003 - 0.0014); // ~ -0.14% to +0.16%
        const delta = Number((item.lastPrice * deltaFactor).toFixed(item.lastPrice < 1 ? 4 : 2));
        const newPrice = Number((item.lastPrice + delta).toFixed(item.lastPrice < 1 ? 4 : 2));
        const newChange = Number((item.change + delta).toFixed(item.lastPrice < 1 ? 4 : 2));
        const newPct = Number(((newChange / (item.lastPrice - item.change)) * 100).toFixed(2));
        const isUp = delta >= 0;

        // Trigger visual flash
        setFlashingAssets((prev) => ({ ...prev, [item.id]: isUp ? 'up' : 'down' }));
        setTimeout(() => {
          setFlashingAssets((prev) => {
            const next = { ...prev };
            delete next[item.id];
            return next;
          });
        }, 1200);

        return {
          ...item,
          lastPrice: newPrice,
          change: newChange,
          changePercent: newPct,
          high: Math.max(item.high || newPrice, newPrice),
          low: Math.min(item.low || newPrice, newPrice),
        };
      };

      if (chosenPool === 'topIndices') {
        setTopIndices((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? (updateAssetPrice(item) as IndexAsset) : item));
        });
      } else if (chosenPool === 'worldIndices') {
        setWorldIndices((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? (updateAssetPrice(item) as IndexAsset) : item));
        });
      } else if (chosenPool === 'stocks') {
        setStocks((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? updateAssetPrice(item) : item));
        });
      } else if (chosenPool === 'crypto') {
        setCrypto((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? updateAssetPrice(item) : item));
        });
      } else if (chosenPool === 'currencies') {
        setCurrencies((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? updateAssetPrice(item) : item));
        });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [liveUpdatesEnabled]);

  // Handle global shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSelectAsset = useCallback((asset: MarketAsset) => {
    setSelectedAsset(asset);
  }, []);

  // Aggregated list of all current assets for searching
  const currentAllAssets = [
    ...topIndices,
    ...worldIndices,
    ...stocks,
    ...crypto,
    ...currencies,
    ...bonds,
    ...worldEconomy,
  ];

  // Get assets list for active category
  const getCategoryAssets = () => {
    switch (selectedCategory) {
      case 'indices':
        return worldIndices;
      case 'stocks':
        return stocks;
      case 'crypto':
        return crypto;
      case 'forex':
        return currencies.filter((c) => c.category === 'forex');
      case 'futures':
        return currencies.filter((c) => c.category === 'futures');
      case 'bonds':
        return bonds;
      case 'world_economy':
        return worldEconomy;
      default:
        return [];
    }
  };

  return (
    <div className="bg-white text-[#131722] min-h-screen flex flex-col antialiased">
      {/* Top Navigation Header */}
      <Header
        activeNav={activeNav}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'Markets') {
            setSelectedCategory('overview');
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        liveUpdatesEnabled={liveUpdatesEnabled}
        onToggleLiveUpdates={() => setLiveUpdatesEnabled(!liveUpdatesEnabled)}
      />

      {/* Hero Title & Category Navigation Bar */}
      <HeroTitle
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onFilterQuickMarket={(region) => {
          if (region === 'europe') setSelectedRegion('Europe');
          else if (region === 'asia') setSelectedRegion('Asia');
          else setSelectedRegion('Americas');
          setSelectedCategory('overview');
        }}
      />

      {/* Main Markets Body */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20 w-full flex-1">
        {selectedCategory === 'overview' ? (
          <>
            {/* Section 1: Indices Quick Strip */}
            <IndicesQuickStrip
              indices={topIndices}
              onSelectIndex={handleSelectAsset}
              onViewAllIndices={() => setSelectedCategory('indices')}
              flashingAssets={flashingAssets}
            />

            {/* Section 2: Major World Indices Table */}
            <MajorIndicesTable
              indices={worldIndices}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              onSelectIndex={handleSelectAsset}
              flashingAssets={flashingAssets}
            />

            {/* Section 3: Market Movers & Trending Assets */}
            <MarketMoversGrid
              stocks={stocks}
              crypto={crypto}
              currencies={currencies}
              onSelectAsset={handleSelectAsset}
              onNavigateCategory={(cat) => setSelectedCategory(cat)}
              flashingAssets={flashingAssets}
            />
          </>
        ) : (
          /* Dedicated Category Screen */
          <CategoryView
            category={selectedCategory}
            assets={getCategoryAssets()}
            onSelectAsset={handleSelectAsset}
            flashingAssets={flashingAssets}
          />
        )}
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allAssets={currentAllAssets}
        onSelectAsset={handleSelectAsset}
      />

      {/* Interactive Asset Detail & Chart Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
