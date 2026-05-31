import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, Users, Eye, Trophy, BarChart3, Check, Star, MapPin, Sparkles, Target, Globe, BadgeCheck, Languages, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "Vybe — The Creator Marketing Platform Built for MENA",
  description: "Launch a contest. Let 10,000+ creators compete for your brand. Pay only for the content that wins. Arabic, French, English — Algeria to the Gulf.",
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
        <div className="absolute top-[600px] right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.85_0.1_340_/_0.08)] blur-[100px]" />
        <div className="absolute top-[1200px] left-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.82_0.1_300_/_0.06)] blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">Vybe</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-muted-foreground">
            <span className="hover:text-foreground transition-colors duration-300 cursor-pointer">For Brands</span>
            <Link href="/creators" className="hover:text-foreground transition-colors duration-300">For Creators</Link>
            <a href="#pricing" className="hover:text-foreground transition-colors duration-300">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup">
              <Button variant="ghost" size="sm" className="text-muted-foreground font-medium text-[13px] rounded-xl">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-xl px-5 text-[13px] h-9 shadow-soft transition-all duration-300 gap-1.5">Get Started Free <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20">
        <div className="relative mx-auto max-w-[1240px] px-8 pt-24 pb-16 text-center md:pt-32 md:pb-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[12px] font-medium text-muted-foreground mb-8 shadow-card">
            <Sparkles className="h-3.5 w-3.5 text-vybe" />
            Trusted by brands across MENA
          </div>
          <h1 className="font-heading mx-auto max-w-4xl text-[44px] font-extrabold tracking-tight text-foreground md:text-[64px] md:leading-[1.08] leading-[1.1]">
            The Creator Marketing Platform{' '}
            <span className="bg-gradient-to-r from-vybe via-vybe-glow to-vybe-pink bg-clip-text text-transparent">Built for MENA</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] text-muted-foreground leading-relaxed font-light">
            Launch a contest. Let 10,000+ creators compete for your brand. Pay only for the content that wins.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[14px] text-muted-foreground/70 font-light">
            Arabic. French. English. Algeria to the Gulf — all in one platform.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-sm font-semibold rounded-2xl px-8 h-12 shadow-soft transition-all duration-300 hover:shadow-elevated">
                Launch Your First Campaign Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-sm font-medium rounded-2xl px-8 h-12 glass border-border/40 hover:bg-accent/50 transition-all duration-300">
              Book a Demo
            </Button>
          </div>
          <p className="mt-5 text-[12px] text-muted-foreground/70">
            Trusted by brands in Algeria · UAE · Morocco · Saudi Arabia · Egypt
          </p>
        </div>

        {/* Floating Stats */}
        <div className="relative mx-auto max-w-[1000px] px-8">
          <div className="rounded-3xl glass shadow-soft p-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: Users, value: '100,000+', label: 'Verified Creators', color: 'text-vybe' },
              { icon: Trophy, value: '1,000+', label: 'Campaigns Launched', color: 'text-vybe-glow' },
              { icon: Eye, value: '1B+', label: 'Views Generated', color: 'text-vybe-pink' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className={`h-5 w-5 mx-auto mb-2 ${s.color}`} />
                <p className="text-3xl font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-[12px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Contests */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-8">
          <h2 className="font-heading mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">Pay for performance. Own the content.</h2>
          <p className="mb-16 text-center text-[15px] text-muted-foreground max-w-md mx-auto font-light">A live competition where creators do the work and you keep every video.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Post your brief.', desc: 'Tell creators what you need, what your brand is about, and what they should make. Set your prize pool.', gradient: 'from-vybe/20 to-vybe-glow/10' },
              { step: '02', title: 'Creators compete.', desc: 'Creators in your region post organically. Views are tracked live. Your leaderboard updates in real time.', gradient: 'from-vybe-glow/20 to-vybe-pink/10' },
              { step: '03', title: 'Winners get paid. You get the content.', desc: 'The top creators earn their prize. You keep every video — forever. Perfect for paid ads.', gradient: 'from-vybe-pink/20 to-vybe/10' },
            ].map((f) => (
              <div key={f.step} className="glass rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all duration-500 group border border-border/30 relative">
                <div className="absolute top-5 right-6 font-heading text-[11px] font-bold text-vybe-dark/30 tracking-wider">{f.step}</div>
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} group-hover:scale-110 transition-transform duration-500`}>
                  <Trophy className="h-5 w-5 text-foreground/70" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground font-light">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/contests/new">
              <Button size="lg" className="rounded-2xl px-8 h-12 text-sm font-semibold shadow-soft gap-2">Launch a Contest <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works — Deals */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-8">
          <h2 className="font-heading mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">Curated collabs. No agency needed.</h2>
          <p className="mb-16 text-center text-[15px] text-muted-foreground max-w-md mx-auto font-light">Direct partnerships with verified creators. You're in control of every step.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Post your deal brief.', desc: 'Describe the deliverable, set creator criteria, define your budget or let creators propose their rate.' },
              { step: '02', title: 'Review verified applicants.', desc: 'See follower counts, average views, engagement rates — all verified. No fake stats.' },
              { step: '03', title: 'Approve, review, pay.', desc: "Accept what you love. Request edits if needed. Pay only when you're satisfied." },
            ].map((s) => (
              <div key={s.step} className="rounded-3xl glass p-8 shadow-card hover:shadow-soft transition-all duration-500 border border-border/30 relative">
                <div className="absolute top-5 right-6 font-heading text-[11px] font-bold text-vybe-dark/30 tracking-wider">{s.step}</div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe-glow/15 to-vybe-pink/10">
                  <BadgeCheck className="h-5 w-5 text-foreground/70" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground font-light">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/deals/new">
              <Button size="lg" variant="outline" className="rounded-2xl px-8 h-12 text-sm font-semibold glass border-border/40 gap-2">Launch a Deal <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Creator Database Teaser */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium text-muted-foreground mb-4 shadow-card">
              <Search className="h-3 w-3 text-vybe" />
              Creator Database
            </div>
            <h2 className="font-heading text-3xl md:text-[40px] font-bold tracking-tight text-foreground leading-tight">100,000+ MENA Creators. <span className="bg-gradient-to-r from-vybe to-vybe-pink bg-clip-text text-transparent">One Search.</span></h2>
            <p className="mt-5 text-[15px] text-muted-foreground font-light leading-relaxed max-w-lg">
              Filter by region, niche, platform, follower count, average views, and engagement rate. Every creator stat is verified by Phyllo — not self-reported.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['📍 Algeria 🇩🇿', '📱 TikTok', '👥 Micro (10k–50k)', '🎯 Beauty', '💬 Arabic + French'].map((f) => (
                <span key={f} className="rounded-full glass border border-border/30 px-3 py-1.5 text-[12px] font-medium text-foreground/80 shadow-card">{f}</span>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/creators">
                <Button size="lg" className="rounded-2xl px-8 h-12 text-sm font-semibold shadow-soft gap-2">Browse Creators <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 relative">
              {[
                { name: 'Lina M.', niche: 'Beauty · DZ' },
                { name: 'Yacine B.', niche: 'Tech · DZ' },
                { name: 'Sara K.', niche: 'Fashion · UAE' },
                { name: 'Karim H.', niche: 'Food · MA' },
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
                <span className="rounded-full glass-strong px-4 py-2 text-[12px] font-semibold text-foreground shadow-soft border border-border/30">Sign up to unlock full access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Vybe */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium text-muted-foreground mb-4 shadow-card mx-auto block w-fit">
            <Sparkles className="h-3 w-3 text-vybe" />
            Why Vybe
          </div>
          <h2 className="font-heading mb-16 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">Built for this market. Not adapted for it.</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Globe, title: 'MENA-First', desc: 'Algerian brands pay with Chargily — CIB, BaridiMob, Dahabia. Gulf brands pay with Stripe. No workarounds, no wire transfers.' },
              { icon: BadgeCheck, title: 'Verified Creators Only', desc: 'Every creator stat on Vybe is pulled directly from TikTok, Instagram, and YouTube via Phyllo. What you see is what you get.' },
              { icon: Languages, title: 'Arabic. French. English.', desc: 'The platform runs in all three languages with full RTL support for Arabic. Your brief reaches the right creator in the right language.' },
            ].map((f) => (
              <div key={f.title} className="rounded-3xl glass p-8 shadow-card hover:shadow-soft transition-all duration-500 group border border-border/30">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 group-hover:scale-110 transition-transform duration-500">
                  <f.icon className="h-5 w-5 text-foreground/70" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium text-muted-foreground mb-4 shadow-card mx-auto block w-fit">
            <BarChart3 className="h-3 w-3 text-vybe" />
            Pricing
          </div>
          <h2 className="font-heading mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">Start free. Scale when you&apos;re ready.</h2>
          <p className="mb-12 text-center text-[14px] text-muted-foreground font-light">Monthly billing · Save 20% yearly</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Free Trial', price: '$0', tag: 'Card required', features: ['1 Contest', '1 Deal', 'Creator database (limited)', 'Basic analytics'], highlight: false },
              { name: 'Starter', price: '$49', tag: '', features: ['3 Contests/mo', '3 Deals/mo', 'Full creator database', 'Basic analytics'], highlight: false },
              { name: 'Growth', price: '$149', tag: 'Most popular', features: ['Unlimited contests', 'Unlimited deals', 'Full creator database', 'Full analytics', '10 creator lists'], highlight: true },
              { name: 'Scale', price: '$399', tag: '', features: ['Unlimited everything', 'Full analytics', 'Unlimited lists', 'Account manager', 'CSV export'], highlight: false },
            ].map((p) => (
              <div key={p.name} className={`rounded-3xl p-7 border shadow-card transition-all duration-500 hover:shadow-elevated relative ${p.highlight ? 'bg-gradient-to-br from-primary via-[oklch(0.32_0.05_300)] to-primary text-white border-transparent scale-[1.02]' : 'glass border-border/30'}`}>
                {p.tag && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${p.highlight ? 'bg-vybe-glow text-primary' : 'bg-muted text-muted-foreground'}`}>{p.tag}</div>
                )}
                <p className={`text-[13px] font-medium ${p.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>{p.name}</p>
                <p className={`font-heading mt-3 text-4xl font-bold ${p.highlight ? 'text-white' : 'text-foreground'}`}>{p.price}<span className={`text-sm font-normal ${p.highlight ? 'text-white/60' : 'text-muted-foreground'}`}>/mo</span></p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-[13px] ${p.highlight ? 'text-white/90' : 'text-foreground/80'}`}>
                      <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${p.highlight ? 'text-vybe-glow' : 'text-vybe'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-7">
                  <Button className={`w-full rounded-xl h-10 text-[13px] font-semibold ${p.highlight ? 'bg-white text-primary hover:bg-white/90' : ''}`} variant={p.highlight ? 'default' : 'outline'}>Start Free</Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[12px] text-muted-foreground/70">
            No hidden fees. No long-term contracts. Algerian brands see DZD equivalent at checkout.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-8">
          <h2 className="font-heading mb-16 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">What brands are saying</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { quote: 'We ran a 14-day contest and got 47 creator videos without reaching out to a single person. The leaderboard made it addictive.', name: 'Anis B.', role: 'Marketing Manager · Fashion Brand · Algeria' },
              { quote: 'We finally have a platform that speaks our market. The creator database alone is worth it — we found 12 verified Algerian micro-influencers in 10 minutes.', name: 'Sara M.', role: 'Brand Director · Beauty Brand · UAE' },
              { quote: 'I was spending hours on WhatsApp chasing creators. Now I post a deal brief and they apply to me. It changed how we work.', name: 'Youssef K.', role: 'Founder · E-commerce · Morocco' },
            ].map((t) => (
              <div key={t.name} className="rounded-3xl glass p-8 shadow-card border border-border/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[oklch(0.85_0.1_340_/_0.06)] blur-[60px] pointer-events-none" />
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-8 text-center">
          <div className="rounded-[28px] bg-gradient-to-br from-primary via-[oklch(0.35_0.06_300)] to-primary p-14 md:p-20 shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.72_0.14_300_/_0.15)] blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[oklch(0.85_0.1_340_/_0.1)] blur-[80px] pointer-events-none" />
            <div className="relative">
              <h2 className="font-heading text-3xl font-bold text-white md:text-[44px] mb-4 leading-tight">Your next 50 creator videos are 14 days away.</h2>
              <p className="text-[15px] text-white/60 max-w-md mx-auto mb-10 font-light">Launch your first contest free. No charge until you&apos;re ready.</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold rounded-2xl px-8 h-12 text-sm shadow-soft transition-all duration-300 hover:shadow-elevated gap-2">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 h-12 text-sm transition-all duration-300">
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14">
        <div className="mx-auto max-w-[1240px] px-8">
          <div className="rounded-3xl glass p-10 shadow-card border border-border/30">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
                  <Zap className="h-3.5 w-3.5 text-white fill-white" />
                </div>
                <span className="font-heading text-sm font-bold text-foreground">Vybe</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-muted-foreground/70">
                <span className="hover:text-foreground cursor-pointer transition-colors">For Brands</span>
                <Link href="/creators" className="hover:text-foreground transition-colors">For Creators</Link>
                <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
                <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-muted-foreground/60">
                <Globe className="h-3.5 w-3.5" />
                <span className="hover:text-foreground cursor-pointer">EN</span>
                <span className="hover:text-foreground cursor-pointer">FR</span>
                <span className="hover:text-foreground cursor-pointer">العربية</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground/60">
              <p className="flex items-center gap-1">© 2025 Vybe. Made for MENA <MapPin className="inline h-3 w-3" /></p>
              <div className="flex gap-5">
                <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Use</span>
                <span className="hover:text-foreground cursor-pointer transition-colors">Affiliates</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
