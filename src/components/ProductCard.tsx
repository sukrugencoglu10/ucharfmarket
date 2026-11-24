"use client";

import { ExternalLink, Scale, Check, ShoppingBag } from "lucide-react";
import { formatTL, getDiscountPercent } from "@/lib/format";
import { MARKETS, Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  isCheapestOverall?: boolean;
  isSelectedForCompare: boolean;
  onToggleCompare: (product: Product) => void;
}

export function ProductCard({
  product,
  isCheapestOverall,
  isSelectedForCompare,
  onToggleCompare,
}: ProductCardProps) {
  const meta = MARKETS[product.market];
  const discount = getDiscountPercent(product.price, product.oldPrice);

  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md ${
        isCheapestOverall ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-extrabold text-white ${meta.bgClass}`}
          >
            {meta.name}
          </span>
          <div className="flex items-center gap-1.5">
            {discount && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                %{discount} İndirim
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {product.category}
            </span>
          </div>
        </div>

        <div className="mt-3 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-contain p-2 transition group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <ShoppingBag className="h-10 w-10" />
              <span className="mt-1 text-[11px] font-medium text-slate-400">
                {product.brand || meta.name}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
            {product.title}
          </h3>
          {product.subtitle && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{product.subtitle}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900">
                {formatTL(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatTL(product.oldPrice)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              {product.aktuelDate} {product.unit ? `• ${product.unit}` : ""}
            </div>
          </div>

          {isCheapestOverall && (
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              En Ucuz
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => onToggleCompare(product)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
              isSelectedForCompare
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Listede
              </>
            ) : (
              <>
                <Scale className="h-3.5 w-3.5" />
                Karşılaştır
              </>
            )}
          </button>

          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Market aktüel sayfasını aç"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
