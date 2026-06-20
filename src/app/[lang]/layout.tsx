import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const gambarino = localFont({
  src: [
    {
      path: "../../../public/landing/Fonts/Gambarino/Gambarino-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/landing/Fonts/Gambarino/Gambarino-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const kobanzeen = localFont({
  src: [
    {
      path: "../../../public/landing/Fonts/Ko-Banzeen/Ko_Banzeen-Normal.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vybe - Algeria Connect",
  description: "Connect with Algeria's top brands & creators",
  icons: {
    icon: "/favicon.svg",
  },
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }, { lang: 'ar' }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const isArabic = lang === "ar";
  
  const fontVariables = isArabic 
    ? `${kobanzeen.variable} ${kobanzeen.variable}` // Using kobanzeen for both sans and heading when arabic
    : `${inter.variable} ${gambarino.variable}`;

  return (
    <html lang={lang} dir={isArabic ? "rtl" : "ltr"} className={fontVariables} suppressHydrationWarning>
      <body className={`antialiased ${isArabic ? 'font-arabic' : ''}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

