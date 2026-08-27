import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
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
      className={`${spaceGrotesk.variable} ${manrope.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-body selection:bg-terracotta selection:text-cream">
        {children}
      </body>
    </html>
  );
}
