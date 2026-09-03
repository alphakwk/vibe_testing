export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export type MarketCategory = 
  | 'overview' 
  | 'indices' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'futures' 
  | 'bonds' 
  | 'world_economy';

export type Region = 'Americas' | 'Europe' | 'Asia';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  region?: Region;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor?: string;
  exchange: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  volume?: string;
  marketCap?: string;
  technicalRating?: TechnicalRating;
  sparkline: number[];
  historicalData?: { time: string; price: number; volume?: number }[];
  description?: string;
}

export interface IndexAsset extends MarketAsset {
  region: Region;
  high: number;
  low: number;
  technicalRating: TechnicalRating;
}
