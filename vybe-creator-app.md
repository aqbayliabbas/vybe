# Vybe — Creator Mobile App
## Complete System, Workflow & Screen Documentation

> Supply-side mobile app for the Vybe creator-brand marketplace
> Target market: MENA (Algeria, Gulf, North Africa) + Worldwide
> Version 1.0

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Creator Profiles](#2-target-creator-profiles)
3. [Core Principles](#3-core-principles)
4. [Tech Stack](#4-tech-stack)
5. [Onboarding Flow](#5-onboarding-flow)
6. [Personality Quiz System](#6-personality-quiz-system)
7. [Main App Structure](#7-main-app-structure)
8. [Contest Flow](#8-contest-flow)
9. [Deal Flow](#9-deal-flow)
10. [My Work System](#10-my-work-system)
11. [Wallet & Payouts](#11-wallet--payouts)
12. [Gamification System](#12-gamification-system)
13. [Notifications System](#13-notifications-system)
14. [Settings & Account](#14-settings--account)
15. [Screen Schemas](#15-screen-schemas)
16. [Complete Screen Map](#16-complete-screen-map)

---

## 1. Product Overview

Vybe is the creator-facing mobile app of the Vybe marketplace platform. Creators discover brand opportunities (Contests and Deals), submit their social media content, track performance, earn money, and level up through a gamified progression system.

### Two Ways to Earn

**Contests**
Brand posts a brief and prize pool. Creator posts organic content on their own social channel, submits the URL, and competes against other creators by views. Top performers win the prize money. Leaderboard tracked automatically via Phyllo.

**Deals**
Brand posts a brief with targeting criteria. Creator reads the brief, creates and posts the content on their channel, then applies by submitting their post URL + a proposed bid. Brand reviews the actual post and approves or declines. Creator gets paid only on approval.

### Key Philosophy
> Every time a creator opens Vybe they should see money they can earn.
> The app feels like an opportunity machine, not a business tool.

---

## 2. Target Creator Profiles

### Nano — 1k to 10k followers
- Students and hobbyists
- First time getting paid for content
- Need simple flows and low barrier to apply
- Primary target for MVP launch

### Micro — 10k to 50k followers
- Semi-professional creators
- Already doing informal brand deals via DMs or WhatsApp
- Want structure, reliability, and guaranteed payment
- Primary target for MVP launch

### Mid — 50k to 500k followers
- Professional creators
- Selective about brand fit
- Compare opportunities across platforms

### Macro — 500k+ followers
- Approached by brands directly
- Use Vybe for discovery and bulk deals
- Expect premium experience and fast payouts

---

## 3. Core Principles

- Feed-based visual design, closer to TikTok than a SaaS tool
- Post first, then apply — creators post content organically, then submit the URL as their application. No fake applications, brands see real engagement.
- Phyllo-verified stats — all follower counts, views, and engagement rates are verified via Phyllo OAuth. Not self-reported.
- Gamification at every step — levels, badges, streaks, challenges, leaderboards drive daily engagement and retention
- Trilingual — English, French, Arabic with full RTL support
- Minimum payout threshold — creators need a minimum balance before withdrawing (recommended: $20 for Algeria, $20 for Gulf, adjustable by market)

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Mobile Framework | React Native (iOS + Android) |
| Auth | Supabase Auth + Google + Apple OAuth |
| Social Data | Phyllo SDK + Phyllo API |
| Payments (Algeria) | Chargily — CIB, BaridiMob, Dahabia |
| Payments (International) | Stripe Connect |
| Push Notifications | Expo Notifications / Firebase FCM |
| i18n | react-i18next (EN / FR / AR + RTL) |
| Backend | Shared with brand web app (Node.js + Supabase) |
| Analytics | Shared stats snapshots from Phyllo polling |

---

## 5. Onboarding Flow

### Step 1 — Account Creation
```
Welcome screen
      ↓
Create account
  - Full name
  - Email
  - Password
  OR
  - Continue with Google
  - Continue with Apple
      ↓
Email verification (6-digit OTP, 60s resend cooldown)
```

### Step 2 — Basic Profile Info (Required)
```
- Profile photo (required, not skippable)
- Display name
- Phone number (with country code)
- Date of birth
- Gender (Male / Female / Prefer not to say)
```

### Step 3 — Location & Content Niche
```
- Country (dropdown)
- City (dropdown)
- Niche selection (pick up to 3):
    Beauty, Fashion, Tech, Gaming, Food, Travel,
    Fitness, Comedy, Music, Education, Pets, Finance
- Content language (multi-select):
    Arabic, Darija, French, English
```

### Step 4 — Connect Social Accounts (Phyllo)
```
- Connect via Phyllo OAuth (minimum 1 required)
- Supported: TikTok, Instagram, YouTube
- Read-only access — Vybe never posts on creator's behalf
- Phyllo fetches and verifies stats automatically
- "Phyllo Verified" badge applied to profile
```

### Step 5 — Payout Setup (Optional at signup, required before first withdrawal)
```
- Chargily (Algeria — CIB, BaridiMob, Dahabia)
- Stripe Connect (international)
- Can skip and add later in wallet settings
```

### Step 6 — Personality Quiz (see Section 6)

### Step 7 — Creator Type Reveal + Home Feed Unlocked

---

## 6. Personality Quiz System

### Purpose
- Personalize the opportunity feed from day one
- Make onboarding fun and memorable, not a form
- Understand creator personality to improve brand matching
- Generate a Creator Type identity that creators are proud of

### Format
- 10 questions maximum
- Multiple choice, tap to select
- Auto-advances on tap (no next button)
- Progress bar fills as questions complete
- Skippable (can complete later in settings)

### Questions

**Q1 — Posting frequency**
- Every day
- Few times a week
- Once a week
- Whenever I feel like it

**Q2 — Content type**
- Funny / Comedy
- Beauty / Fashion
- Tech / Gaming
- Food / Travel
- Fitness / Health
- Lifestyle / Vlogs
- Education
- Music / Dance

**Q3 — Main platform**
- TikTok
- Instagram
- YouTube
- All of them

**Q4 — Posting style**
- Planned and scripted
- Spontaneous and raw
- Mix of both

**Q5 — Motivation to create**
- Express myself
- Build a community
- Earn money
- Have fun
- Become famous

**Q6 — Feeling about brand deals**
- Love them — easy money
- Open but selective
- Never done one, curious
- Hate selling, prefer organic

**Q7 — Content language**
- Arabic
- Darija
- French
- English
- Mix

**Q8 — How followers describe you**
- Funny
- Inspiring
- Informative
- Relatable
- Aesthetic
- Honest

**Q9 — Dream brand collab**
- Fashion / Beauty
- Tech / Gaming
- Food / Drinks
- Travel / Lifestyle
- Sports / Fitness
- Any paid deal tbh 😂

**Q10 — Why did you join Vybe**
- Get paid for my content
- Work with brands I love
- Grow my audience
- A friend referred me
- Just exploring

### Creator Types (Result)

| Type | Icon | Profile |
|---|---|---|
| The Trendsetter | 🔥 | Beauty / Fashion dominant |
| The Expert | 🎮 | Tech / Gaming / Education |
| The Entertainer | 😂 | Comedy / Music |
| The Explorer | 🌍 | Travel / Lifestyle |
| The Motivator | 💪 | Fitness / Health |

Creator type is used to:
- Personalize the home feed
- Surface relevant contests and deals first
- Display on public profile (visible to brands)

---

## 7. Main App Structure

### Bottom Navigation (5 tabs)
```
🏠 Home  |  🔍 Explore  |  📥 My Work  |  💰 Wallet  |  👤 Profile
```

### Home Tab
- Personalized feed of matching contests and deals
- Matched by niche, region, platform, follower count
- Streak status and level progress bar
- Weekly challenge progress
- Needs-attention alerts (edits requested, pending reviews)
- Mini leaderboard preview (creator's position in their niche + region)

### Explore Tab
- Search bar
- Filter by type (contest / deal), platform, budget, region, niche
- All eligible campaigns shown (locked campaigns shown with reason)
- Sort: Best Match / Newest / Highest Prize

### My Work Tab
- Active: in-progress contests and deals
- Pending: applications awaiting brand response
- Completed: history with earnings per campaign

### Wallet Tab
- Available balance
- Pending balance
- Lifetime earnings
- Vybe rewards breakdown (bonuses, streak rewards, challenges)
- Transaction history
- Withdraw button

### Profile Tab
- Creator stats (Phyllo-synced)
- Level + Vybe Score
- Connected platforms with verified badges
- Badges collection
- Leaderboard access
- Challenges access
- Referral program
- Settings

---

## 8. Contest Flow

### Discovery
```
Home feed or Explore tab
      ↓
Contest card shows:
  - Brand name + logo
  - Contest title
  - Platform + region
  - Prize pool + distribution
  - Days remaining
  - Number of creators competing
  - Eligibility status (✅ qualify / 🔒 locked)
```

### Locked Campaigns
Campaigns where the creator does not meet minimum follower requirements are shown with a locked state:
- "🔒 Need 5k more followers to qualify"
- Motivates creators to grow rather than hiding the opportunity

### Contest Detail Screen
- Brief and instructions
- Dos and Don'ts
- Prize structure (1st / 2nd / 3rd or pay-per-view)
- Deadline countdown
- Current leaderboard (creator sees competition)
- Inspiration links and brand assets

### Joining a Contest
```
Creator reads brief
      ↓
Creates and posts content on their social channel
      ↓
Opens Vybe → Join Contest
      ↓
Pastes their post URL
      ↓
Selects which connected account was used
      ↓
Submits
      ↓
Phyllo begins tracking views automatically
      ↓
Creator appears on leaderboard
      ↓
Views updated every 6–12 hours
      ↓
Contest ends → winners determined → payouts released
```

### Contest Tracker (Live)
- Current view count
- Likes, comments on submission
- Views gained today
- Current rank
- Views needed to reach next prize position
- Mini views-over-time chart
- Full leaderboard

---

## 9. Deal Flow

### Discovery
Same as contests — home feed or explore tab. Deal card shows:
- Brand name + logo
- Deal title
- Platform + region
- Budget range or fixed rate
- Spots remaining
- Application deadline
- Eligibility status

### Deal Detail Screen
- Full brief and deliverable specification
- Dos and Don'ts
- Budget information
- Brand info (name, industry, country, rating, past deals on Vybe)
- How it works (step-by-step: post → submit URL → get paid)
- Inspiration references

### How Deals Work (Post First Model)
```
Creator reads brief carefully
      ↓
Creates content following the brief guidelines
      ↓
Posts on their social channel organically
      ↓
Opens Vybe → Apply to Deal
      ↓
Pastes post URL
      ↓
Selects connected account
      ↓
Enters proposed bid (within brand's budget range)
      ↓
Adds optional note to brand
      ↓
Submits application
      ↓
Brand reviews the actual live post + creator stats
      ↓
Brand approves → creator paid
Brand requests edits → creator revises and resubmits
Brand declines → no payment
```

### Revision System
- Brand sets revision limit at deal creation (0 / 1 / 2)
- Creator sees revision count remaining
- After max revisions: brand must accept or decline
- Each revision request includes written feedback from brand

### Payment Trigger
Payment is only charged to the brand when they accept a submission. Creator receives bid amount minus 10% platform fee. Funds appear in Vybe wallet within 24 hours.

---

## 10. My Work System

### Active Tab
Shows all currently in-progress work:
- Live contest submissions (with current rank + views)
- Approved deal applications (awaiting or resubmitting)
- Deals with edits requested (with deadline + brand feedback)

### Pending Tab
Shows all submitted applications awaiting brand response:
- Deal applications submitted, not yet reviewed
- Shows bid amount, application date, brand response deadline
- Auto-expires if brand doesn't respond within set window

### Completed Tab
Full history of all finished work:
- Contest results (rank, views, amount earned)
- Approved deals (amount earned, date)
- Declined applications
- Badge contributions noted per item

---

## 11. Wallet & Payouts

### Wallet Structure
```
Available Balance    — ready to withdraw
Pending Balance      — awaiting payout processing
Lifetime Earned      — total all-time earnings
Vybe Rewards         — bonuses from streaks, challenges, referrals
```

### Payout Methods
- Chargily — CIB, BaridiMob, Dahabia (Algeria)
- Stripe Connect — Visa, Mastercard (international)
- Multiple methods can be saved

### Withdrawal Rules
- Minimum withdrawal: $20
- Estimated arrival: 1–3 business days
- Creator can select amount or withdraw all available balance
- Quick select buttons: $50 / $100 / $200 / All

### Transaction History
Each transaction shows:
- Type (deal payment / contest prize / streak bonus / challenge reward / referral credit / withdrawal)
- Amount
- Date
- Campaign reference
- Status (completed / pending / failed)

### Vybe Rewards Breakdown
Separate from earned income — shows all platform bonuses:
- Streak bonuses
- Challenge completion rewards
- Referral credits
- Welcome bonus (if applicable)

---

## 12. Gamification System

### Creator Levels

| Level | Icon | Earnings Range | Perks |
|---|---|---|---|
| Seed | 🌱 | $0 – $99 | Basic access |
| Rising | ⚡ | $100 – $499 | Priority in deal applications, Rising badge |
| Hot | 🔥 | $500 – $1,999 | Early contest access (24h before public), Hot badge |
| Elite | 💎 | $2,000 – $9,999 | Featured in brand creator database, lower payout threshold, Elite badge |
| Legend | 👑 | $10,000+ | Dedicated account manager, exclusive brand deals, Legend badge |

Level progress bar shown on home screen and profile. Fills based on total lifetime earnings.

---

### Badges

#### Performance Badges
| Badge | Icon | Trigger |
|---|---|---|
| First Win | 🏆 | Won first contest |
| Top Performer | 🥇 | Finished #1 in a contest |
| Million Views | 📈 | Hit 1M views on single submission |
| Quick Draw | ⚡ | Applied within 1 hour of deal going live |
| Repeat Collab | 🔁 | Same brand worked with creator twice |

#### Consistency Badges
| Badge | Icon | Trigger |
|---|---|---|
| 7-Day Streak | 📅 | Active 7 consecutive days |
| 30-Day Streak | 🗓 | Active 30 consecutive days |
| 10 Deals Done | 🎯 | Completed 10 approved deals |
| 50 Deals Done | 🏅 | Completed 50 approved deals |

#### Community Badges
| Badge | Icon | Trigger |
|---|---|---|
| Referral Star | 🤝 | Referred 3+ creators who signed up |
| MENA Pride | 🌍 | First creator from their country on Vybe |
| Top Rated | 💬 | Received 5-star rating from 3+ brands |

#### Special Badges
| Badge | Icon | Trigger |
|---|---|---|
| OG Creator | 🎂 | Joined in first 3 months of platform launch |
| Trending | 🔥 | Post reached 500k+ views |
| Legend | 👑 | Reached Legend level |

Badges are permanent, displayed on creator profile, and visible to brands in the creator database.

---

### Post-Approval Celebration Flow

Triggered every time a brand approves a deal submission:

```
Brand approves video
      ↓
Full-screen celebration (confetti animation)
"Your video was approved!"
Brand name + deal title
      ↓
Earnings card slides in:
  💰 +$80 added to your wallet
  New total: $340
      ↓
Level progress bar animates:
  🔥 Hot → 💎 Elite
  ████████░░  $160 to go
      ↓
Badge check:
  If badge unlocked → "New badge: 10 Deals Done! 🏅"
      ↓
Share moment (optional):
  [Share to Instagram Story]
  [Share to TikTok]
      ↓
CTAs:
  [Find Next Deal]  [View Earnings]
```

---

### Streak System

A daily streak is maintained by opening the app and completing an action (apply, submit, browse for 2+ minutes).

| Streak | Reward |
|---|---|
| 3-day streak | +5% boost on next payout |
| 7-day streak | Quick Draw badge unlock + early deal access |
| 30-day streak | +10% boost on next payout |

- Streak counter shown on home screen
- Breaking a streak resets counter to zero
- Streak freeze: 1 available per month (earned via challenges, not purchased)

---

### Weekly & Monthly Challenges

#### Weekly Challenges (reset every 7 days)
| Challenge | Reward |
|---|---|
| Apply to 3 deals this week | +$5 wallet bonus |
| Get 100k views on any submission | Rising badge progress +50% |
| Be first to apply to a new deal | Quick Draw badge progress |

#### Monthly Challenges
| Challenge | Reward |
|---|---|
| Win a contest this month | Hot badge unlock |
| Earn $200 this month | Level up boost +20% |
| Complete 5 deals this month | Featured on leaderboard |

Challenges shown as progress cards on home screen. Progress tracked automatically.

---

### Leaderboard

```
Scope options:
  - 🌍 Worldwide
  - 📍 By country (Algeria, UAE, KSA, etc.)
  - 🎯 My niche (Beauty, Tech, Gaming, etc.)

Time period:
  - Weekly
  - Monthly
  - All time

Shows:
  - Rank
  - Username + flag
  - Views this period
  - Creator level badge
  - Creator's own position highlighted
```

Being visible on the leaderboard attracts brand invites from the creator database.

---

### Vybe Score (Visible to Brands)

A single score from 0 to 100 shown on creator profile in the brand database.

| Factor | Weight |
|---|---|
| Deals completed on time | 30% |
| Brand approval rate | 30% |
| Average video views | 20% |
| Engagement rate | 10% |
| Profile completeness | 10% |

Higher score = ranked higher in brand search results. Drives creators to maintain quality and consistency.

---

### Referral System

```
Creator shares unique referral link
      ↓
Friend signs up via link
      ↓
Friend completes first deal
      ↓
Referrer receives: $10 wallet credit
New creator receives: $5 welcome bonus

After 3 referrals → Referral Star badge
After 10 referrals → $50 bonus + leaderboard feature
```

---

## 13. Notifications System

### Types and Triggers

#### Contest Notifications
| Event | Channel |
|---|---|
| Submission confirmed | In-app |
| Views milestone hit (10k, 100k, 500k, 1M) | Push + In-app |
| Rank change (moved up or down) | Push + In-app |
| Contest ending in 24h | Push + Email |
| Contest ended — final result | Push + Email |
| Payout released (winner) | Push + Email |

#### Deal Notifications
| Event | Channel |
|---|---|
| Application submitted confirmation | In-app |
| Application approved by brand | Push + Email |
| Application declined | Push + In-app |
| Edits requested | Push + In-app |
| Submission accepted + paid | Push + Email |
| Application deadline approaching | Push |

#### Wallet Notifications
| Event | Channel |
|---|---|
| Payment received | Push + Email |
| Withdrawal processed | Email |
| Withdrawal failed | Push + Email |

#### Gamification Notifications
| Event | Channel |
|---|---|
| New badge unlocked | Push + In-app |
| Level up | Push + In-app |
| Streak reminder (23h of inactivity) | Push |
| Streak broken | Push |
| Challenge completed | In-app |
| Challenge about to expire | Push |
| Weekly leaderboard result | Push |

#### Platform Notifications
| Event | Channel |
|---|---|
| New opportunity matching profile | Push (max 1/day) |
| Referral completed | Push + In-app |
| New feature announcement | In-app |

All notification types are individually toggleable in settings.

---

## 14. Settings & Account

### Account Section
- Connected social platforms (add / remove via Phyllo)
- Payout methods (add / remove Stripe Connect or Chargily)
- Phone number (edit)
- Change password
- Two-factor authentication (future)

### Preferences
- Language: English / Français / العربية
- Push notifications toggle (global)
- Email notifications toggle (global)
- Individual notification type toggles
- Face ID / biometric login toggle

### Vybe Section
- My badges
- Leaderboard
- Challenges
- Refer & Earn

### Support
- Help center
- Contact support
- Terms of Service
- Privacy Policy

### Danger Zone
- Logout
- Delete account (with confirmation flow)

---

## 15. Screen Schemas

---

### PHASE 1 — SPLASH & AUTH

#### Screen 1.1 — Splash Screen
```
(full screen gradient background)

              ⚡ VYBE

      Where creators get paid
```

#### Screen 1.2 — Welcome
```
(full screen visual — creator collage)

              ⚡ VYBE

      Get paid for content
       you already make

  ┌─────────────────────────────────┐
  │ Swipe cards:                    │
  │ 💰 "@sarra earned $250 today"   │
  │ 🏆 "@karim won a contest"       │
  │ 🔥 "@lina hit 1M views"         │
  └─────────────────────────────────┘

      [    Create Account    ]
      [    Login             ]

        EN  |  FR  |  العربية
```

#### Screen 1.3 — Create Account
```
←

     Create your account

  Full Name
  [                              ]

  Email
  [                              ]

  Password
  [                              ] 👁

  Confirm Password
  [                              ] 👁

  [ ] I agree to Terms & Privacy Policy

  [        Continue        ]

  ─────────── or ───────────

  [G]  Continue with Google
  [🍎] Continue with Apple

  Already have an account? Login
```

#### Screen 1.4 — Email Verification
```
←

             ✉️
        Check your inbox

  We sent a 6-digit code to
  your@email.com

  [ _ ] [ _ ] [ _ ] [ _ ] [ _ ] [ _ ]

  [        Verify        ]

  Didn't receive it?
  Resend code (59s)

  Wrong email? Go back
```

#### Screen 1.5 — Login
```
←
          Welcome back ⚡

  Email
  [                              ]

  Password
  [                              ] 👁

  [        Login        ]

  Forgot your password?

  ─────────── or ───────────

  [G]  Continue with Google
  [🍎] Continue with Apple

  Don't have an account? Sign up
```

---

### PHASE 2 — PROFILE SETUP

#### Screen 2.1 — Basic Info
```
Step 1 of 4   ●○○○
[████░░░░░░░░░░░░░░░░]

      Let's set up your profile

  Profile Photo
  ┌──────────────────────────────────┐
  │           [  +  ]                │
  │       Upload a photo             │
  │         (required)               │
  └──────────────────────────────────┘

  Display Name
  [                              ]

  Phone Number
  [🇩🇿 +213  |                  ]

  Date of Birth
  [  DD / MM / YYYY           📅 ]

  Gender
  ○ Male    ○ Female    ○ Prefer not to say

  [        Continue        ]
```

#### Screen 2.2 — Location & Niche
```
Step 2 of 4   ●●○○
[████████░░░░░░░░░░░░]

      Where are you from?

  Country  [  Algeria 🇩🇿            ▾ ]
  City     [  Algiers               ▾ ]

  ───────────────────────────────────
  What do you create? (pick up to 3)

  [💄 Beauty] [👗 Fashion] [📱 Tech  ]
  [🎮 Gaming] [🍕 Food   ] [✈️ Travel]
  [💪 Fitness] [😂 Comedy] [🎵 Music ]
  [📚 Edu   ] [🐾 Pets   ] [💼 Finance]

  Content Language
  [ ] Arabic  [ ] Darija  [ ] French
  [ ] English

  [        Continue        ]
```

#### Screen 2.3 — Connect Socials
```
Step 3 of 4   ●●●○
[████████████░░░░░░░░]

      Connect your accounts

  Verified stats brands trust.
  Secured via Phyllo. Read-only.

  ┌──────────────────────────────────┐
  │ TikTok                           │
  │ @sarra.dz · 45k followers  ✅    │
  └──────────────────────────────────┘

  ┌──────────────────────────────────┐
  │ Instagram                        │
  │ Not connected      [Connect →]   │
  └──────────────────────────────────┘

  ┌──────────────────────────────────┐
  │ YouTube                          │
  │ Not connected      [Connect →]   │
  └──────────────────────────────────┘

  🔒 We never post on your behalf

  [        Continue        ]
```

#### Screen 2.4 — Payout Setup
```
Step 4 of 4   ●●●●
[████████████████████]

      How do you want to get paid?

  ┌──────────────────────────────────┐
  │ 🌍 Stripe — Visa, Mastercard     │
  │                    [Connect →]   │
  └──────────────────────────────────┘

  ┌──────────────────────────────────┐
  │ 🇩🇿 Chargily — CIB, BaridiMob   │
  │                    [Connect →]   │
  └──────────────────────────────────┘

  💡 Minimum payout: $20
  You can skip and add later.

  [  Skip for now  ]  [  Continue  ]
```

---

### PHASE 3 — ONBOARDING QUIZ

#### Screen 3.1 — Quiz Intro
```
(fun animated background)

            🎯

       Before you start...

  10 quick questions to personalize
  your Vybe experience.

  No wrong answers. Just vibes. ⚡

       [    Let's go! 🚀    ]

       Skip (set up later)
```

#### Screen 3.2 — Quiz Question (Template — all 10 follow this)
```
Question 3 of 10
[██████░░░░░░░░░░░░░░]

      What's your posting style?

  ┌──────────────────────────────────┐
  │  📝  Planned and scripted        │
  └──────────────────────────────────┘

  ┌──────────────────────────────────┐
  │  🎲  Spontaneous and raw         │
  └──────────────────────────────────┘

  ┌──────────────────────────────────┐
  │  ⚡  Mix of both                 │
  └──────────────────────────────────┘

  (tap to select — auto-advances)
```

#### Screen 3.3 — Creator Type Result
```
🎉 (confetti animation)

            🔥

       You're a Trendsetter

  You live for beauty, fashion, and
  aesthetic content. Brands love
  creators like you for product
  launches and lifestyle campaigns.

  ─────────────────────────────────

  Your Vybe profile is ready:

  💄 Niche: Beauty + Fashion
  🇩🇿 Region: Algeria
  📱 Platform: TikTok
  🌱 Level: Seed
  ⭐ Vybe Score: 42

  ─────────────────────────────────

       [    Explore Vybe ⚡    ]
```

---

### PHASE 4 — HOME

#### Screen 4.1 — Home Feed (New Creator)
```
⚡ VYBE                     [🔔] [👤]

Hey Sarra 👋
Ready to earn today?

┌─────────────────────────────────┐
│ 🌱 Seed Level                   │
│ ████░░░░░░  $0 / $100           │
│ $100 to reach ⚡ Rising         │
└─────────────────────────────────┘

─────────────────────────────────

🎯 WEEKLY CHALLENGE
┌─────────────────────────────────┐
│ Apply to 3 deals this week      │
│ ░░░░░░░░░░  0/3                 │
│ Reward: +$5 bonus  [Start →]   │
└─────────────────────────────────┘

─────────────────────────────────

🔥 HOT RIGHT NOW
Matching your profile · Beauty · Algeria

[Contest card — Ramadan Glow Challenge]
[Deal card — Summer Collection Review]
[Deal card — Skincare Routine Video]

[See all opportunities →]

─────────────────────────────────

📊 VYBE LEADERBOARD THIS WEEK
Algeria · Beauty

🥇 @nadia.dz    1.2M views
🥈 @rima.dz     890k views
🥉 @lina.dz     540k views
42  You          — views

[View Full Leaderboard →]
```

#### Screen 4.2 — Home Feed (Active Creator)
```
⚡ VYBE                  [🔔 3] [👤]

Hey Sarra ⚡
You're on a 🔥 5-day streak!

┌─────────────────────────────────┐
│ 🔥 Hot Level                    │
│ ████████░░  $840 / $2,000       │
│ $1,160 to reach 💎 Elite        │
└─────────────────────────────────┘

─────────────────────────────────

⚠️ NEEDS ATTENTION
┌─────────────────────────────────┐
│ ✏️ Edits requested              │
│ Skin Lab Deal · 1 day ago       │
│              [View Feedback →]  │
└─────────────────────────────────┘

─────────────────────────────────

🎯 WEEKLY CHALLENGE
┌─────────────────────────────────┐
│ Apply to 3 deals this week      │
│ ██████░░░░  2/3                 │
│ 1 more to earn +$5 bonus!       │
└─────────────────────────────────┘

─────────────────────────────────

🔥 FOR YOU
[Campaign cards]

─────────────────────────────────

📊 LEADERBOARD — YOU THIS WEEK
🇩🇿 Algeria · Beauty

🥇 @nadia.dz    1.2M views
🥈 @rima.dz     890k views
─────────────────────────────────
🔥 You  #8      245k views  ↑3 spots
─────────────────────────────────
[View Full Leaderboard →]
```

---

### PHASE 5 — EXPLORE

#### Screen 5.1 — Explore Feed
```
🔍 Explore

[🔍 Search brands or campaigns...  ]

[All]  [Contests 🏆]  [Deals 🤝]

Sort: Best Match ▾       [⚙️ Filters]

─────────────────────────────────────

┌─────────────────────────────────┐
│ [Brand Logo]  💄 Glam Beauty    │
│ 🏆 CONTEST                      │
│ "Ramadan Glow Challenge"        │
│ TikTok  ·  🇩🇿 Algeria + Gulf   │
│ 💰 $500 prize  ⏱ 12 days left  │
│ 👥 24 competing                 │
│ Min 5k followers ✅ You qualify  │
│              [View Contest →]   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [Brand Logo]  👗 Modaz Store    │
│ 🤝 DEAL                         │
│ "Summer Collection Review"      │
│ Instagram  ·  🇩🇿 Algeria       │
│ 💰 $60 – $120  👥 3 spots left  │
│ Min 10k followers ✅ You qualify │
│                  [View Deal →]  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [Brand Logo]  📱 TechZone       │
│ 🏆 CONTEST                      │
│ "Unbox & Review Challenge"      │
│ YouTube  ·  🌍 MENA             │
│ 💰 $300 prize  ⏱ 8 days left   │
│ Min 50k followers 🔒 Locked     │
│ Need 5k more followers          │
│          [🔒 Not Eligible Yet]  │
└─────────────────────────────────┘
```

#### Screen 5.2 — Explore Filters
```
← Filters                   [Reset]

Type
○ All   ○ Contests 🏆   ○ Deals 🤝

Platform
[ ] TikTok  [ ] Instagram  [ ] YouTube

Prize / Budget
○ Any  ○ $0–$50  ○ $50–$200  ○ $200+

Region
○ All MENA  ○ Algeria 🇩🇿  ○ Gulf
○ North Africa  ○ Worldwide

Niche
[ ] Beauty  [ ] Fashion  [ ] Tech
[ ] Gaming  [ ] Food  [ ] Fitness
[ ] Travel  [ ] Comedy  [+ More]

Show locked campaigns
● Hide   ○ Show

[        Apply Filters        ]
```

---

### PHASE 6 — CONTEST FLOW

#### Screen 6.1 — Contest Detail
```
←   🏆 Contest

[Brand Logo]  Glam Beauty  ✅

"Ramadan Glow Challenge"

🟢 LIVE  ·  ⏱ 12 days left
TikTok  ·  Algeria + Gulf  ·  Arabic + FR

┌──────────┐  ┌──────────┐  ┌──────────┐
│ 💰 $500  │  │ 👥 24    │  │ 👁 1.2M  │
│ Prize    │  │ Creators │  │ Views    │
└──────────┘  └──────────┘  └──────────┘

PRIZE STRUCTURE
🥇 1st place          $250
🥈 2nd place          $150
🥉 3rd place          $100

─────────────────────────────────────

[Brief ●]  [Leaderboard]  [Rules]

THE BRIEF
Create a TikTok showing your Ramadan
skincare or makeup routine using any
Glam Beauty product.

✅ DOS
· Show the product clearly
· Use #RamadanGlow + @GlamBeauty
· Minimum 30 seconds

❌ DON'TS
· No face filters on product shots
· Don't compare with competitors

📎 Inspiration  [View examples →]

─────────────────────────────────────

✅ You qualify · 45k followers

[    Join This Contest 🚀    ]
```

#### Screen 6.2 — Contest Leaderboard Tab
```
←   🏆 Ramadan Glow Challenge

[Brief]  [Leaderboard ●]  [Rules]

👁 1.2M total views · Updated 2h ago

─────────────────────────────────────
🥇 @nadia.dz  🇩🇿   580k  ↑12k   $250
🥈 @rima.ae   🇦🇪   410k  ↑8k    $150
🥉 @lina.ma   🇲🇦   290k  ↑5k    $100
 4 @med.dz    🇩🇿   180k  ↑3k      —
 5 @nour.sa   🇸🇦   120k  ↑900    —
─────────────────────────────────────
🔥 You  #8    🇩🇿    45k  ↑1.2k    —
─────────────────────────────────────
 9 @sara.dz   🇩🇿    38k  ↑800    —
```

#### Screen 6.3 — Join Contest / Submit URL
```
←   Join Contest

🏆 Ramadan Glow Challenge · Glam Beauty

─────────────────────────────────────

STEP 1
Post your video on TikTok following
the brief guidelines.

STEP 2
Paste your post URL below.

─────────────────────────────────────

Your TikTok post URL
[  https://tiktok.com/@you/video/  ]

Which account?
[ @sarra.dz  ·  TikTok  ·  45k  ▾ ]

┌─────────────────────────────────┐
│ ⚡ Vybe tracks your views       │
│ automatically every few hours.  │
└─────────────────────────────────┘

[    Submit & Join Contest 🚀    ]
```

#### Screen 6.4 — Contest Submission Confirmed
```
🎉 (confetti animation)

            🏆

     You're in the contest!

  Ramadan Glow Challenge · Glam Beauty

  ─────────────────────────────────

  Current rank:  #24 of 25
  Your views:    —
  Prize to win:  up to $250 🥇

  ─────────────────────────────────

  🎯 WEEKLY CHALLENGE PROGRESS
  Apply to 3 deals · ██████░░░░ 2/3
  1 more to earn +$5 bonus!

  ─────────────────────────────────

  [  Track My Progress  ]
  [  Explore More       ]
```

---

### PHASE 7 — DEAL FLOW

#### Screen 7.1 — Deal Detail
```
←   🤝 Deal

[Brand Logo]  Modaz Store  ✅

"Summer Collection Review"

🟢 OPEN  ·  ⏱ Deadline: June 15
Instagram  ·  Algeria  ·  Arabic + FR

┌──────────┐  ┌──────────┐  ┌──────────┐
│💰 $60–120│  │ 👥 3     │  │ 🔁 1 rev │
│ Budget   │  │ Spots    │  │ allowed  │
└──────────┘  └──────────┘  └──────────┘

THE BRIEF
Create an Instagram Reel reviewing
your favourite piece from Modaz
Store's new summer collection.

✅ DOS
· Show at least 2 items
· Mention website link in bio
· Minimum 45 seconds

❌ DON'TS
· No heavy filters on clothing
· Don't mention price unless asked

📎 Inspiration  [View examples →]

─────────────────────────────────────

ABOUT THE BRAND
[Logo] Modaz Store
Fashion · Algeria 🇩🇿
⭐ 4.8 rating  ·  12 deals done

─────────────────────────────────────

HOW THIS WORKS
1️⃣ Read the brief carefully
2️⃣ Create & post your Reel
3️⃣ Submit your post URL + bid
4️⃣ Brand reviews your actual post
5️⃣ Get paid if approved ✅

─────────────────────────────────────

✅ You qualify · 45k followers

[    Apply to This Deal 🚀    ]
```

#### Screen 7.2 — Apply to Deal
```
←   Apply to Deal

🤝 Summer Collection Review · Modaz Store

─────────────────────────────────────

Your Instagram Reel URL
[ https://instagram.com/reel/...   ]

Which account?
[ @sarra.dz · Instagram · 45k   ▾ ]

─────────────────────────────────────

Your Bid
$  [  80                          ]
Budget range: $60 – $120

─────────────────────────────────────

Short note to brand (optional)
┌────────────────────────────────────┐
│                                    │
└────────────────────────────────────┘

─────────────────────────────────────

┌─────────────────────────────────┐
│ ⚡ The brand will review your   │
│ actual post. Make sure it       │
│ follows the brief before        │
│ submitting.                     │
└─────────────────────────────────┘

[    Submit Application 🚀    ]
```

#### Screen 7.3 — Application Submitted
```
🎉 (confetti animation)

            📥

     Application submitted!

  Summer Collection Review · Modaz Store

  ─────────────────────────────────

  Your bid: $80
  Status: Pending review

  Brand will respond within 48 hours.
  You'll get a notification. ⚡

  ─────────────────────────────────

  🎯 WEEKLY CHALLENGE
  ██████████  3/3 ✅
  You earned +$5 bonus! 🎉

  ─────────────────────────────────

  [  Track in My Work  ]
  [  Explore More      ]
```

#### Screen 7.4 — Deal Approved Celebration
```
🎊 (full screen confetti + animation)

            ✅

     Your video was approved!

  Summer Collection Review · Modaz Store

  ─────────────────────────────────

  💰 +$80 added to your wallet
  Your new balance: $340.00

  ─────────────────────────────────

  LEVEL PROGRESS
  🔥 Hot  ████████░░  $160 to 💎 Elite

  ─────────────────────────────────

  🏅 NEW BADGE UNLOCKED!

       🎯  10 Deals Done

  You've completed 10 approved deals.
  Brands can see this on your profile!

  ─────────────────────────────────

  Share your win 📲
  [Share to Instagram]  [Share to TikTok]

  ─────────────────────────────────

  [  Find Next Deal 🔥  ]
  [  View My Wallet     ]
```

#### Screen 7.5 — Edits Requested
```
←   Deal Feedback

🤝 Summer Collection Review
Modaz Store  ·  Revision 1 of 1

─────────────────────────────────────

✏️ The brand requested edits

Brand's feedback:
┌────────────────────────────────────┐
│ Please add the website link in     │
│ your bio and mention discount      │
│ code MODAZ10 in the video.         │
└────────────────────────────────────┘

Received: 3 hours ago
Deadline to resubmit: 3 days left

─────────────────────────────────────

⚠️ This is your last revision.
Make sure your next submission is final.

─────────────────────────────────────

Updated post URL
[ https://instagram.com/reel/...   ]

[    Submit Revision 🚀    ]
```

---

### PHASE 8 — MY WORK

#### Screen 8.1 — My Work Overview
```
📥 My Work

[Active ●]  [Pending]  [Completed]

─────────────────────────────────────
ACTIVE

┌─────────────────────────────────┐
│ 🏆 Ramadan Glow Challenge       │
│ Glam Beauty  ·  Contest         │
│ 🟢 Live · 12 days left          │
│ Your views: 45k  ·  Rank: #8    │
│ Prize if current rank holds: —  │
│              [Track Progress →] │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🤝 Summer Collection Review     │
│ Modaz Store  ·  Deal            │
│ ✏️ Edits requested              │
│ Deadline: 3 days left           │
│              [View Feedback →]  │
└─────────────────────────────────┘

─────────────────────────────────────
PENDING APPLICATIONS

┌─────────────────────────────────┐
│ 🤝 Skincare Routine Video       │
│ Skin Lab  ·  Deal               │
│ ⏳ Awaiting brand review        │
│ Bid: $80  ·  Applied 2 days ago │
└─────────────────────────────────┘
```

#### Screen 8.2 — Completed Work
```
📥 My Work

[Active]  [Pending]  [Completed ●]

12 completed  ·  $840 earned total

─────────────────────────────────────

┌─────────────────────────────────┐
│ ✅ Summer Collection Review     │
│ Modaz Store  ·  Deal            │
│ Earned: $80  ·  May 28         │
│ 🏅 Contributed to: 10 Deals Done│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🥉 Spring Tech Contest          │
│ TechZone  ·  Contest            │
│ Earned: $100  ·  May 15        │
│ 450k views  ·  Rank: #3        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ✅ Food Delivery App Review     │
│ QuickEats  ·  Deal              │
│ Earned: $60  ·  May 10         │
└─────────────────────────────────┘
```

#### Screen 8.3 — Contest Tracker
```
←   Contest Tracker

🏆 Ramadan Glow Challenge
Glam Beauty  ·  🟢 12 days left

─────────────────────────────────────

YOUR PERFORMANCE
┌─────────────────────────────────┐
│ 👁 45,200 views                 │
│ ❤️ 3,800 likes  💬 240 comments │
│ 📈 +1,200 views today           │
│ 🏅 Current rank: #8 of 25       │
└─────────────────────────────────┘

AT THIS RANK YOU WIN: —
TO WIN 🥉 YOU NEED: +35k more views

─────────────────────────────────────

VIEWS OVER TIME
▁▂▃▄▅▅▆▆  (mini chart)

─────────────────────────────────────

TOP 5 RIGHT NOW
🥇 @nadia.dz   580k  $250
🥈 @rima.ae    410k  $150
🥉 @lina.ma    290k  $100
 4 @med.dz     180k   —
 5 @nour.sa    120k   —

[View on TikTok ↗]
```

---

### PHASE 9 — WALLET

#### Screen 9.1 — Wallet
```
💰 Wallet

┌─────────────────────────────────┐
│                                 │
│      Available Balance          │
│           $240.00               │
│                                 │
│   Pending: $80.00               │
│   Lifetime: $840.00             │
│                                 │
│      [  Withdraw  ]             │
│      Min. $20 to withdraw       │
│                                 │
└─────────────────────────────────┘

─────────────────────────────────────

VYBE REWARDS 🎯
┌─────────────────────────────────┐
│ 🎯 Streak bonus (5-day)  +$3   │
│ 🏆 Weekly challenge      +$5   │
│ 🤝 Referral credit       +$10  │
│ ──────────────────────────────  │
│ Total bonuses earned:    +$23   │
└─────────────────────────────────┘

─────────────────────────────────────

RECENT TRANSACTIONS

✅ Modaz Store Deal         +$80
   May 28 · Summer Collection

✅ TechZone Contest         +$100
   May 15 · Spring Tech · 🥉 3rd

💸 Withdrawal               -$200
   May 10 · Chargily · Processed

[View all transactions →]
```

#### Screen 9.2 — Withdraw
```
←   Withdraw

Available: $240.00

Amount to withdraw
$  [  200                         ]

[  $50  ]  [  $100  ]  [  $200  ]  [All]

─────────────────────────────────────

Withdraw to
○ Chargily — BaridiMob ••••4421
○ Add payout method

─────────────────────────────────────

┌─────────────────────────────────┐
│ Estimated arrival: 1–3 days    │
│ Minimum withdrawal: $20        │
└─────────────────────────────────┘

[    Confirm Withdrawal    ]
```

---

### PHASE 10 — PROFILE & GAMIFICATION

#### Screen 10.1 — Creator Profile
```
👤 Profile                    [✏️ Edit]

[Profile Photo]
Sarra Benali
@sarra.dz  ·  Algeria 🇩🇿
🔥 Trendsetter  ·  Beauty + Fashion

─────────────────────────────────────

LEVEL & SCORE
┌─────────────────────────────────┐
│ 🔥 Hot Level                    │
│ ████████░░  $840 / $2,000       │
│ Vybe Score: 87 ⚡               │
└─────────────────────────────────┘

─────────────────────────────────────

STATS
┌──────────┐  ┌──────────┐  ┌──────────┐
│ 💰 $840  │  │ 📹 12    │  │ ⭐ 4.9   │
│ Earned   │  │ Completed│  │ Rating   │
└──────────┘  └──────────┘  └──────────┘

─────────────────────────────────────

CONNECTED PLATFORMS
TikTok  ✅  @sarra.dz  45k followers
Instagram ✅ @sarra.dz  28k followers

─────────────────────────────────────

BADGES  (8 earned)
🏆 🥇 📅 🎯 ⚡ 🔁 🌱 🎂
[View all badges →]

─────────────────────────────────────

🔥 5-day streak  ·  Keep it up!
```

#### Screen 10.2 — Badges Collection
```
←   My Badges

8 earned  ·  14 locked

─────────────────────────────────────
EARNED

[🏆 First Win  ✅ May 3 ]
[🥇 Top Perf.  ✅ May 15]
[🎂 OG Creator ✅ Mar 1 ]
[🎯 10 Deals   ✅ May 28]
[⚡ Quick Draw  ✅ Apr 20]
[📅 7-Day      ✅ May 10]

─────────────────────────────────────
LOCKED

[📈 1M Views   🔒 955k/1M       ]
[🔁 Repeat     🔒 Need 1 more   ]
[🤝 Referral   🔒 0/3 referrals ]
[🏅 50 Deals   🔒 12/50         ]
[👑 Legend     🔒 Earn $10k     ]
[🔥 Trending   🔒 Need 500k views]
```

#### Screen 10.3 — Leaderboard
```
🏆 Leaderboard

[Weekly]  [Monthly]  [All Time]

[🌍 Worldwide]  [📍 Algeria]  [🎯 My Niche]

─────────────────────────────────────
THIS WEEK · ALGERIA · BEAUTY

🥇 @nadia.dz   🇩🇿  2.4M views  🔥 Hot
🥈 @rima.dz    🇩🇿  1.8M views  🔥 Hot
🥉 @lina.dz    🇩🇿  1.2M views  ⚡ Rising
 4 @sara.dz    🇩🇿  980k views  ⚡ Rising
 5 @amira.dz   🇩🇿  720k views  🌱 Seed
─────────────────────────────────────
🔥 You  #8     🇩🇿  245k views  ↑3 spots
─────────────────────────────────────
 9 @maya.dz    🇩🇿  180k views
10 @sana.dz    🇩🇿  120k views
```

#### Screen 10.4 — Challenges
```
🎯 Challenges

[Weekly]  [Monthly]

─────────────────────────────────────
WEEKLY CHALLENGES · Resets in 4d 12h

┌─────────────────────────────────┐
│ ✅ Apply to 3 deals             │
│ ██████████  3/3 Complete!       │
│ Reward: +$5 bonus  ✅ Earned    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🔥 Get 100k views               │
│ ████████░░  80k / 100k          │
│ Reward: Rising badge +50%       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ⚡ Be first to apply to a deal  │
│ ░░░░░░░░░░  Not done yet        │
│ Reward: Quick Draw badge        │
└─────────────────────────────────┘

─────────────────────────────────────
MONTHLY CHALLENGES

┌─────────────────────────────────┐
│ 🏆 Win a contest this month     │
│ ░░░░░░░░░░  Not done yet        │
│ Reward: Hot badge unlock        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 💰 Earn $200 this month         │
│ ██████░░░░  $120 / $200         │
│ Reward: Level up boost +20%     │
└─────────────────────────────────┘
```

#### Screen 10.5 — Referral
```
←   Refer & Earn

            🤝

     Invite creators to Vybe

  You get → $10 wallet credit 💰
  They get → $5 welcome bonus 🎁

  ─────────────────────────────────

  Your referral link:
  ┌─────────────────────────────────┐
  │  vybe.app/join?ref=sarra123     │
  │                     [Copy 📋]   │
  └─────────────────────────────────┘

  [Share on WhatsApp]
  [Share on Instagram]
  [Share on TikTok]

  ─────────────────────────────────

  YOUR REFERRALS
  ✅ @karim.dz   Completed 1 deal  +$10
  ⏳ @amira.dz   Signed up · pending
  ⏳ @lina.dz    Signed up · pending

  Referral Star badge: 1/3
  Total earned from referrals: $10
```

---

### PHASE 11 — NOTIFICATIONS

#### Screen 11.1 — Notifications
```
🔔 Notifications          [Mark all read]

TODAY
─────────────────────────────────────

🔵 ✅ Your video was approved!
   Summer Collection · Modaz Store
   💰 +$80 added to wallet · 2h ago
   [View →]

🔵 🏅 New badge: 10 Deals Done
   2h ago  [View Badges →]

🔵 📈 You moved up to #7 on leaderboard
   Ramadan Glow · 4h ago  [View →]

YESTERDAY
─────────────────────────────────────

⚪ ✏️ Edits requested by Skin Lab
   Skincare Deal · 1 day ago
   [View Feedback →]

⚪ 🔥 5-day streak! Keep going
   Bonus unlocking soon · 1d ago

⚪ 🤝 New deal matches your profile
   Glam Beauty · Algeria · 1d ago
   [View Deal →]

⚪ ⏳ Application still pending
   Skin Lab Deal · 2 days ago
```

---

### PHASE 12 — SETTINGS

#### Screen 12.1 — Settings
```
⚙️ Settings

[pic] Sarra Benali
@sarra.dz  ·  🔥 Hot Level
[Edit Profile →]

─────────────────────────────────────

ACCOUNT
Connected Platforms    TikTok, IG  [→]
Payout Methods         Chargily    [→]
Phone Number           +213 ••••   [→]
Change Password                    [→]

─────────────────────────────────────

PREFERENCES
Language
○ English  ○ Français  ● العربية

Push Notifications     [ON  ●]
Email Notifications    [ON  ●]
Face ID / Biometric    [ON  ●]

─────────────────────────────────────

VYBE
My Badges                          [→]
Leaderboard                        [→]
Challenges                         [→]
Refer & Earn                       [→]

─────────────────────────────────────

SUPPORT
Help Center                        [→]
Contact Support                    [→]
Terms of Service                   [→]
Privacy Policy                     [→]

─────────────────────────────────────

[Logout]

App version 1.0.0
```

---

## 16. Complete Screen Map

| Phase | Screen | Purpose |
|---|---|---|
| 1 | Splash | App loading |
| 1 | Welcome | Entry point — sign up or login |
| 1 | Create Account | Registration form |
| 1 | Email Verification | 6-digit OTP |
| 1 | Login | Returning user auth |
| 2 | Basic Info | Name, phone, DOB, gender, photo |
| 2 | Location & Niche | Country, city, content type, language |
| 2 | Connect Socials | Phyllo OAuth — TikTok, Instagram, YouTube |
| 2 | Payout Setup | Stripe Connect or Chargily |
| 3 | Quiz Intro | Personality quiz entry |
| 3 | Quiz Question (×10) | Fun onboarding questions |
| 3 | Creator Type Result | Personalized creator identity reveal |
| 4 | Home — New Creator | Empty state feed with quick actions |
| 4 | Home — Active Creator | Personalized feed + streak + challenges |
| 5 | Explore Feed | All eligible campaigns |
| 5 | Explore Filters | Advanced filter bottom sheet |
| 6 | Contest Detail | Brief, leaderboard, rules |
| 6 | Contest Leaderboard Tab | Live rankings with creator position |
| 6 | Join Contest | Submit post URL |
| 6 | Contest Submission Confirmed | Entry celebration |
| 7 | Deal Detail | Brief, how it works, brand info |
| 7 | Apply to Deal | Post URL + bid + optional note |
| 7 | Application Submitted | Pending confirmation |
| 7 | Deal Approved Celebration | Full celebration + badge + level progress |
| 7 | Edits Requested | Brand feedback + resubmit form |
| 8 | My Work — Active | In-progress campaigns |
| 8 | My Work — Pending | Awaiting brand response |
| 8 | My Work — Completed | Earnings history |
| 8 | Contest Tracker | Live views, rank, leaderboard |
| 9 | Wallet | Balance, rewards, transactions |
| 9 | Withdraw | Payout amount + method |
| 10 | Creator Profile | Stats, level, score, badges, streak |
| 10 | Badges Collection | All earned + locked with progress |
| 10 | Leaderboard | Weekly / monthly / all time by region + niche |
| 10 | Challenges | Weekly + monthly missions with progress |
| 10 | Referral | Invite link + tracking + earnings |
| 11 | Notifications | All alerts grouped by date |
| 12 | Settings | Full account and preference management |

**Total: 37 screens covering the complete creator journey from signup to payout.**

---

*Vybe Creator App — Document version 1.0*
*Covers: Auth, Onboarding, Quiz, Home Feed, Explore, Contests, Deals, My Work, Wallet, Gamification, Notifications, Settings*
