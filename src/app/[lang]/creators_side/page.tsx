"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  BarChart3, TrendingUp, Users, DollarSign, Trophy, Handshake, 
  Clock, ArrowRight, Sparkles, ArrowUpRight, Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { db, Campaign } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { formatDZD } from '@/lib/mock-data';

export default function CreatorDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any>({ contests: [], deals: [], dealSubmissions: [] });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [appsData, campsData] = await Promise.all([
          user ? db.getCreatorApplications(user.id) : { contests: [], deals: [], dealSubmissions: [] },
          db.getCampaigns()
        ]);
        if (mounted) {
          // Hide contests for now as requested
          appsData.contests = [];
          setApplications(appsData);
          setCampaigns(campsData.filter(c => c.type !== 'contest'));
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();

    // Listen to real-time changes
    const channel = supabase.channel('dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contests' }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contest_submissions', filter: user ? `creator_id=eq.${user.id}` : undefined }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deal_applications', filter: user ? `creator_id=eq.${user.id}` : undefined }, () => { loadData(); })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const stats = useMemo(() => {
    let activeOpps = 0;
    let pendingBalance = 0;
    let totalEarnings = 0;
    const recentActivity: any[] = [];

    // Process Contests
    applications.contests.forEach((c: any) => {
      if (c.status === 'active') activeOpps++;
      if (c.prize_amount > 0) totalEarnings += Number(c.prize_amount);
      
      recentActivity.push({
        id: `c_${c.id}`,
        type: 'contest',
        brand: c.contests?.profiles?.company_name || 'Brand',
        title: c.contests?.title || 'Contest',
        amount: c.prize_amount > 0 ? formatDZD(c.prize_amount) : 'Pending',
        time: new Date(c.submitted_at).toLocaleDateString(),
        icon: Trophy,
        color: "from-amber-400 to-orange-500",
        date: new Date(c.submitted_at)
      });
    });

    // Process Deals
    applications.deals.forEach((d: any) => {
      // Find submission
      const sub = applications.dealSubmissions.find((s: any) => s.application_id === d.id);
      
      if (d.status === 'approved' && (!sub || sub.status !== 'accepted')) {
        activeOpps++;
      }
      
      if (sub && sub.status === 'accepted') {
        totalEarnings += Number(d.proposed_bid || 0);
      } else if (d.status === 'approved') {
        pendingBalance += Number(d.proposed_bid || 0);
      }

      recentActivity.push({
        id: `d_${d.id}`,
        type: 'deal',
        brand: d.deals?.profiles?.company_name || 'Brand',
        title: d.deals?.title || 'Deal',
        amount: formatDZD(Number(d.proposed_bid || 0)),
        time: new Date(d.applied_at).toLocaleDateString(),
        icon: Handshake,
        color: "from-emerald-400 to-green-500",
        date: new Date(d.applied_at)
      });
    });

    recentActivity.sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      activeOpps,
      pendingBalance,
      totalEarnings,
      recentActivity: recentActivity.slice(0, 3)
    };
  }, [applications]);

  const recommendedOpportunities = useMemo(() => {
    // Filter out campaigns we already applied to
    const appliedContestIds = applications.contests.map((c: any) => c.contest_id);
    const appliedDealIds = applications.deals.map((d: any) => d.deal_id);
    
    return campaigns.filter(c => {
      if (c.type === 'contest') return !appliedContestIds.includes(c.id) && c.status === 'live';
      return !appliedDealIds.includes(c.id) && c.status === 'live';
    }).slice(0, 2);
  }, [campaigns, applications]);

  const kpis = [
    {
      label: "Solde disponible",
      value: formatDZD(stats.totalEarnings),
      delta: "+0",
      progress: stats.totalEarnings > 0 ? 100 : 0,
      icon: DollarSign,
    },
    {
      label: "Solde en attente",
      value: formatDZD(stats.pendingBalance),
      delta: "En cours de validation",
      progress: stats.pendingBalance > 0 ? 50 : 0,
      icon: Clock,
    },
    {
      label: "Opportunités actives",
      value: stats.activeOpps.toString(),
      delta: "En cours",
      progress: stats.activeOpps > 0 ? 100 : 0,
      icon: Trophy,
    },
    {
      label: "Revenus totaux",
      value: formatDZD(stats.totalEarnings),
      delta: "+0%",
      progress: stats.totalEarnings > 0 ? 100 : 0,
      icon: TrendingUp,
    }
  ];

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Créateur";

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="h-3 w-24 bg-muted rounded-full mb-3" />
            <div className="h-8 w-64 bg-muted rounded-full mb-3" />
            <div className="h-4 w-48 bg-muted/60 rounded-full" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-muted rounded-full" />
            <div className="h-10 w-40 bg-muted rounded-full" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl border border-border/40 bg-white/50 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-2xl bg-muted" />
                <div className="w-12 h-5 rounded-full bg-muted/50" />
              </div>
              <div className="h-3 w-20 bg-muted rounded-full mb-3" />
              <div className="h-8 w-24 bg-muted rounded-full mb-5" />
              <div className="h-1 w-full bg-muted/50 rounded-full" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommended Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <div>
                <div className="h-5 w-40 bg-muted rounded-full mb-2" />
                <div className="h-3 w-32 bg-muted/60 rounded-full" />
              </div>
              <div className="h-4 w-16 bg-muted rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="p-6 rounded-3xl bg-white/50 border border-border/40 flex flex-col min-h-[200px]">
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-muted rounded-md" />
                    <div className="h-6 w-20 bg-muted rounded-md" />
                  </div>
                  <div className="h-6 w-48 bg-muted rounded-full mb-2" />
                  <div className="h-4 w-24 bg-muted/60 rounded-full mb-8" />
                  <div className="mt-auto flex justify-between pt-4 border-t border-border/40">
                    <div className="h-5 w-20 bg-muted rounded-full" />
                    <div className="h-4 w-24 bg-muted/60 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Skeleton */}
          <div className="space-y-4">
            <div className="px-2">
              <div className="h-5 w-32 bg-muted rounded-full mb-2" />
              <div className="h-3 w-24 bg-muted/60 rounded-full" />
            </div>
            <div className="bg-white/50 border border-border/40 rounded-3xl p-6 min-h-[300px]">
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 pt-1">
                      <div className="h-4 w-32 bg-muted rounded-full mb-2" />
                      <div className="h-3 w-24 bg-muted/60 rounded-full mb-3" />
                      <div className="h-2 w-16 bg-muted/40 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-10 w-full bg-muted rounded-xl mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Tableau de bord créateur</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px] flex items-center gap-2">
            Bon retour, {displayName} <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Voici ce qui se passe avec votre activité de créateur aujourd'hui.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/creators_side/browse">
            <Button variant="outline" className="h-10 gap-1.5 rounded-full border-border/60 bg-white/70 px-5 text-[13px] hover:bg-white shadow-sm">
              <Users className="h-3.5 w-3.5" /> Parcourir les marques
            </Button>
          </Link>
          <Link href="/creators_side/browse">
            <Button className="h-10 gap-1.5 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-5 text-[13px] text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.5)] transition-all hover:shadow-[0_12px_32px_-8px_oklch(0.72_0.14_300_/_0.6)]">
              <Sparkles className="h-3.5 w-3.5" /> Trouver des opportunités
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Recommandé pour vous</h2>
              <p className="text-[12px] text-muted-foreground">Basé sur votre niche et vos performances</p>
            </div>
            <Link 
              href="/creators_side/browse" 
              className="text-[13px] text-vybe-dark hover:text-vybe font-medium flex items-center gap-1"
            >
              Tout voir <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {recommendedOpportunities.length === 0 ? (
            <div className="p-8 text-center bg-white/90 border border-border/40 rounded-3xl">
              <p className="text-sm text-muted-foreground">Aucune recommandation pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedOpportunities.map((opp) => (
                <div 
                  key={opp.id}
                  className="group relative flex flex-col p-6 rounded-3xl bg-white/90 border border-border/40 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform duration-500">
                    {opp.type === 'contest' ? <Trophy className="w-24 h-24 text-vybe" /> : <Handshake className="w-24 h-24 text-vybe" />}
                  </div>
                  
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md",
                        opp.type === 'contest' 
                          ? "bg-vybe/10 text-vybe-dark border border-vybe/20" 
                          : "bg-vybe-glow/10 text-vybe-dark border border-vybe-glow/20"
                      )}>
                        {opp.type}
                      </span>
                      <span className="text-[10px] font-bold text-success-foreground bg-success/10 px-2.5 py-1 rounded-md border border-success/20">
                        Correspondance à 98%
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-foreground font-bold text-[17px] mb-1">{opp.name}</h3>
                    <p className="text-muted-foreground text-[13px] mb-5">{opp.brand}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                      <span className="font-semibold text-[14px] text-foreground">{opp.budget}</span>
                      <span className="text-[12px] text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {opp.daysLeft} jours restants</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="px-2">
            <h2 className="font-heading text-lg font-semibold text-foreground">Activité récente</h2>
            <p className="text-[12px] text-muted-foreground">Vos dernières mises à jour</p>
          </div>
          
          <div className="bg-white/90 border border-border/40 rounded-3xl p-6 shadow-card min-h-[300px]">
            {stats.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground mt-12">
                <p className="text-sm">Aucune activité récente</p>
                <p className="text-xs mt-1">Postulez à des campagnes pour commencer</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stats.recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {i !== stats.recentActivity.length - 1 && (
                      <div className="absolute top-9 bottom-[-24px] left-[19px] w-px bg-border/60" />
                    )}
                    
                    <div className={cn("relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-white shadow-sm bg-gradient-to-br", activity.color)}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 pt-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate">
                        {activity.title}
                      </p>
                      <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                        {activity.brand} • <span className="font-medium text-foreground">{activity.amount}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider font-semibold">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {stats.recentActivity.length > 0 && (
              <Button variant="ghost" className="w-full mt-6 h-10 rounded-xl text-[12px] font-semibold text-muted-foreground hover:text-foreground">
                Voir toute l'activité
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
