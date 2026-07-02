import type { Metadata } from "next";
import { Bricolage_Grotesque, Rubik, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Toaster } from 'sonner';
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
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
