"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  FolderOpen, Clock, CheckCircle2, XCircle,
  Trophy, Handshake, ArrowRight, Eye, Heart, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { formatDZD } from '@/lib/mock-data';

export default function MyWorkPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed' | 'rejected'>('active');
  const [applications, setApplications] = useState<any>({ contests: [], deals: [], dealSubmissions: [] });

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const appsData = user ? await db.getCreatorApplications(user.id) : { contests: [], deals: [], dealSubmissions: [] };
        // Hide contests for now as requested
        appsData.contests = [];
        if (mounted) setApplications(appsData);
      } catch (err) {
        console.error("Failed to load my work data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();

    // Listen to real-time changes
    const channel = supabase.channel('my_work_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contest_submissions', filter: user ? `creator_id=eq.${user.id}` : undefined }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deal_applications', filter: user ? `creator_id=eq.${user.id}` : undefined }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deal_submissions' }, () => { loadData(); }) // Harder to filter by creator on deal_submissions without joining, so fetch all and process
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const { activeWork, pendingWork, completedWork, rejectedWork } = useMemo(() => {
    const active: any[] = [];
    const pending: any[] = [];
    const completed: any[] = [];
    const rejected: any[] = [];

    // Process Contests
    applications.contests.forEach((c: any) => {
      const workItem = {
        id: `c_${c.id}`,
        type: "contest",
        brand: c.contests?.profiles?.company_name || "Brand",
        title: c.contests?.title || "Contest",
        status: c.status,
        currentRank: c.final_rank || "-",
        views: c.views || 0,
        likes: c.likes || 0,
        deadline: new Date(c.contests?.ends_at || Date.now()).toLocaleDateString(),
        logo: c.contests?.profiles?.logo_url || "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
        link: `/contests/${c.contest_id}`
      };

      if (c.status === 'active') active.push(workItem);
      else if (c.status === 'disqualified') rejected.push(workItem);
      else completed.push(workItem); // fallback
    });

    // Process Deals
    applications.deals.forEach((d: any) => {
      const sub = applications.dealSubmissions.find((s: any) => s.application_id === d.id);
      
      const workItem = {
        id: `d_${d.id}`,
        type: "deal",
        brand: d.deals?.profiles?.company_name || "Brand",
        title: d.deals?.title || "Deal",
        status: d.status,
        progress: sub ? (sub.status === 'accepted' ? 100 : sub.status === 'submitted' ? 75 : 50) : 25,
        payment: formatDZD(Number(d.proposed_bid || 0)),
        deadline: new Date(d.deals?.application_deadline || Date.now()).toLocaleDateString(),
        logo: d.deals?.profiles?.logo_url || "https://upload.wikimedia.org/wikipedia/commons/4/43/Sephora_logo.svg",
        link: `/deals/${d.deal_id}`
      };

      if (d.status === 'pending') {
        pending.push({...workItem, status: 'En attente d\'approbation'});
      } else if (d.status === 'declined') {
        rejected.push({...workItem, status: 'Refusé'});
      } else if (d.status === 'withdrawn') {
        rejected.push({...workItem, status: 'Retiré'});
      } else if (d.status === 'approved') {
        if (!sub) {
          active.push({...workItem, status: 'Création de contenu'});
        } else if (sub.status === 'submitted' || sub.status === 'edits_requested') {
          pending.push({...workItem, status: 'En cours de révision'});
        } else if (sub.status === 'accepted') {
          completed.push({...workItem, status: 'Terminé'});
        } else if (sub.status === 'declined') {
          rejected.push({...workItem, status: 'Soumission refusée'});
        }
      }
    });

    return { activeWork: active, pendingWork: pending, completedWork: completed, rejectedWork: rejected };
  }, [applications]);

  const tabs = [
    { id: 'active', label: 'Actif', icon: FolderOpen, count: activeWork.length },
    { id: 'pending', label: 'En attente', icon: Clock, count: pendingWork.length },
    { id: 'completed', label: 'Terminé', icon: CheckCircle2, count: completedWork.length },
    { id: 'rejected', label: 'Rejeté', icon: XCircle, count: rejectedWork.length },
  ] as const;

  const renderWorkList = (list: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {list.map((work) => (
        <div key={work.id} className="bg-white/90 shadow-card hover:shadow-soft border border-border/40 rounded-3xl p-6 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center shadow-sm border border-border/40 overflow-hidden">
                <Image src={work.logo} alt={work.brand} width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-heading text-[16px] font-bold text-foreground">{work.title}</h3>
                <p className="text-muted-foreground text-[12px]">{work.brand}</p>
              </div>
            </div>
            <span className={cn(
              "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5",
              work.type === 'contest' 
                ? "bg-vybe/10 text-vybe-dark border border-vybe/20" 
                : "bg-vybe-glow/10 text-vybe-dark border border-vybe-glow/20"
            )}>
              {work.type === 'contest' ? <Trophy className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
              {work.type}
            </span>
          </div>

          {work.type === 'contest' ? (
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/20 rounded-2xl border border-border/40">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground/70 font-bold mb-1">Rang</p>
                <p className="text-[16px] font-bold text-foreground flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-vybe-pink" />
                  {work.currentRank}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground/70 font-bold mb-1">Vues</p>
                <p className="text-[16px] font-bold text-foreground flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  {work.views}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground/70 font-bold mb-1">J'aime</p>
                <p className="text-[16px] font-bold text-foreground flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-vybe" />
                  {work.likes}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-muted-foreground font-semibold">Progression</span>
                <span className="text-foreground font-bold">{work.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-vybe-glow to-vybe rounded-full shadow-[0_0_8px_oklch(0.72_0.14_300_/_0.4)]"
                  style={{ width: `${work.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-4 p-4 bg-muted/20 rounded-2xl border border-border/40">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/70 font-bold mb-1">Paiement</p>
                  <p className="text-[14px] font-bold text-success-foreground">{work.payment}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/70 font-bold mb-1">Date limite</p>
                  <p className="text-[14px] font-bold text-foreground">{work.deadline}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-auto">
            <span className="text-[12px] font-semibold text-muted-foreground">{work.status}</span>
            <Link href={work.link}>
              <Button variant="outline" className="h-9 px-4 rounded-xl text-[12px] gap-1.5 hover:bg-vybe/5">
                {work.type === 'contest' ? 'Voir les stats' : 'Détails'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        {/* Header Skeleton */}
        <div>
          <div className="h-3 w-24 bg-muted rounded-full mb-3" />
          <div className="h-8 w-48 bg-muted rounded-full mb-3" />
          <div className="h-4 w-64 bg-muted/60 rounded-full" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 border-b border-border/40 pb-px">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-32 bg-muted/50 rounded-t-xl" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/50 border border-border/40 rounded-3xl p-6 min-h-[250px] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted" />
                  <div>
                    <div className="h-5 w-32 bg-muted rounded-full mb-2" />
                    <div className="h-3 w-20 bg-muted/60 rounded-full" />
                  </div>
                </div>
                <div className="w-16 h-6 rounded-md bg-muted" />
              </div>
              <div className="flex-1">
                <div className="h-2 w-full bg-muted rounded-full mb-4" />
                <div className="h-2 w-3/4 bg-muted/60 rounded-full" />
              </div>
              <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-auto">
                <div className="h-4 w-24 bg-muted rounded-full" />
                <div className="h-9 w-24 bg-muted rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentList = 
    activeTab === 'active' ? activeWork :
    activeTab === 'pending' ? pendingWork :
    activeTab === 'completed' ? completedWork :
    rejectedWork;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Espace de travail</p>
        <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">
          Mon travail
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground max-w-xl">
          Gérez vos campagnes actives, suivez vos soumissions et consultez vos travaux antérieurs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-[13px] font-semibold border-b-2 transition-all relative -mb-px",
              activeTab === tab.id
                ? "border-vybe text-vybe-dark"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/40"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={cn(
              "ml-1.5 px-2 py-0.5 rounded-full text-[10px]",
              activeTab === tab.id
                ? "bg-vybe/10 text-vybe-dark"
                : "bg-muted text-muted-foreground"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {currentList.length > 0 ? renderWorkList(currentList) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/90 rounded-3xl border border-border/40 border-dashed shadow-sm">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-5">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">Aucune campagne trouvée</h3>
            <p className="text-muted-foreground text-[13px] max-w-sm mb-6">
              Vous n'avez aucune campagne dans cette catégorie pour le moment. Parcourez les opportunités pour trouver votre prochaine collaboration.
            </p>
            <Link href="/creators_side/browse">
              <Button className="h-10 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-6 text-[13px] text-white shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.5)]">
                Parcourir les opportunités
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
