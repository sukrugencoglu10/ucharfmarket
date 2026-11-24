import { getFallbackProductsByMarket } from "../fallbackData";
import { MarketId, MarketScrapeStatus, Product } from "../types";
import { scrapeA101 } from "./a101";
import { scrapeBim } from "./bim";
import { scrapeSok } from "./sok";

interface CachedCatalog {
  products: Product[];
  statuses: Record<MarketId, MarketScrapeStatus>;
  lastUpdated: string;
  expiresAt: number;
}

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
let memoryCache: CachedCatalog | null = null;

async function resolveMarket(
  market: MarketId,
  scraperFn: () => Promise<{ products: Product[]; error?: string }>
): Promise<{ products: Product[]; status: MarketScrapeStatus }> {
  const now = new Date().toISOString();
  const result = await scraperFn();

  if (result.products.length > 0) {
    return {
      products: result.products,
      status: {
        market,
        source: "live",
        productCount: result.products.length,
        lastUpdated: now,
        message: `${result.products.length} güncel ürün canlı çekildi`,
      },
    };
  }

  const fallback = getFallbackProductsByMarket(market);
  return {
    products: fallback,
    status: {
      market,
      source: "fallback",
      productCount: fallback.length,
      lastUpdated: now,
      message: result.error
        ? `Site erişim/bot engeli (${result.error}) — yedek aktüel veri aktif`
        : "HTML/API ürün kartı bulunamadı — yedek aktüel veri aktif",
    },
  };
}

export async function getCatalog(forceRefresh = false): Promise<CachedCatalog> {
  if (!forceRefresh && memoryCache && Date.now() < memoryCache.expiresAt) {
    return memoryCache;
  }

  const [bimRes, a101Res, sokRes] = await Promise.all([
    resolveMarket("bim", scrapeBim),
    resolveMarket("a101", scrapeA101),
    resolveMarket("sok", scrapeSok),
  ]);

  const lastUpdated = new Date().toISOString();
  memoryCache = {
    products: [...bimRes.products, ...a101Res.products, ...sokRes.products],
    statuses: {
      bim: bimRes.status,
      a101: a101Res.status,
      sok: sokRes.status,
    },
    lastUpdated,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };

  return memoryCache;
}
