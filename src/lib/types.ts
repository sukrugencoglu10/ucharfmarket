export type MarketId = "bim" | "a101" | "sok";

export interface MarketMeta {
  id: MarketId;
  name: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  website: string;
  aktuelUrl: string;
}

export const MARKETS: Record<MarketId, MarketMeta> = {
  bim: {
    id: "bim",
    name: "BİM",
    color: "#e30613",
    bgClass: "bg-red-600",
    textClass: "text-red-700",
    borderClass: "border-red-200",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    website: "https://www.bim.com.tr",
    aktuelUrl: "https://www.bim.com.tr/default.aspx",
  },
  a101: {
    id: "a101",
    name: "A101",
    color: "#00b5e2",
    bgClass: "bg-sky-500",
    textClass: "text-sky-700",
    borderClass: "border-sky-200",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    website: "https://www.a101.com.tr",
    aktuelUrl: "https://www.a101.com.tr/aldin-aldin",
  },
  sok: {
    id: "sok",
    name: "ŞOK",
    color: "#f59e0b",
    bgClass: "bg-amber-400",
    textClass: "text-amber-800",
    borderClass: "border-amber-300",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    website: "https://www.sokmarket.com.tr",
    aktuelUrl: "https://www.sokmarket.com.tr/haftanin-firsatlari",
  },
};

export interface Product {
  id: string;
  market: MarketId;
  title: string;
  brand?: string;
  subtitle?: string;
  price: number;
  oldPrice?: number;
  unit?: string;
  category: string;
  imageUrl?: string;
  productUrl: string;
  aktuelDate: string;
  source: "live" | "fallback";
}

export interface MarketScrapeStatus {
  market: MarketId;
  source: "live" | "fallback";
  productCount: number;
  lastUpdated: string;
  message: string;
}

export interface MarketBestMatch {
  market: MarketId;
  product: Product | null;
  diffFromCheapest: number | null;
  diffPercent: number | null;
  isCheapest: boolean;
}

export interface ComparisonSummary {
  query: string;
  totalMatches: number;
  cheapestProduct: Product | null;
  mostExpensiveProduct: Product | null;
  maxSavings: number;
  averagePrice: number;
  byMarket: Record<MarketId, MarketBestMatch>;
}

export interface ProductsApiResponse {
  products: Product[];
  categories: string[];
  statuses: Record<MarketId, MarketScrapeStatus>;
  comparison: ComparisonSummary | null;
  lastUpdated: string;
}
