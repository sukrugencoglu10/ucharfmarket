"use client";

import { RefreshCw, Radio, Database } from "lucide-react";
import { MARKETS, MarketId, MarketScrapeStatus } from "@/lib/types";

interface MarketStatusBarProps {
  statuses: Record<MarketId, MarketScrapeStatus> | null;
  lastUpdated: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function MarketStatusBar({
  statuses,
  lastUpdated,
  isRefreshing,
  onRefresh,
}: MarketStatusBarProps) {
  const marketOrder: MarketId[] = ["bim", "a101", "sok"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Veri Kaynakları:
          </span>
          {marketOrder.map((id) => {
            const meta = MARKETS[id];
            const st = statuses?.[id];
            const isLive = st?.source === "live";

            return (
              <div
                key={id}
                title={st?.message || "Durum yükleniyor..."}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${meta.badgeClass}`}
              >
                <span className="font-bold">{meta.name}</span>
                <span className="text-slate-400">•</span>
                {isLive ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Canlı ({st?.productCount ?? 0})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Database className="h-3 w-3" />
                    Yedek ({st?.productCount ?? 0})
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-slate-500">
              Son kontrol:{" "}
              {new Date(lastUpdated).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Siteler taranıyor..." : "Sitelerden Yenile"}
          </button>
        </div>
      </div>
    </div>
  );
}
