import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck, Wallet, Handshake, Star, Link as LinkIcon, MessageSquare, Briefcase, Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LangSwitcher from '@/components/LangSwitcher';
import { getDictionary, Locale } from '../dictionaries';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';
import { VybeLogo } from '@/components/VybeLogo';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: "Vybe for Creators — Monetize your audience",
  description: "Get paid to create. Join Vybe to receive direct offers from top brands. Secure payments, local withdrawal methods.",
};

export default async function CreatorLanding({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const cl = dict.creator_landing;

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
          <Link href={`/${lang}`} className="flex items-center px-2">
            <VybeLogo className="scale-90 sm:scale-100 origin-left" />
          </Link>

          {/* Mobile hamburger */}
          <MobileNav lang={lang} dict={dict.nav} page="creators" />

          {/* Right Section - Double Pill Container (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Nav Links Pill */}
            <div className="flex items-center p-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl shadow-inner">
              <div className="flex items-center gap-6 px-6 h-[42px] rounded-full bg-white dark:bg-zinc-900 shadow-md border border-black/5 dark:border-white/5">
                <Link href={`/${lang}`} className="hover:text-foreground text-[13px] font-semibold text-foreground/80 transition-colors duration-300">{dict.nav.brands}</Link>
                <span className="hover:text-foreground text-[13px] font-semibold text-foreground/80 transition-colors duration-300 cursor-pointer">{dict.nav.creators}</span>
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
          <div className="relative mx-auto max-w-[1240px] px-4 sm:px-8 pt-28 pb-16 text-center md:pt-40 md:pb-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full glass border border-vybe/20 px-4 py-1.5 text-[12px] font-medium text-muted-foreground mb-8 shadow-card">
              <Star className="h-3.5 w-3.5 text-vybe fill-vybe/20" />
              {cl.hero_badge}
            </div>
            <h1 className="font-heading mx-auto max-w-4xl text-[36px] sm:text-[44px] font-extrabold tracking-tight text-foreground md:text-[64px] md:leading-[1.08] leading-[1.1]">
              {cl.hero_title_main}{' '}
              <span className="bg-gradient-to-r from-vybe via-vybe-glow to-vybe-pink bg-clip-text text-transparent">{cl.hero_title_highlight}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] text-muted-foreground leading-relaxed font-light">
              {cl.hero_desc}
            </p>
            <div className="mt-10 w-full flex justify-center">
              <Link href={`/${lang}/signup`}>
                <Button size="lg" className="rounded-2xl px-10 h-14 text-base font-semibold shadow-soft gap-2 bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] text-white border-0 hover:opacity-90 transition-all duration-300 hover:shadow-elevated hover:scale-105">
                  {cl.cta_button} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Features */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <FadeIn>
            <h2 className="font-heading mb-16 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{cl.features_title}</h2>
          </FadeIn>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: cl.f1_title, desc: cl.f1_desc },
              { icon: Wallet, title: cl.f2_title, desc: cl.f2_desc },
              { icon: Handshake, title: cl.f3_title, desc: cl.f3_desc },
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

      {/* How it works */}
      <section className="py-16 md:py-32 bg-vybe/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.82_0.17_55_/_0.08)] blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8 relative">
          <FadeIn>
            <h2 className="font-heading mb-16 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{cl.workflow_title}</h2>
          </FadeIn>
          <StaggerContainer className="grid gap-12 md:grid-cols-3 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
            {[
              { num: '01', title: cl.w1_title, desc: cl.w1_desc, icon: LinkIcon },
              { num: '02', title: cl.w2_title, desc: cl.w2_desc, icon: MessageSquare },
              { num: '03', title: cl.w3_title, desc: cl.w3_desc, icon: Briefcase },
            ].map((step, i) => (
              <StaggerItem key={i} className="relative z-10 text-center flex flex-col items-center">
                <div className="h-24 w-24 rounded-full glass border border-vybe/20 flex items-center justify-center mb-6 shadow-card bg-background relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-vybe to-vybe-pink opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <step.icon className="h-8 w-8 text-vybe" />
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm shadow-md">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[280px]">{step.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 md:py-32">
        <FadeIn>
          <div className="mx-auto max-w-[1240px] px-4 sm:px-8 text-center">
            <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{cl.integrations_title}</h2>
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto mb-16 leading-relaxed">
              {cl.integrations_desc}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl glass border border-border/40 shadow-card flex items-center justify-center hover:scale-105 transition-transform">
                <svg className="h-10 w-10 text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
              </div>
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl glass border border-border/40 shadow-card flex items-center justify-center hover:scale-105 transition-transform bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-500/10">
                <svg className="h-10 w-10 text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl glass border border-border/40 shadow-card flex items-center justify-center hover:scale-105 transition-transform">
                <Play className="h-10 w-10 text-red-500 fill-red-500" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-32 bg-vybe-dark text-white rounded-[2rem] md:rounded-[3rem] mx-4 md:mx-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-vybe/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-vybe-pink/20 rounded-full blur-[100px]" />
        </div>
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8 relative z-10">
          <FadeIn>
            <h2 className="font-heading mb-16 text-center text-3xl font-bold tracking-tight md:text-[40px]">{cl.testimonials_title}</h2>
          </FadeIn>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              { q: "Finally, a platform that understands our region. Getting paid directly to my local bank without begging brands is a game changer.", name: "Amine T.", role: "Tech Reviewer" },
              { q: "I used to spend hours sending media kits. With Vybe, my stats update automatically and brands come to me.", name: "Lydia B.", role: "Lifestyle Creator" },
              { q: "The transparency is unmatched. I know exactly what I'm getting paid and the funds are guaranteed before I shoot a single video.", name: "Omar D.", role: "Comedy Creator" }
            ].map((t, i) => (
              <StaggerItem key={i} className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 text-vybe fill-vybe" />)}
                </div>
                <blockquote className="text-[14px] leading-relaxed mb-6">&ldquo;{t.q}&rdquo;</blockquote>
                <div>
                  <p className="font-bold text-[13px]">{t.name}</p>
                  <p className="text-[11px] text-white/60 mt-0.5">{t.role}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-32">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 sm:px-8">
            <h2 className="font-heading mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{cl.faq_title}</h2>
            <div className="space-y-4">
              {[
                { q: cl.faq1_q, a: cl.faq1_a },
                { q: cl.faq2_q, a: cl.faq2_a },
                { q: cl.faq3_q, a: cl.faq3_a }
              ].map((faq, i) => (
                <details key={i} className="group rounded-2xl glass border border-border/40 [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm">
                  <summary className="flex items-center justify-between p-6 font-semibold text-[15px] text-foreground">
                    {faq.q}
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="px-6 pb-6 text-[14px] text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden mt-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[oklch(0.82_0.17_55_/_0.12)] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.62_0.20_28_/_0.07)] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <div className="glass-strong rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden">
            <div className="px-6 sm:px-10 pt-10 pb-8 sm:pt-12 sm:pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-10">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center">
          <VybeLogo className="scale-100 origin-left" />
        </div>

                  <div className="flex items-center gap-2.5">
                    <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-vybe hover:border-vybe/40 hover:bg-vybe/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="#" aria-label="X" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="#" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                    </a>
                    <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-vybe hover:border-vybe/40 hover:bg-vybe/5 transition-all duration-300">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>

                  <div className="space-y-2 text-[14px] text-muted-foreground">
                    <p className="leading-relaxed">
                      {lang === 'ar' ? 'الجزائر العاصمة، الجزائر' : lang === 'fr' ? 'Alger, Algérie' : 'Algiers, Algeria'}
                    </p>
                    <a href="mailto:hello@vybe.app" className="block hover:text-vybe transition-colors font-medium">hello@vybe.app</a>
                  </div>

                  <div className="flex items-center gap-4 text-[12px] text-muted-foreground/60 font-semibold uppercase tracking-widest">
                    <Link href="/en/for-creators" className={`hover:text-foreground transition-colors ${lang === 'en' ? 'text-foreground' : ''}`}>EN</Link>
                    <span className="text-border">·</span>
                    <Link href="/fr/for-creators" className={`hover:text-foreground transition-colors ${lang === 'fr' ? 'text-foreground' : ''}`}>FR</Link>
                    <span className="text-border">·</span>
                    <Link href="/ar/for-creators" className={`hover:text-foreground transition-colors ${lang === 'ar' ? 'text-foreground' : ''}`}>عربي</Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-5">
                      {lang === 'ar' ? 'المنصة' : lang === 'fr' ? 'Plateforme' : 'Platform'}
                    </p>
                    <ul className="space-y-3 text-[14px] text-muted-foreground">
                      <li><Link href={`/${lang}`} className="hover:text-foreground transition-colors">{dict.footer.brands}</Link></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.creators}</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.about}</span></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-5">
                      {lang === 'ar' ? 'الموارد' : lang === 'fr' ? 'Ressources' : 'Resources'}
                    </p>
                    <ul className="space-y-3 text-[14px] text-muted-foreground">
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{lang === 'ar' ? 'المدونة' : lang === 'fr' ? 'Blog' : 'Blog'}</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{lang === 'ar' ? 'التوثيق' : lang === 'fr' ? 'Docs' : 'Docs'}</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.contact}</span></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-5">
                      {lang === 'ar' ? 'قانوني' : lang === 'fr' ? 'Légal' : 'Legal'}
                    </p>
                    <ul className="space-y-3 text-[14px] text-muted-foreground">
                      <li><Link href={`/${lang}/terms`} className="hover:text-foreground transition-colors">{dict.footer.terms}</Link></li>
                      <li><Link href={`/${lang}/privacy`} className="hover:text-foreground transition-colors">{dict.footer.privacy}</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden select-none pointer-events-none border-t border-border/30" aria-hidden="true">
              <p
                className="font-heading font-black brand-gradient-text opacity-[0.08] whitespace-nowrap leading-none"
                style={{ fontSize: 'clamp(80px, 16vw, 220px)', letterSpacing: '-0.04em', lineHeight: 0.85, paddingBottom: '0.05em', paddingLeft: '0.12em' }}
              >
                Vybe.—
              </p>
            </div>

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

        <div className="h-8" />
      </footer>
    </div>
  );
}
