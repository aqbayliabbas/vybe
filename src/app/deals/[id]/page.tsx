"use client";

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { db, Campaign, Submission } from '@/lib/db';
import { formatNumber, formatDZD } from '@/lib/mock-data';
import { ArrowLeft, Search, Check, X, ChevronRight, Users, Eye, DollarSign, Handshake, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'applications' | 'approved';

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<Campaign | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('applications');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');

  const loadDealData = async () => {
    try {
      const d = await db.getCampaignById(params.id);
      if (d) {
        setDeal(d);
        const subs = await db.getSubmissions(params.id);
        setSubmissions(subs);
      }
    } catch (e) {
      console.error("Failed to load deal detail page data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealData();
  }, [params.id]);

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (query && !`${s.creator} ${s.handle}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [submissions, statusFilter, query]);

  const pending = useMemo(() => submissions.filter(s => s.status === 'pending'), [submissions]);
  const approved = useMemo(() => submissions.filter(s => s.status === 'approved'), [submissions]);

  const handleApprove = async (subId: string, creatorName: string) => {
    try {
      const ok = await db.updateSubmissionStatus(subId, 'approved');
      if (ok) {
        toast.success(`${creatorName} approved!`);
        loadDealData(); // reload
      } else {
        toast.error("Failed to approve submission.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    }
  };

  const handleDecline = async (subId: string, creatorName: string) => {
    try {
      const ok = await db.updateSubmissionStatus(subId, 'declined');
      if (ok) {
        toast.info(`${creatorName} declined.`);
        loadDealData(); // reload
      } else {
        toast.error("Failed to decline submission.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-vybe" />
        <p className="text-xs">Loading deal details...</p>
      </div>
    </DashboardLayout>
  );

  if (!deal) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Handshake className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-foreground font-medium">Deal not found</p>
        <Link href="/deals"><Button variant="outline" className="rounded-full gap-2"><ArrowLeft className="h-4 w-4" />Back to Deals</Button></Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/deals" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> All Deals
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-foreground">{deal.name}</h1>
              <StatusBadge status="deal" />
              <StatusBadge status={deal.status} />
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">{deal.brand} · {deal.budget} · {deal.platforms.join(', ')}</p>
          </div>
          <Link href="/deals/new">
            <Button variant="outline" size="sm" className="rounded-full glass border-border/60 text-[12px]">Edit Deal</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-3 md:grid-cols-4">
        {[
          { icon: Users, label: 'Applications', value: submissions.length.toString() },
          { icon: Check, label: 'Approved', value: approved.length.toString() },
          { icon: Eye, label: 'Total Views', value: formatNumber(submissions.reduce((s, x) => s + x.views, 0)) },
          { icon: DollarSign, label: 'Avg Bid', value: submissions.length ? formatDZD(Math.round(submissions.reduce((s, x) => s + x.bid, 0) / submissions.length)) : formatDZD(0) },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-white/90 p-4 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 shrink-0">
              <s.icon className="h-4 w-4 text-vybe-dark/70" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
              <p className="font-heading text-[18px] font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 border-b border-border/40">
        {([
          { key: 'applications', label: `Applications (${pending.length} pending)` },
          { key: 'approved', label: `Approved (${approved.length})` },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-[13px] font-medium transition-colors border-b-2 -mb-px ${tab === t.key ? 'border-vybe text-vybe-dark' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}

        {/* Search */}
        <div className="ml-auto pb-2 relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search creators…"
            className="h-9 w-48 rounded-full border border-border/60 bg-white/70 pl-8 pr-4 text-[12px] outline-none placeholder:text-muted-foreground/50 focus:border-vybe/40" />
        </div>
      </div>

      {/* Applications tab */}
      {tab === 'applications' && (
        <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card">
          <div className="flex items-center gap-1.5 px-6 py-4 border-b border-border/30">
            {(['all', 'pending', 'approved', 'declined'] as const).map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${statusFilter === f ? 'bg-vybe/10 text-vybe-dark' : 'text-muted-foreground hover:bg-muted/70'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="divide-y divide-border/30">
            {filtered.map(s => (
              <div key={s.id} className="flex flex-wrap items-center gap-4 px-6 py-5 hover:bg-vybe/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/20 to-vybe-glow/10 text-[13px] font-bold text-vybe-dark">{s.creator[0]}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold text-foreground truncate">{s.creator}</p>
                      {s.verified && <span className="shrink-0 rounded-full bg-success/10 border border-success/20 px-2 py-0.5 text-[10px] font-semibold text-success">✓ Phyllo</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{s.handle} · {s.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-[12px]">
                  <div className="text-center"><p className="font-semibold text-foreground">{formatNumber(s.followers)}</p><p className="text-muted-foreground">followers</p></div>
                  <div className="text-center"><p className="font-semibold text-foreground">{formatNumber(s.avgViews)}</p><p className="text-muted-foreground">avg views</p></div>
                  <div className="text-center"><p className="font-semibold text-foreground">{s.engagement}%</p><p className="text-muted-foreground">engagement</p></div>
                  <div className="text-center"><p className="font-semibold text-vybe-dark">{formatDZD(s.bid)}</p><p className="text-muted-foreground">bid</p></div>
                </div>
                <StatusBadge status={s.status} />
                <div className="flex items-center gap-2 shrink-0">
                  {s.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(s.id, s.creator)} className="h-8 rounded-full px-3 text-[12px] gap-1 bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-card">
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDecline(s.id, s.creator)} className="h-8 rounded-full px-3 text-[12px] gap-1 border-destructive/30 text-destructive hover:bg-destructive/5">
                        <X className="h-3.5 w-3.5" /> Decline
                      </Button>
                    </>
                  )}
                  <Link href={`/deals/${params.id}/submission/${s.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[12px] text-vybe-dark hover:bg-vybe/10 gap-1">
                      Review <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
                <p className="text-[13px] font-medium text-foreground">No applications yet</p>
                <p className="text-[12px] text-muted-foreground">Creators matching your targeting will find and apply to this deal.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approved tab */}
      {tab === 'approved' && (
        <div className="rounded-3xl border border-border/40 bg-white/90 shadow-card">
          <div className="divide-y divide-border/30">
            {approved.map(s => (
              <div key={s.id} className="flex flex-wrap items-center gap-4 px-6 py-5 hover:bg-vybe/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/20 to-vybe-glow/10 text-[13px] font-bold text-vybe-dark">{s.creator[0]}</div>
                  <div><p className="text-[13px] font-semibold text-foreground">{s.creator}</p><p className="text-[11px] text-muted-foreground">{s.handle} · {s.platform}</p></div>
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="rounded-full bg-success/10 border border-success/20 px-3 py-1 font-medium text-success">Approved</span>
                  <span className="text-muted-foreground">Awaiting submission</span>
                </div>
                <Link href={`/deals/${params.id}/submission/${s.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[12px] text-vybe-dark hover:bg-vybe/10 gap-1">
                    View <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
            {approved.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Check className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
                <p className="text-[13px] font-medium text-foreground">No approved creators yet</p>
                <p className="text-[12px] text-muted-foreground">Approve applications in the Applications tab.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
