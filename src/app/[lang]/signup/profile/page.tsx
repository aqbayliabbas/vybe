"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, ArrowRight, Upload } from 'lucide-react';
import { VybeLogo } from '@/components/VybeLogo';

const industries = ['Food & Beverage', 'Beauty & Cosmetics', 'Tech & Telecom', 'Fashion', 'Sports', 'Retail', 'Healthcare', 'Education', 'Other'];
const sizes = ['1–10', '11–50', '51–200', '201–500', '500+'];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');

  const canSubmit = company.trim().length > 1 && !!industry && !!size && !!country;

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
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${i <= 2 ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-card' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
              <span className={`text-[11px] font-medium ${i <= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
              {i < 3 && <div className={`h-px w-6 ${i < 2 ? 'bg-vybe/40' : 'bg-border/40'}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8">
          <h1 className="font-heading text-2xl font-bold text-foreground text-center">Set up your brand</h1>
          <p className="mt-2 text-[13px] text-muted-foreground text-center">Tell us about your company so we can personalize your experience</p>

          <div className="mt-8 space-y-4">
            {/* Logo upload */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 cursor-pointer hover:border-vybe/40 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Brand logo <span className="text-muted-foreground/60">(optional)</span></p>
                <p className="text-[11px] text-muted-foreground">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company name</label>
              <Input placeholder="Pepsi Algeria" value={company} onChange={e => setCompany(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Company size</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{sizes.map(s => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {['Algeria', 'Morocco', 'Tunisia', 'UAE', 'Saudi Arabia', 'Egypt', 'Qatar', 'Kuwait', 'Bahrain', 'Other'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Website <span className="text-muted-foreground/60">(optional)</span></label>
              <Input placeholder="https://brand.com" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>

            <Button onClick={() => router.push('/signup/payment')} disabled={!canSubmit} className="w-full h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft mt-2">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
