// Vybe Mock Data — Algerian brands & creators

const groupThousands = (n: number): string => {
  const sign = n < 0 ? '-' : '';
  return sign + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return groupThousands(n);
};

export const formatDZD = (n: number): string => {
  return groupThousands(n) + ' DZD';
};

export type CampaignType = 'deal' | 'contest';
export type CampaignStatus = 'live' | 'draft' | 'ended';
export type SubmissionStatus = 'pending' | 'approved' | 'declined' | 'edits';

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  brandLogo?: string;
  type: CampaignType;
  status: CampaignStatus;
  submissions: number;
  views: number;
  budget: string;
  budgetMin?: number;
  budgetMax?: number;
  prizePool?: number;
  created: string;
  daysLeft: number;
  industry: string;
  niches: string[];
  platforms: string[];
  description: string;
  dos: string[];
  donts: string[];
}

export interface Submission {
  id: string;
  creator: string;
  handle: string;
  avatar?: string;
  platform: 'TikTok' | 'Instagram';
  views: number;
  bid: number;
  submitted: string;
  status: SubmissionStatus;
  followers: number;
  avgViews: number;
  engagement: number;
  verified: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  creator: string;
  handle: string;
  views: number;
  prize: number;
  change24h: number;
  trend: 'up' | 'down';
}

export interface EarningEntry {
  campaign: string;
  brand: string;
  amount: number;
  date: string;
  status: 'paid' | 'processing';
}

export const campaigns: Campaign[] = [];

export const creatorCampaigns: Campaign[] = [];

export const submissions: Submission[] = [];

export const leaderboardData: LeaderboardEntry[] = [];

export const earningsHistory: EarningEntry[] = [];

export const monthlyEarnings: { month: string; amount: number }[] = [];

export const creatorSubmissions: { 
  id: string; 
  campaign: string; 
  brand: string; 
  platform: 'TikTok' | 'Instagram'; 
  views: number; 
  bid: number; 
  status: SubmissionStatus; 
  submitted: string; 
}[] = [];
