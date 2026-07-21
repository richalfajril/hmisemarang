import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Rubik, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/shared/lib/QueryProvider';
import { SITE_URL } from '@/widgets/public-layout/config/site';

// Rubik: body, subheading, eyebrow, dll. Bricolage Grotesque: heading.
const rubik = Rubik({ subsets: ["latin"], variable: "--font-sans" });

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HMI Cabang Semarang",
  description: "Portal resmi Himpunan Mahasiswa Islam Cabang Semarang.",
  icons: {
    // .ico pertama: Google Search mengambil & meng-cache /favicon.ico di root; SVG untuk tab modern.
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#065f46",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", "font-sans", rubik.variable, bricolage.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
