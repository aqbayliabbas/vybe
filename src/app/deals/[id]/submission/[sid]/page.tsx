"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { db, Campaign, Submission } from '@/lib/db';
import { formatDZD, formatNumber } from '@/lib/mock-data';
import { 
  ArrowLeft, 
  Play, 
  MessageSquare, 
  Check, 
  X, 
  Info, 
  Smartphone,
  Eye, 
  Heart, 
  Share2, 
  RotateCcw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SubmissionDetailPage({ params }: { params: { id: string; sid: string } }) {
  const router = useRouter();
  const [deal, setDeal] = useState<Campaign | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  // Review states
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');

  const maxRevisions = 2;

  const loadPageData = async () => {
    try {
      const d = await db.getCampaignById(params.id);
      if (d) {
        setDeal(d);
        const sub = await db.getSubmissionById(params.sid);
        if (sub) {
          setSubmission(sub);
        }
      }
    } catch (e) {
      console.error("Failed to load submission review details", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [params.id, params.sid]);

  const handleAccept = async () => {
    if (!submission) return;
    try {
      const ok = await db.updateSubmissionStatus(submission.id, 'approved');
      if (ok) {
        toast.success("Submission Approved!", {
          description: `Visa •••• 4242 charged ${formatDZD(submission.bid)}. Creator payout initiated.`,
        });
        loadPageData();
      } else {
        toast.error("Failed to approve submission.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    }
  };

  const handleDecline = async () => {
    if (!submission) return;
    try {
      const ok = await db.updateSubmissionStatus(submission.id, 'declined');
      if (ok) {
        toast.error("Submission Declined", {
          description: "Slot reopened. The creator has been notified.",
        });
        loadPageData();
      } else {
        toast.error("Failed to decline submission.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    }
  };

  const handleRequestEdits = async () => {
    if (!submission) return;
    if (!feedback.trim()) {
      toast.warning("Feedback required", {
        description: "Please explain what edits you would like the creator to make.",
      });
      return;
    }
    
    if (submission.revision_count >= maxRevisions) {
      toast.error("Revision Limit Reached", {
        description: `You have already used the maximum of ${maxRevisions} revisions.`,
      });
      return;
    }

    try {
      const ok = await db.updateSubmissionStatus(submission.id, 'edits', feedback.trim());
      if (ok) {
        toast.info("Edits Requested", {
          description: "Feedback has been sent to the creator.",
        });
        setFeedback('');
        loadPageData();
      } else {
        toast.error("Failed to request edits.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    }
  };

  const handleUndo = async () => {
    if (!submission) return;
    try {
      const ok = await db.updateSubmissionStatus(submission.id, 'pending');
      if (ok) {
        toast.success("Submission status reset to Pending.");
        loadPageData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-vybe" />
        <p className="text-xs">Loading submission review...</p>
      </div>
    </DashboardLayout>
  );

  if (!deal || !submission) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-foreground font-medium">Submission not found</p>
          <Link href="/deals"><Button variant="outline" className="rounded-full gap-2"><ArrowLeft className="h-4 w-4" />Back to Deals</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <Link href={`/deals/${deal.id}`} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Deal Management
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-foreground">
                Submission review — {submission.creator}
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                submission.status === 'approved' ? 'bg-success/10 text-success border border-success/25' :
                submission.status === 'declined' ? 'bg-destructive/10 text-destructive border border-destructive/25' :
                submission.status === 'edits' ? 'bg-warning/10 text-warning-foreground border border-warning/25' :
                'bg-vybe/10 text-vybe-dark border border-vybe/25'
              }`}>
                {submission.status === 'approved' ? 'Approved' : 
                 submission.status === 'declined' ? 'Declined' : 
                 submission.status === 'edits' ? 'Edits Requested' : 'Pending Review'}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Submitted for <strong className="text-foreground">{deal.name}</strong> · {submission.submitted}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left column: Video and Guidelines */}
        <div className="space-y-6">
          {/* Video Player */}
          <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-zinc-950 aspect-[9/16] max-w-[400px] mx-auto shadow-2xl group">
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-t from-black/80 via-black/40 to-black/70">
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] backdrop-blur-md">
                  <Smartphone className="h-3.5 w-3.5 text-vybe-glow" />
                  <span>{submission.platform} Draft</span>
                </div>
                
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-soft transition-transform duration-300 group-hover:scale-105 cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <Play className="ml-1 h-7 w-7 fill-white" />
                </div>
                <h4 className="font-heading text-lg font-bold">Watch Submission Draft</h4>
                <p className="mt-2 text-xs text-zinc-300 max-w-[280px]">
                  Phyllo integration has retrieved this private draft for your brand review before public publishing.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Demo Draft</span>
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> Verified Creator</span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-zinc-900">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20" onClick={() => setIsPlaying(false)}>
                  <div className="rounded-full bg-black/40 p-4 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-6 w-6 fill-white" />
                  </div>
                </div>

                <div className="relative z-10 space-y-2 pointer-events-none">
                  <p className="font-semibold text-sm">{submission.handle}</p>
                  <p className="text-xs text-zinc-200">
                    Enjoying a crisp cold Pepsi in Algiers! 🇩🇿☀️ The perfect refresher for the hot summer months. #PepsiAlgeria #SummerRefresh
                  </p>
                  <p className="text-[10px] text-zinc-400">♫ Original Audio - {submission.creator}</p>
                </div>
                
                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 text-white z-10">
                  <div className="flex flex-col items-center"><div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm"><Heart className="h-5 w-5 fill-rose-500 text-rose-500" /></div><span className="text-[10px] mt-1">45.2K</span></div>
                  <div className="flex flex-col items-center"><div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm"><MessageSquare className="h-5 w-5 fill-white text-white" /></div><span className="text-[10px] mt-1">820</span></div>
                  <div className="flex flex-col items-center"><div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm"><Share2 className="h-5 w-5 fill-white text-white" /></div><span className="text-[10px] mt-1">1.2K</span></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full w-[45%] bg-vybe shadow-[0_0_8px_oklch(0.72_0.14_300)] animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Deliverable requirements checklist */}
          <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
            <h3 className="font-heading text-[16px] font-semibold text-foreground mb-4">Deal requirements</h3>
            
            <div className="space-y-4">
              {deal.dos && deal.dos.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">DOs Check</p>
                  <ul className="space-y-2">
                    {deal.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px] text-foreground">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/10 text-success text-[10px] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {deal.donts && deal.donts.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">DONTs Check</p>
                  <ul className="space-y-2">
                    {deal.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px] text-foreground">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive text-[10px] font-bold">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Creator Info & Decision controls */}
        <div className="space-y-6">
          {/* Creator Profile Summary */}
          <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10 text-base font-bold text-vybe-dark">
                {submission.creator[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap font-semibold">
                  <h4 className="font-heading text-sm text-foreground">{submission.creator}</h4>
                  {submission.verified && (
                    <span className="rounded bg-success/15 px-1.5 py-0.5 text-[9px] text-success">Phyllo</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{submission.handle} · {submission.platform}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/30 pt-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</p>
                <p className="font-heading text-base font-bold text-foreground mt-0.5">{formatNumber(submission.followers)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Engagement</p>
                <p className="font-heading text-base font-bold text-foreground mt-0.5">{submission.engagement}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Average Views</p>
                <p className="font-heading text-base font-bold text-foreground mt-0.5">{formatNumber(submission.avgViews)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Proposed Bid</p>
                <p className="font-heading text-base font-bold text-vybe-dark mt-0.5">{formatDZD(submission.bid)}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-muted/30 p-3 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-muted-foreground/80 mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground">
                Stats pulled via Phyllo from Connected Creator Account. Updated 24h ago.
              </p>
            </div>
          </div>

          {/* Decision Center */}
          <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card space-y-4">
            <h3 className="font-heading text-base font-semibold text-foreground">Decision center</h3>
            
            {submission.status === 'pending' && (
              <div className="space-y-3">
                <Button onClick={handleAccept} className="w-full h-11 gap-2 rounded-full bg-gradient-to-br from-success/90 to-success text-white shadow-soft font-semibold text-[13px]">
                  <Check className="h-4 w-4" /> Approve & Charge Card
                </Button>
                
                <div className="rounded-2xl border border-success/15 bg-success/[0.03] p-3 text-[11px] text-success-foreground/90 flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>Pay-on-Approval:</strong> Approving this submission will immediately charge your saved card ({formatDZD(submission.bid)}). Payout is deposited to creator's escrow account.
                  </span>
                </div>

                <div className="border-t border-border/40 my-4 pt-4">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-muted-foreground">Revision Limit</span>
                    <span className="font-medium text-foreground">{submission.revision_count} of {maxRevisions} used</span>
                  </div>
                  
                  <textarea 
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Provide detailed changes required for a revision..."
                    className="w-full h-24 rounded-2xl border border-border/60 bg-white p-3 text-[12px] outline-none focus:border-vybe/40 focus:bg-white resize-none placeholder:text-muted-foreground/50 mb-2"
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={handleRequestEdits}
                    disabled={submission.revision_count >= maxRevisions}
                    className="w-full h-10 gap-2 rounded-full border-border/60 text-muted-foreground hover:text-foreground text-[12px]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Request Edits
                  </Button>
                </div>

                <div className="border-t border-border/40 pt-4">
                  <Button variant="outline" onClick={handleDecline} className="w-full h-10 gap-2 rounded-full border-destructive/20 text-destructive hover:bg-destructive/5 text-[12px]">
                    <X className="h-3.5 w-3.5" /> Decline Submission
                  </Button>
                </div>
              </div>
            )}

            {submission.status === 'approved' && (
              <div className="rounded-2xl bg-success/5 border border-success/20 p-4 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-foreground">Submission approved</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Card charged, escrow released to creator. You now hold full license rights to this deliverable.
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="rounded-full text-[11px]" onClick={() => router.push('/library')}>
                    View in Library
                  </Button>
                </div>
              </div>
            )}

            {submission.status === 'edits' && (
              <div className="rounded-2xl bg-warning/5 border border-warning/20 p-4 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 text-warning-foreground">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-foreground">Edits requested</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    The creator has been notified with your feedback and is preparing a revised submission draft.
                  </p>
                  {submission.feedback && (
                    <div className="mt-2 text-[11px] bg-warning/10 p-2.5 rounded-xl border border-warning/20 text-left font-light text-warning-foreground">
                      <strong>Feedback sent:</strong> "{submission.feedback}"
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="rounded-full text-[11px]" onClick={handleUndo}>
                    Override & Re-review
                  </Button>
                </div>
              </div>
            )}

            {submission.status === 'declined' && (
              <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-4 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <X className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-foreground">Submission declined</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    No payment was charged. This submission is closed and the campaign slot has reopened.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="rounded-full text-[11px]" onClick={handleUndo}>
                    Undo Decline
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
