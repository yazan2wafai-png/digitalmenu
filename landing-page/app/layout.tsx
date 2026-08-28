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

const siteUrl = "https://nfcmyplace.com";
const title = "NFCMyPlace® | NFC & QR Google Yorum Kartı, Dijital Menü";
const description =
  "Restoranlar ve kafeler için NFC & QR kodlu Google yorum kartı, akrilik masa stickerı (NFC menü) ve yönetim panelli dijital menü SaaS altyapısı. Fiziksel dünyayı dijitalle buluşturun.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | NFCMyPlace",
  },
  description,
  keywords: [
    "nfc google yorum kartı",
    "google yorum kartı",
    "google yorum standı",
    "google puanlama kartı",
    "nfc dijital kartvizit",
    "nfc menü sticker",
    "qr menü",
    "dijital menü",
    "karekod menü",
    "restoran dijital menü sistemi",
    "restoran qr menü",
    "temassız menü",
  ],
  applicationName: "NFCMyPlace",
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title,
    description:
      "Masalarınızı tek dokunuşla Google yorum kartına, dijital menüye ve sipariş sistemine bağlayın.",
    url: siteUrl,
    siteName: "NFCMyPlace",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/products/lstand-mockup.png",
        width: 1200,
        height: 1500,
        alt: "NFC ve QR kodlu Google yorum kartı - L-Stand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/products/lstand-mockup.png"],
  },
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "NFCMyPlace",
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      description,
      areaServed: "TR",
    },
    {
      "@type": "Product",
      name: "NFC & QR Google Yorum Standı",
      description:
        "75° ergonomik açılı monolitik akrilik gövde, NTAG213 temassız çip ve restoranınıza özel kurumsal tasarım baskı ile Google yorumlarınızı artırın.",
      image: `${siteUrl}/products/lstand-mockup.png`,
      brand: { "@type": "Brand", name: "NFCMyPlace" },
      offers: {
        "@type": "Offer",
        priceCurrency: "TRY",
        price: "1750",
        availability: "https://schema.org/InStock",
        url: siteUrl,
      },
    },
    {
      "@type": "Product",
      name: "Akrilik Masa Stickerı (NFC + QR Menü)",
      description:
        "Ultra dayanıklı 2mm pleksi akrilik, 3M endüstriyel VHB yapışkan ve IP68 sıvı geçirmez koruma ile masalarınızı tek dokunuşla dijital menünüze bağlayın.",
      image: `${siteUrl}/products/masa-stickeri-mockup.png`,
      brand: { "@type": "Brand", name: "NFCMyPlace" },
      offers: {
        "@type": "Offer",
        priceCurrency: "TRY",
        price: "175",
        availability: "https://schema.org/InStock",
        url: siteUrl,
      },
    },
    {
      "@type": "Service",
      name: "Restoran Dijital Menü SaaS Altyapısı",
      description:
        "Sıfır komisyon, anlık bulut yönetim paneli, çoklu dil desteği (TR/EN/AR) ve alerjen bilgilendirmeli mobil 3D kart arayüzü ile eksiksiz restoran dijital menü altyapısı.",
      provider: { "@type": "Organization", name: "NFCMyPlace" },
      areaServed: "TR",
      offers: {
        "@type": "Offer",
        priceCurrency: "TRY",
        price: "3000",
        url: siteUrl,
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
