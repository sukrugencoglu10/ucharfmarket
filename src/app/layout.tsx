import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Üç Harf Market — BİM, A101, ŞOK Aktüel Fiyat Karşılaştırma",
  description:
    "BİM, A101 ve ŞOK aktüel katalog ürünlerindeki fiyatları tek ekranda arayın ve en uygun marketi anında bulun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
