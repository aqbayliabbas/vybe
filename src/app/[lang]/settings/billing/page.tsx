"use client";

import { Button } from '@/components/ui/button';
import { CreditCard, Download, Sparkles } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import Link from 'next/link';
import { toast } from 'sonner';

const invoices: any[] = [];

export default function SettingsBillingPage() {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">Facturation & Reçus</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Gérez votre abonnement, vos méthodes de paiement et vos relevés de facturation.</p>
        </div>
        <Link href="/upgrade">
          <Button className="h-9 gap-1.5 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-4 text-[12px] text-white shadow-soft font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Mettre à niveau
          </Button>
        </Link>
      </div>

      {/* Grid of Subscription details */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Forfait actuel</p>
          <p className="font-heading mt-1.5 text-[20px] font-bold text-foreground">Forfait Croissance</p>
          <p className="mt-1 text-[11px] text-muted-foreground">12,000 DZD · Facturé mensuellement</p>
        </div>
        <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Concours / Offres</p>
          <p className="font-heading mt-1.5 text-[20px] font-bold text-foreground">Illimité / Actif</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Campagnes & recrutements illimités</p>
        </div>
        <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Prochaine facture</p>
          <p className="font-heading mt-1.5 text-[20px] font-bold text-foreground">12,000 DZD</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Échéance 1er Juin 2026</p>
        </div>
      </div>

      {/* Saved payment cards */}
      <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Moyen de paiement</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">Facturé pour les renouvellements d'abonnement et les garanties de campagnes individuelles.</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full text-[11px]">Mettre à jour</Button>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border/45 bg-white p-3.5">
          <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 shrink-0">
            <CreditCard className="h-5 w-5 text-vybe-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-foreground">Visa se terminant par 4242</p>
            <p className="text-[10px] text-muted-foreground">Expire le 09/28 · Ahmed Belkacem</p>
          </div>
          <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[9px] font-bold text-success">Par défaut</span>
        </div>
      </div>

      {/* Invoice list */}
      <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/30">
          <h4 className="font-heading text-sm font-semibold text-foreground">Historique de facturation</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">Téléchargez les reçus pour vos audits comptables.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {['N° de facture', 'Date', 'Montant', 'Statut', ''].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={inv.id} className={`border-b border-border/30 hover:bg-vybe/[0.02] transition-colors ${idx === invoices.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-3.5 text-[12px] font-semibold text-foreground">{inv.id}</td>
                  <td className="px-5 py-3.5 text-[12px] text-muted-foreground">{inv.date}</td>
                  <td className="px-5 py-3.5 text-[12px] font-medium text-foreground">{inv.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toast.success(`Téléchargement du PDF de la facture ${inv.id} démarré`)}
                      className="rounded-full h-8 text-[11px] text-vybe-dark hover:bg-vybe/10 gap-1"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
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
