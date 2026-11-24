"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { MARKETS, MarketId, Product, ProductsApiResponse } from "@/lib/types";
import { MarketStatusBar } from "./MarketStatusBar";
import { ComparisonPanel } from "./ComparisonPanel";
import { ProductCard } from "./ProductCard";
import { CompareDrawer } from "./CompareDrawer";

const QUICK_SEARCHES = [
  "Ayçiçek Yağı",
  "Süt",
  "Tost Peyniri",
  "Yumurta",
  "Çay",
  "Türk Kahvesi",
  "Tuvalet Kağıdı",
  "Deterjan",
  "Airfryer",
  "Elektrikli Süpürge",
  "Çay Makinesi",
  "Tava",
];

export function MarketExplorer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [market, setMarket] = useState<MarketId | "all">("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "discount" | "relevance">(
    "price_asc"
  );

  const [data, setData] = useState<ProductsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 220);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
      if (market !== "all") params.set("market", market);
      if (category !== "all") params.set("category", category);
      params.set("sort", sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Sunucudan veri alınamadı");
      const json: ProductsApiResponse = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, market, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefreshScrape = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/scrape", { method: "POST" });
      await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const toggleCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 6) return prev;
      return [...prev, product];
    });
  };

  const cheapestId = data?.comparison?.cheapestProduct?.id;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      {/* Header & Hero Search */}
      <header className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" />
              BİM • A101 • ŞOK Aktüel Fiyat Karşılaştırma
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Üç Harf Market
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Aradığın ürünü yaz, üç marketin aktüel fiyatlarını anında yan yana karşılaştır.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["bim", "a101", "sok"] as MarketId[]).map((id) => (
              <span
                key={id}
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold text-white shadow-sm ${MARKETS[id].bgClass}`}
              >
                {MARKETS[id].name}
              </span>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün ara... Örn: Ayçiçek yağı, süt, airfryer, tost peyniri, çay"
              className="w-full rounded-2xl border border-white/15 bg-white py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Search Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-slate-400">Hızlı karşılaştır:</span>
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  query.toLocaleLowerCase("tr-TR") === term.toLocaleLowerCase("tr-TR")
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Market Scrape Status Bar */}
      <div className="mt-5">
        <MarketStatusBar
          statuses={data?.statuses || null}
          lastUpdated={data?.lastUpdated || null}
          isRefreshing={refreshing}
          onRefresh={handleRefreshScrape}
        />
      </div>

      {/* Automatic 3-Market Comparison Panel when searching */}
      {data?.comparison && (
        <div className="mt-5">
          <ComparisonPanel comparison={data.comparison} />
        </div>
      )}

      {/* Filter & Sort Controls */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMarket("all")}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              market === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Tüm Marketler
          </button>
          {(["bim", "a101", "sok"] as MarketId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMarket(id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                market === id
                  ? `${MARKETS[id].bgClass} text-white`
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {MARKETS[id].name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtrele:
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-400 focus:outline-none"
          >
            <option value="all">Tüm Kategoriler</option>
            {data?.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "price_asc" | "price_desc" | "discount" | "relevance")
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-400 focus:outline-none"
          >
            <option value="price_asc">Fiyat: En Ucuzdan Pahalıya</option>
            <option value="price_desc">Fiyat: En Pahalıdan Ucuza</option>
            <option value="discount">En Yüksek İndirim Oranı</option>
            <option value="relevance">Arama İlgisine Göre</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <main className="mt-6">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="h-5 w-16 rounded bg-slate-200" />
                <div className="mt-3 h-36 rounded-xl bg-slate-100" />
                <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-6 w-1/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : data && data.products.length > 0 ? (
          <>
            <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
              <span>
                <strong>{data.products.length}</strong> ürün listeleniyor
              </span>
              {query && (
                <span>
                  “<strong>{query}</strong>” için en ucuzdan sıralı
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCheapestOverall={Boolean(query.trim() && product.id === cheapestId)}
                  isSelectedForCompare={compareItems.some((c) => c.id === product.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-base font-bold text-slate-800">
              Aradığınız kriterlere uygun aktüel ürün bulunamadı.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Farklı bir ürün adı deneyebilir veya filtreleri temizleyebilirsiniz.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setMarket("all");
                setCategory("all");
              }}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </main>

      {/* Manual Compare Drawer */}
      <CompareDrawer
        items={compareItems}
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        onRemove={(id) => setCompareItems((prev) => prev.filter((i) => i.id !== id))}
        onClear={() => {
          setCompareItems([]);
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
