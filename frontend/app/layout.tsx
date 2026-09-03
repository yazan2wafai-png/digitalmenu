import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NFCMyPlace® | Temassız NFC & QR Google Yorum Kartı ve Akıllı Menü Sistemi',
  description:
    'Restoranlar, kafeler ve işletmeler için lüks akrilik pleksi NFC Google yorum kartı, L-Stand ve bulut tabanlı masadan sipariş SaaS menü altyapısı.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <style>{`
          html { scroll-behavior: smooth; }
          ::selection { background: rgba(201,168,108,0.25); color: #F0E6D3; }

          @keyframes gold-shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes float-a {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-18px); }
          }
          @keyframes float-b {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes beacon-pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.85; transform: scale(1.15); }
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
      <body className={`${inter.variable} font-sans bg-[#0D0B08] text-[#F0E6D3] antialiased`}>
        {children}
      </body>
    </html>
  );
}
