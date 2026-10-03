# 📄 DOCUMENT 3: USER ROLES & USER FLOW

---

## **Project:** GameVerse — Esports Tournament Operations & Live Broadcast Platform
## **Document Type:** User Roles & User Flow
## **Version:** 1.0
## **Date:** June 2025
## **Status:** Draft for Review

---

---

## TABLE OF CONTENTS

1. Document Overview
2. Platform Role Architecture
3. Role Definitions & Permission Matrix
4. Role Transition & Assignment Rules
5. User Flow Overview Map
6. Flow 01 — New User Onboarding
7. Flow 02 — Organizer: Create & Publish Tournament
8. Flow 03 — Team Captain: Register for Tournament
9. Flow 04 — Match Day Operations (Organizer + Referee)
10. Flow 05 — Match Day Experience (Player)
11. Flow 06 — Live Scoring & Leaderboard Update
12. Flow 07 — Secure Room Credential Distribution
13. Flow 08 — Broadcast Producer Workflow
14. Flow 09 — Dispute Submission & Resolution
15. Flow 10 — Prize Distribution
16. Flow 11 — Command Center Master Flow
17. Cross-Role Interaction Map
18. Error & Exception Flows

---

---

# SECTION 1 — DOCUMENT OVERVIEW

---

## 1.1 Purpose

This document defines:
1. Every role on the GameVerse platform — their identity, capabilities, and restrictions
2. The complete user flows for every significant action a user can take — from initial signup to prize collection
3. How roles interact with each other across tournament operations
4. Exception paths and error handling for critical flows

### Complete Platform Ecosystem

Your platform can have four major sides:

1. 👨💼 Admin / Tournament Organizer Panel
For managing everything.

2. 🎮 Player & Team Portal
For players and team captains.

3. 📺 Public Live Tournament Website
For viewers and fans.

4. 🎥 Production & Stream Control Panel
For managing live streams, overlays, scores, and broadcasts.

## 1.2 How to Read This Document

Each user flow is presented in three formats:
- **Narrative description** — plain language walkthrough
- **Step-by-step flow table** — granular action → system response pairs
- **Flow diagram** — visual representation using text-based diagrams

## 1.3 Conventions

```
[User Action]     → Step the user takes
{System Action}   → Automated system response
<Decision Point>  → Branch in the flow
(Screen/View)     → UI screen or component
⚠️ Error Path     → Exception or failure scenario
✅ Success State  → Positive completion
```

---

---





# SECTION 2 — PLATFORM ROLE ARCHITECTURE

---

## 2.1 Role Scope Overview

GameVerse operates a **two-scope role system**:

