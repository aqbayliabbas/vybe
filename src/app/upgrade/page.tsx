"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Sparkles,
    monthly: 0,
    yearly: 0,
    desc: 'Test the waters with a single live campaign.',
    features: ['1 active campaign', 'Up to 10 submissions / mo', 'Basic analytics', 'Email support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: Zap,
    monthly: 12000,
    yearly: 120000,
    desc: 'For brands running ongoing creator campaigns.',
    features: ['5 active campaigns', 'Unlimited submissions', 'Advanced analytics', 'Priority support', 'Custom briefs'],
    current: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    icon: Crown,
    monthly: 35000,
    yearly: 350000,
    desc: 'Premium tools for agencies & enterprise teams.',
    features: ['Unlimited campaigns', 'API access', 'Dedicated manager', 'Custom contracts', 'SSO & advanced security', 'White-label option'],
    featured: true,
  },
];

export default function UpgradePage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <DashboardLayout>
      <div className="mb-10 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Pricing</p>
        <h1 className="font-heading mt-2 text-[32px] font-bold tracking-tight text-foreground md:text-[40px]">Choose the plan that fits</h1>
        <p className="mx-auto mt-2 max-w-xl text-[14px] text-muted-foreground">Switch plans anytime. All paid plans include a 14-day money-back guarantee.</p>

        <div className="mt-6 inline-flex rounded-full border border-border/60 bg-white/70 p-1">
          {(['monthly', 'yearly'] as const).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={cn(
                'rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all',
                billing === b ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_4px_12px_-4px_oklch(0.72_0.14_300_/_0.5)]' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {b === 'monthly' ? 'Monthly' : 'Yearly'} {b === 'yearly' && <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold">−16%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {plans.map(p => {
          const price = billing === 'monthly' ? p.monthly : p.yearly;
          return (
            <div
              key={p.id}
              className={cn(
                'relative overflow-hidden rounded-3xl border p-7 shadow-card transition-all hover:-translate-y-0.5',
                p.featured ? 'border-vybe/40 bg-gradient-to-br from-white via-white to-vybe/5' : 'border-border/40 bg-white/90'
              )}
            >
              {p.featured && (
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vybe/20 blur-3xl" />
              )}
              {p.featured && (
                <span className="absolute right-5 top-5 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_-4px_oklch(0.72_0.14_300_/_0.5)]">
                  Best value
                </span>
              )}
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
                  <p.icon className="h-5 w-5 text-vybe-dark/80" />
                </div>
                <h3 className="font-heading mt-4 text-[20px] font-bold text-foreground">{p.name}</h3>
                <p className="mt-1 text-[12px] text-muted-foreground">{p.desc}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-heading text-[34px] font-bold text-foreground">{fmt(price)}</span>
                  <span className="text-[12px] text-muted-foreground">DZD / {billing === 'monthly' ? 'mo' : 'yr'}</span>
                </div>

                <Button
                  className={cn(
                    'mt-5 w-full rounded-full text-[13px] font-semibold',
                    p.current
                      ? 'bg-muted text-muted-foreground hover:bg-muted'
                      : p.featured
                        ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.5)]'
                        : 'bg-foreground text-background hover:bg-foreground/90'
                  )}
                  disabled={p.current}
                >
                  {p.current ? 'Current plan' : `Upgrade to ${p.name}`}
                </Button>

                <ul className="mt-6 space-y-2.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-foreground">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-vybe/15">
                        <Check className="h-2.5 w-2.5 text-vybe-dark" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-3xl border border-border/40 bg-white/70 p-6 text-center shadow-card">
        <p className="text-[13px] text-muted-foreground">Need a custom plan or volume pricing? <a href="mailto:sales@vybe.dz" className="font-semibold text-vybe-dark hover:underline">Talk to sales →</a></p>
      </div>
    </DashboardLayout>
  );
}
