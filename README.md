# Üç Harf Market — BİM, A101, ŞOK Aktüel Fiyat Karşılaştırma

BİM, A101 ve ŞOK marketlerinin aktüel ürün fiyatlarını tek ekranda arayıp karşılaştırmanızı sağlayan Next.js (TypeScript + Tailwind CSS) web uygulaması.

## Özellikler

- **Canlı Veri Çekme + Yedek Veri Desteği:** BİM, A101 ve ŞOK aktüel sayfalarından canlı ürün/fiyat çekmeyi dener; herhangi bir market sitesinde erişim veya bot engeli olursa o market için güncel yapıda yedek aktüel veriyi devreye alır ve durumunu üst çubukta şeffaf şekilde gösterir.
- **Otomatik 3 Market Karşılaştırması:** Arama kutusuna bir ürün yazdığınızda (örn. *Ayçiçek Yağı*, *Süt*, *Airfryer*, *Tost Peyniri*) 3 marketteki en uygun fiyatları yan yana getirir, en ucuz marketi ve tasarruf tutarını vurgular.
- **Manuel Karşılaştırma Listesi:** Dilediğiniz ürünleri "Karşılaştır" butonuyla seçip yan yana karşılaştırabilirsiniz.
- **Türkçe Duyarlı Arama ve Filtreleme:** Türkçe karakter (`ç, ğ, ı, İ, ö, ş, ü`) uyumlu arama, market filtresi, kategori filtresi ve fiyat/indirim sıralaması.

## Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.
