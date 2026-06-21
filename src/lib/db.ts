/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { supabase } from './supabase';
import { parseVideoUrl } from './video-embed';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: string;
  flag: string;
  location: string;
  followers: number;
  avgViews: number;
  engagement: number;
  niche: string;
  lang: string;
  verified: boolean;
  avatar: string;
  bio?: string;
}

export const CREATORS: Creator[] = [];

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  brandLogo?: string;
  type: 'deal' | 'contest';
  status: 'live' | 'draft' | 'ended';
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
  campaign_id: string;
  creator: string;
  handle: string;
  avatar?: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  views: number;
  bid: number;
  submitted: string;
  status: 'pending' | 'approved' | 'declined' | 'edits';
  followers: number;
  avgViews: number;
  engagement: number;
  verified: boolean;
  feedback?: string;
  revision_count: number;
  video_url?: string;
}

export interface CreatorList {
  id: string;
  name: string;
  created: string;
  creators: Creator[];
}

// Unified Database Provider (Direct Supabase)
export const db = {
  // --- CAMPAIGNS ---
  async getCampaigns(): Promise<Campaign[]> {
    const { data: contestsData, error: contestsError } = await supabase
      .from('contests')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });

    if (contestsError) throw contestsError;

    const { data: dealsData, error: dealsError } = await supabase
      .from('deals')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });

    if (dealsError) throw dealsError;

    const mappedContests: Campaign[] = (contestsData || []).map(item => ({
      id: item.id,
      name: item.title,
      brand: item.profiles?.full_name || 'Marque',
      brandLogo: item.profiles?.avatar_url || undefined,
      type: 'contest',
      status: item.status === 'live' ? 'live' : item.status === 'draft' ? 'draft' : 'ended',
      submissions: 0,
      views: 0,
      budget: `${Number(item.prize_pool || 0).toLocaleString()} DZD`,
      budgetMin: undefined,
      budgetMax: undefined,
      prizePool: Number(item.prize_pool || 0),
      created: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysLeft: item.duration_days,
      industry: 'Beverages',
      niches: [],
      platforms: item.platforms || [],
      description: item.description,
      dos: item.dos || [],
      donts: item.donts || []
    }));

    const mappedDeals: Campaign[] = (dealsData || []).map(item => {
      let budgetStr = '';
      if (item.budget_type === 'fixed') budgetStr = `${Number(item.budget_fixed || 0).toLocaleString()} DZD`;
      else if (item.budget_type === 'range') budgetStr = `${Number(item.budget_min || 0).toLocaleString()}–${Number(item.budget_max || 0).toLocaleString()} DZD`;
      else budgetStr = 'Creator proposes rate';

      return {
        id: item.id,
        name: item.title,
        brand: item.profiles?.full_name || 'Marque',
        brandLogo: item.profiles?.avatar_url || undefined,
        type: 'deal',
        status: item.status === 'open' ? 'live' : item.status === 'draft' ? 'draft' : 'ended',
        submissions: 0,
        views: 0,
        budget: budgetStr,
        budgetMin: item.budget_min ? Number(item.budget_min) : undefined,
        budgetMax: item.budget_max ? Number(item.budget_max) : undefined,
        prizePool: undefined,
        created: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        daysLeft: 14,
        industry: 'Beverages',
        niches: item.niche_tags || [],
        platforms: item.platforms || [],
        description: item.description,
        dos: item.dos || [],
        donts: item.donts || []
      };
    });

    const allCampaigns = [...mappedContests, ...mappedDeals];

    // Fetch submissions / applications counts for each campaign in PARALLEL
    await Promise.all(allCampaigns.map(async (c) => {
      if (c.type === 'contest') {
        const { count } = await supabase
          .from('contest_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('contest_id', c.id);
        c.submissions = count || 0;
      } else {
        const { count } = await supabase
          .from('deal_applications')
          .select('*', { count: 'exact', head: true })
          .eq('deal_id', c.id);
        c.submissions = count || 0;
      }
    }));

    return allCampaigns;
  },

  async getCampaignById(id: string): Promise<Campaign | null> {
    // 1. Try contests first
    const { data: contest } = await supabase
      .from('contests')
      .select('*, profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (contest) {
      const { count } = await supabase
        .from('contest_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('contest_id', id);

      return {
        id: contest.id,
        name: contest.title,
        brand: contest.profiles?.full_name || 'Marque',
        brandLogo: contest.profiles?.avatar_url || undefined,
        type: 'contest',
        status: contest.status === 'live' ? 'live' : contest.status === 'draft' ? 'draft' : 'ended',
        submissions: count || 0,
        views: 0,
        budget: `${Number(contest.prize_pool || 0).toLocaleString()} DZD`,
        budgetMin: undefined,
        budgetMax: undefined,
        prizePool: Number(contest.prize_pool || 0),
        created: new Date(contest.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        daysLeft: contest.duration_days,
        industry: 'Beverages',
        niches: [],
        platforms: contest.platforms || [],
        description: contest.description,
        dos: contest.dos || [],
        donts: contest.donts || []
      };
    }

    // 2. Try deals
    const { data: deal } = await supabase
      .from('deals')
      .select('*, profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (deal) {
      const { count } = await supabase
        .from('deal_applications')
        .select('*', { count: 'exact', head: true })
        .eq('deal_id', id);

      let budgetStr = '';
      if (deal.budget_type === 'fixed') budgetStr = `${Number(deal.budget_fixed || 0).toLocaleString()} DZD`;
      else if (deal.budget_type === 'range') budgetStr = `${Number(deal.budget_min || 0).toLocaleString()}–${Number(deal.budget_max || 0).toLocaleString()} DZD`;
      else budgetStr = 'Creator proposes rate';

      return {
        id: deal.id,
        name: deal.title,
        brand: deal.profiles?.full_name || 'Marque',
        brandLogo: deal.profiles?.avatar_url || undefined,
        type: 'deal',
        status: deal.status === 'open' ? 'live' : deal.status === 'draft' ? 'draft' : 'ended',
        submissions: count || 0,
        views: 0,
        budget: budgetStr,
        budgetMin: deal.budget_min ? Number(deal.budget_min) : undefined,
        budgetMax: deal.budget_max ? Number(deal.budget_max) : undefined,
        prizePool: undefined,
        created: new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        daysLeft: 14,
        industry: 'Beverages',
        niches: deal.niche_tags || [],
        platforms: deal.platforms || [],
        description: deal.description,
        dos: deal.dos || [],
        donts: deal.donts || []
      };
    }

    return null;
  },

  async createCampaign(campaign: Omit<Campaign, 'id' | 'submissions' | 'views' | 'created'>): Promise<Campaign> {
    const newId = typeof window !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    const createdStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Find active user profile to link brand_id
    const { data: { user } } = await supabase.auth.getUser();
    const brandId = user?.id || '00000000-0000-0000-0000-000000000000';

    if (campaign.type === 'contest') {
      const { error } = await supabase
        .from('contests')
        .insert({
          id: newId,
          brand_id: brandId,
          title: campaign.name,
          description: campaign.description,
          instructions: campaign.description,
          dos: campaign.dos,
          donts: campaign.donts,
          platforms: campaign.platforms,
          region: 'Algeria',
          content_languages: ['arabic', 'french'],
          duration_days: campaign.daysLeft || 14,
          prize_pool: campaign.prizePool || 0,
          prize_type: 'fixed',
          status: 'live'
        });

      if (error) throw error;
    } else {
      let bType = 'fixed';
      let bFixed = null;
      let bMin = null;
      let bMax = null;

      if (campaign.budgetMin && campaign.budgetMax && campaign.budgetMin !== campaign.budgetMax) {
        bType = 'range';
        bMin = campaign.budgetMin;
        bMax = campaign.budgetMax;
      } else if (campaign.budgetMin) {
        bFixed = campaign.budgetMin;
      } else {
        bType = 'creator_proposes';
      }

      const { error } = await supabase
        .from('deals')
        .insert({
          id: newId,
          brand_id: brandId,
          title: campaign.name,
          description: campaign.description,
          deliverable: campaign.description,
          dos: campaign.dos,
          donts: campaign.donts,
          platforms: campaign.platforms,
          region: 'Algeria',
          niche_tags: campaign.niches,
          budget_type: bType,
          budget_fixed: bFixed,
          budget_min: bMin,
          budget_max: bMax,
          status: 'open'
        });

      if (error) throw error;
    }

    return {
      ...campaign,
      id: newId,
      submissions: 0,
      views: 0,
      created: createdStr
    };
  },

  async applyForDeal(dealId: string, creatorId: string, videoUrl: string, proposal: string, proposedBid: number = 0): Promise<boolean> {
    try {
      // 1. Create a deal_application first since it's the parent record.
      const appId = typeof window !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      
      const { error: appError } = await supabase
        .from('deal_applications')
        .insert({
          id: appId,
          deal_id: dealId,
          creator_id: creatorId,
          status: 'pending',
          proposed_bid: proposedBid,
          pitch: proposal,
          cover_letter: proposal
        });

      if (appError) {
        console.error("Deal application insert error:", appError);
        // It might fail if the table doesn't exist, we throw so the UI can show the error
        throw new Error(appError.message);
      }

      // 2. Insert the submission linked to the application
      const subId = typeof window !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      
      // Auto-detect platform from video URL
      const videoInfo = parseVideoUrl(videoUrl);
      const platformMap: Record<string, string> = {
        'tiktok': 'tiktok',
        'instagram': 'instagram',
        'youtube': 'youtube',
        'unknown': 'tiktok' // fallback
      };
      const detectedPlatform = platformMap[videoInfo.platform] || 'tiktok';
      
      const { error: subError } = await supabase
        .from('deal_submissions')
        .insert({
          id: subId,
          application_id: appId,
          post_url: videoUrl,
          platform: detectedPlatform,
          status: 'submitted',
          creator_notes: proposal
        });

      if (subError) {
        console.error("Deal submission insert error:", subError);
        throw new Error(subError.message);
      }

      return true;
    } catch (e: any) {
      console.error("Failed to apply for deal:", e);
      throw new Error(e.message || "Erreur lors de la candidature.");
    }
  },

  // Helper to generate mock submissions for testing (Legacy/Demo support)
  async generateMockSubmissions(campaignId: string, campaignType: 'deal' | 'contest') {
    // Left empty since we disabled mock generations to keep data 100% real as requested.
  },

  // --- SUBMISSIONS ---
  async getSubmissions(campaignId?: string): Promise<Submission[]> {
    if (!campaignId) return [];

    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) return [];

    if (campaign.type === 'contest') {
      const { data, error } = await supabase
        .from('contest_submissions')
        .select('*, profiles:creator_id(full_name, avatar_url)')
        .eq('contest_id', campaignId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map(item => ({
        id: item.id,
        campaign_id: item.contest_id,
        creator: (item.profiles as any)?.full_name || 'Creator Partner',
        handle: `@${(item.profiles as any)?.full_name?.toLowerCase().replace(/\s+/g, '') || 'creator'}`,
        avatar: (item.profiles as any)?.avatar_url || undefined,
        platform: item.platform as Submission['platform'],
        views: Number(item.views || 0),
        bid: 0,
        submitted: new Date(item.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: item.status === 'active' ? 'approved' : 'declined',
        followers: 0,
        avgViews: 0,
        engagement: 0,
        verified: true,
        feedback: undefined,
        revision_count: 0
      }));
    } else {
      // Deals applications + submissions
      const { data: applications, error: appError } = await supabase
        .from('deal_applications')
        .select('*, profiles:creator_id(full_name, avatar_url)')
        .eq('deal_id', campaignId)
        .order('applied_at', { ascending: false });

      if (appError) throw appError;
      if (!applications) return [];

      const submissionList: Submission[] = [];

      for (const app of applications) {
        const { data: sub } = await supabase
          .from('deal_submissions')
          .select('*')
          .eq('application_id', app.id)
          .maybeSingle();

        submissionList.push({
          id: sub?.id || app.id,
          campaign_id: app.deal_id,
          creator: (app.profiles as any)?.full_name || 'Creator Partner',
          handle: `@${(app.profiles as any)?.full_name?.toLowerCase().replace(/\s+/g, '') || 'creator'}`,
          avatar: (app.profiles as any)?.avatar_url || undefined,
          platform: (sub?.platform || 'TikTok') as Submission['platform'],
          views: Number(sub?.video_id ? 15000 : 0),
          bid: Number(app.proposed_bid || 0),
          submitted: new Date(sub?.submitted_at || app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: sub ? (sub.status as Submission['status']) : (app.status === 'approved' ? 'pending' : (app.status as Submission['status'])),
          followers: 0,
          avgViews: 0,
          engagement: 0,
          verified: true,
          feedback: sub?.brand_feedback || undefined,
          revision_count: sub?.revision_number || 0
        });
      }

      return submissionList;
    }
  },

  async getCreatorApplications(creatorId: string): Promise<any> {
    // Run initial queries in parallel to speed up load time
    const [contestSubsRes, dealAppsRes] = await Promise.all([
      supabase.from('contest_submissions').select('*, contests(*, profiles(*))').eq('creator_id', creatorId),
      supabase.from('deal_applications').select('*, deals(*, profiles(*))').eq('creator_id', creatorId)
    ]);

    const { data: contestSubs, error: contestError } = contestSubsRes;
    const { data: dealApps, error: dealError } = dealAppsRes;

    if (contestError) console.error("Error fetching contest submissions:", contestError);
    if (dealError) console.error("Error fetching deal applications:", dealError);

    // 3. Get deal submissions for those applications
    const dealSubmissions = [];
    if (dealApps && dealApps.length > 0) {
      const appIds = dealApps.map((app: any) => app.id);
      const { data: subs, error: subsError } = await supabase
        .from('deal_submissions')
        .select('*')
        .in('application_id', appIds);
        
      if (!subsError && subs) {
        dealSubmissions.push(...subs);
      }
    }

    return {
      contests: contestSubs || [],
      deals: dealApps || [],
      dealSubmissions
    };
  },

  async getCreatorAnalytics(creatorId: string): Promise<any> {
    // Mock analytics for now, but in a real app this would aggregate submission_stats_snapshots
    return {
      totalAudience: "0",
      audienceChange: "0%",
      avgEngagement: "0%",
      engagementChange: "0%",
      totalViews: "0",
      viewsChange: "0%",
      conversionRate: "0%",
      conversionChange: "0%"
    };
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    // 1. Search contest submissions first
    const { data: contestSub } = await supabase
      .from('contest_submissions')
      .select('*, profiles:creator_id(full_name, avatar_url)')
      .eq('id', id)
      .maybeSingle();

    if (contestSub) {
      return {
        id: contestSub.id,
        campaign_id: contestSub.contest_id,
        creator: (contestSub.profiles as any)?.full_name || 'Creator Partner',
        handle: `@${(contestSub.profiles as any)?.full_name?.toLowerCase().replace(/\s+/g, '') || 'creator'}`,
        avatar: (contestSub.profiles as any)?.avatar_url || undefined,
        platform: contestSub.platform as Submission['platform'],
        views: Number(contestSub.views || 0),
        bid: 0,
        submitted: new Date(contestSub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: contestSub.status === 'active' ? 'approved' : 'declined',
        followers: 0,
        avgViews: 0,
        engagement: 0,
        verified: true,
        feedback: undefined,
        revision_count: 0,
        video_url: contestSub.post_url || undefined
      };
    }

    // 2. Search deal submissions
    const { data: dealSub } = await supabase
      .from('deal_submissions')
      .select('*, deal_applications(deal_id, creator_id, proposed_bid, applied_at, profiles:creator_id(full_name, avatar_url))')
      .eq('id', id)
      .maybeSingle();

    if (dealSub) {
      const app = dealSub.deal_applications as any;
      return {
        id: dealSub.id,
        campaign_id: app?.deal_id || '',
        creator: app?.profiles?.full_name || 'Creator Partner',
        handle: `@${app?.profiles?.full_name?.toLowerCase().replace(/\s+/g, '') || 'creator'}`,
        avatar: app?.profiles?.avatar_url || undefined,
        platform: dealSub.platform as Submission['platform'],
        views: Number(15000),
        bid: Number(app?.proposed_bid || 0),
        submitted: new Date(dealSub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: dealSub.status as Submission['status'],
        followers: 0,
        avgViews: 0,
        engagement: 0,
        verified: true,
        feedback: dealSub.brand_feedback || undefined,
        revision_count: dealSub.revision_number || 0,
        video_url: dealSub.post_url || undefined
      };
    }

    // 3. Fallback: Search deal applications directly
    const { data: appDirect } = await supabase
      .from('deal_applications')
      .select('*, profiles:creator_id(full_name, avatar_url)')
      .eq('id', id)
      .maybeSingle();

    if (appDirect) {
      return {
        id: appDirect.id,
        campaign_id: appDirect.deal_id,
        creator: (appDirect.profiles as any)?.full_name || 'Creator Partner',
        handle: `@${(appDirect.profiles as any)?.full_name?.toLowerCase().replace(/\s+/g, '') || 'creator'}`,
        avatar: (appDirect.profiles as any)?.avatar_url || undefined,
        platform: 'TikTok',
        views: 0,
        bid: Number(appDirect.proposed_bid || 0),
        submitted: new Date(appDirect.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: appDirect.status === 'approved' ? 'pending' : (appDirect.status as Submission['status']),
        followers: 0,
        avgViews: 0,
        engagement: 0,
        verified: true,
        feedback: undefined,
        revision_count: 0,
        video_url: undefined
      };
    }

    return null;
  },

  async updateSubmissionStatus(id: string, status: Submission['status'], feedback?: string): Promise<boolean> {
    // 1. Try updating contest_submissions status
    const { data: contestSub } = await supabase
      .from('contest_submissions')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (contestSub) {
      const { error } = await supabase
        .from('contest_submissions')
        .update({ status: status === 'approved' ? 'active' : 'disqualified' })
        .eq('id', id);

      if (error) throw error;
      return true;
    }

    // 2. Try updating deal_submissions status
    const { data: dealSub } = await supabase
      .from('deal_submissions')
      .select('id, revision_number')
      .eq('id', id)
      .maybeSingle();

    if (dealSub) {
      const updates: any = { status };
      if (feedback !== undefined) {
        updates.brand_feedback = feedback;
      }
      if (status === 'edits') {
        updates.status = 'edits_requested';
        updates.revision_number = (dealSub.revision_number || 0) + 1;
      }

      const { error } = await supabase
        .from('deal_submissions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    }

    // 3. Try updating deal_applications status
    const { data: appDirect } = await supabase
      .from('deal_applications')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (appDirect) {
      let mappedStatus = 'pending';
      if (status === 'approved') mappedStatus = 'approved';
      else if (status === 'declined') mappedStatus = 'declined';

      const { error } = await supabase
        .from('deal_applications')
        .update({ status: mappedStatus, reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    }

    return false;
  },

  // --- CREATOR SAVED LISTS ---
  async getCreatorLists(): Promise<CreatorList[]> {
    const { data: listsData, error: listsError } = await supabase
      .from('creator_lists')
      .select('*')
      .order('created_at', { ascending: false });

    if (listsError) throw listsError;
    if (!listsData) return [];

    const resultLists: CreatorList[] = [];
    for (const list of listsData) {
      const { data: membersData, error: membersError } = await supabase
        .from('creator_list_members')
        .select('creator_id')
        .eq('list_id', list.id);

      const creators: Creator[] = [];
      if (!membersError && membersData) {
        const memberIds = membersData.map(m => m.creator_id);
        CREATORS.forEach(c => {
          if (memberIds.includes(c.id)) {
            creators.push(c);
          }
        });
      }

      resultLists.push({
        id: list.id,
        name: list.name,
        created: new Date(list.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        creators
      });
    }
    return resultLists;
  },

  async createCreatorList(name: string): Promise<CreatorList> {
    const newId = typeof window !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    const createdStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newList: CreatorList = {
      id: newId,
      name,
      created: createdStr,
      creators: []
    };

    const { error } = await supabase
      .from('creator_lists')
      .insert({
        id: newId,
        name
      });

    if (error) throw error;
    return newList;
  },

  async deleteCreatorList(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('creator_lists')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async addCreatorToList(listId: string, creatorId: string): Promise<boolean> {
    const { error } = await supabase
      .from('creator_list_members')
      .insert({
        list_id: listId,
        creator_id: creatorId
      });

    if (error) throw error;
    return true;
  },

  async removeCreatorFromList(listId: string, creatorId: string): Promise<boolean> {
    const { error } = await supabase
      .from('creator_list_members')
      .delete()
      .eq('list_id', listId)
      .eq('creator_id', creatorId);

    if (error) throw error;
    return true;
  },

  // --- CREATOR ONBOARDING ---
  async saveCreatorOnboarding(userId: string, data: {
    name: string;
    avatar_url: string;
    niche: string;
    country: string;
    platform: string;
    username: string;
    follower_count: number;
    avg_views: number;
    engagement_rate: number;
  }): Promise<boolean> {
    try {
      // 1. Update profiles table with avatar and full_name
      await supabase.from('profiles').update({ 
        full_name: data.name,
        avatar_url: data.avatar_url 
      }).eq('id', userId);

      // 2. Upsert creator_profiles
      await supabase.from('creator_profiles').upsert({
        id: userId,
        display_name: data.name,
        niche: [data.niche],
        country: data.country
      });

      // 3. Upsert creator_social_accounts
      const { data: existing } = await supabase
        .from('creator_social_accounts')
        .select('id')
        .eq('creator_id', userId)
        .eq('platform', data.platform.toLowerCase())
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase.from('creator_social_accounts').update({
          username: data.username,
          follower_count: data.follower_count,
          avg_views: data.avg_views,
          engagement_rate: data.engagement_rate
        }).eq('id', existing[0].id);
      } else {
        await supabase.from('creator_social_accounts').insert({
          creator_id: userId,
          platform: data.platform.toLowerCase(),
          username: data.username,
          follower_count: data.follower_count,
          avg_views: data.avg_views,
          engagement_rate: data.engagement_rate
        });
      }

      return true;
    } catch (e) {
      console.error('Failed to save creator onboarding', e);
      return false;
    }
  },

  // --- CREATORS ---
  async getCreators(): Promise<Creator[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'creator')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    // Try to fetch extended data if tables exist
    // We fetch separately to avoid join errors if tables aren't perfectly aligned
    const { data: cProfiles } = await supabase.from('creator_profiles').select('*');
    const { data: cSocials } = await supabase.from('creator_social_accounts').select('*');

    return (data || []).map(p => {
      const cProf = (cProfiles || []).find(cp => cp.id === p.id) || {};
      const cSocial = (cSocials || []).find(cs => cs.creator_id === p.id) || {};
      
      return {
        id: p.id,
        name: p.full_name || 'Unnamed Creator',
        handle: cSocial.username || `@${(p.full_name || 'user').toLowerCase().replace(/\s+/g, '')}`,
        platform: cSocial.platform || 'TikTok',
        flag: cProf.country === 'Algeria' ? '🇩🇿' : '🌍',
        location: cProf.country || p.location || 'Algeria',
        followers: cSocial.follower_count || 0,
        avgViews: cSocial.avg_views || 0,
        engagement: cSocial.engagement_rate || 0,
        niche: (cProf.niche && cProf.niche[0]) ? cProf.niche[0] : 'Lifestyle',
        lang: (cProf.content_language && cProf.content_language[0]) ? cProf.content_language[0] : 'AR',
        verified: cProf.is_verified || false,
        avatar: p.avatar_url || 'https://i.pravatar.cc/150?u=' + p.id,
        bio: cProf.bio || p.bio || ''
      };
    });
  }
};

// =============================================
// PROFILE SERVICE
// =============================================

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'creator' | 'brand' | 'admin';
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  /** Fetch a user's profile by their auth user ID */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116 = no rows found — not a real error
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Profile;
  },

  /** Update a user's profile (partial update) */
  async updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  /** Get all profiles with a specific role */
  async getProfilesByRole(role: Profile['role']): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Profile[];
  },
};

// =============================================
// BRAND DETAILS SERVICE
// =============================================

export interface BrandDetails {
  id: string;
  // Step 1 — Brand Info
  company_name: string | null;
  company_logo_url: string | null;
  industry: string | null;
  company_size: string | null;
  country: string | null;
  website: string | null;
  // Step 2 — Legal & Official
  legal_name: string | null;
  registration_number: string | null;
  tax_id: string | null;
  legal_address: string | null;
  city: string | null;
  wilaya_state: string | null;
  postal_code: string | null;
  // Step 3 — Contact & Socials
  contact_phone: string | null;
  contact_email: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  // Status
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const brandDetailsService = {
  /** Fetch a user's brand details */
  async getBrandDetails(userId: string): Promise<BrandDetails | null> {
    const { data, error } = await supabase
      .from('brand_details')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as BrandDetails;
  },

  /** Update brand details (partial update / upsert) */
  async updateBrandDetails(
    userId: string,
    updates: Partial<Omit<BrandDetails, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<BrandDetails> {
    const { data, error } = await supabase
      .from('brand_details')
      .upsert({ id: userId, ...updates })
      .select()
      .single();

    if (error) throw error;
    return data as BrandDetails;
  },

  /** Mark onboarding as completed */
  async completeOnboarding(userId: string): Promise<BrandDetails> {
    return this.updateBrandDetails(userId, { onboarding_completed: true });
  },

  /** Check if onboarding is complete */
  async isOnboardingComplete(userId: string): Promise<boolean> {
    const details = await this.getBrandDetails(userId);
    return details?.onboarding_completed ?? false;
  },
};

