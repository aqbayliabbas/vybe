"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, Filter, Trophy, Handshake, Users, Calendar, DollarSign, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { db, Campaign } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import Link from "next/link";
import { ApplyDealModal } from '@/components/ApplyDealModal';

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'contests'>('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const data = await db.getCampaigns();
        // Hide contests for now as requested
        setCampaigns(data.filter(c => c.status === 'live' && c.type !== 'contest')); // only show live deals to creators
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCampaigns();

    // Listen to real-time changes
    const channel = supabase.channel('browse_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contests' }, () => { loadCampaigns(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, () => { loadCampaigns(); })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredOpportunities = useMemo(() => {
    return campaigns.filter(opp => {
      if (activeTab === 'contests' && opp.type !== 'contest') return false;
      if (activeTab === 'deals' && opp.type !== 'deal') return false;
      
      if (query && !`${opp.name} ${opp.brand}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [campaigns, activeTab, query]);

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Opportunités</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">
            Découvrir des campagnes
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground max-w-xl">
            Trouvez et postulez aux meilleures campagnes de marque. Filtrez par plateforme, récompense et catégorie pour trouver votre correspondance parfaite.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input 
              type="text" 
              placeholder="Recherchez des campagnes, des marques ou des mots-clés..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-full border border-border/60 bg-white/70 pl-11 pr-4 text-[13px] outline-none placeholder:text-muted-foreground/50 focus:border-vybe/40 focus:bg-white shadow-sm transition-all"
            />
          </div>
          <Button variant="outline" className="h-11 gap-2 rounded-full border-border/60 bg-white/70 px-6 text-[13px] hover:bg-white shadow-sm shrink-0">
            <Filter className="w-4 h-4" /> Filtres
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-8 px-8 md:mx-0 md:px-0 scrollbar-hide">
          {['Plateforme', 'Pays', 'Langue', 'Catégorie', 'Récompense', 'Abonnés requis'].map((filter) => (
            <button 
              key={filter}
              className="h-8 px-4 rounded-full border border-border/40 bg-white/60 hover:bg-white text-[12px] font-medium text-muted-foreground whitespace-nowrap transition-colors shadow-sm"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/40">
        <button 
          onClick={() => setActiveTab('all')}
          className={cn(
            "px-6 py-4 text-[13px] font-semibold border-b-2 transition-colors",
            activeTab === 'all' 
              ? "border-vybe text-vybe-dark" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Toutes les opportunités
        </button>

        <button 
          onClick={() => setActiveTab('deals')}
          className={cn(
            "px-6 py-4 text-[13px] font-semibold border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'deals' 
              ? "border-vybe-glow text-vybe-dark" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Handshake className="w-4 h-4" />
          Offres
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col bg-white/50 border border-border/40 rounded-3xl overflow-hidden min-h-[320px]">
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-xl bg-muted" />
                  <div className="w-16 h-6 rounded-md bg-muted" />
                </div>
                <div className="h-5 w-48 bg-muted rounded-full mb-2" />
                <div className="h-4 w-24 bg-muted/60 rounded-full" />
              </div>
              <div className="px-6 py-5 bg-muted/10 border-y border-border/40 grid grid-cols-2 gap-y-4 gap-x-2">
                {[1, 2, 3, 4].map(j => (
                  <div key={j}>
                    <div className="h-2 w-16 bg-muted/60 rounded-full mb-2" />
                    <div className="h-4 w-24 bg-muted rounded-full" />
                  </div>
                ))}
              </div>
              <div className="p-5 mt-auto flex gap-3">
                <div className="flex-1 h-10 bg-muted rounded-xl" />
                <div className="w-20 h-10 bg-muted rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-5">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">Aucune campagne trouvée</h3>
          <p className="text-muted-foreground text-[13px] max-w-sm mb-6">
            Essayez d'ajuster votre recherche ou vos filtres pour trouver plus d'opportunités.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <div 
              key={opp.id}
              className="group flex flex-col bg-white/90 border border-border/40 rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 p-2 flex items-center justify-center shrink-0 border border-border/40 shadow-sm text-vybe-dark font-bold text-sm">
                    {opp.brand.substring(0, 2).toUpperCase()}
                  </div>
                  <span className={cn(
                    "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5",
                    opp.type === 'contest' 
                      ? "bg-vybe/10 text-vybe-dark border border-vybe/20" 
                      : "bg-vybe-glow/10 text-vybe-dark border border-vybe-glow/20"
                  )}>
                    {opp.type === 'contest' ? <Trophy className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
                    {opp.type}
                  </span>
                </div>
                
                <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-vybe-dark transition-colors">{opp.name}</h3>
                <p className="text-[13px] text-muted-foreground font-medium">{opp.brand}</p>
              </div>

              {/* Card Details */}
              <div className="px-6 py-5 bg-muted/20 border-y border-border/40 grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-1.5">Récompense</p>
                  <p className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-success-foreground" />
                    {opp.budget}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-1.5">
                    {opp.type === 'contest' ? 'Participants' : 'Exigences'}
                  </p>
                  <p className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    {opp.type === 'contest' ? opp.submissions : (opp.niches[0] || 'Toute niche')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-1.5">Date limite</p>
                  <p className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {opp.daysLeft} jours restants
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold mb-1.5">Plateforme</p>
                  <p className="text-[13px] font-semibold text-foreground">
                    {opp.platforms.length > 0 ? opp.platforms.join(", ") : "Toutes"}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 mt-auto flex gap-3 bg-white">
                {opp.type === 'contest' ? (
                  <Link href={`/contests/${opp.id}`} className="flex-1">
                    <Button className="w-full h-10 bg-gradient-to-br from-vybe to-vybe-glow text-white text-[13px] font-semibold rounded-xl shadow-[0_4px_12px_-4px_oklch(0.72_0.14_300_/_0.5)] transition-all">
                      Voir le concours
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => setSelectedDeal({ id: opp.id, name: opp.name })}
                    className="flex-1 h-10 bg-gradient-to-br from-vybe to-vybe-glow text-white text-[13px] font-semibold rounded-xl shadow-[0_4px_12px_-4px_oklch(0.72_0.14_300_/_0.5)] transition-all hover:scale-[1.02]"
                  >
                    Postuler
                  </Button>
                )}
                <Button variant="outline" className="h-10 px-4 rounded-xl text-[13px] font-semibold">
                  Enregistrer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <ApplyDealModal 
        dealId={selectedDeal?.id || ''}
        dealName={selectedDeal?.name || ''}
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
      />
    </div>
  );
}
