# Video Submission & Review Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CREATOR SIDE                                │
└─────────────────────────────────────────────────────────────────────┘

1. Creator Views Deal
   ↓
2. Clicks "Apply" Button
   ↓
3. ApplyDealModal Opens
   ├── Video URL Input (Required) ← Creator pastes TikTok/Instagram/YouTube link
   ├── Proposed Bid Input
   └── Message to Brand
   ↓
4. Submit Application
   ↓
5. db.applyForDeal() Called
   ├── parseVideoUrl(url) → Detects platform
   ├── Creates deal_application record (status: 'pending')
   └── Creates deal_submission record
       ├── post_url: videoUrl
       ├── platform: auto-detected
       └── status: 'submitted'
   ↓
6. Success Message Shown


┌─────────────────────────────────────────────────────────────────────┐
│                          BRAND SIDE                                 │
└─────────────────────────────────────────────────────────────────────┘

1. Brand Views Deal Management Page
   ↓
2. Sees List of Applications
   ├── Creator Info
   ├── Stats (followers, engagement)
   ├── Proposed Bid
   └── Status Badge
   ↓
3. Clicks "Examiner" (Review) Button
   ↓
4. Submission Detail Page Loads
   ├── db.getSubmissionById(sid)
   │   └── Returns submission with video_url
   ↓
5. VideoEmbed Component Renders
   ├── parseVideoUrl(submission.video_url)
   ├── Detects platform (TikTok/Instagram/YouTube)
   ├── Generates embed URL
   └── Renders iframe with real video
   ↓
6. Brand Reviews Video
   ├── Watch video in platform
   ├── Click "Open Original" to view on native platform
   └── Check against deal requirements
   ↓
7. Brand Makes Decision
   ├── Approve → Charge card, pay creator
   ├── Request Edits → Send feedback
   └── Decline → Reject submission


┌─────────────────────────────────────────────────────────────────────┐
│                      VIDEO EMBED LOGIC                              │
└─────────────────────────────────────────────────────────────────────┘

parseVideoUrl(url)
   ↓
   ├── TikTok Detected
   │   ├── Extract video ID from URL
   │   └── Generate: https://www.tiktok.com/embed/v2/{videoId}
   │
   ├── Instagram Detected
   │   ├── Extract post/reel ID from URL
   │   └── Generate: https://www.instagram.com/p/{postId}/embed
   │
   └── YouTube Detected
       ├── Extract video ID from URL
       └── Generate: https://www.youtube.com/embed/{videoId}


┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                                │
└─────────────────────────────────────────────────────────────────────┘

deal_applications
├── id (UUID)
├── deal_id (FK to deals)
├── creator_id (FK to profiles)
├── status ('pending' | 'approved' | 'declined' | 'withdrawn')
├── proposed_bid (DECIMAL)
└── pitch (TEXT)

deal_submissions
├── id (UUID)
├── application_id (FK to deal_applications)
├── post_url (TEXT) ← VIDEO URL STORED HERE
├── platform (TEXT) ← 'tiktok' | 'instagram' | 'youtube'
├── status ('submitted' | 'accepted' | 'edits_requested' | 'declined')
└── brand_feedback (TEXT)


┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                              │
└─────────────────────────────────────────────────────────────────────┘

ApplyDealModal (Creator applies)
└── Input[type="url"] → videoUrl state
    └── db.applyForDeal(dealId, creatorId, videoUrl, ...)

SubmissionDetailPage (Brand reviews)
├── db.getSubmissionById(sid)
│   └── Returns { ..., video_url: string }
└── VideoEmbed
    ├── parseVideoUrl(video_url)
    ├── Platform-specific iframe
    └── "Open Original" button


┌─────────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING                                 │
└─────────────────────────────────────────────────────────────────────┘

VideoEmbed Component
├── No URL provided
│   └── Show: "No Video Submitted" message
│
├── Invalid/Unsupported URL
│   └── Show: Error message + "Open Original Link" button
│
├── Loading state
│   └── Show: Spinner + "Loading video..."
│
└── Success
    └── Render: Platform-specific iframe embed


┌─────────────────────────────────────────────────────────────────────┐
│                    SUPPORTED PLATFORMS                              │
└─────────────────────────────────────────────────────────────────────┘

✅ TikTok
   - Standard URLs: tiktok.com/@user/video/123
   - Short URLs: vm.tiktok.com/XXX
   - Embed: iframe with TikTok embed API

✅ Instagram
   - Posts: instagram.com/p/XXX
   - Reels: instagram.com/reel/XXX
   - TV: instagram.com/tv/XXX
   - Embed: iframe with Instagram embed API

✅ YouTube
   - Standard: youtube.com/watch?v=XXX
   - Shorts: youtube.com/shorts/XXX
   - Short URLs: youtu.be/XXX
   - Embed: iframe with YouTube embed API

❌ Other Platforms
   - Shows error message
   - Provides "Open Original Link" fallback
