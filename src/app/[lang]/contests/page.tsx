"use client";

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { db, Campaign } from '@/lib/db';
import { formatNumber, formatDZD } from '@/lib/mock-data';
import { Plus, Search, ArrowUpRight, Trophy, Eye, Users, Clock, Loader2 } from 'lucide-react';

const fmt = (n: number) => n.toLocaleString('en-US');

export default function ContestsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'live' | 'draft' | 'ended'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await db.getCampaigns();
        setCampaigns(data);
      } catch (e) {
        console.error("Failed to load contests", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const contests = useMemo(() => campaigns.filter(c => c.type === 'contest'), [campaigns]);

  const filtered = useMemo(() => contests.filter(c => {
    if (status !== 'all' && c.status !== status) return false;
    if (query && !`${c.name} ${c.brand}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [contests, status, query]);

  const totalPrize = useMemo(() => contests.reduce((s, c) => s + (c.prizePool ?? 0), 0), [contests]);
  const totalViews = useMemo(() => contests.reduce((s, c) => s + c.views, 0), [contests]);
  const totalSubs = useMemo(() => contests.reduce((s, c) => s + c.submissions, 0), [contests]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Campagnes</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">Concours</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Publiez une cagnotte. Les créateurs concourent. Vous possédez chaque vidéo.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher des concours…"
              className="h-10 w-52 rounded-full border border-border/60 bg-white/70 pl-9 pr-4 text-[13px] outline-none placeholder:text-muted-foreground/50 focus:border-vybe/40 focus:bg-white" />
          </div>
          <Link href="/contests/new">
            <Button className="h-10 gap-1.5 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-5 text-[13px] text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.5)]">
              <Plus className="h-3.5 w-3.5" /> Nouveau concours
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: Trophy, label: 'Cagnotte totale', value: formatDZD(totalPrize), sub: `${contests.length} concours`, color: 'from-[oklch(0.92_0.06_300)] to-[oklch(0.96_0.04_330)]' },
          { icon: Eye, label: 'Vues totales', value: formatNumber(totalViews), sub: 'sur tous les concours', color: 'from-[oklch(0.93_0.05_330)] to-[oklch(0.96_0.04_300)]' },
          { icon: Users, label: 'Soumissions', value: totalSubs.toString(), sub: 'vidéos de créateurs', color: 'from-[oklch(0.92_0.06_280)] to-[oklch(0.96_0.04_320)]' },
        ].map((k, i) => (
          <div key={k.label} className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft">
            <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${k.color} opacity-60 blur-2xl`} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
                <k.icon className="h-5 w-5 text-vybe-dark/70" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{k.label}</p>
                <p className="font-heading mt-0.5 text-[22px] font-bold text-foreground">{k.value}</p>
                <p className="text-[11px] text-muted-foreground">{k.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Liste des concours</h3>
            <p className="text-[12px] text-muted-foreground">{filtered.length} sur {contests.length} concours</p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['all', 'live', 'draft', 'ended'] as const).map(f => {
              const tabLabels: Record<string, string> = { 'all': 'Tous', 'live': 'En cours', 'draft': 'Brouillon', 'ended': 'Terminé' };
              return (
              <button key={f} onClick={() => setStatus(f)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${status === f ? 'bg-vybe/10 text-vybe-dark' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'}`}>
                {f === 'all' ? `Tous (${contests.length})` : tabLabels[f]}
              </button>
            )})}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-vybe mb-2" />
            <p className="text-xs">Chargement des concours...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-border/40 bg-muted/30">
                  {['Concours', 'Statut', 'Soumissions', 'Vues', 'Cagnotte', 'Jours restants', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-border/30 transition-colors hover:bg-vybe/[0.03] ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 text-[11px] font-bold text-vybe-dark">
                          {c.brand.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground">{c.brand} · {c.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {Array.from({ length: Math.min(3, c.submissions) }).map((_, j) => (
                            <div key={j} className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-vybe/30 to-vybe-glow/20" />
                          ))}
                        </div>
                        <span className="text-[12px] text-muted-foreground">{c.submissions || '0'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[13px] font-medium text-foreground">{c.views > 0 ? formatNumber(c.views) : '0'}</td>
                    <td className="px-6 py-5 text-[13px] font-bold text-vybe-dark">{c.prizePool ? formatDZD(c.prizePool) : '—'}</td>
                    <td className="px-6 py-5">
                      {c.status === 'live' ? (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.daysLeft <= 5 ? 'bg-warning/10 text-warning-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <Clock className="h-2.5 w-2.5" /> {fmt(c.daysLeft)}j restants
                        </span>
                      ) : <span className="text-[12px] text-muted-foreground">—</span>}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/contests/${c.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[12px] font-medium text-vybe-dark hover:bg-vybe/10">
                          Classement <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-16 text-center">
                    <Trophy className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
                    <p className="text-[13px] font-medium text-foreground">Aucun concours pour le moment</p>
                    <p className="text-[12px] text-muted-foreground">Créez votre premier concours pour commencer.</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
