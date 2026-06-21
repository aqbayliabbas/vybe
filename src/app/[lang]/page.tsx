import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, Users, Eye, Trophy, BarChart3, Check, Star, MapPin, Sparkles, Target, Globe, BadgeCheck, Languages, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PricingSection from '@/components/PricingSection';
import LangSwitcher from '@/components/LangSwitcher';
import { getDictionary, Locale } from './dictionaries';
import WaitlistForm from '@/components/WaitlistForm';
import MobileNav from '@/components/MobileNav';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';
import { VybeLogo } from '@/components/VybeLogo';

export const metadata: Metadata = {
  title: "Vybe — Le marketing d'influence, pensé pour la MENA",
  description: "Connectez votre marque à des créateurs vérifiés à travers la MENA. Collaborations directes, statistiques authentiques, paiements locaux. De l'Algérie au Golfe.",
};

export default async function Index({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.17_55_/_0.18)] blur-[120px]" />
        <div className="absolute top-[600px] right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.62_0.19_28_/_0.10)] blur-[100px]" />
        <div className="absolute top-[1200px] left-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.78_0.15_50_/_0.10)] blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-4 sm:top-6 inset-x-0 z-50 pointer-events-none">
        <div className="mx-auto flex items-center justify-between px-4 sm:px-8 max-w-[1240px] pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center px-2">
            <VybeLogo className="scale-90 sm:scale-100 origin-left" />
          </div>

          {/* Mobile hamburger */}
          <MobileNav lang={lang} dict={dict.nav} page="brands" />

          {/* Right Section - Double Pill Container (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Nav Links Pill */}
            <div className="flex items-center p-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl shadow-inner">
              <div className="flex items-center gap-6 px-6 h-[42px] rounded-full bg-white dark:bg-zinc-900 shadow-md border border-black/5 dark:border-white/5">
                <span className="hover:text-foreground text-[13px] font-semibold text-foreground/80 transition-colors duration-300 cursor-pointer">{dict.nav.brands}</span>
                <Link href={`/${lang}/for-creators`} className="hover:text-foreground text-[13px] font-semibold text-foreground/80 transition-colors duration-300">{dict.nav.creators}</Link>
                <a href="#pricing" className="hover:text-foreground text-[13px] font-semibold text-foreground/80 transition-colors duration-300">{dict.nav.pricing}</a>
                <div className="w-px h-3 bg-black/10 dark:bg-white/10" />
                <Link href={`/${lang}/login`} className="hover:text-foreground text-[13px] font-semibold text-foreground/80 transition-colors duration-300">
                  {dict.nav.login}
                </Link>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="p-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl shadow-inner">
              <div className="rounded-full bg-white dark:bg-zinc-900 shadow-md border border-black/5 dark:border-white/5">
                <LangSwitcher currentLang={lang} />
              </div>
            </div>

            {/* CTA Button */}
            <Link href={`/${lang}/signup`}>
              <Button size="sm" className="rounded-full px-6 text-[13px] h-[42px] shadow-md transition-all duration-300 gap-1.5 bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] text-white border-0 hover:opacity-90 hover:scale-105">
                {dict.nav.start} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20">
        <FadeIn delay={0.1} duration={1}>
          <div className="relative mx-auto max-w-[1240px] px-4 sm:px-8 pt-24 pb-16 text-center md:pt-32 md:pb-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full glass border border-vybe/20 px-4 py-1.5 text-[12px] font-medium text-muted-foreground mb-8 shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-vybe" />
              {dict.hero.badge}
            </div>
            <h1 className="font-heading mx-auto max-w-4xl text-[36px] sm:text-[44px] font-extrabold tracking-tight text-foreground md:text-[64px] md:leading-[1.08] leading-[1.1]">
              {dict.hero.title_main}{' '}
              <span className="bg-gradient-to-r from-vybe via-vybe-glow to-vybe-pink bg-clip-text text-transparent">{dict.hero.title_highlight}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] text-muted-foreground leading-relaxed font-light">
              {dict.waitlist.hero_desc}
            </p>
            <div className="mt-10 w-full flex justify-center">
              <WaitlistForm dict={dict.waitlist} />
            </div>
            <p className="mt-4 text-[12px] text-muted-foreground/50 font-light">{dict.waitlist.no_spam}</p>
            
            {/* Simple Text Stats */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {[
                { value: dict.stats.creators_val, label: dict.stats.creators_label },
                { value: dict.stats.collabs_val, label: dict.stats.collabs_label },
                { value: dict.stats.views_val, label: dict.stats.views_label },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-heading text-3xl font-extrabold text-foreground tracking-tight">{s.value}</p>
                  <p className="text-[13px] text-muted-foreground mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* App Screenshot (Flat Placement) */}
        <FadeIn delay={0.4} direction="up">
          <div className="relative mx-auto max-w-[1100px] px-4 sm:px-8 mt-2 mb-20">
            <img 
              src="/vybedashboard.png" 
              alt="Dashboard Vybe" 
              className="w-full h-auto object-cover rounded-xl sm:rounded-[2rem] shadow-md border border-border/40"
            />
          </div>
        </FadeIn>
      </section>

      {/* How It Works — Deals */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <FadeIn>
            <h2 className="font-heading mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{dict.deals.title}</h2>
            <p className="mb-16 text-center text-[15px] text-muted-foreground max-w-md mx-auto font-light">{dict.deals.desc}</p>
          </FadeIn>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: dict.deals.step1_title, desc: dict.deals.step1_desc },
              { step: '02', title: dict.deals.step2_title, desc: dict.deals.step2_desc },
              { step: '03', title: dict.deals.step3_title, desc: dict.deals.step3_desc },
            ].map((s) => (
              <StaggerItem key={s.step} className="rounded-3xl glass p-8 shadow-card hover:shadow-soft transition-all duration-500 border border-vybe/10 relative group">
                <div className="absolute top-5 ltr:right-6 rtl:left-6 font-heading text-[11px] font-bold text-vybe/25 tracking-wider">{s.step}</div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7931e]/15 to-[#ea2d3e]/10 group-hover:from-[#f7931e]/25 group-hover:to-[#ea2d3e]/20 transition-all duration-500">
                  <BadgeCheck className="h-5 w-5 text-vybe" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground font-light">{s.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.4}>
            <div className="mt-12 text-center">
              <Link href={`/${lang}/deals/new`}>
                <Button size="lg" className="rounded-2xl px-8 h-12 text-sm font-semibold gap-2 bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] text-white border-0 hover:opacity-90 shadow-soft">{dict.deals.button} <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Creator Database Teaser */}
      <section className="py-16 md:py-32">
        <FadeIn>
          <div className="mx-auto max-w-[1240px] px-4 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-[40px] font-bold tracking-tight text-foreground leading-tight">{dict.creators_teaser.title_main} <span className="bg-gradient-to-r from-vybe to-vybe-pink bg-clip-text text-transparent">{dict.creators_teaser.title_highlight}</span></h2>
              <p className="mt-5 text-[15px] text-muted-foreground font-light leading-relaxed max-w-lg">
                {dict.creators_teaser.desc}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {dict.creators_teaser.tags.map((f) => (
                  <span key={f} className="rounded-full glass border border-vybe/20 px-3 py-1.5 text-[12px] font-medium text-foreground/80 shadow-card hover:border-vybe/40 transition-colors">{f}</span>
                ))}
              </div>
              <div className="mt-8">
                <Link href={`/${lang}/for-creators`}>
                  <Button size="lg" className="rounded-2xl px-8 h-12 text-sm font-semibold shadow-soft gap-2 bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] text-white border-0 hover:opacity-90">{dict.creators_teaser.button} <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 relative">
                {[
                  { name: 'Lina M.', niche: dict.creators_teaser.niches.beauty },
                  { name: 'Yacine B.', niche: dict.creators_teaser.niches.tech },
                  { name: 'Sara K.', niche: dict.creators_teaser.niches.fashion },
                  { name: 'Karim H.', niche: dict.creators_teaser.niches.food },
                ].map((c) => (
                  <div key={c.name} className="rounded-2xl glass p-5 border border-border/30 shadow-card">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-vybe to-vybe-pink mb-3" />
                    <p className="font-heading text-[13px] font-semibold text-foreground blur-[3px] select-none">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{c.niche}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Filter className="h-3 w-3" /> <span className="blur-[2px] select-none">42.3k</span>
                    </div>
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80 rounded-3xl flex items-end justify-center pb-8 pointer-events-none">
                  <span className="rounded-full glass-strong px-4 py-2 text-[12px] font-semibold text-foreground shadow-soft border border-border/30">{dict.creators_teaser.overlay}</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Why Vybe */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <FadeIn>
            <h2 className="font-heading mb-16 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{dict.why_vybe.title}</h2>
          </FadeIn>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Globe, title: dict.why_vybe.feat1_title, desc: dict.why_vybe.feat1_desc },
              { icon: BadgeCheck, title: dict.why_vybe.feat2_title, desc: dict.why_vybe.feat2_desc },
              { icon: Languages, title: dict.why_vybe.feat3_title, desc: dict.why_vybe.feat3_desc },
            ].map((f) => (
              <StaggerItem key={f.title} className="rounded-3xl glass p-8 shadow-card hover:shadow-soft transition-all duration-500 group border border-vybe/10 hover:border-vybe/25">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7931e]/15 to-[#ea2d3e]/10 group-hover:scale-110 group-hover:from-[#f7931e]/25 group-hover:to-[#ea2d3e]/20 transition-all duration-500">
                  <f.icon className="h-5 w-5 text-vybe" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground font-light">{f.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection dict={dict.pricing} lang={lang as Locale} />

      {/* Testimonials */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <FadeIn>
            <h2 className="font-heading mb-16 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{dict.testimonials.title}</h2>
          </FadeIn>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              { quote: dict.testimonials.t1_quote, name: 'Anis B.', role: dict.testimonials.t1_role },
              { quote: dict.testimonials.t2_quote, name: 'Sara M.', role: dict.testimonials.t2_role },
              { quote: dict.testimonials.t3_quote, name: 'Youssef K.', role: dict.testimonials.t3_role },
            ].map((t) => (
              <StaggerItem key={t.name} className="rounded-3xl glass p-8 shadow-card border border-vybe/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[oklch(0.82_0.17_55_/_0.08)] blur-[60px] pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-vybe fill-vybe" />
                    ))}
                  </div>
                  <blockquote className="text-[14px] font-medium text-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="mt-6">
                    <p className="text-[13px] font-semibold text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32">
        <FadeIn>
          <div className="mx-auto max-w-[1240px] px-4 sm:px-8 text-center">
            <div className="rounded-[28px] bg-gradient-to-br from-[#f7931e] via-[#e85820] to-[#ea2d3e] p-8 md:p-20 shadow-elevated relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.90_0.12_60_/_0.25)] blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[oklch(0.55_0.20_20_/_0.30)] blur-[80px] pointer-events-none" />
              <div className="relative">
                <h2 className="font-heading text-3xl font-bold text-white md:text-[44px] mb-4 leading-tight">{dict.cta.title}</h2>
                <p className="text-[15px] text-white/70 max-w-md mx-auto mb-10 font-light">{dict.cta.desc}</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href={`/${lang}/signup`}>
                    <Button size="lg" className="bg-white text-[#ea2d3e] hover:bg-white/95 font-semibold rounded-2xl px-8 h-12 text-sm shadow-soft transition-all duration-300 hover:shadow-elevated gap-2">
                      {dict.cta.start_free} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white rounded-2xl px-8 h-12 text-sm transition-all duration-300">
                    {dict.cta.view_demo}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden mt-24">
        {/* Ambient glow underneath */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[oklch(0.82_0.17_55_/_0.12)] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.62_0.20_28_/_0.07)] blur-[100px]" />
        </div>

        {/* Main content card */}
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <div className="glass-strong rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden">

            {/* Top grid */}
            <div className="px-6 sm:px-10 pt-10 pb-8 sm:pt-12 sm:pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-10">

                {/* Left: Brand + Social + Contact */}
                <div className="flex flex-col gap-8">
                  {/* Logo */}
                  <VybeLogo />

                  {/* Social icons */}
                  <div className="flex items-center gap-2.5">
                    {/* Instagram */}
                    <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-vybe hover:border-vybe/40 hover:bg-vybe/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    {/* X */}
                    <a href="#" aria-label="X" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    {/* TikTok */}
                    <a href="#" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-vybe hover:border-vybe/40 hover:bg-vybe/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-2 text-[14px] text-muted-foreground">
                    <p className="leading-relaxed">
                      {lang === 'ar' ? 'الجزائر العاصمة، الجزائر' : lang === 'fr' ? 'Alger, Algérie' : 'Algiers, Algeria'}
                    </p>
                    <a href="mailto:hello@vybe.app" className="block hover:text-vybe transition-colors font-medium">hello@vybe.app</a>
                  </div>

                  {/* Lang switcher */}
                  <div className="flex items-center gap-4 text-[12px] text-muted-foreground/60 font-semibold uppercase tracking-widest">
                    <Link href="/en" className={`hover:text-foreground transition-colors ${lang === 'en' ? 'text-foreground' : ''}`}>EN</Link>
                    <span className="text-border">·</span>
                    <Link href="/fr" className={`hover:text-foreground transition-colors ${lang === 'fr' ? 'text-foreground' : ''}`}>FR</Link>
                    <span className="text-border">·</span>
                    <Link href="/ar" className={`hover:text-foreground transition-colors ${lang === 'ar' ? 'text-foreground' : ''}`}>عربي</Link>
                  </div>
                </div>

                {/* Right: Nav columns */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Platform */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-5">
                      {lang === 'ar' ? 'المنصة' : lang === 'fr' ? 'Plateforme' : 'Platform'}
                    </p>
                    <ul className="space-y-3 text-[14px] text-muted-foreground">
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.brands}</span></li>
                      <li><Link href={`/${lang}/for-creators`} className="hover:text-foreground transition-colors">{dict.footer.creators}</Link></li>
                      <li><a href="#pricing" className="hover:text-foreground transition-colors">{dict.footer.pricing}</a></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.about}</span></li>
                    </ul>
                  </div>
                  {/* Resources */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-5">
                      {lang === 'ar' ? 'الموارد' : lang === 'fr' ? 'Ressources' : 'Resources'}
                    </p>
                    <ul className="space-y-3 text-[14px] text-muted-foreground">
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{lang === 'ar' ? 'المدونة' : lang === 'fr' ? 'Blog' : 'Blog'}</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{lang === 'ar' ? 'التوثيق' : lang === 'fr' ? 'Docs' : 'Docs'}</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{lang === 'ar' ? 'الشركاء' : lang === 'fr' ? 'Affiliés' : 'Affiliates'}</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.contact}</span></li>
                    </ul>
                  </div>
                  {/* Legal */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-5">
                      {lang === 'ar' ? 'قانوني' : lang === 'fr' ? 'Légal' : 'Legal'}
                    </p>
                    <ul className="space-y-3 text-[14px] text-muted-foreground">
                      <li><Link href={`/${lang}/terms`} className="hover:text-foreground transition-colors">{dict.footer.terms}</Link></li>
                      <li><Link href={`/${lang}/privacy`} className="hover:text-foreground transition-colors">{dict.footer.privacy}</Link></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{lang === 'ar' ? 'ملفات تعريف الارتباط' : 'Cookies'}</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider + CTA */}
            <div className="px-6 sm:px-10 py-6 border-t border-border/50">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
                  {lang === 'ar'
                    ? 'من التسويق عبر المؤثرين إلى النتائج الحقيقية. نربط علامتك بالجمهور المناسب.'
                    : lang === 'fr'
                    ? "Du marketing d'influence aux vrais résultats. Nous connectons votre marque à la bonne audience."
                    : 'From influencer marketing to real results. We connect your brand with the right audience.'}
                </p>
                <Link href={`/${lang}/signup`}>
                  <button className="flex-shrink-0 brand-gradient text-white text-[13px] font-bold px-7 py-3 rounded-full hover:opacity-90 transition-all duration-300 shadow-soft hover:shadow-elevated hover:scale-105">
                    {lang === 'ar' ? 'ابدأ الآن' : lang === 'fr' ? 'Commencer' : 'Get Started'}
                  </button>
                </Link>
              </div>
            </div>

            {/* Giant Vybe wordmark */}
            <div className="relative overflow-hidden select-none pointer-events-none border-t border-border/30" aria-hidden="true">
              <p
                className="font-heading font-black brand-gradient-text opacity-[0.08] whitespace-nowrap leading-none"
                style={{ fontSize: 'clamp(80px, 16vw, 220px)', letterSpacing: '-0.04em', lineHeight: 0.85, paddingBottom: '0.05em', paddingLeft: '0.12em' }}
              >
                Vybe.—
              </p>
            </div>

            {/* Bottom bar */}
            <div className="px-6 sm:px-10 py-5 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-muted-foreground/60">
              <p>{dict.footer.rights}</p>
              <div className="flex items-center gap-6">
                <Link href={`/${lang}/terms`} className="hover:text-foreground transition-colors uppercase tracking-widest font-semibold">
                  {lang === 'ar' ? 'الشروط والأحكام' : lang === 'fr' ? 'CONDITIONS' : 'TERMS & CONDITIONS'}
                </Link>
                <Link href={`/${lang}/privacy`} className="hover:text-foreground transition-colors uppercase tracking-widest font-semibold">
                  {lang === 'ar' ? 'سياسة الخصوصية' : lang === 'fr' ? 'CONFIDENTIALITÉ' : 'PRIVACY POLICY'}
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Breathing room below card */}
        <div className="h-8" />
      </footer>
    </div>
  );
}
