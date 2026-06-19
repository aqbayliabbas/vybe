/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Locale } from '@/app/[lang]/dictionaries';

type PricingDict = any;

export default function PricingSection({ dict, lang }: { dict: PricingDict, lang: Locale }) {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (basePrice: string) => {
    if (!isAnnual) return basePrice;
    if (basePrice === '0€') return '0€';
    const numericPrice = parseInt(basePrice.replace('€', ''), 10);
    const discounted = Math.round(numericPrice * 0.8);
    return `${discounted}€`;
  };

  const plans = [
    { name: dict.plan1.name, price: getPrice('0€'), tag: dict.plan1.tag, features: dict.plan1.features, highlight: false },
    { name: dict.plan2.name, price: getPrice('79€'), tag: dict.plan2.tag, features: dict.plan2.features, highlight: true },
    { name: dict.plan3.name, price: getPrice('99€'), tag: dict.plan3.tag, features: dict.plan3.features, highlight: false },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-8">
        <h2 className="font-heading mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-[40px]">{dict.title}</h2>
        <p className="mb-10 text-center text-[14px] text-muted-foreground font-light">{dict.subtitle}</p>
        
        <div className="flex justify-center mb-12">
          <div className="relative flex items-center p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`relative w-32 rounded-full py-2 text-sm font-semibold transition-all duration-300 z-10 ${!isAnnual ? 'text-white' : 'text-foreground/70 hover:text-foreground'}`}
            >
              {dict.monthly}
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`relative w-32 rounded-full py-2 text-sm font-semibold transition-all duration-300 z-10 ${isAnnual ? 'text-white' : 'text-foreground/70 hover:text-foreground'}`}
            >
              {dict.annual}
            </button>
            <div className={`absolute top-1 bottom-1 w-32 bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] rounded-full transition-transform duration-300 ease-out shadow-sm ${isAnnual ? 'ltr:translate-x-full rtl:-translate-x-full' : 'translate-x-0'}`} />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-3xl p-7 border shadow-card transition-all duration-500 hover:shadow-elevated relative ${p.highlight ? 'bg-gradient-to-br from-[#f7931e] via-[#e85820] to-[#ea2d3e] text-white border-transparent scale-[1.02]' : 'glass border-vybe/10'}`}>
              {p.tag && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-max rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shadow-sm ${p.highlight ? 'bg-white text-[#ea2d3e] shadow-md' : 'bg-background border border-border text-foreground'}`}>{p.tag}</div>
              )}
              <p className={`text-[13px] font-medium ${p.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>{p.name}</p>
              <p className={`font-heading mt-3 text-4xl font-bold ${p.highlight ? 'text-white' : 'text-foreground'}`}>{p.price}<span className={`text-sm font-normal ${p.highlight ? 'text-white/60' : 'text-muted-foreground'}`}>{dict.per_month}</span></p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f: string) => (
                  <li key={f} className={`flex items-start gap-2 text-[13px] ${p.highlight ? 'text-white/90' : 'text-foreground/80'}`}>
                    <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${p.highlight ? 'text-white' : 'text-vybe'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${lang}/signup`} className="block mt-7">
                <Button className={`w-full rounded-xl h-10 text-[13px] font-semibold ${p.highlight ? 'bg-white text-[#ea2d3e] hover:bg-white/90 border-0' : 'bg-transparent border-black/10 dark:border-white/10 text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`} variant={p.highlight ? 'default' : 'outline'}>{dict.button}</Button>
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-[12px] text-muted-foreground/70">
          {dict.footer}
        </p>
      </div>
    </section>
  );
}
