"use client";

import { useEffect, useState, useMemo, use } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { db, Campaign, Submission } from '@/lib/db';
import { formatNumber, formatDZD } from '@/lib/mock-data';
import { Crown, Medal, Trophy, ArrowLeft, Eye, Users, DollarSign, RefreshCw, ExternalLink, Loader2, ArrowUpRight } from 'lucide-react';

type Tab = 'leaderboard' | 'submissions' | 'brief';

export default function ContestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [contest, setContest] = useState<Campaign | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('leaderboard');
  const [time, setTime] = useState({ d: 3, h: 14, m: 22, s: 8 });
  const [lastRefresh, setLastRefresh] = useState('Just now');

  useEffect(() => {
    async function loadContestData() {
      try {
        const c = await db.getCampaignById(id);
        if (c) {
          setContest(c);
          const subs = await db.getSubmissions(id);
          setSubmissions(subs);
        }
      } catch (e) {
        console.error("Failed to load contest details", e);
      } finally {
        setLoading(false);
      }
    }
    loadContestData();
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { d, h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d--; }
        if (d < 0) return { d: 0, h: 0, m: 0, s: 0 };
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Compute leaderboard standings from actual submissions sorted by views desc
  const leaderboard = useMemo(() => {
    return [...submissions]
      .sort((a, b) => b.views - a.views)
      .map((sub, index) => {
        // Calculate prize split based on rank (1st: 50%, 2nd: 30%, 3rd: 20%)
        let prize = 0;
        if (contest && contest.prizePool) {
          if (index === 0) prize = Math.round(contest.prizePool * 0.5);
          else if (index === 1) prize = Math.round(contest.prizePool * 0.3);
          else if (index === 2) prize = Math.round(contest.prizePool * 0.2);
        }
        return {
          rank: index + 1,
          creator: sub.creator,
          handle: sub.handle,
          views: sub.views,
          prize,
          change24h: Math.round(sub.views * 0.04),
          trend: 'up' as const
        };
      });
  }, [submissions, contest]);

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const podiumOrder = useMemo(() => {
    if (top3.length === 3) return [top3[1], top3[0], top3[2]];
    if (top3.length === 2) return [top3[1], top3[0]];
    return top3;
  }, [top3]);

  const handleRefresh = async () => {
    setLastRefresh('Refreshing...');
    try {
      const subs = await db.getSubmissions(id);
      setSubmissions(subs);
      setLastRefresh('Just now');
    } catch (e) {
      setLastRefresh('Failed to refresh');
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-vybe" />
        <p className="text-xs">Chargement des détails du concours...</p>
      </div>
    </DashboardLayout>
  );

  if (!contest) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Trophy className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-foreground font-medium">Concours introuvable</p>
        <Link href="/contests"><Button variant="outline" className="rounded-full gap-2"><ArrowLeft className="h-4 w-4" />Retour aux concours</Button></Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {/* Back + header */}
      <div className="mb-6">
        <Link href="/contests" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Tous les Concours
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-foreground">{contest.name}</h1>
              <StatusBadge status="contest" />
              <StatusBadge status={contest.status} />
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">{contest.brand} · Cagnotte {formatDZD(contest.prizePool ?? 0)} · {contest.platforms.join(', ')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-success">EN DIRECT</span>
            </div>
            <div className="rounded-full border border-border/40 bg-white/80 px-4 py-2 font-mono text-[12px] font-semibold text-foreground shadow-card">
              Se termine dans {time.d}j {String(time.h).padStart(2, '0')}:{String(time.m).padStart(2, '0')}:{String(time.s).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid gap-3 md:grid-cols-4">
        {[
          { icon: Users, label: 'Créateurs', value: submissions.length.toString() },
          { icon: Eye, label: 'Vues Totales', value: formatNumber(submissions.reduce((s, x) => s + x.views, 0)) },
          { icon: DollarSign, label: 'Cagnotte', value: formatDZD(contest.prizePool ?? 0) },
          { icon: Trophy, label: 'Jours Restants', value: `${contest.daysLeft}j` },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-white/90 p-4 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 shrink-0">
              <s.icon className="h-4 w-4 text-vybe-dark/70" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
              <p className="font-heading text-[18px] font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 border-b border-border/40">
        {(['leaderboard', 'submissions', 'brief'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-[13px] font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-vybe text-vybe-dark' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'leaderboard' ? 'Classement' : t === 'submissions' ? 'Soumissions' : 'Brief'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 pb-2">
          <button onClick={handleRefresh} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer">
            <RefreshCw className="h-3 w-3" /> Actualisé {lastRefresh}
          </button>
        </div>
      </div>

      {/* Leaderboard tab */}
      {tab === 'leaderboard' && (
        <div className="space-y-8">
          {/* Podium */}
          {podiumOrder.length > 0 ? (
            <div className="flex items-end justify-center gap-5 py-6">
              {podiumOrder.map((entry, i) => {
                const heights = ['h-36', 'h-48', 'h-32'];
                const gradients = [
                  'from-[oklch(0.93_0.04_310)] to-[oklch(0.96_0.02_320)]',
                  'from-[oklch(0.92_0.08_300)] to-[oklch(0.96_0.06_330)]',
                  'from-[oklch(0.93_0.04_340)] to-[oklch(0.96_0.02_320)]',
                ];
                return (
                  <div key={entry.rank} className="flex flex-col items-center">
                    {i === 1 && <Crown className="mb-2 h-7 w-7 text-vybe drop-shadow-[0_0_12px_oklch(0.72_0.14_300_/_0.6)]" />}
                    <div className={`flex ${heights[i] || 'h-32'} w-40 flex-col items-center justify-center rounded-3xl border border-border/40 bg-gradient-to-b ${gradients[i] || gradients[0]} px-3 shadow-soft relative overflow-hidden`}>
                      <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-vybe/20 blur-2xl" />
                      <Medal className={`relative z-10 mb-2 h-6 w-6 ${i === 1 ? 'text-vybe' : 'text-vybe-dark/40'}`} />
                      <p className="relative z-10 text-[13px] font-bold text-foreground text-center line-clamp-1">{entry.creator}</p>
                      <p className="relative z-10 text-[11px] text-muted-foreground">{formatNumber(entry.views)} vues</p>
                      <p className="relative z-10 mt-1 font-heading text-[14px] font-bold text-vybe-dark">{formatDZD(entry.prize)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">Le classement sera mis à jour une fois que les créateurs auront soumis des vidéos.</p>
            </div>
          )}

          {/* Full rankings table */}
          {leaderboard.length > 0 && (
            <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card">
              <div className="px-6 py-5">
                <h3 className="font-heading text-base font-semibold text-foreground">Classement Complet</h3>
                <p className="text-[12px] text-muted-foreground">Classement en direct — mis à jour toutes les 6 heures via Phyllo</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-border/40 bg-muted/30">
                      {['Rang', 'Créateur', 'Vues', 'Prix', 'Évol 24h'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, i) => (
                      <tr key={entry.rank} className={`border-b border-border/30 transition-colors hover:bg-vybe/[0.03] ${i === leaderboard.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-6 py-4">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-[12px] font-bold ${entry.rank === 1 ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-card' : entry.rank <= 3 ? 'bg-vybe/10 text-vybe-dark' : 'bg-muted text-muted-foreground'}`}>{entry.rank}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/20 to-vybe-glow/10 text-[11px] font-bold text-vybe-dark">{entry.creator[0]}</div>
                            <div>
                              <p className="text-[13px] font-semibold text-foreground">{entry.creator}</p>
                              <p className="text-[11px] text-muted-foreground">{entry.handle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-medium text-foreground">{formatNumber(entry.views)}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-vybe-dark">{formatDZD(entry.prize)}</td>
                        <td className="px-6 py-4 text-[13px] font-medium text-success">
                          +{formatNumber(entry.change24h)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submissions tab */}
      {tab === 'submissions' && (
        <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card">
          <div className="px-6 py-5">
            <h3 className="font-heading text-base font-semibold text-foreground">Vidéos Soumises</h3>
            <p className="text-[12px] text-muted-foreground">{submissions.length} vidéos reçues</p>
          </div>
          {submissions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p className="text-sm">Aucune soumission pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-border/40 bg-muted/30">
                    {['Créateur', 'Plateforme', 'Vues', 'Soumis', 'Statut', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => (
                    <tr key={s.id} className={`border-b border-border/30 transition-colors hover:bg-vybe/[0.03] ${i === submissions.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/20 to-vybe-glow/10 text-[11px] font-bold text-vybe-dark">{s.creator[0]}</div>
                          <div>
                            <p className="text-[13px] font-semibold text-foreground">{s.creator}</p>
                            <p className="text-[11px] text-muted-foreground">{s.handle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-muted-foreground">{s.platform}</td>
                      <td className="px-6 py-4 text-[13px] font-medium text-foreground">{formatNumber(s.views)}</td>
                      <td className="px-6 py-4 text-[12px] text-muted-foreground">{s.submitted}</td>
                      <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[12px] font-medium text-vybe-dark hover:bg-vybe/10 gap-1">
                          Voir <ExternalLink className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Brief tab */}
      {tab === 'brief' && (
        <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card p-7 space-y-6 max-w-2xl">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Description</p>
            <p className="text-[14px] text-foreground leading-relaxed">{contest.description}</p>
          </div>
          {contest.dos && contest.dos.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Do&apos;s</p>
              <ul className="space-y-2">{contest.dos.map(d => <li key={d} className="flex gap-2 text-[13px] text-foreground"><span className="text-success mt-0.5">✓</span>{d}</li>)}</ul>
            </div>
          )}
          {contest.donts && contest.donts.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Don&apos;ts</p>
              <ul className="space-y-2">{contest.donts.map(d => <li key={d} className="flex gap-2 text-[13px] text-foreground"><span className="text-destructive mt-0.5">✗</span>{d}</li>)}</ul>
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Plateformes</p>
            <div className="flex flex-wrap gap-2">{contest.platforms.map(p => <span key={p} className="rounded-full border border-border/40 bg-muted/40 px-3 py-1 text-[12px] font-medium">{p}</span>)}</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
