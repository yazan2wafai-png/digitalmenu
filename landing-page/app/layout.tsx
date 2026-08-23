import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFCMyPlace® | Fiziksel Dünyayı Dijitalle Buluştur",
  description:
    "Restoranlar ve kafeler için yeni nesil NFC & QR akıllı masa donanımları, Google 5 yıldızlı yorum standları ve dijital menü SaaS altyapısı.",
  openGraph: {
    title: "NFCMyPlace® | Fiziksel Dünyayı Dijitalle Buluştur",
    description:
      "Masalarınızı tek dokunuşla dijital menüye, Google 5 yıldızlı yorumlara ve sipariş sistemine bağlayın.",
    url: "https://nfcmyplace.com",
    siteName: "NFCMyPlace",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
