"use client";

import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function EarningsPage() {
  const [timeframe, setTimeframe] = useState<'this_month' | 'last_month' | 'this_year'>('this_month');

  const stats = [
    {
      label: "Solde disponible",
      value: "0.00 DZD",
      subtext: "Prêt à être retiré",
      icon: DollarSign,
      color: "from-[oklch(0.92_0.06_280)] to-[oklch(0.96_0.04_320)]",
      iconColor: "text-vybe-dark"
    },
    {
      label: "En attente de validation",
      value: "0.00 DZD",
      subtext: "De 0 campagnes récentes",
      icon: Clock,
      color: "from-[oklch(0.93_0.05_340)] to-[oklch(0.96_0.04_290)]",
      iconColor: "text-vybe-dark"
    },
    {
      label: "Total gagné",
      value: "0.00 DZD",
      subtext: "Gains à vie",
      icon: TrendingUp,
      color: "from-[oklch(0.92_0.06_300)] to-[oklch(0.96_0.04_330)]",
      iconColor: "text-vybe-dark"
    }
  ];

  const transactions: any[] = [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Finances</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">
            Revenus
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Suivez vos revenus, consultez l'historique des transactions et gérez les retraits.
          </p>
        </div>
        <Button className="h-10 gap-2 rounded-full bg-gradient-to-br from-success to-emerald-600 px-6 text-[13px] text-white shadow-[0_8px_24px_-8px_oklch(0.58_0.16_155_/_0.5)] transition-all">
          <Download className="w-3.5 h-3.5" /> Retirer des fonds
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft">
            <div className={cn("pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90", stat.color)} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
                  <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                </div>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">{stat.label}</p>
              <h2 className="font-heading mt-1 text-[28px] font-bold tracking-tight text-foreground">{stat.value}</h2>
              <p className="mt-3 text-[12px] font-semibold text-muted-foreground">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Area placeholder */}
        <div className="lg:col-span-2 bg-white/90 shadow-card border border-border/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-lg font-bold text-foreground">Aperçu des revenus</h2>
            <div className="flex bg-muted/30 p-1 rounded-xl border border-border/40">
              {['this_month', 'last_month', 'this_year'].map((t) => {
                const labels: Record<string, string> = { 'this_month': 'Ce mois', 'last_month': 'Mois dernier', 'this_year': 'Cette année' };
                return (
                <button
                  key={t}
                  onClick={() => setTimeframe(t as any)}
                  className={cn(
                    "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all",
                    timeframe === t
                      ? "bg-white text-vybe-dark shadow-sm border border-border/40"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {labels[t]}
                </button>
              )})}
            </div>
          </div>
          
          <div className="h-[300px] flex items-center justify-center border border-border/40 bg-muted/20 rounded-2xl border-dashed">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground text-[13px] font-medium">Visualisation du graphique des revenus</p>
            </div>
          </div>
        </div>

        {/* Withdrawal Methods */}
        <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-6 flex flex-col">
          <h2 className="font-heading text-lg font-bold text-foreground mb-6">Méthodes de paiement</h2>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-2xl border border-vybe/30 bg-vybe/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-border/40 flex items-center justify-center">
                  <span className="text-[#635BFF] font-black text-lg">S</span>
                </div>
                <div>
                  <p className="text-foreground font-bold text-[13px]">Stripe Connect</p>
                  <p className="text-muted-foreground text-[11px] font-medium mt-0.5">•••• 4242</p>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-vybe-dark bg-vybe/10 px-2 py-1.5 rounded-md border border-vybe/20">Par défaut</span>
            </div>

            <div className="p-4 rounded-2xl border border-border/40 bg-muted/20 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm border border-border/40 rounded-xl flex items-center justify-center">
                  <span className="text-emerald-500 font-bold text-[11px]">CH</span>
                </div>
                <div>
                  <p className="text-foreground font-bold text-[13px]">Chargily Pay</p>
                  <p className="text-muted-foreground text-[11px] font-medium mt-0.5">Non connecté</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-vybe-dark">Connecter</button>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border/40">
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              Les paiements sont traités automatiquement le 1er et le 15 de chaque mois pour les fonds validés.
            </p>
          </div>
        </div>

      </div>

      {/* Transaction History */}
      <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">Historique des transactions</h2>
          <button className="text-[12px] font-bold text-vybe-dark hover:text-vybe uppercase tracking-wider">Tout voir</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold">
                <th className="px-6 py-4 border-b border-border/40">ID de transaction</th>
                <th className="px-6 py-4 border-b border-border/40">Date</th>
                <th className="px-6 py-4 border-b border-border/40">Description</th>
                <th className="px-6 py-4 border-b border-border/40">Type</th>
                <th className="px-6 py-4 border-b border-border/40">Montant</th>
                <th className="px-6 py-4 border-b border-border/40">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-vybe/[0.02] transition-colors">
                  <td className="px-6 py-5 text-muted-foreground font-mono text-[11px] font-semibold">{trx.id}</td>
                  <td className="px-6 py-5 text-muted-foreground text-[12px] font-medium">{trx.date}</td>
                  <td className="px-6 py-5">
                    <p className="text-foreground font-bold text-[13px] mb-0.5">{trx.campaign}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{trx.brand}</p>
                  </td>
                  <td className="px-6 py-5 text-muted-foreground text-[12px] font-medium">{trx.type}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "font-bold text-[13px] flex items-center gap-1",
                      trx.amount.startsWith('+') ? "text-success-foreground" : "text-foreground"
                    )}>
                      {trx.amount.startsWith('+') ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3 text-muted-foreground" />}
                      {trx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 w-fit border",
                      trx.status === 'Completed' 
                        ? "bg-success/10 text-success-foreground border-success/20" 
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    )}>
                      {trx.status === 'Terminé' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
