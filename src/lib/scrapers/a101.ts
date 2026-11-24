import * as cheerio from "cheerio";
import { Product } from "../types";

const A101_URLS = [
  "https://www.a101.com.tr/aldin-aldin",
  "https://www.a101.com.tr/ekstra/aldin-aldin",
];

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function parseTurkishPrice(text: string | number | undefined): number | null {
  if (typeof text === "number") return Number.isFinite(text) && text > 0 ? text : null;
  if (!text) return null;
  const cleaned = String(text)
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function guessCategory(title: string): string {
  const t = title.toLocaleLowerCase("tr-TR");
  if (/(tv|televizyon|telefon|tablet|airfryer|fritöz|süpürge|ütü|blender|çay makinesi|kahve makinesi|kulaklık|saat|fırın|mikrodalga|tost makinesi|kettle)/.test(t)) {
    return "Elektronik & Küçük Ev Aletleri";
  }
  if (/(tava|tencere|bardak|tabak|çatal|bıçak|saklama kabı|termos|sürahi|çaydanlık|havlu|nevresim|yastık|battaniye)/.test(t)) {
    return "Mutfak & Ev";
  }
  if (/(deterjan|yumuşatıcı|şampuan|sabun|tuvalet kağıdı|kağıt havlu|çamaşır suyu|bulaşık|diş macunu)/.test(t)) {
    return "Temizlik & Kişisel Bakım";
  }
  if (/(süt|peynir|yoğurt|tereyağı|yumurta|zeytin|sucuk|salam|kaşar|ayran|bal|reçel)/.test(t)) {
    return "Süt & Kahvaltılık";
  }
  if (/(çay|kahve|kola|meyve suyu|maden suyu|gazoz|içecek)/.test(t)) {
    return "İçecek";
  }
  if (/(yağ|un|şeker|pirinç|bulgur|makarna|mercimek|salça|çikolata|bisküvi|cips|kuruyemiş)/.test(t)) {
    return "Temel Gıda";
  }
  return "Aldın Aldın Aktüel";
}

function extractFromJsonLd($: cheerio.CheerioAPI, fallbackUrl: string): Product[] {
  const products: Product[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "{}");
      const items = Array.isArray(json)
        ? json
        : json.itemListElement || json["@graph"] || [json];

      for (const entry of items) {
        const item = entry?.item || entry;
        if (!item || (item["@type"] !== "Product" && !item.offers)) continue;
        const title = String(item.name || "").trim();
        const price = parseTurkishPrice(item.offers?.price ?? item.offers?.lowPrice);
        if (!title || !price) continue;

        products.push({
          id: `live-a101-ld-${products.length}`,
          market: "a101",
          title,
          brand: typeof item.brand === "string" ? item.brand : item.brand?.name,
          price,
          category: guessCategory(title),
          imageUrl: Array.isArray(item.image) ? item.image[0] : item.image,
          productUrl: item.url || fallbackUrl,
          aktuelDate: "Aldın Aldın Güncel",
          source: "live",
        });
      }
    } catch {
      // ignore invalid JSON-LD blocks
    }
  });
  return products;
}

export async function scrapeA101(): Promise<{
  products: Product[];
  error?: string;
}> {
  const collected: Product[] = [];
  const seen = new Set<string>();

  for (const url of A101_URLS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.5",
        },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      // 1) Try JSON-LD structured product data
      for (const p of extractFromJsonLd($, url)) {
        const key = `${p.title.toLowerCase()}-${p.price}`;
        if (!seen.has(key)) {
          seen.add(key);
          collected.push(p);
        }
      }

      // 2) Fallback to HTML product card selectors
      if (collected.length === 0) {
        $(".product-card, article.product, [data-testid='product-card'], .product-item").each((idx, el) => {
          const $el = $(el);
          const title = $el.find("h3, h2, .name, .product-name").first().text().trim();
          const price = parseTurkishPrice(
            $el.find(".current, .price, [data-testid='product-price']").first().text()
          );
          if (!title || !price) return;

          const key = `${title.toLowerCase()}-${price}`;
          if (seen.has(key)) return;
          seen.add(key);

          let href = $el.find("a").first().attr("href") || url;
          if (href.startsWith("/")) href = `https://www.a101.com.tr${href}`;
          const img = $el.find("img").first().attr("src") || $el.find("img").first().attr("data-src");

          collected.push({
            id: `live-a101-html-${idx}-${collected.length}`,
            market: "a101",
            title,
            price,
            category: guessCategory(title),
            imageUrl: img,
            productUrl: href,
            aktuelDate: "Aldın Aldın Güncel",
            source: "live",
          });
        });
      }

      if (collected.length > 0) break;
    } catch (err) {
      if (url === A101_URLS[A101_URLS.length - 1] && collected.length === 0) {
        return {
          products: [],
          error: err instanceof Error ? err.message : "A101 bağlantı hatası",
        };
      }
    }
  }

  return { products: collected };
}
