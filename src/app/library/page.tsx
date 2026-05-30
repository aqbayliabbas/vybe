"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Download, 
  Copy, 
  ExternalLink,
  Eye,
  Heart,
  Smartphone,
  Info,
  Grid,
  Filter,
  Play,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

const formatViews = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
};

const libraryItems = [
  { id: 'v1', creator: 'Yasmine B.', handle: '@yasminecreates', campaign: 'Summer Refresh', platform: 'TikTok', views: 245000, likes: 32000, comments: 1200, date: '2 days ago', thumb: 'YB', size: '14.2 MB', duration: '0:15' },
  { id: 'v2', creator: 'Karim T.', handle: '@karimdz', campaign: 'Summer Refresh', platform: 'TikTok', views: 128000, likes: 18500, comments: 920, date: '3 days ago', thumb: 'KT', size: '18.1 MB', duration: '0:22' },
  { id: 'v3', creator: 'Sara M.', handle: '@saradz_beauty', campaign: 'Summer Refresh', platform: 'Instagram', views: 58000, likes: 9800, comments: 450, date: '1 day ago', thumb: 'SM', size: '12.4 MB', duration: '0:30' },
  { id: 'v4', creator: 'Amine R.', handle: '@aminevibes', campaign: 'Summer Refresh', platform: 'TikTok', views: 95000, likes: 14000, comments: 850, date: '4 days ago', thumb: 'AR', size: '10.9 MB', duration: '0:12' },
  { id: 'v5', creator: 'Lina C.', handle: '@linacooks', campaign: 'Summer Refresh', platform: 'Instagram', views: 72000, likes: 11000, comments: 620, date: '1 day ago', thumb: 'LC', size: '24.5 MB', duration: '0:45' },
  { id: 'v6', creator: 'Mehdi A.', handle: '@mehdidz', campaign: 'Back to School', platform: 'YouTube', views: 245000, likes: 35000, comments: 2400, date: '5 days ago', thumb: 'MA', size: '58.0 MB', duration: '3:45' },
];

export default function ContentLibraryPage() {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'TikTok' | 'Instagram' | 'YouTube'>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<'all' | 'Summer Refresh' | 'Back to School'>('all');

  const filtered = useMemo(() => {
    return libraryItems.filter(item => {
      if (query && !`${item.creator} ${item.handle} ${item.campaign}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedPlatform !== 'all' && item.platform !== selectedPlatform) return false;
      if (selectedCampaign !== 'all' && item.campaign !== selectedCampaign) return false;
      return true;
    });
  }, [query, selectedPlatform, selectedCampaign]);

  const handleDownload = (creator: string, size: string) => {
    toast.success("Download started", {
      description: `Downloading high-res MP4 delivery draft from ${creator} (${size}).`,
    });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Post URL copied to clipboard", {
      description: link,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Creative Assets</p>
          <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">Content Library</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Access and download high-resolution creative deliverables approved from campaigns.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3 justify-between bg-white/90 border border-border/40 p-4 rounded-3xl shadow-card">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-[320px]">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search creator content…"
              className="h-10 w-full rounded-full border border-border/60 bg-white/70 pl-9 pr-4 text-[13px] outline-none placeholder:text-muted-foreground/50 focus:border-vybe/40 focus:bg-white"
            />
          </div>
          
          <select 
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value as any)}
            className="h-10 border border-border/60 bg-white rounded-full px-4 text-[12px] font-semibold outline-none focus:border-vybe/40"
          >
            <option value="all">All Platforms</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
          </select>

          <select 
            value={selectedCampaign}
            onChange={e => setSelectedCampaign(e.target.value as any)}
            className="h-10 border border-border/60 bg-white rounded-full px-4 text-[12px] font-semibold outline-none focus:border-vybe/40"
          >
            <option value="all">All Campaigns</option>
            <option value="Summer Refresh">Pepsi Summer Refresh</option>
            <option value="Back to School">Nike Back to School</option>
          </select>
        </div>

        <div className="text-[12px] text-muted-foreground font-semibold">
          Showing {filtered.length} of {libraryItems.length} videos
        </div>
      </div>

      {/* Grid of video content items */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <div 
            key={item.id}
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-white/95 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            {/* Video preview thumbnail card */}
            <div className="relative aspect-[9/10] bg-zinc-950 flex flex-col justify-between p-4 text-white overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <span className="rounded bg-black/40 px-2 py-1 text-[10px] font-bold tracking-wide flex items-center gap-1 backdrop-blur-md">
                  <Smartphone className="h-3 w-3 text-vybe-glow" /> {item.platform}
                </span>
                <span className="text-[10px] text-zinc-300 font-semibold bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                  {item.duration}
                </span>
              </div>

              {/* Play symbol button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/35 transition-colors cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300">
                  <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                </div>
              </div>

              {/* Verified footer overlay */}
              <div className="z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent absolute inset-x-0 bottom-0 p-4 pt-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-vybe/30 to-vybe-glow/20 text-xs font-bold text-white shrink-0">
                    {item.thumb}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs truncate">{item.creator}</p>
                    <p className="text-[10px] text-zinc-300 truncate">{item.handle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info and action panel */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.campaign}</p>
                <p className="text-xs text-foreground mt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" /> Full Creative License Active
                </p>
              </div>

              {/* Visual Stats */}
              <div className="grid grid-cols-2 gap-2 text-center text-[11px] border-y border-border/30 py-2.5">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wider text-[9px]">Views Generated</p>
                  <p className="font-heading text-xs font-bold text-foreground mt-0.5 flex items-center justify-center gap-1"><Eye className="h-3.5 w-3.5 text-muted-foreground" /> {formatViews(item.views)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase tracking-wider text-[9px]">Engagements</p>
                  <p className="font-heading text-xs font-bold text-foreground mt-0.5 flex items-center justify-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-500" /> {formatViews(item.likes)}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(item.creator, item.size)}
                  className="rounded-xl border-border/60 text-[11px] h-8 gap-1 p-0.5"
                >
                  <Download className="h-3.5 w-3.5" /> MP4
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCopyLink(`https://tiktok.com/${item.handle}/video/${item.id}`)}
                  className="rounded-xl border-border/60 text-[11px] h-8 gap-1 p-0.5"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Link href={`/deals/1/submission/${item.id}`} className="block w-full">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-xl text-[11px] h-8 gap-1 p-0.5 text-vybe-dark w-full"
                  >
                    Review <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <FolderOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-[13px] font-medium text-foreground">No creative assets found</p>
            <p className="text-[12px] text-muted-foreground">Approved creator drafts and submissions will be archived here automatically.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