```
┌─────────────────────────────────────────────────────────┐
│                  PLATFORM SCOPE                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ROLE-01: Super Admin                           │    │
│  │  • Full platform access                         │    │
│  │  • Manages all organizations                    │    │
│  │  • Resolves escalated disputes                  │    │
│  │  • Provisioned by engineering team              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ORGANIZATION SCOPE (per org)                   │    │
│  │                                                 │    │
│  │  ROLE-02: Org Owner                             │    │
│  │     └── ROLE-03: Org Admin                      │    │
│  │            └── ROLE-04: Tournament Director     │    │
│  │                   ├── ROLE-05: Referee          │    │
│  │                   └── ROLE-06: Broadcast Prod.  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  PARTICIPANT SCOPE (per tournament)             │    │
│  │                                                 │    │
│  │  ROLE-07: Team Captain                          │    │
│  │  ROLE-08: Player                                │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  AUDIENCE SCOPE                                 │    │
│  │                                                 │    │
│  │  ROLE-09: Viewer                                │    │
│  │  ROLE-10: Sponsor Representative               │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 2.2 Role Multiplicity

A single user can hold **multiple roles simultaneously** across different scopes:

```
Example: Rahul (user_id: abc-123)
├── Platform: Authenticated User (no special platform role)
├── Org "Hydra Events": Org Owner (ROLE-02)
├── Org "Storm Esports": Referee (ROLE-05)
└── Tournament "BGMI Cup Jan": Team Captain (ROLE-07)
    [Rahul registered his own team in someone else's tournament]
```

---

---





# SECTION 3 — ROLE DEFINITIONS & PERMISSION MATRIX

---

## 3.1 Detailed Role Definitions

---

### ROLE-01: Super Admin

| Attribute | Detail |
|-----------|--------|
| **Who** | GameVerse platform employees (engineering, operations, trust & safety) |
| **Scope** | Entire platform — all organizations, all tournaments |
| **Assigned By** | Engineering team (direct DB provisioning) |
| **Count** | 3–10 individuals |
| **Primary Purpose** | Platform health, policy enforcement, escalated dispute resolution, financial oversight |

**Exclusive Capabilities:**
- Access every organization's dashboard and data
- Suspend or reinstate any organization or user account
- Override any tournament decision (scoring, DQ, result)
- Access the complete platform audit log
- Resolve escalated disputes from any tournament
- Configure platform-wide game catalog
- View platform-wide financial and analytics data
- Export any data set from the platform
- Force-complete or force-cancel any tournament

---

### ROLE-02: Org Owner

| Attribute | Detail |
|-----------|--------|
| **Who** | The person who created an organization on GameVerse (creator/founder) |
| **Scope** | Their organization(s) and all tournaments within |
| **Assigned By** | Automatically assigned upon org creation |
| **Count** | 1 per organization (transferable) |
| **Primary Purpose** | Overall organization management, financial oversight, final decision authority |

**Exclusive Capabilities (within their org):**
- Transfer ownership of the organization
- Delete the organization (if no active tournaments)
- Manage subscription and billing
- Access all financial data (entry fees, payouts, platform fees)
- Override any Org Admin or Tournament Director decision
- Initiate prize payouts to winners
- Complete KYC for payout eligibility
- Add, edit, remove all org members including Org Admins
- View and export all org-level audit logs

---

### ROLE-03: Org Admin

| Attribute | Detail |
|-----------|--------|
| **Who** | Senior staff appointed by the Org Owner |
| **Scope** | Their organization and all tournaments within |
| **Assigned By** | Org Owner |
| **Count** | Up to plan limit (Free: 2, Starter: 5, Pro: 10, Elite: Unlimited) |
| **Primary Purpose** | Day-to-day organization management, tournament oversight |

**Capabilities (within their org):**
- All Tournament Director capabilities
- Manage org members (invite, remove, change roles for roles below Org Admin)
- Edit organization profile and brand kit
- View org-level financial reports
- Create and configure tournaments
- Assign Tournament Directors to tournaments
- Escalate disputes to Org Owner level

**Cannot:**
- Change Org Owner's role
- Access billing and subscription management
- View individual payout bank details

---

### ROLE-04: Tournament Director

| Attribute | Detail |
|-----------|--------|
| **Who** | Staff member responsible for running a specific tournament |
| **Scope** | Assigned tournaments only |
| **Assigned By** | Org Owner or Org Admin |
| **Count** | 1–3 per tournament |
| **Primary Purpose** | Full tournament lifecycle management — creation through completion |

**Capabilities (within assigned tournaments):**
- Create, configure, publish, and manage tournament lifecycle
- Approve, reject, and manage team registrations
- Generate and publish match schedule
- Access Command Center for the tournament
- Enter and verify match results
- Make score corrections
- Issue and confirm disqualifications
- Manage disputes (review, resolve)
- Send announcements to all participants
- Initiate prize payout process
- View tournament-level audit log
- Assign Referees to matches

**Cannot:**
- Resolve disputes involving their own team (auto-escalates)
- Unlock a locked leaderboard (requires Super Admin)
- Access financial data for other tournaments
- Modify scoring system after first match is scored

---

### ROLE-05: Referee

| Attribute | Detail |
|-----------|--------|
| **Who** | Staff member responsible for match-level operations |
| **Scope** | Assigned matches within assigned tournaments |
| **Assigned By** | Tournament Director |
| **Count** | 1–N per tournament (can have multiple referees for different matches) |
| **Primary Purpose** | Match execution — lobby management, credentials, scoring, pause/void decisions |

**Capabilities (within assigned matches):**
- Open, manage, and close match lobbies
- Enter and release room credentials
- Rotate (replace) room credentials
- Mark match as In Progress, Paused, Resumed
- Submit match results (placement + kills)
- Add match notes
- Mark technical pauses
- Recommend team disqualification (requires Tournament Director confirmation)
- View match-level audit log
- Mark teams as no-show for their matches

**Cannot:**
- Approve, reject, or manage team registrations
- Make score corrections to published results (can flag for correction)
- Confirm disqualifications unilaterally
- Access tournament financial data
- Send tournament-wide announcements
- Access Command Center sections outside their scope

---

### ROLE-06: Broadcast Producer

| Attribute | Detail |
|-----------|--------|
| **Who** | Staff member responsible for live stream production |
| **Scope** | Assigned tournaments |
| **Assigned By** | Tournament Director or Org Admin |
| **Count** | 1–3 per tournament |
| **Primary Purpose** | Live stream management, OBS overlay control, broadcast quality |

**Capabilities (within assigned tournaments):**
- Access Broadcast Dashboard
- Configure stream settings (URL, platform connection)
- Manage OBS WebSocket connection
- Access all overlay URLs and management
- Control overlay visibility via Commands
- Add stream annotations (moment markers)
- View live leaderboard data (read-only)
- View stream health metrics
- Link VODs to matches post-event
- View viewer count and engagement data

**Cannot:**
- Modify tournament settings, schedule, or results
- Access registration management
- Manage credentials
- Access financial data
- Send announcements
- Resolve disputes

---

### ROLE-07: Team Captain

| Attribute | Detail |
|-----------|--------|
| **Who** | The player who created or leads a team; represents the team in all platform interactions |
| **Scope** | Their teams and the tournaments their teams are registered in |
| **Assigned By** | Automatically assigned when user creates a team; transferable |
| **Count** | 1 per team |
| **Primary Purpose** | Team management, tournament registration, match day coordination for their team |

**Capabilities:**
- Create, configure, and manage their team(s)
- Invite players to their team(s)
- Register team for tournaments
- Pay entry fees on behalf of team
- Check in team for tournaments
- View room credentials for their team's matches
- Activate substitute players for matches
- Submit dispute about their team's match results
- Submit payout details for prize money
- View their team's full match history and statistics

**Cannot:**
- View other teams' UIDs in the registration panel
- Access tournament management tools
- Enter or distribute room credentials
- Verify or approve registrations
- View other teams' payout status

---

### ROLE-08: Player

| Attribute | Detail |
|-----------|--------|
| **Who** | Any registered competitive gamer who is a member of a team |
| **Scope** | Their team's tournaments |
| **Assigned By** | Joins by accepting team invitation |
| **Count** | N per team (per game's team size rules) |
| **Primary Purpose** | Participate in tournaments, track personal statistics |

**Capabilities:**
- View room credentials for their team's matches (read-only)
- View their team's match schedule and status
- View the live leaderboard during tournaments
- View their personal career statistics
- Link their in-game accounts to their profile
- Receive tournament notifications
- Participate in viewer/competitor chat

**Cannot:**
- Register team for tournaments (captain only)
- Pay entry fees
- Submit disputes
- Check in the team (captain only)
- View management tools of any kind

---

### ROLE-09: Viewer

| Attribute | Detail |
|-----------|--------|
| **Who** | Unauthenticated visitors or authenticated users not participating in a tournament |
| **Scope** | Public tournament pages |
| **Assigned By** | Default state for unauthenticated users; any authenticated user becomes a viewer for tournaments they're not participating in |
| **Count** | Unlimited |
| **Primary Purpose** | Watch tournaments, discover events, engage with content |

**Capabilities:**
- Browse tournament directory
- View public tournament pages (overview, schedule, rules, leaderboard, results)
- Watch embedded live stream
- Participate in Viewer Chat (with display name)
- Follow organizations and tournaments
- View player and team public profiles

**Cannot:**
- Access any operational or management tools
- View room credentials
- Register for tournaments (must create account and team first)

---

### ROLE-10: Sponsor Representative

| Attribute | Detail |
|-----------|--------|
| **Who** | Read-only account for sponsor brand managers to access their sponsorship data |
| **Scope** | Tournaments they are assigned to as a sponsor |
| **Assigned By** | Org Owner creates the account and assigns it to tournaments |
| **Count** | 1–3 per sponsor company |
| **Primary Purpose** | View brand placement and exposure metrics, download sponsor reports |

**Capabilities:**
- View Sponsor Dashboard for assigned tournaments
- View estimated impression data
- View stream viewership metrics
- Download Sponsor Reports (PDF)
- View tournament participation metrics

**Cannot:**
- Access any tournament management tools
- Modify any data
- View other sponsors' reports
- View participant personal data

---

## 3.2 Complete Permission Matrix

| Capability | Super Admin | Org Owner | Org Admin | T. Director | Referee | B. Producer | Team Captain | Player | Viewer |
|-----------|:-----------:|:---------:|:---------:|:-----------:|:-------:|:-----------:|:------------:|:------:|:------:|
| Create Organization | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Org Members | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Subscription | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Tournament | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Publish Tournament | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Registrations | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate Schedule | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Enter Credentials | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Credentials | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (own) | ✅ (own) | ❌ |
| Open Match Lobby | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Submit Results | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Verify Results | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Correct Results | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Issue DQ | ✅ | ✅ | ✅ | ✅ | ⚡ (recommend) | ❌ | ❌ | ❌ | ❌ |
| Manage Disputes | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit Dispute | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Escalate Dispute | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ (appeal) | ❌ | ❌ |
| Send Announcements | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Broadcast | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage Overlays | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Leaderboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register Team | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Check In Team | ❌ | ❌ | ❌ | ✅ (manual) | ✅ (manual) | ❌ | ✅ | ❌ | ❌ |
| View Own Credentials | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Initiate Prize Payout | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Receive Prize Payout | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Financial Data | ✅ | ✅ | ✅ | ✅ (own T.) | ❌ | ❌ | ✅ (own) | ❌ | ❌ |
| Access Command Center | ✅ | ✅ | ✅ | ✅ | ✅ (limited) | ✅ (limited) | ❌ | ❌ | ❌ |
| View Audit Log | ✅ | ✅ | ✅ | ✅ (own T.) | ❌ | ❌ | ✅ (own) | ❌ | ❌ |
| View Public Pages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:** ✅ = Permitted | ❌ = Not Permitted | ⚡ = Partial/Conditional

---

---





# SECTION 4 — ROLE TRANSITION & ASSIGNMENT RULES

---

## 4.1 Role Assignment Flow

```
New User Registers
        ↓
Default State: Authenticated User (no org role)
        ↓
        ├── Creates an Organization
        │       ↓
        │   Becomes Org Owner (ROLE-02) of that org
        │
        ├── Accepts Org Invitation
        │       ↓
        │   Receives role as configured in invitation
        │   (Org Admin / Tournament Director / Referee / Broadcast Producer)
        │
        ├── Creates a Team
        │       ↓
        │   Becomes Team Captain (ROLE-07) of that team
        │
        └── Accepts Team Invitation
                ↓
            Becomes Player (ROLE-08) on that team
```

## 4.2 Role Hierarchy Enforcement Rules

| Rule | Description |
|------|-------------|
| **Downward Assignment Only** | A user can only assign roles strictly below their own level. An Org Admin cannot assign another Org Admin. |
| **No Self-Demotion** | Org Owners cannot remove themselves from the Owner role without transferring ownership first. |
| **Tournament Scope** | Tournament Director, Referee, and Broadcast Producer roles are scoped to specific tournaments. Holding Referee in Tournament A does not grant any access to Tournament B. |
| **Concurrent Multi-Role** | A user can be Org Owner of Org A and Referee in Org B simultaneously. Each role's permissions apply only within its organizational scope. |
| **Captain Transfer** | Team captaincy can be transferred to any active team member. The transfer requires the new captain's acceptance. |

---

---





# SECTION 5 — USER FLOW OVERVIEW MAP

---

```
PLATFORM ENTRY POINTS
├── New User Registration ──────────────────────────→ FLOW 01
├── Returning User Login ──────────────────────────→ (Auth Module)
│
ORGANIZER FLOWS
├── Create & Configure Tournament ─────────────────→ FLOW 02
├── Match Day Operations (Director) ───────────────→ FLOW 04
├── Live Scoring Submission ───────────────────────→ FLOW 06
├── Dispute Resolution ─────────────────────────── → FLOW 09
├── Prize Distribution ─────────────────────────── → FLOW 10
├── Command Center Master Flow ─────────────────── → FLOW 11
│
PARTICIPANT FLOWS
├── Team Registration for Tournament ──────────────→ FLOW 03
├── Match Day Experience (Player) ─────────────────→ FLOW 05
├── Dispute Submission ─────────────────────────── → FLOW 09 (Player Side)
│
OPERATIONAL FLOWS
├── Secure Room Credential Distribution ───────────→ FLOW 07
├── Broadcast Producer Workflow ────────────────── → FLOW 08
│
CROSS-CUTTING
├── Leaderboard Update Cycle ──────────────────────→ FLOW 06 (continuation)
├── Notification Delivery ─────────────────────────→ (All flows, MOD-14)
└── Audit Log Recording ───────────────────────────→ (All flows, MOD-20)
```

---

---





---


---





---

# ECOSYSTEM SIDE: ⚙️ SHARED FOUNDATION / CORE

---

# SECTION 6 — FLOW 01: NEW USER ONBOARDING

---

## 6.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actor** | New unregistered visitor |
| **Entry Point** | Landing page or invitation link |
| **Exit Points** | Organizer Dashboard / Player Dashboard / Tournament Page |
| **Estimated Time** | 3–5 minutes |
| **Key Decision** | Registration method + onboarding path selection |

---

## 6.2 Flow Diagram

```
[Visitor arrives at gameverse.gg]
            ↓
    (Landing Page)
    CTA: "Get Started" or "Join Tournament"
            ↓
    (Registration Page)
    ┌────────────────────────────┐
    │  Choose Method:            │
    │  📱 Mobile Number + OTP    │
    │  📧 Email + Password       │
    │  🔵 Continue with Google   │
    └────────────────────────────┘
            ↓
    <Mobile OTP Selected?>
    ├── YES → [Enter mobile number]
    │           ↓
    │       {System sends 6-digit OTP via SMS}
    │           ↓
    │       [User enters OTP]
    │           ↓
    │       <OTP Valid?>
    │       ├── YES → Continue to Profile Setup
    │       └── NO  → ⚠️ Error: "Incorrect OTP"
    │                   [Retry up to 3 times]
    │                   [Resend OTP after 60s]
    │
    ├── Email → [Enter email + password]
    │           ↓
    │       {System sends verification email}
    │           ↓
    │       [User clicks verification link]
    │           ↓
    │       Continue to Profile Setup
    │
    └── Google → {OAuth redirect to Google}
                    ↓
                [User authorizes GameVerse]
                    ↓
                {System checks if email exists}
                ├── New email → Create account → Profile Setup
                └── Existing email → Link OAuth → Login

    ─────────────── PROFILE SETUP ───────────────
            ↓
    (Username Selection Screen)
    [Enter unique username / handle]
    {Real-time availability check}
    <Available?>
    ├── YES → Username confirmed ✅
    └── NO  → "Username taken" → [Try another]
            ↓
    (Onboarding Path Selection)
    ┌─────────────────────────────────────────┐
    │  What brings you to GameVerse?          │
    │                                         │
    │  🏆 I'm an Organizer                    │
    │     "Run tournaments & leagues"         │
    │                                         │
    │  🎮 I'm a Player                        │
    │     "Compete in tournaments"            │
    │                                         │
    │  👁️ I'm Just Watching                   │
    │     "Follow tournaments & streams"      │
    └─────────────────────────────────────────┘
            ↓
    ┌──────────────────┬───────────────────────┐
    │  ORGANIZER PATH  │   PLAYER PATH         │
    │                  │                       │
    │  → Profile Setup │  → Link Game Account  │
    │  → Create Org    │  → Create/Join Team   │
    │  → Org Dashboard │  → Player Dashboard   │
    └──────────────────┴───────────────────────┘
```

---

## 6.3 Step-by-Step Flow Table

### Path A: Organizer Onboarding

| Step | Actor | Action | System Response | Screen |
|------|-------|--------|-----------------|--------|
| 1 | Visitor | Arrives at gameverse.gg | Renders landing page | Landing Page |
| 2 | Visitor | Clicks "Get Started" | Navigates to registration | Registration Page |
| 3 | Visitor | Enters mobile number | Validates E.164 format | Registration Page |
| 4 | System | — | Sends 6-digit OTP via MSG91 | — |
| 5 | Visitor | Enters OTP | Validates OTP | OTP Screen |
| 6 | System | — | Creates unverified account | — |
| 7 | New User | Chooses username | Real-time availability check | Username Screen |
| 8 | New User | Selects "I'm an Organizer" | Records onboarding preference | Path Selection |
| 9 | New User | Enters display name, uploads avatar (optional) | Updates profile | Profile Setup |
| 10 | System | — | Redirects to "Create Your Organization" prompt | Org Creation Prompt |
| 11 | New User | Clicks "Create Organization" | Navigates to Org Creation wizard | Org Creation |
| 12 | New User | Enters org name, selects game | Validates name, generates slug | Org Creation Step 1 |
| 13 | New User | Uploads org logo (optional, can skip) | Uploads to CDN | Org Creation Step 2 |
| 14 | New User | Invites team members (optional, can skip) | Sends invitations | Org Creation Step 3 |
| 15 | System | — | Creates organization; assigns Org Owner role | — |
| 16 | System | — | Redirects to Organization Dashboard | Org Dashboard |
| 17 | System | — | Shows "Create Your First Tournament" CTA | Org Dashboard |

### Path B: Player Onboarding

| Step | Actor | Action | System Response | Screen |
|------|-------|--------|-----------------|--------|
| 1–7 | — | Same as Organizer steps 1–7 | Same as above | — |
| 8 | New User | Selects "I'm a Player" | Records onboarding preference | Path Selection |
| 9 | New User | Selects primary game from catalog | Stores game preference | Game Selection |
| 10 | New User | Enters in-game UID | Validates UID format against game regex | UID Entry |
| 11 | System | — | Creates LinkedGameAccount record (status: pending) | — |
| 12 | New User | Creates a team OR searches for existing team | Either flow branches | Team Screen |
| 13a | New User | Creates team (name, tag, game) | Creates team; assigns Captain role | Team Creation |
| 13b | New User | Accepts team invitation | Joins team as Player | Invitation Screen |
| 14 | System | — | Redirects to Player Dashboard | Player Dashboard |
| 15 | System | — | Shows nearby/upcoming tournaments CTA | Player Dashboard |

---

## 6.4 Exception Paths

| Scenario | Handling |
|----------|---------|
| OTP not received within 30 seconds | Show "Resend OTP" button; after 3 failed sends, suggest trying email registration |
| Mobile number already registered | "An account exists with this number. Sign in?" with login redirect |
| Username contains profanity | Client-side filter blocks submission; "Username not available" |
| Google OAuth email already registered with password | Show merge flow: "Log in with your password to link Google" |
| User abandons onboarding mid-way | Account is created; next login resumes from last incomplete step |

---

---





# SECTION 17 — CROSS-ROLE INTERACTION MAP

---

## 17.1 Role Interaction During Tournament Day

```
TOURNAMENT DAY INTERACTIONS
═══════════════════════════════════════════════════════

TOURNAMENT DIRECTOR ←──────────────────────────────┐
│  Creates/manages tournament                        │
│  Opens Command Center                              │
│  Monitors all operations                          │
│  Resolves disputes                                │
│  Verifies results                                 │
│                                                   │
│  ←── Assigns ──→  REFEREE                         │
│                    │  Opens lobbies               │
│                    │  Enters credentials          │
│                    │  Marks matches in progress   │
│                    │  Submits results             │
│                    │  ←── Reports to ──→ T.DIRECTOR│
│                                                   │
│  ←── Assigns ──→  BROADCAST PRODUCER             │
│                    │  Manages stream              │
│                    │  Controls overlays           │
│                    │  Monitors viewership         │
│                    │  ←── Independent of ──→ REFEREE
│                    │                              │
│  ←────────────────────────────────────────────────
│
│  ←── Registration from ──→ TEAM CAPTAIN
│                              │  Registers team
│                              │  Pays entry fee
│                              │  Checks in team
│                              │  Receives credentials
│                              │  Submits disputes
│                              │
│                              │  ←── Leads ──→ PLAYERS
│                              │                  │
│                              │                  │ View credentials
│                              │                  │ View schedule
│                              │                  │ Receive notifications
│
│  ←── Overlays feed to ──→ VIEWERS
│                              │  Watch stream
│                              │  See leaderboard
│                              │  Chat

SYSTEM TRIGGERS (automated)
├── Registration open/close → Team Captains notified
├── Result published → All match participants notified
├── Credential released → Only assigned players notified
├── Tournament complete → Winners notified for payout
└── Dispute deadline → Auto-reject if no response
```

## 17.2 Data Flow Between Roles

```
REFEREE enters result data
        ↓
SCORING ENGINE calculates points
        ↓
LEADERBOARD ENGINE ranks all teams
        ↓
┌─────────────────────────────────────────┐
│ Data delivered to:                      │
│                                         │
│ TOURNAMENT DIRECTOR → Command Center   │
│ TEAM CAPTAINS      → Player Dashboard  │
│ PLAYERS            → Player Dashboard  │
│ VIEWERS            → Public Page       │
│ BROADCAST PRODUCER → OBS Overlays      │
│ SPONSOR REP        → Sponsor Dashboard │
└─────────────────────────────────────────┘
```

---

---





# SECTION 18 — ERROR & EXCEPTION FLOWS

---

## 18.1 Critical Error Scenarios & Handling

| Error Scenario | Detection | User Impact | System Response | Recovery |
|---------------|-----------|-------------|-----------------|----------|
| WebSocket connection lost (player) | Client-side disconnection event | Player sees stale data | "Reconnecting..." indicator; exponential backoff retry | Auto-reconnect + data re-sync on restore |
| WebSocket connection lost (Command Center) | Client-side disconnection | Director sees stale data; all sections grey-out | Red "Offline" banner; all actions disabled | Auto-reconnect; full state re-fetch on restore |
| Payment gateway timeout during registration | Razorpay API timeout > 10s | Team waits at payment screen | Slot held for full 15 minutes; payment polling begins | Poll Razorpay order status every 5 min; auto-confirm if paid; auto-release slot if not |
| SMS delivery failure (credential notification) | MSG91 delivery webhook failure | Player may miss credential notification | Switch to Twilio fallback; retry 3 times; alert Tournament Director if all fail | In-app notification still works; director manually notified |
| Result submission while match not IN_PROGRESS | State mismatch on server | Referee sees error | 409 Conflict returned with explanation | Referee corrects match state first |
| Score correction after tournament COMPLETED | Blocked by system | Director cannot correct | 403 Forbidden with "Tournament is locked" | Requires Super Admin intervention; logged in audit |
| Duplicate registration attempt | team_id + tournament_id unique constraint | Captain sees error | "Your team is already registered" with link to existing registration | No action needed; existing registration unaffected |
| Insufficient funds for prize payout | Razorpay payout failure | Winner not paid | Payout marked FAILED; director and winner notified | Director corrects funding source; retries payout |
| OBS WebSocket disconnects mid-stream | Connection drop detected | Overlays still work via browser source polling | Broadcast Dashboard shows "OBS Disconnected"; retries every 5s | Auto-reconnect; if persistent, manual OBS restart required |
| Credential released but match room crashes | Referee identifies in-game | Teams in limbo | Referee rotates credentials (new room created) | New credentials distributed; match delay announced |
| Two referees score the same match | Duplicate result attempt | Second referee gets error | "Results already submitted by [Referee]" 409 error | One result stands; director decides if correction needed |
| Tournament Director goes offline mid-tournament | Session expires / no API calls | Tournament operations paused | Pending actions remain visible; no auto-actions taken | Org Owner or Co-Director takes over; system sends escalating alerts |

---

## 18.2 Payment Error Flow (Detailed)

```
[Team completes payment form]
[Razorpay SDK processes payment]
        ↓
<Payment Gateway Response?>
│
├── SUCCESS
│   {System receives Razorpay webhook: payment.captured}
│   {Registration status → PAYMENT_CONFIRMED}
│   {Slot count incremented}
│   ✅ Confirmation shown to team
│
├── FAILURE (card declined, UPI rejected, etc.)
│   {System receives failure event from Razorpay}
│   {Slot timer continues (not reset)}
│   {Error displayed: "Payment failed — [reason from gateway]"}
│   {Options:}
│   ├── [Try Again] → Same payment method
│   ├── [Try Different Method] → Payment method selector
│   └── [Cancel] → Slot released; registration abandoned
│
├── TIMEOUT (no response in 15 minutes)
│   {Slot reservation expires}
│   {System polls Razorpay for 30 minutes}
│   <Poll finds payment?>
│   ├── YES → {Auto-confirm; registration proceeds}
│   └── NO  → {Registration abandoned; team must re-register}
│
└── WEBHOOK FAILURE (payment success but webhook not received)
    {Background reconciliation job runs every 15 min}
    {Queries Razorpay API for all pending orders}
    {Matches paid orders → confirms registrations}
    {Unmatched discrepancies flagged for manual review}
```

---

## 18.3 State Machine Violation Handling

```
All invalid state transitions return:

HTTP 409 Conflict
{
  "error": "INVALID_STATE_TRANSITION",
  "message": "Cannot transition from [CURRENT_STATE] to [REQUESTED_STATE]",
  "current_state": "COMPLETED",
  "requested_state": "LIVE",
  "allowed_transitions": [],
  "documentation": "https://docs.gameverse.gg/states"
}

UI displays: "This action is not available for a [status] tournament."
```

---

## 18.4 Notification Delivery Failure Cascade

```
Notification triggered
        ↓
Channel Priority Cascade:
1. In-App WebSocket push
   <Delivered?>
   └── NO (user offline) → Store for next login
        ↓
2. Push Notification (FCM/APNs)
   <Delivered?>
   └── NO (no token / failed) → Continue
        ↓
3. SMS (if enabled for this notification type)
   <Delivered?>
   └── NO → Switch to Twilio fallback
              <Delivered?>
              └── NO → Log failure; alert director
        ↓
4. Email (for non-time-sensitive notifications)
   <Delivered?>
   └── NO → Retry queue (3 retries over 1 hour)

For CRITICAL notifications (room credentials):
If ALL channels fail:
→ Director receives: "⚠️ Credential notification failed for [X] players"
→ Director can manually inform teams via platform chat or external channel
```

---

---

## DOCUMENT COMPLETION SUMMARY

---

## Flows Completed

| Flow | Title | Key Roles |
|------|-------|-----------|
| Flow 01 | New User Onboarding | Visitor → Player/Organizer |
| Flow 02 | Create & Publish Tournament | Tournament Director |
| Flow 03 | Register for Tournament | Team Captain |
| Flow 04 | Match Day Operations | Tournament Director + Referee |
| Flow 05 | Match Day Experience | Player + Team Captain |
| Flow 06 | Live Scoring & Leaderboard Update | Referee → System → All |
| Flow 07 | Secure Room Credential Distribution | Referee → System → Players |
| Flow 08 | Broadcast Producer Workflow | Broadcast Producer |
| Flow 09 | Dispute Submission & Resolution | Team Captain → Tournament Director → Super Admin |
| Flow 10 | Prize Distribution | Tournament Director → Winners |
| Flow 11 | Command Center Master Flow | Tournament Director |

## Document Statistics

| Element | Count |
|---------|-------|
| Roles Defined | 10 |
| Permission Matrix Rows | 30 |
| User Flows | 11 |
| Flow Diagrams | 15+ |
| Step-by-Step Tables | 8 |
| Error Scenarios Documented | 20+ |
| Cross-Role Interactions Mapped | Full coverage |

---

## Document Sign-Off

| Role | Name | Status |
|------|------|--------|
| Product Lead | — | Pending Review |
| Engineering Lead | — | Pending Review |
| Design Lead | — | Pending Review |



> **Document:** GameVerse User Roles & User Flow | **Version:** 1.0 | **Status:** Complete ✅



---


---





---

# ECOSYSTEM SIDE: 1. 👨💼 ADMIN / TOURNAMENT ORGANIZER PANEL

---

# SECTION 7 — FLOW 02: ORGANIZER — CREATE & PUBLISH TOURNAMENT

---

## 7.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actor** | Tournament Director (ROLE-04) or Org Owner (ROLE-02) |
| **Entry Point** | Organization Dashboard → "Create Tournament" |
| **Exit Points** | Published tournament page (with live registration link) |
| **Estimated Time** | 8–15 minutes (full wizard) |
| **Key Decisions** | Format selection, entry fee configuration, publishing |

---

## 7.2 Flow Diagram

```
(Organization Dashboard)
        ↓
[Click "Create Tournament"]
        ↓
{System checks subscription limits}
<Limit Reached?>
├── YES → ⚠️ "Upgrade plan to create more tournaments"
│           [Upgrade CTA] → Subscription Management
└── NO  → (Tournament Creation Wizard)

═══════════════ WIZARD STEP 1: BASIC INFO ═══════════════
[Enter Tournament Name]
[Select Game from catalog]
[Enter Short Description]
[Upload Banner Image]
[Set Start Date & End Date]
{Auto-generate slug from name}
[Edit slug if needed]
{Validate: end date > start date}
[Click "Save & Continue"]
        ↓
═══════════════ WIZARD STEP 2: FORMAT & RULES ═══════════════
[Select Tournament Format]
    ├── League (All teams play N matches)
    ├── Group Stage + Finals
    └── Multi-Day League
[Set Teams Per Match: 4/12/16/20/25]
[Set Total Team Slots: 16/32/64/128/256]
[Set Number of Rounds]
[Select Scoring Template]
    ├── BGIS Standard
    ├── BMPS Classic
    ├── Community Cup
    ├── Kill-Heavy
    └── Create Custom
{Show live scoring calculator preview}
[Set Tiebreaker Sequence]
[Upload or Write Rulebook]
[Click "Save & Continue"]
        ↓
═══════════════ WIZARD STEP 3: REGISTRATION ═══════════════
[Set Registration Open Date/Time]
[Set Registration Close Date/Time]
{Validate: reg close < tournament start}
[Set Entry Fee: ₹0 or custom amount]
[Set Team Size Min/Max]
[Toggle: Substitute Players Allowed?]
[Select Approval Mode: Auto / Manual / Invite-Only]
[Toggle: Waitlist Enabled?]
[Toggle: Check-In Required?]
[Set Check-In Window]
[Click "Save & Continue"]
        ↓
═══════════════ WIZARD STEP 4: PRIZE POOL ═══════════════
[Enter Total Prize Pool Amount]
[Select Distribution Type: Fixed / Percentage]
[Enter Prize per Position]
{Validate: sum ≤ prize pool}
{Show prize distribution visualization}
[Click "Save & Continue"]
        ↓
═══════════════ WIZARD STEP 5: RULES & COMMS ═══════════════
[Write/Import Tournament Rules]
[Configure Pre-Tournament Message Template]
[Configure Match Day Message Template]
[Click "Save & Continue"]
        ↓
═══════════════ WIZARD STEP 6: STAFF ═══════════════
[Search & Assign Tournament Co-Director]
[Search & Assign Referees]
[Search & Assign Broadcast Producers]
[Click "Save & Continue"]
        ↓
═══════════════ WIZARD STEP 7: REVIEW & PUBLISH ═══════════════
{Display complete settings summary}
{Run pre-publish validation}
<Validation Passed?>
├── NO  → Show error list with links to fix each
│          [Fix errors] → Return to relevant step
└── YES → Show "✅ All checks passed"

[Preview Public Page] → Opens preview in new tab
        ↓
[Choose publication action]
    ├── "Save as Draft" → Status: DRAFT
    ├── "Schedule Publication" → Set future date/time
    └── "Publish Now" → Status: PUBLISHED
        ↓
✅ Tournament Published!
{System sends "Tournament Published" audit log entry}
{Tournament appears in platform directory}
{Share link displayed with copy button}
```

---

## 7.3 Post-Publication Flow

```
TOURNAMENT: PUBLISHED
        ↓
{Registration Open Date/Time arrives}
{Auto-transition → REGISTRATION_OPEN}
{Notification sent to all org followers}
        ↓
[Teams begin registering] → FLOW 03
        ↓
{Registration Close Date/Time arrives}
{Auto-transition → REGISTRATION_CLOSED}
{Director receives "Registration closed" notification}
        ↓
[Director reviews registrations]
[Approves/Rejects/Requests corrections]
        ↓
[Director clicks "Generate Schedule"]
        ↓
{Auto-schedule generated}
[Director reviews schedule]
[Edits if needed]
[Clicks "Publish Schedule"]
        ↓
{All team captains notified of their schedule}
        ↓
[Director opens Check-In]
        ↓
→ FLOW 04 (Match Day Operations)
```

---

---





# SECTION 9 — FLOW 04: MATCH DAY OPERATIONS (ORGANIZER + REFEREE)

---

## 9.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actors** | Tournament Director (ROLE-04) + Referee (ROLE-05) |
| **Entry Point** | Command Center — tournament in CHECK_IN state |
| **Exit Points** | Tournament marked COMPLETED |
| **Duration** | 6–12 hours (full tournament day) |

---

## 9.2 Match Day Master Flow

```
════════════════ PHASE 1: CHECK-IN ════════════════

{Check-In window opens automatically}
{NOTIF-09 sent to all confirmed teams}
        ↓
(Command Center → Check-In Section)
[Director monitors check-in grid in real time]

{Teams check in via their dashboards}
{Cards turn green as teams confirm}

{30 min before deadline → NOTIF-10 sent to unchecked teams}
{10 min before deadline → NOTIF-11 sent to unchecked teams}

{Check-In deadline passes}
        ↓
[Director reviews unchecked teams]
[For each no-show:]
    [Click "Mark as No-Show"]
    <Waitlist available?>
    ├── YES → [Promote waitlisted team]
    │          {NOTIF-06 sent to waitlisted team}
    │          {2-hour acceptance window}
    └── NO  → [Mark slot as Bye]

[All slots resolved]
[Director clicks "Open First Match"]
        ↓
════════════════ PHASE 2: MATCH EXECUTION (per match) ════════════════

[Tournament Director or Referee opens Match Control Panel]
        ↓
STEP A: Open Lobby
[Click "Open Lobby"]
{Match status → LOBBY_OPEN}
{Credential entry enabled}
        ↓
STEP B: Enter Room Credentials (→ FLOW 07)
[Referee opens Credential Entry form]
[Enters Room ID + Password]
[Selects Release Mode: Instant/Timed/Manual]
[Saves credentials]
        ↓
STEP C: Release Credentials
{If Instant → Released immediately}
{If Timed → Released at configured time}
{If Manual → Released when referee clicks "Release Now"}
{NOTIF-14 sent to all teams in this match}
{Teams receive Credential Cards}
        ↓
STEP D: Lobby Readiness Check
[Referee checks Lobby Readiness Tracker]
{Shows which team captains have acknowledged credentials}
[Referee confirms all teams present in room]
        ↓
STEP E: Start Match
[Referee clicks "Mark In Progress"]
{Match status → IN_PROGRESS}
{Match timer starts}
{Broadcast overlay updates: "Match X — In Progress"}

<Technical Issue?>
├── YES → [Click "Declare Technical Pause"]
│          [Select reason, set estimated resume]
│          {Match status → PAUSED}
│          {NOTIF-17 sent to all teams}
│          → FLOW: Technical Pause Sub-Flow
└── NO  → Match plays out in-game (~25–35 min)

        ↓
[Match ends in-game]
        ↓
STEP F: Submit Results (→ FLOW 06)
[Referee opens Result Entry Form]
[Enters placement + kills for all teams]
{Points auto-calculated}
[Uploads screenshot evidence]
[Submits results]
{Match status → RESULT_SUBMITTED}

<Verification Mode?>
├── AUTO-PUBLISH → {Results published immediately}
│                   {Leaderboard updated}
│                   {NOTIF-15 sent to teams}
└── DIRECTOR-VERIFY → {Director notified}
                       [Director reviews & approves]
                       {Results published}
        ↓
STEP G: Proceed to Next Match
[Referee opens Match Control Panel for Match N+1]
[Repeat from STEP A]

════════════════ PHASE 3: TOURNAMENT COMPLETION ════════════════

[All matches scored and verified]
[Director reviews final leaderboard]
        ↓
<Any open disputes?>
├── YES → [Resolve all disputes first]
└── NO  → Continue

[Director clicks "Complete Tournament"]
{Confirmation prompt: "Finalize results? This cannot be undone."}
[Director confirms]
{Tournament status → COMPLETED}
{Leaderboard locked}
{NOTIF-22 sent to prize winners}
→ FLOW 10 (Prize Distribution)
```

---

## 9.3 Technical Pause Sub-Flow

```
[Referee clicks "Declare Technical Pause"]
        ↓
(Technical Pause Modal)
[Select reason:]
├── Game crash / disconnect
├── Unauthorized player in lobby
├── Network issue
├── Observer issue
└── Other (specify)
[Enter estimated resume time]
[Click "Declare Pause"]
        ↓
{Match status → PAUSED}
{NOTIF-17 pushed to all teams in match}
{Overlay updates: "⏸️ Match Paused"}
{Pause timer starts}

<Issue resolved?>
├── YES (< 30 min)
│       [Referee clicks "Resume Match"]
│       {Match status → IN_PROGRESS}
│       {NOTIF-18 pushed to teams}
│       {Overlay updates: "▶️ Match Resuming"}
│
├── YES (30–60 min, requires Director approval)
│       {System flags: "Director approval required"}
│       [Director reviews and approves continuation]
│       [Referee resumes]
│
└── Issue unresolvable (> 60 min or cannot resolve)
        [Tournament Director clicks "Void Match"]
        [Enters void reason]
        {Match → VOIDED}
        <Schedule Rematch?>
        ├── YES → [Create new match entry]
        │          [Assign same teams]
        │          [Set new time]
        └── NO  → [Match excluded from scoring]
```

---

---





# SECTION 14 — FLOW 09: DISPUTE SUBMISSION & RESOLUTION

---

## 14.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actors** | Team Captain (submits) → Tournament Director (resolves) → Super Admin (escalation) |
| **Trigger** | Team believes their match result is incorrect |
| **Window** | 30 minutes after result publication (score disputes) |

---

## 14.2 Dispute Flow Diagram

```
════════ PLAYER SIDE: DISPUTE SUBMISSION ════════

[Team Captain views match results]
{Notices incorrect kill count or placement}
[Clicks "Report Incorrect Score"]
{System checks: dispute window open? (< 30 min since publish)}
<Window open?>
├── NO  → "Dispute window closed (closed at [time]). Contact organizer directly."
└── YES → (Dispute Submission Form)

┌──────────────────────────────────────────────────┐
│ DISPUTE SUBMISSION — Match 3                     │
│ Reference: DSP-BGMI-0042                         │
│                                                  │
│ Dispute Type: ● Incorrect Kill Count             │
│               ○ Incorrect Placement              │
│               ○ Other                            │
│                                                  │
│ Team: Hydra Esports                              │
│                                                  │
│ We scored [___] kills, not [___] as recorded.    │
│                                                  │
│ Description:                                     │
│ [Our team had 9 kills. The screenshot shows     │
│  '9K' in the results screen. The system shows  │
│  7 kills. Please review the attached evidence.] │
│                                                  │
│ Evidence (screenshot): [Upload Image]            │
│                                                  │
│ [Submit Dispute]                                 │
└──────────────────────────────────────────────────┘

[Captain completes form, uploads screenshot]
[Clicks "Submit Dispute"]
        ↓
{Dispute record created}
{Reference number assigned: DSP-BGMI-0042}
{Priority calculated: High (affects standings)}
{Tournament Director notified immediately}
{Audit log: dispute_created}

✅ "Dispute submitted (DSP-BGMI-0042). 
    You'll be notified of the decision."

════════ ORGANIZER SIDE: DISPUTE REVIEW ════════

{Tournament Director receives urgent notification}
{Red pulsing badge appears in Command Center nav}
        ↓
[Director opens Disputes Section]
[Sees dispute card: DSP-BGMI-0042 — 🔴 HIGH PRIORITY]
[Opens Dispute Detail View]
        ↓
(Dispute Detail View shows:)
┌──────────────────────────────────────────────────┐
│ DSP-BGMI-0042 — HIGH PRIORITY                    │
│                                                  │
│ Team: Hydra Esports                              │
│ Match: Match 3, Round 1                          │
│ Type: Incorrect Kill Count                       │
│ Claimed: 9 kills (recorded: 7 kills)             │
│                                                  │
│ Captain's Description: [full text]               │
│                                                  │
│ [Evidence Screenshot — click to expand]          │
│                                                  │
│ Linked Result Data:                              │
│ Hydra Esports: Placement 2, Kills 7, Points 19  │
│ (Would be 21pts if 9 kills confirmed)            │
│                                                  │
│ Leaderboard Impact:                              │
│ 2pt change — Hydra moves from 4th to 2nd        │
│                                                  │
│ [View Audit Log for this match]                  │
│ [View Original Screenshot Evidence]              │
└──────────────────────────────────────────────────┘

[Director expands evidence screenshot]
[Compares with original submission screenshot]
[Reviews audit log for any corrections]
        ↓
<Decision?>
├── UPHOLD DISPUTE (Correction needed)
│       [Director selects "Resolved — Correction Made"]
│       [Enters Resolution Note:]
│       "Reviewed screenshot evidence. Team clearly had
│        9 kills as shown in the results screen. 
│        Correcting kill count from 7 to 9."
│       [Clicks "Resolve & Apply Correction"]
│               ↓
│       {Score correction applied: kills 7 → 9}
│       {Points recalculated: 19 → 21}
│       {Leaderboard recalculated}
│       {All overlays updated}
│       {Correction logged in audit trail}
│       {NOTIF-24 sent to Team Captain: "Dispute resolved"}
│       ✅ Dispute closed
│
├── DENY DISPUTE (No change)
│       [Director selects "Resolved — No Change"]
│       [Enters Resolution Note:]
│       "Reviewed both screenshots. The results screen
│        in our evidence clearly shows 7 kills for 
│        Hydra Esports. No correction warranted."
│       [Clicks "Resolve"]
│               ↓
│       {No score change}
│       {NOTIF-24 sent to Team Captain: "Dispute reviewed"}
│       {Resolution note included in notification}
│       ✅ Dispute closed
│
└── ESCALATE (Conflict of interest / Captain appeals)
        [Captain or Director escalates to Super Admin]
        → Super Admin Escalation Sub-Flow below

════════ ESCALATION SUB-FLOW ════════

{Dispute escalated to Super Admin queue}
        ↓
[Super Admin opens Escalated Disputes panel]
[Reviews full dispute history, both parties' evidence]
[Has access to complete audit log]
        ↓
<Decision?>
├── Override Tournament Director → Apply correction
│   {Same correction flow as above}
│   {Audit log: super_admin_override}
│
└── Confirm Tournament Director → No change
    {NOTIF-24 to Team Captain: "Escalation reviewed — final decision"}
    {This is final; no further appeal allowed}
```

---

---





# SECTION 15 — FLOW 10: PRIZE DISTRIBUTION

---

## 15.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actors** | Tournament Director → Winners (Team Captains) → System (payment) |
| **Trigger** | Tournament marked COMPLETED, leaderboard locked |
| **Duration** | 1–7 days depending on winner verification speed |

---

## 15.2 Prize Distribution Flow

```
{Tournament → COMPLETED}
{Leaderboard locked}
        ↓
{System generates prize payout records:}
For each prize position (1st, 2nd, 3rd...):
  → PrizePayout record created
  → Status: PENDING
  → Linked to winning team's registration
        ↓
{NOTIF-22 sent to winning Team Captains:}
"🏆 Congratulations! You finished [Position] in [Tournament].
 Submit your payout details to receive ₹[Amount].
 Deadline: [Date + 7 days]"
        ↓
════════ WINNER SIDE: SUBMIT PAYOUT DETAILS ════════

[Team Captain opens payout notification]
[Navigates to: My Tournaments → [Tournament] → Prize]
        ↓
(Payout Details Form)
┌──────────────────────────────────────────────────┐
│ 🏆 YOU WON ₹5,000!                              │
│                                                  │
│ Submit your payout details to receive your prize.│
│ Deadline: Sunday, June 15 at 11:59 PM           │
│                                                  │
│ Payout Method:                                   │
│ ● UPI ID (instant, recommended)                 │
│ ○ Bank Transfer (2–3 business days)             │
│                                                  │
│ UPI ID: [hydraesports@okicici________]           │
│ [Validate UPI ID]                                │
│                                                  │
│ 🔒 Your payment details are encrypted.          │
│    The organizer cannot see your UPI ID.        │
│                                                  │
│ Note about TDS:                                  │
│ Prize > ₹10,000: 30% TDS deducted              │
│ Your prize: ₹5,000 — TDS: ₹0 (below threshold) │
│                                                  │
│ [Submit Payout Details]                          │
└──────────────────────────────────────────────────┘

[Captain enters UPI ID]
[Clicks "Validate UPI ID"]
{System calls UPI VPA validation API}
<UPI valid?>
├── NO  → ⚠️ "UPI ID not found. Check and try again."
└── YES → ✅ "Valid UPI — HDFC Bank | Arjun R."

[Captain clicks "Submit Payout Details"]
{Payout record updated: upi_id stored, details_submitted_at recorded}
        ↓
════════ ORGANIZER SIDE: INITIATE PAYOUTS ════════

[Tournament Director opens Prize Distribution Panel]
        ↓
┌──────────────────────────────────────────────────┐
│ PRIZE DISTRIBUTION — BGMI Weekend Cup #12       │
│                                                  │
│ Total Prize Pool: ₹15,000                       │
│ Prizes Pending: ₹15,000                         │
│                                                  │
│ Pos │ Team              │ Amount  │ Status       │
│─────┼───────────────────┼─────────┼──────────────│
│ 🥇  │ Storm Squad       │ ₹7,500  │ Details ✅   │
│ 🥈  │ Hydra Esports     │ ₹5,000  │ Details ✅   │
│ 🥉  │ Phoenix Rising    │ ₹2,500  │ ⏳ Pending   │
│                                                  │
│ [Initiate All Ready Payouts]                     │
└──────────────────────────────────────────────────┘

{Phoenix Rising hasn't submitted details yet}
[Director waits or clicks "Send Reminder"]
{NOTIF-22 resent to Phoenix Rising captain}

[Director clicks "Initiate All Ready Payouts"]
{Confirmation: "Pay ₹12,500 to 2 winners. Confirm?"}
[Director confirms]
        ↓
{Razorpay Payout API called for each winner:}
For Storm Squad: ₹7,500 UPI transfer initiated
For Hydra Esports: ₹5,000 UPI transfer initiated
        ↓
{Payout status: QUEUED → PROCESSING → COMPLETED}
{NOTIF-23 sent to each winner upon completion}
{Receipt generated and stored}
        ↓
{Phoenix Rising: still pending after deadline}
{After 30 days: prize returned to organizer escrow}
        ↓
{Organizer payout released:}
Total collected: ₹12,800 (64 teams × ₹200)
Platform fee (5%): ₹640
Prize pool: ₹15,000 (sponsor-funded in this case)
Net organizer: ₹12,160
{Transfer to org payout account}
✅ Prize distribution complete
```

---

---





# SECTION 16 — FLOW 11: COMMAND CENTER MASTER FLOW

---

## 16.1 The Command Center Journey (Director View)

```
[Tournament Director opens Command Center]
{Initial load: fetches all tournament state data}
{WebSocket connection established}
        ↓
(Overview Section — Default Landing)
        ↓
╔═══════════════════════════════════════════════════╗
║              COMMAND CENTER LOOP                  ║
║                                                   ║
║   Director monitors Overview continuously         ║
║   Pending Actions widget surfaces issues          ║
║                                                   ║
║   ┌─────────────────────────────────────────┐    ║
║   │ PENDING ACTIONS (real-time):            │    ║
║   │ 🔴 1 Critical Dispute — DSP-BGMI-0042  │    ║
║   │ 🟠 2 Results await verification         │    ║
║   │ 🟡 6 teams not checked in              │    ║
║   │ 🔵 Match 4 opens in 8 minutes          │    ║
║   └─────────────────────────────────────────┘    ║
║                                                   ║
║   Director addresses items in priority order:     ║
║                                                   ║
║   1. [Click Dispute] → Disputes Section           ║
║      → Resolve dispute → return to Overview       ║
║                                                   ║
║   2. [Click Results] → Scoring Section            ║
║      → Verify 2 results → return to Overview      ║
║                                                   ║
║   3. [Click Check-In] → Check-In Section          ║
║      → Send reminders to 6 teams                  ║
║      → Mark 2 as no-show → return to Overview     ║
║                                                   ║
║   4. [Match 4 countdown reaches 0]                ║
║      Toast: "⏰ Match 4 lobby should open now!"   ║
║      [Click "Open Lobby"] on toast action button  ║
║      → Match 4 status → LOBBY_OPEN               ║
║      → Credentials section flagged if not entered ║
║                                                   ║
║   Throughout all of this:                         ║
║   - Leaderboard section auto-updates              ║
║   - Stream health visible in Broadcast section    ║
║   - Audit log records every action               ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
        ↓
{All matches complete}
[Director navigates to Leaderboard Section]
[Verifies final standings]
[Confirms no open disputes]
[Clicks "Complete Tournament"]
{Confirmation dialog}
[Confirms]
{Tournament → COMPLETED}
{Leaderboard locked}
{Command Center displays: "Tournament Complete 🏆"}
[Director navigates to Finance Section]
[Initiates prize payouts]
→ FLOW 10
```

---

---





---


---





---

# ECOSYSTEM SIDE: 2. 🎮 PLAYER & TEAM PORTAL

---

# SECTION 8 — FLOW 03: TEAM CAPTAIN — REGISTER FOR TOURNAMENT

---

## 8.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actor** | Team Captain (ROLE-07) |
| **Entry Point** | Tournament public page or team dashboard |
| **Exit Points** | Registration confirmed (awaiting approval or auto-approved) |
| **Estimated Time** | 3–7 minutes |
| **Key Decisions** | Roster confirmation, UID entry, payment |

---

## 8.2 Flow Diagram

```
(Tournament Public Page)
        ↓
<Is user logged in?>
├── NO  → [Login/Register prompt] → FLOW 01
└── YES → Continue

<Tournament Status = REGISTRATION_OPEN?>
├── NO  → Show status-appropriate message
│          (Coming Soon / Closed / Ongoing)
└── YES → Continue

<Slots available?>
├── FULL + waitlist enabled → Show "Join Waitlist" CTA
├── FULL + no waitlist     → "Registration Full"
└── SLOTS AVAILABLE        → Show "Register Now" CTA

[Click "Register Now"]
        ↓
════════════ STEP 1: SELECT TEAM ════════════
{Load all teams captained by user for this game}
<User has eligible team?>
├── NO  → "Create a team first" prompt → Team Creation
└── YES → Display team cards

[Select team to register]
        ↓
════════════ STEP 2: CONFIRM ROSTER & UIDs ════════════
{Load team roster from saved team data}
{Pre-fill UIDs from linked game accounts}

Display each player row:
┌─────────────────────────────────────────────────┐
│ Player Name | In-Game Name | UID | Status       │
│─────────────────────────────────────────────────│
│ Arjun       | ArjunOP      | 5491234567 | ✅     │
│ Ravi        | RaviSnipe    | [Enter UID] | ⚠️    │
│ Kiran       | KiranRush    | 5499876543 | ✅     │
│ Dev         | DevIGL       | 5481234321 | ✅     │
│ Sam (Sub)   | SamBackup    | [Enter UID] | ⚠️    │
└─────────────────────────────────────────────────┘

[Edit any UID that needs correction]
{Real-time UID format validation as captain types}
{Real-time duplicate UID check against tournament}

<All UIDs valid?>
├── NO  → Show inline errors; block "Continue"
└── YES → Enable "Continue" button

[Click "Continue"]
        ↓
════════════ STEP 3: REVIEW RULES ════════════
{Display full tournament rules}
[Captain scrolls to bottom]
[Checks acknowledgment: "I have read and agree..."]
{Record: timestamp + IP address}
[Click "Continue"]
        ↓
════════════ STEP 4: PAYMENT ════════════
<Entry Fee = ₹0?>
├── YES → Skip to Step 5
└── NO  → Show payment screen

{System reserves slot for 15 minutes}
{Display 15:00 countdown timer}

┌─────────────────────────────────────────┐
│ Entry Fee:          ₹200                │
│ Platform Fee (5%):  ₹10                 │
│ Total Charged:      ₹210                │
│                                         │
│ Pay via:                                │
│ [UPI] [Card] [Net Banking] [Wallet]     │
└─────────────────────────────────────────┘

[Select payment method]
[Complete payment via Razorpay]

<Payment Success?>
├── NO  → ⚠️ Payment failed
│          "Retry Payment" / "Try Different Method"
│          Slot held for retry (15-min timer continues)
└── YES → Continue

        ↓
════════════ STEP 5: CONFIRMATION ════════════
{Registration record created}
{Audit log entry: registration_submitted}

<Approval Mode?>
├── AUTO  → {Status → APPROVED}
│             {Send NOTIF-02: Registration Approved}
│             ✅ "Registration Confirmed!"
└── MANUAL → {Status → UNDER_REVIEW}
              {Send NOTIF-01: Registration Submitted}
              {Notify Tournament Director}
              ✅ "Registration submitted — awaiting approval"

Display confirmation screen:
┌──────────────────────────────────────────┐
│ ✅ Registration Submitted!               │
│                                          │
│ Reference: GV-BGMI-004821               │
│ Team: Hydra Esports                      │
│ Tournament: BGMI Weekend Cup #12         │
│ Status: Awaiting Approval                │
│                                          │
│ 📅 Check-In: Sunday 10:00 AM IST        │
│ 💬 Join Tournament Discord: [link]       │
│ 📱 Enable notifications for updates      │
└──────────────────────────────────────────┘
```

---

## 8.3 Manual Approval Sub-Flow

```
ORGANIZER SIDE (runs in parallel)

{Tournament Director receives new registration notification}
        ↓
(Registration Management Panel)
[Director views new registration]
{System shows flag score: 🟢/🟡/🔴}
        ↓
[Director reviews UIDs, roster, payment]
        ↓
<Decision?>
├── APPROVE
│       ↓
│   {Status → APPROVED}
│   {NOTIF-02 sent to Team Captain}
│   {Team slot count incremented}
│
├── REJECT
│       ↓
│   [Director enters rejection reason]
│   {Status → REJECTED}
│   {NOTIF-03 sent to Team Captain}
│   {Refund initiated automatically}
│
└── REQUEST CORRECTION
        ↓
    [Director selects which UIDs need correction]
    [Enters correction instructions]
    [Sets correction deadline]
    {Status → CORRECTION_REQUESTED}
    {NOTIF-04 sent to Team Captain}

        ↓ [Captain receives correction request]
[Captain edits UIDs on their registration form]
[Clicks "Resubmit Correction"]
{Status → CORRECTION_SUBMITTED}
{Director notified}
        ↓
[Director reviews correction]
→ Back to <Decision?> above
```

---

---





# SECTION 10 — FLOW 05: MATCH DAY EXPERIENCE (PLAYER)

---

## 10.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actor** | Player (ROLE-08) or Team Captain (ROLE-07) |
| **Entry Point** | Player Dashboard / Match Day notification |
| **Exit Points** | Match completed, result viewed |
| **Duration** | Ongoing throughout tournament day |

---

## 10.2 Player Match Day Flow

```
{NOTIF-09: Check-In Open received}
        ↓
[Player opens GameVerse app/website]
(Match Day Dashboard)
        ↓
════════════ CHECK-IN ════════════
{If user is Team Captain:}
[See "Check In Now" button prominently displayed]
[Click "Check In"]
{System records check-in: team ID, timestamp, IP}
✅ "Your team Hydra Esports is checked in!"

{If user is Player (not captain):}
[See check-in status: "Captain has not yet checked in"]
[See check-in status: "✅ Team checked in at 10:23 AM"]
        ↓
════════════ PRE-MATCH WAITING ════════════
(Match Day Dashboard shows:)
┌─────────────────────────────────────────┐
│ YOUR NEXT MATCH                         │
│                                         │
│ Match 3 — Round 2                       │
│ Slot: 7                                 │
│ Estimated Start: 2:30 PM                │
│ Status: LOBBY OPENS IN 14:32           │
│                                         │
│ [View Full Schedule]  [View Leaderboard]│
└─────────────────────────────────────────┘

{NOTIF-12: "Match starting in 60 min" received}
{NOTIF-13: "Match starting in 15 min" received}
        ↓
════════════ CREDENTIAL RECEIPT ════════════
{Room credentials released by Referee}
{NOTIF-14 pushed: "🔑 Room credentials available for Match 3!"}

[Push notification tapped / App opened]
        ↓
(Credential Card appears — full width, prominent)
┌─────────────────────────────────────────┐
│  🔑 MATCH 3 — ROOM CREDENTIALS         │
│                                         │
│  Your Slot: 7                           │
│                                         │
│  Room ID:   A7B3C9    [Copy]            │
│  Password:  XK29      [Copy]            │
│                                         │
│  ⏳ Credentials expire in 28:45         │
│                                         │
│  Instructions:                          │
│  Open BGMI → Custom Room → Enter ID    │
│  Join Slot 7 when inside room          │
└─────────────────────────────────────────┘

{System records: credential viewed (user_id, timestamp, IP)}
        ↓
════════════ IN-GAME ════════════
[Player opens BGMI, enters custom room]
[Joins Slot 7]
[Match begins]

{Match status updates visible on dashboard:}
"● IN PROGRESS — Match 3" (live pulsing dot)
        ↓
════════════ POST-MATCH ════════════
[Match ends in-game]

{Result submitted by Referee}
{Leaderboard recalculated}
{NOTIF-15 pushed: "Match 3 results are in!"}

[Player opens app]
(Results View)
┌─────────────────────────────────────────┐
│  MATCH 3 RESULTS                        │
│                                         │
│  🏆 1st: Storm Squad — 8 kills — 23pts  │
│  2nd: Hydra Esports — 6 kills — 18pts  │ ← Your team
│  3rd: Phoenix — 5 kills — 15pts        │
│  ...                                    │
│                                         │
│  YOUR STANDING: 2nd overall (41 pts)    │
│                                         │
│  ⏱️ Dispute window: 27 min remaining    │
│  [Report Incorrect Score]               │
└─────────────────────────────────────────┘

<Result correct?>
├── YES → Continue to next match
└── NO  → [Click "Report Incorrect Score"]
            → FLOW 09 (Player Dispute Submission)
```

---

---





# SECTION 12 — FLOW 07: SECURE ROOM CREDENTIAL DISTRIBUTION

---

## 12.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actors** | Referee (enters/releases) → System (encrypts/distributes) → Players (receive) |
| **Trigger** | Match enters LOBBY_OPEN state |
| **Goal** | Deliver Room ID + Password ONLY to teams assigned to this match |

---

## 12.2 Credential Flow Diagram

```
[Referee opens Match Control Panel]
[Clicks "Open Lobby"]
{Match status → LOBBY_OPEN}
        ↓
[Referee clicks "Enter Credentials"]
        ↓
(Credential Entry Modal)
┌─────────────────────────────────────────┐
│ MATCH 3 — CREDENTIAL ENTRY             │
│                                         │
│ Room ID:    [________]                  │
│ Password:   [________]                  │
│                                         │
│ Release Mode:                           │
│ ○ Instant (release now)                │
│ ● Timed (release at: 2:25 PM)          │
│ ○ Manual (release when I say)          │
│                                         │
│ [Save Credentials]                      │
└─────────────────────────────────────────┘

[Referee enters Room ID and Password]
[Selects Timed Release at 2:25 PM]
[Clicks "Save Credentials"]
        ↓
{System encrypts Room ID + Password (AES-256)}
{Stores encrypted values in RoomCredentials table}
{Stores entry hash for audit}
{Audit log: credential_entered}
        ↓
{2:25 PM arrives}
{Release job triggers from queue}

{System determines eligible recipients:}
→ Query MatchSlots WHERE match_id = Match3
→ Query RegistrationRoster WHERE registration_id IN slots
→ Result: 64 eligible player user_ids (16 teams × 4 players)
        ↓
{Decrypt credentials (server-side only)}
{Prepare delivery payload per recipient:}
{
  match_id, match_number, round,
  slot_number (team-specific),
  room_id (decrypted),
  password (decrypted),
  release_at, expires_at
}
        ↓
{Delivery channels simultaneously:}
├── In-App WebSocket push to all 64 active sessions
├── Push notification (FCM/APNs) to all devices
└── SMS to 16 team captains (if enabled)
        ↓
{Credential Cards appear on each player's screen}
{Audit log: credential_released}
        ↓
{Each player views Credential Card}
{Audit log: credential_viewed (per user)}
        ↓
[Referee watches Lobby Readiness Tracker]
┌─────────────────────────────────────────┐
│ LOBBY READINESS — MATCH 3              │
│                                         │
│ ✅ Hydra Esports    — Acknowledged      │
│ ✅ Storm Squad      — Acknowledged      │
│ ⏳ Phoenix Rising   — Not yet...        │
│ ✅ Nexus Gaming     — Acknowledged      │
│ ... (12 more teams)                     │
└─────────────────────────────────────────┘

<All teams acknowledged?>
├── MOSTLY → Referee proceeds (can't wait indefinitely)
└── ALL    → "All teams ready" indicator shown
        ↓
[Referee clicks "Mark In Progress"]
→ Continue FLOW 04 (Match Execution)

════ CREDENTIAL SECURITY EXCEPTIONS ════

<Suspected Leak?>
[Referee clicks "⚠️ Suspected Leak"]
[Confirms action]
        ↓
{Old credential → is_revoked = TRUE}
{All Credential Cards: Room ID/Password hidden}
{"Credentials updating..." shown on player screens}
{Audit log: credential_rotated, security_flag_raised}
{Dispute record created in MOD-20}
{Tournament Director notified urgently}
        ↓
[Referee enters new Room ID + Password]
[Instant Release]
{New credentials delivered to all 64 players}
{NOTIF: "⚠️ Room credentials updated for Match 3"}
```

---

---





---


---





---

# ECOSYSTEM SIDE: 3. 📺 PUBLIC LIVE TOURNAMENT WEBSITE

---

# SECTION 11 — FLOW 06: LIVE SCORING & LEADERBOARD UPDATE

---

## 11.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actors** | Referee (submits) → Tournament Director (verifies) → System (publishes + calculates) |
| **Trigger** | Match reaches IN_PROGRESS state and ends |
| **Duration** | 2–5 minutes from match end to leaderboard update |

---

## 11.2 Scoring Flow Diagram

```
[Match ends in-game]
        ↓
[Referee clicks "Submit Results" in Match Control Panel]
        ↓
(Result Entry Form opens)
┌──────────────────────────────────────────────────────┐
│ MATCH 3 — RESULT ENTRY              Scoring: BGIS    │
│ Kill Points: 1pt each    Placement Points: see table │
│──────────────────────────────────────────────────────│
│ # │ Team Name        │ Placement │ Kills │ Points   │
│───┼──────────────────┼───────────┼───────┼──────────│
│ 1 │ Hydra Esports    │ [2  ]     │ [6 ]  │ 18.0 ←live│
│ 2 │ Storm Squad      │ [1  ]     │ [8 ]  │ 23.0 ←live│
│ 3 │ Phoenix Rising   │ [3  ]     │ [5 ]  │ 15.0 ←live│
│ 4 │ ... (13 more)    │           │       │           │
└──────────────────────────────────────────────────────┘
        ↓
{As referee types:}
{Real-time format validation}
{Duplicate placement detection}
{Live points preview updates at every keystroke}

[Referee uploads screenshot evidence]
[Clicks "Submit Results"]
        ↓
{Client-side validation:}
<All placements unique 1–16?>
├── NO  → ⚠️ "Teams [X] and [Y] both marked as placement [N]"
└── YES → Continue

{Server-side validation:}
<Match in correct state?>
├── NO  → Error: match state mismatch
└── YES → Continue

{Points Calculation Engine executes:}
For each team:
  effective_kills = MIN(raw_kills, kill_cap)
  kill_points = effective_kills × 1.0
  placement_points = lookup[placement]
  total = placement_points + kill_points
{Anomaly detection runs}
        ↓
{MatchResult record created}
{TeamMatchResult records created for all 16 teams}
{Match status → RESULT_SUBMITTED}
        ↓
<Publication Mode?>
│
├── AUTO-PUBLISH
│       {Status → PUBLISHED immediately}
│       {Trigger leaderboard recalculation}
│       {Push NOTIF-15 to all teams in match}
│       {WebSocket event: leaderboard_updated}
│       {OBS overlays receive update}
│       → Jump to LEADERBOARD UPDATE
│
└── DIRECTOR-VERIFY
        {Status → PENDING_VERIFICATION}
        {NOTIF to Tournament Director}
        [Director opens verification screen]
        [Reviews results + screenshots]
        [Reviews anomaly flags if any]
                ↓
        <Decision?>
        ├── APPROVE
        │       {Status → PUBLISHED}
        │       → Same as AUTO-PUBLISH above
        │
        └── REQUEST CORRECTION
                [Director notes which team needs correction]
                [Referee corrects values]
                [Resubmits]
                → Loop back to validation

════════════ LEADERBOARD UPDATE ════════════

{LeaderboardEngine.recalculate(tournament_id)}
        ↓
For each team:
  1. Sum all published match points
  2. Count chicken dinners
  3. Sum total kills
  4. Apply tiebreaker sort
  5. Assign rank numbers
        ↓
{LeaderboardEntries table updated}
{Previous ranks stored for movement calculation}
{Cache invalidated and refreshed in Redis}
        ↓
{WebSocket broadcast on channel:}
{tournament:{id}:leaderboard → leaderboard_updated event}
        ↓
All connected clients receive update simultaneously:
├── Tournament public page → Leaderboard updates
├── Player dashboards → Standing updates
├── Command Center → Leaderboard section updates
├── OBS Overlays → Overlay visually updates
│    ├── OVL-01 (Full Leaderboard): rows animate
│    ├── OVL-02 (Top 10): positions update
│    └── OVL-03 (Match Info Bar): match status updates
└── Sponsor Dashboard → (batch update, not real-time)
        ↓
✅ Leaderboard update complete
{Time from match end → leaderboard visible: target < 3 minutes}
```

---

---





---


---





---

# ECOSYSTEM SIDE: 4. 🎥 PRODUCTION & STREAM CONTROL PANEL

---

# SECTION 13 — FLOW 08: BROADCAST PRODUCER WORKFLOW

---

## 13.1 Flow Overview

| Attribute | Detail |
|-----------|--------|
| **Actor** | Broadcast Producer (ROLE-06) |
| **Entry Point** | Broadcast Dashboard / Command Center → Broadcast Section |
| **Duration** | Entire tournament day (6–12 hours) |

---

## 13.2 Broadcast Setup Flow

```
════════ PRE-TOURNAMENT: BROADCAST SETUP ════════

[Broadcast Producer logs in]
[Opens Tournament → Broadcast Dashboard]
        ↓
STEP 1: Configure Stream
[Select Platform: YouTube/Twitch/Custom RTMP]
[Enter Channel ID or Stream URL]
[Enter Stream Key (encrypted on save)]
[Test connection]
<Connection valid?>
├── NO  → ⚠️ "Cannot connect to stream platform"
└── YES → ✅ "Stream configured"
        ↓
STEP 2: Connect OBS WebSocket
[Open OBS Studio on production machine]
[Enable WebSocket Server in OBS (port 4455)]
[In Broadcast Dashboard: enter ws://localhost:4455]
[Enter OBS WebSocket password]
[Click "Connect"]
<Connection established?>
├── NO  → ⚠️ "OBS not reachable. Check OBS is running."
└── YES → ✅ "OBS Connected — 8 scenes detected"
        ↓
STEP 3: Configure Overlays
[Open Overlay Management Panel]

For each overlay type:
┌────────────────────────────────────────────────────┐
│ OVL-01: Full Leaderboard                           │
│ Status: ⚫ Not Connected                           │
│ URL: gameverse.gg/overlay/abc.../leaderboard       │
│ [Copy URL]  [Configure]  [Preview]                 │
├────────────────────────────────────────────────────│
│ OVL-03: Match Info Bar                             │
│ Status: ⚫ Not Connected                           │
│ URL: gameverse.gg/overlay/abc.../matchbar          │
│ [Copy URL]  [Configure]  [Preview]                 │
└────────────────────────────────────────────────────┘

[Producer copies each overlay URL]
[Adds each as Browser Source in OBS:]
  - OBS → Add Source → Browser
  - Paste URL
  - Set dimensions (e.g., 400×600 for leaderboard)
  - Enable "Shutdown source when not visible"

{OBS loads each browser source URL}
{Overlays connect to GameVerse WebSocket}
{Status updates: 🟢 Connected}
        ↓
STEP 4: Configure Scenes in OBS
Producer creates OBS scenes:
├── "Match Live" scene
│    └── Sources: Game Feed + OVL-01 + OVL-03
├── "Break Screen" scene
│    └── Sources: Tournament Graphic + Music
├── "Result Screen" scene
│    └── Sources: Game Feed + OVL-06 (Result Splash)
└── "Grand Finale" scene
     └── Sources: Game Feed + OVL-02 + OVL-07

[Producer configures Quick Scene Buttons in Dashboard]
        ↓
════════ LIVE BROADCAST OPERATIONS ════════

[Tournament goes LIVE]
[Producer starts stream via OBS]
{Stream health metrics appear in Broadcast Dashboard:}
├── Bitrate: 6000 kbps ✅
├── FPS: 60 ✅
├── Dropped Frames: 0.0% ✅
└── CPU Usage: 45% ✅

[Producer monitors viewer count (updates every 60s)]

DURING EACH MATCH:
[Producer switches to "Match Live" scene via Dashboard]
{OBS receives "Set Scene" WebSocket command}
{Stream shows: Game Feed + Live Leaderboard Overlay}

{When result is published:}
{OVL-01 (Leaderboard) updates automatically}
{OVL-06 (Result Splash) triggers for 15 seconds}
[Producer switches to "Result Screen" scene]

[Producer adds stream annotations:]
Press "M" key → Quick annotation modal:
├── Match Start
├── Match End
├── Chicken Dinner
└── Custom label
{Annotation saved with stream timestamp}

AFTER TOURNAMENT:
[Producer ends stream in OBS]
[Links VODs to matches in Broadcast Dashboard:]
[Match 1 → YouTube URL → 00:00:00]
[Match 2 → YouTube URL → 01:05:30]
...
✅ Broadcast complete
```

---

---





