"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { db, Campaign } from '@/lib/db';
import { formatNumber, formatDZD } from '@/lib/mock-data';
import { Plus, TrendingUp, Eye, Megaphone, DollarSign, ArrowUpRight, Search, Upload, Bell, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Live' | 'Draft' | 'Ended'>('All');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await db.getCampaigns();
        // Hide contests for now as requested
        setCampaigns(data.filter(c => c.type !== 'contest'));
      } catch (e) {
        console.error("Failed to load dashboard campaigns", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      // Tab filter
      if (activeTab !== 'All' && c.status !== activeTab.toLowerCase()) return false;
      // Search filter
      if (query && !`${c.name} ${c.brand}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, activeTab, query]);

  // Compute KPIs dynamically
  const kpis = useMemo(() => {
    const active = campaigns.filter(c => c.status === 'live').length;
    const totalSubs = campaigns.reduce((s, c) => s + c.submissions, 0);
    const totalViews = campaigns.reduce((s, c) => s + c.views, 0);
    
    // Average budget / prize pool
    const totalSpent = campaigns.reduce((s, c) => {
      if (c.type === 'contest') return s + (c.prizePool || 0);
      return s + (((c.budgetMin || 0) + (c.budgetMax || 0)) / 2);
    }, 0);

    return [
      { label: 'Campagnes actives', value: active.toString(), delta: `+${active}`, progress: campaigns.length ? (active / campaigns.length) * 100 : 0, icon: Megaphone },
      { label: 'Soumissions totales', value: totalSubs.toString(), delta: `+${totalSubs}`, progress: totalSubs ? 100 : 0, icon: TrendingUp },
      { label: 'Vues totales', value: formatNumber(totalViews), delta: '+0%', progress: totalViews ? 100 : 0, icon: Eye },
      { label: 'Total dépensé', value: formatDZD(totalSpent), delta: '+0%', progress: totalSpent ? 100 : 0, icon: DollarSign },
    ];
  }, [campaigns]);

  return (
    <DashboardLayout>
      {/* Top bar */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Aperçu</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">
            Bonjour, Ahmed
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Voici ce qui se passe avec vos campagnes aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Rechercher des campagnes…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-10 w-56 rounded-full border border-border/60 bg-white/70 pl-9 pr-4 text-[13px] outline-none placeholder:text-muted-foreground/50 focus:border-vybe/40 focus:bg-white"
            />
          </div>
          <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-full border-border/60 bg-white/70 px-4 text-[13px] hover:bg-white">
            <Upload className="h-3.5 w-3.5" /> Importer
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border/60 bg-white/70 hover:bg-white">
            <Bell className="h-4 w-4" />
          </Button>
          <Link href="/deals/new">
            <Button className="h-10 gap-1.5 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-5 text-[13px] text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.5)] transition-all hover:shadow-[0_12px_32px_-8px_oklch(0.72_0.14_300_/_0.6)]">
              <Plus className="h-3.5 w-3.5" /> Nouvelle campagne
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => {
          const colors = [
            'from-[oklch(0.92_0.06_300)] to-[oklch(0.96_0.04_330)]',
            'from-[oklch(0.93_0.05_330)] to-[oklch(0.96_0.04_300)]',
            'from-[oklch(0.92_0.06_280)] to-[oklch(0.96_0.04_320)]',
            'from-[oklch(0.93_0.05_340)] to-[oklch(0.96_0.04_290)]',
          ];
          const barColors = ['bg-vybe', 'bg-vybe-glow', 'bg-vybe-light', 'bg-vybe-pink'];
          return (
            <div
              key={k.label}
              className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${colors[i]} opacity-60 blur-2xl transition-opacity group-hover:opacity-90`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
                    <k.icon className="h-4 w-4 text-vybe-dark/70" />
                  </div>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-vybe/10 px-2 py-0.5 text-[10px] font-semibold text-vybe-dark">
                    <ArrowUpRight className="h-2.5 w-2.5" /> {k.delta}
                  </span>
                </div>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{k.label}</p>
                <p className="font-heading mt-1 text-[28px] font-bold tracking-tight text-foreground">{k.value}</p>
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted/60">
                  <div className={`h-full rounded-full ${barColors[i]} shadow-[0_0_8px_oklch(0.72_0.14_300_/_0.4)]`} style={{ width: `${k.progress}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaigns table */}
      <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Vos campagnes</h3>
            <p className="text-[12px] text-muted-foreground">Gérez et suivez toutes vos campagnes actives</p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['All', 'Live', 'Draft', 'Ended'] as const).map(f => {
              const tabLabels: Record<string, string> = { 'All': 'Tous', 'Live': 'En cours', 'Draft': 'Brouillon', 'Ended': 'Terminé' };
              return (
              <button
                key={f}
                onClick={() => setActiveTab(f)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  activeTab === f
                    ? 'bg-vybe/10 text-vybe-dark'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                {tabLabels[f]}
              </button>
            )})}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-vybe mb-2" />
            <p className="text-xs">Chargement des campagnes...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-sm">Aucune campagne trouvée.</p>
            <p className="text-xs mt-1">Créez un nouveau concours ou une nouvelle offre pour commencer !</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-border/40 bg-muted/30">
                  {['Campagne', 'Type', 'Statut', 'Soumissions', 'Vues', 'Budget', 'Créé', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b border-border/30 transition-colors hover:bg-vybe/[0.03] ${i === filteredCampaigns.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 text-[11px] font-bold text-vybe-dark">
                          {c.brand.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground">{c.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={c.type} /></td>
                    <td className="px-6 py-5"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-5">
                      <div className="flex -space-x-1.5">
                        {Array.from({ length: Math.min(3, c.submissions) }).map((_, j) => (
                          <div
                            key={j}
                            className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-vybe/30 to-vybe-glow/20"
                          />
                        ))}
                        {c.submissions > 3 && (
                          <div className="flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
                            +{c.submissions - 3}
                          </div>
                        )}
                        {c.submissions === 0 && <span className="text-[12px] text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[13px] font-medium text-foreground">
                      {c.views > 0 ? formatNumber(c.views) : '0'}
                    </td>
                    <td className="px-6 py-5 text-[12px] text-muted-foreground">{c.budget}</td>
                    <td className="px-6 py-5 text-[12px] text-muted-foreground">{c.created}</td>
                    <td className="px-6 py-5 text-right">
                      <Link href={c.type === 'contest' ? `/contests/${c.id}` : `/deals/${c.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[12px] font-medium text-vybe-dark hover:bg-vybe/10">
                          Voir <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
