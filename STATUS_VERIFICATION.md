# Vybe Platform - Offer & Application Status Verification

## Overview
This document verifies the state management for offers (deals/contests) and applications (submissions) across the Vybe platform.

---

## 1. Deal Applications (`deal_applications` table)

### Database Schema
**Location:** `supabase_contests_deals_migration.sql:153-164`

### States
| Status | Description | Database Constraint |
|--------|-------------|---------------------|
| `pending` | Application submitted, awaiting brand review | ✅ Default |
| `approved` | Brand approved the application | ✅ Valid |
| `declined` | Brand rejected the application | ✅ Valid |
| `withdrawn` | Creator withdrew their application | ✅ Valid |

### Code Implementation
- **Creation:** `@d:\next_vybe\src\lib\db.ts:336` - Sets status to `'pending'` on creation
- **Status Update:** `@d:\next_vybe\src\lib\db.ts:647-654` - Maps statuses when updating
- **UI Display:** `@d:\next_vybe\src\app\[lang]\deals\[id]\page.tsx:22` - Filter options include all, pending, approved, declined

### Status Flow
```
pending → approved → [content creation phase]
       ↘ declined
       ↘ withdrawn
```

---

## 2. Deal Submissions (`deal_submissions` table)

### Database Schema
**Location:** `supabase_contests_deals_migration.sql:167-180`

### States
| Status | Description | Database Constraint |
|--------|-------------|---------------------|
| `submitted` | Creator submitted content for review | ✅ Default |
| `accepted` | Brand accepted the submission | ✅ Valid |
| `edits_requested` | Brand requested revisions | ✅ Valid |
| `declined` | Brand rejected the submission | ✅ Valid |

### Code Implementation
- **Creation:** `@d:\next_vybe\src\lib\db.ts:358` - Sets status to `'submitted'` on creation
- **Status Update:** `@d:\next_vybe\src\lib\db.ts:621-633` - Handles status transitions including edits
- **Revision Tracking:** `@d:\next_vybe\src\lib\db.ts:627` - Increments revision_number when edits requested

### Status Flow
```
submitted → accepted (final)
         ↘ edits_requested → submitted (revision)
         ↘ declined
```

---

## 3. Contest Submissions (`contest_submissions` table)

### Database Schema
**Location:** `supabase_contests_deals_migration.sql:124-138`

### States
| Status | Description | Database Constraint |
|--------|-------------|---------------------|
| `active` | Submission is active in the contest | ✅ Default |
| `disqualified` | Submission was disqualified | ✅ Valid |

### Code Implementation
- **Status Update:** `@d:\next_vybe\src\lib\db.ts:606` - Maps 'approved' to 'active', 'declined' to 'disqualified'
- **UI Display:** `@d:\next_vybe\src\app\[lang]\creators_side\my-work\page.tsx:75-77` - Categorizes by status

### Status Flow
```
active → [remains active or disqualified]
      ↘ disqualified
```

---

## 4. Legacy Submissions Table (Old Schema)

### Database Schema
**Location:** `supabase_schema.sql:35-52`

### States
| Status | Description | Database Constraint |
|--------|-------------|---------------------|
| `pending` | Awaiting review | ✅ Default |
| `approved` | Approved by brand | ✅ Valid |
| `declined` | Rejected by brand | ✅ Valid |
| `edits` | Edits requested | ✅ Valid |

**Note:** This is the legacy schema. The new schema splits this into separate tables for deals and contests.

---

## 5. UI Status Mappings

### StatusBadge Component
**Location:** `@d:\next_vybe\src\components\StatusBadge.tsx:3-29`

#### Configured Statuses
| Status | Translation (French) | Visual Style |
|--------|---------------------|--------------|
| `pending` | En attente | Warning (yellow) |
| `approved` | Approuvé | Success (green) |
| `declined` | Refusé | Destructive (red) |
| `edits` | Modifications demandées | Warning (yellow) |
| `live` | En cours | Success (green) with dot |
| `draft` | Brouillon | Muted (gray) |
| `ended` | Terminé | Muted (gray) |
| `paid` | Payé | Success (green) |
| `processing` | En traitement | Warning (yellow) |

---

## 6. Creator Dashboard Status Display

### My Work Page
**Location:** `@d:\next_vybe\src\app\[lang]\creators_side\my-work\page.tsx:53-117`

