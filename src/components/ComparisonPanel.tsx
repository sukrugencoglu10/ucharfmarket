"use client";

import { Trophy, TrendingDown, ExternalLink, AlertCircle } from "lucide-react";
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
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <Trophy className="h-3.5 w-3.5" />
            Fiyat Karşılaştırma Özeti
          </div>
          <h2 className="mt-1.5 text-lg font-bold text-slate-900">
            “{comparison.query}” için 3 Market Karşılaştırması
          </h2>
          <p className="text-sm text-slate-600">
            Toplam <strong>{comparison.totalMatches}</strong> eşleşen ürün bulundu • Ortalama fiyat:{" "}
            <strong>{formatTL(comparison.averagePrice)}</strong>
          </p>
        </div>

        {cheapestMarket && comparison.cheapestProduct && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">
                En Uygun: <span className="font-bold text-slate-900">{cheapestMarket.name}</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-700">
                {formatTL(comparison.cheapestProduct.price)}
              </div>
              {comparison.maxSavings > 0 && (
                <div className="text-xs font-semibold text-emerald-600">
                  En pahalıya göre {formatTL(comparison.maxSavings)} tasarruf
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {marketOrder.map((marketId) => {
          const meta = MARKETS[marketId];
          const match = comparison.byMarket[marketId];

          return (
            <div
              key={marketId}
              className={`relative flex flex-col justify-between rounded-xl border p-4 transition ${
                match.isCheapest
                  ? "border-emerald-400 bg-white ring-2 ring-emerald-200/70"
                  : "border-slate-200 bg-white/90"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-extrabold text-white ${meta.bgClass}`}
                  >
                    {meta.name}
                  </span>

                  {match.isCheapest && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      <Trophy className="h-3 w-3" />
                      En Ucuz
                    </span>
                  )}

                  {!match.isCheapest && match.diffFromCheapest !== null && match.diffFromCheapest > 0 && (
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                      +{formatTL(match.diffFromCheapest)} (%{match.diffPercent})
                    </span>
                  )}
                </div>

                {match.product ? (
                  <div className="mt-3">
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {match.product.title}
                    </h3>
                    {match.product.subtitle && (
                      <p className="mt-0.5 text-xs text-slate-500">{match.product.subtitle}</p>
                    )}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-extrabold ${
                          match.isCheapest ? "text-emerald-700" : "text-slate-900"
                        }`}
                      >
                        {formatTL(match.product.price)}
                      </span>
                      {match.product.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatTL(match.product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Bu markette eşleşen aktüel ürün bulunamadı.
                  </div>
                )}
              </div>

              {match.product && (
                <div className="mt-3 border-t border-slate-100 pt-2.5">
                  <a
                    href={match.product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Aktüel sayfasına git
                    <ExternalLink className="h-3 w-3" />
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
