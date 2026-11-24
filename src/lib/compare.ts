import { ComparisonSummary, MarketBestMatch, MarketId, Product } from "./types";

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

export function normalizeTurkish(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıiöşü]/g, (ch) => TURKISH_CHAR_MAP[ch] || ch)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchProducts(
  products: Product[],
  options: {
    query?: string;
    market?: MarketId | "all";
    category?: string;
    sort?: "price_asc" | "price_desc" | "discount" | "relevance";
  }
): Product[] {
  const { query = "", market = "all", category = "all", sort = "price_asc" } = options;
  const normalizedQuery = normalizeTurkish(query);
  const tokens = normalizedQuery ? normalizedQuery.split(" ").filter(Boolean) : [];

  const scored = products
    .filter((p) => {
      if (market !== "all" && p.market !== market) return false;
      if (category !== "all" && p.category !== category) return false;
      return true;
    })
    .map((product) => {
      if (tokens.length === 0) {
        return { product, score: 1 };
      }
      const haystack = normalizeTurkish(
        `${product.title} ${product.brand || ""} ${product.subtitle || ""} ${product.category}`
      );
      let score = 0;
      let matchedTokens = 0;

      for (const token of tokens) {
        if (haystack.includes(token)) {
          matchedTokens++;
          score += normalizeTurkish(product.title).includes(token) ? 3 : 1;
        }
      }

      // Require all search tokens to match for accurate price comparison
      if (matchedTokens < tokens.length) {
        return { product, score: 0 };
      }

      if (normalizeTurkish(product.title).startsWith(normalizedQuery)) {
        score += 5;
      }

      return { product, score };
    })
    .filter((entry) => entry.score > 0);

  scored.sort((a, b) => {
    if (sort === "price_asc") return a.product.price - b.product.price;
    if (sort === "price_desc") return b.product.price - a.product.price;
    if (sort === "discount") {
      const discA = a.product.oldPrice
        ? (a.product.oldPrice - a.product.price) / a.product.oldPrice
        : 0;
      const discB = b.product.oldPrice
        ? (b.product.oldPrice - b.product.price) / b.product.oldPrice
        : 0;
      return discB - discA || a.product.price - b.product.price;
    }
    return b.score - a.score || a.product.price - b.product.price;
  });

  return scored.map((s) => s.product);
}

export function buildComparisonSummary(
  query: string,
  matchedProducts: Product[]
): ComparisonSummary | null {
  if (!query.trim() || matchedProducts.length === 0) {
    return null;
  }

  const sortedByPrice = [...matchedProducts].sort((a, b) => a.price - b.price);
  const cheapest = sortedByPrice[0];
  const mostExpensive = sortedByPrice[sortedByPrice.length - 1];
  const averagePrice =
    matchedProducts.reduce((sum, p) => sum + p.price, 0) / matchedProducts.length;

  const marketIds: MarketId[] = ["bim", "a101", "sok"];
  const byMarket = {} as Record<MarketId, MarketBestMatch>;

  for (const m of marketIds) {
    const marketMatches = sortedByPrice.filter((p) => p.market === m);
    const best = marketMatches[0] || null;
    const diffFromCheapest = best ? Number((best.price - cheapest.price).toFixed(2)) : null;
    const diffPercent =
      best && cheapest.price > 0
        ? Math.round(((best.price - cheapest.price) / cheapest.price) * 100)
        : null;

    byMarket[m] = {
      market: m,
      product: best,
      diffFromCheapest,
      diffPercent,
      isCheapest: Boolean(best && best.price === cheapest.price),
    };
  }

  return {
    query: query.trim(),
    totalMatches: matchedProducts.length,
    cheapestProduct: cheapest,
    mostExpensiveProduct: mostExpensive,
    maxSavings: Number((mostExpensive.price - cheapest.price).toFixed(2)),
    averagePrice: Number(averagePrice.toFixed(2)),
    byMarket,
  };
}
