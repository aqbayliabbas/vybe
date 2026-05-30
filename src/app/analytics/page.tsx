"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  BarChart3, 
  Calendar, 
  Eye, 
  TrendingUp, 
  Heart, 
  Share2, 
  DollarSign, 
  Clock, 
  Sparkles,
  Smartphone,
  Info,
  ChevronDown
} from 'lucide-react';
import { formatNumber, formatDZD } from '@/lib/mock-data';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock stats
  const totalViews = 0;
  const spent = 0;
  const submissions = 0;
  const engagement = 0;

  const platformData: any[] = [];

  const regionData: any[] = [];

  const topContent: any[] = [];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Intelligence</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">Workspace Analytics</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Track aggregate campaign views, creator performances, and return on investment.</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 p-1">
          {([
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: '90d', label: '90 Days' },
          ] as const).map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                period === p.key 
                  ? 'bg-vybe/10 text-vybe-dark' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Eye, label: 'Aggregate Views', value: formatNumber(totalViews), sub: '+12.4% vs last period', color: 'from-[oklch(0.92_0.06_300)] to-[oklch(0.96_0.04_330)]' },
          { icon: DollarSign, label: 'Total Invested', value: formatDZD(spent), sub: '92.3% active escrow utilization', color: 'from-[oklch(0.93_0.05_330)] to-[oklch(0.96_0.04_300)]' },
          { icon: TrendingUp, label: 'Submissions', value: submissions.toString(), sub: '42 deals / 5 contests', color: 'from-[oklch(0.92_0.06_280)] to-[oklch(0.96_0.04_320)]' },
          { icon: Heart, label: 'Avg Engagement', value: `${engagement}%`, sub: 'Above industry benchmark (3.2%)', color: 'from-[oklch(0.93_0.05_340)] to-[oklch(0.96_0.04_290)]' },
        ].map((k, i) => (
          <div key={k.label} className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5">
            <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${k.color} opacity-60 blur-2xl`} />
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
                <k.icon className="h-4 w-4 text-vybe-dark/70" />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{k.label}</p>
              <p className="font-heading mt-1 text-[26px] font-bold text-foreground">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <span className="text-success">↑</span> {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left widget: Views by Platform */}
        <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card space-y-6">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Views by Platform</h3>
            <p className="text-xs text-muted-foreground">Distribution of total campaign views across networks.</p>
          </div>

          <div className="space-y-4">
            {platformData.map(p => (
              <div key={p.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{p.name}</span>
                  <span className="text-muted-foreground font-semibold">{formatNumber(p.views)} ({p.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-muted/30 p-3 flex items-start gap-2 text-[11px] text-muted-foreground">
            <Info className="h-4 w-4 text-muted-foreground/80 shrink-0 mt-0.5" />
            <span>TikTok continues to be the dominant organic views generator for MENA region youth demographics.</span>
          </div>
        </div>

        {/* Right widget: Views by Region */}
        <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card space-y-6">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Views by Country</h3>
            <p className="text-xs text-muted-foreground">Regional audience reach performance.</p>
          </div>

          <div className="space-y-4">
            {regionData.map(r => (
              <div key={r.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">{r.flag} {r.name}</span>
                  <span className="text-muted-foreground font-semibold">{formatNumber(r.views)} ({r.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                  <div className="h-full rounded-full bg-vybe shadow-[0_0_8px_oklch(0.72_0.14_300_/_0.4)]" style={{ width: `${r.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-muted/30 p-3 flex items-start gap-2 text-[11px] text-muted-foreground">
            <Info className="h-4 w-4 text-muted-foreground/80 shrink-0 mt-0.5" />
            <span>Algerian domestic creators drive 78.7% of engagement with native Arabic and French hybrid formats.</span>
          </div>
        </div>
      </div>

      {/* Top content list */}
      <div className="mt-6 rounded-3xl border border-border/40 bg-white/90 shadow-card">
        <div className="px-6 py-5 border-b border-border/30">
          <h3 className="font-heading text-base font-semibold text-foreground">Best Performing Creator Content</h3>
          <p className="text-xs text-muted-foreground">Top 5 high-engagement submissions.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-border/40 bg-muted/30">
                {['Rank', 'Creator', 'Platform', 'Views', 'Likes', 'Shares', 'Engagement'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topContent.map((item, idx) => (
                <tr key={idx} className={`border-b border-border/30 transition-colors hover:bg-vybe/[0.02] ${idx === topContent.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">#{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[13px] text-foreground">{item.creator}</div>
                    <div className="text-[11px] text-muted-foreground">{item.handle}</div>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-foreground">{item.platform}</td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-foreground">{formatNumber(item.views)}</td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground">{formatNumber(item.likes)}</td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground">{formatNumber(item.shares)}</td>
                  <td className="px-6 py-4"><span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">{item.engagement}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
