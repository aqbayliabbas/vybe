import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const advercase = localFont({
  src: [
    {
      path: "../../../public/landing/Fonts/Advercase/Advercase-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/landing/Fonts/Advercase/Advercase-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const palestine = localFont({
  src: [
    {
      path: "../../../public/landing/Fonts/Palestine/Palestine-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-heading",
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
    ? `${inter.variable} ${palestine.variable}`
    : `${inter.variable} ${advercase.variable}`;

  return (
    <html lang={lang} dir={isArabic ? "rtl" : "ltr"} className={fontVariables} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
