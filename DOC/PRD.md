# 📄 DOCUMENT 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)


---

## **Project:** GameVerse — Esports Tournament Operations & Live Broadcast Platform
## **Document Type:** Product Requirements Document (PRD)
## **Part:** 1 of 6 — Foundation Modules (1–4)
## **Version:** 1.0
## **Date:** June 2025
## **Status:** Draft for Review

---

---


- Document Overview & Conventions

---

---

## MASTER TABLE OF CONTENTS

### ⚙️ Shared Foundation / Core
- Module 1 — AUTHENTICATION & USER MANAGEMENT
- Module 14 — ANNOUNCEMENT & NOTIFICATION SYSTEM

### 1. 👨💼 Admin / Tournament Organizer Panel
- Module 2 — ORGANIZATION MANAGEMENT
- Module 3 — GAME CONFIGURATION MANAGEMENT
- Module 5 — TOURNAMENT MANAGEMENT
- Module 7 — MATCH SCHEDULING & SLOT MANAGEMENT
- Module 9 — MATCH DAY OPERATIONS
- Module 10 — LIVE SCORING & POINTS ENGINE
- Module 16 — PRIZE POOL & PAYMENT MANAGEMENT
- Module 17 — ANALYTICS & REPORTING
- Module 18 — TOURNAMENT BRANDING & CUSTOMIZATION
- Module 19 — SPONSOR MANAGEMENT
- Module 20 — AUDIT TRAIL & DISPUTE RESOLUTION
- Module 21 — ESPORTS COMMAND CENTER (UNIFIED DASHBOARD)

### 2. 🎮 Player & Team Portal
- Module 4 — TEAM & PLAYER MANAGEMENT
- Module 6 — REGISTRATION & VERIFICATION
- Module 8 — SECURE ROOM CREDENTIAL MANAGEMENT

### 3. 📺 Public Live Tournament Website
- Module 11 — LEADERBOARD ENGINE
- Module 15 — LIVE CHAT & MODERATION

### 4. 🎥 Production & Stream Control Panel
- Module 12 — LIVE STREAMING & BROADCAST INTEGRATION
- Module 13 — OBS OVERLAY SYSTEM

---

## DOCUMENT OVERVIEW & CONVENTIONS

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

### How to Read This PRD

This PRD is structured as a **module-by-module functional specification**. Each module contains:

| Section | Description |
|---------|-------------|
| **Module Overview** | Purpose, scope, and dependencies |
| **User Stories** | Structured as: *As a [role], I want to [action], so that [benefit]* |
| **Functional Requirements** | Numbered, atomic requirements labeled FR-[Module]-[Number] |
| **Business Rules** | Non-negotiable constraints labeled BR-[Module]-[Number] |
| **UI/UX Requirements** | Screen-level and interaction requirements |
| **Data Requirements** | Key data entities, fields, and validations |
| **Edge Cases & Error States** | Failure scenarios and expected system behavior |
| **Acceptance Criteria** | Testable conditions for feature completeness |
| **Dependencies** | Other modules or systems this module relies on |
| **Out of Scope** | Explicit exclusions for this module |

---

### Priority Labels

| Label | Meaning |
|-------|---------|
| 🔴 **P0 — Critical** | MVP blocker; system cannot function without this |
| 🟠 **P1 — High** | Required for a usable product; must be in first release |
| 🟡 **P2 — Medium** | Important but can follow MVP; second release |
| 🟢 **P3 — Low** | Nice to have; third release or later |

---

### User Roles (Platform-Wide Reference)

| Role ID | Role Name | Description |
|---------|-----------|-------------|
| ROLE-01 | **Super Admin** | GameVerse platform administrator |
| ROLE-02 | **Org Owner** | Owner/founder of an esports organization on the platform |
| ROLE-03 | **Org Admin** | Administrator appointed by Org Owner |
| ROLE-04 | **Tournament Director** | Manages tournament creation and overall event |
| ROLE-05 | **Referee / Operator** | Manages match-level operations and scoring |
| ROLE-06 | **Broadcast Producer** | Controls stream, overlays, and broadcast tools |
| ROLE-07 | **Team Captain** | Registers and manages team; represents team in communications |
| ROLE-08 | **Player** | Registered competitive player with a profile |
| ROLE-09 | **Viewer** | Unauthenticated or registered audience member |
| ROLE-10 | **Sponsor Representative** | Access to sponsor dashboard and campaign analytics |

---

### Naming Conventions

| Term | Definition |
|------|-----------|
| **Organization (Org)** | An entity on GameVerse that runs tournaments (e.g., "Hydra Esports Events") |
| **Tournament** | A complete competitive event with registration, matches, and results |
| **Slot** | A reserved position for one team in a specific match |
| **Room Credential** | The in-game Room ID + Password for a custom match lobby |
| **Match** | A single in-game session within a tournament |
| **Round** | A grouping of matches (e.g., Round 1, Qualifier Round, Grand Final) |
| **UID** | In-game unique identifier for a player (e.g., BGMI UID) |

---

---



---

# ECOSYSTEM SIDE: ⚙️ SHARED FOUNDATION / CORE

---

# MODULE 1 — AUTHENTICATION & USER MANAGEMENT

---

## 1.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-01 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Handles all aspects of user identity on the GameVerse platform — registration, authentication, role assignment, session management, profile management, and account security. |
| **Primary Users** | All roles (ROLE-01 through ROLE-10) |
| **Dependencies** | None (foundational module) |
| **Estimated Complexity** | High |

---

## 1.2 User Stories

### 1.2.1 Registration & Onboarding

| ID | User Story | Priority |
|----|-----------|---------|
| US-01-001 | As a **new user**, I want to register with my mobile number so that I can quickly join the platform without needing an email address. | 🔴 P0 |
| US-01-002 | As a **new user**, I want to register with my email address so that I have an alternative authentication method. | 🟠 P1 |
| US-01-003 | As a **new user**, I want to sign up using my Google account so that I can onboard without creating a new password. | 🟠 P1 |
| US-01-004 | As a **new user**, I want to complete a guided onboarding flow that asks me whether I am an organizer, player, or viewer so that the platform personalizes my experience from the start. | 🟠 P1 |
| US-01-005 | As a **new user**, I want to choose a unique username (GameVerse handle) so that I have a consistent identity across the platform. | 🔴 P0 |

### 1.2.2 Authentication

| ID | User Story | Priority |
|----|-----------|---------|
| US-01-006 | As a **registered user**, I want to log in with my mobile number + OTP so that I can access the platform quickly from my mobile device. | 🔴 P0 |
| US-01-007 | As a **registered user**, I want to log in with email + password so that I have a traditional authentication option. | 🟠 P1 |
| US-01-008 | As a **registered user**, I want to log in with Google OAuth so that I don't need to remember a password. | 🟠 P1 |
| US-01-009 | As a **registered user**, I want to enable two-factor authentication (2FA) on my account so that my account is protected from unauthorized access. | 🟡 P2 |
| US-01-010 | As a **registered user**, I want to receive an alert when my account is logged in from a new device so that I can detect unauthorized access. | 🟡 P2 |

### 1.2.3 Profile Management

| ID | User Story | Priority |
|----|-----------|---------|
| US-01-011 | As a **registered user**, I want to set up my public profile with a display name, avatar, bio, and social links so that other users can identify and connect with me. | 🟠 P1 |
| US-01-012 | As a **player**, I want to link my in-game UIDs (BGMI, Free Fire MAX, etc.) to my GameVerse profile so that organizers can verify my identity automatically. | 🔴 P0 |
| US-01-013 | As a **player**, I want to set my primary game and region so that I appear in relevant searches and tournament recommendations. | 🟠 P1 |
| US-01-014 | As a **registered user**, I want to change my password and update my contact information so that I can keep my account secure and up to date. | 🟠 P1 |
| US-01-015 | As a **registered user**, I want to control my notification preferences so that I only receive communications relevant to me. | 🟡 P2 |

### 1.2.4 Role Management

| ID | User Story | Priority |
|----|-----------|---------|
| US-01-016 | As a **Super Admin**, I want to assign or revoke roles for any user on the platform so that I can control platform access. | 🔴 P0 |
| US-01-017 | As an **Org Owner**, I want to invite users and assign them roles within my organization (Org Admin, Tournament Director, Referee, Broadcast Producer) so that I can build my operations team. | 🔴 P0 |
| US-01-018 | As an **Org Admin**, I want to see all users within my organization with their assigned roles so that I can audit and manage access. | 🟠 P1 |
| US-01-019 | As any **user**, I want to have exactly one active session per device and be able to see all active sessions so that I can log out remotely if needed. | 🟡 P2 |

---

## 1.3 Functional Requirements

### 1.3.1 Registration

| ID | Requirement | Priority |
|----|------------|---------|
| FR-01-001 | The system **shall** support three registration methods: (a) Mobile Number + OTP, (b) Email + Password, (c) Google OAuth 2.0. | 🔴 P0 |
| FR-01-002 | The system **shall** send an OTP via SMS to the user's mobile number during mobile registration. OTP must be 6 digits, valid for 5 minutes, and limited to 3 resend attempts per hour per number. | 🔴 P0 |
| FR-01-003 | The system **shall** send an email verification link during email registration. The link must expire after 24 hours. | 🟠 P1 |
| FR-01-004 | The system **shall** require every user to select a globally unique username (GameVerse handle) during registration. Username rules: 3–20 characters, alphanumeric + underscores only, case-insensitive uniqueness check. | 🔴 P0 |
| FR-01-005 | The system **shall** present an onboarding role-selection screen immediately after registration, offering three paths: (a) "I'm an Organizer," (b) "I'm a Player," (c) "I'm just watching." This selection sets the default dashboard view, not the actual role. | 🟠 P1 |
| FR-01-006 | The system **shall** prevent registration with disposable/temporary email domains using a maintained blocklist. | 🟡 P2 |
| FR-01-007 | The system **shall** enforce password strength requirements for email-based accounts: minimum 8 characters, at least one uppercase letter, one number, and one special character. | 🟠 P1 |
| FR-01-008 | The system **shall** detect and block registration attempts from the same mobile number or IP address exceeding 5 failed attempts in 30 minutes (rate limiting). | 🔴 P0 |

### 1.3.2 Authentication

| ID | Requirement | Priority |
|----|------------|---------|
| FR-01-009 | The system **shall** issue a JWT (JSON Web Token) upon successful authentication. Access tokens shall expire in 15 minutes. Refresh tokens shall expire in 30 days and be stored in HTTP-only cookies. | 🔴 P0 |
| FR-01-010 | The system **shall** support silent token refresh — automatically obtaining a new access token using the refresh token without requiring the user to log in again, as long as the refresh token is valid. | 🔴 P0 |
| FR-01-011 | The system **shall** invalidate all active sessions for a user when: (a) the user changes their password, (b) the user explicitly logs out of all devices, (c) a Super Admin forces a logout. | 🔴 P0 |
| FR-01-012 | The system **shall** support Google OAuth 2.0 as a social login provider. On first OAuth login, if no account exists, a new account shall be created. If the email matches an existing account, the OAuth provider shall be linked to the existing account after confirmation. | 🟠 P1 |
| FR-01-013 | The system **shall** implement TOTP-based 2FA (compatible with Google Authenticator and Authy) as an optional account security feature. | 🟡 P2 |
| FR-01-014 | The system **shall** track and store the following data per login event: timestamp, IP address, device type (user agent), login method (OTP/email/OAuth), success/failure status. | 🟠 P1 |
| FR-01-015 | The system **shall** lock an account for 30 minutes after 10 consecutive failed login attempts and notify the account owner via SMS/email. | 🟠 P1 |

### 1.3.3 User Profiles

| ID | Requirement | Priority |
|----|------------|---------|
| FR-01-016 | The system **shall** maintain a user profile containing: display name, username, avatar URL, bio (max 160 characters), country, registration date, and last active date. | 🔴 P0 |
| FR-01-017 | The system **shall** allow users to upload a profile avatar. Supported formats: JPG, PNG, WebP. Maximum file size: 2MB. The system shall auto-resize and crop to 400×400 pixels. | 🟠 P1 |
| FR-01-018 | The system **shall** allow players to link multiple in-game accounts to their profile. Each linked game account must store: game title ID, in-game UID, in-game username, verification status, and verification timestamp. | 🔴 P0 |
| FR-01-019 | The system **shall** support UID verification for linked game accounts through: (a) a manual verification process where the organizer confirms the UID, or (b) a challenge-response method where the player temporarily changes their in-game name to a system-generated code. | 🟠 P1 |
| FR-01-020 | The system **shall** display a player's linked and verified game accounts on their public profile, including the in-game username and game title. The actual UID shall be masked in public view (e.g., "BGMI: 549****8765"). | 🟠 P1 |
| FR-01-021 | The system **shall** allow users to set their profile visibility to: (a) Public — visible to all users, (b) Platform — visible to registered users only, (c) Private — visible to the user only. | 🟡 P2 |

### 1.3.4 Role-Based Access Control (RBAC)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-01-022 | The system **shall** implement a multi-layered RBAC system with two distinct scopes: (a) **Platform Scope** — Super Admin, (b) **Organization Scope** — Org Owner, Org Admin, Tournament Director, Referee, Broadcast Producer. | 🔴 P0 |
| FR-01-023 | The system **shall** allow a user to hold different roles in different organizations simultaneously (e.g., Org Owner in "Hydra Events" and Referee in "Storm Esports"). | 🔴 P0 |
| FR-01-024 | The system **shall** enforce the following role permission hierarchy within an organization: Org Owner > Org Admin > Tournament Director > Referee = Broadcast Producer. A user cannot modify the roles of users at their own level or above. | 🔴 P0 |
| FR-01-025 | The system **shall** allow Org Owners to invite users to their organization via: (a) email invitation link, (b) username search, (c) shareable join link with optional expiry and usage limit. | 🟠 P1 |
| FR-01-026 | The system **shall** allow Org Owners and Org Admins to define custom role names for display purposes while mapping to the underlying system role (e.g., "Head Referee" displays instead of "Referee" but has the same permissions). | 🟢 P3 |
| FR-01-027 | The system **shall** maintain a complete audit log of all role changes within an organization: who made the change, what was changed (from/to roles), for which user, and at what timestamp. | 🟠 P1 |

### 1.3.5 Session Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-01-028 | The system **shall** allow users to view all active sessions associated with their account, showing: device type, browser, approximate location (city/country from IP), and last active time. | 🟡 P2 |
| FR-01-029 | The system **shall** allow users to remotely terminate any individual active session or all sessions except the current one. | 🟡 P2 |
| FR-01-030 | The system **shall** automatically terminate sessions that have been inactive for more than 7 days (no API calls made using that session's access token). | 🟠 P1 |

---

## 1.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-01-001 | A single mobile number can be associated with only one GameVerse account. Attempting to register a second account with the same mobile number shall be blocked. |
| BR-01-002 | A user must be at least 13 years of age to register on the platform (compliance with COPPA/DPDP Act India). Date of birth shall be collected during registration and verified. |
| BR-01-003 | Platform-scope roles (Super Admin) cannot be assigned through the normal interface; they must be provisioned directly in the system by the engineering team. |
| BR-01-004 | An Org Owner role is automatically assigned to the user who creates an organization. The Org Owner cannot be removed from their own organization by any other role, including Org Admin. |
| BR-01-005 | A user's GameVerse username cannot be changed more than once every 30 days. |
| BR-01-006 | Deleting an account does not delete historical tournament data. The user's account shall be anonymized (all PII removed, replaced with "Deleted User #[ID]"), but match results and statistics remain. |
| BR-01-007 | A player's in-game UID, once verified and used in a completed tournament, is permanently associated with that tournament's records and cannot be retroactively changed. |

---

## 1.5 UI/UX Requirements

### 1.5.1 Registration & Login Screens

| ID | Requirement |
|----|------------|
| UX-01-001 | The login/registration page must offer method selection tabs (Mobile / Email / Google) prominently at the top, with Mobile selected by default. |
| UX-01-002 | The OTP input screen must display the target mobile number (masked: +91 98****1234), a countdown timer for OTP expiry, and a "Resend OTP" button that activates only after 60 seconds. |
| UX-01-003 | Username availability must be checked in real time (debounced at 500ms after the last keystroke) with visual indicators: green checkmark for available, red X for taken, spinner while checking. |
| UX-01-004 | The onboarding role-selection screen must use large, illustrated cards for each path (Organizer, Player, Viewer) with a brief description of what each role can do on the platform. |
| UX-01-005 | All authentication forms must be fully functional on mobile viewport (375px minimum width) with touch-optimized input fields. |

### 1.5.2 Profile Screen

| ID | Requirement |
|----|------------|
| UX-01-006 | The user profile page must have two views: (a) **Edit Mode** — for the user to manage their own profile, (b) **Public View** — what others see when visiting the profile. |
| UX-01-007 | The game accounts section on the profile must display a list of linked games with: game logo, in-game username, UID (masked), verification badge (green if verified, yellow if pending, red if rejected). |
| UX-01-008 | Profile completion percentage must be displayed as a visual progress bar to encourage users to complete all fields. Each filled section contributes to the percentage. |

### 1.5.3 Settings Screen

| ID | Requirement |
|----|------------|
| UX-01-009 | Account settings must be organized into clearly separated sections: Account Security, Profile Information, Linked Game Accounts, Notification Preferences, Privacy Settings, Danger Zone (Delete Account). |
| UX-01-010 | The "Danger Zone" section (account deletion, deactivation) must use red styling and require an additional confirmation step (type "DELETE" in a text field) before proceeding. |

---

## 1.6 Data Requirements

### 1.6.1 Users Table (Core Schema)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `user_id` | UUID | PK, NOT NULL | Unique system identifier |
| `username` | VARCHAR(20) | UNIQUE, NOT NULL | GameVerse handle |
| `display_name` | VARCHAR(50) | NOT NULL | Display name (not unique) |
| `email` | VARCHAR(255) | UNIQUE, NULLABLE | Email address |
| `mobile_number` | VARCHAR(15) | UNIQUE, NULLABLE | E.164 format |
| `password_hash` | VARCHAR(255) | NULLABLE | Bcrypt hash (null if OAuth-only) |
| `avatar_url` | TEXT | NULLABLE | CDN URL for avatar image |
| `bio` | VARCHAR(160) | NULLABLE | User bio |
| `country` | VARCHAR(2) | NULLABLE | ISO 3166-1 alpha-2 country code |
| `date_of_birth` | DATE | NULLABLE | For age verification |
| `onboarding_role` | ENUM | NOT NULL | 'organizer', 'player', 'viewer' |
| `is_email_verified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `is_mobile_verified` | BOOLEAN | DEFAULT FALSE | Mobile verification status |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account active status |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Soft delete flag |
| `two_fa_enabled` | BOOLEAN | DEFAULT FALSE | 2FA enabled flag |
| `two_fa_secret` | VARCHAR(32) | NULLABLE, ENCRYPTED | TOTP secret key |
| `created_at` | TIMESTAMP | NOT NULL | Account creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update time |
| `last_login_at` | TIMESTAMP | NULLABLE | Last successful login |

### 1.6.2 LinkedGameAccounts Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `linked_account_id` | UUID | PK | Unique identifier |
| `user_id` | UUID | FK → users | Associated GameVerse user |
| `game_id` | UUID | FK → games | Associated game |
| `in_game_uid` | VARCHAR(50) | NOT NULL | Player's UID in the game |
| `in_game_username` | VARCHAR(50) | NOT NULL | Player's name in the game |
| `verification_status` | ENUM | NOT NULL | 'pending', 'verified', 'rejected', 'expired' |
| `verification_method` | ENUM | NULLABLE | 'challenge_response', 'manual', 'api' |
| `verification_code` | VARCHAR(20) | NULLABLE | System-generated challenge code |
| `verified_at` | TIMESTAMP | NULLABLE | Verification completion time |
| `verified_by` | UUID | NULLABLE, FK → users | Who performed manual verification |
| `created_at` | TIMESTAMP | NOT NULL | Link creation time |

### 1.6.3 UserSessions Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `session_id` | UUID | PK | Unique session identifier |
| `user_id` | UUID | FK → users | Session owner |
| `refresh_token_hash` | VARCHAR(64) | NOT NULL | Hashed refresh token |
| `ip_address` | INET | NOT NULL | IP at login |
| `user_agent` | TEXT | NOT NULL | Browser/device info |
| `device_type` | ENUM | NOT NULL | 'mobile', 'desktop', 'tablet' |
| `geo_city` | VARCHAR(100) | NULLABLE | City from IP geolocation |
| `geo_country` | VARCHAR(2) | NULLABLE | Country from IP geolocation |
| `created_at` | TIMESTAMP | NOT NULL | Session creation time |
| `last_active_at` | TIMESTAMP | NOT NULL | Last API activity |
| `expires_at` | TIMESTAMP | NOT NULL | Refresh token expiry |
| `is_revoked` | BOOLEAN | DEFAULT FALSE | Manual revocation flag |

---

## 1.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| User enters incorrect OTP 3 times | Lock OTP for 5 minutes; display time remaining; still allow resend request which will invalidate old OTP and start new lockout timer |
| OAuth email matches an existing email-registered account | Show merge confirmation dialog; ask user to log in with original method to confirm identity before linking OAuth |
| User attempts to register with an already-registered mobile number | Display "An account with this mobile number already exists. Did you mean to log in?" with a "Go to Login" CTA — do NOT confirm or deny the account's existence in error message text (security) |
| Username chosen during registration is taken by the time form is submitted (race condition) | Display username conflict error after submit; keep all other form data; prompt to choose new username |
| User's JWT expires during an active session | Silently refresh using refresh token; if refresh token also expired, redirect to login page with a message: "Your session has expired. Please log in again." |
| User deletes account while they are a member of an active tournament | Anonymize account data but retain all tournament participation records; any prize money owed must be flagged for manual disbursement |
| Super Admin forces logout of a specific user | Revoke all refresh tokens for that user; next API call with their access token returns 401 with error code `TOKEN_REVOKED` |

---

## 1.8 Acceptance Criteria

| ID | Acceptance Criterion | Test Method |
|----|---------------------|-------------|
| AC-01-001 | A new user can register using mobile number + OTP, choose a username, and land on the role-selection screen within 2 minutes end-to-end. | Manual QA |
| AC-01-002 | OTP is received within 10 seconds on a standard Indian mobile network under normal load. | Performance test |
| AC-01-003 | Username uniqueness check responds within 500ms (95th percentile). | Load test |
| AC-01-004 | A user who logs in via Google OAuth and already has an email-matched account sees the merge flow, not a duplicate account creation. | Automated test |
| AC-01-005 | An Org Owner can invite a new user, assign them the "Referee" role, and the invited user sees the organization in their dashboard upon accepting. | Manual QA |
| AC-01-006 | After 10 failed login attempts, the account is locked for exactly 30 minutes and the user receives a notification. | Automated test |
| AC-01-007 | A player who links a BGMI UID sees the UID listed (masked) on their public profile with "Pending Verification" status. | Manual QA |
| AC-01-008 | When a user changes their password, all other active sessions (other devices) are terminated within 30 seconds. | Automated test |

---

## 1.9 Out of Scope for Module 1

- Biometric authentication (fingerprint/face ID) — considered for Phase 3
- Social login via Facebook, Discord, or Twitter — considered for Phase 2
- Automatic UID verification via BGMI/Free Fire game API (no public API exists; challenge-response is the primary method)
- Account merging after duplicate accounts are created (will be handled through support workflow)

---

---



# MODULE 14 — ANNOUNCEMENT & NOTIFICATION SYSTEM

---

## 14.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-14 |
| **Priority** | 🟠 P1 — High |
| **Description** | Manages all communications sent from the platform to users — including system-triggered notifications (match reminders, result alerts, check-in prompts), organizer-composed announcements to tournament participants, multi-channel delivery (in-app, push, SMS, email), notification preferences management, and scheduled announcement campaigns. This module replaces the 50+ individual WhatsApp messages that organizers currently send manually throughout a tournament. |
| **Primary Users** | ROLE-04 (Tournament Director), ROLE-03 (Org Admin), ROLE-07 (Team Captain), ROLE-08 (Player) |
| **Dependencies** | MOD-01, MOD-02, MOD-05, MOD-06, MOD-09 |
| **Estimated Complexity** | High |

---

## 14.2 Notification Architecture

```
Trigger Source
├── System Events (automatic)
│   ├── Registration confirmed
│   ├── Match starting in 30 min
│   ├── Room credentials released
│   ├── Results published
│   └── etc.
│
└── Organizer Actions (manual)
    ├── Send announcement to all teams
    ├── Send message to specific team
    └── Schedule future announcement

        ↓

Notification Service
├── Determines recipients
├── Applies user preferences
├── Selects delivery channels
└── Dispatches via:
    ├── In-App (WebSocket push)
    ├── Push Notification (FCM/APNs)
    ├── SMS (MSG91 / Twilio)
    └── Email (SendGrid / AWS SES)
```

---

## 14.3 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-14-001 | As a **Team Captain**, I want to receive automatic notifications for all critical tournament events (registration confirmed, schedule published, match starting, results available) so that I never miss important information. | 🔴 P0 |
| US-14-002 | As a **Tournament Director**, I want to send a custom announcement to all registered teams with a single action so that I can communicate important updates without using WhatsApp. | 🟠 P1 |
| US-14-003 | As a **Tournament Director**, I want to send targeted announcements to specific teams or groups (e.g., only teams in Match 3) so that I can communicate relevant information without spamming everyone. | 🟠 P1 |
| US-14-004 | As a **Tournament Director**, I want to schedule announcements for future delivery so that I can pre-write match day messages and have them send automatically. | 🟡 P2 |
| US-14-005 | As a **player**, I want to control which notification types I receive and through which channels so that I don't get overwhelmed with notifications. | 🟠 P1 |
| US-14-006 | As an **Org Admin**, I want to send announcements to all followers of our organization so that we can build our community and promote upcoming events. | 🟡 P2 |
| US-14-007 | As a **Team Captain**, I want to see all tournament-related notifications in a centralized notification center so that I can review any I might have missed. | 🟠 P1 |
| US-14-008 | As a **Tournament Director**, I want to use pre-built notification templates for common messages so that I don't have to write the same messages from scratch every tournament. | 🟠 P1 |

---

## 14.4 Functional Requirements

### 14.4.1 Notification Types & Triggers

| ID | Requirement | Priority |
|----|------------|---------|
| FR-14-001 | The system **shall** generate automatic notifications for the following system events: | 🔴 P0 |

**System Notification Catalog:**

| Notification ID | Trigger Event | Recipients | Channels | Priority |
|----------------|---------------|------------|----------|---------|
| `NOTIF-01` | Registration submitted | Team Captain | In-App, Email | 🔴 P0 |
| `NOTIF-02` | Registration approved | Team Captain | In-App, Email, SMS | 🔴 P0 |
| `NOTIF-03` | Registration rejected | Team Captain | In-App, Email, SMS | 🔴 P0 |
| `NOTIF-04` | Correction requested | Team Captain | In-App, Email, SMS | 🔴 P0 |
| `NOTIF-05` | Correction deadline warning (2hr) | Team Captain | In-App, SMS | 🟠 P1 |
| `NOTIF-06` | Waitlist slot offered | Team Captain | In-App, Email, SMS | 🟠 P1 |
| `NOTIF-07` | Waitlist slot offer expired | Team Captain | In-App, Email | 🟠 P1 |
| `NOTIF-08` | Schedule published | All team members | In-App, Email | 🔴 P0 |
| `NOTIF-09` | Check-in window open | All team members | In-App, Push, SMS | 🔴 P0 |
| `NOTIF-10` | Check-in reminder (30 min before deadline) | Not-yet-checked-in captains | In-App, SMS | 🟠 P1 |
| `NOTIF-11` | Check-in reminder (10 min before deadline) | Not-yet-checked-in captains | In-App, SMS | 🟠 P1 |
| `NOTIF-12` | Match starting in 60 min | Team members in match | In-App, Push | 🟠 P1 |
| `NOTIF-13` | Match starting in 15 min | Team members in match | In-App, Push, SMS | 🔴 P0 |
| `NOTIF-14` | Room credentials released | Team members in match | In-App, Push, SMS | 🔴 P0 |
| `NOTIF-15` | Match result published | Team members in match | In-App, Push | 🔴 P0 |
| `NOTIF-16` | Score correction (own team) | Team members in match | In-App, Email | 🟠 P1 |
| `NOTIF-17` | Technical pause declared | Team members in paused match | In-App, SMS | 🟠 P1 |
| `NOTIF-18` | Match resumed after pause | Team members in paused match | In-App, Push, SMS | 🟠 P1 |
| `NOTIF-19` | Disqualification notice | Team Captain | In-App, Email, SMS | 🟠 P1 |
| `NOTIF-20` | Tournament cancelled | All registered teams | In-App, Email, SMS | 🔴 P0 |
| `NOTIF-21` | Tournament postponed | All registered teams | In-App, Email | 🟠 P1 |
| `NOTIF-22` | Prize payout initiated | Team Captain (winners) | In-App, Email, SMS | 🟠 P1 |
| `NOTIF-23` | Prize payout completed | Team Captain (winners) | In-App, Email | 🟠 P1 |
| `NOTIF-24` | Dispute resolution update | Disputing team captain | In-App, Email | 🟠 P1 |
| `NOTIF-25` | New tournament from followed org | Followers | In-App, Push | 🟡 P2 |
| `NOTIF-26` | Team invitation received | Invited user | In-App, Email | 🟠 P1 |
| `NOTIF-27` | Org invitation received | Invited user | In-App, Email | 🟠 P1 |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-14-002 | Each system notification **shall** be composed using a template engine that supports dynamic variable substitution. Variables are enclosed in double curly braces: `{{team_name}}`, `{{match_time}}`, `{{tournament_name}}`, `{{slot_number}}`, etc. | 🟠 P1 |
| FR-14-003 | The system **shall** support notification templates in the following languages: English (default), Hindi, Tamil, Telugu, Kannada, Bengali. Language selection is based on the user's preferred language setting. | 🟡 P2 |

### 14.4.2 Organizer Announcements

| ID | Requirement | Priority |
|----|------------|---------|
| FR-14-004 | The system **shall** provide Tournament Directors with an **Announcement Composer** — a rich-text editor with the following capabilities: title field (max 100 chars), message body (max 1000 chars, rich text), recipient scope selector, channel selector, and schedule option. | 🟠 P1 |
| FR-14-005 | The **Recipient Scope Selector** **shall** support the following targeting options: (a) All registered teams, (b) All checked-in teams, (c) Specific match — all teams in Match X, (d) Specific round — all teams in Round Y, (e) Specific teams — manually selected from a multi-select list, (f) Teams by status — approved only, waitlisted only, etc. | 🟠 P1 |
| FR-14-006 | The **Channel Selector** **shall** allow organizers to choose which channels to use for each announcement: In-App only, In-App + Push, In-App + Push + SMS, All channels (including email). SMS and email are charged per message on higher plans. | 🟠 P1 |
| FR-14-007 | The system **shall** display a **reach preview** before sending — showing the exact number of recipients and an estimated cost breakdown (for SMS/email). The organizer must confirm before sending. | 🟠 P1 |
| FR-14-008 | The system **shall** allow organizers to save announcements as **drafts** and revisit them before sending. | 🟡 P2 |
| FR-14-009 | The system **shall** support **scheduled announcements** — the organizer composes a message and sets a future send date/time. The system sends it automatically at the scheduled time. Scheduled announcements can be cancelled before they send. | 🟡 P2 |
| FR-14-010 | The system **shall** provide organizers with **announcement templates** for common match-day messages: (a) "Match [X] starting soon," (b) "Check-in is now open," (c) "Technical issue — please stand by," (d) "Match results published," (e) "Tournament is complete." Templates pre-fill the composer with placeholder text. | 🟠 P1 |
| FR-14-011 | The system **shall** maintain an **Announcement History** per tournament — a chronological log of all announcements sent, showing: message content, recipient count, send time, channel, and delivery status summary. | 🟠 P1 |

### 14.4.3 Notification Delivery

| ID | Requirement | Priority |
|----|------------|---------|
| FR-14-012 | **In-App Notifications** shall be delivered via WebSocket push to all active browser/app sessions of the recipient. If the user has no active session, the notification is queued and delivered upon next login. | 🔴 P0 |
| FR-14-013 | **Push Notifications** shall be delivered via Firebase Cloud Messaging (FCM) for Android devices and Apple Push Notification Service (APNs) for iOS devices. Push tokens are registered when users enable push notifications in the mobile app. | 🟠 P1 |
| FR-14-014 | **SMS Notifications** shall be delivered via MSG91 (primary, India) with Twilio as fallback. SMS content must be concise (max 160 chars for single SMS). Messages exceeding 160 chars are split into multi-part SMS. | 🟠 P1 |
| FR-14-015 | **Email Notifications** shall be delivered via SendGrid (primary). All emails must use branded HTML templates with the GameVerse and org logos, proper unsubscribe links, and mobile-responsive design. | 🟠 P1 |
| FR-14-016 | The system **shall** implement a **notification delivery queue** (using Redis Queue or similar) to handle high-volume sends. For tournament-wide announcements (e.g., 256 teams × 4 players = 1024 recipients), notifications shall be dispatched within 60 seconds of the send action. | 🟠 P1 |
| FR-14-017 | The system **shall** track delivery status for each notification: sent, delivered (for SMS/email with delivery receipts), read (for in-app), failed. Delivery failures trigger one automatic retry after 5 minutes. | 🟠 P1 |

### 14.4.4 Notification Center (User Side)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-14-018 | The system **shall** provide every user with a **Notification Center** — accessible from the main navigation — displaying all notifications received, sorted by time (newest first). Each notification shows: icon, title, message preview, source (tournament/org name), timestamp, and read/unread status. | 🟠 P1 |
| FR-14-019 | The Notification Center **shall** support filtering notifications by: All, Unread, Tournament-related, Team-related, and System. | 🟡 P2 |
| FR-14-020 | The Notification Center **shall** display a paginated list with infinite scroll, loading 20 notifications at a time. | 🟠 P1 |
| FR-14-021 | The system **shall** display an **unread notification count badge** on the notification bell icon in the navigation bar. The badge updates in real time via WebSocket when new notifications arrive. | 🔴 P0 |
| FR-14-022 | Users **shall** be able to mark individual notifications as read, mark all as read, and delete individual notifications from the Notification Center. | 🟠 P1 |

### 14.4.5 Notification Preferences

| ID | Requirement | Priority |
|----|------------|---------|
| FR-14-023 | The system **shall** provide users with a **Notification Preferences Panel** in their account settings allowing them to toggle each notification type on/off per channel (In-App, Push, SMS, Email). | 🟠 P1 |
| FR-14-024 | Critical notifications (NOTIF-02: Registration approved, NOTIF-14: Room credentials released, NOTIF-20: Tournament cancelled) **shall** always be delivered via in-app and cannot be fully disabled by users. Other channels for these notifications can be toggled. | 🔴 P0 |
| FR-14-025 | The system **shall** support a **Do Not Disturb** mode — a time window (e.g., midnight to 8 AM) during which SMS and push notifications are suppressed and queued for delivery after the window ends. | 🟡 P2 |

---

## 14.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-14-001 | SMS notifications incur per-message costs. The platform tracks SMS usage per organization and deducts from their SMS credit balance. Organizations must top up credits to continue using SMS. Free plan organizations have a monthly SMS allowance of 100 messages. |
| BR-14-002 | Organizers cannot send announcements containing external URLs that haven't been pre-approved (basic URL allowlist to prevent phishing via the platform). |
| BR-14-003 | Notification frequency limits apply: no more than 10 notifications per user per tournament per hour (except for critical notifications which bypass this limit). |
| BR-14-004 | All notification content is logged and retained for 90 days for compliance and dispute purposes. |
| BR-14-005 | Users can unsubscribe from email notifications globally via the unsubscribe link in every email. Platform respects email unsubscribes within 10 minutes of the unsubscribe action. |

---

## 14.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-14-001 | The Notification Center must open as a right-side slide-over panel (not a new page) so users can see notifications without losing their current context. |
| UX-14-002 | Unread notifications must be visually distinct from read ones — slightly darker background, bold title, and an unread dot indicator. |
| UX-14-003 | The Announcement Composer must show a real-time character counter for the SMS channel (since SMS has strict character limits). When the message exceeds 160 chars, a warning appears: "This message will be sent as 2 SMS messages per recipient." |
| UX-14-004 | The reach preview before sending must display a confirmation modal with: recipient count, estimated delivery breakdown per channel, estimated cost (if applicable), and a final "Send Now" button. |
| UX-14-005 | Notification preferences must use toggle switches (not checkboxes) organized in a clear matrix: rows = notification types, columns = channels. |
| UX-14-006 | Critical notifications must display with a red accent border in the Notification Center to distinguish them from routine updates. |

---

## 14.7 Data Requirements

### 14.7.1 Notifications Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `notification_id` | UUID | PK | Unique notification ID |
| `user_id` | UUID | FK → users | Recipient |
| `notification_type` | VARCHAR(20) | NOT NULL | NOTIF-01 through NOTIF-27 |
| `title` | VARCHAR(100) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Full message body |
| `data` | JSONB | NULLABLE | Structured data (IDs, URLs, etc.) |
| `tournament_id` | UUID | FK → tournaments, NULLABLE | Related tournament |
| `org_id` | UUID | FK → organizations, NULLABLE | Related organization |
| `is_critical` | BOOLEAN | DEFAULT FALSE | Cannot be disabled flag |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `read_at` | TIMESTAMP | NULLABLE | When marked read |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Soft delete |
| `source_type` | ENUM | NOT NULL | 'system','organizer' |
| `created_at` | TIMESTAMP | NOT NULL | Creation time |

### 14.7.2 NotificationDeliveries Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `delivery_id` | UUID | PK | Delivery record ID |
| `notification_id` | UUID | FK → notifications | Notification |
| `channel` | ENUM | NOT NULL | 'in_app','push','sms','email' |
| `status` | ENUM | NOT NULL | 'pending','sent','delivered','failed','bounced' |
| `external_id` | VARCHAR(100) | NULLABLE | Provider message ID |
| `attempt_count` | SMALLINT | DEFAULT 0 | Retry count |
| `sent_at` | TIMESTAMP | NULLABLE | Send timestamp |
| `delivered_at` | TIMESTAMP | NULLABLE | Delivery confirmation |
| `failed_at` | TIMESTAMP | NULLABLE | Failure timestamp |
| `failure_reason` | TEXT | NULLABLE | Error detail |

### 14.7.3 OrgAnnouncements Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `announcement_id` | UUID | PK | Announcement ID |
| `tournament_id` | UUID | FK → tournaments, NULLABLE | Scoped to tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `created_by` | UUID | FK → users | Creator |
| `title` | VARCHAR(100) | NOT NULL | Announcement title |
| `message` | TEXT | NOT NULL | Announcement body |
| `recipient_scope` | JSONB | NOT NULL | Scope config (all/match/round/specific) |
| `channels` | JSONB | NOT NULL | Enabled channels |
| `status` | ENUM | DEFAULT 'draft' | 'draft','scheduled','sent','cancelled' |
| `recipient_count` | INTEGER | NULLABLE | Actual recipients reached |
| `scheduled_for` | TIMESTAMP | NULLABLE | Future send time |
| `sent_at` | TIMESTAMP | NULLABLE | Actual send time |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

### 14.7.4 NotificationPreferences Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `preference_id` | UUID | PK | Preference record |
| `user_id` | UUID | FK → users, UNIQUE | User |
| `preferences` | JSONB | NOT NULL | Full preference matrix |
| `dnd_enabled` | BOOLEAN | DEFAULT FALSE | Do Not Disturb flag |
| `dnd_start_time` | TIME | NULLABLE | DND window start |
| `dnd_end_time` | TIME | NULLABLE | DND window end |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

---

## 14.8 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| SMS provider (MSG91) is down when room credentials are released | System immediately switches to Twilio fallback; if both fail, logs failure and alerts Tournament Director: "SMS delivery failed for Match [X]. Teams have been notified via in-app only." |
| User has disabled all notifications but receives a critical notification | Critical notifications (NOTIF-14: Room credentials) are delivered via in-app regardless of preferences. In-app delivery cannot be disabled. |
| Organizer sends announcement to 300 recipients simultaneously | Notification queue processes all 300 deliveries within 60 seconds using parallel dispatch workers. No recipient receives the notification twice. |
| User changes their mobile number mid-tournament | SMS notifications continue going to the old number until the new number is verified. System warns: "Update your mobile number before the next match to receive SMS notifications." |
| Scheduled announcement is due during a server maintenance window | Queued announcement is sent immediately after maintenance ends; a "delivery delay" note is added to the announcement history showing planned vs. actual send time |

---

## 14.9 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-14-001 | Room credential release notification (NOTIF-14) reaches all assigned team captains' in-app notification centers within 5 seconds of release. | E2E automated test |
| AC-14-002 | An organizer announcement to 100 teams (400 recipients) completes delivery via in-app within 60 seconds. | Performance test |
| AC-14-003 | A user who disables SMS for "Match Starting" notifications does not receive SMS for NOTIF-13, but continues to receive in-app. | Automated test |
| AC-14-004 | The unread notification badge count on the nav bar updates within 3 seconds of a new notification being created for the user. | Manual QA |
| AC-14-005 | Scheduled announcements are dispatched within ±2 minutes of the configured send time. | Automated test |
| AC-14-006 | SMS messages over 160 characters are correctly split and delivered as multi-part messages by MSG91. | Automated test |

---

---





---

# ECOSYSTEM SIDE: 1. 👨💼 ADMIN / TOURNAMENT ORGANIZER PANEL

---

# MODULE 2 — ORGANIZATION MANAGEMENT

---

## 2.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-02 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Manages the lifecycle of organizations on GameVerse — creation, configuration, branding, member management, subscription plans, and multi-org support. An organization is the operational entity that owns and runs tournaments. |
| **Primary Users** | ROLE-01 (Super Admin), ROLE-02 (Org Owner), ROLE-03 (Org Admin) |
| **Dependencies** | MOD-01 (Authentication & User Management) |
| **Estimated Complexity** | Medium-High |

---

## 2.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-02-001 | As a **registered user**, I want to create a new organization with a name, slug, and logo so that I can start running tournaments under my brand. | 🔴 P0 |
| US-02-002 | As an **Org Owner**, I want to configure my organization's profile including banner, social links, and description so that players and sponsors can find and trust my brand. | 🟠 P1 |
| US-02-003 | As an **Org Owner**, I want to invite team members and assign them specific roles so that I can delegate tournament operations. | 🔴 P0 |
| US-02-004 | As an **Org Owner**, I want to view and manage all members of my organization in one place so that I maintain full visibility of my team. | 🟠 P1 |
| US-02-005 | As an **Org Admin**, I want to manage the organization settings on behalf of the owner so that daily operations don't require owner involvement. | 🟠 P1 |
| US-02-006 | As an **Org Owner**, I want to select and manage a subscription plan so that I unlock the platform features my organization needs. | 🟠 P1 |
| US-02-007 | As a **Super Admin**, I want to view all organizations, their subscription status, and key metrics so that I can monitor platform health. | 🟠 P1 |
| US-02-008 | As an **Org Owner**, I want to create sub-organizations or chapters under my main organization so that I can manage regional or game-specific divisions separately. | 🟢 P3 |
| US-02-009 | As a **registered user**, I want to browse public organizations and follow them so that I receive updates about their upcoming tournaments. | 🟡 P2 |
| US-02-010 | As an **Org Owner**, I want to view an organization-level dashboard showing tournaments run, total prize pools distributed, and player engagement so that I can measure my org's impact. | 🟡 P2 |

---

## 2.3 Functional Requirements

### 2.3.1 Organization Creation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-02-001 | The system **shall** allow any verified registered user to create an organization. The user who creates the organization is automatically assigned the Org Owner role. | 🔴 P0 |
| FR-02-002 | Organization creation **shall** require the following mandatory fields: (a) Organization Name (max 50 characters), (b) Organization Slug (URL-friendly, unique across platform, auto-generated from name with manual override), (c) Primary Game (selected from game catalog). | 🔴 P0 |
| FR-02-003 | The system **shall** validate that the organization slug is unique, URL-safe (lowercase letters, numbers, hyphens only), and between 3–30 characters. The slug forms the organization's public URL: `gameverse.gg/[slug]`. | 🔴 P0 |
| FR-02-004 | Organization creation **shall** support optional fields: organization logo upload, banner image, description (max 500 characters), country, city, website URL, Instagram handle, YouTube channel URL, and Discord server invite link. | 🟠 P1 |
| FR-02-005 | The system **shall** allow each user to own a maximum of 3 organizations under the Free plan, and unlimited organizations under paid plans. | 🟠 P1 |
| FR-02-006 | Upon organization creation, the system **shall** automatically create a default notification template set and default point scoring scheme for the organization's primary game. | 🟠 P1 |

### 2.3.2 Organization Profile & Settings

| ID | Requirement | Priority |
|----|------------|---------|
| FR-02-007 | The system **shall** provide an organization settings panel where Org Owners and Org Admins can update: display name, logo, banner, description, contact email, social links, and public visibility. | 🟠 P1 |
| FR-02-008 | The system **shall** allow organizations to set their visibility to: (a) **Public** — listed in platform directory, (b) **Unlisted** — accessible via direct link but not in directory, (c) **Private** — accessible only to organization members. | 🟡 P2 |
| FR-02-009 | The system **shall** allow organizations to configure their preferred language for all tournament communications (English, Hindi, Tamil, Telugu, Kannada, Bengali — initial supported languages). | 🟡 P2 |
| FR-02-010 | The system **shall** allow Org Owners to configure an organization-level "house rules" document (rich text, max 5000 characters) that is linked to all tournaments created under that organization as the default rulebook. | 🟠 P1 |
| FR-02-011 | The system **shall** support organization-level branding configuration: primary color, secondary color, and font selection for use in generated graphics, overlays, and tournament pages. | 🟡 P2 |

### 2.3.3 Member Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-02-012 | The system **shall** allow Org Owners and Org Admins to invite users to the organization through: (a) email invitation, (b) username search, (c) shareable invite link. | 🔴 P0 |
| FR-02-013 | Shareable invite links **shall** support configuration of: (a) expiry date (none, 1 day, 7 days, 30 days), (b) maximum uses (unlimited, 10, 50, 100), (c) role assigned upon acceptance. | 🟠 P1 |
| FR-02-014 | The system **shall** display a member list for each organization, showing for each member: avatar, display name, username, assigned role, status (active/pending invitation), and date joined. | 🟠 P1 |
| FR-02-015 | The system **shall** allow Org Owners and Org Admins to change a member's role, with the restriction that a user cannot change the role of someone at their same level or higher in the hierarchy. | 🔴 P0 |
| FR-02-016 | The system **shall** allow Org Owners and Org Admins to remove a member from the organization. Removed members lose all organization-scope roles immediately. Their past work (match records, scored data) remains. | 🟠 P1 |
| FR-02-017 | The system **shall** allow organization members to leave an organization at any time, except the Org Owner (who must transfer ownership before leaving). | 🟠 P1 |
| FR-02-018 | The system **shall** allow an Org Owner to transfer ownership of the organization to another member. The transfer must be confirmed by the new owner. Upon transfer, the original owner's role becomes Org Admin. | 🟠 P1 |
| FR-02-019 | The system **shall** maintain a log of all membership events: invitations sent, invitations accepted/declined, role changes, member removals, and ownership transfers. | 🟠 P1 |

### 2.3.4 Subscription & Plan Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-02-020 | The system **shall** support the following subscription tiers for organizations, enforced at the organization level: | 🟠 P1 |

**Subscription Tiers Detail:**

| Tier | Name | Price | Tournament Limit | Team Limit/Tournament | Active Members | Key Features |
|------|------|-------|-----------------|----------------------|----------------|--------------|
| T0 | **Free** | ₹0/month | 4/month | 32 teams | 3 members | Basic registration, manual scoring |
| T1 | **Starter** | ₹999/month | 12/month | 64 teams | 8 members | + Room management, live leaderboard |
| T2 | **Pro** | ₹2,999/month | Unlimited | 128 teams | 20 members | + Broadcast overlays, analytics |
| T3 | **Elite** | ₹7,999/month | Unlimited | 256 teams | Unlimited | + White-label, sponsor tools, priority support |
| T4 | **Enterprise** | Custom | Unlimited | 500+ teams | Unlimited | + Custom integrations, dedicated support, SLA |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-02-021 | The system **shall** enforce plan limits in real time. When a limit is reached (e.g., tournament count), the system shall block creation of additional items and display an upgrade prompt with a comparison of current vs. next plan. | 🟠 P1 |
| FR-02-022 | The system **shall** allow organizations to upgrade or downgrade their plan at any time. Upgrades take effect immediately; downgrades take effect at the end of the billing cycle. | 🟠 P1 |
| FR-02-023 | The system **shall** send email notifications to the Org Owner at: 80% of any plan limit reached, 100% of limit reached, 7 days before subscription renewal, and upon successful payment or payment failure. | 🟠 P1 |

### 2.3.5 Organization Discovery

| ID | Requirement | Priority |
|----|------------|---------|
| FR-02-024 | The system **shall** provide a public organization directory that allows filtering by: primary game, country, city, and sort by tournaments hosted, followers, or date created. | 🟡 P2 |
| FR-02-025 | The system **shall** allow registered users to "follow" public organizations. Followers receive notifications about new tournaments created by the organization. | 🟡 P2 |
| FR-02-026 | Each organization **shall** have a public profile page at `gameverse.gg/org/[slug]` displaying: organization info, team roster (names only), upcoming tournaments, past tournament results, and follower count. | 🟡 P2 |

---

## 2.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-02-001 | An organization name must be unique per Org Owner but not necessarily platform-wide (two different owners can have orgs with similar names, but slugs must be globally unique). |
| BR-02-002 | An organization cannot be permanently deleted if it has active (ongoing) tournaments. Active tournaments must be concluded or cancelled first. |
| BR-02-003 | When an organization's subscription is downgraded or cancelled, existing tournaments that were created under the higher plan are allowed to complete. The lower plan limits apply only to new tournaments. |
| BR-02-004 | An organization must have at least one active Org Owner at all times. If the sole Org Owner requests account deletion, they must transfer ownership first. |
| BR-02-005 | The platform (Super Admin) reserves the right to suspend any organization for policy violations. Suspended organizations cannot run new tournaments, and their existing tournament pages display a suspension notice. |

---

## 2.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-02-001 | The "Create Organization" flow must be a multi-step wizard: Step 1 — Basic Info (name, slug, game), Step 2 — Profile (logo, banner, description), Step 3 — Invite Team (optional). A skip option must be available on Steps 2 and 3. |
| UX-02-002 | The organization dashboard (visible to org members) must display a summary row at the top: total tournaments, total teams participated, total prize distributed, and active member count as metric cards. |
| UX-02-003 | The member management table must support sorting by name, role, and join date, and filtering by role. |
| UX-02-004 | Plan limits must be shown as progress bars on the organization dashboard (e.g., "3 of 4 tournaments used this month") with a prominent "Upgrade" CTA when at 80%+. |
| UX-02-005 | The organization's public profile page must be mobile-responsive and load within 2 seconds (LCP under 2.5 seconds). |

---

## 2.6 Data Requirements

### 2.6.1 Organizations Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `org_id` | UUID | PK, NOT NULL | Unique organization ID |
| `name` | VARCHAR(50) | NOT NULL | Display name |
| `slug` | VARCHAR(30) | UNIQUE, NOT NULL | URL-friendly identifier |
| `description` | TEXT | NULLABLE | Max 500 chars |
| `logo_url` | TEXT | NULLABLE | Logo CDN URL |
| `banner_url` | TEXT | NULLABLE | Banner CDN URL |
| `primary_game_id` | UUID | FK → games | Primary game |
| `country` | VARCHAR(2) | NULLABLE | ISO country code |
| `city` | VARCHAR(100) | NULLABLE | City name |
| `contact_email` | VARCHAR(255) | NULLABLE | Public contact email |
| `website_url` | TEXT | NULLABLE | Website link |
| `instagram_handle` | VARCHAR(50) | NULLABLE | Instagram username |
| `youtube_url` | TEXT | NULLABLE | YouTube channel URL |
| `discord_url` | TEXT | NULLABLE | Discord invite URL |
| `primary_color` | CHAR(7) | DEFAULT '#6B48FF' | Hex color for branding |
| `secondary_color` | CHAR(7) | DEFAULT '#FF4B6E' | Hex color for branding |
| `visibility` | ENUM | DEFAULT 'public' | 'public','unlisted','private' |
| `subscription_tier` | ENUM | DEFAULT 'free' | 'free','starter','pro','elite','enterprise' |
| `subscription_expires_at` | TIMESTAMP | NULLABLE | Subscription expiry |
| `follower_count` | INTEGER | DEFAULT 0 | Cached follower count |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Platform-verified org badge |
| `is_suspended` | BOOLEAN | DEFAULT FALSE | Suspension status |
| `suspension_reason` | TEXT | NULLABLE | Reason if suspended |
| `owner_id` | UUID | FK → users | Org Owner |
| `house_rules` | TEXT | NULLABLE | Default rulebook |
| `preferred_language` | VARCHAR(5) | DEFAULT 'en' | ISO language code |
| `created_at` | TIMESTAMP | NOT NULL | Creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update time |

### 2.6.2 OrgMembers Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `member_id` | UUID | PK | Membership record ID |
| `org_id` | UUID | FK → organizations | Organization |
| `user_id` | UUID | FK → users | Member user |
| `role` | ENUM | NOT NULL | 'org_owner','org_admin','tournament_director','referee','broadcast_producer' |
| `display_role_name` | VARCHAR(50) | NULLABLE | Custom display name for role |
| `status` | ENUM | DEFAULT 'active' | 'active','invited','suspended' |
| `invited_by` | UUID | FK → users, NULLABLE | Who sent invitation |
| `invited_at` | TIMESTAMP | NULLABLE | Invitation timestamp |
| `joined_at` | TIMESTAMP | NULLABLE | Acceptance timestamp |
| `invite_token` | VARCHAR(64) | NULLABLE, UNIQUE | Token for invite link |
| `invite_expires_at` | TIMESTAMP | NULLABLE | Invite link expiry |

---

## 2.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| User tries to create an org with a slug that matches a deleted org's slug | Deleted org slugs are reserved for 90 days to prevent impersonation; after 90 days they become available |
| Org Owner's subscription payment fails | Grace period of 7 days; organization continues on current plan; daily email reminders sent; after 7 days, downgraded to Free plan |
| User is simultaneously Org Owner of one org and a Referee in another, and their account is suspended | All org-related permissions are suspended; their tournaments and match records are unaffected but flagged for review |
| Invite link is used by a user who is already a member of the organization | Display "You are already a member of this organization" message; do not create a duplicate membership |
| Org Owner transfers ownership, new owner rejects the transfer | Ownership transfer is cancelled; original owner remains as Org Owner |

---

## 2.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-02-001 | A user can create an organization in under 3 minutes using the creation wizard. | Manual QA |
| AC-02-002 | Slug uniqueness is validated in real time with a response under 300ms. | Load test |
| AC-02-003 | An Org Owner can invite a member, the member receives an email within 60 seconds, and upon accepting, appears in the member list with the correct role. | E2E automated test |
| AC-02-004 | When a Free plan org reaches their 4th tournament attempt in a month, they see an upgrade prompt and cannot create the tournament. | Automated test |
| AC-02-005 | Removing a member immediately revokes all their organization-scope permissions in all active sessions. | Automated test |

---

---



# MODULE 3 — GAME CONFIGURATION MANAGEMENT

---

## 3.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-03 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Manages the catalog of supported game titles and their associated configuration — point scoring systems, format templates, player validation rules, and game-specific settings. This module provides the foundation for all tournament, scoring, and match operations. |
| **Primary Users** | ROLE-01 (Super Admin), ROLE-02 (Org Owner), ROLE-03 (Org Admin), ROLE-04 (Tournament Director) |
| **Dependencies** | MOD-01 (Authentication), MOD-02 (Organization Management) |
| **Estimated Complexity** | Medium |

---

## 3.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-03-001 | As a **Super Admin**, I want to add new games to the platform catalog so that organizers can create tournaments for those titles. | 🔴 P0 |
| US-03-002 | As a **Super Admin**, I want to define the point scoring formulas for each game so that tournaments can use standardized or customizable scoring systems. | 🔴 P0 |
| US-03-003 | As a **Tournament Director**, I want to select from pre-built scoring system templates when setting up a tournament so that I don't have to manually configure points for every placement and kill. | 🔴 P0 |
| US-03-004 | As a **Tournament Director**, I want to customize the scoring system for a specific tournament so that I can offer unique formats to attract players. | 🟠 P1 |
| US-03-005 | As an **Org Owner**, I want to save my organization's preferred scoring system as a reusable template so that I don't reconfigure it for every tournament. | 🟠 P1 |
| US-03-006 | As a **Super Admin**, I want to configure UID validation rules for each game so that the system can help organizers detect fake or improperly formatted UIDs. | 🟠 P1 |
| US-03-007 | As a **Tournament Director**, I want to see a preview of how a scoring system will calculate points for a hypothetical set of results before applying it to my tournament so that I can verify it works as expected. | 🟡 P2 |

---

## 3.3 Functional Requirements

### 3.3.1 Game Catalog Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-03-001 | The system **shall** maintain a platform-level catalog of supported games. Only Super Admins can add, edit, or deactivate games from the catalog. | 🔴 P0 |
| FR-03-002 | Each game in the catalog **shall** have the following attributes: game name, short code (e.g., "BGMI", "FF", "CODM"), logo, banner, platform (mobile/PC/console/multi), genre, publisher, UID format (regex pattern for validation), UID display name (e.g., "Character ID" for Free Fire, "Player ID" for BGMI), and active status. | 🔴 P0 |
| FR-03-003 | The system **shall** support the following game formats that determine how matches are structured: (a) **Battle Royale** — multiple teams in one match, survival + kill-based scoring, (b) **Team Deathmatch** — two teams, round-based scoring, (c) **Free-for-All** — individual players, placement-based scoring. The initial release shall focus on Battle Royale. | 🔴 P0 |
| FR-03-004 | The system **shall** pre-load the following games in the initial catalog: BGMI (Battle Royale, Mobile), Free Fire MAX (Battle Royale, Mobile), PUBG Mobile (Battle Royale, Mobile), COD Mobile (Battle Royale + TDM, Mobile), Valorant (Team-based, PC), and CS2 (Team-based, PC). Battle royale mobile games shall have full feature support; others shall have partial support. | 🔴 P0 |

### 3.3.2 Point Scoring System

| ID | Requirement | Priority |
|----|------------|---------|
| FR-03-005 | The system **shall** support a configurable **placement-kill scoring model** for battle royale games, where the total points for a team in a match equals: `Points = Placement_Points[rank] + (Kills × Kill_Points)`. | 🔴 P0 |
| FR-03-006 | Placement points configuration **shall** allow custom point values for each finishing position (1st through Nth where N is the number of teams in the match). The system shall provide pre-set templates and allow full customization. | 🔴 P0 |
| FR-03-007 | The system **shall** include the following pre-built scoring templates for battle royale games: | 🔴 P0 |

**Pre-built Scoring Templates:**

| Template Name | Used By | 1st | 2nd | 3rd | 4th | 5th–10th | 11th–16th | Kill Points |
|--------------|---------|-----|-----|-----|-----|----------|----------|-------------|
| **BGIS Standard** | Official BGMI tournaments | 15 | 12 | 10 | 8 | 6,5,4,4,3,3 | 2,2,2,2,1,1 | 1 per kill |
| **BMPS Classic** | Professional leagues | 12 | 9 | 8 | 7 | 6,5,4,3,2,2 | 1,1,1,1,0,0 | 1 per kill |
| **Community Cup** | Indie organizers | 10 | 8 | 6 | 5 | 4,3,3,2,2,1 | 1,1,0,0,0,0 | 1 per kill |
| **Kill-Heavy** | Content creator events | 5 | 4 | 3 | 3 | 2,2,2,1,1,1 | 0,0,0,0,0,0 | 2 per kill |
| **Placement-Only** | Survival-focused events | 15 | 12 | 10 | 8 | 6,5,4,3,2,1 | 1,0,0,0,0,0 | 0 |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-03-008 | The system **shall** support configuring a **kill cap** per match — a maximum number of kills per team that count toward score (e.g., kill cap of 10 means even if a team gets 15 kills, only 10 count). | 🟠 P1 |
| FR-03-009 | The system **shall** support **bonus point rules** as optional additions to the base scoring formula, including: (a) First Blood Bonus (bonus points for first kill of the match), (b) Wwipe Bonus (bonus points for eliminating an entire team), (c) MVP Bonus (bonus points to the individual player with most kills in a match), (d) Chicken Dinner Bonus (additional bonus on top of placement points for match winner). | 🟡 P2 |
| FR-03-010 | The system **shall** allow Tournament Directors to define a **tiebreaker rule sequence** that specifies how teams with equal total points are ranked. Default tiebreaker sequence: (1) Most Chicken Dinners (match wins), (2) Most Total Kills, (3) Best single-match placement. Custom sequences must be configured before the tournament starts and cannot be changed mid-tournament. | 🟠 P1 |
| FR-03-011 | The system **shall** allow Org Owners to save custom scoring configurations as named templates within their organization, making them reusable across multiple tournaments. | 🟠 P1 |
| FR-03-012 | The system **shall** provide a **scoring simulator** — an interactive tool that lets a Tournament Director input hypothetical match results (placements + kills for N teams) and see the calculated standings — before the tournament goes live. | 🟡 P2 |

### 3.3.3 UID Validation Rules

| ID | Requirement | Priority |
|----|------------|---------|
| FR-03-013 | The system **shall** validate player UIDs at registration time against the regex pattern defined for each game. UIDs that fail validation shall be flagged and the player/team captain notified. | 🟠 P1 |
| FR-03-014 | The system **shall** detect duplicate UIDs within the same tournament (same UID appearing in more than one team) and flag the registration as suspicious. This shall not automatically reject the registration but shall require organizer review. | 🔴 P0 |
| FR-03-015 | The system **shall** optionally cross-reference UIDs against a blacklist database maintained by Super Admins — containing UIDs of known hackers or previously disqualified players — and flag matches when detected. | 🟡 P2 |

### 3.3.4 Match Format Configuration

| ID | Requirement | Priority |
|----|------------|---------|
| FR-03-016 | The system **shall** support the following match format structures for a tournament: (a) **League/Round-Robin** — all teams play a set number of matches; total points determine final standings, (b) **Group Stage + Finals** — teams divided into groups, top teams advance to a grand final, (c) **Single Elimination Bracket** — teams are eliminated after one loss (not applicable to battle royale where all teams play simultaneously), (d) **Multi-Day League** — league format spread across multiple days with persistent cumulative points. | 🔴 P0 |
| FR-03-017 | The system **shall** support configuring the number of teams per match (4, 12, 16, 20, or 25 teams per match) as a tournament-level setting. | 🔴 P0 |
| FR-03-018 | The system **shall** support configuring the number of matches per round and total rounds in a tournament. | 🔴 P0 |

---

## 3.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-03-001 | A scoring system cannot be modified after the first match of a tournament has been scored. Changes attempted mid-tournament shall be blocked with an explanation message. |
| BR-03-002 | Platform-level scoring templates (pre-built ones like BGIS Standard) cannot be modified by organizers. Organizers can clone a platform template and modify the clone. |
| BR-03-003 | A game can be deactivated by Super Admins (preventing new tournaments for that game), but existing tournaments using that game continue to function normally. |
| BR-03-004 | Kill cap, if set, must be between 1 and 99. Placement-based scoring must have at least two placement tiers defined. |

---

## 3.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-03-001 | The scoring system configuration screen must show a live preview table that updates in real time as the admin adjusts values — showing calculated points for each placement position with the current kill points multiplier. |
| UX-03-002 | Game selection in tournament creation must use large game logo cards (not a dropdown) so organizers can visually identify the game. |
| UX-03-003 | The scoring simulator must be an interactive table where admins can type in hypothetical results and see the leaderboard update instantly — presented as a modal overlay during tournament setup. |
| UX-03-004 | Saved organization templates must be accessible from a dropdown during tournament setup with a "Use This Template" one-click action. |

---

## 3.6 Data Requirements

### 3.6.1 Games Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `game_id` | UUID | PK | Unique game identifier |
| `name` | VARCHAR(100) | NOT NULL | Full game name |
| `short_code` | VARCHAR(10) | UNIQUE, NOT NULL | Abbreviation (BGMI, FF, CODM) |
| `logo_url` | TEXT | NOT NULL | Game logo CDN URL |
| `banner_url` | TEXT | NULLABLE | Game banner CDN URL |
| `platform` | ENUM | NOT NULL | 'mobile','pc','console','multi' |
| `genre` | ENUM | NOT NULL | 'battle_royale','tdm','fps','moba','other' |
| `publisher` | VARCHAR(100) | NULLABLE | Publisher name |
| `uid_label` | VARCHAR(50) | NOT NULL | Label for UID field ("Player ID", "Character ID") |
| `uid_regex` | TEXT | NOT NULL | Regex pattern for UID format validation |
| `uid_example` | VARCHAR(50) | NOT NULL | Example UID for reference |
| `max_team_size` | SMALLINT | NOT NULL | Max players per team |
| `min_team_size` | SMALLINT | NOT NULL | Min players per team |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether new tournaments can use this game |
| `support_level` | ENUM | DEFAULT 'full' | 'full','partial','listing_only' |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 3.6.2 ScoringTemplates Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `template_id` | UUID | PK | Unique template ID |
| `game_id` | UUID | FK → games | Associated game |
| `org_id` | UUID | FK → organizations, NULLABLE | Null = platform template |
| `name` | VARCHAR(100) | NOT NULL | Template name |
| `description` | TEXT | NULLABLE | Description of this scoring system |
| `kill_points` | DECIMAL(4,2) | NOT NULL | Points per kill |
| `kill_cap` | SMALLINT | NULLABLE | Max kills that count per team per match |
| `placement_points` | JSONB | NOT NULL | Array: [{rank:1, points:15}, {rank:2, points:12}, ...] |
| `bonus_rules` | JSONB | NULLABLE | Optional bonus configurations |
| `tiebreaker_sequence` | JSONB | NOT NULL | Array of tiebreaker criteria in priority order |
| `is_platform_default` | BOOLEAN | DEFAULT FALSE | Platform-level immutable template |
| `created_by` | UUID | FK → users | Creator |
| `created_at` | TIMESTAMP | NOT NULL | Creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

---

## 3.7 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-03-001 | A Super Admin can add a new game with all required fields, and it appears in the game catalog for tournament creation within 30 seconds. | Manual QA |
| AC-03-002 | A Tournament Director can select "BGIS Standard" scoring template and the placement points table pre-fills correctly with no manual input required. | Manual QA |
| AC-03-003 | Changing kill_points from 1 to 2 in the scoring simulator updates all calculated totals instantly (under 200ms) for a 16-team hypothetical result set. | Manual QA |
| AC-03-004 | Attempting to modify a scoring system after Match 1 has been scored returns a 409 Conflict error with the message "Scoring system locked after first match is scored." | Automated test |
| AC-03-005 | A BGMI UID entered as "ABC123" (invalid format) is flagged during registration with the validation error: "Invalid BGMI Player ID format. Example: 5491234567." | Automated test |

---

---



# MODULE 5 — TOURNAMENT MANAGEMENT

---

## 5.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-05 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Manages the complete lifecycle of a tournament — from creation and configuration through active execution to archival. This is the central entity of the entire platform. Every other module (registration, scoring, broadcasting) operates within the context of a tournament. |
| **Primary Users** | ROLE-02 (Org Owner), ROLE-03 (Org Admin), ROLE-04 (Tournament Director), ROLE-05 (Referee) |
| **Dependencies** | MOD-01, MOD-02, MOD-03, MOD-04 |
| **Estimated Complexity** | Very High |

---

## 5.2 User Stories

### 5.2.1 Tournament Creation

| ID | User Story | Priority |
|----|-----------|---------|
| US-05-001 | As a **Tournament Director**, I want to create a tournament with a name, game, format, and dates so that players can discover and register for it. | 🔴 P0 |
| US-05-002 | As a **Tournament Director**, I want to configure all tournament settings in a structured setup wizard so that I don't miss any critical configuration. | 🔴 P0 |
| US-05-003 | As a **Tournament Director**, I want to save a tournament as a draft before publishing so that I can review and finalize all settings before players can see it. | 🟠 P1 |
| US-05-004 | As a **Tournament Director**, I want to clone an existing tournament so that I can quickly set up recurring events (weekly cups, monthly leagues) without re-entering all configuration. | 🟠 P1 |
| US-05-005 | As a **Tournament Director**, I want to create a tournament from a saved template so that standard event formats can be reused efficiently. | 🟡 P2 |

### 5.2.2 Tournament Configuration

| ID | User Story | Priority |
|----|-----------|---------|
| US-05-006 | As a **Tournament Director**, I want to configure registration settings — open/close dates, entry fee, team size limits, and maximum team slots — so that registration is controlled precisely. | 🔴 P0 |
| US-05-007 | As a **Tournament Director**, I want to configure the prize pool and prize distribution across positions so that players know what they're competing for. | 🔴 P0 |
| US-05-008 | As a **Tournament Director**, I want to attach tournament rules and a code of conduct to the tournament page so that all participants are aware of the standards expected. | 🟠 P1 |
| US-05-009 | As a **Tournament Director**, I want to configure a waitlist so that teams who register after slots are full are automatically queued for any open spots. | 🟠 P1 |
| US-05-010 | As a **Tournament Director**, I want to set up a check-in window — requiring teams to confirm their attendance before the tournament starts — so that I can fill no-show slots from the waitlist. | 🔴 P0 |

### 5.2.3 Tournament Visibility & Discovery

| ID | User Story | Priority |
|----|-----------|---------|
| US-05-011 | As a **player**, I want to browse upcoming tournaments filtered by game, date, entry fee range, and prize pool so that I can find events relevant to me. | 🟠 P1 |
| US-05-012 | As a **player**, I want to see tournament details — format, schedule, rules, prize distribution, and registered teams — on a public tournament page so that I can make an informed decision to register. | 🔴 P0 |
| US-05-013 | As a **viewer**, I want to see live and upcoming tournaments on the platform homepage so that I can discover interesting events to watch. | 🟡 P2 |

### 5.2.4 Tournament Lifecycle Management

| ID | User Story | Priority |
|----|-----------|---------|
| US-05-014 | As a **Tournament Director**, I want to publish, unpublish, postpone, or cancel a tournament so that I have full control over the event's status. | 🔴 P0 |
| US-05-015 | As a **Tournament Director**, I want to advance the tournament through its phases (Registration → Check-in → Live → Completed) so that the platform reflects the current state accurately. | 🔴 P0 |
| US-05-016 | As a **Tournament Director**, I want to view a real-time tournament control dashboard showing all critical metrics and pending actions so that I can manage the event from one place. | 🔴 P0 |
| US-05-017 | As a **Tournament Director**, I want to assign staff (Referees, Broadcast Producers) to a tournament so that the right people have access to the right tools. | 🔴 P0 |

---

## 5.3 Functional Requirements

### 5.3.1 Tournament Creation Wizard

| ID | Requirement | Priority |
|----|------------|---------|
| FR-05-001 | The system **shall** implement a multi-step tournament creation wizard with the following steps: Step 1 — Basic Info, Step 2 — Format & Schedule, Step 3 — Registration Settings, Step 4 — Prize Pool, Step 5 — Rules & Communication, Step 6 — Staff Assignment, Step 7 — Review & Publish. The user can navigate between steps freely and save at any point as a draft. | 🔴 P0 |
| FR-05-002 | **Step 1 — Basic Info** shall collect: Tournament Name (max 80 chars), Tournament Slug (auto-generated, editable), Game (from game catalog), Tournament Type (single tournament / league series), Edition Number (optional, for recurring events), Tournament Tier (Community / Invitational / Open / Pro), Description (max 1000 chars, rich text), Tournament Logo (optional), Tournament Banner (required for publishing), Start Date, End Date. | 🔴 P0 |
| FR-05-003 | **Step 2 — Format & Schedule** shall collect: Match Format (League / Group Stage + Finals / Multi-Day League), Teams Per Match (4 / 12 / 16 / 20 / 25), Total Teams Capacity (16 / 32 / 48 / 64 / 96 / 128 / 256 / custom), Number of Rounds, Matches Per Round, Scoring System (select from templates or create custom), Tiebreaker Rules, and Map Pool (optional, for games that support multiple maps). | 🔴 P0 |
| FR-05-004 | **Step 3 — Registration Settings** shall collect: Registration Open Date/Time, Registration Close Date/Time, Entry Fee (₹0 for free, or custom amount), Payment Methods Accepted (UPI, card, wallet), Team Size (min and max players, substitute slot yes/no), Registration Approval Mode (auto-approve / manual review / invite-only), Waitlist Enabled (yes/no), Waitlist Capacity (if enabled), Check-in Required (yes/no), Check-in Window (start and end time relative to tournament start). | 🔴 P0 |
| FR-05-005 | **Step 4 — Prize Pool** shall collect: Total Prize Pool Amount (₹), Prize Distribution Table (prize for each placement, with amounts that must sum to ≤ total prize pool), Prize Type (cash / merchandise / in-game items / mixed), Prize Distribution Method (platform-managed / manual by organizer). | 🔴 P0 |
| FR-05-006 | **Step 5 — Rules & Communication** shall collect: Tournament Rules (rich text editor, max 10,000 chars, or import from org house rules), Code of Conduct (checkbox to use platform default, or custom), Pre-Tournament Announcement Message, Match Day Communication Template (automated message sent before each match), Result Announcement Template. | 🟠 P1 |
| FR-05-007 | **Step 6 — Staff Assignment** shall allow the Tournament Director to assign org members to the following tournament roles: Co-Director (full access), Referee (match operations), Broadcast Producer (stream tools). Multiple people can be assigned to each role. | 🔴 P0 |
| FR-05-008 | **Step 7 — Review & Publish** shall display a complete summary of all settings with edit links to each step, a pre-publish checklist that validates all required fields are complete, a preview of the public tournament page, and publish/save-as-draft actions. | 🔴 P0 |

### 5.3.2 Tournament States & Lifecycle

| ID | Requirement | Priority |
|----|------------|---------|
| FR-05-009 | The system **shall** enforce the following tournament state machine with strict transition rules: | 🔴 P0 |

**Tournament State Machine:**

```
DRAFT → PUBLISHED → REGISTRATION_OPEN → REGISTRATION_CLOSED
     → CHECK_IN → LIVE → COMPLETED → ARCHIVED
     
At any point (except COMPLETED/ARCHIVED):
     → POSTPONED (can return to previous state)
     → CANCELLED (terminal state)
```

| State | Description | Who Can Transition | Automatic Trigger |
|-------|-------------|-------------------|-------------------|
| `DRAFT` | Being configured, not visible publicly | Tournament Director | Created via wizard |
| `PUBLISHED` | Visible publicly, registration not yet open | Tournament Director | Manual action |
| `REGISTRATION_OPEN` | Teams can register | Tournament Director | Scheduled open date/time |
| `REGISTRATION_CLOSED` | Registration deadline passed | Tournament Director | Scheduled close date/time |
| `CHECK_IN` | Confirmed teams must check in | Tournament Director | Manual or scheduled |
| `LIVE` | Tournament is actively running | Tournament Director | Manual action |
| `COMPLETED` | All matches finished, results final | Tournament Director | Manual action |
| `ARCHIVED` | Historical record only | System | 30 days after COMPLETED |
| `POSTPONED` | Temporarily suspended | Tournament Director | Manual action |
| `CANCELLED` | Permanently stopped | Tournament Director | Manual action |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-05-010 | The system **shall** prevent illegal state transitions (e.g., going from DRAFT directly to LIVE, or from COMPLETED back to LIVE) and return a descriptive error message. | 🔴 P0 |
| FR-05-011 | The system **shall** automatically transition tournament state based on scheduled dates/times for: DRAFT → PUBLISHED (if publish date is set), PUBLISHED → REGISTRATION_OPEN (at registration open time), REGISTRATION_OPEN → REGISTRATION_CLOSED (at registration close time). All other transitions require manual action by the Tournament Director. | 🟠 P1 |
| FR-05-012 | When a tournament is **CANCELLED**, the system **shall**: notify all registered teams via in-app notification, email, and SMS (if opted in); trigger automatic refunds for all paid entry fees; and mark the tournament with a cancellation reason that is displayed on the public page. | 🔴 P0 |
| FR-05-013 | When a tournament is **POSTPONED**, the system **shall** notify all registered teams and display the postponement notice on the public page. The original dates shall remain visible with a strikethrough and the new dates shown prominently. | 🟠 P1 |

### 5.3.3 Tournament Configuration Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-05-014 | The system **shall** allow Tournament Directors to edit tournament settings while the tournament is in DRAFT or PUBLISHED state with no restrictions. Once REGISTRATION_OPEN, the following fields become locked: Game, Format, Teams Per Match, Total Teams Capacity, and Scoring System. | 🔴 P0 |
| FR-05-015 | The system **shall** allow limited edits during REGISTRATION_OPEN state: entry fee changes (with notification to already-registered teams), prize pool updates, rules updates, and staff changes. | 🟠 P1 |
| FR-05-016 | The system **shall** support tournament cloning — creating an exact copy of all settings from an existing tournament into a new DRAFT, with date fields reset to blank and a "(Copy)" suffix added to the name. | 🟠 P1 |
| FR-05-017 | The system **shall** allow Tournament Directors to save a tournament's complete configuration (excluding team registrations and match data) as a reusable template within their organization. | 🟡 P2 |

### 5.3.4 Prize Pool Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-05-018 | The system **shall** support a prize distribution table where organizers define prize amounts for each finishing position. The system shall display a running total and warn if the distribution exceeds the stated prize pool. | 🔴 P0 |
| FR-05-019 | The system **shall** support percentage-based prize distribution (e.g., 1st: 50%, 2nd: 30%, 3rd: 20%) that automatically calculates amounts based on the total prize pool amount. | 🟠 P1 |
| FR-05-020 | The system **shall** support split prize structures for leagues (e.g., prize pool split across multiple stages: group stage bonus + grand final prize). | 🟡 P2 |

### 5.3.5 Tournament Discovery & Public Page

| ID | Requirement | Priority |
|----|------------|---------|
| FR-05-021 | The system **shall** provide a tournament discovery page with the following filter options: Game (multi-select), Tournament Tier, Status (upcoming / live / completed), Entry Fee Range (free / paid / fee range), Prize Pool Range, Country/Region, and Date Range. | 🟠 P1 |
| FR-05-022 | Each tournament **shall** have a public page at `gameverse.gg/t/[tournament-slug]` displaying: tournament info and branding, format overview, prize distribution table, schedule overview, registration status and CTA, participating teams (names, not full rosters), rules, organizer info, and live stream link (when applicable). | 🔴 P0 |
| FR-05-023 | The public tournament page **shall** display a real-time participant counter ("47 / 64 teams registered") that updates without page refresh. | 🟠 P1 |
| FR-05-024 | Players **shall** be able to bookmark tournaments from the discovery page to receive reminders before registration opens. | 🟡 P2 |

### 5.3.6 Staff Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-05-025 | The system **shall** allow Tournament Directors to assign tournament-specific roles to org members. A user's tournament-level role can be different from (and more restricted than) their org-level role. | 🔴 P0 |
| FR-05-026 | The system **shall** support assigning referees to specific matches (not just the whole tournament) so that match-level responsibility is clear. | 🟠 P1 |
| FR-05-027 | The system **shall** maintain an activity log per tournament staff member showing: matches handled, actions performed, and timestamps. | 🟡 P2 |

---

## 5.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-05-001 | A tournament must belong to exactly one organization. Tournaments cannot be transferred between organizations. |
| BR-05-002 | A tournament's slug is immutable once the tournament is published. Changing the URL after publication would break external links. |
| BR-05-003 | A tournament cannot be published if any of the following required fields are missing: name, game, start date, end date, total teams capacity, teams per match, and scoring system. |
| BR-05-004 | Entry fee cannot be increased after any team has already registered and paid. It can be decreased (refund difference automatically to registered teams). |
| BR-05-005 | A tournament with zero registered teams and no payments processed can be cancelled with no refund workflow. A tournament with registered teams requires the refund workflow to run before cancellation is confirmed. |
| BR-05-006 | Multi-day tournaments (spanning multiple calendar days) shall have their `LIVE` phase persist across days. The system does not auto-complete the tournament at end of calendar day. |
| BR-05-007 | A tournament is considered "completed" only when the Tournament Director explicitly marks it complete. This prevents premature completion if matches are delayed. |

---

## 5.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-05-001 | The tournament creation wizard must have a persistent left sidebar showing all steps with completion status indicators (empty circle = not started, half circle = in progress, full circle = complete, checkmark = complete and valid). |
| UX-05-002 | The tournament public page must have a sticky "Register Now" CTA button that remains visible while scrolling. The button state must change dynamically: "Register Now" (open), "Registration Closed" (closed, greyed), "Join Waitlist" (full), "Ongoing" (live), "View Results" (completed). |
| UX-05-003 | Prize pool distribution must be visualized as a horizontal bar chart on the public page showing relative prize amounts per position. |
| UX-05-004 | The tournament state badge must be prominently displayed at the top of both the admin panel and public page with distinct colors: Draft (grey), Published (blue), Registration Open (green), Live (red pulsing dot), Completed (purple), Cancelled (red strikethrough). |
| UX-05-005 | The tournament admin panel must have a top-level "Danger Zone" section for destructive actions (cancel, delete draft) with confirmation dialogs requiring the organizer to type the tournament name. |

---

## 5.6 Data Requirements

### 5.6.1 Tournaments Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `tournament_id` | UUID | PK | Unique tournament ID |
| `org_id` | UUID | FK → organizations | Owning organization |
| `created_by` | UUID | FK → users | Creator |
| `name` | VARCHAR(80) | NOT NULL | Tournament name |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL identifier |
| `game_id` | UUID | FK → games | Game being played |
| `description` | TEXT | NULLABLE | Rich text description |
| `logo_url` | TEXT | NULLABLE | Tournament logo |
| `banner_url` | TEXT | NULLABLE | Tournament banner |
| `tournament_type` | ENUM | NOT NULL | 'single','league_series' |
| `tournament_tier` | ENUM | NOT NULL | 'community','invitational','open','pro' |
| `edition_number` | SMALLINT | NULLABLE | Edition for recurring events |
| `match_format` | ENUM | NOT NULL | 'league','group_finals','multi_day' |
| `teams_per_match` | SMALLINT | NOT NULL | Teams in one match session |
| `total_team_slots` | SMALLINT | NOT NULL | Max teams in tournament |
| `registered_team_count` | INTEGER | DEFAULT 0 | Cached count |
| `confirmed_team_count` | INTEGER | DEFAULT 0 | Checked-in teams count |
| `num_rounds` | SMALLINT | NOT NULL | Total tournament rounds |
| `matches_per_round` | SMALLINT | NOT NULL | Matches within each round |
| `scoring_template_id` | UUID | FK → scoring_templates | Active scoring config |
| `entry_fee` | INTEGER | DEFAULT 0 | Entry fee in INR (paise) |
| `total_prize_pool` | INTEGER | DEFAULT 0 | Prize pool in INR (paise) |
| `prize_distribution` | JSONB | NULLABLE | [{rank:1, amount:50000}, ...] |
| `prize_type` | ENUM | DEFAULT 'cash' | 'cash','merchandise','in_game','mixed' |
| `registration_opens_at` | TIMESTAMP | NOT NULL | Registration start |
| `registration_closes_at` | TIMESTAMP | NOT NULL | Registration deadline |
| `checkin_opens_at` | TIMESTAMP | NULLABLE | Check-in window start |
| `checkin_closes_at` | TIMESTAMP | NULLABLE | Check-in window end |
| `starts_at` | TIMESTAMP | NOT NULL | Tournament start |
| `ends_at` | TIMESTAMP | NOT NULL | Tournament end |
| `status` | ENUM | DEFAULT 'draft' | Full state machine enum |
| `waitlist_enabled` | BOOLEAN | DEFAULT FALSE | Waitlist feature flag |
| `waitlist_capacity` | SMALLINT | NULLABLE | Max waitlist teams |
| `checkin_required` | BOOLEAN | DEFAULT TRUE | Check-in required flag |
| `approval_mode` | ENUM | DEFAULT 'auto' | 'auto','manual','invite_only' |
| `rules_text` | TEXT | NULLABLE | Tournament rulebook |
| `stream_url` | TEXT | NULLABLE | Primary stream URL |
| `discord_url` | TEXT | NULLABLE | Tournament Discord |
| `is_featured` | BOOLEAN | DEFAULT FALSE | Platform-featured flag |
| `cancellation_reason` | TEXT | NULLABLE | Reason if cancelled |
| `postponement_reason` | TEXT | NULLABLE | Reason if postponed |
| `completed_at` | TIMESTAMP | NULLABLE | Completion timestamp |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 5.6.2 TournamentStaff Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `staff_id` | UUID | PK | Record ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `user_id` | UUID | FK → users | Staff member |
| `tournament_role` | ENUM | NOT NULL | 'co_director','referee','broadcast_producer' |
| `assigned_by` | UUID | FK → users | Who assigned this role |
| `assigned_at` | TIMESTAMP | NOT NULL | Assignment time |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active assignment |

---

## 5.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Tournament auto-transitions to REGISTRATION_OPEN but the org's subscription has expired | Auto-transition is blocked; tournament stays in PUBLISHED; Org Owner is notified immediately with an upgrade CTA |
| Tournament Director tries to clone a cancelled tournament | Cloning is allowed; all settings are copied; the clone starts as DRAFT with a "(Copy)" suffix; cancellation reason is not copied |
| Two Tournament Directors in the same org try to edit the same tournament setting simultaneously | Implement optimistic locking; second save attempt fails with: "These settings were updated by [User] at [time]. Please refresh and try again." |
| Tournament is in LIVE state and the Tournament Director goes offline for extended period | System does not auto-complete the tournament; a Super Admin can intervene if the tournament is orphaned for 48+ hours |
| Entry fee is set to ₹0 but prize pool is ₹50,000 | Allowed; system adds a warning: "This is a free-entry tournament with a paid prize pool. Confirm that the prize pool is sponsor-funded." |

---

## 5.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-05-001 | A Tournament Director can create and publish a tournament in under 10 minutes using the wizard. | Manual QA (timed) |
| AC-05-002 | The tournament transitions from PUBLISHED to REGISTRATION_OPEN automatically at the scheduled time (within ±60 seconds). | Automated test |
| AC-05-003 | Cancelling a tournament with 20 registered paid teams triggers refunds for all teams within 5 minutes and sends notifications to all team captains. | E2E automated test |
| AC-05-004 | The participant counter on the public page updates in real time when a new team registers, within 3 seconds of registration completion. | Manual QA |
| AC-05-005 | A locked field (e.g., Game) cannot be changed once REGISTRATION_OPEN, even via direct API call (returns 403 Forbidden). | Automated API test |

---

---



# MODULE 7 — MATCH SCHEDULING & SLOT MANAGEMENT

---

## 7.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-07 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Handles the automatic and manual generation of match schedules — organizing approved teams into matches, rounds, and groups; assigning time slots; managing slot assignments; and providing the schedule to teams, referees, and the broadcast system. Replaces the manual spreadsheet scheduling that organizers currently do. |
| **Primary Users** | ROLE-04 (Tournament Director), ROLE-05 (Referee), ROLE-07 (Team Captain) |
| **Dependencies** | MOD-05, MOD-06 |
| **Estimated Complexity** | High |

---

## 7.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-07-001 | As a **Tournament Director**, I want the system to automatically generate the match schedule based on the number of confirmed teams, format, and teams per match so that I don't have to manually assign slots. | 🔴 P0 |
| US-07-002 | As a **Tournament Director**, I want to review and manually adjust the auto-generated schedule before publishing it to teams so that I can fix any issues. | 🔴 P0 |
| US-07-003 | As a **Tournament Director**, I want to publish the schedule to all confirmed teams at once so that everyone receives notification of their match times simultaneously. | 🔴 P0 |
| US-07-004 | As a **Team Captain**, I want to see my complete match schedule — match number, date, time, slot number, and other teams in the match — so that I can prepare accordingly. | 🔴 P0 |
| US-07-005 | As a **Tournament Director**, I want to handle no-shows by reassigning or removing empty slots in real time so that matches run at full or near-full capacity. | 🟠 P1 |
| US-07-006 | As a **Referee**, I want to see the complete match order and which teams are in each match before and during the event so that I can coordinate match operations. | 🔴 P0 |
| US-07-007 | As a **Tournament Director**, I want to configure groups (Group A, B, C) for group stage formats and have teams assigned to groups fairly so that the competition structure is clear. | 🟠 P1 |
| US-07-008 | As a **Tournament Director**, I want to see a visual timeline of the entire tournament schedule so that I can understand the full day's flow at a glance. | 🟠 P1 |

---

## 7.3 Functional Requirements

### 7.3.1 Schedule Generation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-07-001 | The system **shall** provide an auto-schedule generation function that, given: total confirmed teams (N), teams per match (M), total rounds (R), and matches per round (P), automatically generates a complete match schedule. Formula: Total matches = R × P, Teams per match = M, and N must be ≤ R × P × M. | 🔴 P0 |
| FR-07-002 | The auto-schedule generator **shall** support the following assignment algorithms: (a) **Random Draw** — teams randomly assigned to matches, (b) **Seeded Draw** — teams assigned based on a seed ranking, with top seeds separated into different matches, (c) **Group Round-Robin** — within a group, all teams play against the same pool of opponents across rounds. | 🟠 P1 |
| FR-07-003 | For **League format**, the schedule generator **shall** ensure that each team plays exactly the same number of matches across all rounds. If total teams is not evenly divisible by teams-per-match, the system shall use byes (ghost/dummy team) to fill incomplete matches and clearly mark these matches in the schedule. | 🔴 P0 |
| FR-07-004 | For **Group Stage + Finals format**, the schedule generator **shall**: (a) divide teams into balanced groups (e.g., 64 teams → 4 groups of 16), (b) generate a group stage schedule, (c) define advancement rules (top N teams from each group advance), (d) generate the finals bracket from advancing teams. | 🟠 P1 |
| FR-07-005 | The system **shall** allow Tournament Directors to assign scheduled start times to each match. The system shall suggest start times based on an average match duration input (default: 35 minutes for BGMI, configurable), adding buffer time between matches (default: 15 minutes, configurable). | 🔴 P0 |
| FR-07-006 | The schedule generator **shall** output a complete match list where each match entry contains: match ID, round number, match number within round, scheduled start time, list of assigned teams (with slot numbers), and assigned referee (if applicable). | 🔴 P0 |

### 7.3.2 Slot Assignment

| ID | Requirement | Priority |
|----|------------|---------|
| FR-07-007 | Each team in a match **shall** be assigned a **slot number** (e.g., Slot 1 through Slot 16 for a 16-team match). The slot number corresponds to the in-game slot position that determines which in-game slot a team occupies in the custom room. | 🔴 P0 |
| FR-07-008 | The system **shall** allow Tournament Directors to manually override slot assignments for any match — dragging and dropping teams between slots in a visual interface. | 🟠 P1 |
| FR-07-009 | For multi-round tournaments, the system **shall** support the option to randomize slot assignments fresh for each round (so teams don't always start in the same slot) or maintain consistent slot assignment throughout the tournament. | 🟠 P1 |
| FR-07-010 | The system **shall** support assigning **zone/map position preferences** to slots for games that use a fixed spectator slot order (e.g., BGMI spectator grid slots 1–16). | 🟢 P3 |

### 7.3.3 Schedule Publishing & Communication

| ID | Requirement | Priority |
|----|------------|---------|
| FR-07-011 | The system **shall** provide a "Publish Schedule" action that simultaneously: (a) makes the schedule visible to all registered teams and the public tournament page, (b) sends an in-app notification to all Team Captains with their match schedule, (c) sends a schedule summary email to all Team Captains. | 🔴 P0 |
| FR-07-012 | Once published, individual match details **shall** be visible to each team on their registration detail page — showing only their matches (not the full schedule). A "Full Schedule" view shall be available on the public tournament page. | 🟠 P1 |
| FR-07-013 | The system **shall** send automated reminders to Team Captains before each of their matches: (a) 60 minutes before match (first reminder), (b) 15 minutes before match (second reminder with check-in confirmation request). | 🟠 P1 |

### 7.3.4 Schedule Management During Tournament

| ID | Requirement | Priority |
|----|------------|---------|
| FR-07-014 | The system **shall** allow Tournament Directors to mark a match as **delayed** — pushing its start time by a specified number of minutes — and notifying all teams assigned to that match. | 🔴 P0 |
| FR-07-015 | The system **shall** allow Tournament Directors to handle no-shows during check-in by: (a) removing the no-show team from a match (match continues with fewer teams), (b) replacing the no-show team with the first available waitlisted team, (c) merging two under-populated matches into one. | 🟠 P1 |
| FR-07-016 | The system **shall** maintain a real-time visual schedule board — visible to organizers and referees — showing each match's status: Scheduled, Delayed, In Progress, Completed, Cancelled. This board must update in real time without page refresh. | 🔴 P0 |
| FR-07-017 | The system **shall** automatically update match statuses based on referee actions: when a referee marks a match as "Started," the match status changes to "In Progress"; when results are submitted, the status changes to "Completed." | 🔴 P0 |

### 7.3.5 Group Stage Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-07-018 | For group stage formats, the system **shall** provide a group management panel showing: group standings (updated after each group stage match), advancement thresholds, and a "Generate Finals" button that creates the finals schedule based on current group standings. | 🟠 P1 |
| FR-07-019 | The system **shall** support configuring group advancement rules: (a) top N teams by total points, (b) top N teams by placement points only, (c) wild card spots (N additional teams selected across all groups by kills). | 🟠 P1 |

---

## 7.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-07-001 | The schedule can only be generated after registration is closed and the final list of confirmed teams is locked. Attempting to generate a schedule during REGISTRATION_OPEN state is blocked. |
| BR-07-002 | Once a schedule is published and at least one match has started (is in "In Progress" or "Completed" state), the overall schedule structure (number of rounds, matches per round) cannot be changed. Individual match adjustments (time changes, team substitutions) are still permitted. |
| BR-07-003 | A team cannot be assigned to two overlapping matches in the same tournament. The schedule validator must check for time conflicts. |
| BR-07-004 | Byes (matches with fewer than the required teams due to uneven division) are always placed in the last match of a round to minimize competitive impact. |
| BR-07-005 | The slot number assignment is permanent within a match once the room credential for that match has been distributed. Slot reassignment after room distribution is blocked. |

---

## 7.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-07-001 | The schedule generation interface must present the proposed schedule as a visual grid — rows = rounds, columns = matches — where each cell shows the match number and assigned team names. |
| UX-07-002 | Slot reassignment must use a drag-and-drop interface within a match card. Dragging a team from one slot drops them into the target slot, and the displaced team swaps positions. |
| UX-07-003 | The real-time schedule board (organizer view) must use a Kanban-style layout with columns for each match status. Match cards must show team names, assigned referee, and scheduled time. |
| UX-07-004 | Team Captains must see their schedule as a vertical timeline sorted by match time — not as the full tournament grid — to reduce information overload. |
| UX-07-005 | Match delay input must be a quick-action modal with preset delay options: +15 min, +30 min, +45 min, +60 min, or custom — to speed up the most common operation. |

---

## 7.6 Data Requirements

### 7.6.1 Matches Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `match_id` | UUID | PK | Unique match ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `round_number` | SMALLINT | NOT NULL | Round (1, 2, 3...) |
| `match_number` | SMALLINT | NOT NULL | Match within round |
| `group_id` | UUID | FK → groups, NULLABLE | Group (if group stage) |
| `stage` | ENUM | DEFAULT 'group' | 'group','semifinal','final','grand_final' |
| `scheduled_start_at` | TIMESTAMP | NOT NULL | Planned start time |
| `actual_start_at` | TIMESTAMP | NULLABLE | Actual start time |
| `actual_end_at` | TIMESTAMP | NULLABLE | Actual end time |
| `status` | ENUM | DEFAULT 'scheduled' | 'scheduled','delayed','in_progress','completed','cancelled','void' |
| `delay_minutes` | SMALLINT | DEFAULT 0 | Cumulative delay |
| `assigned_referee_id` | UUID | FK → users, NULLABLE | Assigned referee |
| `map` | VARCHAR(50) | NULLABLE | Map played |
| `room_credential_id` | UUID | FK → room_credentials, NULLABLE | Associated room credential |
| `is_bye` | BOOLEAN | DEFAULT FALSE | Bye match flag |
| `notes` | TEXT | NULLABLE | Referee/director notes |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 7.6.2 MatchSlots Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `slot_id` | UUID | PK | Unique slot ID |
| `match_id` | UUID | FK → matches | Match |
| `slot_number` | SMALLINT | NOT NULL | Slot position (1–25) |
| `registration_id` | UUID | FK → tournament_registrations, NULLABLE | Assigned team registration |
| `team_id` | UUID | FK → teams, NULLABLE | Shortcut to team |
| `team_name_snapshot` | VARCHAR(30) | NULLABLE | Team name at time of assignment |
| `is_bye` | BOOLEAN | DEFAULT FALSE | Empty/bye slot flag |
| `checkin_status` | ENUM | DEFAULT 'pending' | 'pending','checked_in','no_show','excused' |
| `checkin_at` | TIMESTAMP | NULLABLE | Check-in timestamp |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 7.6.3 TournamentGroups Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `group_id` | UUID | PK | Group ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `group_name` | VARCHAR(20) | NOT NULL | Display name (Group A, Group B) |
| `group_code` | VARCHAR(5) | NOT NULL | Short code (A, B, C) |
| `advancement_spots` | SMALLINT | NOT NULL | Teams advancing from this group |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

---

## 7.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Number of confirmed teams is not perfectly divisible by teams-per-match | System uses byes; warns the director: "3 bye slots will be created across 2 matches. These teams will face fewer opponents in those matches. Consider adjusting total slots or teams per match." |
| Auto-schedule is generated, then 5 more teams are approved from the waitlist after schedule is published | System flags the conflict; director can either: (a) regenerate the schedule (unpublishes current schedule, requires republish), or (b) manually insert new teams into existing matches that have empty slots |
| Two referees try to mark the same match as "Started" simultaneously | Implement idempotent state transition; both requests result in the same "In Progress" state; second request is accepted silently (not rejected) |
| Tournament Director delays a match by 2 hours, pushing it past midnight | System allows the delay but warns: "This match will now be scheduled after midnight (00:15 AM). Confirm?" |
| A team marked as "No Show" shows up 10 minutes into the match | Referee can un-mark no-show and admit the team into the match (at organizer's discretion); late entry is logged with timestamp |

---

## 7.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-07-001 | Auto-schedule generation for a 64-team, 6-round, 16-teams-per-match tournament completes within 3 seconds. | Performance test |
| AC-07-002 | Published schedule notifications reach all Team Captains' in-app notification center within 60 seconds of the director clicking "Publish Schedule." | E2E automated test |
| AC-07-003 | Delaying a match by 30 minutes updates the scheduled time in the organizer's real-time board and sends notifications to affected teams within 10 seconds. | Manual QA |
| AC-07-004 | The slot assignment drag-and-drop correctly swaps two teams between slots and the change persists after page refresh. | Manual QA |
| AC-07-005 | A team assigned to Match 3 (Round 1) cannot be assigned to Match 3 (Round 1) in another group if it would create a time overlap. | Automated test |

---

---



# MODULE 9 — MATCH DAY OPERATIONS

---

## 9.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-09 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Manages all real-time operations on match day — team check-in, match lobby management, referee control panel, match status flow, technical pause handling, no-show management, and the overall match execution experience for organizers, referees, and players. This module is the operational nerve center of the platform on event day, replacing the chaotic WhatsApp-based coordination that currently defines tournament match day execution. |
| **Primary Users** | ROLE-04 (Tournament Director), ROLE-05 (Referee), ROLE-07 (Team Captain), ROLE-08 (Player) |
| **Dependencies** | MOD-05, MOD-06, MOD-07, MOD-08 |
| **Estimated Complexity** | Very High |

---

## 9.2 Match Day Flow Overview

```
CHECK_IN PHASE
├── Check-in window opens (configured time before tournament start)
├── Teams confirm attendance (captain action)
├── System identifies no-shows after check-in deadline
├── Director handles no-shows (waitlist promotion / bye assignment)
└── All slots confirmed → Match Day begins

MATCH EXECUTION (per match)
├── Referee opens match lobby (status: LOBBY_OPEN)
├── Room credentials entered & released (MOD-08)
├── Teams receive credentials → join in-game room
├── Referee verifies all teams present in room
├── Match starts → referee marks IN_PROGRESS
├── [Match plays out in-game, ~25–35 minutes]
├── Match ends → results screenshot taken
├── Referee enters results (MOD-10)
├── Results verified & published
├── Leaderboard updates (MOD-11)
└── Next match lobby opens

TOURNAMENT CONCLUSION
├── All matches completed
├── Final leaderboard verified
├── Tournament Director marks COMPLETED
├── Prize pool distribution triggered (MOD-16)
└── Results published publicly
```

---

## 9.3 User Stories

### 9.3.1 Check-In System

| ID | User Story | Priority |
|----|-----------|---------|
| US-09-001 | As a **Team Captain**, I want to check in my team for the tournament with a single tap so that we are confirmed as present for match day. | 🔴 P0 |
| US-09-002 | As a **Tournament Director**, I want to see real-time check-in status for all confirmed teams so that I know which teams are present and which are absent. | 🔴 P0 |
| US-09-003 | As a **Tournament Director**, I want to automatically open check-in at a configured time and close it at a deadline so that I don't have to manually manage the check-in window. | 🟠 P1 |
| US-09-004 | As a **Tournament Director**, I want to send a reminder notification to teams that haven't checked in 15 minutes before the deadline so that I maximize attendance. | 🟠 P1 |
| US-09-005 | As a **Tournament Director**, I want to see which teams haven't checked in and mark them as no-shows so that I can fill their slots from the waitlist. | 🔴 P0 |
| US-09-006 | As a **Tournament Director**, I want to manually check in a team on their behalf (if they are having technical issues) so that I don't penalize a team for platform issues. | 🟠 P1 |

### 9.3.2 Match Operations

| ID | User Story | Priority |
|----|-----------|---------|
| US-09-007 | As a **Referee**, I want a dedicated Match Control Panel for each assigned match so that I have all the tools I need in one place. | 🔴 P0 |
| US-09-008 | As a **Referee**, I want to advance a match through its states (Lobby Open → In Progress → Completed) so that the platform reflects what's happening in real time. | 🔴 P0 |
| US-09-009 | As a **Referee**, I want to call a technical pause during a match and notify all teams of the pause reason and estimated resume time so that match integrity is maintained during issues. | 🟠 P1 |
| US-09-010 | As a **Referee**, I want to void a match (declare it null) and schedule a rematch so that I can handle situations where the match was compromised (room crash, hacker joins, etc.). | 🟠 P1 |
| US-09-011 | As a **Referee**, I want to disqualify a team from a specific match or the entire tournament with a documented reason so that code of conduct violations are enforced. | 🟠 P1 |
| US-09-012 | As a **Player**, I want to see the current match status (lobby open, in progress, paused, etc.) in the platform so that I always know what's happening. | 🔴 P0 |

### 9.3.3 No-Show & Substitution Management

| ID | User Story | Priority |
|----|-----------|---------|
| US-09-013 | As a **Tournament Director**, I want to replace a no-show team with the next waitlisted team before a match starts so that matches run at full capacity. | 🟠 P1 |
| US-09-014 | As a **Tournament Director**, I want to activate a team's substitute player for a specific match so that teams with an absent main player can still compete. | 🟠 P1 |
| US-09-015 | As a **Team Captain**, I want to request substitute activation for a specific match so that my team can field a replacement for an unavailable player. | 🟠 P1 |

---

## 9.4 Functional Requirements

### 9.4.1 Check-In System

| ID | Requirement | Priority |
|----|------------|---------|
| FR-09-001 | The system **shall** automatically open the check-in window at the time configured in the tournament settings. When the check-in window opens, all confirmed Team Captains receive an in-app notification: "Check-in is now open for [Tournament Name]. Check in before [deadline time]." | 🔴 P0 |
| FR-09-002 | The system **shall** provide Team Captains with a single-action check-in button on their tournament dashboard. Clicking "Check In" records: team ID, captain user ID, timestamp, and IP address. A confirmation message is displayed: "Your team [Team Name] is checked in. Good luck!" | 🔴 P0 |
| FR-09-003 | The check-in dashboard for Tournament Directors **shall** display: (a) a real-time count of checked-in vs. total confirmed teams (e.g., "47 / 64 checked in"), (b) a list of all teams with their check-in status (green = checked in, red = not checked in, grey = no-show marked), (c) the time remaining until check-in deadline (countdown). | 🔴 P0 |
| FR-09-004 | The system **shall** send an automated reminder notification to all teams that have not checked in when: (a) 30 minutes before check-in deadline, (b) 10 minutes before check-in deadline. Reminders are sent via in-app notification and SMS (if enabled). | 🟠 P1 |
| FR-09-005 | The system **shall** automatically close the check-in window at the configured deadline time. After closing, the director can review which teams have not checked in. | 🔴 P0 |
| FR-09-006 | The system **shall** allow Tournament Directors to mark unchecked teams as **No-Show** with a single action. No-show teams are removed from their assigned match slots and their slot status changes to "Vacant." | 🔴 P0 |
| FR-09-007 | After marking a no-show, the system **shall** offer the director the following options for each vacant slot: (a) Promote next waitlisted team (if waitlist exists), (b) Mark as Bye (match proceeds with fewer teams), (c) Merge matches (if multiple matches have vacant slots, combine the remaining teams). | 🟠 P1 |
| FR-09-008 | The system **shall** allow Tournament Directors to manually check in a team on their behalf, with a logged note indicating manual check-in (e.g., "Checked in by Director - team reported technical issue"). | 🟠 P1 |
| FR-09-009 | The check-in system **shall** support match-level check-in as well as tournament-level check-in. Match-level check-in requires teams to confirm readiness before each individual match (configurable per tournament). | 🟡 P2 |

### 9.4.2 Match Control Panel (Referee Interface)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-09-010 | The system **shall** provide each Referee with a **Match Control Panel** — a dedicated interface for managing a specific match — accessible from the tournament operations dashboard. The Match Control Panel shall display: match number, round, assigned teams (with slot numbers), scheduled start time, match status, and all control actions. | 🔴 P0 |
| FR-09-011 | The Match Control Panel **shall** provide the following state transition controls for each match: (a) **Open Lobby** — changes status to LOBBY_OPEN, enables room credential entry, (b) **Mark In Progress** — changes status to IN_PROGRESS, starts match timer, (c) **Submit Results** — opens result entry form (MOD-10), (d) **Mark Completed** — changes status to COMPLETED after results are verified. | 🔴 P0 |
| FR-09-012 | The system **shall** display a **Match Timer** on the Match Control Panel that: (a) shows elapsed time since "Mark In Progress" was clicked, (b) displays a configurable expected match duration (default 35 minutes) as a progress bar, (c) alerts with a yellow warning at 110% of expected duration and red at 150%. | 🟠 P1 |
| FR-09-013 | The system **shall** display a **Lobby Readiness Tracker** on the Match Control Panel showing: for each team, whether the team captain has received credentials (acknowledged in platform), whether they are marked as ready by the captain (optional captain action), and the time since credential release. | 🟠 P1 |
| FR-09-014 | The system **shall** allow Referees to add **Match Notes** — free-text notes attached to a match — for documenting observations, incidents, or decisions made during the match. Notes are timestamped and attributed to the referee. These notes are visible to Tournament Directors and contribute to the audit trail. | 🟠 P1 |
| FR-09-015 | The system **shall** display the match's scoring configuration (placement points table, kill points) on the Match Control Panel for the referee's reference during result entry. | 🟠 P1 |

### 9.4.3 Technical Pause Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-09-016 | The system **shall** allow Referees to declare a **Technical Pause** for an in-progress match. Declaring a pause requires: (a) selecting a pause reason from a predefined list: ["Game crash / disconnect", "Unauthorized player in lobby", "Network issue", "Observer issue", "Other (specify)"], (b) entering an estimated resume time. | 🟠 P1 |
| FR-09-017 | Upon declaring a Technical Pause, the system **shall**: (a) change match status from IN_PROGRESS to PAUSED, (b) send an in-app notification to all teams in the match: "⚠️ Match [X] has been paused. Reason: [reason]. Estimated resume: [time]", (c) display the pause status on the public tournament page and live stream overlay (MOD-13). | 🟠 P1 |
| FR-09-018 | The system **shall** allow Referees to resume a paused match (returning it to IN_PROGRESS) or void the match. Resuming sends a "Match [X] is resuming now" notification to all teams. | 🟠 P1 |
| FR-09-019 | All pause events **shall** be logged in the match history: who called the pause, the reason, the duration of the pause, and who resumed/voided. | 🟠 P1 |

### 9.4.4 Match Voiding & Rematch

| ID | Requirement | Priority |
|----|------------|---------|
| FR-09-020 | The system **shall** allow Tournament Directors to **void a match** — declaring it null and void with no results counted. Voiding a match requires a mandatory reason (min 20 characters). | 🟠 P1 |
| FR-09-021 | When a match is voided, the system **shall** offer the Tournament Director the option to schedule a **rematch**: a new match entry is created with the same team assignments, scheduled at a new time specified by the director. | 🟠 P1 |
| FR-09-022 | Voided matches **shall** be visible in the tournament history with a "VOID" status badge and the voiding reason displayed. No results from voided matches shall count toward the leaderboard. | 🟠 P1 |

### 9.4.5 Disqualification Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-09-023 | The system **shall** allow Tournament Directors and Referees to disqualify a team from a specific match or from the entire tournament. Disqualification requires: (a) selecting the scope (this match / all remaining matches / entire tournament), (b) selecting a disqualification reason from a predefined list: ["Cheating / hacking", "Account sharing", "UID mismatch", "Code of conduct violation", "Unauthorized software", "Other"], (c) entering detailed notes. | 🟠 P1 |
| FR-09-024 | When a team is disqualified, the system **shall**: (a) remove them from affected match slots (marking the slot as DISQUALIFIED), (b) send a disqualification notification to the Team Captain with the reason, (c) update the leaderboard to reflect the disqualification, (d) log the disqualification in the audit trail, (e) flag the disqualified team's entry in the public results as "DQ." | 🟠 P1 |
| FR-09-025 | Tournament-level disqualification **shall** trigger a prize pool recalculation — any prize the disqualified team would have earned is returned to the prize pool and redistributed to the next eligible team in the standings. | 🟡 P2 |

### 9.4.6 Player-Facing Match Day Experience

| ID | Requirement | Priority |
|----|------------|---------|
| FR-09-026 | The system **shall** provide players with a **Match Day Dashboard** that displays: (a) current tournament status, (b) their team's check-in status, (c) upcoming match details (time, slot, match number), (d) live match status (lobby open / in progress / paused / completed), (e) credential card (when released, per MOD-08), (f) current leaderboard standing. | 🔴 P0 |
| FR-09-027 | The Match Day Dashboard **shall** update in real time using WebSocket connections — players see status changes (lobby open, in progress, paused, completed) without refreshing the page. | 🔴 P0 |
| FR-09-028 | The system **shall** allow Team Captains to mark their substitute player as **active for a specific match** from the Match Day Dashboard. Activating a substitute is subject to: (a) the tournament allowing substitutes, (b) the match not yet being IN_PROGRESS, (c) a maximum of N substitute activations per tournament (configurable by organizer). | 🟠 P1 |

### 9.4.7 Substitute Activation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-09-029 | When a substitute is activated for a match, the system **shall**: (a) update the match slot to reflect the substitute player (not the original player), (b) update the room credential delivery list so the substitute (not the replaced player) receives credentials, (c) notify the organizer/referee of the substitution, (d) log the substitution in the match record. | 🟠 P1 |
| FR-09-030 | The system **shall** enforce a **substitution window** — substitutions can only be requested before the match status reaches IN_PROGRESS. Substitution requests during or after an in-progress match are rejected. | 🟠 P1 |

---

## 9.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-09-001 | Check-in is team-level, not player-level. Only the Team Captain can check in their team. If the captain is unavailable, the Tournament Director can check in the team manually. |
| BR-09-002 | The check-in deadline must be at least 15 minutes before the first match start time. The system enforces this during tournament configuration. |
| BR-09-003 | A team that fails to check in for the tournament-level check-in is marked as no-show for ALL their matches (not just Match 1). |
| BR-09-004 | Match-level check-in (if enabled) takes precedence over tournament-level check-in status. A team that checked in for the tournament but fails match-level check-in is marked as no-show for that specific match only. |
| BR-09-005 | Technical pauses that exceed 30 minutes require Tournament Director approval to continue. After 60 minutes, the match must either be resumed or voided. |
| BR-09-006 | A referee can disqualify a team during a match (for in-match violations), but the disqualification must be confirmed by a Tournament Director before it is finalized. |
| BR-09-007 | Disqualification reasons and notes are visible on the public tournament results page. Teams can request their disqualification reason through the dispute module (MOD-20). |

---

## 9.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-09-001 | The tournament-level check-in dashboard must use a visual grid of team cards (one card per team) that flip from red to green when checked in — giving the director an instant visual sense of attendance completeness. |
| UX-09-002 | The Match Control Panel must be designed for speed of use under pressure — all primary actions (Open Lobby, Mark In Progress, Submit Results) must be reachable within 1–2 clicks from the panel without scrolling. |
| UX-09-003 | Match status changes (lobby open, in progress, paused, completed) must be broadcast to all connected clients within 2 seconds via WebSocket updates — no page refresh required. |
| UX-09-004 | Technical pause declaration must be a modal (not a new page) with pre-populated reason options to minimize the time a referee spends off-task during a live event. |
| UX-09-005 | The Match Day Dashboard for players must have a mobile-first design with the most important information (next match time, slot number, match status) in the visible area above the fold without scrolling on a standard mobile screen (375×667px). |
| UX-09-006 | Disqualification must have a two-step confirmation: (1) select scope and reason, (2) review summary screen with a red "Confirm Disqualification" button — preventing accidental disqualifications during high-pressure moments. |
| UX-09-007 | The no-show management interface must display available waitlisted teams beside each vacant slot with a one-click "Promote to Slot" action for each. |

---

## 9.7 Data Requirements

### 9.7.1 TeamCheckins Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `checkin_id` | UUID | PK | Unique check-in record |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `registration_id` | UUID | FK → tournament_registrations | Team registration |
| `team_id` | UUID | FK → teams | Team |
| `checkin_type` | ENUM | NOT NULL | 'tournament','match' |
| `match_id` | UUID | FK → matches, NULLABLE | Match (for match-level checkin) |
| `status` | ENUM | NOT NULL | 'pending','checked_in','no_show','excused','manual' |
| `checked_in_by` | UUID | FK → users | Who performed check-in |
| `checked_in_at` | TIMESTAMP | NULLABLE | Check-in timestamp |
| `is_manual` | BOOLEAN | DEFAULT FALSE | Whether manually checked in by staff |
| `manual_note` | TEXT | NULLABLE | Note for manual check-ins |
| `no_show_marked_by` | UUID | FK → users, NULLABLE | Staff who marked no-show |
| `no_show_marked_at` | TIMESTAMP | NULLABLE | No-show timestamp |

### 9.7.2 MatchEvents Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `event_id` | UUID | PK | Unique event ID |
| `match_id` | UUID | FK → matches | Match |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `event_type` | ENUM | NOT NULL | 'lobby_opened','match_started','match_paused','match_resumed','match_completed','match_voided','result_submitted','result_verified','team_disqualified','substitution_activated','delay_announced','note_added' |
| `triggered_by` | UUID | FK → users | Who triggered the event |
| `event_data` | JSONB | NULLABLE | Event-specific data (reason, notes, etc.) |
| `created_at` | TIMESTAMP | NOT NULL | Event timestamp |

### 9.7.3 Disqualifications Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `dq_id` | UUID | PK | Disqualification ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `registration_id` | UUID | FK → tournament_registrations | Affected registration |
| `team_id` | UUID | FK → teams | Affected team |
| `match_id` | UUID | FK → matches, NULLABLE | Null if tournament-level DQ |
| `scope` | ENUM | NOT NULL | 'match','remaining_matches','tournament' |
| `reason_code` | VARCHAR(50) | NOT NULL | Predefined reason code |
| `reason_detail` | TEXT | NOT NULL | Detailed description |
| `requested_by` | UUID | FK → users | Who requested DQ |
| `confirmed_by` | UUID | FK → users, NULLABLE | Tournament Director confirmation |
| `confirmed_at` | TIMESTAMP | NULLABLE | Confirmation timestamp |
| `status` | ENUM | DEFAULT 'pending' | 'pending','confirmed','overturned' |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

### 9.7.4 TechnicalPauses Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `pause_id` | UUID | PK | Pause record ID |
| `match_id` | UUID | FK → matches | Paused match |
| `reason_code` | VARCHAR(50) | NOT NULL | Predefined reason code |
| `reason_detail` | TEXT | NULLABLE | Additional details |
| `estimated_resume_at` | TIMESTAMP | NULLABLE | Estimated resume time |
| `paused_by` | UUID | FK → users | Who called the pause |
| `paused_at` | TIMESTAMP | NOT NULL | Pause start time |
| `resumed_by` | UUID | FK → users, NULLABLE | Who resumed |
| `resumed_at` | TIMESTAMP | NULLABLE | Actual resume time |
| `duration_minutes` | SMALLINT | NULLABLE | Total pause duration |
| `outcome` | ENUM | NULLABLE | 'resumed','voided','director_extended' |

---

## 9.8 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Team Captain checks in but then immediately withdraws | System marks the slot as vacant and prompts the director to fill it from the waitlist; the captain's withdrawal after check-in is logged for audit |
| Referee accidentally marks match as "In Progress" before all teams join the room | Referee can call a Technical Pause immediately; system reverts flow gracefully; the IN_PROGRESS timestamp is corrected when the match actually starts |
| No teams are left to fill a vacant slot from the waitlist | System alerts the director and offers two options: (a) run the match with a bye slot, (b) cancel this specific match only |
| WebSocket connection drops for a player during an in-progress match | Player reconnects and receives the last known match state on reconnect; no data is lost; system shows the last update time |
| Substitute is activated, then original player reconnects and wants to play | System blocks the re-substitution (substitutions are one-way once activated); director can override with a logged justification |
| Tournament Director is offline when a match needs voiding approval | The match stays in PAUSED state until an authorized staff member connects; system sends escalating notifications to all available staff |

---

## 9.9 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-09-001 | A Team Captain can check in their team with a single tap and see a confirmation within 2 seconds. | Manual QA |
| AC-09-002 | The check-in dashboard updates in real time when a team checks in — the card turns green within 3 seconds without page refresh. | Manual QA |
| AC-09-003 | Declaring a Technical Pause sends in-app notifications to all affected teams within 5 seconds. | E2E automated test |
| AC-09-004 | The Match Day Dashboard for a player on mobile loads above the fold with match status, slot number, and countdown — within 2 seconds on a 4G connection. | Lighthouse/manual audit |
| AC-09-005 | A team disqualification (scope: tournament) correctly removes them from all future unplayed matches and updates their leaderboard position to "DQ" within 10 seconds. | Automated test |
| AC-09-006 | Match status changes propagate to all connected WebSocket clients within 2 seconds of the state transition. | Load test with 500 concurrent connections |

---

---



# MODULE 10 — LIVE SCORING & POINTS ENGINE

---

## 10.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-10 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | The Live Scoring & Points Engine is the computational heart of GameVerse. It handles real-time entry of match results (placements and kills for each team), validates the data against game rules, applies the configured scoring formula to calculate points, manages score corrections, and pushes calculated results to the Leaderboard Engine (MOD-11) and OBS Overlay system (MOD-13). This module directly eliminates the manual screenshot-based scoring process that causes the majority of errors, disputes, and delays in current tournaments. |
| **Primary Users** | ROLE-05 (Referee), ROLE-04 (Tournament Director), ROLE-07 (Team Captain) |
| **Dependencies** | MOD-03, MOD-07, MOD-09, MOD-11 |
| **Estimated Complexity** | Very High |

---

## 10.2 Scoring Formula Reference

The core scoring formula used across all battle royale matches:

```
Match Points = Placement_Points[rank] + (Kills × Kill_Point_Value)

Where:
- Placement_Points[rank] = configured value for finishing position
- Kills = total kills by the team in this match (capped at kill_cap if configured)
- Kill_Point_Value = configured points per kill (e.g., 1.0)
- Kill cap applies: effective_kills = MIN(kills, kill_cap) if kill_cap is set

Total Tournament Points = SUM(Match_Points across all matches played)
```

---

## 10.3 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-10-001 | As a **Referee**, I want to enter the placement and kill count for every team in a match through a fast, intuitive form so that results are recorded accurately and quickly. | 🔴 P0 |
| US-10-002 | As a **Referee**, I want the system to automatically calculate each team's match points using the configured scoring formula so that I don't have to manually compute scores. | 🔴 P0 |
| US-10-003 | As a **Referee**, I want to attach a screenshot as evidence when submitting match results so that there is a visual record to reference in disputes. | 🟠 P1 |
| US-10-004 | As a **Tournament Director**, I want to verify submitted match results before they are published so that errors can be caught before they affect the leaderboard. | 🟠 P1 |
| US-10-005 | As a **Referee**, I want to correct a specific team's score (kills or placement) after submission if an error is discovered, with the correction being logged so that accuracy is maintained with full accountability. | 🔴 P0 |
| US-10-006 | As a **Team Captain**, I want to flag a match result for review if I believe the scores are incorrect so that I have a formal channel to dispute errors. | 🟠 P1 |
| US-10-007 | As a **Viewer**, I want to see match results update on the leaderboard and stream overlay immediately after a match ends so that the tournament feels live and exciting. | 🟠 P1 |
| US-10-008 | As a **Tournament Director**, I want to configure whether results require director verification before publishing or auto-publish after referee submission so that I can balance speed vs. oversight. | 🟠 P1 |

---

## 10.4 Functional Requirements

### 10.4.1 Result Entry Interface

| ID | Requirement | Priority |
|----|------------|---------|
| FR-10-001 | The system **shall** provide Referees with a **Result Entry Form** accessible from the Match Control Panel (MOD-09) once a match reaches RESULT_PENDING status. The form shall display all teams assigned to the match in a table layout, one row per team. | 🔴 P0 |
| FR-10-002 | The Result Entry Form **shall** contain the following input fields for each team row: (a) **Placement** — a numeric input OR a drag-to-rank interface where teams are ordered from 1st to last, (b) **Kills** — a numeric input (0 to 99), (c) **Damage Dealt** (optional, game-dependent field — configurable per game). | 🔴 P0 |
| FR-10-003 | The system **shall** implement a **drag-to-rank placement entry mode** as an alternative to numeric placement input. In this mode, team rows are draggable — the referee arranges the teams from top (1st place) to bottom (last place) by dragging. Position numbers are automatically assigned based on drag order. | 🟠 P1 |
| FR-10-004 | The system **shall** perform real-time validation as data is entered, before form submission: (a) Placements must be unique — no two teams can share the same placement, (b) Placements must form a complete sequence from 1 to N (no gaps, no duplicates), (c) Kills must be between 0 and the game's maximum theoretical kills per match, (d) For games with a maximum kill count per match (e.g., BGMI: max 100 kills total across all teams), the system warns if total kills exceed this threshold. | 🔴 P0 |
| FR-10-005 | The system **shall** display a **live score preview panel** alongside the entry form that shows — in real time as the referee types — the calculated points for each team based on the current inputs. This allows the referee to verify calculations before submitting. | 🔴 P0 |
| FR-10-006 | The system **shall** allow Referees to upload one or more **evidence screenshots** (JPG/PNG/WebP, max 5MB each, max 3 screenshots per match) when submitting results. The screenshot upload is optional but strongly encouraged. | 🟠 P1 |
| FR-10-007 | The system **shall** support a **quick-entry mode** for experienced referees — a compact table where the referee can tab through fields (placement → kills → placement → kills...) without using the mouse, optimized for speed. | 🟡 P2 |
| FR-10-008 | The Result Entry Form **shall** display the scoring configuration for the current match at the top: placement points table and kill point value. This serves as a reference for the referee during entry. | 🟠 P1 |

### 10.4.2 Points Calculation Engine

| ID | Requirement | Priority |
|----|------------|---------|
| FR-10-009 | Upon form submission, the system **shall** execute the points calculation engine synchronously (within the submission request) for all teams in the match. The calculation must complete within 500ms. | 🔴 P0 |
| FR-10-010 | The points calculation engine **shall** apply the following rules in sequence: (1) Look up the placement points for each team's rank from the tournament's scoring template, (2) Apply kill cap: `effective_kills = MIN(raw_kills, kill_cap)` if a kill cap is configured, (3) Calculate kill points: `kill_points = effective_kills × kill_point_value`, (4) Calculate total match points: `total = placement_points + kill_points`, (5) Apply any configured bonus rules (first blood, wipe bonus, etc.). | 🔴 P0 |
| FR-10-011 | The calculation engine **shall** store both raw values AND calculated values for each team's match result: raw kills, effective kills (after kill cap), placement, placement points, kill points, bonus points, and total match points — all stored separately to allow audit and recalculation. | 🔴 P0 |
| FR-10-012 | The system **shall** support **partial result entry** for matches — if the match is still in progress and the referee wants to record early eliminations, the form can be saved as a "draft result" without triggering leaderboard updates. Draft results are converted to final results upon match completion. | 🟡 P2 |

### 10.4.3 Result Verification Workflow

| ID | Requirement | Priority |
|----|------------|---------|
| FR-10-013 | The system **shall** support two result publication modes, configurable per tournament: (a) **Auto-Publish** — results are published to the leaderboard immediately upon referee submission with no additional verification step, (b) **Director-Verify** — results are held in a "pending verification" state until a Tournament Director approves them. | 🟠 P1 |
| FR-10-014 | In **Director-Verify** mode, the system **shall** notify the Tournament Director via in-app notification when new results are pending verification. The notification includes: match number, round, and a direct link to the verification screen. | 🟠 P1 |
| FR-10-015 | The **Result Verification Screen** for Tournament Directors **shall** display: the submitted results in a table, the uploaded evidence screenshots (expandable), the calculated points preview, any flags (unusual kill counts, etc.), and two actions: "Approve & Publish" or "Request Correction." | 🟠 P1 |
| FR-10-016 | When a Tournament Director approves results, the system **shall** publish results within 3 seconds: trigger leaderboard recalculation (MOD-11), push updates to OBS overlay (MOD-13), and send a result notification to all teams in the match. | 🔴 P0 |

### 10.4.4 Score Corrections

| ID | Requirement | Priority |
|----|------------|---------|
| FR-10-017 | The system **shall** allow Tournament Directors to edit any team's match result (placement or kills) after publication. All edits must include: a mandatory correction reason (min 10 chars), the corrector's user ID, and a timestamp. | 🔴 P0 |
| FR-10-018 | When a match result is corrected, the system **shall**: (a) create an immutable correction log entry with before/after values, (b) recalculate the team's match points with the corrected values, (c) trigger a full leaderboard recalculation for the tournament, (d) push updated standings to OBS overlays, (e) notify all affected teams of the correction. | 🔴 P0 |
| FR-10-019 | The system **shall** maintain a **Score Correction Log** per tournament showing all corrections made: which match, which team, which field was changed, old value, new value, reason, and who made the correction. This log is accessible to organizers and is part of the public audit trail. | 🟠 P1 |
| FR-10-020 | The system **shall** limit score corrections to Tournament Directors and above. Referees can flag a result for correction but cannot directly edit published results. | 🔴 P0 |

### 10.4.5 Team Result Dispute (Player Side)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-10-021 | The system **shall** allow Team Captains to **flag a match result for review** within 30 minutes of result publication. Flagging requires: (a) selecting which team's data they believe is wrong (can only flag their own team), (b) entering what they believe the correct value is, (c) providing evidence (screenshot upload, optional). | 🟠 P1 |
| FR-10-022 | When a result is flagged, the Tournament Director is notified immediately. The flag is visible on the result entry and verification screens with a "⚠️ Disputed" badge. The Tournament Director resolves disputes through MOD-20 (Dispute Resolution). | 🟠 P1 |
| FR-10-023 | The system **shall** enforce a **dispute window** — the 30-minute period after result publication during which teams can raise a dispute. After the window closes, dispute submission is blocked (the team must contact the organizer directly). | 🟠 P1 |

### 10.4.6 Automated Anomaly Detection

| ID | Requirement | Priority |
|----|------------|---------|
| FR-10-024 | The system **shall** automatically flag result submissions that contain statistical anomalies for organizer review: (a) A single team has kills > 50% of all kills in the match (statistically unusual), (b) Total kills across all teams exceeds the theoretical maximum for the map/match type, (c) A team's submitted kills is significantly higher than their historical average (> 3× average), (d) First-place team has 0 kills (unusual but possible — plagged for awareness, not blocked). | 🟡 P2 |
| FR-10-025 | Anomaly flags **shall** be displayed as warning indicators (not errors) on the verification screen. The director can dismiss the flag and proceed with publication. | 🟡 P2 |

---

## 10.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-10-001 | Results cannot be submitted for a match that is not in IN_PROGRESS or COMPLETED state. The result entry form is only accessible when the match status is appropriate. |
| BR-10-002 | Each team in a match must have a unique placement. The system enforces uniqueness — it is not possible to submit results where two teams share the same rank. |
| BR-10-003 | Once a tournament is marked COMPLETED, no further score corrections are permitted. A locked tournament's results are immutable. Corrections after completion require Super Admin intervention. |
| BR-10-004 | The dispute window (30 minutes) cannot be extended by team captains. Only Tournament Directors can re-open a dispute after the window closes, and only through the formal dispute module (MOD-20). |
| BR-10-005 | In Auto-Publish mode, results are published immediately but can still be corrected by the Tournament Director. The leaderboard always reflects the most recently corrected version. |
| BR-10-006 | Bonus rules (if configured) are applied automatically by the engine and cannot be manually overridden. If a bonus rule applies (e.g., first blood), the engine adds the bonus automatically. If the organizer believes the bonus was incorrectly applied, they must adjust the result data, which will trigger recalculation. |

---

## 10.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-10-001 | The Result Entry Form must be designed to be completed in under 3 minutes for a 16-team match. Tab order must flow logically through placement then kills for each team. |
| UX-10-002 | The placement input must support direct number entry AND auto-incrementing (clicking "+" to increment placement) for fast entry. Numbers entered out of order must trigger immediate inline validation. |
| UX-10-003 | The live score preview panel must update within 200ms of each keystroke — ensuring the referee sees calculated points update as they type. |
| UX-10-004 | Evidence screenshot upload must support drag-and-drop onto the form field. A thumbnail preview of uploaded images must be displayed immediately after upload. |
| UX-10-005 | The "Approve & Publish" button on the verification screen must be green and prominent. The "Request Correction" must be a secondary action to prevent misclicks. |
| UX-10-006 | Score corrections must show a clear before/after comparison: "[Old Value] → [New Value]" in the correction form to ensure the director confirms they are changing the right values. |
| UX-10-007 | The dispute flag button for Team Captains must only appear in the post-match results view (not during the match) and should display the remaining dispute window time: "Dispute available for next 22 minutes." |

---

## 10.7 Data Requirements

### 10.7.1 MatchResults Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `result_id` | UUID | PK | Unique result ID |
| `match_id` | UUID | FK → matches, UNIQUE | One result set per match |
| `tournament_id` | UUID | FK → tournaments | Tournament reference |
| `submission_status` | ENUM | NOT NULL | 'draft','submitted','pending_verification','published','corrected' |
| `submitted_by` | UUID | FK → users | Referee who submitted |
| `submitted_at` | TIMESTAMP | NULLABLE | Submission timestamp |
| `verified_by` | UUID | FK → users, NULLABLE | Who verified |
| `verified_at` | TIMESTAMP | NULLABLE | Verification timestamp |
| `published_at` | TIMESTAMP | NULLABLE | Publication timestamp |
| `evidence_urls` | JSONB | NULLABLE | Array of screenshot CDN URLs |
| `is_disputed` | BOOLEAN | DEFAULT FALSE | Dispute flag |
| `dispute_deadline` | TIMESTAMP | NULLABLE | When dispute window closes |
| `total_kills_in_match` | INTEGER | NULLABLE | Sum of all team kills (for anomaly detection) |
| `anomaly_flags` | JSONB | NULLABLE | Array of detected anomalies |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 10.7.2 TeamMatchResults Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `team_result_id` | UUID | PK | Unique team result ID |
| `result_id` | UUID | FK → match_results | Parent result set |
| `match_id` | UUID | FK → matches | Match |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `registration_id` | UUID | FK → tournament_registrations | Team registration |
| `team_id` | UUID | FK → teams | Team |
| `slot_id` | UUID | FK → match_slots | Match slot |
| `placement` | SMALLINT | NOT NULL | Final rank (1st, 2nd, ...) |
| `raw_kills` | SMALLINT | NOT NULL, DEFAULT 0 | Kills as entered |
| `effective_kills` | SMALLINT | NOT NULL, DEFAULT 0 | Kills after kill cap |
| `damage_dealt` | INTEGER | NULLABLE | Damage (if tracked) |
| `placement_points` | DECIMAL(8,2) | NOT NULL | Points from placement |
| `kill_points` | DECIMAL(8,2) | NOT NULL | Points from kills |
| `bonus_points` | DECIMAL(8,2) | DEFAULT 0 | Bonus rule points |
| `total_match_points` | DECIMAL(8,2) | NOT NULL | Placement + kill + bonus |
| `is_disqualified` | BOOLEAN | DEFAULT FALSE | DQ flag |
| `is_disputed` | BOOLEAN | DEFAULT FALSE | Dispute flag |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 10.7.3 ScoreCorrections Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `correction_id` | UUID | PK | Unique correction ID |
| `team_result_id` | UUID | FK → team_match_results | Corrected result |
| `match_id` | UUID | FK → matches | Match |
| `field_corrected` | ENUM | NOT NULL | 'placement','raw_kills','damage_dealt' |
| `old_value` | DECIMAL(10,2) | NOT NULL | Previous value |
| `new_value` | DECIMAL(10,2) | NOT NULL | Corrected value |
| `correction_reason` | TEXT | NOT NULL | Mandatory reason |
| `corrected_by` | UUID | FK → users | Who made correction |
| `corrected_at` | TIMESTAMP | NOT NULL | Correction timestamp |
| `recalculation_triggered_at` | TIMESTAMP | NULLABLE | When leaderboard was recalculated |

### 10.7.4 ResultDisputes Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `dispute_id` | UUID | PK | Dispute ID |
| `team_result_id` | UUID | FK → team_match_results | Disputed result |
| `match_id` | UUID | FK → matches | Match |
| `raised_by` | UUID | FK → users | Team Captain |
| `team_id` | UUID | FK → teams | Disputing team |
| `disputed_field` | ENUM | NOT NULL | 'placement','kills','damage' |
| `claimed_value` | DECIMAL(10,2) | NOT NULL | What captain claims it should be |
| `evidence_url` | TEXT | NULLABLE | Screenshot evidence |
| `description` | TEXT | NULLABLE | Captain's explanation |
| `status` | ENUM | DEFAULT 'open' | 'open','reviewing','resolved_corrected','resolved_no_change','dismissed' |
| `resolved_by` | UUID | FK → users, NULLABLE | Who resolved |
| `resolution_note` | TEXT | NULLABLE | Resolution explanation |
| `created_at` | TIMESTAMP | NOT NULL | Dispute submission time |
| `resolved_at` | TIMESTAMP | NULLABLE | Resolution timestamp |

---

## 10.8 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Referee submits results with a duplicate placement (two teams marked 3rd) | System rejects submission with inline validation error highlighting both conflicting rows: "Placement 3 is assigned to two teams. Each team must have a unique placement." |
| Referee submits 0 kills for all teams | System accepts (theoretically possible — no kills match) but flags an anomaly: "Unusual: No kills recorded in this match. Please confirm." |
| Tournament Director corrects a score after leaderboard has been used to generate finals bracket | System corrects the match result and recalculates cumulative points; if the bracket advancement is affected, it alerts the director: "This correction changes the advancement from [Team A] to [Team B]. Manual bracket adjustment required." |
| Team Captain raises a dispute but provides no evidence screenshot | Dispute is still accepted; evidence is optional. The system notes "No evidence provided" on the dispute record. |
| Automatic leaderboard recalculation (triggered by correction) takes longer than 3 seconds | System shows a "Recalculating standings..." spinner on the leaderboard; intermediate state is not published until recalculation is complete |
| Referee loses internet connection mid-result entry | Draft auto-save every 30 seconds preserves partial data; upon reconnection, referee sees the partially filled form restored |

---

## 10.9 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-10-001 | Points calculation for a 16-team match executes within 500ms of form submission. | Performance test |
| AC-10-002 | Submitting results with a duplicate placement returns a validation error before the form submits (client-side validation). | Automated test |
| AC-10-003 | Live score preview updates within 200ms when the referee changes a kill count value. | Manual QA (timing) |
| AC-10-004 | In Auto-Publish mode, published results trigger a leaderboard update that is visible to connected clients within 3 seconds. | E2E automated test |
| AC-10-005 | A score correction changes the team's cumulative tournament points and the updated leaderboard is propagated to all connected clients within 5 seconds. | E2E automated test |
| AC-10-006 | The dispute window closes exactly 30 minutes after result publication, blocking further dispute submissions (returns 403 with message "Dispute window has closed"). | Automated test |

---

---



# MODULE 16 — PRIZE POOL & PAYMENT MANAGEMENT

---

## 16.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-16 |
| **Priority** | 🟠 P1 — High |
| **Description** | Manages the complete financial lifecycle of a tournament — collecting entry fees into escrow, holding funds securely during the tournament, calculating prize amounts based on final standings, verifying winner identity, distributing prize money to winners via UPI/bank transfer, managing refunds, and providing financial reporting to organizers. This module is critical for building trust with both organizers and players. |
| **Primary Users** | ROLE-02 (Org Owner), ROLE-04 (Tournament Director), ROLE-07 (Team Captain) |
| **Dependencies** | MOD-01, MOD-05, MOD-06, MOD-11 |
| **Estimated Complexity** | Very High |

---

## 16.2 Financial Flow Overview

```
REGISTRATION PHASE
Team pays entry fee → Razorpay → Platform Escrow Account
                                    ↓
TOURNAMENT PHASE                    ↓ (held throughout)
Entry fees accumulate in escrow     ↓
                                    ↓
COMPLETION PHASE                    ↓
Tournament marked COMPLETE          ↓
Leaderboard locked                  ↓
Winner verification                 ↓
Prize calculation                   ↓
                                    ├── Winners → Prize Payout (UPI/Bank)
                                    └── Organizer → Net Entry Fee Collection
                                                     (Total fees - Platform fee - Prize pool)
REFUND PATHS
Registration rejected / withdrawn → Razorpay Refund → Original Payment Method
Tournament cancelled → Razorpay Refund → All Registered Teams
```

---

## 16.3 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-16-001 | As a **Tournament Director**, I want entry fees to be collected automatically through the platform so that I don't have to chase individual payments via UPI screenshots. | 🟠 P1 |
| US-16-002 | As a **Tournament Director**, I want the platform to hold collected entry fees in escrow and release them to me after the tournament is completed so that funds are secure throughout the event. | 🟠 P1 |
| US-16-003 | As a **Tournament Director**, I want the prize distribution to be calculated automatically from the final leaderboard so that I don't have to manually determine who gets paid. | 🟠 P1 |
| US-16-004 | As a **Team Captain** (winner), I want to receive my prize money directly to my UPI ID or bank account after the tournament ends so that I get paid without chasing the organizer. | 🟠 P1 |
| US-16-005 | As a **Tournament Director**, I want to initiate prize payouts to winners with a single action after the leaderboard is locked so that prize distribution is fast and documented. | 🟠 P1 |
| US-16-006 | As a **Team Captain**, I want to see the status of my prize payout (pending / processing / completed / failed) so that I know when to expect the money. | 🟠 P1 |
| US-16-007 | As an **Org Owner**, I want to see a complete financial report for each tournament — total entry fees collected, platform fees deducted, prize amounts paid out, and net earnings — so that I can track my financial performance. | 🟠 P1 |
| US-16-008 | As a **Tournament Director**, I want to manually override prize distribution (e.g., adding a bonus prize) so that I have flexibility for special circumstances. | 🟡 P2 |

---

## 16.4 Functional Requirements

### 16.4.1 Escrow Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-16-001 | The system **shall** use Razorpay's escrow or payment split API to hold all entry fee payments in a platform-controlled escrow account. Funds are not accessible to the organizer until the tournament is completed. | 🟠 P1 |
| FR-16-002 | The system **shall** display the **Tournament Escrow Balance** in real time to the Tournament Director — showing: total collected, total refunded, total remaining in escrow, estimated organizer payout (total - platform fee - prize pool), and estimated prize pool payout. | 🟠 P1 |
| FR-16-003 | The system **shall** calculate and track the **platform service fee** for each tournament: (a) Free plan: 8% of total entry fees, (b) Starter plan: 6%, (c) Pro plan: 5%, (d) Elite plan: 4%, (e) Enterprise: custom (min 2%). | 🟠 P1 |
| FR-16-004 | The system **shall** maintain a **financial ledger** for each tournament recording every transaction: entry fee payment, refund, platform fee deduction, prize payout, and organizer payout — with timestamps, amounts, and references. | 🟠 P1 |

### 16.4.2 Winner Verification

| ID | Requirement | Priority |
|----|------------|---------|
| FR-16-005 | Before initiating prize payouts, the system **shall** require Tournament Directors to **confirm the final standings** by reviewing the locked leaderboard and clicking "Confirm Winners." This action cannot be undone. | 🟠 P1 |
| FR-16-006 | The system **shall** require winning teams to have a **verified payout method** on file before prize money can be disbursed. Accepted payout methods: (a) UPI ID (primary, verified), (b) Bank account (IFSC + account number, verified). | 🟠 P1 |
| FR-16-007 | The system **shall** provide a **Winner Verification Workflow** where each prize-winning Team Captain submits their payout details (UPI ID or bank details) through the platform within a configured window (default: 7 days after tournament completion). | 🟠 P1 |
| FR-16-008 | The system **shall** validate UPI IDs by performing a UPI VPA (Virtual Payment Address) validation API call to confirm the UPI ID is active and associated with a valid bank account before recording it as a payout method. | 🟠 P1 |
| FR-16-009 | If a winning team fails to submit payout details within the configured window, their prize is held in escrow for an additional 30 days. After 30 days, the unclaimed prize is returned to the organizer's account with an administrative note. | 🟠 P1 |

### 16.4.3 Prize Payout Execution

| ID | Requirement | Priority |
|----|------------|---------|
| FR-16-010 | After winner verification is complete, the Tournament Director **shall** initiate prize payouts from the Prize Distribution Panel with a single "Initiate Payouts" action. The system generates individual payout records for each prize position. | 🟠 P1 |
| FR-16-011 | Prize payouts **shall** be executed via Razorpay Payout API (for UPI transfers) or NEFT/IMPS for bank transfers. Each payout transaction is atomic — if one payout fails, it does not affect other payouts. | 🟠 P1 |
| FR-16-012 | The system **shall** display the payout status for each winning team in real time: (a) Pending (payout not yet initiated), (b) Queued (payout in Razorpay queue), (c) Processing (Razorpay processing), (d) Completed (funds in recipient's account), (e) Failed (payout failed — requires manual retry). | 🟠 P1 |
| FR-16-013 | For failed payouts, the system **shall** notify the Tournament Director and the winning Team Captain. The director can retry the payout (with corrected payout details if needed) or mark it as "Manual Payout" (paid outside the platform). | 🟠 P1 |
| FR-16-014 | The system **shall** support **partial prize payouts** — where the organizer pays some prize positions immediately and others later. Each position's payout is independent. | 🟡 P2 |
| FR-16-015 | All completed prize payouts **shall** generate a **payment receipt** accessible by the Team Captain from their tournament history, showing: prize amount, payout method used, transaction reference, and timestamp. | 🟠 P1 |

### 16.4.4 Organizer Payout

| ID | Requirement | Priority |
|----|------------|---------|
| FR-16-016 | After all prize payouts are completed (or marked as manual), the **organizer payout** (net entry fee collection minus platform fee minus prizes) is released to the organizer's registered payout account. | 🟠 P1 |
| FR-16-017 | Organizations must complete **KYC (Know Your Customer)** verification before receiving any payouts. KYC requires: (a) PAN card number, (b) Bank account details or UPI ID, (c) GST registration (if applicable), (d) Government-issued photo ID (Aadhaar, Passport, or Driving License). | 🟠 P1 |
| FR-16-018 | The system **shall** generate a **Tournament Financial Summary** document (PDF) for each completed tournament, containing: total entry fees collected, number of registrations, platform fee deducted, prize amounts distributed (per position), and organizer net payout. This document serves as an accounting record. | 🟡 P2 |

### 16.4.5 Non-Cash Prize Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-16-019 | For tournaments with non-cash prizes (merchandise, gaming peripherals, in-game items), the system **shall** support: (a) documenting the prize items per position, (b) capturing winner shipping details (for physical items), (c) marking prizes as "dispatched" or "delivered" by the organizer. | 🟡 P2 |
| FR-16-020 | Non-cash prize management is manual from the organizer's side — the platform facilitates winner communication and delivery tracking but does not process physical goods. | 🟡 P2 |

### 16.4.6 Financial Reporting

| ID | Requirement | Priority |
|----|------------|---------|
| FR-16-021 | The system **shall** provide Org Owners with a **Financial Dashboard** showing aggregated metrics across all tournaments: total revenue (entry fees), total platform fees paid, total prizes distributed, total organizer earnings, and month-over-month trends. | 🟡 P2 |
| FR-16-022 | The system **shall** support exporting the financial ledger for any tournament as a CSV file containing all transactions. | 🟠 P1 |
| FR-16-023 | The system **shall** generate monthly financial statements for each organization, downloadable as PDF, showing all tournaments, revenues, fees, and payouts for the month. | 🟡 P2 |

---

## 16.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-16-001 | Prize pool funds (announced prize pool amount) are reserved from escrow as soon as the tournament enters REGISTRATION_OPEN state. These funds cannot be redirected to organizer payouts under any circumstances. |
| BR-16-002 | Platform fees are non-refundable even if the tournament is cancelled — unless the cancellation is initiated by the platform itself (e.g., due to org suspension). |
| BR-16-003 | A tournament cannot be marked COMPLETED if any registered team has a pending payment (entry fee not yet confirmed). All payment states must be resolved first. |
| BR-16-004 | Prize payouts are subject to TDS (Tax Deducted at Source) for amounts above ₹10,000 per winner per tournament, as per Indian tax regulations. The platform deducts TDS at the applicable rate (currently 30% for gaming winnings under Section 115BBJ) and remits to the government. Winners receive a TDS certificate. |
| BR-16-005 | Organizer payouts are subject to TDS if the organizer is an individual (not a company). Platform collects PAN to issue TDS certificates. |
| BR-16-006 | All financial data is retained for a minimum of 7 years for compliance with Indian financial regulations. |
| BR-16-007 | The maximum prize pool that can be managed through the platform without additional compliance verification is ₹5,00,000 per tournament. Higher amounts require enhanced KYC and legal review. |

---

## 16.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-16-001 | The Tournament Escrow Balance widget must use a visual breakdown: a stacked bar showing "Prize Pool Reserved" (red), "Platform Fee" (orange), "Organizer Earnings" (green) as proportions of total collected — instantly communicating the financial breakdown. |
| UX-16-002 | The Prize Distribution Panel must show each prize position as a row with: position (🥇🥈🥉), team name, prize amount, payout status, and action button. The total row at the bottom shows the sum of all prizes. |
| UX-16-003 | Winner payout details submission form must feel secure — use a shield icon, HTTPS indicator text, and reassuring copy: "Your payment details are encrypted and never shared with the tournament organizer." |
| UX-16-004 | The UPI ID validation result must appear inline within 3 seconds: green checkmark with "Valid UPI ID — [Bank Name]" or red X with "UPI ID not found. Please check and try again." |
| UX-16-005 | Financial reports must be downloadable with a single click — no complex export wizard. One "Download CSV" and one "Download PDF" button per report. |
| UX-16-006 | TDS deduction must be clearly explained to winners before they submit payout details — a collapsible "Learn about TDS" section with a simple explanation and the applicable rate. |

---

## 16.7 Data Requirements

### 16.7.1 TournamentFinancials Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `financial_id` | UUID | PK | Financial record ID |
| `tournament_id` | UUID | FK → tournaments, UNIQUE | Tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `total_entry_fees_collected` | BIGINT | DEFAULT 0 | Total in paise |
| `total_refunds_issued` | BIGINT | DEFAULT 0 | Total refunds in paise |
| `platform_fee_rate` | DECIMAL(5,2) | NOT NULL | Fee percentage |
| `platform_fee_amount` | BIGINT | DEFAULT 0 | Fee amount in paise |
| `total_prize_pool_reserved` | BIGINT | DEFAULT 0 | Prize pool in paise |
| `total_prizes_disbursed` | BIGINT | DEFAULT 0 | Distributed prizes in paise |
| `organizer_payout_amount` | BIGINT | DEFAULT 0 | Net organizer payout |
| `organizer_payout_status` | ENUM | DEFAULT 'pending' | 'pending','processing','completed','on_hold' |
| `organizer_payout_ref` | VARCHAR(100) | NULLABLE | Payout transaction reference |
| `payout_initiated_at` | TIMESTAMP | NULLABLE | When organizer payout started |
| `payout_completed_at` | TIMESTAMP | NULLABLE | When organizer payout completed |
| `winners_confirmed_at` | TIMESTAMP | NULLABLE | When director confirmed winners |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 16.7.2 PrizePayouts Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `payout_id` | UUID | PK | Payout record ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `registration_id` | UUID | FK → tournament_registrations | Winning team's registration |
| `team_id` | UUID | FK → teams | Team |
| `captain_id` | UUID | FK → users | Team Captain (payout recipient) |
| `placement` | SMALLINT | NOT NULL | Prize position (1, 2, 3...) |
| `gross_amount` | BIGINT | NOT NULL | Prize amount before TDS (paise) |
| `tds_rate` | DECIMAL(5,2) | DEFAULT 0 | TDS rate applied |
| `tds_amount` | BIGINT | DEFAULT 0 | TDS deducted (paise) |
| `net_amount` | BIGINT | NOT NULL | Amount after TDS (paise) |
| `payout_method` | ENUM | NULLABLE | 'upi','bank_transfer','manual' |
| `upi_id` | VARCHAR(100) | NULLABLE | Recipient UPI ID |
| `bank_account_ref` | UUID | NULLABLE | FK → payout_bank_accounts |
| `status` | ENUM | DEFAULT 'pending' | 'pending','verification_pending','queued','processing','completed','failed','manual' |
| `razorpay_payout_id` | VARCHAR(100) | NULLABLE | Razorpay reference |
| `failure_reason` | TEXT | NULLABLE | Failure detail |
| `initiated_at` | TIMESTAMP | NULLABLE | Payout initiation time |
| `completed_at` | TIMESTAMP | NULLABLE | Completion time |
| `receipt_url` | TEXT | NULLABLE | Generated receipt CDN URL |
| `details_submitted_at` | TIMESTAMP | NULLABLE | When winner submitted details |
| `details_deadline` | TIMESTAMP | NULLABLE | Submission deadline |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 16.7.3 FinancialTransactions Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `transaction_id` | UUID | PK | Transaction ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `transaction_type` | ENUM | NOT NULL | 'entry_fee','refund','platform_fee','prize_payout','organizer_payout','tds_deduction' |
| `amount` | BIGINT | NOT NULL | Amount in paise |
| `direction` | ENUM | NOT NULL | 'credit','debit' |
| `reference_type` | VARCHAR(30) | NOT NULL | 'registration','payout','manual' |
| `reference_id` | UUID | NOT NULL | ID of the reference record |
| `gateway_ref` | VARCHAR(100) | NULLABLE | Payment gateway reference |
| `status` | ENUM | NOT NULL | 'pending','completed','failed','reversed' |
| `notes` | TEXT | NULLABLE | Additional notes |
| `created_at` | TIMESTAMP | NOT NULL | Transaction timestamp |

### 16.7.4 OrgPayoutAccounts Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `account_id` | UUID | PK | Account record ID |
| `org_id` | UUID | FK → organizations | Organization |
| `account_type` | ENUM | NOT NULL | 'upi','bank_account' |
| `upi_id` | VARCHAR(100) | NULLABLE | UPI VPA |
| `upi_verified` | BOOLEAN | DEFAULT FALSE | UPI validation status |
| `bank_name` | VARCHAR(100) | NULLABLE | Bank name |
| `account_number_encrypted` | TEXT | NULLABLE | Encrypted account number |
| `ifsc_code` | VARCHAR(11) | NULLABLE | Bank IFSC code |
| `account_holder_name` | VARCHAR(100) | NULLABLE | Name on account |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Primary payout method |
| `kyc_verified` | BOOLEAN | DEFAULT FALSE | KYC completion status |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

---

## 16.8 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Razorpay payout API returns error for a specific winner's UPI ID | That specific payout is marked as "Failed"; Tournament Director is notified; other winners' payouts proceed unaffected; director can correct UPI ID and retry |
| Winner submits an incorrect UPI ID and payout is processed | Payout to wrong UPI ID is irreversible (standard banking); director must contact winner and resolve manually; system marks the payout as "Disputed" for tracking |
| Tournament is cancelled after 50% of prize money has been disbursed | Remaining undisbursed prize amounts are returned to escrow; already-disbursed amounts cannot be recalled; organizer's net payout is adjusted accordingly |
| Organizer tries to initiate payouts before all registrations have final results | System blocks: "Cannot initiate payouts while 3 matches have unsubmitted results. Complete all match scoring first." |
| Winning team's captain account is deleted before payout | System flags the payout as "Account Deleted — Manual Resolution Required"; a Super Admin must manually contact the winner through backup contact info |
| TDS rate changes during an ongoing tournament | TDS rate is locked at the time the tournament's prize pool is confirmed (when REGISTRATION_OPEN). Mid-tournament tax rate changes do not affect that tournament. |

---

## 16.9 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-16-001 | The Tournament Escrow Balance updates in real time within 10 seconds of a new registration payment being confirmed. | Manual QA |
| AC-16-002 | UPI ID validation returns a verified result or error within 5 seconds of submission. | Automated test |
| AC-16-003 | Prize payout to a verified UPI ID completes (funds in winner's account) within 2 hours of being initiated during business hours. | Manual QA (test environment) |
| AC-16-004 | If one prize payout fails, the remaining payouts are not affected and continue processing. | Automated test |
| AC-16-005 | The Tournament Financial Summary PDF is generated and available for download within 30 seconds of being requested. | Manual QA |
| AC-16-006 | TDS is correctly calculated (30% of prizes above ₹10,000) and the net amount in the payout record matches the gross minus TDS. | Automated unit test |
| AC-16-007 | A tournament with 0 paid registrations (free entry) can still be completed and the financial dashboard shows ₹0 across all fields. | Automated test |

---

---

## END OF PART 4

---

## Part 4 Summary

| Module | Status | Priority | Complexity |
|--------|--------|----------|-----------|
| MOD-13: OBS Overlay System | ✅ Complete | 🟠 P1 | Very High |
| MOD-14: Announcement & Notification System | ✅ Complete | 🟠 P1 | High |
| MOD-15: Live Chat & Moderation | ✅ Complete | 🟡 P2 | Medium |
| MOD-16: Prize Pool & Payment Management | ✅ Complete | 🟠 P1 | Very High |

---

## Coming in Part 5

| Module | Topic |
|--------|-------|
| **MOD-17** | Analytics & Reporting — organizer analytics, player stats, viewership data, business intelligence |
| **MOD-18** | Tournament Branding & Customization — custom pages, brand kits, tournament themes |
| **MOD-19** | Sponsor Management — sponsor tiers, brand placement, analytics reporting for sponsors |
| **MOD-20** | Audit Trail & Dispute Resolution — immutable logs, formal dispute process, evidence management |

---

> **Document:** GameVerse PRD | **Part:** 4 of 6 | **Modules Covered:** 13–16 | **Next Part:** Modules 17–20
# 📄 DOCUMENT 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)


---

## **Project:** GameVerse — Esports Tournament Operations & Live Broadcast Platform
## **Document Type:** Product Requirements Document (PRD)
## **Part:** 5 of 6 — Intelligence, Customization & Governance Modules (17–20)
## **Version:** 1.0
## **Date:** June 2025
## **Status:** Draft for Review

---

---

## TABLE OF CONTENTS — PART 5

- Module 17 — Analytics & Reporting
- Module 18 — Tournament Branding & Customization
- Module 19 — Sponsor Management
- Module 20 — Audit Trail & Dispute Resolution

---

---



# MODULE 17 — ANALYTICS & REPORTING

---

## 17.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-17 |
| **Priority** | 🟡 P2 — Medium |
| **Description** | Provides comprehensive analytics and reporting capabilities across four distinct consumer groups — organizers, players, broadcast teams, and platform administrators. Transforms raw tournament operational data into actionable insights: organizer business performance, player career statistics, broadcast viewership trends, and platform-wide health metrics. This module directly addresses the documented pain point of organizers having no data to show sponsors, and players having no persistent record of their competitive career. |
| **Primary Users** | ROLE-01 (Super Admin), ROLE-02 (Org Owner), ROLE-03 (Org Admin), ROLE-04 (Tournament Director), ROLE-06 (Broadcast Producer), ROLE-07 (Team Captain), ROLE-08 (Player) |
| **Dependencies** | MOD-05, MOD-06, MOD-10, MOD-11, MOD-12, MOD-16 |
| **Estimated Complexity** | High |

---

## 17.2 Analytics Architecture

```
Data Sources
├── Tournament Events (registrations, matches, results)
├── Financial Transactions (entry fees, prizes, payouts)
├── Stream Data (viewer counts, engagement, retention)
├── User Behavior (page views, session duration, feature usage)
└── Notification Delivery (open rates, click rates)

        ↓ (event pipeline)

Analytics Processing Layer
├── Real-time aggregation (Redis / ClickHouse)
├── Batch processing (nightly jobs for historical data)
└── Pre-computed metrics cache

        ↓

Analytics Consumers
├── Organizer Dashboard (tournament & business metrics)
├── Player Profile (career statistics)
├── Broadcast Dashboard (viewership analytics)
├── Sponsor Dashboard (brand exposure metrics)
└── Super Admin Panel (platform health)
```

---

## 17.3 User Stories

### 17.3.1 Organizer Analytics

| ID | User Story | Priority |
|----|-----------|---------|
| US-17-001 | As an **Org Owner**, I want to see a dashboard showing my organization's performance across all tournaments — total participants, total prize distributed, revenue trend, and player retention — so that I can measure my org's growth. | 🟡 P2 |
| US-17-002 | As a **Tournament Director**, I want to see a post-tournament report summarizing key metrics — registration count, no-show rate, average match duration, scoring errors, disputes raised — so that I can improve my next event. | 🟡 P2 |
| US-17-003 | As an **Org Owner**, I want to see which games, formats, and prize pool sizes attract the most registrations so that I can optimize my tournament offerings. | 🟡 P2 |
| US-17-004 | As an **Org Owner**, I want to see my organization's revenue breakdown — entry fees, platform fees deducted, prizes paid, and net earnings — for any date range so that I can manage my finances accurately. | 🟡 P2 |
| US-17-005 | As a **Tournament Director**, I want to track registration funnel metrics — how many teams viewed the tournament page, started registration, completed payment, and were approved — so that I can identify drop-off points. | 🟢 P3 |

### 17.3.2 Player Analytics

| ID | User Story | Priority |
|----|-----------|---------|
| US-17-006 | As a **Player**, I want to see my complete tournament history — every tournament I've participated in, my team's placement, my kill statistics — presented as a career profile so that I can track my competitive journey. | 🟡 P2 |
| US-17-007 | As a **Team Captain**, I want to see my team's performance trends over time — improving or declining placements, kill averages by tournament — so that we can identify strengths and weaknesses. | 🟡 P2 |
| US-17-008 | As a **Player**, I want to see how I rank compared to other players on the platform within my game so that I have a competitive benchmark. | 🟢 P3 |

### 17.3.3 Broadcast Analytics

| ID | User Story | Priority |
|----|-----------|---------|
| US-17-009 | As a **Broadcast Producer**, I want to see viewership data for each stream — peak viewers, average viewers, viewer retention curve, and growth over time — so that I can demonstrate the stream's value to sponsors. | 🟡 P2 |
| US-17-010 | As a **Tournament Director**, I want to see a correlation between match results publication and viewer count spikes so that I understand what drives viewership engagement. | 🟢 P3 |

---

## 17.4 Functional Requirements

### 17.4.1 Organizer Analytics Dashboard

| ID | Requirement | Priority |
|----|------------|---------|
| FR-17-001 | The system **shall** provide Org Owners and Org Admins with an **Organization Analytics Dashboard** containing the following metric cards at the top: Total Tournaments Run (all time / this month), Total Unique Participants (players), Total Prize Money Distributed, Total Revenue (entry fees), and Organization Follower Count. | 🟡 P2 |
| FR-17-002 | The Organization Analytics Dashboard **shall** include the following time-series charts with date range selector (last 7 days / 30 days / 90 days / 12 months / all time): (a) Tournament Count Over Time (bar chart), (b) Registration Volume Over Time (line chart), (c) Revenue and Prize Pool Over Time (dual-axis line chart), (d) Unique Participants Over Time (line chart). | 🟡 P2 |
| FR-17-003 | The system **shall** provide a **Tournament Performance Comparison Table** listing all past tournaments with columns: tournament name, date, game, participants, prize pool, revenue, no-show rate, disputes raised, average match duration, stream peak viewers. The table shall be sortable by any column. | 🟡 P2 |
| FR-17-004 | The system **shall** provide a **Game Mix Analysis** — a pie or donut chart showing the distribution of tournaments by game title, and a bar chart showing average registration counts by game — helping organizers understand which games attract most participation. | 🟢 P3 |
| FR-17-005 | The system **shall** provide a **Player Retention Analysis** — showing what percentage of players who participated in Tournament N also participated in Tournament N+1 within the same organization — giving organizers a community loyalty metric. | 🟢 P3 |
| FR-17-006 | The system **shall** provide an **Entry Fee Optimization Tool** — showing a scatter plot of entry fee vs. registration count across all past tournaments — helping organizers identify the price point that maximizes participation. | 🟢 P3 |

### 17.4.2 Post-Tournament Report

| ID | Requirement | Priority |
|----|------------|---------|
| FR-17-007 | The system **shall** automatically generate a **Post-Tournament Report** within 30 minutes of a tournament being marked COMPLETED. The report is accessible from the tournament dashboard and contains: | 🟡 P2 |

**Post-Tournament Report Sections:**

| Section | Metrics Included |
|---------|-----------------|
| **Overview** | Tournament name, date, game, format, total teams, matches played, duration |
| **Registration** | Total registrations, approved, rejected, withdrawn, waitlisted, no-shows, no-show rate |
| **Financial Summary** | Total entry fees, refunds issued, platform fee, prize distributed, organizer earnings |
| **Operational Health** | Average match delay (minutes), technical pauses count, average pause duration, matches voided |
| **Scoring Integrity** | Score corrections made, disputes raised, disputes resolved (corrected vs. no-change) |
| **Player Engagement** | Total unique players, check-in rate, avg registrations per team, repeat participants % |
| **Broadcast Performance** | Stream duration, peak viewers, average viewers, viewer engagement rate |
| **Top Performers** | Top 3 teams by points, top 5 individual kill leaders |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-17-008 | The Post-Tournament Report **shall** be downloadable as a PDF with the organization's branding applied (logo, colors) — suitable for sharing with sponsors. | 🟡 P2 |
| FR-17-009 | The system **shall** calculate and display an **Organizer Health Score** (0–100) for each tournament based on weighted metrics: on-time match delivery (30%), low no-show rate (20%), low scoring error rate (20%), low dispute rate (15%), high check-in rate (15%). The score helps organizers identify operational weaknesses. | 🟢 P3 |

### 17.4.3 Player Career Analytics

| ID | Requirement | Priority |
|----|------------|---------|
| FR-17-010 | The system **shall** maintain a **Player Career Dashboard** on each player's public profile, displaying: (a) Total Tournaments Participated, (b) Best Tournament Placement, (c) Total Matches Played, (d) Career Kill Count, (e) Career Average Kills Per Match, (f) Career Chicken Dinners (match wins), (g) Most Played Game, (h) Longest Active Streak (consecutive tournaments participated). | 🟡 P2 |
| FR-17-011 | The system **shall** display a **Performance Trend Chart** — a line graph of the player's average tournament placement over their last 10 tournaments — showing whether their performance is improving or declining. | 🟡 P2 |
| FR-17-012 | The system **shall** display a **Tournament History Table** on the player profile showing all past tournaments: tournament name, date, game, team name, placement, kills, total points. | 🟡 P2 |
| FR-17-013 | The system **shall** calculate a **Player Rating** — an Elo-like rating system computed from tournament placements, normalized by tournament tier and team count. Higher-tier tournaments and larger fields yield more rating points for high placements. Rating changes after each tournament. | 🟢 P3 |
| FR-17-014 | The system **shall** display **Radar Chart Statistics** for each player showing performance dimensions: Survival (avg placement), Aggression (avg kills per match), Consistency (standard deviation of placements — lower = more consistent), Clutch (performance in finals/late rounds vs. early rounds), Activity (tournaments per month). | 🟢 P3 |

### 17.4.4 Team Analytics

| ID | Requirement | Priority |
|----|------------|---------|
| FR-17-015 | The system **shall** provide a **Team Analytics Dashboard** accessible to Team Captains showing: team's overall win rate, average placement trend, total kills across all tournaments, kill-to-death ratio (if damage tracking is enabled), match-by-match point breakdown for each tournament. | 🟡 P2 |
| FR-17-016 | The system **shall** provide a **Head-to-Head Comparison** feature — allowing a player to compare their statistics against any other player on the platform in the same game: kills, placements, and rating. | 🟢 P3 |
| FR-17-017 | The system **shall** provide **Team Roster Contribution Analysis** — showing each player's individual kill contribution as a percentage of the team's total kills, across all tournaments. This helps captains identify their key fraggers. | 🟢 P3 |

### 17.4.5 Broadcast & Viewership Analytics

| ID | Requirement | Priority |
|----|------------|---------|
| FR-17-018 | The system **shall** provide a **Stream Analytics Panel** in the Broadcast Dashboard showing: peak concurrent viewers, average concurrent viewers, total unique viewers (from YouTube/Twitch API), viewer growth rate, stream duration, and viewer retention curve (% of viewers still watching at each 15-minute interval). | 🟡 P2 |
| FR-17-019 | The system **shall** overlay **match event markers** on the viewer retention curve — showing when each match started, when results were published, and when the leaderboard updated — to visually correlate events with viewership spikes or drops. | 🟢 P3 |
| FR-17-020 | The system **shall** aggregate viewership data across all tournaments into an **Organization Stream Performance Dashboard** showing: total cumulative viewers, average tournament peak viewers, viewer growth over time, and top-performing streams by viewer count. | 🟡 P2 |

### 17.4.6 Platform Administration Analytics

| ID | Requirement | Priority |
|----|------------|---------|
| FR-17-021 | The system **shall** provide Super Admins with a **Platform Health Dashboard** showing: (a) Total active organizations, (b) Total tournaments (by state), (c) Total registered users (growth rate), (d) Total entry fees processed (GMV), (e) Platform fee revenue, (f) Active WebSocket connections, (g) System uptime percentage, (h) Average API response time (p50, p95, p99). | 🟡 P2 |
| FR-17-022 | The system **shall** provide Super Admins with a **User Acquisition Funnel**: Visitors → Registrations → First Tournament Viewed → First Registration Submitted → First Tournament Participated — with conversion rates at each step. | 🟢 P3 |
| FR-17-023 | The system **shall** provide Super Admins with a **Revenue Dashboard**: total GMV, platform fees by plan tier, MoM growth, top 10 organizations by GMV, and projected monthly recurring revenue from subscriptions. | 🟡 P2 |

---

## 17.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-17-001 | Player statistics on public profiles can be set to private by the user (in account settings). Private profiles show no statistics to other users. |
| BR-17-002 | Analytics data is computed from official, verified tournament data only. Tournaments in DRAFT or CANCELLED state are excluded from all analytics calculations. |
| BR-17-003 | Viewership data from third-party streaming platforms (YouTube, Twitch) is sourced from their public APIs and is subject to the accuracy of those APIs. The platform does not independently verify viewership numbers. |
| BR-17-004 | Financial analytics visible to Org Owners and Org Admins include entry fees, platform fees, and organizer payouts. Individual player payment details (e.g., which UPI ID a player received prize money to) are not visible to organizers. |
| BR-17-005 | The Post-Tournament Report is generated once automatically. If tournament data is subsequently corrected (score corrections, dispute resolutions), an updated report can be regenerated on demand. |

---

## 17.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-17-001 | All analytics dashboards must use a consistent date range selector component (presets: Today, Last 7 Days, Last 30 Days, Last 90 Days, Last 12 Months, All Time, Custom Range) applied globally to all charts on the page simultaneously. |
| UX-17-002 | All charts must support tooltip interactions — hovering a data point shows exact values, the date, and a contextual label. |
| UX-17-003 | The Player Career Dashboard on mobile must default to key stats (metric cards) and collapse charts behind a "View Performance Charts" expandable section to avoid overwhelming the mobile view. |
| UX-17-004 | The Post-Tournament Report PDF must use a clean, white-background design with the organization logo prominently in the header — professional enough to share with sponsors without modification. |
| UX-17-005 | All data tables in analytics (Tournament Comparison Table, Tournament History Table) must support client-side column sorting with a visual sort indicator (↑↓). |
| UX-17-006 | Analytics dashboards must render correctly on tablet screens (768px wide) — charts must reflow to full width, cards must use a 2-column grid rather than 4-column. |

---

## 17.7 Data Requirements

### 17.7.1 OrganizationAnalyticsCache Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `cache_id` | UUID | PK | Cache record ID |
| `org_id` | UUID | FK → organizations, UNIQUE | Organization |
| `total_tournaments` | INTEGER | DEFAULT 0 | All-time tournament count |
| `total_unique_participants` | INTEGER | DEFAULT 0 | All-time unique players |
| `total_prize_distributed` | BIGINT | DEFAULT 0 | All-time prizes (paise) |
| `total_revenue` | BIGINT | DEFAULT 0 | All-time entry fees (paise) |
| `total_platform_fees` | BIGINT | DEFAULT 0 | All-time fees paid (paise) |
| `avg_no_show_rate` | DECIMAL(5,2) | DEFAULT 0 | Average no-show % |
| `avg_disputes_per_tournament` | DECIMAL(5,2) | DEFAULT 0 | Average disputes |
| `avg_match_delay_minutes` | DECIMAL(6,2) | DEFAULT 0 | Average delay |
| `peak_concurrent_viewers` | INTEGER | DEFAULT 0 | Highest ever viewer count |
| `total_stream_hours` | DECIMAL(10,2) | DEFAULT 0 | Cumulative stream hours |
| `last_computed_at` | TIMESTAMP | NOT NULL | Cache computation time |

### 17.7.2 PlayerCareerStats Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `career_id` | UUID | PK | Career record ID |
| `user_id` | UUID | FK → users | Player |
| `game_id` | UUID | FK → games | Game |
| `total_tournaments` | INTEGER | DEFAULT 0 | Tournaments participated |
| `total_matches` | INTEGER | DEFAULT 0 | Matches played |
| `best_tournament_placement` | SMALLINT | NULLABLE | Best finish (1=1st) |
| `total_kills` | INTEGER | DEFAULT 0 | Career kills |
| `avg_kills_per_match` | DECIMAL(6,2) | DEFAULT 0 | Average kills |
| `total_damage` | BIGINT | DEFAULT 0 | Career damage |
| `chicken_dinners` | INTEGER | DEFAULT 0 | Match wins |
| `avg_tournament_placement` | DECIMAL(6,2) | DEFAULT 0 | Average finish rank |
| `placement_std_dev` | DECIMAL(6,2) | DEFAULT 0 | Consistency measure |
| `player_rating` | INTEGER | DEFAULT 1000 | Elo-like rating |
| `rating_updated_at` | TIMESTAMP | NULLABLE | Last rating update |
| `last_active_tournament_at` | TIMESTAMP | NULLABLE | Last tournament played |
| `last_computed_at` | TIMESTAMP | NOT NULL | Cache computation time |

### 17.7.3 TournamentAnalyticsSnapshot Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `snapshot_id` | UUID | PK | Snapshot ID |
| `tournament_id` | UUID | FK → tournaments, UNIQUE | Tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `total_registrations` | INTEGER | DEFAULT 0 | All registrations |
| `approved_registrations` | INTEGER | DEFAULT 0 | Approved count |
| `rejected_registrations` | INTEGER | DEFAULT 0 | Rejected count |
| `no_show_count` | INTEGER | DEFAULT 0 | No-shows |
| `no_show_rate` | DECIMAL(5,2) | DEFAULT 0 | No-show percentage |
| `total_matches_played` | INTEGER | DEFAULT 0 | Matches completed |
| `total_matches_voided` | INTEGER | DEFAULT 0 | Voided matches |
| `avg_match_duration_minutes` | DECIMAL(6,2) | DEFAULT 0 | Average match length |
| `total_delay_minutes` | INTEGER | DEFAULT 0 | Cumulative delays |
| `technical_pauses_count` | INTEGER | DEFAULT 0 | Total pauses |
| `score_corrections_count` | INTEGER | DEFAULT 0 | Corrections made |
| `disputes_raised` | INTEGER | DEFAULT 0 | Disputes submitted |
| `disputes_resolved_corrected` | INTEGER | DEFAULT 0 | Resolved with correction |
| `stream_peak_viewers` | INTEGER | DEFAULT 0 | Peak viewers |
| `stream_avg_viewers` | INTEGER | DEFAULT 0 | Average viewers |
| `organizer_health_score` | DECIMAL(5,2) | DEFAULT 0 | 0–100 health score |
| `report_generated_at` | TIMESTAMP | NULLABLE | Report generation time |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

---

## 17.8 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Player profile is set to private | All analytics on their public profile page are hidden; org analytics that include their data as aggregate (e.g., total participants) still include them — individual attribution is hidden |
| YouTube API quota exceeded during viewership pull | System uses the last successfully pulled viewer count with a "Data delayed" indicator; retries pull after YouTube API quota resets (midnight Pacific) |
| A tournament's results are corrected after the Post-Tournament Report is generated | System flags the report as "Data Updated — Regenerate Report" and provides a one-click regenerate button; old report is archived, not deleted |
| An org with 500 tournaments requests All-Time analytics | System serves from pre-computed cache (last updated nightly); real-time computation for this scope is not triggered on demand to prevent performance issues |
| Player participates in a cancelled tournament | The tournament is excluded from all analytics calculations; does not count toward the player's tournament count or statistics |

---

## 17.9 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-17-001 | Post-Tournament Report is generated within 30 minutes of tournament completion for a 64-team, 6-round tournament. | Automated test |
| AC-17-002 | Organization Analytics Dashboard loads within 3 seconds for an org with 50 past tournaments (served from cache). | Performance test |
| AC-17-003 | Player Career Dashboard on a public profile loads within 2 seconds for a player with 100 tournament appearances. | Performance test |
| AC-17-004 | All charts on the Org Analytics Dashboard correctly filter to the selected date range within 1 second of date range change. | Manual QA |
| AC-17-005 | The Post-Tournament Report PDF generates without layout errors (no text overflow, correct logo placement, all sections populated) for a tournament with 0 stream viewers. | Manual QA |

---

---



# MODULE 18 — TOURNAMENT BRANDING & CUSTOMIZATION

---

## 18.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-18 |
| **Priority** | 🟡 P2 — Medium |
| **Description** | Enables organizations and Tournament Directors to apply cohesive visual branding across all touchpoints of their tournament — public pages, player-facing communications, OBS overlays, generated graphics (announcement posters, schedule cards, result announcements), and share cards. Transforms each tournament from a generic platform listing into a branded event that reflects the organizer's identity and professionalism. |
| **Primary Users** | ROLE-02 (Org Owner), ROLE-03 (Org Admin), ROLE-04 (Tournament Director), ROLE-06 (Broadcast Producer) |
| **Dependencies** | MOD-02, MOD-05, MOD-13 |
| **Estimated Complexity** | High |

---

## 18.2 Branding Hierarchy

```
Platform Defaults (GameVerse brand)
    ↓ (overridden by)
Organization Brand Kit
    ↓ (overridden by)
Tournament-Specific Brand Settings
    ↓ (applied to)
├── Public Tournament Page
├── OBS Overlays (MOD-13)
├── Notification Templates (MOD-14)
├── Generated Graphics
└── Player-Facing Materials
```

---

## 18.3 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-18-001 | As an **Org Owner**, I want to create a Brand Kit for my organization — with logo, colors, and fonts — so that all my tournaments automatically look on-brand without manual configuration each time. | 🟡 P2 |
| US-18-002 | As a **Tournament Director**, I want to customize the public tournament page with a banner, logo, and theme color so that it looks like a professional event page. | 🟡 P2 |
| US-18-003 | As a **Tournament Director**, I want to generate a tournament announcement poster automatically using my branding so that I can share it on Instagram and WhatsApp without using Canva. | 🟡 P2 |
| US-18-004 | As a **Tournament Director**, I want to generate a match schedule graphic showing all teams and match times in my brand style so that I can share it with participants on social media. | 🟡 P2 |
| US-18-005 | As a **Tournament Director**, I want to generate result announcement graphics for top-3 placements so that I can post professional-looking results on Instagram after each tournament. | 🟡 P2 |
| US-18-006 | As a **Broadcast Producer**, I want OBS overlays to automatically use the tournament's brand kit colors and logo so that the stream looks on-brand without manual overlay configuration. | 🟡 P2 |
| US-18-007 | As an **Org Owner**, I want to create a custom tournament landing page URL (e.g., `bgmi.hydraesports.gg`) so that my tournament has a memorable URL for marketing. | 🟢 P3 |

---

## 18.4 Functional Requirements

### 18.4.1 Organization Brand Kit

| ID | Requirement | Priority |
|----|------------|---------|
| FR-18-001 | The system **shall** provide Org Owners and Org Admins with a **Brand Kit Configuration Panel** under Organization Settings containing the following configurable elements: (a) Primary Logo (PNG/SVG with transparent background, min 400×400px), (b) Secondary Logo / Wordmark (PNG/SVG, optional), (c) Primary Color (hex picker), (d) Secondary Color (hex picker), (e) Accent Color (hex picker), (f) Primary Font (selection from curated list of 20 Google Fonts), (g) Secondary Font (optional, from same list), (h) Brand Tagline (max 60 characters). | 🟡 P2 |
| FR-18-002 | The system **shall** validate brand kit logos for: supported formats (PNG, SVG, WebP), maximum file size (5MB), and minimum dimensions (400×400px for logos). The system auto-converts uploaded PNGs to optimized WebP for CDN delivery. | 🟡 P2 |
| FR-18-003 | The system **shall** display a **Brand Preview Panel** in the Brand Kit editor showing how the brand kit looks applied to: a sample tournament page header, a sample OBS overlay strip, and a sample notification email header. The preview updates in real time as the organizer changes values. | 🟡 P2 |
| FR-18-004 | The system **shall** propagate brand kit changes to all future tournaments automatically. Existing tournament pages use the brand kit settings that were active when the tournament was created, unless the organizer explicitly applies the updated kit. | 🟡 P2 |

### 18.4.2 Tournament-Level Branding

| ID | Requirement | Priority |
|----|------------|---------|
| FR-18-005 | The system **shall** allow Tournament Directors to override org brand kit settings at the tournament level with tournament-specific branding: tournament logo, tournament banner (1280×720px recommended), tournament theme color (applied to the public page and overlays for this tournament only). | 🟡 P2 |
| FR-18-006 | The system **shall** provide a **Tournament Page Theme Selector** with the following options: (a) Use Organization Brand Kit (default), (b) Dark Theme (dark background, org colors as accents), (c) Light Theme (white background, org colors as accents), (d) Custom (full color customization). | 🟡 P2 |
| FR-18-007 | The public tournament page **shall** apply the configured theme — header background color, font family, button colors, and card styles — consistently across all sections: overview, schedule, rules, leaderboard, results. | 🟡 P2 |

### 18.4.3 Graphic Generation System

| ID | Requirement | Priority |
|----|------------|---------|
| FR-18-008 | The system **shall** provide an automated **Graphic Generation System** capable of producing the following tournament graphics on demand, applying the org/tournament brand kit: | 🟡 P2 |

**Generated Graphic Types:**

| Graphic ID | Name | Dimensions | Content |
|-----------|------|------------|---------|
| `GFX-01` | Tournament Announcement Poster | 1080×1080px | Tournament name, game logo, dates, prize pool, entry fee, registration CTA |
| `GFX-02` | Tournament Story/Banner | 1080×1920px | Vertical version of announcement poster for Instagram/WhatsApp Stories |
| `GFX-03` | Match Schedule Graphic | 1080×1350px | All matches, match times, team names by slot |
| `GFX-04` | Match Result Card (single match) | 1080×1080px | Top 3 teams for the match, their points, kills |
| `GFX-05` | Tournament Results Podium | 1080×1080px | 1st, 2nd, 3rd place teams with total points and prize money |
| `GFX-06` | Leaderboard Update Card | 1080×1350px | Current top 10 standings with points |
| `GFX-07` | Team Spotlight Card | 1080×1080px | Team logo, name, roster names, tournament stats |
| `GFX-08` | Winner Announcement | 1080×1920px | Champion team with celebration design, prize amount |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-18-009 | Graphic generation **shall** be powered by a server-side rendering system (e.g., Puppeteer/Playwright rendering HTML/CSS templates, or a canvas-based generation library). Each graphic must render within 5 seconds of the generation request. | 🟡 P2 |
| FR-18-010 | Generated graphics **shall** be stored in CDN and accessible via a shareable URL for 90 days. After 90 days, they are moved to cold storage. | 🟡 P2 |
| FR-18-011 | The system **shall** provide a **Graphic Preview** screen where the Tournament Director can see the generated graphic before downloading or sharing. They can regenerate if the data has changed (e.g., after a score correction). | 🟡 P2 |
| FR-18-012 | The system **shall** provide **one-click sharing** of generated graphics to: Instagram (via Share API), WhatsApp (via Share API), and direct download (PNG). | 🟡 P2 |
| FR-18-013 | Generated graphics **shall** include the GameVerse watermark in the bottom-right corner on Free and Starter plans. Pro plan and above can enable "Watermark-Free" graphics as a feature. | 🟡 P2 |

### 18.4.4 Custom Tournament Subdomain

| ID | Requirement | Priority |
|----|------------|---------|
| FR-18-014 | The system **shall** support **custom tournament subdomains** for Elite plan and above organizations — allowing them to configure a custom domain (e.g., `tournaments.hydraesports.gg`) that points to their GameVerse organization page via DNS CNAME configuration. | 🟢 P3 |
| FR-18-015 | The custom subdomain **shall** display the organization's branded tournament listing page — same content as `gameverse.gg/org/[slug]` but rendered with the org brand kit and without GameVerse navigation chrome. | 🟢 P3 |
| FR-18-016 | The system **shall** provide DNS setup instructions for custom subdomain configuration, requiring the org to add a CNAME record pointing to `custom.gameverse.gg`. SSL certificates shall be provisioned automatically via Let's Encrypt. | 🟢 P3 |

---

## 18.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-18-001 | The GameVerse watermark on generated graphics can only be removed on Pro plan or above. It is permanently present on Free and Starter plan graphics. |
| BR-18-002 | Custom subdomains are available only on the Elite plan. A maximum of 3 custom subdomains can be configured per organization. |
| BR-18-003 | Generated graphics that contain financial information (prize amounts) must display accurate values from the platform. Organizers cannot manually override prize amounts shown in graphics. |
| BR-18-004 | Graphic generation is rate-limited to 50 graphics per tournament to prevent abuse. Additional graphics beyond this limit require manual request. |
| BR-18-005 | All generated graphics include metadata (invisible EXIF/PNG metadata) identifying the tournament ID, generation timestamp, and platform — for authenticity verification purposes. |

---

## 18.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-18-001 | The Brand Kit editor must show a live preview split-screen — left side shows the editor controls, right side shows the brand applied to sample content — updating within 500ms of any change. |
| UX-18-002 | The graphic generation screen must show a gallery of all available graphic types with thumbnail previews of how each will look with the tournament's data, allowing one-click generation. |
| UX-18-003 | Color pickers for brand colors must support: hex code input, RGB sliders, and a palette of pre-selected gaming-appropriate colors for organizers unfamiliar with color theory. |
| UX-18-004 | Font preview must show the selected font rendered in a sample esports context: "HYDRA ESPORTS | BGMI CHAMPIONSHIP 2025" — not generic Lorem Ipsum — so organizers can judge readability. |
| UX-18-005 | Generated graphics must be viewable at full size within the platform (with zoom) before download, ensuring the organizer can verify quality before publishing on social media. |

---

## 18.7 Data Requirements

### 18.7.1 OrgBrandKits Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `brand_kit_id` | UUID | PK | Brand kit ID |
| `org_id` | UUID | FK → organizations, UNIQUE | Organization |
| `primary_logo_url` | TEXT | NULLABLE | Primary logo CDN URL |
| `secondary_logo_url` | TEXT | NULLABLE | Wordmark CDN URL |
| `primary_color` | CHAR(7) | DEFAULT '#6B48FF' | Primary hex color |
| `secondary_color` | CHAR(7) | DEFAULT '#FF4B6E' | Secondary hex color |
| `accent_color` | CHAR(7) | DEFAULT '#FFD700' | Accent hex color |
| `primary_font` | VARCHAR(50) | DEFAULT 'Rajdhani' | Google Font name |
| `secondary_font` | VARCHAR(50) | NULLABLE | Secondary Google Font |
| `brand_tagline` | VARCHAR(60) | NULLABLE | Brand tagline |
| `watermark_enabled` | BOOLEAN | DEFAULT TRUE | GameVerse watermark flag |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 18.7.2 GeneratedGraphics Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `graphic_id` | UUID | PK | Graphic ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `graphic_type` | VARCHAR(10) | NOT NULL | GFX-01 through GFX-08 |
| `cdn_url` | TEXT | NOT NULL | Generated graphic URL |
| `generation_data` | JSONB | NOT NULL | Data snapshot used for generation |
| `generated_by` | UUID | FK → users | Who requested |
| `generated_at` | TIMESTAMP | NOT NULL | Generation timestamp |
| `expires_at` | TIMESTAMP | NOT NULL | CDN expiry |
| `download_count` | INTEGER | DEFAULT 0 | Download count |
| `share_count` | INTEGER | DEFAULT 0 | Share count |

---

## 18.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-18-001 | Brand kit changes propagate to all new tournament pages created after the change within 60 seconds. | Automated test |
| AC-18-002 | Tournament Announcement Poster (GFX-01) generates within 5 seconds with correct tournament data, brand colors, and logo. | Manual QA (timed) |
| AC-18-003 | Brand Preview Panel updates within 500ms when primary color is changed using the hex input field. | Manual QA |
| AC-18-004 | Generated graphic (GFX-05 Tournament Results) contains accurate team names, points, and prize amounts matching the locked leaderboard. | Manual QA |
| AC-18-005 | Custom subdomain (Elite plan) resolves correctly to the org tournament listing page within 5 minutes of DNS propagation. | Manual QA |

---

---



# MODULE 19 — SPONSOR MANAGEMENT

---

## 19.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-19 |
| **Priority** | 🟡 P2 — Medium |
| **Description** | Enables organizations to manage sponsor relationships within the GameVerse platform — creating sponsor profiles, defining sponsorship tiers and benefits, placing sponsor logos across tournament touchpoints (public pages, overlays, generated graphics), tracking brand exposure metrics, and generating sponsor reports. Directly addresses the documented pain point of organizers losing sponsors because they couldn't provide audience data and brand placement verification. |
| **Primary Users** | ROLE-02 (Org Owner), ROLE-03 (Org Admin), ROLE-04 (Tournament Director), ROLE-10 (Sponsor Representative) |
| **Dependencies** | MOD-02, MOD-05, MOD-12, MOD-13, MOD-17, MOD-18 |
| **Estimated Complexity** | Medium |

---

## 19.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-19-001 | As an **Org Owner**, I want to add sponsors to my organization with their logo, tier, and placement settings so that their branding appears across my tournament touchpoints. | 🟡 P2 |
| US-19-002 | As a **Tournament Director**, I want to assign specific sponsors to specific tournaments so that sponsorship placement is controlled per event. | 🟡 P2 |
| US-19-003 | As a **Sponsor Representative**, I want to log into a read-only Sponsor Dashboard showing my brand's placement, estimated impressions, and event metrics so that I can verify the value of my sponsorship. | 🟡 P2 |
| US-19-004 | As an **Org Owner**, I want to generate a Sponsor Report (PDF) after each sponsored tournament showing brand placements, viewer data, and engagement metrics so that I can satisfy sponsor reporting requirements and renew deals. | 🟡 P2 |
| US-19-005 | As a **Broadcast Producer**, I want sponsor logos to appear automatically in OBS overlays based on the sponsor configuration so that I don't have to manually add sponsor graphics to OBS. | 🟡 P2 |
| US-19-006 | As an **Org Owner**, I want to configure a sponsor rotating ticker on the stream overlay so that sponsors get visible screen time during matches. | 🟡 P2 |

---

## 19.3 Functional Requirements

### 19.3.1 Sponsor Profiles

| ID | Requirement | Priority |
|----|------------|---------|
| FR-19-001 | The system **shall** allow Org Owners and Org Admins to create **Sponsor Profiles** under their organization. A Sponsor Profile contains: sponsor name, logo (PNG/SVG, transparent background, min 200×200px), sponsor tier (Title / Gold / Silver / Bronze / In-Kind), website URL, and contact email. | 🟡 P2 |
| FR-19-002 | The system **shall** support the following **Sponsorship Tiers** with defined placement priorities: | 🟡 P2 |

**Sponsorship Tier Definitions:**

| Tier | Display Name | Logo Priority | Overlay Position | Page Position | Graphic Inclusion |
|------|-------------|---------------|-----------------|---------------|------------------|
| 1 | **Title Sponsor** | Largest, most prominent | Top-left corner | Hero section | All graphics |
| 2 | **Gold Sponsor** | Large | Top-right corner | Below hero | Podium graphic only |
| 3 | **Silver Sponsor** | Medium | Bottom strip | Sponsors section | Results graphic |
| 4 | **Bronze Sponsor** | Small | Rotating ticker | Sponsors section | Not included |
| 5 | **In-Kind** | Small | Rotating ticker | Sponsors section | Not included |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-19-003 | The system **shall** allow multiple sponsors within each tier. Within a tier, logos are displayed at equal size and rotate in alphabetical order. | 🟡 P2 |
| FR-19-004 | The system **shall** support assigning specific sponsors to specific tournaments — an org may have 10 sponsors on file but only 3 assigned to a specific tournament. | 🟡 P2 |

### 19.3.2 Sponsor Placement

| ID | Requirement | Priority |
|----|------------|---------|
| FR-19-005 | The system **shall** automatically place sponsor logos across the following touchpoints based on their tier configuration: (a) Public tournament page sponsor section, (b) OBS overlays (logo strips, corner placements per tier), (c) Generated graphics (GFX-01 through GFX-08), (d) Email notification footers, (e) Stream break screens. | 🟡 P2 |
| FR-19-006 | The system **shall** add a **Sponsor Logo Strip overlay** (OVL-14, Sponsor Ticker) to OBS that rotates sponsor logos at a configurable speed (3–10 seconds per logo). The ticker is a separate overlay URL added as a browser source in OBS. | 🟡 P2 |
| FR-19-007 | The system **shall** track an **estimated impression count** for each sponsor placement — calculated as: (a) Tournament page impressions × estimated view time factor, (b) Stream viewer count × stream duration × sponsor visibility % on stream. | 🟡 P2 |
| FR-19-008 | The system **shall** support configuring sponsor placement opt-outs per tournament — e.g., a sponsor may request to be excluded from a specific tournament's graphics without removing them from the org's sponsor list. | 🟡 P2 |

### 19.3.3 Sponsor Dashboard (Read-Only Access)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-19-009 | The system **shall** support creating a **Sponsor Representative account** — a limited-access user role (ROLE-10) that can only view the Sponsor Dashboard for tournaments they are assigned to. | 🟡 P2 |
| FR-19-010 | The **Sponsor Dashboard** **shall** display: (a) Tournaments they are sponsoring (current + past), (b) Their logo placement preview (visual mockup of where their logo appears), (c) Estimated impressions by placement type (page, overlay, graphics, email), (d) Stream viewership data (peak viewers, average viewers, stream duration), (e) Tournament participation metrics (total teams, total unique players). | 🟡 P2 |
| FR-19-011 | The Sponsor Dashboard **shall** be read-only — Sponsor Representatives cannot modify any tournament or organization data. | 🟡 P2 |

### 19.3.4 Sponsor Reports

| ID | Requirement | Priority |
|----|------------|---------|
| FR-19-012 | The system **shall** generate a **Sponsor Report PDF** per tournament per sponsor containing: sponsor logo (provided by org), tournament overview, brand placement summary (with screenshots of logo in key positions), estimated impressions, viewership data, participation metrics, and the organizer's signature block. | 🟡 P2 |
| FR-19-013 | Sponsor Reports **shall** be accessible to both the Org Owner (to review before sending) and Sponsor Representatives (via their dashboard) simultaneously. | 🟡 P2 |
| FR-19-014 | The system **shall** allow Org Owners to add a **custom cover letter** (rich text, max 500 words) to the Sponsor Report before sharing it. | 🟢 P3 |

---

## 19.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-19-001 | Sponsor management features are available on Pro plan and above. Free and Starter plan organizations can add sponsors but do not get automated placement or sponsor reports. |
| BR-19-002 | Sponsor logos placed on generated graphics are the logos provided by the organizer. The platform is not responsible for verifying sponsor identity or ensuring accurate brand representation. |
| BR-19-003 | Impression estimates are approximations based on available data (page views from platform analytics, viewer counts from streaming APIs). They are clearly labeled as "Estimated Impressions" — not guaranteed reach numbers. |
| BR-19-004 | A Sponsor Representative account is created by the Org Owner, not by the sponsor directly. The sponsor receives an invitation email to create their limited-access account. |

---

## 19.5 Data Requirements

### 19.5.1 Sponsors Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `sponsor_id` | UUID | PK | Sponsor ID |
| `org_id` | UUID | FK → organizations | Owning organization |
| `name` | VARCHAR(100) | NOT NULL | Sponsor company name |
| `logo_url` | TEXT | NOT NULL | Sponsor logo CDN URL |
| `tier` | ENUM | NOT NULL | 'title','gold','silver','bronze','in_kind' |
| `website_url` | TEXT | NULLABLE | Sponsor website |
| `contact_email` | VARCHAR(255) | NULLABLE | Sponsor contact |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active flag |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

### 19.5.2 TournamentSponsors Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `tournament_sponsor_id` | UUID | PK | Record ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `sponsor_id` | UUID | FK → sponsors | Sponsor |
| `tier_override` | ENUM | NULLABLE | Override tier for this tournament |
| `placement_config` | JSONB | NULLABLE | Custom placement settings |
| `is_opted_out` | BOOLEAN | DEFAULT FALSE | Opted out of this tournament |
| `estimated_impressions` | INTEGER | DEFAULT 0 | Calculated impressions |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

### 19.5.3 SponsorReports Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `report_id` | UUID | PK | Report ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `sponsor_id` | UUID | FK → sponsors | Sponsor |
| `report_url` | TEXT | NULLABLE | Generated PDF URL |
| `cover_letter` | TEXT | NULLABLE | Custom cover letter |
| `generated_at` | TIMESTAMP | NULLABLE | Generation time |
| `shared_with_sponsor_at` | TIMESTAMP | NULLABLE | When shared |

---

## 19.6 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-19-001 | A Title Sponsor logo appears in the correct position (top-left corner) on the OVL-01 (Full Leaderboard) overlay within 5 seconds of being assigned to a tournament. | Manual QA |
| AC-19-002 | Sponsor Report PDF generates within 10 seconds with accurate viewership and impression data. | Manual QA (timed) |
| AC-19-003 | A Sponsor Representative account can log in and view the Sponsor Dashboard but cannot access any tournament settings or data modification tools. | Security test |
| AC-19-004 | Sponsor logos appear in the correct tier hierarchy on the generated GFX-01 (Announcement Poster). | Manual QA |

---

---



# MODULE 20 — AUDIT TRAIL & DISPUTE RESOLUTION

---

## 20.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-20 |
| **Priority** | 🟠 P1 — High |
| **Description** | Provides a comprehensive, immutable audit trail for all consequential platform actions and a formal dispute resolution system for competitive disagreements. This module is the accountability backbone of GameVerse — ensuring that every scoring decision, role change, payment action, and moderation event is permanently recorded and accessible for review. The dispute resolution system replaces informal WhatsApp arguments about scores with a structured, evidence-based process that protects both organizers and players. |
| **Primary Users** | ROLE-01 (Super Admin), ROLE-02 (Org Owner), ROLE-04 (Tournament Director), ROLE-05 (Referee), ROLE-07 (Team Captain) |
| **Dependencies** | MOD-01, MOD-05, MOD-09, MOD-10, MOD-16 |
| **Estimated Complexity** | High |

---

## 20.2 Audit Trail Architecture

```
Platform Actions
├── User Management (role changes, account actions)
├── Tournament Operations (state changes, staff assignments)
├── Registration Actions (approvals, rejections, corrections)
├── Match Operations (lobby, pause, void, DQ)
├── Scoring (submissions, corrections, verifications)
├── Room Credentials (entry, release, rotation, views)
├── Financial (payments, refunds, payouts)
├── Moderation (chat actions, DQ confirmations)
└── Admin Actions (Super Admin operations)
        ↓
Immutable Audit Log
(append-only, cryptographically signed entries)
        ↓
Access Layers
├── Tournament Director → Own tournament events
├── Org Owner → All org events
└── Super Admin → All platform events
```

---

## 20.3 User Stories

### 20.3.1 Audit Trail

| ID | User Story | Priority |
|----|-----------|---------|
| US-20-001 | As a **Tournament Director**, I want to see a complete, time-ordered log of every action taken in my tournament — who did what, when, and what changed — so that I have full accountability for all decisions. | 🟠 P1 |
| US-20-002 | As an **Org Owner**, I want to audit all actions taken by my staff across all tournaments so that I can review and verify operational decisions. | 🟠 P1 |
| US-20-003 | As a **Super Admin**, I want access to the complete audit log for the entire platform so that I can investigate any reported issue or policy violation. | 🟠 P1 |
| US-20-004 | As a **Team Captain**, I want to view the audit trail for my team's registration and match results — specifically any corrections made — so that I can verify the integrity of the data affecting my team. | 🟠 P1 |

### 20.3.2 Dispute Resolution

| ID | User Story | Priority |
|----|-----------|---------|
| US-20-005 | As a **Team Captain**, I want to formally raise a dispute about my team's match result through the platform so that there is a structured, documented process for resolving scoring disagreements. | 🟠 P1 |
| US-20-006 | As a **Tournament Director**, I want to receive disputes in a centralized panel, review the evidence, and issue a resolution with documented reasoning so that all dispute decisions are transparent and final. | 🟠 P1 |
| US-20-007 | As a **Team Captain**, I want to receive a formal resolution notification for my dispute — including the reason for the decision — so that I understand why the outcome was what it was. | 🟠 P1 |
| US-20-008 | As a **Super Admin**, I want to handle escalated disputes that organizers cannot resolve (e.g., dispute about the organizer's own team) so that there is an impartial authority of last resort. | 🟠 P1 |

---

## 20.4 Functional Requirements

### 20.4.1 Immutable Audit Log

| ID | Requirement | Priority |
|----|------------|---------|
| FR-20-001 | The system **shall** create an immutable audit log entry for every consequential action on the platform. Audit entries are **append-only** — they can never be edited or deleted, even by Super Admins. | 🟠 P1 |
| FR-20-002 | Each audit log entry **shall** contain: `event_id` (UUID), `event_type` (from catalog below), `actor_id` (who performed the action), `actor_role` (their role at the time), `target_type` (what was affected), `target_id` (affected entity ID), `event_data` (JSONB with before/after states and relevant context), `ip_address`, `user_agent`, and `created_at` (immutable timestamp). | 🟠 P1 |
| FR-20-003 | The system **shall** log the following event types in the audit log: | 🟠 P1 |

**Audit Event Catalog:**

| Category | Event Types |
|----------|------------|
| **User** | account_created, account_deleted, account_suspended, password_changed, 2fa_enabled, role_assigned, role_revoked, login_success, login_failed |
| **Organization** | org_created, org_updated, org_suspended, member_invited, member_removed, subscription_changed, kyc_submitted, kyc_approved |
| **Tournament** | tournament_created, tournament_published, tournament_state_changed, tournament_settings_edited, tournament_cancelled, tournament_completed, staff_assigned, staff_removed |
| **Registration** | registration_submitted, registration_approved, registration_rejected, correction_requested, correction_submitted, waitlist_promoted, registration_withdrawn |
| **Match** | lobby_opened, match_started, match_paused, match_resumed, match_voided, match_completed, delay_announced, checkin_recorded, no_show_marked, substitution_activated |
| **Scoring** | result_submitted, result_verified, result_correction_made, anomaly_flagged, dispute_raised |
| **Credentials** | credential_entered, credential_released, credential_viewed, credential_copied, credential_rotated, credential_locked, security_flag_raised |
| **Financial** | payment_received, refund_initiated, refund_completed, payout_initiated, payout_completed, payout_failed, escrow_released, platform_fee_deducted |
| **Moderation** | message_deleted, user_warned, user_muted, user_banned, disqualification_issued, disqualification_confirmed, disqualification_overturned |
| **Dispute** | dispute_created, dispute_evidence_added, dispute_under_review, dispute_resolved, dispute_escalated, dispute_dismissed |
| **Admin** | org_force_cancelled, user_force_logout, audit_log_exported, super_admin_override |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-20-004 | The system **shall** generate a **cryptographic hash** (SHA-256) of each audit log entry upon creation, and chain entries by including the previous entry's hash in the current entry's hash calculation — creating a blockchain-like tamper-evident chain. Any modification to historical entries is detectable by hash chain verification. | 🟠 P1 |
| FR-20-005 | The system **shall** provide Tournament Directors with a **Tournament Audit Log Viewer** — a filterable, searchable, paginated log of all events in their tournament. Filters: event category, actor, date range. Search: free text across event_data. | 🟠 P1 |
| FR-20-006 | The system **shall** allow Tournament Directors and Super Admins to **export the tournament audit log** as a CSV or PDF. The export includes all event types and is marked as "Official Audit Record" in the document header. | 🟠 P1 |
| FR-20-007 | Team Captains **shall** be able to view a **limited audit log** scoped to their team's registration, match results, and any corrections made to their scores. They cannot see other teams' data in the audit log. | 🟠 P1 |
| FR-20-008 | Audit logs **shall** be retained for a minimum of 5 years. Logs older than 5 years are moved to cold storage but remain accessible to Super Admins. | 🟠 P1 |

### 20.4.2 Dispute Submission

| ID | Requirement | Priority |
|----|------------|---------|
| FR-20-009 | The system **shall** provide Team Captains with the ability to **submit a formal dispute** through the platform. The dispute submission form shall collect: (a) Dispute Type (from predefined list), (b) Description (min 50 chars, max 2000 chars), (c) Evidence (screenshot upload, up to 5 images, max 10MB each), (d) Requested Resolution (what the team believes should happen), (e) Relevant match/result reference (auto-filled when disputed from the results page). | 🟠 P1 |
| FR-20-010 | Dispute Types **shall** include: (a) Incorrect Kill Count, (b) Incorrect Placement, (c) Room Credential Issue (leaked/incorrect), (d) Unauthorized Player in Lobby, (e) Technical Issue Not Addressed, (f) Disqualification Appeal, (g) Code of Conduct Violation by Another Team, (h) Organizer Conduct Complaint, (i) Other. | 🟠 P1 |
| FR-20-011 | Each dispute **shall** be assigned a unique **Dispute Reference Number** (format: `DSP-[TOURNAMENT_SHORT_CODE]-[4_DIGIT_NUMBER]`, e.g., `DSP-BGMI-0042`) upon submission. | 🟠 P1 |
| FR-20-012 | The dispute submission window **shall** be configurable per tournament (default: 30 minutes after result publication for score disputes). For conduct violations and disqualification appeals, the window is 48 hours from the triggering event. | 🟠 P1 |
| FR-20-013 | The system **shall** prevent a team from submitting more than 3 disputes per tournament to prevent abuse. Limit is per team, not per player. | 🟠 P1 |
| FR-20-014 | Upon dispute submission, the system **shall**: (a) assign a dispute ID and reference number, (b) set status to "Open," (c) notify the Tournament Director with the dispute details and a direct link to the Dispute Management Panel, (d) confirm submission to the Team Captain with their reference number. | 🟠 P1 |

### 20.4.3 Dispute Management Panel (Organizer)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-20-015 | The system **shall** provide Tournament Directors with a **Dispute Management Panel** listing all disputes for the tournament with: reference number, submitting team, dispute type, submission time, status badge, and priority level. | 🟠 P1 |
| FR-20-016 | The Dispute Management Panel **shall** automatically calculate a **priority level** for each dispute: (a) **Critical** — dispute affects the current or next match, or involves a potential DQ, (b) **High** — dispute affects leaderboard standings for advancement, (c) **Normal** — dispute about past results with no current impact. | 🟠 P1 |
| FR-20-017 | The **Dispute Detail View** **shall** show: dispute reference, team info, dispute type, description, evidence images (expandable), requested resolution, linked audit log entries for the disputed event, current match/leaderboard impact, and the resolution panel. | 🟠 P1 |
| FR-20-018 | The system **shall** allow Tournament Directors to change dispute status to: (a) **Under Review** — acknowledgment that the dispute is being examined, (b) **Pending Evidence** — requesting additional information from the disputing team, (c) **Resolved — Correction Made** — dispute upheld; score corrected, (d) **Resolved — No Change** — dispute reviewed; original result stands, (e) **Dismissed** — dispute invalid or procedurally incorrect. | 🟠 P1 |
| FR-20-019 | Every dispute resolution **shall** require the Tournament Director to enter a **Resolution Note** (min 30 chars, max 1000 chars) explaining the decision. This note is visible to the disputing team upon resolution. | 🟠 P1 |
| FR-20-020 | When a dispute is resolved, the system **shall**: (a) update the dispute status, (b) notify the disputing Team Captain with the outcome and Resolution Note, (c) if "Correction Made" — trigger the score correction workflow (MOD-10) which cascades to leaderboard recalculation, (d) log the resolution event in the audit trail. | 🟠 P1 |

### 20.4.4 Dispute Escalation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-20-021 | The system **shall** support **dispute escalation** to Super Admin in the following cases: (a) The dispute involves the organizer themselves (conflict of interest), (b) The Team Captain believes the resolution is incorrect and appeals, (c) A dispute remains unresolved for more than 24 hours during an active tournament. | 🟠 P1 |
| FR-20-022 | Escalated disputes are visible in the **Super Admin Dispute Queue** — a platform-wide panel showing all escalated disputes across all tournaments, sorted by priority and escalation time. | 🟠 P1 |
| FR-20-023 | Super Admins resolving escalated disputes **shall** have the power to: (a) override the Tournament Director's decision, (b) force a score correction, (c) issue a platform-level warning or ban to the involved org or team, (d) issue a partial or full tournament cancellation if integrity is compromised. | 🟠 P1 |
| FR-20-024 | A Team Captain may appeal a Tournament Director's dispute resolution only once. Escalated appeal resolutions by Super Admin are final and cannot be further appealed. | 🟠 P1 |

### 20.4.5 Disqualification Appeals

| ID | Requirement | Priority |
|----|------------|---------|
| FR-20-025 | The system **shall** support a **Disqualification Appeal** as a specific dispute type. A DQ appeal can be submitted within 48 hours of a disqualification being issued. | 🟠 P1 |
| FR-20-026 | A DQ appeal **shall** automatically escalate to the Org Owner level (not just Tournament Director) given the severity. If the Org Owner issued the DQ, the appeal escalates directly to Super Admin. | 🟠 P1 |
| FR-20-027 | During the review of a DQ appeal, the disqualification remains in effect (the team stays DQ'd). If the appeal is upheld, the disqualification is reversed, the team is reinstated, and the leaderboard is recalculated. | 🟠 P1 |

---

## 20.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-20-001 | Audit log entries are immutable by design. No API endpoint exists to edit or delete an audit log entry. Database-level protection (INSERT-only role) enforces this technically, not just procedurally. |
| BR-20-002 | The dispute limit (3 per team per tournament) resets if a dispute is dismissed as procedurally invalid (not on the merits). Legitimate disputes resolved on the merits (upheld or denied) count toward the limit. |
| BR-20-003 | Tournament Directors cannot resolve disputes that involve their own team's results. Such disputes are automatically escalated to the Org Owner. |
| BR-20-004 | All disqualifications require confirmation by a Tournament Director — referees can recommend a DQ but cannot finalize it unilaterally. |
| BR-20-005 | Audit log exports containing financial transaction data are subject to additional access control — only Org Owners and Super Admins can export financial audit data. Tournament Directors can export operational audit data only. |
| BR-20-006 | A resolved dispute (in any resolution state) cannot be re-opened by the Tournament Director. Re-opening requires Super Admin action and creates a new audit log entry noting the re-opening. |

---

## 20.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-20-001 | The Tournament Audit Log Viewer must render events in a chronological timeline format — each event as a card with: timestamp, actor avatar + name, event type badge (color-coded by category), and a summary sentence in plain language (not raw JSON). Example: "Priya Nair corrected Team Hydra's kills in Match 3 from 7 to 9. Reason: Screenshot review confirmed 9 kills." |
| UX-20-002 | The Dispute Management Panel must use a Kanban-style board with columns for each dispute status (Open, Under Review, Pending Evidence, Resolved, Dismissed) — giving the director a visual sense of their dispute workload. |
| UX-20-003 | Critical disputes must display a red pulsing indicator in the Tournament Director's navigation to ensure they are noticed immediately. |
| UX-20-004 | Evidence images in the Dispute Detail View must be viewable in a full-screen lightbox with zoom capability — referees need to read kill counts from in-game screenshots clearly. |
| UX-20-005 | The Resolution Note field must have a character counter and a "Plain Language Guidelines" tooltip: "Explain your decision clearly. Your note will be shown to the disputing team. Be specific about what evidence you reviewed and why you made this decision." |
| UX-20-006 | Team Captains' dispute history must show all disputes they have submitted in a simple list: reference number, tournament, type, status badge, and submitted date. Resolved disputes show the outcome (Corrected / No Change / Dismissed) and resolution note. |
| UX-20-007 | The audit event detail expansion must show the raw `event_data` JSONB in a formatted, syntax-highlighted view (not raw unformatted JSON) for staff who need to inspect technical details. |

---

## 20.7 Data Requirements

### 20.7.1 AuditLog Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `event_id` | UUID | PK | Unique event ID |
| `event_type` | VARCHAR(50) | NOT NULL | Event type from catalog |
| `event_category` | VARCHAR(30) | NOT NULL | Category (user/tournament/scoring/etc.) |
| `actor_id` | UUID | FK → users, NULLABLE | Who performed action (null = system) |
| `actor_role` | VARCHAR(30) | NULLABLE | Actor's role at time of event |
| `actor_org_id` | UUID | FK → organizations, NULLABLE | Actor's org context |
| `target_type` | VARCHAR(30) | NOT NULL | What was affected |
| `target_id` | UUID | NOT NULL | Affected entity ID |
| `tournament_id` | UUID | FK → tournaments, NULLABLE | Tournament context |
| `org_id` | UUID | FK → organizations, NULLABLE | Org context |
| `event_data` | JSONB | NOT NULL | Before/after states and context |
| `ip_address` | INET | NULLABLE | Actor's IP |
| `user_agent` | TEXT | NULLABLE | Actor's device/browser |
| `entry_hash` | CHAR(64) | NOT NULL | SHA-256 of this entry |
| `previous_hash` | CHAR(64) | NULLABLE | Hash of previous entry (chain) |
| `created_at` | TIMESTAMP | NOT NULL | Immutable creation timestamp |

### 20.7.2 Disputes Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `dispute_id` | UUID | PK | Dispute ID |
| `reference_number` | VARCHAR(20) | UNIQUE, NOT NULL | Human-readable reference |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `submitted_by` | UUID | FK → users | Team Captain |
| `team_id` | UUID | FK → teams | Disputing team |
| `dispute_type` | VARCHAR(50) | NOT NULL | Dispute type code |
| `description` | TEXT | NOT NULL | Captain's description |
| `requested_resolution` | TEXT | NULLABLE | Desired outcome |
| `evidence_urls` | JSONB | NULLABLE | Array of evidence image URLs |
| `linked_match_id` | UUID | FK → matches, NULLABLE | Relevant match |
| `linked_result_id` | UUID | FK → match_results, NULLABLE | Relevant result |
| `linked_dq_id` | UUID | FK → disqualifications, NULLABLE | If DQ appeal |
| `priority` | ENUM | DEFAULT 'normal' | 'critical','high','normal' |
| `status` | ENUM | DEFAULT 'open' | 'open','under_review','pending_evidence','resolved_corrected','resolved_no_change','dismissed','escalated' |
| `assigned_to` | UUID | FK → users, NULLABLE | Reviewing director |
| `resolution_note` | TEXT | NULLABLE | Director's decision explanation |
| `resolved_by` | UUID | FK → users, NULLABLE | Who resolved |
| `resolved_at` | TIMESTAMP | NULLABLE | Resolution timestamp |
| `is_escalated` | BOOLEAN | DEFAULT FALSE | Escalation flag |
| `escalated_at` | TIMESTAMP | NULLABLE | Escalation time |
| `escalation_reason` | TEXT | NULLABLE | Why escalated |
| `super_admin_resolution` | TEXT | NULLABLE | Super Admin's resolution note |
| `super_admin_resolved_by` | UUID | FK → users, NULLABLE | Super Admin resolver |
| `super_admin_resolved_at` | TIMESTAMP | NULLABLE | Super Admin resolution time |
| `is_appeal` | BOOLEAN | DEFAULT FALSE | Whether this is an appeal |
| `appeal_of_dispute_id` | UUID | FK → disputes, NULLABLE | Original dispute if appeal |
| `submission_count` | SMALLINT | DEFAULT 1 | Which dispute this is (1st, 2nd, 3rd) |
| `created_at` | TIMESTAMP | NOT NULL | Submission time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 20.7.3 DisputeHistory Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `history_id` | UUID | PK | History record ID |
| `dispute_id` | UUID | FK → disputes | Dispute |
| `from_status` | VARCHAR(30) | NOT NULL | Previous status |
| `to_status` | VARCHAR(30) | NOT NULL | New status |
| `changed_by` | UUID | FK → users | Who changed |
| `change_note` | TEXT | NULLABLE | Note at this transition |
| `created_at` | TIMESTAMP | NOT NULL | Change timestamp |

---

## 20.8 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Team Captain submits a dispute after the window closes | System returns a 403 with: "The dispute window for this match closed at [timestamp]. If you believe there is a serious integrity issue, please contact the organizer directly." |
| Tournament Director tries to resolve a dispute involving their own team | System blocks with: "You cannot resolve a dispute involving your own team. This dispute has been automatically escalated to the Org Owner." |
| Super Admin overrides a score, which changes tournament advancement | System recalculates leaderboard, sends notifications to all affected teams, and creates a Super Admin Override audit event with the full justification |
| Hash chain verification fails on an audit entry (indicating tampering) | System triggers a Security Alert to all Super Admins with the affected entry range; platform may be placed in read-only mode pending investigation |
| Team has already used 3 disputes but a clear referee error is discovered | Dispute limit prevents a new submission; Team Captain must contact the Tournament Director directly who can initiate a correction from their own panel without needing a formal dispute |
| A dispute is still "Open" when the tournament is marked COMPLETED | System flags the open dispute and blocks tournament COMPLETED state transition until the dispute is resolved, escalated, or the Tournament Director manually overrides with justification |

---

## 20.9 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-20-001 | Every result submission creates an audit log entry within 1 second of the action, containing the full before/after state in event_data. | Automated test |
| AC-20-002 | A Team Captain submits a dispute, and the Tournament Director receives an in-app notification within 10 seconds. | E2E automated test |
| AC-20-003 | A dispute resolved with "Correction Made" status triggers score correction and leaderboard recalculation within 30 seconds. | E2E automated test |
| AC-20-004 | Hash chain integrity verification passes on a 1000-entry audit log with no tampered entries. | Automated cryptographic test |
| AC-20-005 | Attempting to edit an audit log entry via direct database query is blocked by INSERT-only database role permissions. | Security/DB test |
| AC-20-006 | A DQ appeal escalates automatically to the Org Owner's notification queue within 5 seconds of submission. | Automated test |
| AC-20-007 | The tournament COMPLETED state transition is blocked when 2 disputes remain in "Open" status, returning a 409 conflict with the dispute reference numbers listed. | Automated test |

---

---

## END OF PART 5

---

## Part 5 Summary

| Module | Status | Priority | Complexity |
|--------|--------|----------|-----------|
| MOD-17: Analytics & Reporting | ✅ Complete | 🟡 P2 | High |
| MOD-18: Tournament Branding & Customization | ✅ Complete | 🟡 P2 | High |
| MOD-19: Sponsor Management | ✅ Complete | 🟡 P2 | Medium |
| MOD-20: Audit Trail & Dispute Resolution | ✅ Complete | 🟠 P1 | High |

---

## Coming in Part 6 (Final)

| Module | Topic |
|--------|-------|
| **MOD-21** | Esports Command Center — unified real-time dashboard combining all tournament operations into one master control interface |
| **Appendix A** | Complete Module Dependency Map |
| **Appendix B** | MVP Scope Definition — which requirements ship in V1.0 |
| **Appendix C** | Non-Functional Requirements — performance, security, scalability, compliance |
| **Appendix D** | Glossary of Terms |

---

> **Document:** GameVerse PRD | **Part:** 5 of 6 | **Modules Covered:** 17–20 | **Next Part:** Module 21 + Appendices

# 📄 DOCUMENT 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)


---

## **Project:** GameVerse — Esports Tournament Operations & Live Broadcast Platform
## **Document Type:** Product Requirements Document (PRD)
## **Part:** 6 of 6 — Command Center, Appendices & Document Completion
## **Version:** 1.0
## **Date:** June 2025
## **Status:** Draft for Review

---

---

## TABLE OF CONTENTS — PART 6

- Module 21 — Esports Command Center (Unified Dashboard)
- Appendix A — Complete Module Dependency Map
- Appendix B — MVP Scope Definition (V1.0)
- Appendix C — Non-Functional Requirements
- Appendix D — Glossary of Terms
- Document Completion Summary

---

---



# MODULE 21 — ESPORTS COMMAND CENTER (UNIFIED DASHBOARD)

---

## 21.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-21 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | The Esports Command Center is the unified real-time operational dashboard that brings together all active tournament data into a single, purpose-built interface for Tournament Directors and Referees on match day. It is the central hub from which every aspect of a live tournament is monitored and controlled — match status, check-ins, scoring, leaderboard, credentials, broadcast health, disputes, and communications — eliminating the need to switch between 5–8 separate tools. This module represents the primary value proposition of GameVerse over existing fragmented solutions. |
| **Primary Users** | ROLE-04 (Tournament Director), ROLE-05 (Referee), ROLE-02 (Org Owner) |
| **Dependencies** | All modules (MOD-01 through MOD-20) |
| **Estimated Complexity** | Very High |

---

## 21.2 The Core Problem Being Solved

> **Current Reality:** On match day, a tournament organizer simultaneously manages: WhatsApp (team communications), Google Sheets (scoring), YouTube Studio (stream), OBS (overlays), PhonePe (payment verification), a timer app (match timing), Discord (community), and sometimes a separate spreadsheet tool for the leaderboard. Context-switching between these tools causes critical delays, missed actions, and operational failures.

> **Command Center Solution:** One screen. All critical information. All critical actions. Zero context switching. A tournament director can run an entire match from check-in to results publication without leaving the Command Center interface.

---

## 21.3 Command Center Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GAMEVERSE COMMAND CENTER  │  [Tournament Name]  │  🔴 LIVE  │  [Time]  │
├──────────────┬──────────────────────────────────────────────────────────┤
│              │  TOURNAMENT STATUS BAR                                    │
│   LEFT       │  ┌─────────┬─────────┬──────────┬──────────┬──────────┐ │
│   PANEL      │  │Matches  │ Teams   │ Check-in │ Disputes │ Stream   │ │
│              │  │ 3/12    │ 61/64   │ 58/64    │ 2 Open   │ 1,240 👁 │ │
│  Navigation  │  └─────────┴─────────┴──────────┴──────────┴──────────┘ │
│  ───────────  ├──────────────────────────────────────────────────────────┤
│  📋 Overview │                                                           │
│  🏟️ Matches  │           MAIN CONTENT AREA                              │
│  ✅ Check-in  │      (changes based on left panel selection)             │
│  🎯 Scoring  │                                                           │
│  🏆 Leaderbd │                                                           │
│  📡 Broadcast│                                                           │
│  🔑 Credentials                                                          │
│  ⚠️ Disputes │                                                           │
│  📢 Announce │                                                           │
│  💰 Finance  │                                                           │
│  📋 Audit    │                                                           │
│              │                                                           │
└──────────────┴──────────────────────────────────────────────────────────┘
```

---

## 21.4 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-21-001 | As a **Tournament Director**, I want a single unified dashboard showing all critical tournament metrics at a glance so that I never have to switch between multiple tools on match day. | 🔴 P0 |
| US-21-002 | As a **Tournament Director**, I want to see the status of every match — scheduled, in lobby, in progress, results pending, completed — on one screen so that I always know the state of the tournament. | 🔴 P0 |
| US-21-003 | As a **Tournament Director**, I want to take any operational action — approve a result, resolve a dispute, send an announcement, open a lobby — directly from the Command Center without navigating away so that I can act without losing situational awareness. | 🔴 P0 |
| US-21-004 | As a **Referee**, I want a simplified version of the Command Center scoped to only my assigned matches so that I have a focused, uncluttered interface for my responsibilities. | 🔴 P0 |
| US-21-005 | As a **Tournament Director**, I want all data on the Command Center to update in real time via WebSocket so that I never see stale information during a live event. | 🔴 P0 |
| US-21-006 | As a **Tournament Director**, I want a pending actions widget that surfaces things that need my attention — unresolved disputes, unverified results, unread announcements from teams — so that nothing falls through the cracks. | 🟠 P1 |
| US-21-007 | As a **Tournament Director**, I want a timeline view of the tournament day — showing completed and upcoming matches on a visual timeline — so that I can see delays and adjust the schedule proactively. | 🟠 P1 |
| US-21-008 | As a **Tournament Director**, I want the Command Center to work on a tablet (landscape mode) so that I can use it comfortably during a live event without needing a full desktop. | 🟠 P1 |

---

## 21.5 Functional Requirements

### 21.5.1 Command Center Shell & Navigation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-001 | The system **shall** provide the Command Center as a dedicated full-screen application view — accessible from the tournament dashboard via a "Open Command Center" button. The Command Center shall open in the same browser tab (not a popup) and replace the standard platform navigation. | 🔴 P0 |
| FR-21-002 | The Command Center **shall** maintain a persistent WebSocket connection to the GameVerse real-time server for the duration of the session. All data updates (match status changes, new results, new disputes, check-in events, viewership changes) are pushed to the Command Center automatically without user action. | 🔴 P0 |
| FR-21-003 | The Command Center **shall** display a **persistent status bar** at the top of all views containing: tournament name, tournament status badge (LIVE/CHECK_IN/etc.), current server time (important for timed operations), and a connection indicator (green dot = live WebSocket, red dot = reconnecting). | 🔴 P0 |
| FR-21-004 | The Command Center **shall** implement a **left navigation panel** with sections for each operational area. Each section displays a badge when there are pending items requiring attention (e.g., "Disputes ⚠️ 2" when 2 disputes are open). | 🔴 P0 |
| FR-21-005 | The Command Center **shall** support a **Referee Mode** — a simplified view that shows only: assigned matches panel, match control for assigned matches, scoring form, and announcements. Referee Mode is automatically applied when a Referee (not Tournament Director) opens the Command Center. | 🔴 P0 |

### 21.5.2 Overview Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-006 | The **Overview Section** **shall** serve as the Command Center home screen and display the following panels simultaneously: | 🔴 P0 |

**Overview Section Panel Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  PENDING ACTIONS                        │  TOURNAMENT HEALTH     │
│  ┌─────────────────────────────────┐   │  ┌──────────────────┐  │
│  │ ⚠️ 2 results await verification │   │  │ Check-in: 58/64  │  │
│  │ ⚠️ 3 teams not checked in       │   │  │ Matches done: 3  │  │
│  │ 🔴 1 critical dispute open      │   │  │ Matches left: 9  │  │
│  │ 📢 Match 4 starts in 8 min      │   │  │ Delay: +12 min   │  │
│  └─────────────────────────────────┘   │  └──────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  MATCH STATUS GRID (all matches in current round)               │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐        │
│  │ M1 ✅  │ M2 ✅  │ M3 🟡  │ M4 ⏳  │ M5 ⏳  │ M6 ⏳  │        │
│  │COMPLT  │COMPLT  │IN PROG │LOBBY   │SCHED   │SCHED   │        │
│  └────────┴────────┴────────┴────────┴────────┴────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  LIVE LEADERBOARD (top 5)        │  STREAM STATUS              │
│  1. Hydra Esports    47pts       │  ● LIVE  │ 1,240 viewers    │
│  2. Storm Squad      43pts       │  Bitrate: 6000 kbps ✅       │
│  3. Phoenix Rising   41pts       │  FPS: 60 ✅                  │
│  4. Nexus Gaming     38pts       │  Duration: 3h 24m            │
│  5. Apex Wolves      35pts       │  OBS: Connected ✅            │
└─────────────────────────────────────────────────────────────────┘
```

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-007 | The **Pending Actions Widget** **shall** surface all items requiring Tournament Director attention, sorted by urgency: (a) Critical disputes (red), (b) Results awaiting verification (orange), (c) Teams not yet checked in (yellow), (d) Credentials not yet entered for upcoming match (yellow), (e) Upcoming match start in < 15 minutes (blue). Each item is clickable and navigates directly to the relevant section. | 🔴 P0 |
| FR-21-008 | The **Match Status Grid** **shall** show all matches in the current round as compact cards with color-coded status: green = Completed, blue = In Progress, yellow = Lobby Open, grey = Scheduled, red = Delayed/Voided. Clicking any card navigates to the Match Detail view. | 🔴 P0 |
| FR-21-009 | The **Tournament Health Panel** **shall** show: (a) Check-in rate (checked in / total confirmed teams), (b) Matches completed vs. total matches, (c) Current cumulative schedule delay in minutes, (d) Pending verifications count, (e) Open disputes count. All values update in real time. | 🔴 P0 |

### 21.5.3 Matches Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-010 | The **Matches Section** **shall** provide a comprehensive view of all tournament matches organized by round. The section shall have two sub-views: (a) **Board View** — Kanban-style columns by match status, (b) **Timeline View** — horizontal timeline showing scheduled vs. actual match times. | 🔴 P0 |
| FR-21-011 | Each match card in the Matches Section **shall** display: match number, round, status badge, scheduled time, actual start time (if started), teams in the match (team names + slot numbers), assigned referee, credential status (entered/not entered/released), and result status (pending/submitted/verified). | 🔴 P0 |
| FR-21-012 | The **Match Detail Panel** (opened by clicking a match card) **shall** show all information and controls for that match in a right-side slide-over panel without leaving the Matches Section: match info, team roster (with UIDs), lobby status, credential controls, match state controls, result entry link, and match notes. | 🔴 P0 |
| FR-21-013 | The **Timeline View** **shall** show a horizontal timeline (x-axis = time, y-axis = matches) with: scheduled start blocks (grey), actual duration blocks (blue = completed, red = delayed), and the current time cursor (vertical red line). Hover over any block shows match details tooltip. | 🟠 P1 |
| FR-21-014 | The Matches Section **shall** support quick actions accessible directly from match cards without opening the detail panel: "Open Lobby" button, "Mark Started" button, "Enter Results" button — shown contextually based on current match status. | 🔴 P0 |

### 21.5.4 Check-In Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-015 | The **Check-In Section** **shall** display a visual grid of all confirmed teams as cards — one card per team. Each card shows: team logo, team name, check-in status (green = checked in, red = not checked in, yellow = manually checked in), check-in timestamp. | 🔴 P0 |
| FR-21-016 | The Check-In Section **shall** display a prominent progress bar at the top: "58 of 64 Teams Checked In" with a visual fill. Underneath: time remaining until check-in deadline (countdown). | 🔴 P0 |
| FR-21-017 | The Check-In Section **shall** support the following bulk actions: "Remind All Unchecked In Teams" (sends notification), "Mark All Unchecked as No-Show" (with confirmation), "Export Check-In List" (CSV). | 🔴 P0 |
| FR-21-018 | Each team card in the Check-In Section **shall** support individual actions: "Manual Check In" (with note), "Mark No-Show," "View Registration Details," and "Promote from Waitlist" (for no-shown teams). | 🟠 P1 |

### 21.5.5 Scoring Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-019 | The **Scoring Section** **shall** show all matches that are in RESULT_PENDING or RESULT_SUBMITTED state, organized as a list with the oldest (most overdue) at the top. | 🔴 P0 |
| FR-21-020 | Each item in the Scoring Section **shall** show: match number, round, time since match ended, submission status (not submitted / submitted / awaiting verification), and a primary action button: "Enter Results" or "Verify Results." | 🔴 P0 |
| FR-21-021 | Clicking "Enter Results" opens the result entry form (from MOD-10) as a full-screen overlay — maintaining Command Center context. After submission, the overlay closes and the Scoring Section updates to show the new status. | 🔴 P0 |
| FR-21-022 | The Scoring Section **shall** display a **Scoring Queue Health Indicator** — a warning if results for 2+ matches are pending simultaneously, alerting the director that they may fall behind. | 🟠 P1 |

### 21.5.6 Leaderboard Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-023 | The **Leaderboard Section** **shall** display the full live tournament leaderboard — identical in data to the public leaderboard but with additional organizer-only columns: DQ status, dispute flags, manual correction flags, and advancement status. | 🔴 P0 |
| FR-21-024 | The Leaderboard Section **shall** include an **Advancement Simulator** (accessible via a "Simulate" button) — allowing the director to input hypothetical results for remaining matches and see projected final standings. This helps the director make informed decisions about format adjustments. | 🟡 P2 |
| FR-21-025 | The Leaderboard Section **shall** display group leaderboards (if group stage format) as tabs: "Group A | Group B | Group C | Overall." | 🟠 P1 |

### 21.5.7 Broadcast Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-026 | The **Broadcast Section** **shall** provide the same Broadcast Dashboard content (from MOD-12) embedded within the Command Center — stream health metrics, viewer count, OBS connection status, scene selector — as a sub-section accessible without leaving Command Center. | 🟠 P1 |
| FR-21-027 | The Broadcast Section **shall** display all configured overlay URLs with their connection status (connected / disconnected) and a quick-copy button for each URL. | 🟠 P1 |
| FR-21-028 | The Broadcast Section **shall** show a **quick scene switcher** — the top 5 configured OBS scenes as large button tiles for one-click switching without navigating to the full Broadcast Dashboard. | 🟡 P2 |

### 21.5.8 Credentials Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-029 | The **Credentials Section** **shall** show a matrix of all matches and their credential status: (a) 🔴 Not Entered, (b) 🟡 Entered, Not Released, (c) 🟢 Released, (d) 🔒 Locked, (e) 🔄 Rotated. | 🔴 P0 |
| FR-21-030 | The Credentials Section **shall** surface alerts for: (a) Credentials not entered for a match starting in < 20 minutes, (b) Credentials not released for a match that has already started, (c) Any match with a security flag (suspected leak). | 🔴 P0 |
| FR-21-031 | The Credentials Section **shall** allow credential entry and release directly from the section — clicking a "Not Entered" match card opens the credential entry modal (from MOD-08) inline. | 🔴 P0 |

### 21.5.9 Disputes Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-032 | The **Disputes Section** **shall** display all disputes for the tournament in the Kanban layout (from MOD-20), with the Command Center providing the same dispute management functionality as the standalone Dispute Management Panel. | 🟠 P1 |
| FR-21-033 | The Disputes Section **shall** display a real-time alert banner whenever a new critical dispute is submitted during a live event — "⚠️ New Critical Dispute: DSP-BGMI-0047 from Team Hydra — Incorrect Kill Count." The banner persists until the director acknowledges it. | 🟠 P1 |

### 21.5.10 Announcements Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-034 | The **Announcements Section** **shall** provide the full announcement composer (from MOD-14) embedded within the Command Center — allowing Tournament Directors to send announcements without leaving the Command Center. | 🟠 P1 |
| FR-21-035 | The Announcements Section **shall** display the announcement history for the tournament (all past announcements with delivery status) as a timeline below the composer. | 🟠 P1 |
| FR-21-036 | The Announcements Section **shall** surface **quick-send templates** as large clickable buttons above the composer: "Match Starting Soon," "Check-In Open," "Technical Pause," "Results Published," "Congratulations Winners" — pre-filling the composer on click. | 🔴 P0 |

### 21.5.11 Finance Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-037 | The **Finance Section** **shall** display a real-time financial summary for the tournament: total collected, total refunded, escrow balance, prize pool reserved, platform fee, and estimated organizer payout. | 🟠 P1 |
| FR-21-038 | The Finance Section **shall** show registration payment status for all teams — how many have confirmed payment, how many have pending payment, and any payment failures. | 🟠 P1 |
| FR-21-039 | After tournament completion, the Finance Section **shall** transform into the **Prize Distribution Panel** (from MOD-16) — showing winner payout status and allowing the director to initiate payouts. | 🟠 P1 |

### 21.5.12 Audit Section

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-040 | The **Audit Section** **shall** display the live tournament audit log — a real-time feed of all events happening in the tournament, with the most recent at the top. New events appear with a slide-in animation. | 🟠 P1 |
| FR-21-041 | The Audit Section **shall** support filtering the live feed by event category so the director can focus on specific types of activity during high-stress moments. | 🟡 P2 |

### 21.5.13 Command Center Notifications

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-042 | The Command Center **shall** display **contextual action alerts** — non-modal toast notifications that appear in the top-right corner for events requiring attention. Each toast shows: event description, affected entity, and an action button. Toasts auto-dismiss after 8 seconds but can be pinned. | 🔴 P0 |

**Command Center Toast Types:**

| Trigger | Toast Message | Action Button | Auto-Dismiss |
|---------|--------------|---------------|-------------|
| New dispute submitted | "⚠️ New Dispute: Team Hydra — Kill Count" | "Review Now" | No (pinned) |
| Result submitted by referee | "✅ Match 4 results submitted" | "Verify" | 8 seconds |
| Team checks in | "✅ Hydra Esports checked in" | None | 3 seconds |
| Credential not released (15 min before match) | "🔴 Match 5: Credentials not released!" | "Release Now" | No (pinned) |
| Stream health degraded | "⚠️ Stream bitrate dropped to 2000kbps" | "View" | 8 seconds |
| New score correction | "📝 Score corrected: Match 3, Team Storm" | "View Audit" | 8 seconds |
| Match delayed | "⏰ Match 6 delayed +20 min" | "Notify Teams" | 5 seconds |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-043 | The Command Center **shall** maintain a **Notification Tray** — a slide-out panel accessible from the top navigation bar showing all Command Center toasts from the current session, including those that were auto-dismissed. | 🟠 P1 |

### 21.5.14 Keyboard Shortcuts

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-044 | The Command Center **shall** support the following keyboard shortcuts for power users: | 🟡 P2 |

**Command Center Keyboard Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `G + O` | Go to Overview |
| `G + M` | Go to Matches |
| `G + C` | Go to Check-In |
| `G + S` | Go to Scoring |
| `G + L` | Go to Leaderboard |
| `G + D` | Go to Disputes |
| `G + A` | Go to Announcements |
| `G + K` | Go to Credentials |
| `Esc` | Close any open modal/panel |
| `M` | Add stream annotation (when in Broadcast section) |
| `?` | Show keyboard shortcuts reference |
| `Ctrl/Cmd + K` | Open command palette (quick action search) |

### 21.5.15 Command Palette

| ID | Requirement | Priority |
|----|------------|---------|
| FR-21-045 | The Command Center **shall** implement a **Command Palette** (triggered by `Ctrl/Cmd + K`) — a search-driven quick action interface similar to Spotlight or VS Code's command palette. The director can type any action ("open match 4 lobby," "send announcement," "verify result," "check in team") and the system surfaces the relevant action and executes it with confirmation. | 🟡 P2 |
| FR-21-046 | The Command Palette **shall** support fuzzy search across: (a) navigation items, (b) match names and numbers, (c) team names, (d) common actions. Results appear within 100ms of typing. | 🟡 P2 |

---

## 21.6 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-21-001 | The Command Center is only accessible during tournaments that are in CHECK_IN, LIVE, or COMPLETED state. Accessing the Command Center for a DRAFT or PUBLISHED tournament redirects to the standard tournament management panel. |
| BR-21-002 | All actions taken from within the Command Center are subject to the same role-based permissions as the same actions taken from the standard interface. The Command Center is a UI consolidation, not a permission elevation. |
| BR-21-003 | The Command Center does not replace individual module pages — it provides a unified view and common actions. Complex workflows (full dispute management, detailed analytics, branding configuration) open in context-preserving overlays or link out to full pages. |
| BR-21-004 | Command Center sessions are time-limited to 12 hours. After 12 hours of continuous use, the session is refreshed automatically with a brief reconnection (under 3 seconds) to prevent memory leaks from long-running browser sessions. |
| BR-21-005 | The Command Center is available on all subscription plans but with feature limitations: Free plan shows core sections (Overview, Matches, Check-In, Scoring, Leaderboard) only. Paid plans unlock Broadcast, Credentials advanced features, Finance, and Command Palette. |

---

## 21.7 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-21-001 | The Command Center must use a dark color scheme by default (dark grey background #1A1A2E, lighter panels #16213E) — optimized for extended use in darkened event environments and reducing eye strain during 8–12 hour tournaments. |
| UX-21-002 | All critical status indicators must use color AND an additional visual differentiator (icon, pattern, or animation) to ensure accessibility for color-blind users. |
| UX-21-003 | The Command Center must be fully functional on a 1280×800px display (minimum supported resolution) — common for laptops used at events. No horizontal scrolling on desktop at 1280px width. |
| UX-21-004 | On tablet (landscape, 1024px wide), the left navigation must collapse to icon-only mode, freeing maximum space for the main content area. |
| UX-21-005 | All data in the Command Center must display a "Last Updated" micro-timestamp in grey text — e.g., "Updated 2s ago" — for every data card, ensuring directors know how fresh the data is at all times. |
| UX-21-006 | The match status grid in the Overview Section must use large enough cards that all active match statuses are visible simultaneously without scrolling on a 1280px screen, even for a 12-match round (using a responsive grid that adjusts from 4 to 6 columns). |
| UX-21-007 | Toast notifications must not obscure any action buttons or data that requires immediate attention. They must appear in the top-right corner above all content and stack vertically (newest at top). |
| UX-21-008 | The Command Center must maintain its WebSocket connection and continue displaying data for at least 30 seconds after network interruption before showing a "Reconnecting" state — preventing false disconnection warnings during brief packet loss. |

---

## 21.8 Data Requirements

The Command Center does not maintain its own data store — it aggregates and presents data from all other modules in real time via WebSocket subscriptions and REST API calls on load. The primary data contract is the **Command Center WebSocket Event Schema**:

### 21.8.1 WebSocket Subscription Channels

| Channel | Events Received | Update Frequency |
|---------|-----------------|-----------------|
| `tournament:{id}:status` | tournament_state_changed, delay_announced | On change |
| `tournament:{id}:matches` | match_status_changed, match_created, match_voided | On change |
| `tournament:{id}:checkins` | checkin_recorded, no_show_marked | On change |
| `tournament:{id}:results` | result_submitted, result_verified, result_corrected | On change |
| `tournament:{id}:leaderboard` | leaderboard_updated | On change |
| `tournament:{id}:credentials` | credential_entered, credential_released, credential_rotated | On change |
| `tournament:{id}:disputes` | dispute_created, dispute_status_changed | On change |
| `tournament:{id}:stream` | stream_health_update, viewer_count_update | Every 30 seconds |
| `tournament:{id}:announcements` | announcement_sent | On change |
| `tournament:{id}:finance` | payment_received, refund_issued | On change |
| `tournament:{id}:audit` | all_audit_events | On change |

### 21.8.2 Command Center State Object (Initial Load)

```json
{
  "tournament": { ...tournament_object },
  "tournament_health": {
    "checkin_rate": 0.906,
    "matches_completed": 3,
    "total_matches": 12,
    "cumulative_delay_minutes": 12,
    "pending_verifications": 2,
    "open_disputes": 2
  },
  "matches": [ ...match_objects_with_status ],
  "leaderboard": [ ...top_10_entries ],
  "stream": {
    "is_live": true,
    "current_viewers": 1240,
    "bitrate_kbps": 6000,
    "fps": 60,
    "obs_connected": true,
    "stream_duration_seconds": 12240
  },
  "pending_actions": [
    {
      "type": "unverified_result",
      "priority": "high",
      "match_id": "uuid",
      "label": "Match 4 result awaiting verification",
      "action_route": "/scoring/match/uuid"
    }
  ],
  "credential_matrix": [ ...credential_status_per_match ],
  "recent_audit_events": [ ...last_20_audit_entries ]
}
```

---

## 21.9 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Command Center WebSocket disconnects during a critical moment (match about to start) | Last known state remains visible with a red "Reconnecting..." banner at the top; all displayed data is grayed-out slightly to indicate it may be stale; automatic reconnection with exponential backoff; data re-syncs on reconnect |
| Tournament Director loses internet on their device | Local state preserved; UI shows "Offline — data may be stale"; any action attempted while offline queues locally and syncs when connection returns; critical actions (result submission) require online connection and display an error |
| Two Tournament Directors have Command Center open for the same tournament simultaneously | Both receive all WebSocket events; both can take actions; last-writer-wins for state changes; a notification appears: "[Co-Director Name] also has Command Center open" |
| A Command Center action (e.g., "Verify Result") fails server-side | Toast notification: "Action failed: [reason]. Please try again." with a retry button; the UI rolls back any optimistic update; no data is corrupted |
| All 12 matches' results come in simultaneously (end of a round) | WebSocket events are queued and processed in order; leaderboard recalculates once after all 12 are processed (debounced); Command Center shows "12 results received — calculating standings" during processing |

---

## 21.10 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-21-001 | The Command Center initial load (all sections populated with live tournament data) completes within 3 seconds on a 10 Mbps connection. | Performance test |
| AC-21-002 | A match status change (e.g., lobby opened) appears in the Command Center Overview Section within 2 seconds of the action being taken by the Referee. | E2E automated test with 2 browser sessions |
| AC-21-003 | A Tournament Director can complete the flow "receive new dispute → review evidence → resolve dispute → verify resolution notification sent to team" without leaving the Command Center, in under 3 minutes. | Manual QA (timed) |
| AC-21-004 | Toast notifications appear within 1 second of the triggering event and do not block any primary action buttons. | Manual QA |
| AC-21-005 | Command Center renders without horizontal scroll at exactly 1280px viewport width. | Responsive design test |
| AC-21-006 | The WebSocket connection re-establishes within 30 seconds of network interruption and data re-syncs correctly (no duplicate events, no missed events). | Network simulation test |
| AC-21-007 | Referee Mode shows only assigned matches and hides all Tournament Director-only sections. Attempting to access a hidden section via URL returns 403. | Security / manual test |
| AC-21-008 | The Command Palette search returns relevant results within 100ms of each keystroke for a tournament with 64 teams and 12 matches. | Performance test |

---

---

# APPENDIX A — COMPLETE MODULE DEPENDENCY MAP

---

```
Foundation Layer (No Dependencies)
├── MOD-01: Authentication & User Management
└── MOD-03: Game Configuration Management

Organization Layer (Depends on MOD-01)
└── MOD-02: Organization Management → MOD-01

Team Layer (Depends on MOD-01, MOD-03)
└── MOD-04: Team & Player Management → MOD-01, MOD-03

Tournament Core Layer
├── MOD-05: Tournament Management → MOD-01, MOD-02, MOD-03, MOD-04
├── MOD-06: Registration & Verification → MOD-01, MOD-04, MOD-05
├── MOD-07: Match Scheduling → MOD-05, MOD-06
└── MOD-08: Secure Room Credentials → MOD-05, MOD-07

Live Operations Layer
├── MOD-09: Match Day Operations → MOD-05, MOD-06, MOD-07, MOD-08
├── MOD-10: Live Scoring & Points Engine → MOD-03, MOD-07, MOD-09, MOD-11
├── MOD-11: Leaderboard Engine → MOD-03, MOD-07, MOD-10
└── MOD-12: Live Streaming & Broadcast → MOD-05, MOD-09, MOD-10, MOD-11

Broadcast & Overlay Layer
└── MOD-13: OBS Overlay System → MOD-03, MOD-05, MOD-10, MOD-11, MOD-12

Communication Layer
├── MOD-14: Announcement & Notification → MOD-01, MOD-02, MOD-05, MOD-06, MOD-09
└── MOD-15: Live Chat & Moderation → MOD-01, MOD-05, MOD-12

Financial Layer
└── MOD-16: Prize Pool & Payment → MOD-01, MOD-05, MOD-06, MOD-11

Intelligence Layer
├── MOD-17: Analytics & Reporting → MOD-05, MOD-06, MOD-10, MOD-11, MOD-12, MOD-16
├── MOD-18: Tournament Branding → MOD-02, MOD-05, MOD-13
├── MOD-19: Sponsor Management → MOD-02, MOD-05, MOD-12, MOD-13, MOD-17, MOD-18
└── MOD-20: Audit Trail & Dispute Resolution → MOD-01, MOD-05, MOD-09, MOD-10, MOD-16

Command Layer (Depends on All)
└── MOD-21: Esports Command Center → MOD-01 through MOD-20
```

---

**Critical Path (Minimum to Launch):**
`MOD-01 → MOD-02 → MOD-03 → MOD-04 → MOD-05 → MOD-06 → MOD-07 → MOD-08 → MOD-09 → MOD-10 → MOD-11 → MOD-21`

---

---

# APPENDIX B — MVP SCOPE DEFINITION (V1.0)

---

## B.1 MVP Philosophy

The V1.0 MVP must solve the **three most acute pain points** identified in the Problem Validation Document:
1. Manual tournament registration and verification chaos
2. Manual scoring and leaderboard delays and errors
3. Insecure and poorly-timed room credential distribution

Everything else (broadcast, analytics, branding, sponsor management) is valuable but not required for organizers to switch from their current tools.

---

## B.2 MVP Feature Inclusion Matrix

| Module | MVP (V1.0) | V1.5 | V2.0 | Notes |
|--------|:----------:|:----:|:----:|-------|
| MOD-01: Auth & User Management | ✅ Full | — | — | Mobile OTP + Google OAuth |
| MOD-02: Organization Management | ✅ Core | ✅ Full | — | V1.0: creation + members; V1.5: subscription billing |
| MOD-03: Game Config | ✅ Full | — | — | Pre-loaded 6 games, BGIS scoring template |
| MOD-04: Team & Player Management | ✅ Core | ✅ Full | — | V1.0: create, roster, register; V1.5: stats |
| MOD-05: Tournament Management | ✅ Full | — | — | Full lifecycle |
| MOD-06: Registration & Verification | ✅ Full | — | — | Including payment via Razorpay |
| MOD-07: Match Scheduling | ✅ Full | — | — | Auto-generate + manual edit |
| MOD-08: Room Credentials | ✅ Full | — | — | Core secure distribution |
| MOD-09: Match Day Operations | ✅ Full | — | — | Check-in, match flow, DQ |
| MOD-10: Live Scoring | ✅ Full | — | — | Entry form + auto-calculation |
| MOD-11: Leaderboard Engine | ✅ Full | — | — | Real-time WebSocket |
| MOD-12: Live Streaming | ⚡ Partial | ✅ Full | — | V1.0: embed URL only; V1.5: YouTube OAuth |
| MOD-13: OBS Overlays | ⚡ Partial | ✅ Full | — | V1.0: OVL-01 and OVL-03 only |
| MOD-14: Notifications | ✅ Core | ✅ Full | — | V1.0: in-app + SMS; V1.5: email templates |
| MOD-15: Live Chat | ❌ Deferred | ⚡ Partial | ✅ Full | V2.0 |
| MOD-16: Prize Management | ⚡ Partial | ✅ Full | — | V1.0: escrow + manual payout tracking; V1.5: automated Razorpay payouts |
| MOD-17: Analytics | ❌ Deferred | ⚡ Partial | ✅ Full | V1.5: basic post-tournament report |
| MOD-18: Branding | ❌ Deferred | ⚡ Partial | ✅ Full | V1.5: brand kit + basic graphics |
| MOD-19: Sponsor Management | ❌ Deferred | — | ✅ Full | V2.0 |
| MOD-20: Audit & Disputes | ✅ Core | ✅ Full | — | V1.0: audit log + basic disputes |
| MOD-21: Command Center | ⚡ Partial | ✅ Full | — | V1.0: Overview + Matches + Scoring + Leaderboard sections |

**Legend:** ✅ Full = all P0/P1 requirements | ⚡ Partial = P0 requirements only | ❌ Deferred = not in this release

---

## B.3 V1.0 MVP Requirements Summary

**Total Requirements in Full PRD:** ~520 functional requirements

| Priority | Total | In V1.0 MVP | Deferred |
|----------|-------|:-----------:|:--------:|
| 🔴 P0 — Critical | 142 | 142 (100%) | 0 |
| 🟠 P1 — High | 178 | 89 (50%) | 89 |
| 🟡 P2 — Medium | 134 | 18 (13%) | 116 |
| 🟢 P3 — Low | 66 | 0 (0%) | 66 |
| **Total** | **520** | **249 (48%)** | **271** |

---

## B.4 MVP Launch Criteria

The following criteria must ALL be met before V1.0 is considered ready for launch:

| # | Launch Criterion | Verification |
|---|-----------------|-------------|
| 1 | A tournament organizer can create, publish, and run a complete 64-team, 4-round BGMI tournament end-to-end without leaving the platform | Manual QA (full run-through) |
| 2 | Room credentials are delivered to the correct team members only — 0 unauthorized deliveries in security testing | Penetration test |
| 3 | Leaderboard updates within 5 seconds of result publication for 64 teams | Load test |
| 4 | Payment processing (entry fee collection) works correctly for UPI and card payments | Payment test with Razorpay sandbox |
| 5 | All P0 acceptance criteria across all 21 modules pass | Automated test suite |
| 6 | Platform supports 500 concurrent WebSocket connections without performance degradation | Load test |
| 7 | GDPR/DPDP compliance review completed (privacy policy, data handling, consent flows) | Legal review |
| 8 | Security audit completed — no critical or high-severity vulnerabilities | Third-party security audit |
| 9 | Mobile-responsive on iPhone 12 (390px) and Samsung Galaxy S21 (360px) | Device testing |
| 10 | 5 beta organizers have run at least 1 real tournament on the platform with positive feedback | Beta testing |

---

---

# APPENDIX C — NON-FUNCTIONAL REQUIREMENTS

---

## C.1 Performance Requirements

| Requirement | Metric | Measurement Method |
|-------------|--------|-------------------|
| **API Response Time (p50)** | < 100ms | APM monitoring |
| **API Response Time (p95)** | < 300ms | APM monitoring |
| **API Response Time (p99)** | < 1000ms | APM monitoring |
| **WebSocket Event Delivery** | < 2 seconds end-to-end | E2E measurement |
| **Leaderboard Recalculation (256 teams)** | < 5 seconds | Load test |
| **Page Load Time (LCP — mobile 4G)** | < 2.5 seconds | Lighthouse |
| **Page Load Time (LCP — desktop)** | < 1.5 seconds | Lighthouse |
| **OBS Overlay Initial Load** | < 3 seconds | Manual measurement |
| **Overlay Update Propagation** | < 2 seconds | E2E measurement |
| **Database Query Time (p95)** | < 50ms | DB monitoring |
| **Points Calculation Engine** | < 500ms for 25 teams | Unit test |
| **Graphic Generation (GFX)** | < 5 seconds | Manual timing |
| **Audit Log Write** | < 100ms | DB monitoring |

---

## C.2 Scalability Requirements

| Dimension | V1.0 Target | V2.0 Target | Architecture Approach |
|-----------|:-----------:|:-----------:|----------------------|
| Concurrent WebSocket connections | 2,000 | 20,000 | Horizontal scaling, Redis pub/sub |
| Concurrent active tournaments | 100 | 1,000 | Stateless API servers |
| Concurrent users (registered) | 10,000 | 100,000 | CDN + caching layer |
| Tournaments per month | 1,000 | 10,000 | Async processing queues |
| API requests per second | 500 | 5,000 | Load balancer + auto-scaling |
| Database records (players) | 500,000 | 5,000,000 | Read replicas, partitioning |
| File storage (screenshots, graphics) | 1 TB | 10 TB | Object storage (S3/R2) |
| Notification throughput | 10,000/min | 100,000/min | Queue-based dispatch |

---

## C.3 Availability & Reliability Requirements

| Requirement | Target | Notes |
|-------------|--------|-------|
| **Platform Uptime (SLA)** | 99.5% monthly | Translates to ~3.6 hours downtime/month |
| **Uptime during LIVE tournaments** | 99.9% | Real-time operations demand near-perfect availability |
| **Planned Maintenance Window** | Sunday 2:00–4:00 AM IST | Lowest traffic window in India |
| **Recovery Time Objective (RTO)** | < 1 hour | Time to restore service after failure |
| **Recovery Point Objective (RPO)** | < 5 minutes | Maximum data loss acceptable |
| **Database Backup Frequency** | Every 6 hours | With point-in-time recovery |
| **WebSocket Reconnection SLA** | < 30 seconds | Auto-reconnect with data re-sync |

---

## C.4 Security Requirements

| Category | Requirement |
|----------|------------|
| **Authentication** | JWT with 15-minute access token expiry; HTTP-only refresh tokens; TOTP 2FA support |
| **Authorization** | Role-based access control enforced server-side on every API endpoint — no client-side-only authorization |
| **Data Encryption (in transit)** | TLS 1.2 minimum; TLS 1.3 preferred; HSTS enforced |
| **Data Encryption (at rest)** | AES-256 for sensitive fields (credentials, bank details, API keys); database-level encryption for PII |
| **Room Credentials** | AES-256 encrypted; separate key management (AWS Secrets Manager); never logged in plain text |
| **Payment Data** | PCI-DSS compliance delegated to Razorpay; no card data touches GameVerse servers |
| **SQL Injection Prevention** | Parameterized queries only; ORM with query builder; no raw SQL concatenation |
| **XSS Prevention** | Content Security Policy headers; React's default escaping; DOMPurify for any rich text rendering |
| **CSRF Protection** | CSRF tokens on all state-changing requests; SameSite cookie attribute |
| **Rate Limiting** | Applied to: login (5 attempts/15 min), OTP (3 resends/hour), API (per-route limits), WebSocket connections |
| **Audit Log Integrity** | SHA-256 hash chain; INSERT-only database role for audit table; no UPDATE or DELETE on audit records |
| **DDoS Protection** | Cloudflare or AWS Shield at the network edge |
| **Dependency Security** | `npm audit` in CI/CD pipeline; Dependabot for automated dependency updates; no packages with known critical CVEs |
| **Secret Management** | No secrets in code repositories; environment variables via secrets manager; regular secret rotation |
| **Penetration Testing** | External penetration test before V1.0 launch; quarterly tests thereafter |
| **Vulnerability Disclosure** | Responsible disclosure policy published; security@gameverse.gg contact |

---

## C.5 Compliance Requirements

| Regulation | Applicability | Requirements |
|-----------|--------------|-------------|
| **Digital Personal Data Protection Act (DPDP) 2023 — India** | All Indian users | Consent collection for data processing; right to access, correction, erasure; data minimization; purpose limitation; Data Protection Officer appointment |
| **Information Technology Act 2000 & Rules** | Indian jurisdiction | Reasonable security practices; grievance officer appointment; intermediary guidelines compliance |
| **GST (Goods and Services Tax)** | Revenue from Indian users | GST registration; GST on subscription fees and platform fees; invoice generation |
| **TDS (Tax Deducted at Source)** | Prize money > ₹10,000 | Deduct TDS at 30% (Section 115BBJ); remit to government; issue TDS certificates (Form 16A) |
| **Payment and Settlement Systems Act** | Payment processing | Razorpay handles compliance; platform maintains PPI license compliance for wallet feature |
| **COPPA (Children's Online Privacy Protection)** | Users under 13 | No registration for users under 13; age verification at registration; parental consent for 13–18 |

---

## C.6 Observability Requirements

| Tool Category | Requirement | Recommended Stack |
|--------------|-------------|------------------|
| **Application Performance Monitoring** | Real-time API latency, error rates, throughput | Datadog / New Relic |
| **Error Tracking** | Real-time exception capture with stack traces | Sentry |
| **Log Aggregation** | Centralized structured logging (JSON format) | ELK Stack / Loki |
| **Infrastructure Monitoring** | CPU, memory, disk, network for all services | Prometheus + Grafana |
| **WebSocket Monitoring** | Active connections, message throughput, dropped connections | Custom metrics via Prometheus |
| **Uptime Monitoring** | External health checks every 60 seconds | UptimeRobot / Pingdom |
| **Real-time Alerting** | PagerDuty alerts for: error rate > 1%, p99 > 2s, WebSocket connections drop > 20% | PagerDuty |
| **Database Monitoring** | Slow query detection, connection pool monitoring | pg_stat_statements + Datadog |
| **Payment Monitoring** | Payment failure rate, webhook delivery success | Razorpay Dashboard + custom alerts |

---

## C.7 Browser & Device Compatibility

| Platform | Minimum Supported | Recommended |
|----------|------------------|-------------|
| **Chrome (Desktop)** | Version 100+ | Latest stable |
| **Safari (Desktop)** | Version 15+ | Latest stable |
| **Firefox (Desktop)** | Version 100+ | Latest stable |
| **Edge (Desktop)** | Version 100+ | Latest stable |
| **Chrome (Android)** | Version 100+ | Latest stable |
| **Safari (iOS)** | iOS 15+ | Latest stable |
| **OBS Browser Source** | OBS 28+ (Chromium 103+) | OBS 30+ |
| **Minimum Screen Width** | 360px (mobile) | 390px (iPhone 12) |
| **Command Center Minimum** | 1280px wide | 1440px+ |
| **Tablet Support** | iPad (landscape, 1024px+) | Full feature parity |

---

---

# APPENDIX D — GLOSSARY OF TERMS

---

| Term | Definition |
|------|-----------|
| **AES-256** | Advanced Encryption Standard with 256-bit key — the encryption algorithm used to secure sensitive data (room credentials, bank details) at rest in the database. |
| **APNs** | Apple Push Notification Service — the push notification delivery network for iOS devices. |
| **Battle Royale** | A game format where multiple teams compete simultaneously in one match, with survival + kill-based scoring determining the winner. BGMI and Free Fire MAX use this format. |
| **BGMI** | Battlegrounds Mobile India — the primary game title targeted by GameVerse. The Indian version of PUBG Mobile. |
| **BGIS** | BGMI India Series — the official national championship for BGMI organized by Krafton. The scoring system used as a benchmark template on GameVerse. |
| **Broadcast Producer** | A platform role (ROLE-06) responsible for managing the live stream, OBS overlays, and broadcast production for a tournament. |
| **Browser Source** | An OBS Studio feature that renders a web page (URL) as a video layer in the stream — the mechanism used by GameVerse OBS overlays. |
| **Bye** | An empty match slot used to fill a match when the number of teams cannot be evenly divided by the teams-per-match count. A bye team does not compete. |
| **Chicken Dinner** | Esports slang for winning a match (finishing in 1st place) in battle royale games. Derived from PUBG's "Winner Winner Chicken Dinner" announcement. |
| **CDN** | Content Delivery Network — a distributed network of servers that delivers static assets (images, graphics, overlays) with low latency globally. |
| **Command Center** | The unified real-time operational dashboard (MOD-21) combining all tournament management tools into one interface. |
| **COPPA** | Children's Online Privacy Protection Act — US federal law protecting online privacy of children under 13. Applied by GameVerse for all users globally. |
| **DQ / Disqualified** | When a team or player is removed from competition due to a rules violation, cheating, or code of conduct breach. |
| **DPDP Act** | Digital Personal Data Protection Act 2023 — India's primary data protection legislation governing how platforms collect, process, and store personal data of Indian citizens. |
| **Elo** | A rating system (originally for chess) adapted for esports — players/teams gain or lose rating points based on tournament results relative to opponents' ratings. |
| **Escrow** | A financial arrangement where a third party (the platform) holds entry fee funds until the tournament is completed and prize distribution is confirmed. |
| **FCM** | Firebase Cloud Messaging — Google's push notification service for Android devices. |
| **Free Fire MAX** | Garena Free Fire MAX — the second primary mobile battle royale game supported by GameVerse. |
| **Group Stage** | A tournament format phase where teams are divided into smaller groups and play matches within their group. Top teams from each group advance to the finals. |
| **HSTS** | HTTP Strict Transport Security — a security header that forces browsers to only connect via HTTPS. |
| **ICE Score** | Impact × Confidence × Ease — a prioritization framework for product features used in the Problem Validation Document. |
| **IGL** | In-Game Leader — the player on a team who makes strategic calls during matches. A player role designation on GameVerse. |
| **IMPS** | Immediate Payment Service — a real-time Indian interbank fund transfer system used for bank account prize payouts. |
| **IFSC** | Indian Financial System Code — an 11-character alphanumeric code identifying a specific bank branch in India, required for bank transfers. |
| **JWT** | JSON Web Token — the authentication token format used by GameVerse for maintaining user sessions. Composed of a header, payload, and signature. |
| **Kill Cap** | A tournament rule limiting the maximum number of kills per team that count toward scoring in a single match (e.g., kill cap of 10 means kills 11+ don't earn points). |
| **KYC** | Know Your Customer — the identity verification process required for organizations to receive payouts, involving PAN card, government ID, and bank details. |
| **League Format** | A tournament format where all teams play a fixed number of matches and cumulative points determine the final standings. |
| **MSG91** | A major Indian SMS gateway provider used as the primary SMS delivery service for GameVerse notifications. |
| **Multi-Day League** | A league format tournament that spans multiple calendar days, with matches distributed across days and cumulative points tracked throughout. |
| **MVP** | Minimum Viable Product — the first version of the platform with enough features to serve early users and validate the core value proposition. |
| **NEFT** | National Electronic Funds Transfer — an Indian bank-to-bank funds transfer system, used for prize payouts to bank accounts. |
| **OBS Studio** | Open Broadcaster Software — the free, open-source streaming and recording software used by most independent esports broadcasters. |
| **OBS WebSocket** | A protocol extension for OBS Studio that allows external software (like GameVerse) to control OBS remotely — switching scenes, updating sources, monitoring stream health. |
| **Org** | Short for Organization — an entity on GameVerse that creates and manages tournaments. |
| **P0 / P1 / P2 / P3** | Priority designations for requirements: P0 = MVP blocker, P1 = Required for first release, P2 = Second release, P3 = Nice to have. |
| **PAN** | Permanent Account Number — Indian tax identification number issued by the Income Tax Department. Required for KYC and TDS processing. |
| **PCI-DSS** | Payment Card Industry Data Security Standard — security standards for handling card payment data. Compliance is managed by Razorpay for GameVerse. |
| **Placement Points** | Points awarded to a team based on their finishing position in a match (e.g., 1st place = 15 points, 2nd place = 12 points). |
| **RBAC** | Role-Based Access Control — the permission system where platform capabilities are assigned to roles, and users are assigned to roles. |
| **Razorpay** | The primary Indian payment gateway integrated with GameVerse for entry fee collection, refunds, and prize payouts. |
| **Redis** | An in-memory data structure store used by GameVerse for: caching (leaderboard), session storage, WebSocket pub/sub, and notification queues. |
| **Room Credential** | The combination of Room ID and Room Password used to join a custom game lobby in BGMI or Free Fire MAX. |
| **RTMP** | Real-Time Messaging Protocol — the streaming protocol used to push video from OBS to streaming platforms (YouTube, Twitch). |
| **Scoring Template** | A pre-configured set of placement points, kill points, and bonus rules defining how match results translate to competition points. |
| **Slug** | A URL-friendly version of a name — lowercase, hyphens instead of spaces, no special characters. Used for organization and tournament URLs (e.g., `hydra-esports`). |
| **Slot** | A numbered position within a match. Each team is assigned a slot number that corresponds to their position in the in-game custom room. |
| **TDS** | Tax Deducted at Source — Indian tax mechanism where the payer deducts income tax before making payments. Applies to prize money above ₹10,000 at 30% rate (Section 115BBJ). |
| **TOTP** | Time-based One-Time Password — the algorithm behind Google Authenticator used for 2FA. Generates a 6-digit code that changes every 30 seconds. |
| **TLS** | Transport Layer Security — the cryptographic protocol ensuring secure communication over the internet (HTTPS). |
| **UID** | In-game Unique Identifier — the player's permanent identification number within a specific game (e.g., BGMI Player ID, Free Fire Character ID). Used to verify player identity during tournament registration. |
| **UPI** | Unified Payments Interface — India's real-time payment system allowing instant bank transfers via mobile. The primary payment method for entry fees and prize payouts on GameVerse. |
| **VPA** | Virtual Payment Address — a UPI identifier in the format `username@bankname` (e.g., `hydra@okicici`). Used for UPI transfers. |
| **Waitlist** | A queue of teams that registered for a tournament after all slots were filled. Waitlisted teams are promoted to confirmed slots when confirmed teams withdraw. |
| **WebSocket** | A communication protocol providing full-duplex (two-way) communication channels over a single TCP connection. Used by GameVerse for all real-time data delivery (leaderboard, match status, overlays, notifications). |
| **White-Label** | A product customized to appear as if it belongs to the buyer's brand rather than the original producer. Elite plan organizations can run their tournament pages without GameVerse branding. |
| **XSS** | Cross-Site Scripting — a security vulnerability where malicious scripts are injected into web pages. Prevented by React's default escaping and Content Security Policy headers. |

---

---

# DOCUMENT COMPLETION SUMMARY

---

## Full PRD — Module Completion Status

| Part | Modules | Status |
|------|---------|--------|
| Part 1 | MOD-01: Authentication & User Management | ✅ Complete |
| Part 1 | MOD-02: Organization Management | ✅ Complete |
| Part 1 | MOD-03: Game Configuration Management | ✅ Complete |
| Part 1 | MOD-04: Team & Player Management | ✅ Complete |
| Part 2 | MOD-05: Tournament Management | ✅ Complete |
| Part 2 | MOD-06: Registration & Verification | ✅ Complete |
| Part 2 | MOD-07: Match Scheduling & Slot Management | ✅ Complete |
| Part 2 | MOD-08: Secure Room Credential Management | ✅ Complete |
| Part 3 | MOD-09: Match Day Operations | ✅ Complete |
| Part 3 | MOD-10: Live Scoring & Points Engine | ✅ Complete |
| Part 3 | MOD-11: Leaderboard Engine | ✅ Complete |
| Part 3 | MOD-12: Live Streaming & Broadcast Integration | ✅ Complete |
| Part 4 | MOD-13: OBS Overlay System | ✅ Complete |
| Part 4 | MOD-14: Announcement & Notification System | ✅ Complete |
| Part 4 | MOD-15: Live Chat & Moderation | ✅ Complete |
| Part 4 | MOD-16: Prize Pool & Payment Management | ✅ Complete |
| Part 5 | MOD-17: Analytics & Reporting | ✅ Complete |
| Part 5 | MOD-18: Tournament Branding & Customization | ✅ Complete |
| Part 5 | MOD-19: Sponsor Management | ✅ Complete |
| Part 5 | MOD-20: Audit Trail & Dispute Resolution | ✅ Complete |
| Part 6 | MOD-21: Esports Command Center | ✅ Complete |
| Part 6 | Appendix A: Module Dependency Map | ✅ Complete |
| Part 6 | Appendix B: MVP Scope Definition | ✅ Complete |
| Part 6 | Appendix C: Non-Functional Requirements | ✅ Complete |
| Part 6 | Appendix D: Glossary of Terms | ✅ Complete |

---

## PRD Statistics

| Metric | Count |
|--------|-------|
| Total Modules | 21 |
| Total Functional Requirements | ~520 |
| Total Business Rules | ~105 |
| Total User Stories | ~210 |
| Total Acceptance Criteria | ~130 |
| Total Data Tables Defined | 63 |
| Total Edge Cases Documented | ~115 |
| Total UI/UX Requirements | ~105 |
| Document Parts | 6 |

---

## Document Sign-Off

| Role | Name | Status |
|------|------|--------|
| Product Lead | — | Pending Review |
| Engineering Lead | — | Pending Review |
| Design Lead | — | Pending Review |
| Business Lead | — | Pending Review |
| Legal / Compliance | — | Pending Review |

---

## Next Documents in Series

| Document # | Title | Status |
|-----------|-------|--------|
| Document 1 | Problem Validation Document | ✅ Complete |
| **Document 2** | **Product Requirements Document (PRD)** | **✅ Complete** |
| Document 3 | User Roles & User Flow | 🔜 Next |
| Document 4 | System Architecture | 🔜 Planned |
| Document 5 | Database ER Diagram | 🔜 Planned |
| Document 6 | API Specification | 🔜 Planned |
| Document 7 | Development Roadmap | 🔜 Planned |

---

> **Document:** GameVerse PRD | **Part:** 6 of 6 (FINAL) | **Status:** Complete | **Total Parts:** 6
>
> **Document 2 — Product Requirements Document: COMPLETE ✅**



---

# ECOSYSTEM SIDE: 2. 🎮 PLAYER & TEAM PORTAL

---

# MODULE 4 — TEAM & PLAYER MANAGEMENT

---

## 4.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-04 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Manages the creation, configuration, and lifecycle of teams on the platform. Teams are the primary competitive unit in tournament registration. This module handles team creation, roster management, player invitations, team profiles, and cross-tournament team statistics. |
| **Primary Users** | ROLE-07 (Team Captain), ROLE-08 (Player), ROLE-04 (Tournament Director), ROLE-05 (Referee) |
| **Dependencies** | MOD-01 (Authentication), MOD-03 (Game Configuration) |
| **Estimated Complexity** | Medium |

---

## 4.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-04-001 | As a **player**, I want to create a team with a name, tag, and logo so that my team has a recognized identity on the platform. | 🔴 P0 |
| US-04-002 | As a **Team Captain**, I want to invite players to join my team by searching their username or sending an invitation link so that I can build my roster. | 🔴 P0 |
| US-04-003 | As a **player**, I want to receive an invitation to join a team and accept or decline it so that I control which team I represent. | 🔴 P0 |
| US-04-004 | As a **Team Captain**, I want to set each team member's in-game role (IGL, fragger, support, sniper, substitute) so that the roster reflects how we play. | 🟡 P2 |
| US-04-005 | As a **Team Captain**, I want to register my team for tournaments directly from the team profile so that I don't have to re-enter roster information every time. | 🔴 P0 |
| US-04-006 | As a **player**, I want to view my team's cumulative statistics across all tournaments played — total matches, total kills, average placement, chicken dinners — so that I can track our progress. | 🟡 P2 |
| US-04-007 | As a **Tournament Director**, I want to view full roster details of any registered team including all player UIDs so that I can verify team composition. | 🔴 P0 |
| US-04-008 | As a **Tournament Director**, I want to approve or reject team registrations, with the ability to request corrections, so that I maintain control over who participates. | 🔴 P0 |
| US-04-009 | As a **Team Captain**, I want to add a substitute player to my tournament roster so that if a main player is unavailable, we can field a replacement. | 🟠 P1 |
| US-04-010 | As a **player**, I want to see my personal statistics across all tournaments I've participated in so that I can demonstrate my individual performance. | 🟡 P2 |
| US-04-011 | As a **Team Captain**, I want to manage a multi-game roster — different players for BGMI and Free Fire under the same team banner — so that my organization can compete across multiple titles. | 🟡 P2 |

---

## 4.3 Functional Requirements

### 4.3.1 Team Creation & Profile

| ID | Requirement | Priority |
|----|------------|---------|
| FR-04-001 | The system **shall** allow any registered user to create a team. The creator automatically becomes the Team Captain. A user can be the Team Captain of a maximum of 3 active teams. | 🔴 P0 |
| FR-04-002 | Team creation **shall** require: (a) Team Name (max 30 characters), (b) Team Tag (3–5 characters, uppercase, alphanumeric — used as abbreviated identifier, e.g., "HDRA"), (c) Primary Game (selected from game catalog). | 🔴 P0 |
| FR-04-003 | Team creation **shall** support optional fields: team logo upload (JPG/PNG/WebP, max 1MB, auto-resized to 200×200), team banner (max 2MB), team description (max 200 characters), team country, and team social links (Instagram, YouTube). | 🟠 P1 |
| FR-04-004 | Team Tags **shall** be unique per game (same tag cannot be used by two teams playing the same game), case-insensitive, and limited to uppercase letters and numbers. | 🟠 P1 |
| FR-04-005 | The system **shall** provide each team with a public profile page at `gameverse.gg/team/[team-slug]` displaying: team info, active roster, tournament history, and aggregate statistics. | 🟡 P2 |

### 4.3.2 Roster Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-04-006 | The system **shall** allow Team Captains to invite players to their team by: (a) searching GameVerse username, (b) sharing a team invite link. | 🔴 P0 |
| FR-04-007 | A team roster **shall** have a defined structure per game, respecting game-specific max/min team sizes (e.g., for BGMI: minimum 4 players, maximum 4 players + 1 substitute). The system shall enforce these limits based on the team's primary game configuration. | 🔴 P0 |
| FR-04-008 | Players **shall** be able to see and manage incoming team invitations from their notification center. Each invitation must show: team name, team tag, game, inviting captain's name, and an Accept / Decline action. | 🔴 P0 |
| FR-04-009 | When a player joins a team, the system **shall** automatically pull their linked in-game account for the team's primary game (if it exists) and associate it with their team membership. | 🟠 P1 |
| FR-04-010 | The system **shall** allow Team Captains to remove players from the team roster at any time. Players removed during an active tournament are substituted by the designated substitute player if one exists. | 🟠 P1 |
| FR-04-011 | The system **shall** allow Team Captains to designate one player as the substitute. The substitute is part of the team roster but does not occupy a main player slot. Substitutes can be activated for a specific tournament match by the captain (subject to organizer rules). | 🟠 P1 |
| FR-04-012 | The system **shall** allow players to leave a team voluntarily. A Team Captain cannot leave their own team without first transferring captaincy or disbanding the team. | 🟠 P1 |
| FR-04-013 | The system **shall** allow Team Captains to transfer captaincy to another team member. The transfer requires confirmation from the new captain. | 🟠 P1 |
| FR-04-014 | The system **shall** display a full roster history — including past members, join dates, and leave dates — visible only to the Team Captain. | 🟡 P2 |

### 4.3.3 Tournament Registration from Team Profile

| ID | Requirement | Priority |
|----|------------|---------|
| FR-04-015 | The system **shall** allow Team Captains to register their team for a tournament directly from their team management panel, without re-entering roster data. | 🔴 P0 |
| FR-04-016 | During tournament registration, the system **shall** display the team's current roster with their linked UIDs for the tournament's game, and allow the captain to select which players to field for this specific tournament (in case the roster is larger than the max team size). | 🔴 P0 |
| FR-04-017 | The system **shall** display the registration status for each active tournament registration (pending, approved, rejected, waitlisted) on the team management panel. | 🟠 P1 |

### 4.3.4 Team Verification & Organizer View

| ID | Requirement | Priority |
|----|------------|---------|
| FR-04-018 | Tournament Directors and Referees **shall** be able to view a detailed roster view for any team registered in their tournament, showing: player name, username, UID (full, not masked), UID verification status, and profile link. | 🔴 P0 |
| FR-04-019 | The system **shall** provide organizers with a "Verify All UIDs" bulk action that checks all registered teams' UIDs against the game's UID format regex and flags anomalies. | 🟠 P1 |
| FR-04-020 | The system **shall** allow organizers to approve, reject, or request-correction on any team registration. When requesting a correction, the organizer must specify which player(s) need to correct their UID, and the system shall notify the Team Captain automatically. | 🔴 P0 |
| FR-04-021 | The system **shall** prevent a player's UID from being registered in more than one team in the same tournament. This cross-team duplicate UID check shall run automatically upon each registration submission. | 🔴 P0 |

### 4.3.5 Player & Team Statistics

| ID | Requirement | Priority |
|----|------------|---------|
| FR-04-022 | The system **shall** maintain an aggregate statistics record for each team across all tournaments played on the platform, including: total tournaments, total matches played, total kills, total placements by rank, chicken dinner count, average placement, average kills per match, and win rate (tournaments won / tournaments participated). | 🟡 P2 |
| FR-04-023 | The system **shall** maintain an individual player statistics record across all tournaments, including: total matches played, total kills, total damage (if available), highest kill game, average kills per match, and tournament placements. | 🟡 P2 |
| FR-04-024 | Statistics **shall** be segmented by game title and optionally by date range (all time / last 30 days / last 90 days). | 🟢 P3 |
| FR-04-025 | The system **shall** provide a **platform ranking** for teams within each game, calculated based on their tournament performance using a configurable Elo-like rating system. Rankings shall be recalculated within 15 minutes of tournament results being finalized. | 🟢 P3 |

---

## 4.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-04-001 | A player can be a member of multiple teams but can only register in one team per tournament. The system shall detect and block a player from being registered in two different teams for the same tournament. |
| BR-04-002 | A team's name and tag can be changed, but changes take effect for future tournaments only. Existing tournament records retain the team name/tag at the time of registration. |
| BR-04-003 | A team cannot be deleted if it has participated in any tournament on the platform. Instead, the team can be "archived" — removing it from active listings while preserving historical records. |
| BR-04-004 | When a tournament registration is in "Approved" status, changes to the team's main roster (adding/removing main players) are blocked. Only substitute changes are permitted, subject to organizer approval. |
| BR-04-005 | Player UIDs added to a team registration are locked once the tournament check-in phase begins. No UID changes are permitted after check-in opens. |

---

## 4.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-04-001 | Team creation must be a single-page form (not a multi-step wizard) since it involves fewer fields than organization creation. |
| UX-04-002 | The team roster display must show player cards in a grid layout with: avatar, display name, in-game name, UID (truncated with expand option), position/role badge, and UID verification status indicator. |
| UX-04-003 | The tournament registration flow from the team panel must show a clear 3-step progress indicator: Step 1 — Select Tournament, Step 2 — Confirm Roster & UIDs, Step 3 — Pay Entry Fee & Submit. |
| UX-04-004 | The organizer's team registration review table must support: sort by registration time, filter by status (pending/approved/rejected), search by team name, and bulk approve/reject actions for selected teams. |
| UX-04-005 | Player statistics on the player profile must use data visualization: a radar chart showing key stats (kills, placement, consistency) and a bar chart of tournament placements over time. |
| UX-04-006 | The team invite link copy must include one-click copy with visual confirmation (button text changes to "Copied!" for 2 seconds). |

---

## 4.6 Data Requirements

### 4.6.1 Teams Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `team_id` | UUID | PK | Unique team ID |
| `name` | VARCHAR(30) | NOT NULL | Team display name |
| `slug` | VARCHAR(40) | UNIQUE, NOT NULL | URL-friendly name |
| `tag` | VARCHAR(5) | NOT NULL | Short team tag |
| `primary_game_id` | UUID | FK → games | Primary game |
| `logo_url` | TEXT | NULLABLE | Logo CDN URL |
| `banner_url` | TEXT | NULLABLE | Banner CDN URL |
| `description` | VARCHAR(200) | NULLABLE | Team description |
| `country` | VARCHAR(2) | NULLABLE | ISO country code |
| `captain_id` | UUID | FK → users | Current Team Captain |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `is_archived` | BOOLEAN | DEFAULT FALSE | Archived flag |
| `total_tournaments` | INTEGER | DEFAULT 0 | Cached stat |
| `total_wins` | INTEGER | DEFAULT 0 | Cached stat |
| `platform_rating` | INTEGER | DEFAULT 1000 | Elo-like rating |
| `created_at` | TIMESTAMP | NOT NULL | Creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 4.6.2 TeamMembers Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `member_id` | UUID | PK | Membership record ID |
| `team_id` | UUID | FK → teams | Associated team |
| `user_id` | UUID | FK → users | Player |
| `role_in_team` | ENUM | NULLABLE | 'igl','fragger','support','sniper','substitute','captain' |
| `linked_uid` | VARCHAR(50) | NULLABLE | In-game UID for team's primary game |
| `uid_verified` | BOOLEAN | DEFAULT FALSE | UID verification status |
| `status` | ENUM | DEFAULT 'active' | 'active','invited','removed','left' |
| `is_substitute` | BOOLEAN | DEFAULT FALSE | Substitute player flag |
| `invited_at` | TIMESTAMP | NULLABLE | Invitation sent time |
| `joined_at` | TIMESTAMP | NULLABLE | Acceptance time |
| `left_at` | TIMESTAMP | NULLABLE | Exit time |

### 4.6.3 TeamStats Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `stat_id` | UUID | PK | Record ID |
| `team_id` | UUID | FK → teams | Team |
| `game_id` | UUID | FK → games | Game |
| `total_tournaments` | INTEGER | DEFAULT 0 | Tournaments entered |
| `total_matches` | INTEGER | DEFAULT 0 | Matches played |
| `total_kills` | INTEGER | DEFAULT 0 | Cumulative kills |
| `total_damage` | BIGINT | DEFAULT 0 | Cumulative damage dealt |
| `chicken_dinners` | INTEGER | DEFAULT 0 | Match wins |
| `tournament_wins` | INTEGER | DEFAULT 0 | Tournament wins |
| `avg_placement` | DECIMAL(5,2) | DEFAULT 0 | Average finishing placement |
| `avg_kills_per_match` | DECIMAL(5,2) | DEFAULT 0 | Average kills per match |
| `last_updated` | TIMESTAMP | NOT NULL | Last recalculation time |

### 4.6.4 PlayerStats Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `stat_id` | UUID | PK | Record ID |
| `user_id` | UUID | FK → users | Player |
| `game_id` | UUID | FK → games | Game |
| `total_matches` | INTEGER | DEFAULT 0 | Total matches played |
| `total_kills` | INTEGER | DEFAULT 0 | Career kills |
| `total_damage` | BIGINT | DEFAULT 0 | Career damage |
| `highest_kills_match` | INTEGER | DEFAULT 0 | Best kill game |
| `avg_kills_per_match` | DECIMAL(5,2) | DEFAULT 0 | Kills per match average |
| `best_tournament_placement` | INTEGER | NULLABLE | Best finish rank |
| `last_updated` | TIMESTAMP | NOT NULL | Last recalculation time |

---

## 4.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Team Captain registers the team for a tournament, then removes a player from the main roster while the registration is pending | System flags the registration as "Incomplete" and notifies the organizer; captain must resolve roster before check-in |
| Two different teams submit the same player's UID in the same tournament simultaneously | The system accepts the first submission and flags the second as a duplicate UID conflict; organizer is alerted; neither team is automatically rejected |
| Player accepts two different team invitations for the same game | Player can be a member of both teams; the conflict is only detected at tournament registration time if both teams try to register for the same tournament |
| Team Captain deletes their GameVerse account | Captaincy must be transferred before account deletion is allowed; system blocks deletion with an explanatory modal |
| Team tries to register with fewer than the minimum required players | Registration is blocked with error: "Your roster has [X] players. The minimum required for [Game] is [Y]. Please add more players before registering." |
| Tournament organizer rejects a team's registration 2 hours before check-in | Team Captain is immediately notified via in-app notification, email, and (if enabled) SMS; refund of entry fee is automatically triggered |

---

## 4.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-04-001 | A user can create a team with all required fields and the team appears in their dashboard within 5 seconds. | Manual QA |
| AC-04-002 | A Team Captain can invite a player by username, the player receives an in-app notification within 10 seconds, and upon accepting, appears in the team roster. | E2E automated test |
| AC-04-003 | A duplicate UID (same UID in two registrations for the same tournament) is detected and flagged within 5 seconds of the second registration being submitted. | Automated test |
| AC-04-004 | A Tournament Director can view the full roster of all 64 registered teams with UIDs in a paginated table that loads within 2 seconds. | Performance test |
| AC-04-005 | A Team Captain attempting to change main roster players after check-in opens receives a clear error message and the change is blocked. | Automated test |
| AC-04-006 | Team aggregate statistics are updated within 15 minutes of a tournament being finalized. | Automated test |

---

---

## END OF PART 1

---

## Part 1 Summary

| Module | Status | Priority | Complexity |
|--------|--------|----------|-----------|
| MOD-01: Authentication & User Management | ✅ Complete | 🔴 P0 | High |
| MOD-02: Organization Management | ✅ Complete | 🔴 P0 | Medium-High |
| MOD-03: Game Configuration Management | ✅ Complete | 🔴 P0 | Medium |
| MOD-04: Team & Player Management | ✅ Complete | 🔴 P0 | Medium |

---

## Coming in Part 2

| Module | Topic |
|--------|-------|
| **MOD-05** | Tournament Management — creation, configuration, formats, schedule, lifecycle |
| **MOD-06** | Registration & Verification — entry flow, payment, UID verification, approval workflow |
| **MOD-07** | Match Scheduling & Slot Management — auto-scheduling, group generation, slot assignment |
| **MOD-08** | Secure Room Credential Management — timed release, slot-targeted distribution, leak prevention |

---

> **Document:** GameVerse PRD | **Part:** 1 of 6 | **Modules Covered:** 1–4 | **Next Part:** Modules 5–8
# 📄 DOCUMENT 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)


---

## **Project:** GameVerse — Esports Tournament Operations & Live Broadcast Platform
## **Document Type:** Product Requirements Document (PRD)
## **Part:** 2 of 6 — Tournament Core Modules (5–8)
## **Version:** 1.0
## **Date:** June 2025
## **Status:** Draft for Review

---

---

## TABLE OF CONTENTS — PART 2

- Module 5 — Tournament Management
- Module 6 — Registration & Verification
- Module 7 — Match Scheduling & Slot Management
- Module 8 — Secure Room Credential Management

---

---



# MODULE 6 — REGISTRATION & VERIFICATION

---

## 6.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-06 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | Manages the complete tournament registration pipeline — from team discovery of a tournament through registration form submission, entry fee payment, UID verification, organizer review, and final confirmation. Replaces the WhatsApp + Google Form + payment screenshot workflow that organizers currently use. |
| **Primary Users** | ROLE-07 (Team Captain), ROLE-04 (Tournament Director), ROLE-05 (Referee) |
| **Dependencies** | MOD-01, MOD-02, MOD-04, MOD-05 |
| **Estimated Complexity** | High |

---

## 6.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-06-001 | As a **Team Captain**, I want to register my team for a tournament through a simple flow that pre-fills my team roster data so that I don't have to re-enter information I've already provided. | 🔴 P0 |
| US-06-002 | As a **Team Captain**, I want to pay the entry fee securely through the platform using UPI, card, or wallet so that my registration is confirmed immediately. | 🔴 P0 |
| US-06-003 | As a **Team Captain**, I want to receive a registration confirmation with all details so that I have a record of our entry. | 🔴 P0 |
| US-06-004 | As a **Team Captain**, I want to see my registration status (pending / approved / rejected / waitlisted) so that I know whether we're confirmed for the tournament. | 🔴 P0 |
| US-06-005 | As a **Tournament Director**, I want to review and approve or reject team registrations from a centralized panel so that I maintain control over who participates. | 🔴 P0 |
| US-06-006 | As a **Tournament Director**, I want to request corrections to a team's UID data so that I can resolve verification issues without fully rejecting the registration. | 🟠 P1 |
| US-06-007 | As a **Tournament Director**, I want to bulk-approve all registrations that have passed automatic validation so that I don't have to manually approve 60+ teams individually. | 🟠 P1 |
| US-06-008 | As a **Tournament Director**, I want to manage the waitlist — promoting waitlisted teams when spots open up — so that I always have a full tournament. | 🟠 P1 |
| US-06-009 | As a **Team Captain**, I want to withdraw my team's registration before the deadline and receive a refund so that we can cancel if circumstances change. | 🟠 P1 |
| US-06-010 | As a **Tournament Director**, I want to manually register a team on their behalf so that teams who have difficulty with the platform can still participate. | 🟡 P2 |

---

## 6.3 Functional Requirements

### 6.3.1 Registration Flow (Team Side)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-06-001 | The system **shall** present a "Register" CTA on the tournament public page that initiates the registration flow. The CTA shall only be active when the tournament is in REGISTRATION_OPEN state. | 🔴 P0 |
| FR-06-002 | The registration flow **shall** consist of the following steps: Step 1 — Select Team, Step 2 — Confirm Roster & UIDs, Step 3 — Review Rules & Accept, Step 4 — Payment, Step 5 — Confirmation. | 🔴 P0 |
| FR-06-003 | **Step 1 — Select Team:** The system **shall** list all teams the registering user captains that are eligible for the tournament's game. If the user has no eligible team, the system shall prompt them to create one first. | 🔴 P0 |
| FR-06-004 | **Step 2 — Confirm Roster & UIDs:** The system **shall** display the selected team's current roster with each player's linked UID for the tournament's game. The captain shall be able to: (a) select which players to include (if roster > max team size), (b) manually enter UIDs for players who haven't linked their game account, (c) designate the substitute player (if allowed). Each UID field shall show validation status in real time. | 🔴 P0 |
| FR-06-005 | The system **shall** run the following automatic checks upon roster submission: (a) UID format validation against game regex, (b) minimum team size check, (c) duplicate UID detection within the tournament (same UID already registered in another team), (d) blacklist UID check (if enabled by organizer). Results must be displayed before the user proceeds to payment. | 🔴 P0 |
| FR-06-006 | **Step 3 — Review Rules & Accept:** The system **shall** display the full tournament rules and code of conduct. The user must scroll to the end and check an explicit acknowledgment checkbox: "I have read and agree to the tournament rules and code of conduct." This action is logged with timestamp and IP. | 🟠 P1 |
| FR-06-007 | **Step 4 — Payment:** For paid tournaments, the system **shall** redirect to the payment gateway (Razorpay integration) to process the entry fee. The system shall support: UPI (GPay, PhonePe, Paytm UPI), cards (Visa, Mastercard, RuPay), and wallets (Paytm wallet). For free tournaments, this step is skipped. | 🔴 P0 |
| FR-06-008 | The system **shall** hold team slot reservation for 15 minutes during the payment flow. If payment is not completed within 15 minutes, the reservation is released and the team must restart registration. A countdown timer must be displayed during the payment step. | 🔴 P0 |
| FR-06-009 | **Step 5 — Confirmation:** Upon successful registration (and payment for paid tournaments), the system **shall** display a confirmation screen with: registration ID, team details, registered player list, registration status, tournament schedule summary, and next steps (check-in date, discord link, etc.). A confirmation email shall be sent to the Team Captain within 60 seconds. | 🔴 P0 |
| FR-06-010 | When a tournament is full (all slots taken), the system **shall** offer "Join Waitlist" instead of "Register." Waitlisted teams do not pay until promoted to a confirmed slot. | 🟠 P1 |

### 6.3.2 Registration Management (Organizer Side)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-06-011 | The system **shall** provide Tournament Directors with a Registration Management panel showing all registrations in a paginated, sortable table with columns: team name, registration time, status, payment status, UID validation status, and actions. | 🔴 P0 |
| FR-06-012 | The Registration Management panel **shall** support the following actions per registration: View Full Roster, Approve, Reject, Request Correction, Move to Waitlist, and Download as PDF (individual registration card). | 🔴 P0 |
| FR-06-013 | The system **shall** support bulk actions on the Registration Management panel: Approve All Validated, Reject Selected, Request Correction (with template message), Export All to CSV. | 🟠 P1 |
| FR-06-014 | When an organizer selects **"Request Correction"**, the system **shall** present a form where the organizer specifies: which player(s) need correction, what needs to be corrected (dropdown + free text), and a deadline for the correction. The Team Captain is notified automatically. | 🟠 P1 |
| FR-06-015 | When a Team Captain submits a correction, the registration status changes from "Correction Requested" to "Correction Submitted" and the organizer is notified. | 🟠 P1 |
| FR-06-016 | The system **shall** allow organizers to set a **correction deadline** — if a correction is not submitted by the deadline, the registration is automatically rejected and a refund is triggered. | 🟠 P1 |
| FR-06-017 | When an organizer **approves** a registration, the system **shall**: update registration status to "Approved," send a confirmation notification to the Team Captain, and increment the confirmed team count on the tournament. | 🔴 P0 |
| FR-06-018 | When an organizer **rejects** a registration, the system **shall**: require the organizer to enter a rejection reason, update the registration status to "Rejected," notify the Team Captain with the rejection reason, and trigger an automatic refund of the entry fee within 24 hours. | 🔴 P0 |

### 6.3.3 Waitlist Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-06-019 | The system **shall** maintain a waitlist in strict FIFO order (first to join waitlist = first to be promoted). | 🟠 P1 |
| FR-06-020 | When a confirmed team withdraws or is rejected, the system **shall** automatically notify the first team on the waitlist that a slot is available. The waitlisted team has 2 hours to accept and complete payment before the slot moves to the next team on the waitlist. | 🟠 P1 |
| FR-06-021 | The system **shall** allow organizers to manually promote any waitlisted team to a confirmed slot (skipping FIFO order) with a logged justification. | 🟡 P2 |
| FR-06-022 | The system **shall** display each waitlisted team their current position in the queue (e.g., "You are #3 on the waitlist"). | 🟠 P1 |

### 6.3.4 Registration Withdrawal & Refunds

| ID | Requirement | Priority |
|----|------------|---------|
| FR-06-023 | The system **shall** allow Team Captains to withdraw their registration before the registration close date. The refund amount shall be based on the organizer's configured refund policy: (a) Full refund (default), (b) Partial refund (%, configurable), (c) No refund after X days before tournament. | 🟠 P1 |
| FR-06-024 | The system **shall** process all refunds back to the original payment method. Refund processing time shall be displayed to the user (typically 5–7 business days for card refunds, instant for UPI). | 🟠 P1 |
| FR-06-025 | All refund transactions **shall** be logged with: trigger (withdrawal / rejection / cancellation / correction timeout), amount, original payment reference, refund reference, and status. | 🟠 P1 |

### 6.3.5 UID Verification Deep Dive

| ID | Requirement | Priority |
|----|------------|---------|
| FR-06-026 | The system **shall** run the following multi-layer UID validation pipeline for each registered player: Layer 1 — Format validation (regex), Layer 2 — Uniqueness check (not in another team in same tournament), Layer 3 — Profile match (UID matches the player's verified linked game account, if available), Layer 4 — Blacklist check (if enabled). | 🔴 P0 |
| FR-06-027 | The system **shall** display the UID validation result for each player as a color-coded badge in the registration management panel: 🟢 Verified (matches linked profile + format valid), 🟡 Format Valid (passes format check but not linked to a profile), 🔴 Invalid (fails format check or flagged). | 🔴 P0 |
| FR-06-028 | The system **shall** provide organizers with a one-click "Export Registration Data" function that generates a CSV containing: team name, team tag, player display names, in-game usernames, UIDs, registration time, payment status, and validation status. | 🟠 P1 |

---

## 6.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-06-001 | A team can have only one active registration per tournament. Attempting to register the same team twice in the same tournament shall be blocked. |
| BR-06-002 | Individual players (identified by UID) can only be registered in one team per tournament. Cross-team duplicate UIDs are always blocked, regardless of approval mode. |
| BR-06-003 | In "invite-only" approval mode, the organizer must explicitly send invitations to specific teams or players. Only invited teams can register. Uninvited teams see the tournament as "Invite Only" and cannot initiate registration. |
| BR-06-004 | The platform charges a service fee of 5% on all entry fee transactions. This fee is deducted before transferring the entry fee collection to the organizer's payout account. Free plan organizers pay 8%. |
| BR-06-005 | Payments are held in escrow until the tournament is marked COMPLETED. Upon completion, funds are released to the organizer's payout account minus the platform fee and prize pool reservation. |
| BR-06-006 | If the platform cancels a tournament (e.g., due to org suspension), 100% refund is issued to all teams regardless of the organizer's stated refund policy. |

---

## 6.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-06-001 | The registration flow must show a persistent progress bar at the top of every step (Step X of 5) with step names listed. |
| UX-06-002 | UID validation must happen in real time as the captain types each UID (debounced at 800ms), not just on form submit, so errors are caught early. |
| UX-06-003 | The slot reservation countdown (15-minute payment window) must be prominently displayed as a large countdown timer that pulses red when under 3 minutes. |
| UX-06-004 | The organizer's registration management panel must show a visual summary bar at the top: total slots, pending, approved, rejected, waitlisted — as a segmented horizontal bar with counts. |
| UX-06-005 | "Request Correction" messages sent to Team Captains must be formatted as a structured message (not free text only) showing: team name, player name, specific field to correct, and deadline — to avoid ambiguity. |
| UX-06-006 | All monetary values must be displayed in Indian Rupee format (₹X,XX,XXX) throughout the registration flow. |

---

## 6.6 Data Requirements

### 6.6.1 TournamentRegistrations Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `registration_id` | UUID | PK | Unique registration ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `team_id` | UUID | FK → teams | Registered team |
| `registered_by` | UUID | FK → users | Team Captain who registered |
| `status` | ENUM | NOT NULL | 'pending','approved','rejected','waitlisted','withdrawn','correction_requested','correction_submitted' |
| `waitlist_position` | SMALLINT | NULLABLE | Position in waitlist queue |
| `entry_fee_paid` | INTEGER | DEFAULT 0 | Amount paid in paise |
| `payment_status` | ENUM | DEFAULT 'unpaid' | 'unpaid','pending','paid','refunded','partial_refund' |
| `payment_reference` | VARCHAR(100) | NULLABLE | Payment gateway reference |
| `payment_method` | ENUM | NULLABLE | 'upi','card','wallet','free' |
| `payment_completed_at` | TIMESTAMP | NULLABLE | Payment timestamp |
| `rules_accepted` | BOOLEAN | DEFAULT FALSE | Rules acknowledgment |
| `rules_accepted_at` | TIMESTAMP | NULLABLE | Rules acceptance timestamp |
| `rules_accepted_ip` | INET | NULLABLE | IP at rules acceptance |
| `rejection_reason` | TEXT | NULLABLE | Organizer's rejection reason |
| `correction_deadline` | TIMESTAMP | NULLABLE | Correction submission deadline |
| `approved_by` | UUID | FK → users, NULLABLE | Who approved |
| `approved_at` | TIMESTAMP | NULLABLE | Approval timestamp |
| `slot_reserved_until` | TIMESTAMP | NULLABLE | Payment window expiry |
| `created_at` | TIMESTAMP | NOT NULL | Registration creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 6.6.2 RegistrationRoster Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `roster_id` | UUID | PK | Record ID |
| `registration_id` | UUID | FK → tournament_registrations | Registration |
| `user_id` | UUID | FK → users, NULLABLE | Platform user (if exists) |
| `player_display_name` | VARCHAR(50) | NOT NULL | Display name at time of registration |
| `in_game_uid` | VARCHAR(50) | NOT NULL | Player UID |
| `in_game_username` | VARCHAR(50) | NOT NULL | In-game name at registration |
| `is_substitute` | BOOLEAN | DEFAULT FALSE | Substitute player flag |
| `is_captain` | BOOLEAN | DEFAULT FALSE | Team captain flag |
| `uid_validation_status` | ENUM | DEFAULT 'pending' | 'pending','verified','format_valid','invalid','flagged' |
| `uid_validation_details` | JSONB | NULLABLE | Validation layer results |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |

---

## 6.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Payment succeeds but webhook from Razorpay fails to reach platform | Implement idempotent webhook retry with exponential backoff; maintain a payment reconciliation job that runs every 15 minutes; flag discrepancies for manual review |
| Two teams complete payment simultaneously for the last available slot | The slot reservation system prevents this — only one team can hold a slot reservation at a time; the second team is automatically redirected to the waitlist after their payment |
| Team Captain registers and pays, then another player in their roster registers with a different team in the same tournament | The second player's new registration flags the cross-team duplicate UID conflict; both Team Captains and the organizer are notified |
| Organizer requests correction after payment close date | System allows correction request but automatically extends payment deadline for the affected team if a refund/re-registration is required |
| Waitlisted team's 2-hour promotion window expires | Slot passes to next team on waitlist; original team is notified that their opportunity expired and they remain on waitlist for the next available slot |

---

## 6.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-06-001 | A Team Captain can complete the full registration flow (team selection → roster confirmation → rules → payment → confirmation) in under 5 minutes for a team with pre-linked UIDs. | Manual QA (timed) |
| AC-06-002 | A duplicate UID (already registered in another team) is detected and displayed as an error before the captain reaches the payment step. | Automated test |
| AC-06-003 | A successful payment via UPI reflects as "Paid" status in the organizer's registration panel within 30 seconds of payment completion. | E2E automated test |
| AC-06-004 | Bulk-approving 50 validated registrations completes within 10 seconds. | Performance test |
| AC-06-005 | When the last slot is filled, the "Register Now" button on the public page changes to "Join Waitlist" within 5 seconds without page refresh. | Manual QA |
| AC-06-006 | A rejected team's entry fee refund is initiated within 5 minutes of rejection, and the team captain receives notification of the refund. | E2E automated test |

---

---



# MODULE 8 — SECURE ROOM CREDENTIAL MANAGEMENT

---

## 8.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-08 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | This module solves one of the most critical operational problems in Indian mobile esports: **insecure and poorly-timed Room ID and Password distribution**. Currently, organizers post room credentials in public WhatsApp groups, allowing unauthorized players to join, causing lobby chaos, match delays, and competitive integrity failures. This module implements timed, slot-specific, encrypted room credential distribution. |
| **Primary Users** | ROLE-04 (Tournament Director), ROLE-05 (Referee), ROLE-07 (Team Captain) |
| **Dependencies** | MOD-05, MOD-06, MOD-07 |
| **Estimated Complexity** | High |

---

## 8.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-08-001 | As a **Referee**, I want to enter the Room ID and Password for a match into the platform so that it can be distributed securely to only the teams assigned to that match. | 🔴 P0 |
| US-08-002 | As a **Team Captain**, I want to receive my Room ID and Password privately on the platform — visible only to me and my team — so that the credentials cannot be leaked to unauthorized players. | 🔴 P0 |
| US-08-003 | As a **Referee**, I want to release room credentials at a specific time (e.g., 5 minutes before match start) so that distribution is controlled and timely. | 🔴 P0 |
| US-08-004 | As a **Tournament Director**, I want the platform to notify all team captains of their specific slot number along with room credentials so that they know exactly where to join in the custom room. | 🔴 P0 |
| US-08-005 | As a **Referee**, I want to rotate (replace) room credentials if they are compromised or the room crashes, and notify teams of the new credentials immediately. | 🟠 P1 |
| US-08-006 | As a **Tournament Director**, I want to see an audit log of when credentials were entered, when they were released, and which team captains have viewed them so that I have full accountability. | 🟠 P1 |
| US-08-007 | As a **Team Captain**, I want to receive a push notification when room credentials are available so that my team is ready to join immediately. | 🔴 P0 |
| US-08-008 | As a **Referee**, I want to lock room credentials after the match starts so that latecomers cannot join mid-match using the platform's disclosed credentials. | 🟠 P1 |

---

## 8.3 Functional Requirements

### 8.3.1 Credential Entry & Storage

| ID | Requirement | Priority |
|----|------------|---------|
| FR-08-001 | The system **shall** provide Referees and Tournament Directors with a Room Credential input form accessible from the Match Operations panel, containing: Room ID field, Password field, and Release Mode selector. | 🔴 P0 |
| FR-08-002 | Room credentials **shall** be encrypted at rest using AES-256 encryption. The encryption key must be stored separately from the database in a secrets management service (e.g., AWS Secrets Manager or HashiCorp Vault). | 🔴 P0 |
| FR-08-003 | The system **shall** support the following Release Modes for credentials: (a) **Manual Release** — credentials are released when the Referee explicitly clicks "Release Now," (b) **Scheduled Release** — credentials are released automatically at a specified time, (c) **Match-Start Minus X** — credentials are released X minutes before the scheduled match start time (e.g., 10 minutes before). | 🔴 P0 |
| FR-08-004 | The system **shall** allow Referees to enter credentials for multiple upcoming matches in advance, with each set scheduled for release at different times. This enables pre-loading all room credentials at the start of the day. | 🟠 P1 |
| FR-08-005 | The system **shall** validate room credential format for each supported game: BGMI Room ID is 6–8 digits; Free Fire Room ID is 8–10 digits. Invalid formats produce a warning (not a block, to accommodate format changes). | 🟠 P1 |

### 8.3.2 Credential Distribution

| ID | Requirement | Priority |
|----|------------|---------|
| FR-08-006 | Upon credential release, the system **shall** make the Room ID and Password **exclusively visible** to: (a) Team Captains assigned to that specific match (identified by their slot assignment), (b) Players registered under those teams (secondary view, read-only), (c) Tournament staff (Referees, Tournament Directors, Org Admins, Org Owner). NO other user shall be able to view the credentials. | 🔴 P0 |
| FR-08-007 | Each Team Captain **shall** receive their room credentials on a dedicated **Credential Card** that includes: Match number, Round number, Scheduled start time, Room ID, Password, Their team's assigned slot number, and a visual instruction: "Join the custom room → go to Slot [X]." | 🔴 P0 |
| FR-08-008 | The Credential Card **shall** be displayed in a non-copyable format by default (CSS `user-select: none`, screenshot detection overlay) with a separate "Copy Room ID" and "Copy Password" button that copies individual fields and logs the copy action. | 🟠 P1 |
| FR-08-009 | Upon credential release, the system **shall** simultaneously: (a) make the Credential Card visible in the Team Captain's dashboard, (b) send an in-app push notification to the Team Captain, (c) send an SMS notification (if mobile notifications are enabled) to the Team Captain, (d) log the release event with timestamp. | 🔴 P0 |
| FR-08-010 | The system **shall** track every view of a Credential Card, recording: user ID, role, timestamp, IP address, and device. This view log is accessible to Tournament Directors and Super Admins. | 🟠 P1 |
| FR-08-011 | The system **shall** support an optional **One-Time View Mode** — where each Team Captain can view credentials a maximum of N times (configurable, default: unlimited during match window) — for high-security tournaments. | 🟢 P3 |

### 8.3.3 Credential Rotation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-08-012 | The system **shall** allow Referees to rotate (replace) room credentials for any match that has not yet reached "Completed" status. Rotating credentials requires entering the new Room ID and Password and confirming the action. | 🟠 P1 |
| FR-08-013 | Upon credential rotation, the system **shall**: (a) immediately invalidate the old credentials (Credential Cards update to show new credentials), (b) send an urgent push notification to all affected Team Captains: "⚠️ Room credentials have been updated for Match [X]. Check your updated Room ID and Password," (c) log the rotation event with the rotating user's identity and reason. | 🟠 P1 |
| FR-08-014 | The system **shall** maintain a version history of credentials for each match, storing all previous credential versions (encrypted) for audit purposes. Previous versions are not visible to Team Captains. | 🟠 P1 |

### 8.3.4 Credential Lockdown

| ID | Requirement | Priority |
|----|------------|---------|
| FR-08-015 | The system **shall** allow Referees to manually lock credentials for a match when the match has started. Once locked, credentials are no longer accessible to Team Captains (their Credential Card shows "Match in progress — credentials locked"). | 🟠 P1 |
| FR-08-016 | The system **shall** optionally auto-lock credentials at a configurable time after the scheduled match start (default: 10 minutes after start). Auto-lock can be disabled by the Tournament Director if needed. | 🟡 P2 |
| FR-08-017 | Credentials for completed matches **shall** be automatically locked. The Credential Card for past matches shows "Match Completed" instead of the credential. | 🟠 P1 |

### 8.3.5 Audit & Security

| ID | Requirement | Priority |
|----|------------|---------|
| FR-08-018 | The system **shall** maintain a complete, immutable audit trail for each set of credentials, recording: creation, scheduled release time, actual release time, every view (with user + timestamp), rotation events, and lockdown time. | 🟠 P1 |
| FR-08-019 | If a match is suspected of credential leakage (e.g., unauthorized players appear in the lobby), the Referee can flag the match as "Suspected Leak." This triggers: (a) immediate rotation of credentials, (b) an incident report creation in the Dispute Resolution module (MOD-20), (c) a notification to the Tournament Director. | 🟡 P2 |
| FR-08-020 | The system **shall** rate-limit access to the Credential Card view endpoint — maximum 10 views per minute per user per match — to prevent automated scraping. | 🟠 P1 |
| FR-08-021 | Room credentials **shall never** appear in: platform-wide notifications (only match-specific secure notifications), chat messages, announcement feeds, or any third-party integrations. Credentials are strictly isolated to the secure Credential Card view. | 🔴 P0 |

---

## 8.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-08-001 | Room credentials can only be entered by users with the Referee, Tournament Director, Org Admin, or Org Owner role for the specific tournament. Players and Team Captains cannot enter room credentials under any circumstances. |
| BR-08-002 | A Team Captain can only view credentials for matches that their team is assigned to via MatchSlots. Viewing credentials for matches they are not assigned to is forbidden and returns a 403 error. |
| BR-08-003 | Credentials must be entered before the scheduled release time. If a Scheduled Release is configured but credentials haven't been entered, the system sends an alert to the Tournament Director 30 minutes before the release time. |
| BR-08-004 | If credentials have not been entered 5 minutes past the scheduled release time, the system escalates with an urgent alert and attempts to contact all available tournament staff. The scheduled release fails silently — credentials cannot be released if they haven't been entered. |
| BR-08-005 | Exporting or screenshotting credentials from the platform is technically discouraged (CSS protections) but not technically enforced at the OS level. All export actions are logged. |

---

## 8.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-08-001 | The Credential Card must use a visually distinct design — dark background, large monospace font for Room ID and Password, with a "CONFIDENTIAL" watermark — to communicate that this is sensitive information. |
| UX-08-002 | The slot number display on the Credential Card must be the most prominent visual element (larger font than Room ID/Password) since it determines where the team joins in-game. |
| UX-08-003 | The Referee's credential management panel must show all matches for the current round in a list with visual status indicators: "Credentials Entered" (green lock icon), "Awaiting Credentials" (red unlock icon), "Released" (blue check), "Locked" (grey lock). |
| UX-08-004 | When credentials are released, Team Captains must see a red pulsing notification badge on the credential section of their match dashboard — not just a notification bell. |
| UX-08-005 | The "Copy Room ID" and "Copy Password" buttons must be separate from each other and copy individually (not copy both at once). This reduces the risk of accidentally sharing both credentials together. |
| UX-08-006 | Credential rotation must display a before/after comparison to the referee before confirming: showing old Room ID (masked) and new Room ID (masked) side by side. |

---

## 8.6 Data Requirements

### 8.6.1 RoomCredentials Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `credential_id` | UUID | PK | Unique credential set ID |
| `match_id` | UUID | FK → matches | Associated match |
| `room_id_encrypted` | TEXT | NOT NULL | AES-256 encrypted Room ID |
| `password_encrypted` | TEXT | NOT NULL | AES-256 encrypted Password |
| `room_id_hash` | VARCHAR(64) | NOT NULL | SHA-256 hash for dedup detection |
| `version` | SMALLINT | DEFAULT 1 | Credential version (increments on rotation) |
| `is_current` | BOOLEAN | DEFAULT TRUE | Active credential flag |
| `release_mode` | ENUM | NOT NULL | 'manual','scheduled','match_minus_x' |
| `release_at` | TIMESTAMP | NULLABLE | Scheduled release time |
| `release_offset_minutes` | SMALLINT | NULLABLE | X for 'match_minus_x' mode |
| `released_at` | TIMESTAMP | NULLABLE | Actual release timestamp |
| `released_by` | UUID | FK → users, NULLABLE | Who triggered release |
| `is_locked` | BOOLEAN | DEFAULT FALSE | Lockdown status |
| `locked_at` | TIMESTAMP | NULLABLE | Lockdown timestamp |
| `locked_by` | UUID | FK → users, NULLABLE | Who locked |
| `is_suspected_leak` | BOOLEAN | DEFAULT FALSE | Leak flag |
| `entered_by` | UUID | FK → users | Who entered the credentials |
| `entered_at` | TIMESTAMP | NOT NULL | Entry timestamp |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 8.6.2 CredentialViews Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `view_id` | UUID | PK | View record ID |
| `credential_id` | UUID | FK → room_credentials | Which credential was viewed |
| `match_id` | UUID | FK → matches | Match reference |
| `user_id` | UUID | FK → users | Who viewed |
| `user_role` | VARCHAR(30) | NOT NULL | Role at time of view |
| `team_id` | UUID | FK → teams, NULLABLE | Team if viewer is a captain |
| `ip_address` | INET | NOT NULL | Viewer IP |
| `user_agent` | TEXT | NOT NULL | Device/browser |
| `viewed_at` | TIMESTAMP | NOT NULL | View timestamp |
| `action_type` | ENUM | NOT NULL | 'view','copy_room_id','copy_password' |

### 8.6.3 CredentialHistory Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `history_id` | UUID | PK | Record ID |
| `match_id` | UUID | FK → matches | Match |
| `credential_id` | UUID | FK → room_credentials | Credential version |
| `version_number` | SMALLINT | NOT NULL | Version at time of superseding |
| `rotated_by` | UUID | FK → users | Who rotated |
| `rotation_reason` | TEXT | NULLABLE | Reason for rotation |
| `rotated_at` | TIMESTAMP | NOT NULL | Rotation timestamp |

---

## 8.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Referee schedules auto-release for 3:00 PM but server has a processing delay at that time | Implement a background job queue (Redis-based) with retry mechanism; if release job fires up to 5 minutes late, it executes normally; if delayed beyond 5 minutes, a manual release alert is sent to the Tournament Director |
| Team Captain tries to view credentials before they are released | Credential Card shows countdown timer: "Room credentials will be available in [HH:MM:SS]" |
| Credential release notification fails (push/SMS delivery failure) | The credential is still released (visible on platform); the failed notification is retried 3 times; if all retries fail, the Tournament Director receives an alert listing which captains didn't receive notifications |
| Referee accidentally enters wrong Room ID and releases credentials | Support immediate rotation (FR-08-012); old credentials are invalidated within seconds; new credentials distributed with urgent notification |
| Team Captain is offline when credentials are released | Credentials remain visible on their Credential Card until the match is locked. The platform does not "expire" credentials because the captain wasn't online at release time |
| Multiple referees try to enter credentials for the same match simultaneously | First submission is accepted; second submission returns: "Credentials for this match have already been entered by [Referee Name]. Would you like to rotate them?" |

---

## 8.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-08-001 | Credentials entered by a Referee are not visible to any Team Captain until explicitly released. | Automated security test |
| AC-08-002 | Upon manual release, all Team Captains assigned to the match receive their Credential Card notification within 5 seconds. | Performance test |
| AC-08-003 | A Team Captain assigned to Match 3 cannot access the Credential Card for Match 5 (returns 403). | Automated API security test |
| AC-08-004 | Credential rotation completes and all affected Team Captains see the updated credentials within 10 seconds of the rotation being confirmed. | E2E automated test |
| AC-08-005 | Credentials stored in the database are AES-256 encrypted and cannot be read directly from a database dump without the encryption key. | Security audit |
| AC-08-006 | The complete view audit log for a set of credentials (100 views) loads within 2 seconds in the organizer's audit panel. | Performance test |
| AC-08-007 | Scheduled auto-release triggers within ±60 seconds of the configured time under normal system load. | Automated test |

---

---

## END OF PART 2

---

## Part 2 Summary

| Module | Status | Priority | Complexity |
|--------|--------|----------|-----------|
| MOD-05: Tournament Management | ✅ Complete | 🔴 P0 | Very High |
| MOD-06: Registration & Verification | ✅ Complete | 🔴 P0 | High |
| MOD-07: Match Scheduling & Slot Management | ✅ Complete | 🔴 P0 | High |
| MOD-08: Secure Room Credential Management | ✅ Complete | 🔴 P0 | High |

---

## Coming in Part 3

| Module | Topic |
|--------|-------|
| **MOD-09** | Match Day Operations — check-in system, match status flow, referee tools, match control panel |
| **MOD-10** | Live Scoring & Points Engine — real-time kill/placement entry, score calculation, validation rules |
| **MOD-11** | Leaderboard Engine — real-time standings, WebSocket updates, multi-round cumulative scoring |
| **MOD-12** | Live Streaming & Broadcast Integration — stream management, viewer experience, multi-stream support |

---

> **Document:** GameVerse PRD | **Part:** 2 of 6 | **Modules Covered:** 5–8 | **Next Part:** Modules 9–12
# 📄 DOCUMENT 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)


---

## **Project:** GameVerse — Esports Tournament Operations & Live Broadcast Platform
## **Document Type:** Product Requirements Document (PRD)
## **Part:** 3 of 6 — Live Operations Modules (9–12)
## **Version:** 1.0
## **Date:** June 2025
## **Status:** Draft for Review

---

---

## TABLE OF CONTENTS — PART 3

- Module 9 — Match Day Operations
- Module 10 — Live Scoring & Points Engine
- Module 11 — Leaderboard Engine
- Module 12 — Live Streaming & Broadcast Integration

---

---





---

# ECOSYSTEM SIDE: 3. 📺 PUBLIC LIVE TOURNAMENT WEBSITE

---

# MODULE 11 — LEADERBOARD ENGINE

---

## 11.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-11 |
| **Priority** | 🔴 P0 — Critical |
| **Description** | The Leaderboard Engine maintains and delivers real-time tournament standings — calculating cumulative points across all completed matches, applying tiebreaker rules, managing multi-round standings, and pushing live updates to all consumers (web UI, OBS overlays, public tournament page, mobile apps). This module eliminates the 10–20 minute delay between match completion and leaderboard update that currently plagues manual scoring workflows. |
| **Primary Users** | All roles (read-only for most; write access via MOD-10 triggers only) |
| **Dependencies** | MOD-03 (Scoring Config), MOD-07 (Schedule), MOD-10 (Scoring Engine) |
| **Estimated Complexity** | High |

---

## 11.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-11-001 | As a **Tournament Director**, I want the leaderboard to update automatically within seconds of results being published so that teams and viewers always see current standings. | 🔴 P0 |
| US-11-002 | As a **Team Captain**, I want to see my team's current tournament standing — rank, total points, and points breakdown by match — so that I can track our progress. | 🔴 P0 |
| US-11-003 | As a **viewer**, I want to see a live leaderboard on the tournament page that updates in real time during the event so that I'm always up-to-date without refreshing. | 🔴 P0 |
| US-11-004 | As a **Broadcast Producer**, I want the leaderboard data to be available as a JSON endpoint so that my OBS overlay can pull and display live standings automatically. | 🔴 P0 |
| US-11-005 | As a **Tournament Director**, I want tiebreakers to be resolved automatically according to the configured tiebreaker sequence so that standings are always unambiguous. | 🔴 P0 |
| US-11-006 | As a **viewer**, I want to see per-match breakdown details for each team — their placement and kills in each round — so that I understand how standings were achieved. | 🟠 P1 |
| US-11-007 | As a **Tournament Director**, I want to see separate leaderboards for each group and each round in a group-stage tournament so that I can track advancement at each stage. | 🟠 P1 |
| US-11-008 | As a **Tournament Director**, I want to manually lock the leaderboard before prize distribution so that no further changes can alter the final standings. | 🟠 P1 |

---

## 11.3 Functional Requirements

### 11.3.1 Leaderboard Calculation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-11-001 | The system **shall** maintain a **live leaderboard** for every active tournament. The leaderboard represents the current cumulative standings of all participating teams based on all published match results. | 🔴 P0 |
| FR-11-002 | The leaderboard calculation algorithm **shall** execute as follows: (1) Retrieve all published team_match_results for the tournament, (2) Group by team (registration_id), (3) Sum total_match_points for each team across all matches, (4) Count chicken dinners (placement = 1) per team, (5) Sum effective_kills per team across all matches, (6) Apply tiebreaker sequence to sort teams with identical total points, (7) Assign final rank (1st, 2nd, 3rd...). | 🔴 P0 |
| FR-11-003 | The system **shall** apply the configured tiebreaker sequence automatically when two or more teams have identical total points. Default tiebreaker sequence: (1) Most chicken dinners, (2) Most total kills, (3) Best single-match points (highest points scored in any one match). If still tied after all tiebreakers, teams share the same rank. | 🔴 P0 |
| FR-11-004 | The system **shall** support configuring custom tiebreaker sequences per tournament, with the following available criteria: (a) Most chicken dinners, (b) Most total kills, (c) Most total damage, (d) Best single-match rank (lowest placement number in any match), (e) Best single-match points, (f) Fewest matches with last-place finish, (g) Head-to-head match performance. | 🟠 P1 |
| FR-11-005 | The system **shall** automatically trigger a full leaderboard recalculation whenever: (a) a new match result is published, (b) an existing match result is corrected, (c) a team is disqualified, (d) a match is voided. | 🔴 P0 |
| FR-11-006 | The leaderboard recalculation **shall** complete within 5 seconds for tournaments with up to 256 teams and 12 rounds. | 🔴 P0 |
| FR-11-007 | The system **shall** cache the most recently calculated leaderboard in Redis (or equivalent in-memory store) with a TTL of 60 seconds. Cache is invalidated and refreshed immediately upon any result change event. | 🔴 P0 |

### 11.3.2 Leaderboard Views

| ID | Requirement | Priority |
|----|------------|---------|
| FR-11-008 | The system **shall** provide the following leaderboard view types: (a) **Overall Tournament Leaderboard** — cumulative standings across all rounds, (b) **Round-Specific Leaderboard** — standings for a single round only, (c) **Group Leaderboard** — standings within a specific group (for group stage formats), (d) **Match-Specific Results** — placement and kills for all teams in a single match. | 🔴 P0 |
| FR-11-009 | Each leaderboard row **shall** display the following columns: Rank (#), Movement Indicator (▲ up / ▼ down / — same, compared to previous standing), Team Name, Team Tag, Total Points, Chicken Dinners, Total Kills, Matches Played, and Per-Match Point Breakdown (expandable row). | 🔴 P0 |
| FR-11-010 | The **Per-Match Point Breakdown** (expandable row) **shall** show: for each match the team played — match number, placement, kills, and points earned. Matches not yet played show a placeholder "—". | 🟠 P1 |
| FR-11-011 | The system **shall** highlight the **qualification cutoff line** in group stage formats — a visual line separating teams that advance from teams that are eliminated, based on the configured advancement spots. Teams above the line have a green rank background; teams on the bubble (within 3 positions of the cutoff) have a yellow background. | 🟠 P1 |
| FR-11-012 | The system **shall** provide a **"What-If" simulator** on the leaderboard page (tournament director only) — allowing the director to input hypothetical remaining match results and see how the leaderboard would look. This helps directors understand advancement implications before results are official. | 🟢 P3 |

### 11.3.3 Real-Time Distribution

| ID | Requirement | Priority |
|----|------------|---------|
| FR-11-013 | The system **shall** push leaderboard updates to all connected clients via **WebSocket connections** (using Socket.IO or native WebSocket protocol). Every leaderboard update event is broadcast to all clients subscribed to the tournament's leaderboard channel. | 🔴 P0 |
| FR-11-014 | WebSocket events **shall** use the following structure for leaderboard updates: | 🔴 P0 |

```json
{
  "event": "leaderboard_updated",
  "tournament_id": "uuid",
  "timestamp": "ISO8601",
  "trigger": "match_result_published",
  "trigger_match_id": "uuid",
  "leaderboard": [
    {
      "rank": 1,
      "previous_rank": 3,
      "movement": "up",
      "team_id": "uuid",
      "team_name": "Hydra Esports",
      "team_tag": "HDRA",
      "total_points": 47.0,
      "chicken_dinners": 2,
      "total_kills": 32,
      "matches_played": 4,
      "match_breakdown": [
        {"match": 1, "placement": 2, "kills": 8, "points": 20.0},
        {"match": 2, "placement": 1, "kills": 12, "points": 27.0}
      ]
    }
  ]
}
```

| ID | Requirement | Priority |
|----|------------|---------|
| FR-11-015 | The system **shall** provide a **public REST API endpoint** for leaderboard data: `GET /api/v1/tournaments/{id}/leaderboard` that returns the current leaderboard as JSON. This endpoint shall be accessible without authentication for public tournaments and is used by OBS overlays (MOD-13). Rate limit: 60 requests per minute per IP. | 🔴 P0 |
| FR-11-016 | The system **shall** support **leaderboard snapshots** — timestamped frozen copies of the leaderboard at specific points in time (e.g., after each round completes). Snapshots are used for: historical analysis, dispute resolution evidence, and "round winner" announcements. | 🟠 P1 |

### 11.3.4 Leaderboard Locking

| ID | Requirement | Priority |
|----|------------|---------|
| FR-11-017 | The system **shall** allow Tournament Directors to **lock the leaderboard** once the tournament is complete. A locked leaderboard: (a) prevents any further score corrections from changing standings, (b) marks the final standings as "Official," (c) triggers the prize distribution calculation (MOD-16). | 🟠 P1 |
| FR-11-018 | A locked leaderboard **shall** display an "Official Final Standings" banner on the public tournament page. | 🟠 P1 |

### 11.3.5 Leaderboard Display Customization

| ID | Requirement | Priority |
|----|------------|---------|
| FR-11-019 | Tournament Directors **shall** be able to configure which columns are shown on the public leaderboard: (a) always show: rank, team name, total points, (b) optionally show/hide: kills, chicken dinners, matches played, damage. | 🟡 P2 |
| FR-11-020 | The system **shall** support a **top-N display mode** — showing only the top N teams on the public leaderboard (e.g., "Top 10" for a 64-team tournament) to focus viewer attention on the leaders. The full leaderboard remains visible in a secondary "Full Standings" tab. | 🟡 P2 |

---

## 11.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-11-001 | Leaderboard rankings are always computed server-side. Client-side ranking computation is not supported to ensure consistency across all consumers. |
| BR-11-002 | Teams that are disqualified at the tournament level appear at the bottom of the leaderboard with a "DQ" tag and their points are shown in strikethrough format. They do not hold a numbered rank. |
| BR-11-003 | Teams that have not yet played any matches appear at the bottom of the leaderboard (below all teams with any points) with 0 points and a "Upcoming" tag. |
| BR-11-004 | For group stage formats, the overall tournament leaderboard is only generated after the group stage is complete. During group stage, only group-specific leaderboards are shown. |
| BR-11-005 | Leaderboard locking is irreversible within the tournament system. Unlocking a locked leaderboard requires Super Admin action and creates an audit log entry. |

---

## 11.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-11-001 | Leaderboard rank changes must be animated — rows smoothly sliding up or down to their new position when the leaderboard updates — to visually communicate the change to viewers and players. |
| UX-11-002 | The movement indicator (▲/▼/—) must be color-coded: green arrow up for improvement, red arrow down for position loss, grey dash for no change. The number of positions moved must be shown: "▲3." |
| UX-11-003 | The qualification cutoff line must be a visually prominent horizontal separator (2px red dashed line) with a label: "— Advancement Line (Top 3 advance) —". |
| UX-11-004 | On mobile, the leaderboard must default to a compact view showing only rank, team name, and total points. A horizontal scroll or expand reveals the full row data. |
| UX-11-005 | The "Last Updated" timestamp must always be visible on the leaderboard view, showing the exact time the leaderboard was last recalculated. Example: "Last updated: 3:47:22 PM (32 seconds ago)." |
| UX-11-006 | Team rows must be clickable to expand the per-match breakdown as an inline accordion, not a modal — to keep the leaderboard context visible while viewing details. |

---

## 11.6 Data Requirements

### 11.6.1 LeaderboardEntries Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `entry_id` | UUID | PK | Entry ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `registration_id` | UUID | FK → tournament_registrations | Team registration |
| `team_id` | UUID | FK → teams | Team |
| `team_name_snapshot` | VARCHAR(30) | NOT NULL | Team name at leaderboard time |
| `team_tag_snapshot` | VARCHAR(5) | NOT NULL | Team tag at leaderboard time |
| `current_rank` | SMALLINT | NOT NULL | Current rank |
| `previous_rank` | SMALLINT | NULLABLE | Rank before last update |
| `total_points` | DECIMAL(10,2) | DEFAULT 0 | Cumulative points |
| `chicken_dinners` | SMALLINT | DEFAULT 0 | Total 1st-place finishes |
| `total_kills` | INTEGER | DEFAULT 0 | Cumulative kills |
| `total_damage` | BIGINT | DEFAULT 0 | Cumulative damage |
| `matches_played` | SMALLINT | DEFAULT 0 | Completed matches count |
| `best_match_points` | DECIMAL(8,2) | DEFAULT 0 | Highest single-match score |
| `is_eliminated` | BOOLEAN | DEFAULT FALSE | Eliminated from advancement |
| `is_disqualified` | BOOLEAN | DEFAULT FALSE | DQ flag |
| `is_advancing` | BOOLEAN | DEFAULT FALSE | Confirmed to advance |
| `last_calculated_at` | TIMESTAMP | NOT NULL | Last recalculation time |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 11.6.2 LeaderboardSnapshots Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `snapshot_id` | UUID | PK | Snapshot ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `snapshot_type` | ENUM | NOT NULL | 'after_round','after_match','final','manual' |
| `round_number` | SMALLINT | NULLABLE | Round this snapshot covers |
| `match_id` | UUID | FK → matches, NULLABLE | Match that triggered snapshot |
| `snapshot_data` | JSONB | NOT NULL | Full leaderboard at snapshot time |
| `created_by` | UUID | FK → users, NULLABLE | Who triggered (null = auto) |
| `created_at` | TIMESTAMP | NOT NULL | Snapshot creation time |

---

## 11.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| Leaderboard recalculation is triggered while a previous recalculation is still running | Queue the second trigger; execute it immediately after the first completes. Never run two recalculations in parallel for the same tournament. |
| Two teams remain perfectly tied after all tiebreaker criteria are exhausted | Both teams share the same rank (e.g., two teams are both "Rank 3"); the team listed first alphabetically appears first in display order but both are annotated as "T-3" (tied 3rd). |
| Score correction changes the leaderboard such that a team that already received advancement notification is no longer advancing | System sends a "Status Update" notification to the affected team: "Due to a score correction, your advancement status has changed. Please check the updated standings." |
| WebSocket client disconnects and reconnects | Upon reconnection, the client immediately receives the current leaderboard state (not just future updates). Reconnection triggers a "leaderboard_sync" event with the full current leaderboard. |
| Leaderboard is requested for a tournament in DRAFT or PUBLISHED state (no matches played) | Returns an empty leaderboard with all registered teams at rank "TBD" with 0 points. |

---

## 11.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-11-001 | Leaderboard recalculates and pushes updates to all WebSocket clients within 5 seconds of a result being published. | Performance test with 500 concurrent connections |
| AC-11-002 | Tiebreaker logic correctly resolves a 3-way points tie using the chicken dinner count as tiebreaker 1. | Automated unit test |
| AC-11-003 | The leaderboard REST API endpoint (`GET /leaderboard`) returns a valid JSON response within 200ms when served from cache. | Performance test |
| AC-11-004 | Rank movement animations render smoothly (60fps) in Chrome and Safari during a live update with 64 rows animating simultaneously. | Manual QA |
| AC-11-005 | A WebSocket client that disconnects and reconnects receives the current leaderboard within 2 seconds of reconnection. | Automated test |
| AC-11-006 | The leaderboard for a 256-team, 12-round tournament recalculates within 5 seconds of a score correction trigger. | Performance test |

---

---



# MODULE 15 — LIVE CHAT & MODERATION

---

## 15.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-15 |
| **Priority** | 🟡 P2 — Medium |
| **Description** | Provides real-time chat functionality for tournament participants and viewers — enabling communication between players, organizers, and the live stream audience. Includes a moderation system to maintain a constructive environment during competitive events. This module enhances engagement without replacing the existing WhatsApp/Discord communities that organizers have built. |
| **Primary Users** | ROLE-04 (Tournament Director), ROLE-05 (Referee), ROLE-07 (Team Captain), ROLE-08 (Player), ROLE-09 (Viewer) |
| **Dependencies** | MOD-01, MOD-05, MOD-12 |
| **Estimated Complexity** | Medium |

---

## 15.2 Chat Channels Architecture

```
Tournament
├── 📢 Announcements Channel (read-only for players/viewers)
│   └── Only organizers can post; all see
│
├── 🏆 Competitor Chat (authenticated registered teams only)
│   └── Team Captains and players in the tournament
│
└── 👥 Viewer Chat (embedded on public tournament page)
    └── All viewers (authenticated + unauthenticated)
        [Moderated channel linked to live stream]
```

---

## 15.3 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-15-001 | As a **Tournament Director**, I want to post announcements in a read-only announcement channel so that important messages stand out from regular chat. | 🟡 P2 |
| US-15-002 | As a **Team Captain**, I want to communicate with other team captains in a competitor chat so that I can coordinate and engage with the competitive community during the event. | 🟡 P2 |
| US-15-003 | As a **viewer**, I want to chat in a live chat alongside the stream so that I can react to match events and engage with other viewers. | 🟡 P2 |
| US-15-004 | As a **Referee or Tournament Director**, I want to moderate the chat — removing messages, warning users, and banning repeat offenders — so that the chat environment remains respectful. | 🟡 P2 |
| US-15-005 | As a **viewer**, I want to see my username, team name (if a registered player), and a role badge in chat so that other viewers can identify who is speaking. | 🟡 P2 |
| US-15-006 | As a **Tournament Director**, I want to put the chat in slow mode or restrict it to registered participants only during important moments so that I can manage chat quality during high-traffic moments. | 🟡 P2 |

---

## 15.4 Functional Requirements

### 15.4.1 Chat Channels

| ID | Requirement | Priority |
|----|------------|---------|
| FR-15-001 | The system **shall** create the following chat channels automatically for every tournament that enters the LIVE state: (a) Announcements Channel (read-only for participants), (b) Competitor Chat (write access for registered team members only), (c) Viewer Chat (accessible to all viewers on the public tournament page). | 🟡 P2 |
| FR-15-002 | The **Announcements Channel** **shall** only allow messages from Tournament Directors and Referees. All other users see the channel as read-only. Announcements appear with a special badge and are pinned until dismissed by an organizer. | 🟡 P2 |
| FR-15-003 | The **Competitor Chat** **shall** be accessible only to users who are registered team members in the tournament (Team Captains and Players with approved registrations). Their tournament-specific role badge and team name are displayed beside their username. | 🟡 P2 |
| FR-15-004 | The **Viewer Chat** **shall** be embedded on the public tournament page beside the stream embed. Authenticated registered GameVerse users are shown with their username and a role badge (Organizer, Player, Viewer). Unauthenticated viewers must provide a display name to chat. | 🟡 P2 |
| FR-15-005 | All chat messages **shall** be delivered in real time via WebSocket. Message latency must be under 300ms for users within India under normal load. | 🟡 P2 |
| FR-15-006 | The system **shall** retain chat history for each tournament for 30 days post-completion, after which it is archived (not deleted). | 🟡 P2 |

### 15.4.2 Message Features

| ID | Requirement | Priority |
|----|------------|---------|
| FR-15-007 | Chat messages **shall** support: plain text (max 300 chars per message), emoji reactions (thumbs up, fire, skull, crown — limited set to prevent spam), and @mentions (tagging specific users by username). | 🟡 P2 |
| FR-15-008 | The system **shall** support **pinned messages** — Tournament Directors and Referees can pin up to 3 messages in any channel. Pinned messages appear at the top of the chat with a pin icon. | 🟡 P2 |
| FR-15-009 | The system **shall** support **system messages** — auto-generated chat messages from the platform: "Match 3 has started," "Match 3 results are in," "Hydra Esports is now in 1st place!" These appear in a distinct visual style (different background, system avatar). | 🟡 P2 |

### 15.4.3 Moderation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-15-010 | The system **shall** implement automated moderation using a profanity filter that: (a) checks messages against a maintained blocklist of banned words/phrases in English, Hindi, Tamil, and Telugu, (b) automatically blocks messages containing banned content, (c) notifies the sender that their message was blocked (without specifying which word triggered the filter). | 🟡 P2 |
| FR-15-011 | Moderators (Tournament Directors, Referees) **shall** be able to: (a) delete any message, (b) warn a user (sends them a private warning notification), (c) mute a user for the tournament (prevents them from sending new messages for 30/60/120 minutes or permanently), (d) ban a user from the chat (permanent mute for this tournament). | 🟡 P2 |
| FR-15-012 | The system **shall** support **Slow Mode** — configurable by the Tournament Director — that limits each user to sending one message per N seconds (N = 5, 10, 30, or 60 seconds). Slow mode is enforced server-side. | 🟡 P2 |
| FR-15-013 | The system **shall** support **Subscribers Only Mode** — restricting Viewer Chat to authenticated GameVerse users only (blocking unauthenticated viewers from chatting). | 🟡 P2 |
| FR-15-014 | The system **shall** support **Competitor Only Mode** — restricting Viewer Chat to tournament-registered players and organizers only. | 🟡 P2 |
| FR-15-015 | All moderation actions **shall** be logged: moderator identity, action taken, target user, message content (if deleted), and timestamp. This log is accessible to Tournament Directors and Super Admins. | 🟡 P2 |

---

## 15.5 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-15-001 | Chat is a supplementary feature. If the chat service is unavailable, core tournament operations (scoring, leaderboards, credentials) must remain fully functional. |
| BR-15-002 | A user who is banned from tournament chat can still participate in all tournament activities (playing, scoring, leaderboard viewing). Chat ban only affects chat functionality. |
| BR-15-003 | Messages in the Competitor Chat that reveal room credentials (containing 6+ consecutive digits) are automatically scanned and flagged for moderator review — room credentials should not be shared in chat. |
| BR-15-004 | Chat is available on Free plan (all 3 channels). Advanced moderation tools (slow mode, competitor-only mode) require Starter plan or above. |

---

## 15.6 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-15-001 | The Viewer Chat panel must be collapsible on desktop — viewers can hide it to give more space to the stream. The collapsed state persists across page refreshes. |
| UX-15-002 | Chat must auto-scroll to show new messages with a "New messages below ↓" button appearing if the user has scrolled up and new messages arrive. |
| UX-15-003 | Role badges must be displayed as compact colored pills: 🟣 Organizer, 🔵 Player (team name shown), 🟡 Referee, ⚪ Viewer. |
| UX-15-004 | Message deletion by moderators must not show a blank gap — deleted messages are replaced with "This message was removed by a moderator." |
| UX-15-005 | Slow mode must show a countdown timer on the send button: "Send (23s)" so users know when they can next send. |

---

## 15.7 Data Requirements

### 15.7.1 ChatChannels Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `channel_id` | UUID | PK | Channel ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `channel_type` | ENUM | NOT NULL | 'announcements','competitor','viewer' |
| `is_active` | BOOLEAN | DEFAULT TRUE | Channel active flag |
| `slow_mode_seconds` | SMALLINT | DEFAULT 0 | 0 = off |
| `mode` | ENUM | DEFAULT 'open' | 'open','subscribers_only','competitors_only','locked' |
| `created_at` | TIMESTAMP | NOT NULL | Creation time |

### 15.7.2 ChatMessages Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `message_id` | UUID | PK | Message ID |
| `channel_id` | UUID | FK → chat_channels | Channel |
| `user_id` | UUID | FK → users, NULLABLE | Sender (null for guest) |
| `guest_display_name` | VARCHAR(30) | NULLABLE | Guest name if unauthenticated |
| `content` | TEXT | NOT NULL | Message content |
| `message_type` | ENUM | DEFAULT 'user' | 'user','system','announcement' |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Soft delete flag |
| `deleted_by` | UUID | FK → users, NULLABLE | Moderator who deleted |
| `deleted_at` | TIMESTAMP | NULLABLE | Deletion timestamp |
| `created_at` | TIMESTAMP | NOT NULL | Message timestamp |

### 15.7.3 ChatModerationLog Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `log_id` | UUID | PK | Log ID |
| `channel_id` | UUID | FK → chat_channels | Channel |
| `moderator_id` | UUID | FK → users | Who took action |
| `target_user_id` | UUID | FK → users | Who was actioned |
| `action` | ENUM | NOT NULL | 'warn','mute','unmute','ban','unban','delete_message' |
| `message_id` | UUID | FK → chat_messages, NULLABLE | If action is delete |
| `duration_minutes` | INTEGER | NULLABLE | Mute duration |
| `reason` | TEXT | NULLABLE | Action reason |
| `created_at` | TIMESTAMP | NOT NULL | Action timestamp |

---

## 15.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-15-001 | A message sent in Viewer Chat appears in all connected clients within 300ms under normal load (< 200 concurrent viewers). | Performance test |
| AC-15-002 | A message containing a banned word is blocked before being broadcast to other users. The sender sees "Your message was not sent" within 1 second. | Automated test |
| AC-15-003 | A Tournament Director can mute a user and that user's subsequent messages are blocked within 2 seconds of the mute action. | Manual QA |
| AC-15-004 | If the chat service goes down, the tournament scoring and leaderboard pages continue to function normally. | Integration test |

---

---





---

# ECOSYSTEM SIDE: 4. 🎥 PRODUCTION & STREAM CONTROL PANEL

---

# MODULE 12 — LIVE STREAMING & BROADCAST INTEGRATION

---

## 12.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-12 |
| **Priority** | 🟠 P1 — High |
| **Description** | Manages the integration between GameVerse tournament operations and live streaming platforms (YouTube, Twitch, Facebook Gaming). This module enables organizers to configure stream settings, connect streaming accounts, manage stream metadata, display the embedded stream on the tournament page, track live viewership, and coordinate stream status with match operations — creating a unified command center for simultaneous tournament management and broadcast production. |
| **Primary Users** | ROLE-04 (Tournament Director), ROLE-06 (Broadcast Producer), ROLE-09 (Viewer) |
| **Dependencies** | MOD-05, MOD-09, MOD-10, MOD-11 |
| **Estimated Complexity** | High |

---

## 12.2 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-12-001 | As a **Broadcast Producer**, I want to connect my YouTube/Twitch channel to the tournament so that the live stream is automatically embedded on the tournament page. | 🟠 P1 |
| US-12-002 | As a **Broadcast Producer**, I want to start and stop the live stream directly from the platform's broadcast dashboard so that I don't need to switch between tools. | 🟡 P2 |
| US-12-003 | As a **Broadcast Producer**, I want to see real-time stream health metrics (bitrate, viewer count, dropped frames) in the broadcast dashboard so that I can monitor stream quality. | 🟠 P1 |
| US-12-004 | As a **viewer**, I want to watch the live stream directly on the tournament page — alongside the live leaderboard — so that I don't need to navigate to YouTube/Twitch separately. | 🟠 P1 |
| US-12-005 | As a **Tournament Director**, I want the stream title and description to automatically update when a new match starts so that viewers always see accurate information. | 🟡 P2 |
| US-12-006 | As a **Broadcast Producer**, I want to support multiple simultaneous streams for different language broadcasts (Hindi, English, Tamil) so that we can reach wider audiences. | 🟡 P2 |
| US-12-007 | As a **viewer**, I want to see the current match status, live leaderboard, and team standings on the tournament page alongside the stream so that I have all context in one place. | 🟠 P1 |
| US-12-008 | As a **Tournament Director**, I want to archive stream VODs linked to specific matches so that players and viewers can watch replays. | 🟡 P2 |
| US-12-009 | As a **Broadcast Producer**, I want to switch between multiple video sources (game feed, interview cam, break screen) directly from the broadcast dashboard so that I can manage production from the platform. | 🟢 P3 |

---

## 12.3 Functional Requirements

### 12.3.1 Stream Configuration

| ID | Requirement | Priority |
|----|------------|---------|
| FR-12-001 | The system **shall** allow Broadcast Producers and Tournament Directors to configure the following stream settings per tournament: (a) Primary Streaming Platform (YouTube Live / Twitch / Facebook Gaming / Custom RTMP), (b) Stream URL or Channel ID, (c) Stream key (encrypted storage), (d) Primary stream language, (e) Secondary streams (same configuration, multiple entries). | 🟠 P1 |
| FR-12-002 | The system **shall** support connecting a YouTube account via OAuth 2.0 to enable: (a) automatic stream creation, (b) stream metadata management (title, description, thumbnail) from the platform, (c) viewer count API integration. | 🟠 P1 |
| FR-12-003 | The system **shall** support embedding a stream via URL for platforms without OAuth integration (Twitch, Facebook Gaming, custom RTMP) — embedding the stream player using the platform's provided embed code or URL. | 🟠 P1 |
| FR-12-004 | Stream keys **shall** be stored encrypted (AES-256) and never exposed in API responses or UI beyond a masked display (****XXXX). Stream keys are decrypted only server-side for OBS configuration delivery. | 🟠 P1 |
| FR-12-005 | The system **shall** support configuring a **custom RTMP ingest endpoint** for organizations using their own media servers or CDN infrastructure. | 🟡 P2 |

### 12.3.2 Stream Embedding & Viewer Experience

| ID | Requirement | Priority |
|----|------------|---------|
| FR-12-006 | The system **shall** embed the live stream player on the public tournament page in a prominent position — above the leaderboard on mobile, side-by-side with the leaderboard on desktop. | 🟠 P1 |
| FR-12-007 | The tournament page **shall** display the following alongside the embedded stream: (a) Live leaderboard (real-time, WebSocket-driven), (b) Current match information (match number, teams, status), (c) Live viewer count (from streaming platform API), (d) Stream quality selector (if multiple quality options available). | 🟠 P1 |
| FR-12-008 | When no stream is live, the tournament page **shall** show: a placeholder with the tournament banner, a "Stream starts soon" message with a countdown to the next match, and links to the organizer's YouTube/Twitch channel. | 🟠 P1 |
| FR-12-009 | The system **shall** support a **multi-stream selector** for tournaments with multiple language broadcasts — displaying a language/stream selector tab bar above the player that switches the embedded stream. | 🟡 P2 |
| FR-12-010 | The system **shall** track **platform-side viewership** — pulling viewer count data from YouTube/Twitch APIs every 60 seconds and storing it as time-series data for analytics. | 🟡 P2 |

### 12.3.3 Stream Management & Control

| ID | Requirement | Priority |
|----|------------|---------|
| FR-12-011 | The system **shall** provide a **Broadcast Dashboard** accessible to Broadcast Producers and Tournament Directors containing: stream health metrics, current viewer count, stream duration, match status sync panel, scene selection (if OBS WebSocket is connected), and stream annotation tools. | 🟠 P1 |
| FR-12-012 | The system **shall** display the following stream health metrics in real time (polled from OBS WebSocket or streaming platform API): (a) Bitrate (current / target), (b) Frames per second (current / target), (c) Dropped frame percentage, (d) CPU usage, (e) Stream uptime, (f) Platform ingestion status. | 🟠 P1 |
| FR-12-013 | The system **shall** allow Broadcast Producers to **annotate the stream timeline** — adding timestamped markers for key moments: match start, match end, chicken dinner, notable kill, technical pause. These annotations are stored and used to generate match highlight timestamps for VOD navigation. | 🟡 P2 |
| FR-12-014 | The system **shall** support **automatic stream title updates** via YouTube API when: (a) a new match starts (title updates to: "[Tournament Name] | Match [X] | [Round]"), (b) the tournament concludes (title updates to: "[Tournament Name] | Grand Finale Highlights"). This requires connected YouTube OAuth. | 🟡 P2 |

### 12.3.4 OBS Integration (WebSocket)

| ID | Requirement | Priority |
|----|------------|---------|
| FR-12-015 | The system **shall** support integration with **OBS Studio via OBS WebSocket protocol (v5.x)** — allowing the platform to send commands to OBS including: scene switching, source visibility toggle, and text source updates (for score overlays). | 🟠 P1 |
| FR-12-016 | OBS WebSocket connection requires the Broadcast Producer to enter the OBS WebSocket server address (typically `ws://localhost:4455`) and password into the Broadcast Dashboard. The connection is validated before being saved. | 🟠 P1 |
| FR-12-017 | When OBS WebSocket is connected, the Broadcast Dashboard **shall** display the available OBS scenes as buttons — clicking a scene button sends a "Set Current Scene" command to OBS. | 🟡 P2 |
| FR-12-018 | The system **shall** maintain OBS WebSocket connection status in the Broadcast Dashboard — displaying "Connected" (green), "Disconnected" (red), or "Connecting" (yellow spinner) — and automatically attempting reconnection if the connection drops. | 🟠 P1 |

### 12.3.5 VOD Management

| ID | Requirement | Priority |
|----|------------|---------|
| FR-12-019 | The system **shall** allow Broadcast Producers to link VOD (Video On Demand) recordings to specific matches after the stream ends. Each match can have one linked VOD with an optional timestamp (in seconds) indicating where in the VOD that match begins. | 🟡 P2 |
| FR-12-020 | Linked VODs **shall** be accessible from the tournament's public results page — each match card has a "Watch Replay" button that opens the VOD at the correct timestamp. | 🟡 P2 |
| FR-12-021 | The system **shall** automatically attempt to detect VOD chapter timestamps from stream annotations (FR-12-013) and suggest pre-filled timestamp values when a Broadcast Producer links a VOD to a match. | 🟢 P3 |

---

## 12.4 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-12-001 | Stream keys are treated as sensitive credentials and are subject to the same security standards as room credentials (MOD-08) — encrypted at rest, never logged in plain text, masked in all UI displays. |
| BR-12-002 | A tournament can have a maximum of 5 simultaneous stream configurations (1 primary + 4 secondary language/commentary streams). |
| BR-12-003 | YouTube OAuth connection is per-organization, not per-tournament. An org connects their YouTube account once and all tournaments under that org can use the connection. |
| BR-12-004 | The platform does not directly stream video — it acts as a management and integration layer. All video encoding and streaming is done by OBS or another external encoder connected to the streaming platform. |
| BR-12-005 | Viewer count data from streaming platforms is used for analytics and sponsor reporting only. It is not used for any competitive or prize-related calculations. |

---

## 12.5 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-12-001 | The Broadcast Dashboard must be a dedicated full-screen interface (not a panel within another page) — designed for large display use during a live production. |
| UX-12-002 | Stream health metrics must use color-coded gauges: green for healthy (>95% of target), yellow for degraded (80–95%), red for critical (<80%). |
| UX-12-003 | The viewer count must be displayed as a large number with a live updating indicator (pulsing dot) to communicate liveness to the producer. |
| UX-12-004 | On the public tournament page, the stream embed must be responsive — 16:9 aspect ratio that scales with screen width on desktop and goes full-width on mobile. |
| UX-12-005 | Stream annotations (moment markers) must be addable with a single keyboard shortcut during a live stream — pressing "M" opens a quick annotation modal without leaving the stream view. |
| UX-12-006 | The multi-stream language selector must be displayed as flag icons + language name tabs, not a dropdown, for faster switching during live viewing. |

---

## 12.6 Data Requirements

### 12.6.1 TournamentStreams Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `stream_id` | UUID | PK | Stream configuration ID |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `stream_type` | ENUM | NOT NULL | 'primary','secondary' |
| `platform` | ENUM | NOT NULL | 'youtube','twitch','facebook','custom_rtmp' |
| `language` | VARCHAR(10) | NOT NULL | Stream language (ISO code) |
| `channel_id` | TEXT | NULLABLE | Platform channel/user ID |
| `stream_url` | TEXT | NULLABLE | Public stream URL |
| `embed_url` | TEXT | NULLABLE | Embed iframe URL |
| `stream_key_encrypted` | TEXT | NULLABLE | Encrypted stream key |
| `rtmp_url` | TEXT | NULLABLE | RTMP ingest URL |
| `oauth_token_ref` | VARCHAR(100) | NULLABLE | Reference to OAuth token |
| `is_active` | BOOLEAN | DEFAULT FALSE | Currently streaming flag |
| `stream_started_at` | TIMESTAMP | NULLABLE | Stream start time |
| `stream_ended_at` | TIMESTAMP | NULLABLE | Stream end time |
| `peak_viewers` | INTEGER | DEFAULT 0 | Peak concurrent viewers |
| `total_views` | INTEGER | DEFAULT 0 | Total view count |
| `obs_websocket_url` | TEXT | NULLABLE | OBS WebSocket endpoint |
| `obs_websocket_password_encrypted` | TEXT | NULLABLE | Encrypted OBS WS password |
| `is_obs_connected` | BOOLEAN | DEFAULT FALSE | OBS connection status |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 12.6.2 StreamViewershipData Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `datapoint_id` | UUID | PK | Data point ID |
| `stream_id` | UUID | FK → tournament_streams | Stream |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `concurrent_viewers` | INTEGER | NOT NULL | Viewers at this moment |
| `recorded_at` | TIMESTAMP | NOT NULL | Sample timestamp |

### 12.6.3 StreamAnnotations Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `annotation_id` | UUID | PK | Annotation ID |
| `stream_id` | UUID | FK → tournament_streams | Stream |
| `match_id` | UUID | FK → matches, NULLABLE | Associated match |
| `annotation_type` | ENUM | NOT NULL | 'match_start','match_end','chicken_dinner','notable_kill','technical_pause','custom' |
| `label` | VARCHAR(100) | NOT NULL | Display label |
| `stream_timestamp_seconds` | INTEGER | NOT NULL | Position in stream |
| `created_by` | UUID | FK → users | Who annotated |
| `created_at` | TIMESTAMP | NOT NULL | Annotation creation |

### 12.6.4 MatchVODs Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `vod_id` | UUID | PK | VOD record ID |
| `match_id` | UUID | FK → matches | Match |
| `stream_id` | UUID | FK → tournament_streams | Source stream |
| `vod_url` | TEXT | NOT NULL | VOD URL |
| `start_timestamp_seconds` | INTEGER | NULLABLE | Match start in VOD |
| `end_timestamp_seconds` | INTEGER | NULLABLE | Match end in VOD |
| `linked_by` | UUID | FK → users | Who linked |
| `linked_at` | TIMESTAMP | NOT NULL | Link creation time |

---

## 12.7 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| YouTube OAuth token expires during a live tournament | System detects token expiry on next API call; notifies Broadcast Producer: "YouTube connection expired. Re-connect to continue stream management. Live stream on YouTube is unaffected — only platform features require reconnection." |
| OBS WebSocket disconnects mid-tournament | Platform detects disconnection within 10 seconds; shows red "Disconnected" status in Broadcast Dashboard; stream continues on YouTube/Twitch unaffected; OBS overlay browser sources continue to function independently via REST API |
| Stream platform (YouTube) experiences outage | Platform displays "Stream platform unavailable" in broadcast dashboard; tournament operations (scoring, leaderboard, match management) continue unaffected |
| Two Broadcast Producers try to switch OBS scenes simultaneously | Second command is queued; executes 100ms after the first; last-write-wins for scene selection |
| Viewer count API rate limit reached | System backs off to 5-minute polling interval instead of 60 seconds; displays "Viewer count temporarily unavailable" in dashboard |

---

## 12.8 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-12-001 | A Broadcast Producer can connect a YouTube account via OAuth and the stream URL appears on the tournament page within 60 seconds. | Manual QA |
| AC-12-002 | The stream embed on the tournament page loads within 3 seconds of page load on a 4G connection. | Lighthouse audit |
| AC-12-003 | OBS WebSocket connection is established within 5 seconds of the Broadcast Producer entering credentials and clicking "Connect." | Manual QA |
| AC-12-004 | Viewer count updates on the Broadcast Dashboard within 90 seconds of a change on the streaming platform. | Manual QA |
| AC-12-005 | Stream health metrics (bitrate, fps) update in the Broadcast Dashboard within 2 seconds of an OBS WebSocket connection being established. | Manual QA |
| AC-12-006 | Clicking a scene button in the Broadcast Dashboard causes OBS to switch to that scene within 500ms. | Manual QA |

---

---

## END OF PART 3

---

## Part 3 Summary

| Module | Status | Priority | Complexity |
|--------|--------|----------|-----------|
| MOD-09: Match Day Operations | ✅ Complete | 🔴 P0 | Very High |
| MOD-10: Live Scoring & Points Engine | ✅ Complete | 🔴 P0 | Very High |
| MOD-11: Leaderboard Engine | ✅ Complete | 🔴 P0 | High |
| MOD-12: Live Streaming & Broadcast Integration | ✅ Complete | 🟠 P1 | High |

---

## Coming in Part 4

| Module | Topic |
|--------|-------|
| **MOD-13** | OBS Overlay System — browser-source overlays, real-time data feeds, overlay templates, scene management |
| **MOD-14** | Announcement & Notification System — multi-channel notifications, templates, scheduling |
| **MOD-15** | Live Chat & Moderation — tournament chat, moderation tools, viewer engagement |
| **MOD-16** | Prize Pool & Payment Management — escrow, disbursement, winner verification, UPI/bank payout |

---

> **Document:** GameVerse PRD | **Part:** 3 of 6 | **Modules Covered:** 9–12 | **Next Part:** Modules 13–16

# 📄 DOCUMENT 2: PRODUCT REQUIREMENTS DOCUMENT (PRD)


---

## **Project:** GameVerse — Esports Tournament Operations & Live Broadcast Platform
## **Document Type:** Product Requirements Document (PRD)
## **Part:** 4 of 6 — Broadcast, Communication & Financial Modules (13–16)
## **Version:** 1.0
## **Date:** June 2025
## **Status:** Draft for Review

---

---

## TABLE OF CONTENTS — PART 4

- Module 13 — OBS Overlay System
- Module 14 — Announcement & Notification System
- Module 15 — Live Chat & Moderation
- Module 16 — Prize Pool & Payment Management

---

---



# MODULE 13 — OBS OVERLAY SYSTEM

---

## 13.1 Module Overview

| Attribute | Detail |
|-----------|--------|
| **Module ID** | MOD-13 |
| **Priority** | 🟠 P1 — High |
| **Description** | The OBS Overlay System provides real-time, data-driven browser-source overlays for OBS Studio and other streaming software. It solves one of the most painful problems documented in the Problem Validation Document — broadcast producers currently need a dedicated person to manually update scores in a text file that OBS reads. This module provides WebSocket-driven browser sources that automatically reflect live leaderboard data, match status, team information, and tournament branding — enabling a team of 2 to produce a broadcast that previously required a team of 6. |
| **Primary Users** | ROLE-06 (Broadcast Producer), ROLE-04 (Tournament Director) |
| **Dependencies** | MOD-03, MOD-05, MOD-10, MOD-11, MOD-12 |
| **Estimated Complexity** | Very High |

---

## 13.2 The Core Problem Being Solved

> **Current Reality:** Tournament streams use static OBS overlays with manually updated text files. A dedicated operator must retype scores into text files between matches. This introduces 10–15 minute delays, frequent typos, and requires an extra team member whose only job is updating scores.

> **GameVerse Solution:** Browser-source overlays served from GameVerse servers that connect via WebSocket to live tournament data. When a score is published in the platform, the overlay updates automatically within 2 seconds — with no human intervention.

---

## 13.3 How OBS Browser Sources Work

```
OBS Studio
└── Browser Source (URL: gameverse.gg/overlay/{token})
    └── Renders HTML/CSS/JS page
        └── Connects via WebSocket to GameVerse
            └── Receives real-time updates
                └── Renders updated overlay data
                    └── Visible on stream without OBS restart
```

---

## 13.4 User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-13-001 | As a **Broadcast Producer**, I want to add a GameVerse overlay as a browser source in OBS using a single URL so that live tournament data appears on my stream automatically. | 🟠 P1 |
| US-13-002 | As a **Broadcast Producer**, I want the leaderboard overlay to update automatically when scores change so that I don't need a dedicated person to manually update scores during the stream. | 🟠 P1 |
| US-13-003 | As a **Broadcast Producer**, I want to choose from pre-built overlay templates so that my stream looks professional without needing a graphic designer. | 🟠 P1 |
| US-13-004 | As a **Broadcast Producer**, I want to customize overlay colors, fonts, and team logo display to match my tournament's branding so that the stream looks cohesive. | 🟡 P2 |
| US-13-005 | As a **Broadcast Producer**, I want a match ticker overlay showing the current match status, round, and team count so that viewers always have context. | 🟠 P1 |
| US-13-006 | As a **Broadcast Producer**, I want a "kill feed" overlay that shows recent kill events in real time so that the stream feels dynamic and engaging. | 🟡 P2 |
| US-13-007 | As a **Broadcast Producer**, I want to preview how each overlay looks with my tournament's data before adding it to OBS so that I can configure it correctly before going live. | 🟠 P1 |
| US-13-008 | As a **Broadcast Producer**, I want to control overlay visibility from the Broadcast Dashboard — showing or hiding specific overlays — without touching OBS so that I can manage the production from one interface. | 🟡 P2 |
| US-13-009 | As a **Tournament Director**, I want overlays to respect our organization's branding colors and logos without the producer needing to manually configure them so that every stream automatically looks on-brand. | 🟡 P2 |
| US-13-010 | As a **Broadcast Producer**, I want a winner announcement overlay that automatically triggers with animation when the tournament champion is declared so that the moment is visually dramatic. | 🟡 P2 |

---

## 13.5 Functional Requirements

### 13.5.1 Overlay URL System

| ID | Requirement | Priority |
|----|------------|---------|
| FR-13-001 | The system **shall** generate a unique, persistent **overlay URL** for each overlay type per tournament. Format: `gameverse.gg/overlay/{tournament_id}/{overlay_type}/{access_token}`. The access token is a 32-character random string that authorizes access to the overlay without requiring login. | 🟠 P1 |
| FR-13-002 | Overlay URLs **shall** be accessible without authentication — they are designed to be pasted directly into OBS browser sources without requiring the producer to be logged in. The access token provides security. | 🟠 P1 |
| FR-13-003 | The system **shall** support regenerating overlay access tokens (invalidating old URLs and generating new ones) if a token is compromised — accessible from the Broadcast Dashboard. | 🟠 P1 |
| FR-13-004 | Overlay URLs **shall** remain valid for the lifetime of the tournament plus 30 days. After expiry, the overlay displays a placeholder screen. | 🟠 P1 |
| FR-13-005 | The system **shall** provide a **Overlay Management Panel** in the Broadcast Dashboard listing all overlay URLs for the tournament with: overlay type, last seen (when OBS last loaded it), current connection status (connected / disconnected), and copy-to-clipboard action. | 🟠 P1 |

### 13.5.2 Overlay Types

| ID | Requirement | Priority |
|----|------------|---------|
| FR-13-006 | The system **shall** support the following overlay types as Phase 1 deliverables: | 🟠 P1 |

**Phase 1 Overlay Types:**

| Overlay ID | Name | Description | Recommended OBS Size |
|-----------|------|-------------|---------------------|
| `OVL-01` | **Full Leaderboard** | Complete standings table — all teams, ranks, points, kills | 400×600px |
| `OVL-02` | **Top 10 Leaderboard** | Compact top 10 teams only — ideal for sidebar display | 300×500px |
| `OVL-03` | **Match Info Bar** | Horizontal bar showing: Match #, Round, Status, Team Count | 1920×80px |
| `OVL-04` | **Team Kill Ticker** | Scrolling horizontal ticker of recent kill events | 1920×60px |
| `OVL-05` | **Next Match Preview** | Card showing upcoming match teams and slot assignments | 400×300px |
| `OVL-06` | **Match Result Splash** | Full-screen animated result announcement after each match | 1920×1080px |
| `OVL-07` | **Tournament Winner** | Full-screen winner announcement with celebration animation | 1920×1080px |
| `OVL-08` | **Match Status Bug** | Small corner bug showing current match status | 200×60px |
| `OVL-09` | **Team Spotlight** | Card showing one team's stats — useful for pre-match features | 400×200px |

**Phase 2 Overlay Types (P2):**

| Overlay ID | Name | Description |
|-----------|------|-------------|
| `OVL-10` | **Kill Feed** | Real-time kill event feed (requires manual referee input) |
| `OVL-11` | **Map View** | Current game map with team positions (requires game API) |
| `OVL-12` | **Spectator Overlay** | In-game spectator HUD enhancement |
| `OVL-13` | **Break Screen** | Full-screen break countdown with tournament info |
| `OVL-14` | **Sponsor Ticker** | Rotating sponsor logos and messages |

| ID | Requirement | Priority |
|----|------------|---------|
| FR-13-007 | Each overlay type **shall** have a configurable set of **display parameters** that the Broadcast Producer can set from the Broadcast Dashboard — these parameters are encoded in the overlay URL or sent via WebSocket on connection. | 🟠 P1 |
| FR-13-008 | **OVL-01 (Full Leaderboard)** display parameters: background opacity (0–100%), number of rows to display (5–25), scroll speed if more teams than rows (0 = no scroll, 1–10 = scroll speed), show/hide columns (kills, damage, chicken dinners), team logo display (show/hide). | 🟠 P1 |
| FR-13-009 | **OVL-03 (Match Info Bar)** display parameters: show/hide: match number, round number, team count, match timer, current match status, next match countdown. | 🟠 P1 |
| FR-13-010 | **OVL-06 (Match Result Splash)** shall trigger automatically when a match result is published. The overlay displays for a configurable duration (default: 15 seconds) and then auto-dismisses. The producer can also manually trigger and dismiss it from the Broadcast Dashboard. | 🟡 P2 |
| FR-13-011 | **OVL-07 (Tournament Winner)** shall trigger when the Tournament Director marks the tournament as COMPLETED. It displays the winning team's name, logo, and total points with a particle/confetti animation. | 🟡 P2 |

### 13.5.3 Real-Time Data Connection

| ID | Requirement | Priority |
|----|------------|---------|
| FR-13-012 | Each overlay page **shall** establish a WebSocket connection to GameVerse upon loading. The connection subscribes to the tournament's live data channel and receives updates for the following events: `leaderboard_updated`, `match_status_changed`, `result_published`, `tournament_state_changed`, `overlay_command`. | 🟠 P1 |
| FR-13-013 | The overlay **shall** display the initial state of all data upon WebSocket connection (full leaderboard, current match info) — not just future updates. This ensures the overlay is correct even if OBS was restarted mid-tournament. | 🟠 P1 |
| FR-13-014 | If the WebSocket connection drops, the overlay **shall** display a subtle "Reconnecting..." indicator (small text in corner, low opacity) and automatically attempt reconnection using exponential backoff (1s, 2s, 4s, 8s... max 30s). The overlay continues displaying the last known data during reconnection. | 🟠 P1 |
| FR-13-015 | The overlay **shall** support a **polling fallback mode** — if WebSocket is unavailable (e.g., firewall restriction on the production machine), the overlay polls the REST API (`GET /api/v1/tournaments/{id}/leaderboard`) every 15 seconds as a fallback. The producer can enable this mode from the Broadcast Dashboard. | 🟡 P2 |

### 13.5.4 Overlay Rendering & Animation

| ID | Requirement | Priority |
|----|------------|---------|
| FR-13-016 | Overlay pages **shall** be rendered as standard HTML/CSS/JS web pages optimized for the OBS browser source engine (Chromium-based). All animations shall use CSS transitions and the Web Animations API — no canvas-based rendering for text. | 🟠 P1 |
| FR-13-017 | All overlays **shall** have a **transparent background by default** — OBS renders them as a layer over the video feed. Background transparency is achieved using CSS `background: transparent`. | 🟠 P1 |
| FR-13-018 | Leaderboard row updates **shall** use smooth animations: (a) rank improvement — row slides up with a green flash, (b) rank loss — row slides down with a red flash, (c) no change — no animation. Animation duration: 600ms. | 🟠 P1 |
| FR-13-019 | The system **shall** ensure overlay text is always legible over both light and dark game backgrounds by applying: text shadow (2px black outline), semi-transparent backgrounds behind text blocks, and high-contrast color selection for default templates. | 🟠 P1 |
| FR-13-020 | Overlays **shall** support loading custom fonts from Google Fonts — the Tournament Director selects a font family from a curated list of gaming-appropriate fonts during tournament branding setup. The selected font is applied to all overlays for that tournament. | 🟡 P2 |

### 13.5.5 Overlay Theming & Branding

| ID | Requirement | Priority |
|----|------------|---------|
| FR-13-021 | The system **shall** apply the following theming variables to all overlays automatically from the tournament/organization settings: (a) Primary Color (for headers, rank highlights), (b) Secondary Color (for accents, borders), (c) Organization Logo (displayed in overlay corners), (d) Tournament Logo (displayed in splash screens), (e) Font Family. | 🟡 P2 |
| FR-13-022 | The system **shall** provide at least 5 pre-built overlay theme templates: (a) **Dark Pro** — dark background panels, gold/white text (default), (b) **Neon Cyber** — dark background, cyan/purple neon accents, (c) **Clean Light** — white/grey panels, dark text, (d) **Fire Red** — dark panels, orange/red accents, (e) **Custom** — fully configurable using the organization's brand colors. | 🟡 P2 |
| FR-13-023 | The system **shall** provide a **Live Preview** of each overlay in the Broadcast Dashboard — rendering the overlay with the tournament's actual live data in a scaled-down preview pane, so the producer can see exactly what viewers will see. | 🟠 P1 |
| FR-13-024 | Team logos **shall** be displayed in overlay rows (where applicable) using the team logo uploaded during team creation. If no team logo is uploaded, a placeholder with the team's two-letter initials (from team tag) is displayed in the team's primary color. | 🟡 P2 |

### 13.5.6 Overlay Control from Broadcast Dashboard

| ID | Requirement | Priority |
|----|------------|---------|
| FR-13-025 | The Broadcast Dashboard **shall** support sending **overlay commands** via WebSocket to all connected overlays for the tournament. Commands include: (a) `show_overlay` — makes a hidden overlay visible, (b) `hide_overlay` — hides a visible overlay, (c) `trigger_animation` — fires a specific animation (e.g., winner celebration), (d) `update_message` — pushes a custom text message to a message overlay. | 🟡 P2 |
| FR-13-026 | The system **shall** support **Overlay Scenes** — pre-configured combinations of visible overlays that can be activated with a single click. Example: "Match Live Scene" = Match Info Bar (visible) + Top 10 Leaderboard (visible) + Team Kill Ticker (visible). Switching scenes sends the appropriate show/hide commands to all connected overlays. | 🟡 P2 |
| FR-13-027 | Overlay scene switches **shall** complete (all overlays update) within 500ms of the producer clicking the scene button. | 🟡 P2 |

---

## 13.6 Business Rules

| ID | Business Rule |
|----|--------------|
| BR-13-001 | Overlay URLs are scoped to a single tournament. A producer cannot use the overlay URL from Tournament A to display data from Tournament B. |
| BR-13-002 | Overlays are read-only — they display data from the platform but cannot be used to modify any tournament data. All scoring and leaderboard changes must go through the platform UI. |
| BR-13-003 | The overlay system must not impact the performance of core tournament operations. Overlay rendering is isolated in a separate service with its own compute resources. |
| BR-13-004 | Organizations on the Free plan receive access to OVL-01 (Full Leaderboard) and OVL-03 (Match Info Bar) only. All other overlay types require Starter plan or above. |
| BR-13-005 | Custom CSS injection into overlays (bypassing the theming system) is only available on the Elite plan and above, and requires acknowledgment that custom CSS may break on platform updates. |

---

## 13.7 UI/UX Requirements

| ID | Requirement |
|----|------------|
| UX-13-001 | The Overlay Management Panel must list all overlay types in a card grid. Each card shows: overlay name, preview thumbnail, URL (masked), copy URL button, connection status (live green dot / grey dot), and last connected timestamp. |
| UX-13-002 | The OBS setup guide must be accessible directly from the Overlay Management Panel — a step-by-step modal showing: how to add a browser source in OBS, what dimensions to set, where to paste the URL — with accompanying screenshots. |
| UX-13-003 | The live preview pane must update in real time as tournament data changes — the producer can keep the preview open during the tournament to verify overlay accuracy without opening OBS. |
| UX-13-004 | Overlay theme selection must show side-by-side visual previews of each theme rendered with the actual tournament colors — not just color swatches. |
| UX-13-005 | The "Copy URL" action must copy the full overlay URL to clipboard with a success toast notification: "Overlay URL copied! Paste into OBS Browser Source." |

---

## 13.8 Data Requirements

### 13.8.1 TournamentOverlays Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `overlay_id` | UUID | PK | Unique overlay record |
| `tournament_id` | UUID | FK → tournaments | Tournament |
| `org_id` | UUID | FK → organizations | Organization |
| `overlay_type` | VARCHAR(10) | NOT NULL | OVL-01 through OVL-14 |
| `access_token` | CHAR(32) | UNIQUE, NOT NULL | URL access token |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether overlay is enabled |
| `display_params` | JSONB | NULLABLE | Overlay configuration params |
| `theme` | ENUM | DEFAULT 'dark_pro' | 'dark_pro','neon_cyber','clean_light','fire_red','custom' |
| `custom_css` | TEXT | NULLABLE | Custom CSS (Elite+ only) |
| `last_connected_at` | TIMESTAMP | NULLABLE | Last OBS connection |
| `connection_count` | INTEGER | DEFAULT 0 | Total connection count |
| `token_generated_at` | TIMESTAMP | NOT NULL | Token creation time |
| `token_expires_at` | TIMESTAMP | NOT NULL | Token expiry |
| `created_by` | UUID | FK → users | Creator |
| `created_at` | TIMESTAMP | NOT NULL | Record creation |
| `updated_at` | TIMESTAMP | NOT NULL | Last update |

### 13.8.2 OverlayConnectionLog Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `log_id` | UUID | PK | Log entry ID |
| `overlay_id` | UUID | FK → tournament_overlays | Overlay |
| `connected_at` | TIMESTAMP | NOT NULL | Connection established |
| `disconnected_at` | TIMESTAMP | NULLABLE | Disconnection time |
| `ip_address` | INET | NOT NULL | Client IP |
| `user_agent` | TEXT | NOT NULL | OBS browser source user agent |
| `events_received` | INTEGER | DEFAULT 0 | WebSocket events received |

---

## 13.9 Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|------------------|
| OBS is restarted mid-tournament while the overlay URL is loaded | OBS reloads the browser source URL; overlay reconnects to WebSocket and receives full current state within 3 seconds — no stale data |
| Producer copies wrong tournament's overlay URL into OBS | Overlay renders with a clearly visible "Tournament Not Found" or "Wrong Tournament" message — not a blank screen |
| Overlay WebSocket receives a malformed event payload | Overlay logs the error to console, ignores the malformed event, and continues displaying last valid state |
| Tournament has 256 teams but OVL-02 (Top 10) is configured | Overlay correctly displays only the top 10 ranked teams — not all 256; no performance degradation |
| Two OBS instances load the same overlay URL simultaneously | Both instances work independently; both receive all WebSocket events; server serves both without conflict |
| Overlay access token is regenerated while OBS is connected | Old token connection is terminated with a `token_invalidated` WebSocket event; OBS displays "Overlay URL expired — update your browser source URL" message |

---

## 13.10 Acceptance Criteria

| ID | Criterion | Test Method |
|----|-----------|-------------|
| AC-13-001 | An overlay URL pasted into OBS as a browser source displays correct live leaderboard data within 5 seconds of OBS loading the source. | Manual QA |
| AC-13-002 | When a match result is published, all connected overlay instances update within 3 seconds without OBS restart. | E2E automated test |
| AC-13-003 | Leaderboard row animations (slide up/down) render at 60fps in OBS browser source on a mid-range PC (Intel i5, 8GB RAM). | Manual QA / frame timing |
| AC-13-004 | If WebSocket disconnects, the overlay reconnects automatically within 30 seconds and resumes receiving live updates. | Automated test |
| AC-13-005 | Overlay backgrounds are fully transparent in OBS (no black box visible over game footage). | Manual QA |
| AC-13-006 | The live preview in the Broadcast Dashboard shows updated leaderboard data within 3 seconds of a result being published. | Manual QA |

---

---



