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
  "Restoranlar ve kafeler için NFC & QR kodlu Google yorum kartı, akrilik masa stickerı ve yönetim panelli dijital menü SaaS altyapısı.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | NFCMyPlace" },
  description,
  robots: { index: true, follow: true },
  openGraph: { title, description, url: siteUrl, siteName: "NFCMyPlace", locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${spaceGrotesk.variable} ${manrope.variable}`}
      style={{ scrollBehavior: "smooth" }}>
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body {
            margin: 0;
            background: #0D0B08;
            color: #F0E6D3;
            font-family: var(--font-body), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
          }
          ::selection { background: rgba(201,168,108,0.25); color: #F0E6D3; }

          @keyframes gold-shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes float-a {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-b {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-14px); }
          }
          @keyframes beacon-pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.15); }
          }

          .gold-text {
            background: linear-gradient(135deg, #B8925A 0%, #E8CC85 40%, #C9A86C 65%, #8A6835 100%);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gold-shimmer 5s ease-in-out infinite;
          }
          .float-slow { animation: float-a 9s ease-in-out infinite; }
          .float-delayed { animation: float-b 11s ease-in-out infinite; animation-delay: -4s; }
          .beacon { animation: beacon-pulse 3s ease-in-out infinite; }

          .glass-warm {
            background: rgba(22, 18, 10, 0.75);
            backdrop-filter: blur(28px) saturate(160%);
            -webkit-backdrop-filter: blur(28px) saturate(160%);
            border: 1px solid rgba(201, 168, 108, 0.12);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .glass-warm:hover {
            border-color: rgba(201, 168, 108, 0.28);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          }
          .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
          .scrollbar-none::-webkit-scrollbar { display: none; }
        `}</style>
      </head>
      <body style={{ minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
