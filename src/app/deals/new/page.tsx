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
  Handshake, Check, Upload, Loader2, Sparkles, ArrowRight, ArrowLeft,
  Plus, X, Lightbulb, Zap, DollarSign,
} from 'lucide-react';

const STEPS = ['Brief', 'Targeting', 'Terms', 'Review & Publish'];
const niches = ['Beauty', 'Fashion', 'Tech', 'Gaming', 'Food', 'Fitness', 'Travel', 'Finance', 'Parenting', 'Music', 'Comedy', 'Education'];
const TIPS = [
  'A specific deliverable spec gets better submissions',
  'Set follower range to control creator tier',
  'Let creators propose their rate for best-fit applicants',
  'Limit max creators to 5–15 for manageable review',
  'Add revision policy upfront to set expectations',
];

type BudgetType = 'fixed' | 'range' | 'creator';

export default function NewDealPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0 — Brief
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deliverable, setDeliverable] = useState('');
  const [dos, setDos] = useState<string[]>([]);
  const [donts, setDonts] = useState<string[]>([]);
  const [doInput, setDoInput] = useState('');
  const [dontInput, setDontInput] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  // Step 1 — Targeting
  const [platforms, setPlatforms] = useState<string[]>(['TikTok']);
  const [region, setRegion] = useState('MENA');
  const [followerRange, setFollowerRange] = useState('Micro (10k–50k)');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [language, setLanguage] = useState('Any');

  // Step 2 — Terms
  const [deadline, setDeadline] = useState('');
  const [maxCreators, setMaxCreators] = useState(10);
  const [budgetType, setBudgetType] = useState<BudgetType>('range');
  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(50000);
  const [fixedBudget, setFixedBudget] = useState(30000);
  const [revisions, setRevisions] = useState(1);

  const [loading, setLoading] = useState(false);

  const togglePlatform = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleNiche = (n: string) => setSelectedNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  const addDo = () => { if (doInput.trim()) { setDos(p => [...p, doInput.trim()]); setDoInput(''); } };
  const addDont = () => { if (dontInput.trim()) { setDonts(p => [...p, dontInput.trim()]); setDontInput(''); } };

  const canNext = useMemo(() => {
    if (step === 0) return title.trim().length > 2 && description.trim().length > 10;
    if (step === 1) return platforms.length > 0;
    if (step === 2) return !!deadline;
    return true;
  }, [step, title, description, platforms, deadline]);

  const budgetDisplay = budgetType === 'fixed' ? `${fixedBudget.toLocaleString()} DZD` : budgetType === 'range' ? `${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()} DZD` : 'Creator proposes rate';

  const launch = async () => {
    setLoading(true);
    try {
      await db.createCampaign({
        name: title,
        brand: 'Pepsi Algeria',
        type: 'deal',
        status: 'live',
        budget: budgetDisplay,
        budgetMin: budgetType === 'range' ? budgetMin : budgetType === 'fixed' ? fixedBudget : undefined,
        budgetMax: budgetType === 'range' ? budgetMax : budgetType === 'fixed' ? fixedBudget : undefined,
        daysLeft: 14,
        industry: 'Beverages',
        niches: selectedNiches,
        platforms,
        description,
        dos,
        donts
      });
      toast.success('Deal published! Creators can now discover and apply.');
      router.push('/deals');
    } catch (e) {
      console.error(e);
      toast.error('Failed to publish deal. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">New Campaign</p>
          <h1 className="font-heading mt-1 text-[28px] font-bold tracking-tight text-foreground">Post a Deal</h1>
          <p className="text-[13px] text-muted-foreground">Hand-pick creators. Pay only when you approve the content.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
          <Handshake className="h-3.5 w-3.5 text-vybe" />
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-muted/60">
        <div className="h-full rounded-full bg-gradient-to-r from-vybe to-vybe-glow transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="flex gap-8">
        <div className="hidden w-52 shrink-0 lg:block">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)}
              className={`mb-1.5 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-medium transition-all border-0 bg-transparent text-left cursor-pointer ${step === i ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark shadow-card' : step > i ? 'text-vybe-dark/70 hover:bg-muted/60' : 'text-muted-foreground'}`}>
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

        <div className="min-w-0 flex-1 space-y-5">
          {/* Step 0 — Brief */}
          {step === 0 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Deal title</label>
                <Input placeholder="e.g., Ramadan Collection Launch" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Product description</label>
                <Textarea placeholder="Describe your product and what makes it special…" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Deliverable spec</label>
                <Textarea placeholder="Exactly what should the creator produce? Format, length, required elements?" value={deliverable} onChange={e => setDeliverable(e.target.value)} rows={3} />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">Do&apos;s</label>
                    <button onClick={() => setDos(p => Array.from(new Set([...p, 'Show the product clearly', 'Keep it under 60 seconds'])))} className="text-[11px] font-medium text-vybe-dark bg-transparent border-0 cursor-pointer flex items-center gap-1"><Sparkles className="h-3 w-3" /> Suggest</button>
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
                <div onClick={() => setFiles(p => [...p, `asset_${p.length + 1}.jpg`])} className="cursor-pointer rounded-2xl border-2 border-dashed border-border/60 p-8 text-center hover:border-vybe/40 hover:bg-vybe/[0.02] transition-all">
                  <Upload className="mx-auto mb-2 h-5 w-5 text-vybe-dark/50" />
                  <p className="text-sm text-muted-foreground">Click to upload product images or brand guidelines</p>
                </div>
                {files.map((f, i) => <div key={i} className="mt-1 flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-[12px]"><span>{f}</span><button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="bg-transparent border-0 cursor-pointer"><X className="h-3 w-3 text-muted-foreground" /></button></div>)}
              </div>
            </div>
          )}

          {/* Step 1 — Targeting */}
          {step === 1 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Platform</label>
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
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Follower range</label>
                  <select value={followerRange} onChange={e => setFollowerRange(e.target.value)} className="h-10 w-full rounded-xl border border-border/60 bg-white/70 px-3 text-[13px] outline-none focus:border-vybe/40">
                    {['Nano (1k–10k)', 'Micro (10k–50k)', 'Mid (50k–500k)', 'Macro (500k+)', 'Any'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-foreground">Niche tags</label>
                  <span className="text-[11px] text-muted-foreground">{selectedNiches.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {niches.map(n => (
                    <Badge key={n} variant={selectedNiches.includes(n) ? 'default' : 'outline'} className="cursor-pointer transition-all" onClick={() => toggleNiche(n)}>
                      {selectedNiches.includes(n) && <Check className="mr-1 h-3 w-3" />}{n}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Content language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="h-10 w-full rounded-xl border border-border/60 bg-white/70 px-3 text-[13px] outline-none focus:border-vybe/40">
                  {['Any', 'Arabic', 'French', 'English', 'Darija'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 — Terms */}
          {step === 2 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Application deadline</label>
                  <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Max creators to accept</label>
                  <Input type="number" value={maxCreators} min={1} max={100} onChange={e => setMaxCreators(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Budget model</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { key: 'fixed', label: 'Fixed rate', desc: 'Same fee for all' },
                    { key: 'range', label: 'Budget range', desc: 'Min–max per creator' },
                    { key: 'creator', label: 'Creator proposes', desc: 'They name their price' },
                  ] as const).map(m => (
                    <button key={m.key} onClick={() => setBudgetType(m.key)} className={`rounded-2xl border-2 p-3 text-left transition-all cursor-pointer bg-transparent ${budgetType === m.key ? 'border-vybe bg-vybe/5' : 'border-border/60 hover:border-vybe/30'}`}>
                      <p className={`text-[12px] font-semibold ${budgetType === m.key ? 'text-vybe-dark' : 'text-foreground'}`}>{m.label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              {budgetType === 'fixed' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Fee per video (DZD)</label>
                  <Input type="number" value={fixedBudget} onChange={e => setFixedBudget(Number(e.target.value))} />
                </div>
              )}
              {budgetType === 'range' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Budget range per video (DZD)</label>
                  <div className="flex items-center gap-3">
                    <Input type="number" value={budgetMin} onChange={e => setBudgetMin(Number(e.target.value))} className="w-36" />
                    <span className="text-muted-foreground">to</span>
                    <Input type="number" value={budgetMax} onChange={e => setBudgetMax(Number(e.target.value))} className="w-36" />
                  </div>
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Revision policy</label>
                <div className="flex gap-2">
                  {[0, 1, 2].map(n => (
                    <button key={n} onClick={() => setRevisions(n)} className={`rounded-xl border-2 px-5 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent ${revisions === n ? 'border-vybe bg-vybe/5 text-vybe-dark' : 'border-border/60 text-muted-foreground hover:border-vybe/40'}`}>
                      {n === 0 ? 'None' : `${n} revision${n > 1 ? 's' : ''}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Review & Publish */}
          {step === 3 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-5">
              <h2 className="font-heading text-lg font-semibold text-foreground">Review your deal</h2>
              <div className="space-y-3">
                {[
                  { label: 'Title', value: title || '—' },
                  { label: 'Platforms', value: platforms.join(', ') || '—' },
                  { label: 'Region', value: region },
                  { label: 'Follower range', value: followerRange },
                  { label: 'Niches', value: selectedNiches.join(', ') || 'Any' },
                  { label: 'Budget', value: budgetDisplay },
                  { label: 'Max creators', value: maxCreators.toString() },
                  { label: 'Deadline', value: deadline || '—' },
                  { label: 'Revisions allowed', value: revisions === 0 ? 'None' : `${revisions}` },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between text-[13px] py-1.5 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-medium text-foreground">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border/30 bg-muted/30 p-4">
                <p className="text-[12px] text-muted-foreground">
                  <strong className="text-foreground">No payment today.</strong> You&apos;re charged only when you approve a creator&apos;s submission. The payment amount is the creator&apos;s bid plus a 10% platform fee.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext} className="gap-2 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.6)]">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={launch} disabled={loading} className="gap-2 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.6)]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Publish Deal
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
