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
const STEPS = ['Brief', 'Règles et Plateforme', 'Structure des prix', 'Vérifier et Payer'];

const TIPS = [
  'Un brief clair obtient 3x plus de participations de créateurs',
  'Ajoutez des liens d\'inspiration pour guider la direction créative',
  'Les concours TikTok obtiennent la meilleure portée organique dans la région MENA',
  'La répartition du top 3 (50/30/20) fonctionne le mieux',
  'Fixez une durée de 14 à 21 jours pour une participation maximale',
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
      toast.success('Concours lancé ! Les créateurs peuvent maintenant le découvrir et y participer.');
      router.push('/contests');
    } catch (e) {
      console.error(e);
      toast.error('Échec du lancement du concours. Veuillez vérifier les détails.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Nouvelle Campagne</p>
          <h1 className="font-heading mt-1 text-[28px] font-bold tracking-tight text-foreground">Lancer un Concours</h1>
          <p className="text-[13px] text-muted-foreground">Les créateurs concourent pour votre prix. Vous possédez chaque vidéo.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
          <Trophy className="h-3.5 w-3.5 text-vybe" />
          Étape {step + 1} sur {STEPS.length}
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
              <Lightbulb className="h-3.5 w-3.5" /> Conseils
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">Titre du concours</label>
                <Input placeholder="ex., Défi Rentrée Scolaire" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Description du produit</label>
                <Textarea placeholder="Quel est votre produit et quelle histoire les créateurs doivent-ils raconter ?" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Instructions pour les créateurs</label>
                <Textarea placeholder="Que doivent faire les créateurs ? Qu'est-ce qui fait une vidéo gagnante ?" value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">À faire</label>
                    <button onClick={() => setDos(p => Array.from(new Set([...p, 'Montrer le produit clairement', 'Utiliser le hashtag de la campagne'])))} className="text-[11px] font-medium text-vybe-dark bg-transparent border-0 cursor-pointer flex items-center gap-1"><Sparkles className="h-3 w-3" /> Suggérer</button>
                  </div>
                  <div className="mb-2 flex gap-2">
                    <Input placeholder="Ajouter une consigne…" value={doInput} onChange={e => setDoInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDo()} />
                    <Button variant="outline" size="icon" onClick={addDo}><Plus className="h-4 w-4" /></Button>
                  </div>
                  {dos.map((d, i) => <div key={i} className="mb-1 flex items-center gap-2 text-sm text-foreground"><Check className="h-3.5 w-3.5 text-success shrink-0" />{d}<button onClick={() => setDos(p => p.filter((_, j) => j !== i))} className="ml-auto bg-transparent border-0 cursor-pointer"><X className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button></div>)}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">À ne pas faire</label>
                  <div className="mb-2 flex gap-2">
                    <Input placeholder="Ajouter une restriction…" value={dontInput} onChange={e => setDontInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDont()} />
                    <Button variant="outline" size="icon" onClick={addDont}><Plus className="h-4 w-4" /></Button>
                  </div>
                  {donts.map((d, i) => <div key={i} className="mb-1 flex items-center gap-2 text-sm text-foreground"><X className="h-3.5 w-3.5 text-destructive shrink-0" />{d}<button onClick={() => setDonts(p => p.filter((_, j) => j !== i))} className="ml-auto bg-transparent border-0 cursor-pointer"><X className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button></div>)}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Ressources <span className="text-muted-foreground/60">(facultatif)</span></label>
                <div onClick={() => setFiles(p => [...p, `asset_${p.length + 1}.jpg`])} className="cursor-pointer rounded-2xl border-2 border-dashed border-border/60 p-8 text-center transition-all hover:border-vybe/40 hover:bg-vybe/[0.02]">
                  <Upload className="mx-auto mb-2 h-5 w-5 text-vybe-dark/50" />
                  <p className="text-sm text-muted-foreground">Cliquez pour télécharger des images du produit, des vidéos ou un brief PDF</p>
                </div>
                {files.map((f, i) => <div key={i} className="mt-1 flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-[12px]"><span>{f}</span><button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="bg-transparent border-0 cursor-pointer"><X className="h-3 w-3 text-muted-foreground" /></button></div>)}
              </div>
            </div>
          )}

          {/* Step 1 — Rules & Platform */}
          {step === 1 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Plateforme <span className="text-[11px] text-muted-foreground">(sélection multiple)</span></label>
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
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Région</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} className="h-10 w-full rounded-xl border border-border/60 bg-white/70 px-3 text-[13px] outline-none focus:border-vybe/40">
                    {['MENA', 'Algeria', 'Gulf (UAE, KSA, Kuwait)', 'North Africa', 'Worldwide'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Langue du contenu</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="h-10 w-full rounded-xl border border-border/60 bg-white/70 px-3 text-[13px] outline-none focus:border-vybe/40">
                    {['Any', 'Arabic', 'French', 'English', 'Darija'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Abonnés min. <span className="text-muted-foreground/60">(facultatif)</span></label>
                  <Input placeholder="ex. 10000" value={minFollowers} onChange={e => setMinFollowers(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Durée</label>
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
                <label className="mb-2 block text-sm font-medium text-foreground">Modèle de prix</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: 'fixed', label: 'Cagnotte Fixe', desc: 'Les meilleurs créateurs gagnent un prix défini. Le plus populaire.' },
                    { key: 'per_view', label: 'Paiement Par Vue', desc: 'Chaque créateur gagne en fonction de son nombre de vues.' },
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
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Cagnotte totale (DZD)</label>
                    <Input type="number" value={prizePool} onChange={e => setPrizePool(Number(e.target.value))} />
                    <p className="mt-1.5 text-[11px] text-muted-foreground">Participations estimées : ~{Math.round(prizePool / 8000)}</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Nombre de gagnants</label>
                    <div className="flex gap-2">{[1, 3, 5, 10].map(n => (<button key={n} onClick={() => setWinners(n)} className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer bg-transparent ${winners === n ? 'border-vybe bg-vybe/5 text-vybe-dark' : 'border-border/60 text-muted-foreground hover:border-vybe/40'}`}>{n}</button>))}</div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-2">
                    <p className="text-[12px] font-semibold text-foreground">Répartition des prix</p>
                    {winners === 1 && <PrizeRow label="1ère place (100%)" value={`${fmt(prizePool)} DZD`} gold />}
                    {winners === 3 && <><PrizeRow label="1ère place (50%)" value={`${fmt(prizePool * 0.5)} DZD`} gold /><PrizeRow label="2ème place (30%)" value={`${fmt(prizePool * 0.3)} DZD`} /><PrizeRow label="3ème place (20%)" value={`${fmt(prizePool * 0.2)} DZD`} /></>}
                    {winners === 5 && [40,25,15,12,8].map((p, i) => <PrizeRow key={i} label={`Rang ${i+1} (${p}%)`} value={`${fmt(prizePool * p / 100)} DZD`} gold={i===0} />)}
                    {winners === 10 && <p className="text-[12px] text-muted-foreground">Partage égal : {fmt(prizePool / 10)} DZD chacun</p>}
                  </div>
                </>
              )}

              {prizeType === 'per_view' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Taux pour 1 000 vues (DZD)</label>
                    <Input type="number" value={perViewRate} onChange={e => setPerViewRate(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Plafond de paiement maximum (DZD)</label>
                    <Input type="number" value={perViewCap} onChange={e => setPerViewCap(Number(e.target.value))} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Review & Pay */}
          {step === 3 && (
            <div className="rounded-3xl border border-border/60 bg-white/90 shadow-card p-7 space-y-5">
              <h2 className="font-heading text-lg font-semibold text-foreground">Vérifiez votre concours</h2>
              <div className="space-y-3">
                <ReviewRow label="Titre" value={title || '—'} />
                <ReviewRow label="Plateformes" value={platforms.join(', ') || '—'} />
                <ReviewRow label="Région" value={region} />
                <ReviewRow label="Durée" value={`${duration} jours`} />
                <ReviewRow label="Modèle de prix" value={prizeType === 'fixed' ? 'Cagnotte Fixe' : 'Paiement Par Vue'} />
                {prizeType === 'fixed' && <ReviewRow label="Cagnotte" value={`${fmt(prizePool)} DZD`} highlight />}
              </div>
              <div className="rounded-2xl border border-vybe/20 bg-gradient-to-br from-vybe/5 to-vybe-glow/5 p-5 space-y-2">
                <p className="text-[12px] font-semibold text-foreground">Détail du paiement</p>
                <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Cagnotte</span><span className="font-medium">{fmt(prizePool)} DZD</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Frais de plateforme (10%)</span><span className="font-medium">{fmt(fee)} DZD</span></div>
                <div className="border-t border-border/40 pt-2 flex justify-between text-[14px] font-bold"><span>Total facturé aujourd'hui</span><span className="text-vybe-dark">{fmt(total)} DZD</span></div>
              </div>
              <p className="text-[12px] text-muted-foreground">Les fonds sont placés sous séquestre. Le concours est mis en ligne immédiatement après le paiement. Vous avez 48h pour contester les résultats avant que les paiements ne soient débloqués.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="gap-2"><ArrowLeft className="h-4 w-4" /> Retour</Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext} className="gap-2 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.6)]">
                Continuer <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={launch} disabled={loading} className="gap-2 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.6)]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Payer & Lancer le Concours
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
