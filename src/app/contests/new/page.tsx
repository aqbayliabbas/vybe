"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { db } from '@/lib/db';
import {
  Trophy, Check, Upload, Loader2, Sparkles, ArrowRight, ArrowLeft,
  Plus, X, Medal, Eye, DollarSign, Lightbulb, Zap,
} from 'lucide-react';

const niches = ['Food', 'Lifestyle', 'Sports', 'Beauty', 'Comedy', 'Fashion', 'Tech', 'Gaming', 'Travel', 'Parenting', 'Education', 'Music'];
const fmt = (n: number) => n.toLocaleString('en-US');
const STEPS = ['Brief', 'Rules & Platform', 'Prize Structure', 'Review & Pay'];

const TIPS = [
  'A clear brief gets 3× more creator entries',
  'Add inspiration links to guide the creative direction',
  'TikTok contests get the highest organic reach in MENA',
  'Top 3 prize split (50/30/20) performs best',
  'Set a 14–21 day duration for maximum participation',
];

export default function NewContestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0 — Brief
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dos, setDos] = useState<string[]>([]);
  const [donts, setDonts] = useState<string[]>([]);
  const [doInput, setDoInput] = useState('');
  const [dontInput, setDontInput] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  // Step 1 — Rules & Platform
  const [platforms, setPlatforms] = useState<string[]>(['TikTok']);
  const [region, setRegion] = useState('MENA');
  const [language, setLanguage] = useState('Any');
  const [minFollowers, setMinFollowers] = useState('');
  const [duration, setDuration] = useState(14);

  // Step 2 — Prize Structure
  const [prizeType, setPrizeType] = useState<'fixed' | 'per_view'>('fixed');
  const [prizePool, setPrizePool] = useState(200000);
  const [winners, setWinners] = useState(3);
  const [perViewRate, setPerViewRate] = useState(0.5);
  const [perViewCap, setPerViewCap] = useState(100000);

  const [loading, setLoading] = useState(false);

  const togglePlatform = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const addDo = () => { if (doInput.trim()) { setDos(p => [...p, doInput.trim()]); setDoInput(''); } };
  const addDont = () => { if (dontInput.trim()) { setDonts(p => [...p, dontInput.trim()]); setDontInput(''); } };

  const canNext = useMemo(() => {
    if (step === 0) return title.trim().length > 2 && description.trim().length > 10;
    if (step === 1) return platforms.length > 0;
    return true;
  }, [step, title, description, platforms]);

  const fee = Math.round(prizePool * 0.1);
  const total = prizePool + fee;

  const launch = async () => {
    setLoading(true);
    try {
      await db.createCampaign({
        name: title,
        brand: 'Pepsi Algeria',
        type: 'contest',
        status: 'live',
        budget: `${prizePool.toLocaleString()} DZD`,
        prizePool,
        daysLeft: duration,
        industry: 'Beverages',
        niches: [],
        platforms,
        description,
        dos,
        donts
      });
      toast.success('Contest launched! Creators can now discover and enter.');
      router.push('/contests');
    } catch (e) {
      console.error(e);
      toast.error('Failed to launch contest. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">New Campaign</p>
          <h1 className="font-heading mt-1 text-[28px] font-bold tracking-tight text-foreground">Launch a Contest</h1>
          <p className="text-[13px] text-muted-foreground">Creators compete for your prize. You own every video.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
          <Trophy className="h-3.5 w-3.5 text-vybe" />
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-muted/60">
        <div className="h-full rounded-full bg-gradient-to-r from-vybe to-vybe-glow transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="flex gap-8">
        {/* Sidebar stepper */}
        <div className="hidden w-52 shrink-0 lg:block">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)}
              className={`mb-1.5 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-medium transition-all border-0 bg-transparent text-left cursor-pointer ${step === i ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark shadow-[0_4px_16px_-6px_oklch(0.72_0.14_300_/_0.4)]' : step > i ? 'text-vybe-dark/70 hover:bg-muted/60' : 'text-muted-foreground'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-[11px] font-bold ${step === i ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-card' : step > i ? 'bg-vybe/10 text-vybe-dark' : 'bg-muted text-muted-foreground'}`}>
                {step > i ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {s}
            </button>
          ))}
          <div className="mt-6 rounded-2xl border border-border/50 bg-white/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-vybe-dark">
              <Lightbulb className="h-3.5 w-3.5" /> Tips
            </div>
            <ul className="space-y-1.5">
              {TIPS.slice(step, step + 2).map(t => (
                <li key={t} className="flex gap-2 text-[12px] leading-snug text-muted-foreground">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-vybe" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-5">

          {/* Step 0 — Brief */}
          {step === 0 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Contest title</label>
                <Input placeholder="e.g., Back to School Challenge" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Product description</label>
                <Textarea placeholder="What is your product and what story should creators tell?" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Creator instructions</label>
                <Textarea placeholder="What should creators make? What makes a winning video?" value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">Do&apos;s</label>
                    <button onClick={() => setDos(p => Array.from(new Set([...p, 'Show the product clearly', 'Use the campaign hashtag'])))} className="text-[11px] font-medium text-vybe-dark bg-transparent border-0 cursor-pointer flex items-center gap-1"><Sparkles className="h-3 w-3" /> Suggest</button>
                  </div>
                  <div className="mb-2 flex gap-2">
                    <Input placeholder="Add a guideline…" value={doInput} onChange={e => setDoInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDo()} />
                    <Button variant="outline" size="icon" onClick={addDo}><Plus className="h-4 w-4" /></Button>
                  </div>
                  {dos.map((d, i) => <div key={i} className="mb-1 flex items-center gap-2 text-sm text-foreground"><Check className="h-3.5 w-3.5 text-success shrink-0" />{d}<button onClick={() => setDos(p => p.filter((_, j) => j !== i))} className="ml-auto bg-transparent border-0 cursor-pointer"><X className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button></div>)}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Don&apos;ts</label>
                  <div className="mb-2 flex gap-2">
                    <Input placeholder="Add a restriction…" value={dontInput} onChange={e => setDontInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDont()} />
                    <Button variant="outline" size="icon" onClick={addDont}><Plus className="h-4 w-4" /></Button>
                  </div>
                  {donts.map((d, i) => <div key={i} className="mb-1 flex items-center gap-2 text-sm text-foreground"><X className="h-3.5 w-3.5 text-destructive shrink-0" />{d}<button onClick={() => setDonts(p => p.filter((_, j) => j !== i))} className="ml-auto bg-transparent border-0 cursor-pointer"><X className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button></div>)}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Assets <span className="text-muted-foreground/60">(optional)</span></label>
                <div onClick={() => setFiles(p => [...p, `asset_${p.length + 1}.jpg`])} className="cursor-pointer rounded-2xl border-2 border-dashed border-border/60 p-8 text-center transition-all hover:border-vybe/40 hover:bg-vybe/[0.02]">
                  <Upload className="mx-auto mb-2 h-5 w-5 text-vybe-dark/50" />
                  <p className="text-sm text-muted-foreground">Click to upload product images, videos, or brief PDF</p>
                </div>
                {files.map((f, i) => <div key={i} className="mt-1 flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-[12px]"><span>{f}</span><button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="bg-transparent border-0 cursor-pointer"><X className="h-3 w-3 text-muted-foreground" /></button></div>)}
              </div>
            </div>
          )}

          {/* Step 1 — Rules & Platform */}
          {step === 1 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Platform <span className="text-[11px] text-muted-foreground">(multi-select)</span></label>
                <div className="flex flex-wrap gap-2">
                  {['TikTok', 'Instagram Reels', 'YouTube Shorts'].map(p => (
                    <button key={p} onClick={() => togglePlatform(p)} className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent ${platforms.includes(p) ? 'border-vybe bg-vybe/5 text-vybe-dark' : 'border-border/60 text-muted-foreground hover:border-vybe/40'}`}>
                      {platforms.includes(p) && <Check className="mr-1.5 inline h-3.5 w-3.5" />}{p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Region</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} className="h-10 w-full rounded-xl border border-border/60 bg-white/70 px-3 text-[13px] outline-none focus:border-vybe/40">
                    {['MENA', 'Algeria', 'Gulf (UAE, KSA, Kuwait)', 'North Africa', 'Worldwide'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Content language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="h-10 w-full rounded-xl border border-border/60 bg-white/70 px-3 text-[13px] outline-none focus:border-vybe/40">
                    {['Any', 'Arabic', 'French', 'English', 'Darija'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Min. followers <span className="text-muted-foreground/60">(optional)</span></label>
                  <Input placeholder="e.g. 10000" value={minFollowers} onChange={e => setMinFollowers(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Duration</label>
                  <div className="flex gap-2">
                    {[7, 14, 21, 30].map(d => (
                      <button key={d} onClick={() => setDuration(d)} className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent ${duration === d ? 'border-vybe bg-vybe/5 text-vybe-dark' : 'border-border/60 text-muted-foreground hover:border-vybe/40'}`}>{d}d</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Prize Structure */}
          {step === 2 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Prize model</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: 'fixed', label: 'Fixed Prize Pool', desc: 'Top creators win a set prize. Most popular.' },
                    { key: 'per_view', label: 'Pay Per View', desc: 'Each creator earns based on their view count.' },
                  ] as const).map(m => (
                    <button key={m.key} onClick={() => setPrizeType(m.key)} className={`rounded-2xl border-2 p-4 text-left transition-all cursor-pointer bg-transparent ${prizeType === m.key ? 'border-vybe bg-vybe/5' : 'border-border/60 hover:border-vybe/30'}`}>
                      <p className={`text-[13px] font-semibold ${prizeType === m.key ? 'text-vybe-dark' : 'text-foreground'}`}>{m.label}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {prizeType === 'fixed' && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Total prize pool (DZD)</label>
                    <Input type="number" value={prizePool} onChange={e => setPrizePool(Number(e.target.value))} />
                    <p className="mt-1.5 text-[11px] text-muted-foreground">Estimated entries: ~{Math.round(prizePool / 8000)}</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Number of winners</label>
                    <div className="flex gap-2">{[1, 3, 5, 10].map(n => (<button key={n} onClick={() => setWinners(n)} className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent ${winners === n ? 'border-vybe bg-vybe/5 text-vybe-dark' : 'border-border/60 text-muted-foreground hover:border-vybe/40'}`}>{n}</button>))}</div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-2">
                    <p className="text-[12px] font-semibold text-foreground">Prize distribution</p>
                    {winners === 1 && <PrizeRow label="1st place (100%)" value={`${fmt(prizePool)} DZD`} gold />}
                    {winners === 3 && <><PrizeRow label="1st place (50%)" value={`${fmt(prizePool * 0.5)} DZD`} gold /><PrizeRow label="2nd place (30%)" value={`${fmt(prizePool * 0.3)} DZD`} /><PrizeRow label="3rd place (20%)" value={`${fmt(prizePool * 0.2)} DZD`} /></>}
                    {winners === 5 && [40,25,15,12,8].map((p, i) => <PrizeRow key={i} label={`Rank ${i+1} (${p}%)`} value={`${fmt(prizePool * p / 100)} DZD`} gold={i===0} />)}
                    {winners === 10 && <p className="text-[12px] text-muted-foreground">Even split: {fmt(prizePool / 10)} DZD each</p>}
                  </div>
                </>
              )}

              {prizeType === 'per_view' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Rate per 1,000 views (DZD)</label>
                    <Input type="number" value={perViewRate} onChange={e => setPerViewRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Maximum payout cap (DZD)</label>
                    <Input type="number" value={perViewCap} onChange={e => setPerViewCap(Number(e.target.value))} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Review & Pay */}
          {step === 3 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-5">
              <h2 className="font-heading text-lg font-semibold text-foreground">Review your contest</h2>
              <div className="space-y-3">
                <ReviewRow label="Title" value={title || '—'} />
                <ReviewRow label="Platforms" value={platforms.join(', ') || '—'} />
                <ReviewRow label="Region" value={region} />
                <ReviewRow label="Duration" value={`${duration} days`} />
                <ReviewRow label="Prize model" value={prizeType === 'fixed' ? 'Fixed Prize Pool' : 'Pay Per View'} />
                {prizeType === 'fixed' && <ReviewRow label="Prize pool" value={`${fmt(prizePool)} DZD`} highlight />}
              </div>
              <div className="rounded-2xl border border-vybe/20 bg-gradient-to-br from-vybe/5 to-vybe-glow/5 p-5 space-y-2">
                <p className="text-[12px] font-semibold text-foreground">Payment breakdown</p>
                <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Prize pool</span><span className="font-medium">{fmt(prizePool)} DZD</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Platform fee (10%)</span><span className="font-medium">{fmt(fee)} DZD</span></div>
                <div className="border-t border-border/40 pt-2 flex justify-between text-[14px] font-bold"><span>Total charged today</span><span className="text-vybe-dark">{fmt(total)} DZD</span></div>
              </div>
              <p className="text-[12px] text-muted-foreground">Funds go into escrow. Contest goes live immediately after payment. You have 48h to dispute results before payouts are released.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext} className="gap-2 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.6)]">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={launch} disabled={loading} className="gap-2 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.6)]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Pay & Launch Contest
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PrizeRow({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="flex items-center gap-1.5 text-muted-foreground"><Medal className={`h-3.5 w-3.5 ${gold ? 'text-warning' : 'text-muted-foreground/40'}`} />{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px] py-1.5 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${highlight ? 'text-vybe-dark' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
