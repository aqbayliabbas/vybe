"use client";

import { useMemo, useState, use } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BadgeCheck, 
  MapPin, 
  Bookmark, 
  Send,
  Eye, 
  Heart, 
  Info,
  Tv,
  Camera,
  PlaySquare,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { CREATORS } from '@/lib/db';

const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString('en-US');
};



// Mock Top Videos (Phyllo Synced)
const mockTopVideos: any[] = [];

// Mock Collabs
const mockCollabs: any[] = [];

export default function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const creator = useMemo(() => {
    return CREATORS.find(c => c.id === id);
  }, [id]);

  if (!creator) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-medium">Profil de créateur non trouvé</p>
          <Link href="/creators">
            <Button variant="outline" className="rounded-full gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour à l'annuaire
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSaveToList = () => {
    toast.success("Ajouté à la liste sauvegardée", {
      description: `${creator.name} a été ajouté à 'Algerian Launch Creators'.`,
    });
  };

  const handleInviteToDeal = () => {
    toast.success("Invitation envoyée", {
      description: `Invitation à la campagne Pepsi Summer Refresh envoyée à ${creator.name}.`,
    });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <Link href="/creators" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à l'annuaire
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-vybe/25 to-vybe-glow/15 text-2xl font-bold text-vybe-dark shrink-0">
              {creator.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl font-bold text-foreground">{creator.name}</h1>
                {creator.verified && (
                  <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-success/15 border border-success/30 px-2 py-0.5 text-[10px] font-semibold text-success">
                    <BadgeCheck className="h-3.5 w-3.5" /> Vérifié par Phyllo
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <span>{creator.handle}</span> · 
                <span className="flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5 shrink-0" /> {creator.location} {creator.flag}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveToList} className="rounded-full gap-1.5 border-border/60 text-[12px]">
              <Bookmark className="h-3.5 w-3.5" /> Enregistrer dans la liste
            </Button>
            <Button onClick={handleInviteToDeal} className="rounded-full gap-1.5 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-soft text-[12px]">
              <Send className="h-3.5 w-3.5" /> Inviter à l'offre
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          {/* Bio & Details */}
          <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card space-y-4">
            <div>
              <h3 className="font-heading text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">À propos du créateur</h3>
              <p className="text-[13px] text-foreground mt-2 leading-relaxed font-light">{creator.bio}</p>
            </div>

            <div className="border-t border-border/30 pt-4 space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Plateforme principale</p>
                <p className="text-[13px] text-foreground font-medium mt-0.5">{creator.platform}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Niche</p>
                <p className="text-[13px] text-foreground font-medium mt-0.5">{creator.niche}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Langues du contenu</p>
                <p className="text-[13px] text-foreground font-medium mt-0.5">{creator.lang}</p>
              </div>
            </div>
          </div>

          {/* Social accounts sync summary */}
          <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card space-y-3">
            <h3 className="font-heading text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Profils connectés</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-muted/40 p-2.5">
                <span className="text-[12px] font-semibold text-foreground flex items-center gap-1.5 capitalize">
                  <Tv className="h-3.5 w-3.5 text-black shrink-0" /> {creator.platform}
                </span>
                <span className="text-[10px] bg-success/15 text-success rounded-full px-2 py-0.5 font-bold">Vérifié</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-2.5 text-muted-foreground/60 border border-dashed border-border/60">
                <span className="text-[12px] font-medium flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 shrink-0" /> Instagram
                </span>
                <span className="text-[9px] uppercase tracking-wider">Non connecté</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-2.5 text-muted-foreground/60 border border-dashed border-border/60">
                <span className="text-[12px] font-medium flex items-center gap-1.5">
                  <PlaySquare className="h-3.5 w-3.5 shrink-0" /> YouTube
                </span>
                <span className="text-[9px] uppercase tracking-wider">Non connecté</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Videos Grid */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
            <h3 className="font-heading text-[16px] font-semibold text-foreground mb-4">Analyses sociales vérifiables</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Abonnés', value: fmt(creator.followers) },
                { label: 'Vues moy.', value: fmt(creator.avgViews) },
                { label: 'Engagement', value: `${creator.engagement}%` },
                { label: 'Portée est.', value: fmt(creator.followers * 0.7) },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl bg-muted/30 p-4 border border-border/20 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="font-heading text-[20px] font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top videos grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-[16px] font-semibold text-foreground">Contenu le plus performant</h3>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Suivi via l'API Phyllo</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {mockTopVideos.map(video => (
                <div key={video.id} className="relative overflow-hidden rounded-3xl border border-border/40 bg-zinc-950 aspect-[9/16] shadow-card group">
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/90 via-black/30 to-black/70">
                    {/* Video stats */}
                    <div className="space-y-1.5 relative z-10">
                      <p className="text-[12px] font-semibold line-clamp-2">{video.title}</p>
                      
                      <div className="pt-2 border-t border-white/20 flex flex-col gap-1 text-[11px] text-zinc-300">
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-vybe-glow shrink-0" /> {fmt(video.views)} vues</span>
                        <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-500 shrink-0" /> {fmt(video.likes)} j'aime</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past collaborations */}
          <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card overflow-hidden">
            <div className="px-6 py-5 border-b border-border/30">
              <h3 className="font-heading text-[16px] font-semibold text-foreground">Historique des collaborations Vybe</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Campagnes terminées sur cette plateforme.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    {['Marque', 'Type', 'Date', 'Vues générées', 'Paiement', 'Statut'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockCollabs.map((collab, i) => (
                    <tr key={i} className={`border-b border-border/30 hover:bg-vybe/[0.02] transition-colors ${i === mockCollabs.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-6 py-4 text-[13px] font-semibold text-foreground">{collab.brand}</td>
                      <td className="px-6 py-4 text-[12px]"><span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${collab.type === 'Offre' ? 'bg-vybe/10 text-vybe-dark' : 'bg-vybe-glow/15 text-vybe-dark'}`}>{collab.type}</span></td>
                      <td className="px-6 py-4 text-[12px] text-muted-foreground">{collab.date}</td>
                      <td className="px-6 py-4 text-[12px] font-semibold text-foreground">{fmt(collab.views)}</td>
                      <td className="px-6 py-4 text-[12px] text-muted-foreground">{collab.budget}</td>
                      <td className="px-6 py-4 text-[12px]"><span className="text-success font-semibold flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Payé</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
