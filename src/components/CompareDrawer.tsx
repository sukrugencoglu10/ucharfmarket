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

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...items]
                .sort((a, b) => a.price - b.price)
                .map((item) => {
                  const meta = MARKETS[item.market];
                  const isBest = item.price === minPrice;
                  const diff = Number((item.price - minPrice).toFixed(2));

                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-xl border p-4 ${
                        isBest
                          ? "border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-100"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="absolute right-2.5 top-2.5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                        title="Listeden çıkar"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <span
                        className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-extrabold text-white ${meta.bgClass}`}
                      >
                        {meta.name}
                      </span>

                      <h3 className="mt-2.5 pr-6 text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.category} {item.unit ? `• ${item.unit}` : ""}
                      </p>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span
                          className={`text-2xl font-extrabold ${
                            isBest ? "text-emerald-700" : "text-slate-900"
                          }`}
                        >
                          {formatTL(item.price)}
                        </span>
                      </div>

                      <div className="mt-2">
                        {isBest ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            <Trophy className="h-3 w-3" />
                            En Uygun Seçenek
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                            +{formatTL(diff)} daha pahalı
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
