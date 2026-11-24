"use client";

import { X, Scale, Trophy } from "lucide-react";
import { formatTL } from "@/lib/format";
import { MARKETS, Product } from "@/lib/types";

interface CompareDrawerProps {
  items: Product[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareDrawer({
  items,
  isOpen,
  onOpenChange,
  onRemove,
  onClear,
}: CompareDrawerProps) {
  if (items.length === 0) return null;

  const minPrice = Math.min(...items.map((i) => i.price));

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-indigo-200 bg-slate-900 px-4 py-3 text-white shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold">
                Karşılaştırma Listesi ({items.length} ürün)
              </div>
              <div className="text-xs text-slate-300">
                En düşük fiyat: {formatTL(minPrice)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              Temizle
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(true)}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-400 cursor-pointer"
            >
              Yan Yana Gör
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Seçilen Ürünler Karşılaştırması
                </h2>
                <p className="text-xs text-slate-500">
                  En düşük fiyatlı ürün otomatik olarak yeşil ile vurgulanır.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-4">
              {[...items]
                .sort((a, b) => a.price - b.price)
                .map((item) => {
                  const meta = MARKETS[item.market];
                  const isBest = item.price === minPrice;
                  const diff = Number((item.price - minPrice).toFixed(2));

                  return (
                    <div
                      key={item.id}
                      className={`relative min-w-0 rounded-xl border p-2 sm:p-4 ${
                        isBest
                          ? "border-emerald-400 bg-emerald-50/40 ring-1 sm:ring-2 ring-emerald-100"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="absolute right-1.5 top-1.5 sm:right-2.5 sm:top-2.5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                        title="Listeden çıkar"
                      >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>

                      <span
                        className={`inline-flex rounded-md sm:rounded-lg px-1.5 py-0.5 sm:px-2.5 text-[10px] sm:text-xs font-extrabold text-white ${meta.bgClass}`}
                      >
                        {meta.name}
                      </span>

                      <h3 className="mt-2 pr-5 text-[11px] sm:text-sm font-bold leading-snug text-slate-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 truncate">
                        {item.unit || item.category}
                      </p>

                      <div className="mt-2.5 sm:mt-4 flex items-baseline gap-1">
                        <span
                          className={`text-sm sm:text-2xl font-extrabold ${
                            isBest ? "text-emerald-700" : "text-slate-900"
                          }`}
                        >
                          {formatTL(item.price)}
                        </span>
                      </div>

                      <div className="mt-1.5 sm:mt-2">
                        {isBest ? (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 sm:px-2.5 text-[9px] sm:text-xs font-bold text-emerald-800">
                            <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                            En Ucuz
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-rose-50 px-1.5 py-0.5 sm:px-2.5 text-[9px] sm:text-xs font-semibold text-rose-700">
                            +{formatTL(diff)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
