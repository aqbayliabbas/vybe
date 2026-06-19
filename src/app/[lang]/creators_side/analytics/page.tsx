"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart,
  MessageCircle,
  Share2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const topPerformers: any[] = [];

  const overallStats = [
    { label: "Audience totale", value: "0", change: "0%", isPositive: true, icon: Users, color: "from-[oklch(0.92_0.06_300)] to-[oklch(0.96_0.04_330)]" },
    { label: "Engagement moyen", value: "0%", change: "0%", isPositive: true, icon: Heart, color: "from-[oklch(0.93_0.05_330)] to-[oklch(0.96_0.04_300)]" },
    { label: "Vues totales", value: "0", change: "0%", isPositive: true, icon: Eye, color: "from-[oklch(0.92_0.06_280)] to-[oklch(0.96_0.04_320)]" },
    { label: "Taux de conversion", value: "0%", change: "0%", isPositive: false, icon: TrendingUp, color: "from-[oklch(0.93_0.05_340)] to-[oklch(0.96_0.04_290)]" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Performance</p>
        <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">
          Analyses
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Plongez dans vos mesures de performance et les informations sur votre audience.
        </p>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overallStats.map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft">
            <div className={cn("pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90", stat.color)} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
                  <stat.icon className="h-4 w-4 text-vybe-dark" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border",
                  stat.isPositive ? "text-success-foreground bg-success/10 border-success/20" : "text-destructive bg-destructive/10 border-destructive/20"
                )}>
                  {stat.isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">{stat.label}</p>
              <h3 className="font-heading mt-1 text-[28px] font-bold tracking-tight text-foreground">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">Croissance de l'audience</h2>
                <p className="text-[12px] font-medium text-muted-foreground">Abonnés sur toutes les plateformes</p>
              </div>
              <select className="bg-muted/30 border border-border/40 text-[12px] font-bold text-muted-foreground rounded-lg px-3 py-2 outline-none focus:border-vybe/40">
                <option>30 derniers jours</option>
                <option>90 derniers jours</option>
                <option>Cette année</option>
              </select>
            </div>
            
            <div className="h-[250px] flex items-center justify-center border border-border/40 bg-muted/20 rounded-2xl border-dashed">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground text-[13px] font-medium">Visualisation du graphique de croissance</p>
              </div>
            </div>
          </div>

          {/* Platform Breakdown */}
          <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-6">Performances de la plateforme</h2>
            <div className="space-y-6">
              
              {/* TikTok */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe]" />
                    <span className="text-[13px] font-bold text-foreground">TikTok</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground">0</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] rounded-full shadow-[0_0_8px_rgba(0,242,254,0.4)]" style={{ width: '0%' }} />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f09433]" />
                    <span className="text-[13px] font-bold text-foreground">Instagram</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground">0</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-full shadow-[0_0_8px_rgba(240,148,51,0.4)]" style={{ width: '0%' }} />
                </div>
              </div>

              {/* YouTube */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff0000]" />
                    <span className="text-[13px] font-bold text-foreground">YouTube</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground">0</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] rounded-full shadow-[0_0_8px_rgba(255,0,0,0.4)]" style={{ width: '0%' }} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Top Campaigns List */}
        <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border/40">
            <h2 className="font-heading text-lg font-bold text-foreground">Meilleures campagnes</h2>
            <p className="text-[12px] font-medium text-muted-foreground mt-1">Basé sur le taux d'engagement</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {topPerformers.map((campaign, i) => (
              <div key={campaign.id} className={cn(
                "p-6 flex items-start gap-4 hover:bg-vybe/[0.02] transition-colors",
                i !== topPerformers.length - 1 ? "border-b border-border/40" : ""
              )}>
                <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 border border-border/40 shadow-sm">
                  <Image src={campaign.image} alt={campaign.brand} width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-[15px] font-bold text-foreground truncate mb-0.5">{campaign.campaign}</h3>
                  <p className="text-muted-foreground text-[12px] font-medium">{campaign.brand} • {campaign.platform}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-muted/20 rounded-xl p-2 border border-border/40 text-center">
                      <p className="text-[9px] text-muted-foreground/70 font-bold uppercase tracking-wider mb-1">Vues</p>
                      <p className="text-[13px] font-bold text-foreground">{campaign.views}</p>
                    </div>
                    <div className="bg-success/5 rounded-xl p-2 border border-success/20 text-center">
                      <p className="text-[9px] text-success-foreground font-bold uppercase tracking-wider mb-1">Engag.</p>
                      <p className="text-[13px] font-bold text-success-foreground">{campaign.engagement}</p>
                    </div>
                    <div className="bg-vybe/5 rounded-xl p-2 border border-vybe/20 text-center">
                      <p className="text-[9px] text-vybe-dark font-bold uppercase tracking-wider mb-1">Gagné</p>
                      <p className="text-[13px] font-bold text-vybe-dark">{campaign.earnings}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border/40 bg-muted/10">
            <Button variant="ghost" className="w-full text-[12px] font-bold text-muted-foreground hover:text-foreground">
              Voir le portfolio complet
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
