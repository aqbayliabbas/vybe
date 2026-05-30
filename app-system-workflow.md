# App System & Workflow — Complete Documentation
> Creator-Brand Marketplace for MENA & Worldwide
> Last updated: 2025

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [User Roles](#3-user-roles)
4. [Monetization & Plans](#4-monetization--plans)
5. [Payment Infrastructure](#5-payment-infrastructure)
6. [Social Data Infrastructure (Phyllo)](#6-social-data-infrastructure-phyllo)
7. [Brand Web App — Full Flow](#7-brand-web-app--full-flow)
8. [Brand Mobile App — Full Flow](#8-brand-mobile-app--full-flow)
9. [Creator Mobile App — Full Flow](#9-creator-mobile-app--full-flow)
10. [Contests — System Logic](#10-contests--system-logic)
11. [Deals — System Logic](#11-deals--system-logic)
12. [Creator Database — System Logic](#12-creator-database--system-logic)
13. [Notifications System](#13-notifications-system)
14. [Escrow & Payout Logic](#14-escrow--payout-logic)
15. [Database Schema](#15-database-schema)
16. [Page & Screen Map](#16-page--screen-map)

---

## 1. Product Overview

A creator-brand marketplace built for the **MENA region** (Algeria, Gulf, North Africa) with worldwide reach. Brands connect with content creators through two core products:

### Contests
Brands post a brief and a prize pool. Creators compete by publishing organic content on their own social channels. Views are tracked automatically via Phyllo. Top performers by views win the prize money. Brands own all submitted content.

### Deals
Brands post a brief and targeting criteria. Creators apply with a proposed bid. Brands review creator stats, watch sample content, and approve or decline. Approved creators produce the content, submit it, and get paid only after brand approval.

### Key Differentiators
- First mover in MENA / Arabic creator economy
- Phyllo-verified creator stats (not self-reported)
- Dual payment infrastructure: Stripe (international) + Chargily (Algeria)
- Trilingual platform: English, French, Arabic (RTL support)
- Creator database with MENA-first regional filters
- Escrow-based payments — brands only pay for approved content

---

## 2. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Web Frontend | Next.js (React) | i18n, SEO, RTL, shares logic with mobile |
| Mobile App | React Native | Single codebase for iOS + Android |
| Backend | Node.js + Express | Fast, large ecosystem |
| Database | PostgreSQL via Supabase | Auth, storage, real-time, DB in one |
| Payments (International) | Stripe + Stripe Connect | Cards, payouts to creators |
| Payments (Algeria) | Chargily | CIB, BaridiMob, Dahabia |
| Creator Data | Phyllo API | Social stats, OAuth, video tracking |
| i18n (Web) | next-i18next | EN / FR / AR + RTL |
| Background Jobs | Supabase Edge Functions / Cron | Stats refresh every 6–12h |
| Hosting | Vercel (web) + Supabase (backend/db) | Fast, cost-effective to start |
| File Storage | Supabase Storage | Product assets, brand logos |

---

## 3. User Roles

### Brand
- Signs up on web app
- Creates and manages Contests and Deals
- Reviews creator applications and submissions
- Browses creator database
- Pays via Stripe or Chargily
- Accesses analytics and content library

### Creator
- Signs up on mobile app
- Connects social accounts via Phyllo
- Browses and applies to Contests and Deals
- Submits post URLs for tracking
- Receives payouts via Stripe Connect or Chargily

### Admin (Internal)
- Manages platform users
- Handles disputes
- Reviews flagged content
- Manages payouts and escrow
- Monitors platform health

---

## 4. Monetization & Plans

### Free Trial (New Brands Only)
- Requires payment method on signup (card saved, no charge)
- 1 Contest available
- 1 Deal available
- Creator database: browse only (profiles blurred)
- Prize pool capped at $200
- Full features unlocked on that 1 campaign
- Converts to paid plan after trial used

### Starter — $49/month
- 3 Contests + 3 Deals per month
- Up to 50 creator applications per deal
- Basic analytics
- 1 saved creator list
- Full creator database access

### Growth — $149/month
- Unlimited Contests + Deals
- Unlimited applications
- Full analytics + content library
- 10 saved creator lists
- Priority support

### Scale — $399/month
- Everything in Growth
- Dedicated account manager
- Bulk payouts
- Unlimited saved lists
- CSV creator export
- White-label reports

### Platform Fee
- 10% fee on every contest prize pool
- 10% fee on every deal payout
- Fee charged to brand, not creator

---

## 5. Payment Infrastructure

### Brand Side
```
Brand country = Algeria  →  Chargily (CIB, BaridiMob, Dahabia)
Brand country = Other    →  Stripe (Visa, Mastercard, AMEX)
Both methods can be saved simultaneously
```

### Creator Payouts
```
Creator country = Gulf / International  →  Stripe Connect (automatic)
Creator country = Algeria               →  Chargily or manual transfer (Phase 1)
```

### Escrow Flow — Contests
```
Brand funds prize pool at launch
       ↓
Funds held in escrow (Stripe/Chargily)
       ↓
Contest ends → winners calculated automatically
       ↓
Brand has 48h dispute window
       ↓
Payouts released to winners automatically
```

### Escrow Flow — Deals
```
Brand approves creator application
       ↓
No payment yet
       ↓
Creator submits video
       ↓
Brand approves video
       ↓
Payment charged to brand card
       ↓
Payout released to creator (minus 10% platform fee)
```

---

## 6. Social Data Infrastructure (Phyllo)

Phyllo is the third-party API layer between the platform and social networks.

### What Phyllo Provides
- Creator OAuth connection (TikTok, Instagram, YouTube)
- Follower count
- Average views per video
- Engagement rate
- Niche / content category
- Account credibility score
- Individual video stats (views, likes, shares, comments)
- Time-series view data for leaderboard tracking

### Integration Points

#### During Creator Onboarding
```
Creator signs up
       ↓
Connects social accounts via Phyllo SDK (one-time OAuth)
       ↓
Platform receives and stores creator profile stats
       ↓
"Phyllo Verified" badge applied to profile
```

#### During Deal Application
```
Creator applies to deal
       ↓
Brand sees Phyllo-verified stats on creator card
  - Followers, avg views, engagement rate
  - All verified, not self-reported
```

#### During Contest (Leaderboard Tracking)
```
Creator submits post URL
       ↓
Platform sends URL to Phyllo
       ↓
Background job polls Phyllo every 6–12 hours
       ↓
Stats stored as time-series snapshots
       ↓
Leaderboard updated automatically
```

### Supported Platforms
- TikTok (primary — MENA dominant)
- Instagram Reels
- YouTube Shorts
- Facebook (optional, Phase 2)

---

## 7. Brand Web App — Full Flow

### 7.1 Landing Page
- Hero with CTA: Get Started Free / Book a Demo
- Social proof bar (creator count, campaign count, views)
- How Contests work (3-step visual)
- How Deals work (3-step visual)
- Blurred creator database teaser (unlock on signup)
- Pricing preview
- Testimonials from MENA brands
- Final CTA
- Footer with language switcher (EN / FR / AR)

### 7.2 Registration Flow
```
Step 1 — Create Account
  Full name, work email, password
  OR Continue with Google

Step 2 — Email Verification
  6-digit OTP sent to email
  60s cooldown on resend

Step 3 — Brand Profile
  Company name, industry, company size,
  country, website (optional), logo (optional)

Step 4 — Payment Method (FORCED — cannot skip)
  Algeria → Chargily shown first
  Other   → Stripe shown first
  "No charge today" messaging
  Lists what gets unlocked (1 contest, 1 deal, creator DB)

Step 5 — Welcome Screen
  3 quick action cards: Contest / Deal / Browse Creators
  "Go to Dashboard" CTA
```

### 7.3 Login Flow
```
Email + password  OR  Google OAuth
Forgot password → email reset link → set new password
Face ID / biometric (mobile)
```

### 7.4 Dashboard — Empty State
- Welcome banner with free trial status
- 3 quick action cards (Contest / Deal / Creators)
- Onboarding checklist (5 steps, progress bar)
- Empty campaigns section with CTA
- Zeroed stats overview

### 7.5 Dashboard — Active State
- Stats bar: Views / Spent / Submissions / Creators
- Active campaigns list (contests + deals)
- Leaderboard preview (top 3 from active contest)
- Views over time chart (7D / 30D / 90D)
- Recent activity feed

### 7.6 Contest Creation (4 Steps)
```
Step 1 — Brief
  Title, product description, creator instructions,
  Dos, Don'ts, inspiration links, product asset upload

Step 2 — Rules & Platform
  Platform (TikTok / Instagram / YouTube, multi-select)
  Region (MENA / specific country / worldwide)
  Content language (AR / FR / EN / Any)
  Minimum followers (optional)
  Duration (7 / 14 / 21 / 30 days)

Step 3 — Prize Structure
  Fixed prize pool with distribution (1st/2nd/3rd)
  OR pay-per-view model with cap

Step 4 — Review & Pay
  Full summary
  Payment breakdown (prize pool + 10% platform fee)
  Pay via Stripe or Chargily
  Funds go to escrow
  Contest goes live
```

### 7.7 Contest Live View
- Status badge (Live / Ended)
- Countdown timer
- Stats: creators, views, prize pool
- Tabs: Brief / Leaderboard / Submissions
- Leaderboard: rank, creator, flag, views (with delta), prize
- Auto-refresh timestamp + manual refresh
- Views over time chart per creator
- Submissions tab: thumbnail, stats, view link, download

### 7.8 Contest Ended — Review & Payout
- Final leaderboard
- 48h dispute window with countdown
- Dispute flow (reason, evidence)
- Release payouts button
- Auto-release if no dispute after 48h

### 7.9 Deal Creation (4 Steps)
```
Step 1 — Brief
  Title, product description, deliverable spec,
  Dos, Don'ts, inspiration links, asset upload

Step 2 — Targeting
  Platform, region, follower range,
  niche tags, content language

Step 3 — Terms
  Application deadline, max creators to accept,
  budget (fixed / range / creator proposes),
  revision policy (1 / 2 / none)

Step 4 — Review & Publish
  Full summary
  No payment at this stage
  Deal goes live to matching creators
```

### 7.10 Deal Management
- Applications tab: creator cards with Phyllo stats + bid
- Actions: Approve / Decline per application
- Approved tab: submission status per creator
- Submission review: watch video inline, accept/request edits/decline
- Request edits: text feedback, revision counter
- Accept: payment charged, payout released to creator

### 7.11 Creator Database
- Search bar
- Filters: region, platform, followers, avg views,
  engagement rate, niche, language, verified only
- Creator cards: photo, username, flag, platform icons,
  followers, avg views, engagement, niche, language,
  Phyllo verified badge
- Actions per card: Save to list / Invite to Deal
- Pagination / infinite scroll

### 7.12 Creator Profile Page
- Full stats (all platforms connected)
- Top 3 performing videos (via Phyllo)
- Past collaborations on platform
- Invite to Deal button
- Save to list button

### 7.13 Saved Creator Lists
- Create / rename / delete lists
- Add creators from database
- Bulk invite entire list to a deal

### 7.14 Analytics
- Period selector (7D / 30D / 90D / custom)
- Overview stats (views, spent, submissions, creators)
- Views by platform (bar chart)
- Views by region (bar chart with flags)
- Views over time (line chart)
- Best performing content (top 5)
- Per-campaign breakdown

### 7.15 Content Library
- All videos ever received across all campaigns
- Filters: campaign, platform, date range, performance
- Grid view with thumbnail, creator, view count
- Download video
- Copy post link

### 7.16 Settings
- Brand profile (edit all fields)
- Team members (invite / remove, role management)
- Billing: current plan, upgrade, payment methods, invoices
- Notifications: toggle per type (email + in-app)
- Language preference (EN / FR / AR)

---

## 8. Brand Mobile App — Full Flow

> **Mobile = Monitor & Respond. Web = Create & Setup.**
> Brands create campaigns on web. Mobile is for real-time management.

### 8.1 Auth
- Login only (no registration on mobile)
- Email + password OR Google
- Face ID / fingerprint for returning users

### 8.2 Bottom Navigation (5 tabs)
```
🏠 Home  |  🏆 Contests  |  🤝 Deals  |  👥 Creators  |  🔔 Notif
```

### 8.3 Home Tab
- Greeting with brand name
- "Needs your attention" alerts (submissions to review, contests ending)
- Stats summary (views, spent, submissions, creators)
- Active campaigns list
- New Campaign shortcut button

### 8.4 Contests Tab
- Filterable list: All / Live / Ended / Draft
- Contest card: title, status, platform, region, stats
- Tap → Contest detail

### 8.5 Contest Detail
- Status + countdown
- Stats: creators, views, prize pool
- Leaderboard tab: ranked list with flags, views, delta, prizes
- Submissions tab: thumbnail grid, tap to view
- Watch video inline per submission

### 8.6 Deals Tab
- Filterable list: All / Open / Closed / Draft
- Deal card: title, status, platform, pending count
- Tap → Deal detail

### 8.7 Deal Detail
- Applications tab: creator cards with stats + bid
- Approve / Decline actions
- Approved tab: submission status
- Submission review screen: full-width video player, accept/decline/request edits

### 8.8 Creators Tab
- Search + simplified filters (region, platform, niche)
- Creator cards with quick Save / Invite actions
- My Lists tab

### 8.9 Notifications Tab
- Grouped by Today / Yesterday / Earlier
- Tap any notification → relevant screen
- Mark all as read

### 8.10 Profile & Settings
- Brand info display
- Plan status + upgrade CTA
- Language toggle (EN / FR / AR)
- Push notifications toggle
- Email notifications toggle
- Face ID toggle
- Billing, Terms, Privacy, Support links
- Logout

---

## 9. Creator Mobile App — Full Flow

> Phase 3 — Built after brand-side validation.

### 9.1 Auth & Onboarding
```
Splash screen
       ↓
Sign up (email / Google / Apple)
       ↓
Email verification (6-digit OTP)
       ↓
Creator profile setup
  - Display name
  - Country
  - Niche (multi-select)
  - Content language
  - Profile photo
       ↓
Connect social accounts (Phyllo SDK)
  - TikTok
  - Instagram
  - YouTube
  (minimum 1 required)
       ↓
Phyllo fetches and verifies stats
       ↓
Profile ready — Home feed unlocked
```

### 9.2 Bottom Navigation (5 tabs)
```
🏠 Home  |  🔍 Browse  |  📥 My Work  |  💰 Earnings  |  👤 Profile
```

### 9.3 Home Tab
- Personalized feed of matching contests and deals
- Matched by niche, region, platform, follower count
- Quick apply CTAs

### 9.4 Browse Tab
- Search bar
- Filters: type (contest/deal), platform, niche, prize amount, region
- Contest cards: brand logo, title, platform, prize pool, days left, creator count
- Deal cards: brand logo, title, platform, budget range, deadline

### 9.5 Contest Detail (Creator View)
- Brief, rules, Dos & Don'ts
- Prize structure
- Deadline + days remaining
- Current leaderboard (see competition)
- Submit post URL button
- Submission status (if already submitted)
- View count tracker on their own submission

### 9.6 Deal Detail (Creator View)
- Brief, deliverable spec, Dos & Don'ts
- Budget info
- Brand info (name, industry, country)
- Application deadline
- Apply button → opens application form

### 9.7 Apply to Deal
```
Propose bid ($)
Write a short pitch (optional)
Select which social account to post on
Submit application
       ↓
Status: Pending review
       ↓
Brand approves / declines
       ↓
If approved: Brief confirmed, start creating
       ↓
Submit post URL when published
       ↓
Brand reviews
       ↓
Approved → payment released
OR
Edits requested → revise and resubmit
```

### 9.8 My Work Tab
- Active submissions (contests + deals in progress)
- Pending applications
- Completed work with payout status
- Revision requests with brand feedback

### 9.9 Earnings Tab
- Total earned (all time)
- Pending payouts
- Paid out
- Earnings history (per campaign)
- Payout method settings (Stripe / Chargily)
- Withdraw button

### 9.10 Profile Tab
- Display stats (Phyllo-synced, auto-updated)
- Connected platforms with verification badges
- Edit profile
- Notification settings
- Language toggle (EN / FR / AR)
- Support + logout

---

## 10. Contests — System Logic

### States
```
Draft → Live → Ended → Reviewing → Paid Out
         ↑
      (published by brand, funded)
```

### Leaderboard Calculation
- Primary metric: total video views
- Secondary tiebreaker: engagement rate
- Views fetched via Phyllo every 6–12 hours
- Each fetch stored as a time-series snapshot
- Leaderboard ranked by latest snapshot

### Winner Determination
```
Contest deadline reached
       ↓
Final Phyllo sync triggered (last data pull)
       ↓
Rankings frozen
       ↓
Winners calculated based on prize structure
       ↓
Brand notified — 48h dispute window opens
       ↓
If no dispute: payouts auto-released
If dispute: admin reviews, manual resolution
```

### Pay-Per-View Model (Alternative)
```
Views tracked per submission
       ↓
At contest end: views × rate = payout per creator
       ↓
Total capped at maximum payout amount
       ↓
Each eligible creator paid their calculated amount
```

### Content Ownership
- Brand owns all submitted content upon payout
- Platform grants brand a perpetual license on approval
- Creators retain credit (their name stays on post)

---

## 11. Deals — System Logic

### States
```
Draft → Open → Closed (deadline reached or max accepted)
                  ↓
              Per Creator:
         Pending → Approved → Submitted → Accepted → Paid
                           ↘ Declined
                                    ↘ Edits Requested → Resubmitted
```

### Application Flow
```
Deal published
       ↓
Creators discover and apply (propose bid + pitch)
       ↓
Brand reviews creator card (Phyllo stats)
       ↓
Brand approves or declines
       ↓
If approved: creator notified, starts creating
       ↓
Creator publishes on their channel
       ↓
Creator submits post URL in app
       ↓
Brand reviews video
       ↓
Accept  → payment charged → payout to creator
Edits   → feedback sent → creator revises → resubmits
Decline → no payment → slot reopened
```

### Revision Limits
- Defined by brand at deal creation (0 / 1 / 2)
- Counter tracked per creator per deal
- After max revisions: brand must accept or decline

### Budget Handling
- No escrow for deals (unlike contests)
- Payment only triggered on brand acceptance
- Brand card charged at moment of acceptance
- Creator receives payout minus 10% platform fee

---

## 12. Creator Database — System Logic

### Data Source
- All stats sourced from Phyllo (OAuth-verified)
- Profile stats refreshed every 24 hours via background job
- "Phyllo Verified" badge shown on all connected accounts

### Filters
| Filter | Options |
|---|---|
| Region | All MENA / Algeria / Gulf / North Africa / Worldwide |
| Platform | TikTok / Instagram / YouTube (multi-select) |
| Followers | Nano (1k–10k) / Micro (10k–50k) / Mid (50k–500k) / Macro (500k+) |
| Avg Views | <10k / 10k–100k / 100k–500k / 500k+ |
| Engagement | <3% / 3–6% / 6%+ |
| Niche | Beauty / Fashion / Tech / Gaming / Food / Fitness / Travel / Finance / Parenting / Music / Comedy / Education / Pets |
| Language | Arabic / French / English / Darija |
| Verified | Phyllo verified only toggle |

### Access by Plan
| Feature | Free Trial | Starter | Growth | Scale |
|---|---|---|---|---|
| Browse database | ✅ | ✅ | ✅ | ✅ |
| Filters | Region + Platform | All | All | All |
| Full profile | ❌ Blurred | ✅ | ✅ | ✅ |
| Invite to Deal | ❌ | ✅ | ✅ | ✅ |
| Save to list | ❌ | 1 list | 10 lists | Unlimited |
| CSV export | ❌ | ❌ | ❌ | ✅ |

---

## 13. Notifications System

### Types & Triggers

#### Contest Notifications (Brand)
| Event | Channel |
|---|---|
| New submission received | Email + In-app |
| Submission hit views milestone (100k, 500k, 1M) | Email + In-app |
| Contest ending in 48h | Email + In-app |
| Contest ended — review winners | Email + In-app |
| Payout released to winners | Email + In-app |

#### Deal Notifications (Brand)
| Event | Channel |
|---|---|
| New application received | Email + In-app |
| Creator submitted video | Email + In-app |
| Creator requesting clarification | In-app |
| Application deadline approaching (24h) | Email + In-app |

#### Billing Notifications (Brand)
| Event | Channel |
|---|---|
| Payment successful | Email + In-app |
| Payout released | Email + In-app |
| Invoice available | Email |

#### Creator Notifications
| Event | Channel |
|---|---|
| Application approved | Push + Email |
| Application declined | Push + Email |
| Brand requested edits | Push + In-app |
| Submission accepted | Push + Email |
| Payout released | Push + Email |
| Contest ending soon (submitted) | Push |
| New contest/deal matching profile | Push (weekly digest) |

### Delivery Channels
- In-app notification center (all)
- Email (configurable per type in settings)
- Push notifications (mobile apps only)

---

## 14. Escrow & Payout Logic

### Contest Escrow
```
Brand funds prize pool + 10% fee at contest launch
       ↓
Total held in escrow (Stripe Payment Intent / Chargily hold)
       ↓
Contest runs
       ↓
Contest ends → 48h dispute window
       ↓
No dispute → auto-release to winners via Stripe Connect
Dispute opened → admin reviews → manual resolution
       ↓
Platform retains 10% fee
Remaining released to winners proportionally
```

### Deal Payment
```
No escrow — pay on approval model
       ↓
Brand approves creator submission
       ↓
Brand card charged (bid amount + 10% fee)
       ↓
Creator receives bid amount via Stripe Connect or Chargily
       ↓
Platform retains 10% fee
```

### Failed Payments
- Retry 3 times over 24 hours
- Brand notified on failure
- Deal/contest paused until payment resolved
- Creator notified if payout fails with resolution timeline

---

## 15. Database Schema

### users
```
id, email, password_hash, full_name, role (brand/creator/admin),
country, language_pref, avatar_url, created_at, updated_at
```

### brand_profiles
```
id, user_id, company_name, industry, company_size,
website, logo_url, country, plan (free/starter/growth/scale),
trial_contests_used, trial_deals_used, stripe_customer_id,
chargily_customer_id, created_at
```

### creator_profiles
```
id, user_id, display_name, country, niche[], content_language[],
bio, is_verified, phyllo_user_id, created_at
```

### creator_social_accounts
```
id, creator_id, platform (tiktok/instagram/youtube),
username, follower_count, avg_views, engagement_rate,
phyllo_account_id, access_token (encrypted),
last_synced_at, created_at
```

### contests
```
id, brand_id, title, description, instructions,
dos[], donts[], inspiration_links[], asset_urls[],
platform[], region[], content_language[], min_followers,
duration_days, prize_type (fixed/per_view),
prize_pool, prize_distribution (json), per_view_rate,
per_view_cap, platform_fee, status (draft/live/ended/paid),
starts_at, ends_at, created_at
```

### deals
```
id, brand_id, title, description, deliverable,
dos[], donts[], inspiration_links[], asset_urls[],
platform[], region[], follower_range, niche[],
content_language[], application_deadline,
max_creators, budget_type (fixed/range/creator),
budget_min, budget_max, revision_limit,
status (draft/open/closed), created_at
```

### contest_submissions
```
id, contest_id, creator_id, social_account_id,
post_url, video_id, platform, status (active/disqualified),
submitted_at, created_at
```

### submission_stats_snapshots
```
id, submission_id, views, likes, shares, comments,
fetched_at
```

### deal_applications
```
id, deal_id, creator_id, social_account_id,
proposed_bid, pitch, status (pending/approved/declined),
revision_count, applied_at
```

### deal_submissions
```
id, application_id, post_url, video_id, platform,
status (pending/accepted/edits_requested/declined),
brand_feedback, submitted_at, reviewed_at
```

### payments
```
id, brand_id, type (contest_fund/deal_payment),
reference_id (contest_id or deal_submission_id),
amount, fee, currency, provider (stripe/chargily),
status (pending/held/released/failed),
stripe_payment_intent_id, chargily_payment_id,
created_at
```

### creator_payouts
```
id, creator_id, type (contest_prize/deal_payment),
reference_id, amount, currency,
provider (stripe_connect/chargily),
status (pending/processing/paid/failed),
paid_at, created_at
```

### creator_lists
```
id, brand_id, name, created_at
```

### creator_list_members
```
id, list_id, creator_id, added_at
```

### notifications
```
id, user_id, type, title, body,
reference_type, reference_id,
is_read, created_at
```

---

## 16. Page & Screen Map

### Brand Web App
| Route | Screen |
|---|---|
| `/` | Landing page |
| `/signup` | Registration step 1 |
| `/signup/verify` | Email OTP verification |
| `/signup/profile` | Brand profile setup |
| `/signup/payment` | Forced payment method |
| `/signup/welcome` | Welcome + quick actions |
| `/login` | Login |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password |
| `/dashboard` | Main dashboard |
| `/contests` | Contests list |
| `/contests/new` | Contest creation (4 steps) |
| `/contests/:id` | Contest detail + leaderboard |
| `/deals` | Deals list |
| `/deals/new` | Deal creation (4 steps) |
| `/deals/:id` | Deal applications + submissions |
| `/deals/:id/submission/:sid` | Submission review |
| `/creators` | Creator database |
| `/creators/:id` | Creator profile |
| `/creators/lists` | Saved creator lists |
| `/analytics` | Analytics overview |
| `/library` | Content library |
| `/settings` | Settings (all tabs) |
| `/upgrade` | Pricing + upgrade |

### Brand Mobile App
| Screen | Purpose |
|---|---|
| Splash | App loading |
| Login | Authentication |
| Home | Dashboard + alerts |
| Contests | Contests list |
| Contest Detail | Leaderboard + submissions |
| Deal List | Deals list |
| Deal Detail | Applications + submissions |
| Submission Review | Watch + approve inline |
| Creator Database | Browse + filter |
| Creator Profile | Stats + invite |
| My Lists | Saved creators |
| Notifications | All alerts |
| Profile / Settings | Account + preferences |

### Creator Mobile App
| Screen | Purpose |
|---|---|
| Splash | App loading |
| Sign Up | Registration |
| Email Verify | OTP verification |
| Creator Profile Setup | Name, niche, country |
| Connect Socials | Phyllo OAuth |
| Home Feed | Matched opportunities |
| Browse | Search + filter all campaigns |
| Contest Detail | View + submit |
| Deal Detail | View + apply |
| Apply to Deal | Bid + pitch form |
| My Work | Active submissions + applications |
| Submission Status | Track review status |
| Earnings | Payout history + withdraw |
| Profile | Stats + settings |
| Notifications | All alerts |

---

*Document version 1.0 — covers Brand Web App, Brand Mobile App, Creator Mobile App, Contests, Deals, Creator Database, Payments, and Data Infrastructure.*
