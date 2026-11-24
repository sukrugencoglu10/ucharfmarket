import { NextRequest, NextResponse } from "next/server";
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

    const filtered = searchProducts(catalog.products, {
      query,
      market: marketParam,
      category,
      sort,
    });

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
    const categories = Array.from(new Set(catalog.products.map((p) => p.category))).sort((a, b) =>
      a.localeCompare(b, "tr-TR")
    );

    const payload: ProductsApiResponse = {
      products: filtered,
      categories,
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
