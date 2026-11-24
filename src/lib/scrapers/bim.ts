import * as cheerio from "cheerio";
import { Product } from "../types";

const BIM_URLS = [
  "https://www.bim.com.tr/default.aspx",
  "https://www.bim.com.tr/Categories/680/afisler.aspx",
];

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function parseTurkishPrice(text: string): number | null {
  const cleaned = text
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function guessCategory(title: string): string {
  const t = title.toLocaleLowerCase("tr-TR");
  if (/(tv|televizyon|telefon|tablet|airfryer|fritöz|süpürge|ütü|blender|çay makinesi|kahve makinesi|kulaklık|saat|fırın|mikrodalga|vantilatör|ısıtıcı|tost makinesi|kettle)/.test(t)) {
    return "Elektronik & Küçük Ev Aletleri";
  }
  if (/(tava|tencere|bardak|tabak|çatal|bıçak|saklama kabı|termos|sürahi|çaydanlık|havlu|nevresim|yastık|battaniye)/.test(t)) {
    return "Mutfak & Ev";
  }
  if (/(deterjan|yumuşatıcı|şampuan|sabun|tuvalet kağıdı|kağıt havlu|çamaşır suyu|bulaşık|diş macunu|bez)/.test(t)) {
    return "Temizlik & Kişisel Bakım";
  }
  if (/(süt|peynir|yoğurt|tereyağı|yumurta|zeytin|sucuk|salam|kaşar|ayran|bal|reçel)/.test(t)) {
    return "Süt & Kahvaltılık";
  }
  if (/(çay|kahve|kola|meyve suyu|maden suyu|gazoz|içecek|su )/.test(t)) {
    return "İçecek";
  }
  if (/(yağ|un|şeker|pirinç|bulgur|makarna|mercimek|salça|çikolata|bisküvi|cips|kuruyemiş)/.test(t)) {
    return "Temel Gıda";
  }
  return "Aktüel Ürünler";
}

export async function scrapeBim(): Promise<{
  products: Product[];
  error?: string;
}> {
  const collected: Product[] = [];
  const seen = new Set<string>();

  for (const url of BIM_URLS) {
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

      const aktuelDate =
        $(".subButtonArea .active, .aktuel-title, .dateTitle, h2.title")
          .first()
          .text()
          .trim() || "Güncel Aktüel";

      $(".product, .productArea .inner, .g-col-product").each((idx, el) => {
        const $el = $(el);
        const brand = $el.find(".subTitle, .brand").first().text().trim();
        const rawTitle = $el.find(".title, h2, h3").first().text().trim();
        const title = brand && rawTitle && !rawTitle.toLowerCase().includes(brand.toLowerCase())
          ? `${brand} ${rawTitle}`
          : rawTitle || brand;

        const integerPart = $el.find(".quantify, .integer, .price .big").first().text().trim();
        const decimalPart = $el.find(".number, .decimal, .price .small").first().text().trim();
        const rawPrice =
          integerPart && decimalPart
            ? `${integerPart},${decimalPart.replace(",", "")}`
            : $el.find(".price, .curr, .fiyat").first().text().trim();

        const price = parseTurkishPrice(rawPrice);
        if (!title || !price) return;

        const key = `${title.toLowerCase()}-${price}`;
        if (seen.has(key)) return;
        seen.add(key);

        let imgSrc = $el.find("img").first().attr("src") || $el.find("img").first().attr("data-src");
        if (imgSrc && imgSrc.startsWith("/")) {
          imgSrc = `https://www.bim.com.tr${imgSrc}`;
        }

        let href = $el.find("a").first().attr("href") || url;
        if (href.startsWith("/")) {
          href = `https://www.bim.com.tr${href}`;
        }

        collected.push({
          id: `live-bim-${idx}-${collected.length}`,
          market: "bim",
          title,
          brand: brand || undefined,
          subtitle: $el.find(".text, .desc, .detail").first().text().trim() || undefined,
          price,
          category: guessCategory(title),
          imageUrl: imgSrc,
          productUrl: href,
          aktuelDate,
          source: "live",
        });
      });

      if (collected.length > 0) {
        break;
      }
    } catch (err) {
      if (url === BIM_URLS[BIM_URLS.length - 1] && collected.length === 0) {
        return {
          products: [],
          error: err instanceof Error ? err.message : "BİM bağlantı hatası",
        };
      }
    }
  }

  return { products: collected };
}
