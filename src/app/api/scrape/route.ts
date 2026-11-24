import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/scrapers";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const catalog = await getCatalog(true);
    return NextResponse.json({
      ok: true,
      totalProducts: catalog.products.length,
      statuses: catalog.statuses,
      lastUpdated: catalog.lastUpdated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Güncelleme başarısız",
      },
      { status: 500 }
    );
  }
}
