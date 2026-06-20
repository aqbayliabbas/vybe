/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { Zap, ArrowRight, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { VybeLogo } from '@/components/VybeLogo';

export default function WelcomePage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  const [email, setEmail] = useState(user?.email ?? '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status !== 'idle') return;
    setStatus('loading');
    // TODO: wire up to real waitlist endpoint
    await new Promise(r => setTimeout(r, 1200));
    setStatus('done');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.85_0.1_340_/_0.08)] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg mx-auto px-6 py-16 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <VybeLogo className="scale-110 origin-center" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-success/10 border border-success/20 px-4 py-1.5 text-[12px] font-medium text-success mb-8">
          ✓ You&apos;re all set — you&apos;re on the list
        </div>

        {/* Heading */}
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Welcome,{' '}
          <span className="bg-gradient-to-r from-vybe via-vybe-glow to-vybe-pink bg-clip-text text-transparent capitalize">
            {displayName}!
          </span>
        </h1>

        <p className="mt-4 text-[15px] text-muted-foreground font-light leading-relaxed">
          Vybe for Brands is coming soon. Drop your work email and we&apos;ll reach out the moment your brand account is ready.
        </p>

        {/* Waitlist form */}
        <div className="mt-10">
          {status === 'done' ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl glass border border-success/30 px-8 py-8 shadow-card">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <p className="font-heading text-lg font-semibold text-foreground">You&apos;re on the waitlist!</p>
              <p className="text-[13px] text-muted-foreground font-light">We&apos;ll email <span className="text-foreground font-medium">{email}</span> as soon as brands access opens up.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="your@brand.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-2xl glass border border-border/40 bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-vybe/50 focus:ring-2 focus:ring-vybe/10 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="group flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-vybe to-vybe-glow text-white font-semibold text-[14px] px-6 py-3.5 shadow-card hover:shadow-elevated hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Joining…</>
                ) : (
                  <>Join the Waitlist <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-[12px] text-muted-foreground/60 font-light">
          No spam, ever. We&apos;ll only reach out when your access is ready.
        </p>
      </div>
    </div>
  );
}
