"use client";

import { Trophy, TrendingDown, ExternalLink, AlertCircle, ShoppingBag } from "lucide-react";
import { formatTL } from "@/lib/format";
import { ComparisonSummary, MARKETS, MarketId } from "@/lib/types";

interface ComparisonPanelProps {
  comparison: ComparisonSummary;
}

export function ComparisonPanel({ comparison }: ComparisonPanelProps) {
  const marketOrder: MarketId[] = ["bim", "a101", "sok"];
  const cheapestMarket = comparison.cheapestProduct
    ? MARKETS[comparison.cheapestProduct.market]
    : null;

  return (
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 p-3 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-100 pb-3 sm:pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-800">
            <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Fiyat Karşılaştırma Özeti
          </div>
          <h2 className="mt-1 text-base sm:text-lg font-bold text-slate-900">
            “{comparison.query}” — 3 Market Karşılaştırması
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            <strong>{comparison.totalMatches}</strong> eşleşen ürün • Ortalama:{" "}
            <strong>{formatTL(comparison.averagePrice)}</strong>
          </p>
        </div>

        {cheapestMarket && comparison.cheapestProduct && (
          <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-emerald-200 bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-xs">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-medium text-slate-500">
                En Uygun: <span className="font-bold text-slate-900">{cheapestMarket.name}</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-emerald-700 leading-tight">
                {formatTL(comparison.cheapestProduct.price)}
              </div>
              {comparison.maxSavings > 0 && (
                <div className="text-[11px] sm:text-xs font-semibold text-emerald-600">
                  {formatTL(comparison.maxSavings)} tasarruf
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Always 3 columns side-by-side even on mobile */}
      <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-3">
        {marketOrder.map((marketId) => {
          const meta = MARKETS[marketId];
          const match = comparison.byMarket[marketId];

          return (
            <div
              key={marketId}
              className={`relative flex min-w-0 flex-col justify-between rounded-xl border p-2 sm:p-4 transition ${
                match.isCheapest
                  ? "border-emerald-400 bg-white ring-1 sm:ring-2 ring-emerald-200/80 shadow-xs"
                  : "border-slate-200 bg-white/95"
              }`}
            >
              <div>
                {/* Top row: Market badge + Winner/Diff badge */}
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span
                    className={`inline-flex items-center rounded-md sm:rounded-lg px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-extrabold text-white ${meta.bgClass}`}
                  >
                    {meta.name}
                  </span>

                  {match.isCheapest && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 sm:px-2.5 text-[9px] sm:text-xs font-bold text-emerald-800">
                      <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                      <span className="truncate">En Ucuz</span>
                    </span>
                  )}

                  {!match.isCheapest &&
                    match.diffFromCheapest !== null &&
                    match.diffFromCheapest > 0 && (
                      <span className="rounded-full bg-rose-50 px-1.5 py-0.5 sm:px-2 text-[9px] sm:text-xs font-semibold text-rose-700 truncate">
                        +%{match.diffPercent}
                      </span>
                    )}
                </div>

                {match.product ? (
                  <div className="mt-2 sm:mt-3">
                    {/* Compact thumbnail like e-commerce mobile cards */}
                    <div className="flex h-16 sm:h-24 items-center justify-center overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
                      {match.product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={match.product.imageUrl}
                          alt={match.product.title}
                          className="h-full w-full object-contain p-1 sm:p-2"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <ShoppingBag className="h-5 w-5 sm:h-7 sm:w-7" />
                          <span className="mt-0.5 text-[9px] sm:text-[11px] font-medium text-slate-400 truncate max-w-full px-1">
                            {match.product.brand || meta.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="mt-1.5 sm:mt-2.5 line-clamp-2 text-[11px] sm:text-sm font-semibold leading-snug text-slate-900 min-h-[2rem] sm:min-h-[2.5rem]">
                      {match.product.title}
                    </h3>

                    {!match.isCheapest &&
                      match.diffFromCheapest !== null &&
                      match.diffFromCheapest > 0 && (
                        <div className="mt-1 inline-block rounded bg-rose-50 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-medium text-rose-700">
                          +{formatTL(match.diffFromCheapest)} fark
                        </div>
                      )}

                    {match.isCheapest && (
                      <div className="mt-1 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-semibold text-emerald-700">
                        En düşük fiyat
                      </div>
                    )}

                    <div className="mt-1.5 sm:mt-2.5 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      {match.product.oldPrice && (
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through leading-none">
                          {formatTL(match.product.oldPrice)}
                        </span>
                      )}
                      <span
                        className={`text-sm sm:text-2xl font-extrabold tracking-tight ${
                          match.isCheapest ? "text-emerald-700" : "text-slate-900"
                        }`}
                      >
                        {formatTL(match.product.price)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center gap-1 py-4 text-center text-[10px] sm:text-xs text-slate-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Ürün yok</span>
                  </div>
                )}
              </div>

              {match.product && (
                <div className="mt-2 sm:mt-3 border-t border-slate-100 pt-1.5 sm:pt-2.5">
                  <a
                    href={match.product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <span className="truncate">Siteye git</span>
                    <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

