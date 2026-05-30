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
          <h3 className="font-heading text-lg font-bold text-foreground">Billing & Invoices</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Manage your workspace subscription plan, payment methods, and billing records.</p>
        </div>
        <Link href="/upgrade">
          <Button className="h-9 gap-1.5 rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-4 text-[12px] text-white shadow-soft font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Upgrade Plan
          </Button>
        </Link>
      </div>

      {/* Grid of Subscription details */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Current Plan</p>
          <p className="font-heading mt-1.5 text-[20px] font-bold text-foreground">Growth Plan</p>
          <p className="mt-1 text-[11px] text-muted-foreground">12,000 DZD · Billed monthly</p>
        </div>
        <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Contests / Deals</p>
          <p className="font-heading mt-1.5 text-[20px] font-bold text-foreground">Unlimited / Active</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Unlimited campaigns & hires</p>
        </div>
        <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Next Invoice</p>
          <p className="font-heading mt-1.5 text-[20px] font-bold text-foreground">12,000 DZD</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Due Jun 1, 2026</p>
        </div>
      </div>

      {/* Saved payment cards */}
      <div className="rounded-3xl border border-border/40 bg-white/90 p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Payment Method</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">Charged for subscription renewals and individual campaign escrows.</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full text-[11px]">Update</Button>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border/45 bg-white p-3.5">
          <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 shrink-0">
            <CreditCard className="h-5 w-5 text-vybe-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-foreground">Visa ending in 4242</p>
            <p className="text-[10px] text-muted-foreground">Expires 09/28 · Ahmed Belkacem</p>
          </div>
          <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[9px] font-bold text-success">Default</span>
        </div>
      </div>

      {/* Invoice list */}
      <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/30">
          <h4 className="font-heading text-sm font-semibold text-foreground">Invoice History</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">Download receipts for workspace accounting audits.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {['Invoice ID', 'Date', 'Amount', 'Status', ''].map(h => (
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
                      onClick={() => toast.success(`Invoice ${inv.id} PDF download started`)}
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
