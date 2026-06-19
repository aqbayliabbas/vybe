/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
import { ReactNode } from 'react';
import Link from 'next/link';
import { Zap, Quote } from 'lucide-react';
import { Locale } from '@/app/[lang]/dictionaries';

interface AuthLayoutProps {
  children: ReactNode;
  dict: any;
  lang: Locale;
}

export default function AuthLayout({ children, dict, lang }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden">
      {/* Left Side: Brand Visuals */}
      <div className="hidden md:flex w-full md:w-[45%] lg:w-[40%] bg-zinc-950 relative flex-col justify-between p-10 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[60%] rounded-full bg-[oklch(0.62_0.20_28_/_0.15)] blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[oklch(0.82_0.17_55_/_0.15)] blur-[100px]" />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <Link href={`/${lang}`} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-pink shadow-lg">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-white">Vybe</span>
          </Link>
        </div>

        {/* Dynamic Testimonial */}
        <div className="relative z-10 w-full max-w-sm mt-auto mb-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <Quote className="h-8 w-8 text-vybe/50 mb-4" />
            <p className="text-[15px] leading-relaxed text-white/90 font-light mb-6">
              "{dict.testimonial_quote}"
            </p>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-vybe to-vybe-glow border border-white/20" />
              <div>
                <p className="font-heading text-sm font-semibold text-white">{dict.testimonial_author}</p>
                <p className="text-xs text-white/60">{dict.testimonial_role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="flex-1 flex flex-col justify-center relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-2.5 absolute top-8 left-6 z-20">
          <Link href={`/${lang}`} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-vybe to-vybe-glow shadow-sm">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">Vybe</span>
          </Link>
        </div>

        {/* Mobile Background Glow */}
        <div className="md:hidden absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[oklch(0.82_0.17_55_/_0.08)] blur-[80px] pointer-events-none" />
        
        <div className="w-full max-w-md mx-auto px-6 py-24 md:py-12 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
