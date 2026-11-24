export interface CategoryDef {
  id: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "Kahvaltı", label: "Kahvaltı", emoji: "🍳" },
  { id: "Akşam Yemeği", label: "Akşam Yemeği", emoji: "🍲" },
  { id: "Temizlik", label: "Temizlik", emoji: "🧼" },
  { id: "İçecek & Atıştırmalık", label: "İçecek & Atıştırmalık", emoji: "☕" },
  { id: "Elektronik", label: "Elektronik", emoji: "⚡" },
  { id: "Mutfak & Ev", label: "Mutfak & Ev", emoji: "🏠" },
];

export const CATEGORY_ORDER = CATEGORIES.map((c) => c.id);

export function classifyCategory(title: string): string {
  const t = title.toLocaleLowerCase("tr-TR");

  if (
    /(süt|peynir|kaşar|yoğurt|tereyağ|margarin|yumurta|zeytin|sucuk|salam|sosis|bal|reçel|tahin|pekmez|fındık krem|krem peynir|labne|kaymak|lor|tost ekmeğ)/.test(
      t
    )
  ) {
    return "Kahvaltı";
  }

  if (
    /(ayçiçek|zeytinyağ|sıvı yağ|pirinç|bulgur|makarna|mercimek|nohut|fasulye|salça|un |şeker|tavuk|piliç|dana|kıyma|köfte|balık|ton balığ|mantı|çorba|baharat|ketçap|mayonez|sos|bakliyat|patates|soğan|domates|biber|et )/.test(
      t
    )
  ) {
    return "Akşam Yemeği";
  }

  if (
    /(deterjan|yumuşatıcı|şampuan|sabun|tuvalet kağıd|kağıt havlu|çamaşır suyu|bulaşık|tablet|diş macun|diş fırça|yüzey temiz|çöp poşet|sünger|temizlik|peçete|ıslak mendil|bebek bezi|deodorant)/.test(
      t
    )
  ) {
    return "Temizlik";
  }

  if (
    /(çay(?!\s*makine|\s*danlık)|kahve(?!\s*makine)|kola|meyve suyu|maden suyu|gazoz|ayran|içecek|çikolata|bisküvi|cips|kuruyemiş|gofret|kek|kraker|dondurma|şekerleme)/.test(
      t
    )
  ) {
    return "İçecek & Atıştırmalık";
  }

  if (
    /(tv|televizyon|telefon|tablet|airfryer|fritöz|süpürge|ütü|blender|çay makine|kahve makine|kulaklık|akıllı saat|fırın|mikrodalga|vantilatör|ısıtıcı|tost makine|kettle|mikser|rondo|saç kurutma|powerbank)/.test(
      t
    )
  ) {
    return "Elektronik";
  }

  if (
    /(tava|tencere|bardak|tabak|çatal|bıçak|saklama kab|termos|sürahi|çaydanlık|havlu|nevresim|yastık|battaniye|halı|kilim|düzenleyici|hurç|sepet|askı)/.test(
      t
    )
  ) {
    return "Mutfak & Ev";
  }

  return "Mutfak & Ev";
}