#### Status Categorization Logic

**Deal Applications:**
- `pending` → Categorized as **Pending** ("En attente d'approbation")
- `declined` → Categorized as **Rejected** ("Refusé")
- `withdrawn` → Categorized as **Rejected** ("Retiré")
- `approved` (no submission) → Categorized as **Active** ("Création de contenu")

**Deal Submissions (after approval):**
- `submitted` or `edits_requested` → Categorized as **Pending** ("En cours de révision")
- `accepted` → Categorized as **Completed** ("Terminé")
- `declined` → Categorized as **Rejected** ("Soumission refusée")

**Contest Submissions:**
- `active` → Categorized as **Active**
- `disqualified` → Categorized as **Rejected**

---

## 7. Brand Dashboard Status Filters

### Deal Detail Page
**Location:** `@d:\next_vybe\src\app\[lang]\deals\[id]\page.tsx:168-175`

#### Available Filters
- `all` - Tous (All)
- `pending` - En attente (Pending)
- `approved` - Approuvé (Approved)
- `declined` - Refusé (Declined)

---

## 8. Status Transition Actions

### Brand Actions on Applications
**Location:** `@d:\next_vybe\src\app\[lang]\deals\[id]\page.tsx:54-82`

| Action | From Status | To Status | Method |
|--------|-------------|-----------|--------|
| Approve | `pending` | `approved` | `handleApprove()` |
| Decline | `pending` | `declined` | `handleDecline()` |

### Status Update Function
**Location:** `@d:\next_vybe\src\lib\db.ts:595-660`

Handles updates for:
1. Contest submissions (`active`/`disqualified`)
2. Deal submissions (`submitted`/`accepted`/`edits_requested`/`declined`)
3. Deal applications (`pending`/`approved`/`declined`)

---

## 9. Missing or Inconsistent States

### ⚠️ Potential Issues

1. **Type Mismatch:**
   - `@d:\next_vybe\src\lib\mock-data.ts:20` defines `SubmissionStatus = 'pending' | 'approved' | 'declined' | 'edits'`
   - Database uses `'edits_requested'` not `'edits'`
   - **Impact:** Type definitions don't match database constraints

2. **Status Mapping:**
   - `@d:\next_vybe\src\lib\db.ts:606` maps generic 'approved'/'declined' to contest-specific 'active'/'disqualified'
   - This works but could be more explicit

3. **Deal Submission Status:**
   - Database constraint allows: `submitted`, `accepted`, `edits_requested`, `declined`
   - Code at `@d:\next_vybe\src\lib\db.ts:626` uses `'edits_requested'`
   - StatusBadge component uses `'edits'` instead of `'edits_requested'`
   - **Impact:** Status badge may not display correctly for edits_requested state

---

## 10. Recommendations

### High Priority
1. **Fix Type Definition:** Update `SubmissionStatus` type to include `'edits_requested'` instead of `'edits'`
2. **Update StatusBadge:** Add `'edits_requested'` to the status configuration
3. **Consistent Naming:** Ensure all code uses `'edits_requested'` consistently

### Medium Priority
1. **Add Status Constants:** Create a constants file to centralize all status values
2. **Type Safety:** Create separate types for `DealApplicationStatus`, `DealSubmissionStatus`, and `ContestSubmissionStatus`
3. **Documentation:** Add JSDoc comments to status update functions explaining valid transitions

### Low Priority
1. **Add Status Validation:** Create helper functions to validate status transitions
2. **Audit Trail:** Consider adding a status history table for tracking changes
3. **Real-time Updates:** Ensure real-time subscriptions handle all status changes

---

## Summary

### ✅ Working States
- Deal applications: `pending`, `approved`, `declined`, `withdrawn`
- Deal submissions: `submitted`, `accepted`, `edits_requested`, `declined`
- Contest submissions: `active`, `disqualified`

### ⚠️ Issues Found
1. Type definition mismatch (`'edits'` vs `'edits_requested'`)
2. StatusBadge missing `'edits_requested'` configuration
3. No centralized status constants

### 📊 Coverage
- Database constraints: ✅ Properly defined
- Backend logic: ✅ Implemented
- UI components: ⚠️ Partial (missing edits_requested)
- Type safety: ⚠️ Needs update
