"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Trophy, Handshake, Users } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function WelcomePage() {
  const { user } = useAuth();
  
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  const actions = [
    { icon: Trophy, label: 'Launch a Contest', desc: 'Post a prize pool. Creators compete. You get the content.', href: '/contests/new', gradient: 'from-vybe/20 to-vybe-glow/10' },
    { icon: Handshake, label: 'Post a Deal', desc: 'Hand-pick creators. Pay only for content you approve.', href: '/deals/new', gradient: 'from-vybe-glow/20 to-vybe-pink/10' },
    { icon: Users, label: 'Browse Creators', desc: 'Explore 100,000+ verified MENA creators and save to lists.', href: '/creators', gradient: 'from-vybe-pink/20 to-vybe/10' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.85_0.1_340_/_0.08)] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
            <Zap className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground">Vybe</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-success/10 border border-success/20 px-4 py-1.5 text-[12px] font-medium text-success mb-8">
          ✓ You&apos;re all set — free trial activated
        </div>

        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Welcome to Vybe,{' '}
          <span className="bg-gradient-to-r from-vybe via-vybe-glow to-vybe-pink bg-clip-text text-transparent capitalize">{displayName}!</span>
        </h1>
        <p className="mt-4 text-[15px] text-muted-foreground font-light">What would you like to do first?</p>

        <div className="mt-12 grid gap-5 md:grid-cols-3 text-left">
          {actions.map(a => (
            <Link key={a.label} href={a.href} className="group rounded-3xl glass border border-border/30 p-6 shadow-card hover:shadow-elevated transition-all duration-500 block hover:-translate-y-0.5">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${a.gradient} group-hover:scale-110 transition-transform duration-500`}>
                <a.icon className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">{a.label}</h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground font-light leading-relaxed">{a.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[12px] font-medium text-vybe-dark">
                Get started <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>

        <Link href="/dashboard" className="mt-10 inline-block">
          <Button variant="outline" className="rounded-2xl px-8 h-11 text-[13px] font-medium glass border-border/40 gap-2">
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
