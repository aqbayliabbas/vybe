import { supabase } from './supabase';

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

export const CREATORS: Creator[] = [
  { id: 'yasmine', name: 'Yasmine B.', handle: '@yasminecreates', platform: 'TikTok', flag: '🇩🇿', location: 'Algiers, Algeria', followers: 125000, avgViews: 42000, engagement: 4.2, niche: 'Beauty', lang: 'Arabic + French', verified: true, avatar: 'YB', bio: 'Algerian beauty & lifestyle creator sharing daily tips, makeup tutorials, and skincare routines from Algiers. Let\'s collaborate!' },
  { id: 'karim', name: 'Karim T.', handle: '@karimdz', platform: 'TikTok', flag: '🇩🇿', location: 'Oran, Algeria', followers: 210000, avgViews: 85000, engagement: 3.8, niche: 'Tech', lang: 'Arabic + French', verified: true, avatar: 'KT', bio: 'Tech enthusiast & gamer. I review the latest gadgets, smartphones, and gaming setups in Arabic and French.' },
  { id: 'sara', name: 'Sara M.', handle: '@saradz_beauty', platform: 'Instagram', flag: '🇩🇿', location: 'Constantine, Algeria', followers: 58000, avgViews: 18000, engagement: 5.1, niche: 'Beauty', lang: 'Arabic + French', verified: false, avatar: 'SM', bio: 'Hijab stylist & cosmetics reviewer. Sharing my honest opinions on Algerian & international brands.' },
  { id: 'amine', name: 'Amine R.', handle: '@aminevibes', platform: 'TikTok', flag: '🇩🇿', location: 'Algiers, Algeria', followers: 95000, avgViews: 35000, engagement: 4.5, niche: 'Comedy', lang: 'Arabic', verified: true, avatar: 'AR', bio: 'Making people laugh with relatable Algerian comedy skits, street challenges, and short stories.' },
  { id: 'lina', name: 'Lina C.', handle: '@linacooks', platform: 'Instagram', flag: '🇩🇿', location: 'Algiers, Algeria', followers: 72000, avgViews: 24000, engagement: 4.8, niche: 'Food', lang: 'Arabic + French', verified: true, avatar: 'LC', bio: 'Passionate home cook sharing modern takes on traditional Algerian recipes. Sweet & savory ideas daily!' },
  { id: 'mehdi', name: 'Mehdi A.', handle: '@mehdidz', platform: 'YouTube', flag: '🇩🇿', location: 'Annaba, Algeria', followers: 245000, avgViews: 75000, engagement: 5.5, niche: 'Travel', lang: 'French', verified: true, avatar: 'MA', bio: 'Vlogging my adventures around Algeria and the world. Revealing hidden gems and local cuisines.' },
  { id: 'rania', name: 'Rania F.', handle: '@raniafashion', platform: 'Instagram', flag: '🇦🇪', location: 'Dubai, UAE', followers: 198000, avgViews: 50000, engagement: 3.2, niche: 'Fashion', lang: 'English + Arabic', verified: true, avatar: 'RF', bio: 'Modern Arab fashion trends, styling diaries, and high-street lookbooks based in sunny Dubai.' },
  { id: 'bilal', name: 'Bilal S.', handle: '@bilalsports', platform: 'TikTok', flag: '🇶🇦', location: 'Doha, Qatar', followers: 167000, avgViews: 55000, engagement: 4.0, niche: 'Sports', lang: 'Arabic + English', verified: true, avatar: 'BS', bio: 'Football analyst, freestyle tricks, and active lifestyle advocate. Sharing Doha sports community vibes.' },
];

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
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      brandLogo: item.brand_logo,
      type: item.type,
      status: item.status,
      submissions: item.submissions_count,
      views: item.views,
      budget: item.budget,
      budgetMin: item.budget_min,
      budgetMax: item.budget_max,
      prizePool: item.prize_pool,
      created: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysLeft: item.days_left,
      industry: item.industry || '',
      niches: item.niches || [],
      platforms: item.platforms || [],
      description: item.description,
      dos: item.dos || [],
      donts: item.donts || []
    }));
  },

  async getCampaignById(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      brandLogo: data.brand_logo,
      type: data.type,
      status: data.status,
      submissions: data.submissions_count,
      views: data.views,
      budget: data.budget,
      budgetMin: data.budget_min,
      budgetMax: data.budget_max,
      prizePool: data.prize_pool,
      created: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysLeft: data.days_left,
      industry: data.industry || '',
      niches: data.niches || [],
      platforms: data.platforms || [],
      description: data.description,
      dos: data.dos || [],
      donts: data.donts || []
    };
  },

  async createCampaign(campaign: Omit<Campaign, 'id' | 'submissions' | 'views' | 'created'>): Promise<Campaign> {
    const newId = typeof window !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    const createdStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const fullCampaign: Campaign = {
      ...campaign,
      id: newId,
      submissions: 0,
      views: 0,
      created: createdStr
    };

    const { error } = await supabase
      .from('campaigns')
      .insert({
        id: newId,
        name: campaign.name,
        brand: campaign.brand,
        brand_logo: campaign.brandLogo,
        type: campaign.type,
        status: campaign.status,
        submissions_count: 0,
        views: 0,
        budget: campaign.budget,
        budget_min: campaign.budgetMin,
        budget_max: campaign.budgetMax,
        prize_pool: campaign.prizePool,
        days_left: campaign.daysLeft,
        industry: campaign.industry,
        niches: campaign.niches,
        platforms: campaign.platforms,
        description: campaign.description,
        dos: campaign.dos,
        donts: campaign.donts
      });

    if (error) throw error;
    
    // Auto-generate 3 mock submissions inside the database to make new campaigns interactive
    await this.generateMockSubmissions(newId, campaign.type);
    
    return fullCampaign;
  },

  // Helper to generate mock submissions for testing
  async generateMockSubmissions(campaignId: string, campaignType: 'deal' | 'contest') {
    const sampleCreators = CREATORS.slice(0, 3);
    const submissionsList = sampleCreators.map((c, i) => ({
      id: typeof window !== 'undefined' ? crypto.randomUUID() : `sub-${campaignId}-${i}`,
      campaign_id: campaignId,
      creator: c.name,
      handle: c.handle,
      avatar: c.avatar,
      platform: c.platform,
      views: c.avgViews + Math.round(Math.random() * 5000),
      bid: campaignType === 'deal' ? 8000 + i * 2000 : 0,
      status: 'pending',
      followers: c.followers,
      avg_views: c.avgViews,
      engagement: c.engagement,
      verified: c.verified,
      revision_count: 0
    }));

    await supabase.from('submissions').insert(submissionsList);
    
    // Increment campaigns count
    await supabase.rpc('increment_submissions', { row_id: campaignId, increment_by: submissionsList.length });
  },

  // --- SUBMISSIONS ---
  async getSubmissions(campaignId?: string): Promise<Submission[]> {
    let query = supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      campaign_id: item.campaign_id,
      creator: item.creator,
      handle: item.handle,
      avatar: item.avatar || undefined,
      platform: item.platform,
      views: item.views,
      bid: item.bid,
      submitted: new Date(item.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: item.status,
      followers: item.followers,
      avgViews: item.avg_views,
      engagement: Number(item.engagement),
      verified: item.verified,
      feedback: item.feedback || undefined,
      revision_count: item.revision_count
    }));
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      campaign_id: data.campaign_id,
      creator: data.creator,
      handle: data.handle,
      avatar: data.avatar || undefined,
      platform: data.platform,
      views: data.views,
      bid: data.bid,
      submitted: new Date(data.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: data.status,
      followers: data.followers,
      avgViews: data.avg_views,
      engagement: Number(data.engagement),
      verified: data.verified,
      feedback: data.feedback || undefined,
      revision_count: data.revision_count
    };
  },

  async updateSubmissionStatus(id: string, status: Submission['status'], feedback?: string): Promise<boolean> {
    const updates: any = { status };
    if (feedback !== undefined) {
      updates.feedback = feedback;
    }
    if (status === 'edits') {
      const current = await this.getSubmissionById(id);
      updates.revision_count = (current?.revision_count || 0) + 1;
    }

    const { error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
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
