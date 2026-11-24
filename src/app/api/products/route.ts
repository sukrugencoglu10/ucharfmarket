import { NextRequest, NextResponse } from "next/server";
import { CATEGORY_ORDER } from "@/lib/categories";
import { buildComparisonSummary, searchProducts } from "@/lib/compare";
import { getCatalog } from "@/lib/scrapers";
import { MarketId, ProductsApiResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const marketParam = (searchParams.get("market") || "all") as MarketId | "all";
    const category = searchParams.get("category") || "all";
    const sort = (searchParams.get("sort") || "price_asc") as
      | "price_asc"
      | "price_desc"
      | "discount"
      | "relevance";

    const catalog = await getCatalog(false);

    // Compute counts per category for current query & market (before category filter)
    const baseMatches = searchProducts(catalog.products, {
      query,
      market: marketParam,
      category: "all",
      sort,
    });

    const categoryCounts: Record<string, number> = {};
    for (const p of baseMatches) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }

    const filtered =
      category === "all"
        ? baseMatches
        : baseMatches.filter((p) => p.category === category);

    // Always build comparison across all 3 markets for the searched query
    const allMarketMatches = query.trim()
      ? searchProducts(catalog.products, {
          query,
          market: "all",
          category: "all",
          sort: "price_asc",
        })
      : [];

    const comparison = buildComparisonSummary(query, allMarketMatches);
    const presentCategories = new Set(catalog.products.map((p) => p.category));
    const orderedCategories = [
      ...CATEGORY_ORDER.filter((c) => presentCategories.has(c)),
      ...Array.from(presentCategories)
        .filter((c) => !CATEGORY_ORDER.includes(c))
        .sort((a, b) => a.localeCompare(b, "tr-TR")),
    ];

    const payload: ProductsApiResponse = {
      products: filtered,
      categories: orderedCategories,
      categoryCounts,
      totalCount: baseMatches.length,
      statuses: catalog.statuses,
      comparison,
      lastUpdated: catalog.lastUpdated,
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Ürünler alınırken bir hata oluştu",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
