"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowRight, Shield, CreditCard, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VybeLogo } from '@/components/VybeLogo';

type Method = 'chargily' | 'stripe';

export default function PaymentSetupPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('chargily');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const canSubmit = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length >= 3;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg mx-auto px-6">
        <div className="flex items-center justify-center mb-12">
          <VybeLogo className="scale-110 origin-center" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Account', 'Verify', 'Profile', 'Payment'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${i <= 3 ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-card' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
              <span className={`text-[11px] font-medium ${i <= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
              {i < 3 && <div className="h-px w-6 bg-vybe/40" />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8">
          {/* No-charge notice */}
          <div className="flex items-center gap-2 rounded-2xl bg-success/10 border border-success/20 px-4 py-3 mb-6">
            <Shield className="h-4 w-4 text-success shrink-0" />
            <p className="text-[12px] font-medium text-success">No charge today — card is saved for when you launch your first campaign</p>
          </div>

          <h1 className="font-heading text-2xl font-bold text-foreground text-center">Add payment method</h1>
          <p className="mt-1 text-[13px] text-muted-foreground text-center">Required to unlock your free trial</p>

          {/* Method toggle */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {([
              { key: 'chargily', label: 'Chargily (Algeria)', icon: Smartphone, desc: 'CIB · BaridiMob · Dahabia' },
              { key: 'stripe', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa · Mastercard · AMEX' },
            ] as const).map(m => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition-all cursor-pointer bg-transparent',
                  method === m.key ? 'border-vybe/60 bg-vybe/5' : 'border-border/40 hover:border-vybe/30'
                )}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl mb-2 ${method === m.key ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white' : 'bg-muted text-muted-foreground'}`}>
                  <m.icon className="h-4 w-4" />
                </div>
                <p className={`text-[12px] font-semibold ${method === m.key ? 'text-vybe-dark' : 'text-foreground'}`}>{m.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{method === 'chargily' ? 'CIB / RIP number' : 'Card number'}</label>
              <Input placeholder="•••• •••• •••• ••••" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Expiry</label>
                <Input placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">CVV</label>
                <Input placeholder="•••" maxLength={4} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-muted/40 border border-border/30 p-4 space-y-2 text-[12px] text-muted-foreground">
            <p className="font-semibold text-foreground text-[13px]">Your free trial includes:</p>
            {/* <p>✓ 1 Contest campaign</p> */}
            <p>✓ 1 Deal campaign</p>
            <p>✓ Creator database access (limited)</p>
            <p>✓ Full analytics on your campaigns</p>
          </div>

          <Button onClick={() => router.push('/signup/welcome')} disabled={!canSubmit} className="w-full h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft mt-6">
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
