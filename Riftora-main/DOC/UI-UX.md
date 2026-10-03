# GameVerse UI/UX Design System

## Master Reference Guide for Creating All Other Pages

This document analyzes the **exact visual direction of the landing page you created** and converts it into a reusable UI/UX system.

The goal is:

> **Every future page—Dashboard, Tournament Management, Teams, Live Operations, Leaderboards, Broadcast, Settings—should feel like part of the same GameVerse product.**

---

# 1. Overall Design Identity

## 🎮 Design Style

The UI combines:

```text
Professional SaaS
        +
Esports Gaming
        +
Real-Time Operations
        +
Dark Cinematic Experience
        +
Modern Glass/Depth
```

### The most important rule

❌ Don't design GameVerse like a typical gaming website.

❌ Don't make everything neon, glowing, and cyberpunk.

Instead:

✅ Dark professional interface
✅ Cinematic gaming visuals
✅ Strong blue interaction system
✅ Dense data where needed
✅ Clean cards and hierarchy
✅ Gaming visuals only as atmosphere

---

# 2. Core Visual Formula

Every GameVerse page should follow this formula:

```text
DYNAMIC AURORA/PARTICLE BACKGROUND
        ↓
GLASSMORPHISM (BACKDROP BLUR)
        ↓
STRUCTURED BENTO GRID CONTENT
        ↓
TRANSLUCENT CARDS (bg-white/5)
        ↓
BLUE PRIMARY ACTIONS
        ↓
SEMANTIC LIVE COLORS
```

---

# 3. Color System

The screenshot uses a **deep navy-based dark interface**, not pure black.

## 🌑 Main Background

```css
--gv-bg-primary: #071426;
--gv-bg-secondary: #0A1930;
--gv-bg-tertiary: #0D1E38;
```

### Usage

```text
#071426 → Main application background
#0A1930 → Major sections
#0D1E38 → Elevated areas
```

---

# 4. Surface System

## Level 1 — Page Background

```css
background: #071426;
```

Used for:

* Main page
* Large application areas
* Dashboard background

---

## Level 2 — Section Background

```css
background: #0A1930;
```

Used for:

* Feature sections
* Large grouped areas
* Page zones

---

## Level 3 — Glassmorphic Cards

```css
background: rgba(255, 255, 255, 0.05); /* bg-white/5 */
backdrop-filter: blur(12px); /* backdrop-blur-md */
border: 1px solid rgba(255, 255, 255, 0.1); /* border-white/10 */
```

Used for:

* Tournament cards
* Analytics cards
* Feature cards
* Dashboard panels
* Bento grid items

---

## Level 4 — Elevated Cards

```css
background: #10233F;
border: 1px solid rgba(96, 165, 250, 0.15);
```

Used for:

* Important information
* Active modules
* Interactive panels

---

# 5. Primary Blue System 🔵

The screenshot's strongest visual identity is the blue.

```css
--gv-blue-primary: #2563EB;
--gv-blue-hover: #3B82F6;
--gv-blue-dark: #1D4ED8;
--gv-blue-light: #60A5FA;
--gv-blue-soft: rgba(37, 99, 235, 0.12);
--gv-blue-glow: rgba(37, 99, 235, 0.25);
```

---

## Where Blue Should Be Used

### Primary Blue

Use for:

```text
✓ Primary CTA
✓ Active navigation
✓ Important links
✓ Selected states
✓ Primary charts
✓ Focus states
✓ Important icons
✓ Progress indicators
```

### Example

```text
[ Create Tournament → ]
[ Go Live → ]
[ Save Changes ]
[ View Details → ]
```

---

# 6. Accent Colors

The landing page uses additional colors carefully.

## 🔴 LIVE

```css
--gv-live: #EF233C;
```

Use only for:

```text
LIVE
LIVE MATCH
STREAMING
CRITICAL ALERT
END MATCH
```

Example:

```text
🔴 LIVE
```

---

## 🟣 Broadcast

```css
--gv-purple: #8B5CF6;
```

Use for:

```text
Broadcast
OBS
Streaming
Overlays
Scenes
```

---

## 🟢 Success

```css
--gv-success: #22C55E;
```

Use for:

```text
Connected
Completed
Verified
Healthy
```

---

## 🟠 Warning

```css
--gv-warning: #F59E0B;
```

Use for:

```text
Check-in
Pending
Action Required
Warning
```

---

# 7. Text Color System

This is extremely important.

The screenshot does **not use pure white everywhere**.

## Primary Heading

```css
--gv-text-primary: #F8FAFC;
```

Used for:

```text
Page titles
Hero headings
Important numbers
Tournament names
```

---

## Secondary Text

```css
--gv-text-secondary: #94A3B8;
```

Used for:

```text
Descriptions
Supporting text
Metadata
Labels
```

---

## Muted Text

```css
--gv-text-muted: #64748B;
```

Used for:

```text
Timestamps
Small metadata
Inactive labels
Helper text
```

---

# 8. Typography System

## Font Families

### Display Font

```text
Rajdhani (Google Fonts)
```

Used for:

```text
Page titles
Hero headings
Important numbers
Statistics
Card titles
Tournament names
```

---

### Main Body Font

```text
Inter (Google Fonts)
```

Used for:

```text
Body text
Descriptions
Buttons
Navigation
Forms
Sub-metadata
```

---

### Technical/Data Font

```text
JetBrains Mono
```

Use only for:

```text
Match IDs
Timers
Technical status
System information
```

Example:

```text
MATCH #03
00:24:18
TEAM_482
```

---

# 9. Typography Scale

## Display / Hero

```css
font-size: 56px;
font-weight: 700;
line-height: 1.05;
letter-spacing: -0.03em;
```

Desktop landing hero.

---

## Page Heading

```css
font-size: 32px;
font-weight: 700;
line-height: 1.2;
```

Example:

```text
Tournament Overview
```

---

## Section Heading

```css
font-size: 24px;
font-weight: 700;
```

Example:

```text
Live Event Command Center
```

---

## Card Title

```css
font-size: 16px;
font-weight: 600;
```

---

## Body

```css
font-size: 14px;
line-height: 1.6;
color: #94A3B8;
```

---

# 10. Page Layout Structure

The screenshot follows a strong vertical rhythm.

Every page should generally use:

```text
┌──────────────────────────────────┐
│ TOP NAVIGATION                   │
├──────────────────────────────────┤
│ PAGE HEADER / HERO               │
│ Title + Description + Actions    │
├──────────────────────────────────┤
│ PRIMARY CONTENT                  │
│                                  │
│ Bento Grid / Dashboard           │
│                                  │
├──────────────────────────────────┤
│ SECONDARY CONTENT                │
│                                  │
├──────────────────────────────────┤
│ CTA / NEXT ACTION                │
└──────────────────────────────────┘
```

---

# 11. The Bento Grid System

This is one of the most important characteristics.

Use a **12-column responsive grid**.

```css
grid-template-columns: repeat(12, minmax(0, 1fr));
gap: 24px;
```

---

## Standard Card Sizes

### Small

```text
3 columns
```

Used for:

* Metrics
* Small statistics
* Quick actions

---

### Medium

```text
4 columns
```

Used for:

* Tournament cards
* Feature cards
* Team cards

---

### Large

```text
6 columns
```

Used for:

* Charts
* Leaderboards
* Activity panels

---

### Full Width

```text
12 columns
```

Used for:

* Tables
* Large dashboards
* Timeline
* Command center

---

# 12. Section Spacing

The landing page uses **large breathing space between sections**.

Use:

```css
--section-gap: 96px;
--section-gap-tablet: 64px;
--section-gap-mobile: 48px;
```

Inside sections:

```css
gap: 24px;
```

Inside cards:

```css
padding: 24px;
```

---

# 13. Navigation Design

The navigation is:

```text
Dark
Minimal
Horizontal
Thin
Professional
```

Structure:

```text
LOGO
Home
Tournaments
Features
Pricing
About
                  Search
                  Sign In
                  Get Started
```

---

## Navigation Rules

### Active Item

```css
color: white;
background: rgba(37, 99, 235, 0.15);
```

Include subtle blue underline or glow.

---

### Inactive Item

```css
color: #94A3B8;
```

---

### Hover

```css
color: #FFFFFF;
background: rgba(255,255,255,0.04);
```

---

# 14. Hero Section Structure

The hero has two major areas.

```text
┌─────────────────────────────────────────────┐
│                                             │
│  TEXT AREA              CINEMATIC IMAGE     │
│                                             │
│  Eyebrow                BGMI / Esports      │
│  Main Heading           Character           │
│  Description                                 │
│                                             │
│  CTA Buttons            Floating LIVE Card │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Hero Heading Pattern

The screenshot uses **multi-line hierarchy**.

Example:

```text
Manage Tournaments.
Run Live Events.
BUILD ESPORTS.
```

Important:

Use one accent-colored line.

```text
White
White
Blue
```

This pattern can be reused for marketing pages.

---

# 15. Eyebrow Labels

Use small uppercase labels.

Example:

```text
ESPORTS TOURNAMENT OPERATIONS PLATFORM
```

Style:

```css
font-size: 11px;
font-weight: 700;
letter-spacing: 0.14em;
text-transform: uppercase;
color: #3B82F6;
```

Use these before section headings.

---

# 16. Buttons

## Primary Button

The screenshot uses rounded blue buttons.

```text
[ Get Started Free → ]
```

Style:

```css
background: linear-gradient(
  135deg,
  #2563EB,
  #1D4ED8
);
color: white;
padding: 12px 20px;
border-radius: 10px;
box-shadow:
0 8px 24px rgba(37,99,235,0.25);
```

---

## Secondary Button

```text
[ ◉ Watch Demo ]
```

Style:

```css
background: transparent;
border: 1px solid rgba(148,163,184,0.35);
color: #F8FAFC;
```

---

# 17. Card Design (Glassmorphism)

The cards in the new design have shifted from solid backgrounds to a **glassmorphic aesthetic** to allow the dynamic background to shine through:

```text
Translucent white surface (bg-white/5)
Subtle white border (border-white/10)
Medium radius (rounded-2xl)
Backdrop blur (backdrop-blur-md)
Soft shadow
```

Base Tailwind classes:

```css
.gameverse-card {
  @apply bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md;
}
```

---

## Inner Card Elements

Do **not** use harsh solid backgrounds for inner elements (like stats or leaderboard rows). Instead, use lower opacity fills:

```css
.inner-element {
  @apply bg-white/5 border border-white/5 p-3 rounded-md;
}
```

---

## Card Hover

```css
.gameverse-card:hover {
  @apply bg-white/10 border-white/20 -translate-y-1 transition-all duration-300;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
```

⚠️ Keep the movement smooth and subtle using framer-motion or CSS transitions.

---

# 18. Tournament Cards 🏆

Tournament cards should contain:

```text
┌─────────────────────┐
│ IMAGE               │
│                     │
│ 🔴 LIVE             │
│                     │
├─────────────────────┤
│ BGMI CHAMPIONSHIP   │
│                     │
│ Apr 12 - Apr 14     │
│ 24 Teams            │
│                     │
│ ₹5,00,000           │
│ PRIZE POOL       →  │
└─────────────────────┘
```

---

## Card Image Rules

Use:

```css
aspect-ratio: 16 / 9;
```

Image should have:

```text
Dark overlay
Blue gradient overlay
Good contrast
```

Never place text directly over a bright image without overlay.

---

# 19. Feature Grid

The screenshot uses feature cards like:

```text
┌────────────────┐
│ ICON           │
│                │
│ Feature Name   │
│ Description    │
└────────────────┘
```

Examples:

```text
🏆 Tournament Management
🎮 Live Match Operations
📊 Leaderboards & Rankings
👥 Teams & Player Management
📡 Broadcast Integration
📈 Analytics & Reports
```

---

## Icon Container

```css
width: 40px;
height: 40px;
background:
rgba(37,99,235,0.12);
border:
1px solid rgba(59,130,246,0.18);
border-radius: 10px;
```

---

# 20. Command Center UI 🎛️

This is the visual style you should reuse for the main product dashboard.

Structure:

```text
┌──────────────────────────────────────────────┐
│ GAMEVERSE                                    │
│                                              │
│ SIDEBAR        MAIN CONTENT                  │
│                                              │
│ Live Ops       MATCH #03                     │
│ Matches        🔴 LIVE                        │
│ Teams                                        │
│ Broadcast      ┌──────────────┐              │
│                │ Match Control│              │
│                └──────────────┘              │
│                                              │
│                Leaderboard / Chart            │
└──────────────────────────────────────────────┘
```

---

# 21. Dashboard Design Pattern

For application pages:

```text
PAGE HEADER
│
├── Title
├── Description
└── Primary Action
METRICS ROW
│
├── Metric
├── Metric
├── Metric
└── Metric
PRIMARY CONTENT
│
├── Main Data Panel
└── Secondary Panel
SECONDARY CONTENT
│
├── Activity
├── Recent Events
└── Quick Actions
```

---

# 22. Metric Cards

Example:

```text
┌───────────────────┐
│ Total Tournaments │
│                   │
│ 24                │
│ ↑ 12% this month  │
└───────────────────┘
```

Structure:

```text
Small Label
Big Number
Trend / Metadata
```

---

## Metric Number

```css
font-family: JetBrains Mono;
font-size: 28px;
font-weight: 700;
color: white;
```

---

# 23. Live Operations Design

This page should feel slightly more intense.

## Normal Dashboard

```text
Calm
Spacious
Informative
```

## Live Operations

```text
Dense
Fast
High Priority
Real-time
```

---

### Important Areas

```text
🔴 LIVE STATUS
MATCH TIMER
MATCH CONTROL
LIVE LEADERBOARD
TEAM STATUS
EVENT ACTIVITY
BROADCAST STATUS
```

---

# 24. Status Badges

Use this structure everywhere:

```text
● STATUS
```

Examples:

```text
🔴 LIVE
🟢 COMPLETED
🟠 CHECK-IN
🔵 REGISTRATION OPEN
🟣 BROADCASTING
```

CSS concept:

```css
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}
```

---

# 25. Data Density Rules

This is very important for GameVerse.

## Marketing Pages

Use:

```text
More whitespace
Large visuals
Large typography
Less information
```

---

## Management Pages

Use:

```text
Medium density
Clear cards
Tables
Filters
```

---

## Live Operations

Use:

```text
High information density
Compact spacing
Fast scanning
Strong status colors
```

---

# 26. Background Visual Strategy

The screenshot uses cinematic gaming images as **atmosphere**, especially in:

* Hero
* Statistics section
* CTA section

## Rule

Images should never compete with UI.

Use:

```css
background-image:
linear-gradient(
rgba(7,20,38,0.80),
rgba(7,20,38,0.95)
),
url(image);
```

---

# 27. Image Usage System

## Use Gaming Images For

✅ Hero sections
✅ Tournament banners
✅ Marketing sections
✅ CTA sections
✅ Game-specific tournament pages

## Don't Use Gaming Images For

❌ Settings
❌ Forms
❌ Tables
❌ Dense management screens
❌ Most admin pages

The actual application should remain **data-first**.

---

# 28. Borders

The screenshot relies heavily on subtle borders.

Use:

```css
border:
1px solid rgba(148,163,184,0.12);
```

For active:

```css
border:
1px solid rgba(59,130,246,0.45);
```

Avoid:

```text
Bright white borders
Heavy borders
Multiple borders everywhere
```

---

# 29. Shadows

Use dark, soft shadows.

```css
box-shadow:
0 10px 30px
rgba(0,0,0,0.25);
```

For floating components:

```css
box-shadow:
0 24px 60px
rgba(0,0,0,0.40);
```

---

# 30. Glass Effect

Use glass only for important floating elements.

Examples:

```text
LIVE floating status
Modal
Command palette
Floating control panel
```

Style:

```css
background:
rgba(13,30,56,0.72);
backdrop-filter:
blur(16px);
border:
1px solid
rgba(255,255,255,0.08);
```

⚠️ Don't make every card glass.

---

# 31. Animation Rules

Animations should feel professional.

## Allowed

```text
Button hover
Card lift
LIVE pulse
Data update flash
Panel transition
Dropdown animation
```

---

## Timing

```css
fast: 150ms;
normal: 200ms;
slow: 300ms;
```

---

## LIVE Animation

Use a subtle pulse.

```text
🔴 ● LIVE
```

The dot can pulse.

The entire page should **not** flash.

---

# 32. Responsive Rules

## Desktop ≥ 1280px

```text
Full experience
12-column grid
Multi-column layouts
Full navigation
```

---

## Tablet 768px–1279px

```text
8-column grid
Reduced spacing
Collapsed side navigation
Cards become wider
```

---

## Mobile < 768px

```text
Single column
Stacked content
Drawer navigation
Full-width buttons where needed
```

---

# 33. Mobile Design Rule

Never simply shrink the desktop.

Instead:

### Desktop

```text
Text | Image
```

### Mobile

```text
Text
Image
```

---

# 34. UX Hierarchy Formula

Every page should answer these questions immediately:

### 1️⃣ Where am I?

```text
Tournament / Live Operations
```

### 2️⃣ What is happening?

```text
Match #03 — LIVE
```

### 3️⃣ What is important?

```text
Timer
Leaderboard
Critical alerts
```

### 4️⃣ What can I do?

```text
Pause
Update Score
End Match
```

---

# 35. Reusable Page Blueprint

Use this for almost every GameVerse page:

```text
╔════════════════════════════════════════════╗
║ GLOBAL NAVIGATION                          ║
╠════════════════════════════════════════════╣
║                                            ║
║ EYEBROW                                   ║
║ PAGE TITLE                     ACTION      ║
║ Description                                ║
║                                            ║
╠════════════════════════════════════════════╣
║                                            ║
║ METRIC / STATUS CARDS                      ║
║                                            ║
╠════════════════════════════════════════════╣
║                                            ║
║ PRIMARY CONTENT                            ║
║                                            ║
║ ┌─────────────────┐ ┌───────────────────┐ ║
║ │ Main Panel      │ │ Secondary Panel   │ ║
║ │                 │ │                   │ ║
║ └─────────────────┘ └───────────────────┘ ║
║                                            ║
╠════════════════════════════════════════════╣
║                                            ║
║ SECONDARY CONTENT                          ║
║                                            ║
╚════════════════════════════════════════════╝
```

---

# 36. Component Design Language

Every reusable component should follow:

```text
Dark Surface
+
Subtle Border
+
Blue Interaction
+
White Primary Text
+
Muted Secondary Text
+
Soft Hover
+
Medium Rounded Corners
```

---

# 🎯 MASTER UI PROMPT FOR FUTURE PAGES

You can give this to an AI coding/design agent:

```text
Design this page using the GameVerse visual design system.
VISUAL IDENTITY:
GameVerse is a professional esports tournament operations platform.
The design combines dark modern SaaS, cinematic esports atmosphere,
real-time command center interfaces, and structured bento-grid layouts.
THEME:
- Deep navy dark backgrounds (#071426 / #0A1930)
- Dark elevated cards (#0D1E38 / #10233F)
- Primary interaction color: esports blue (#2563EB)
- Primary text: #F8FAFC
- Secondary text: #94A3B8
- Muted text: #64748B
- Subtle borders using rgba blue/white with low opacity
SEMANTIC COLORS:
- LIVE / Critical: Red
- Success / Completed: Green
- Warning / Check-in: Amber
- Broadcast / OBS: Purple
- Primary actions: Blue
TYPOGRAPHY:
- Inter for UI and content
- JetBrains Mono for match IDs, scores, timers, rankings,
  technical metadata, and operational data
LAYOUT:
- Responsive 12-column Bento Grid
- Desktop-first operations interface
- 24px standard gaps
- Large sections have strong vertical spacing
- Cards use 12–16px border radius
- Dashboard content uses clear visual hierarchy
CARD STYLE:
- Dark navy elevated surface
- Subtle 1px border
- Soft dark shadow
- Minimal blue highlights
- Hover lifts slightly
- Never use excessive glass effects
UX PRINCIPLES:
1. Make the most important information visible first.
2. Use strong hierarchy.
3. Make real-time status immediately recognizable.
4. Prioritize operational clarity over decoration.
5. Use cinematic gaming imagery only as atmosphere.
6. Do not make the interface look like a generic gaming website.
7. Avoid excessive neon and cyberpunk effects.
8. Keep dense operational pages easy to scan.
9. Use semantic colors consistently.
10. Every action must have clear feedback.
PAGE STRUCTURE:
1. Page Header
   - Eyebrow label
   - Title
   - Description
   - Primary action
2. Status / Metrics
3. Primary Bento Content
4. Secondary Information
5. Contextual Quick Actions
RESPONSIVE:
- Desktop: full multi-column grid
- Tablet: reduced columns and collapsible navigation
- Mobile: stacked single-column layout
Maintain visual consistency with the GameVerse landing page:
dark cinematic navy background, blue accents, professional esports
visuals, subtle borders, structured cards, and real-time operational clarity.
```

---

# 🏗️ PART 2 — GameVerse Application Shell & Navigation

This is the **foundation for every internal GameVerse page**.

The landing page is the marketing experience. Once a user signs in, they enter a completely different environment:

> **GameVerse = Professional Esports Operations Command Center**

---

# 1. Application Shell Architecture

## Desktop Layout

```text
┌──────┬──────────────────────┬─────────────────────────────────────────┐
│      │                      │ TOP HEADER                              │
│ LOGO │   CONTEXT SIDEBAR    ├─────────────────────────────────────────┤
│      │                      │                                         │
│ ICON │   Dashboard          │                                         │
│ NAV  │   Tournaments        │              MAIN CONTENT               │
│      │   Teams              │                                         │
│      │   Players            │                                         │
│      │                      │                                         │
│      │   ─────────────      │                                         │
│      │   LIVE OPERATIONS    │                                         │
│      │                      │                                         │
│      │   Matches            │                                         │
│      │   Leaderboard        │                                         │
│      │   Broadcast          │                                         │
│      │                      │                                         │
└──────┴──────────────────────┴─────────────────────────────────────────┘
 64px          260px                        Fluid
```

---

# 2. Three-Level Navigation System

GameVerse should use **3 navigation layers**.

## Layer 1 — Global Navigation

Width:

```text
64px
```

Purpose:

```text
Switch major application areas.
```

---

### Global Navigation Items

```text
🏠 Dashboard
🏆 Tournaments
👥 Teams
📺 Live
📊 Analytics
⚙️ Settings
```

Use **icons only** on desktop.

### Active State

```text
┌────────────┐
│    🏆      │ ← Blue icon
└────────────┘
```

Style:

```css
background: rgba(37, 99, 235, 0.16);
color: #60A5FA;
border-radius: 12px;
```

---

# 3. Layer 2 — Context Sidebar

Width:

```text
260px
```

Background:

```css
background: #0A1930;
border-right: 1px solid rgba(148,163,184,0.10);
```

This sidebar changes depending on the selected module.

---

## Example: Tournament Module

```text
GAMEVERSE
Workspace Name
────────────────────
OVERVIEW
Dashboard
TOURNAMENTS
All Tournaments
Create Tournament
MANAGEMENT
Teams
Players
Registrations
OPERATIONS
Stages & Matches
Live Operations
Leaderboard
BROADCAST
Streams
Overlays
────────────────────
Settings
```

---

# 4. Sidebar UX Rules

### Section Label

```text
TOURNAMENTS
```

Style:

```css
font-size: 10px;
font-weight: 700;
letter-spacing: 0.12em;
color: #64748B;
```

---

### Navigation Item

```text
🏆 All Tournaments
```

Inactive:

```css
color: #94A3B8;
```

Hover:

```css
background: rgba(255,255,255,0.04);
color: #F8FAFC;
```

Active:

```css
background: rgba(37,99,235,0.14);
color: #60A5FA;
border-left: 2px solid #2563EB;
```

---

# 5. Top Header

Height:

```text
64px
```

Structure:

```text
┌────────────────────────────────────────────────────────────┐
│ ☰   Dashboard / Tournament / BGMI Championship             │
│                                                            │
│                      🔍 Search   🔔   Avatar ▼             │
└────────────────────────────────────────────────────────────┘
```

---

## Left Side

### Breadcrumb

Example:

```text
Tournaments / BGMI Championship / Live Operations
```

Rules:

```text
Previous levels → Muted
Current page → White
Separator → /
```

---

## Right Side

```text
⌕ Search
🔔 Notifications
🟢 System Status
👤 User Menu
```

---

# 6. Global Search / Command Center

This should be more powerful than a normal search.

Shortcut:

```text
Ctrl + K
```

Users can search:

```text
Tournaments
Teams
Players
Matches
Settings
Actions
```

Example:

```text
┌─────────────────────────────────────────────┐
│ 🔍 Search GameVerse...                      │
├─────────────────────────────────────────────┤
│ RECENT                                      │
│ 🏆 BGMI Championship                        │
│ 👥 Team Soul                                │
│ 🎮 Match #03                                │
├─────────────────────────────────────────────┤
│ QUICK ACTIONS                               │
│ + Create Tournament                         │
│ + Start Match                               │
│ + Add Team                                  │
└─────────────────────────────────────────────┘
```

---

# 7. Main Content Area

```css
background: #071426;
min-height: 100vh;
padding: 32px;
```

Maximum content width:

```text
No strict max-width for operational pages.
```

Reason:

Live operations and dashboards need screen space.

For normal pages:

```text
max-width: 1600px
```

---

# 8. Standard Internal Page Layout

Every internal page should follow:

```text
╔══════════════════════════════════════════════════════════╗
EYEBROW
PAGE TITLE                              PRIMARY ACTION
Description
──────────────────────────────────────────────────────────
METRICS / STATUS
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Metric   │ │ Metric   │ │ Metric   │ │ Metric   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
PRIMARY CONTENT
┌────────────────────────────┐ ┌─────────────────┐
│                            │ │                 │
│       MAIN CONTENT         │ │ SECONDARY       │
│                            │ │                 │
└────────────────────────────┘ └─────────────────┘
SECONDARY CONTENT
┌─────────────────────────────────────────────────────────┐
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# 9. Page Header Component

Every major page uses:

```text
EYEBROW
Tournament Management
Create, organize and manage your esports tournaments.
                         [+ Create Tournament]
```

### Structure

```tsx
<PageHeader>
    <Eyebrow />
    <Title />
    <Description />
    <Actions />
</PageHeader>
```

---

# 10. Workspace Switcher

At the top of the context sidebar:

```text
┌──────────────────────────┐
│ 🎮 GameVerse Organization│
│ Esports Workspace       ▼│
└──────────────────────────┘
```

Click opens:

```text
┌──────────────────────────┐
│ YOUR WORKSPACES          │
│                          │
│ ✓ GameVerse Organization │
│   College Esports        │
│   BGMI Events            │
│                          │
│ + Create Workspace       │
└──────────────────────────┘
```

This is important because GameVerse should eventually support:

```text
Organization
      ↓
Multiple tournaments
      ↓
Multiple teams/events
```

---

# 11. Live Operations Special Mode 🔴

When entering:

```text
Live Operations
```

The UI should change slightly.

---

## Add a Live Status Bar

```text
🔴 LIVE EVENT
BGMI Championship 2026
MATCH #03
00:24:18
●  Connected
```

Position:

```text
Top of content area
```

or

```text
Sticky below header
```

---

### Visual Hierarchy

```text
Normal Application
       ↓
Dark Navy
Live Operations
       ↓
Slightly Higher Contrast
LIVE Status
       ↓
Red Accent
```

⚠️ Do not turn the entire page red.

---

# 12. Notification Center 🔔

Clicking the bell opens:

```text
┌─────────────────────────────┐
│ Notifications               │
│                             │
│ 🔴 Match #03 is LIVE        │
│                             │
│ 🟠 Team check-in pending    │
│                             │
│ 🟢 Score updated            │
│                             │
│ 🟣 OBS connected            │
│                             │
│ View All Notifications      │
└─────────────────────────────┘
```

Notifications should use semantic colors.

---

# 13. User Menu

```text
👤 Ravi Kumar
Administrator
──────────────
Profile
Workspace Settings
Preferences
──────────────
Sign Out
```

Keep it simple.

---

# 14. Responsive Navigation

## Desktop

```text
64px Global Nav
+
260px Context Sidebar
+
Fluid Content
```

---

## Tablet

```text
64px Global Nav
+
Collapsed Context Sidebar
+
Fluid Content
```

Context sidebar opens when needed.

---

## Mobile

```text
┌──────────────────────────────┐
│ ☰ GameVerse       🔔 👤      │
└──────────────────────────────┘
```

Clicking ☰ opens:

```text
┌───────────────────────┐
│ GAMEVERSE             │
│                       │
│ 🏠 Dashboard          │
│ 🏆 Tournaments        │
│ 👥 Teams              │
│ 🔴 Live Operations    │
│ 📊 Analytics          │
│ ⚙️ Settings           │
└───────────────────────┘
```

---

# 15. Application Shell Component Structure

For React:

```text
src/
│
├── layouts/
│
│   └── AppLayout/
│       ├── AppLayout.tsx
│       ├── GlobalSidebar.tsx
│       ├── ContextSidebar.tsx
│       ├── TopHeader.tsx
│       └── MobileNavigation.tsx
│
├── components/
│
│   ├── navigation/
│   │   ├── NavItem.tsx
│   │   ├── NavSection.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── WorkspaceSwitcher.tsx
│   │
│   └── ui/
│       ├── PageHeader.tsx
│       ├── CommandPalette.tsx
│       ├── NotificationPanel.tsx
│       └── UserMenu.tsx
```

---

# 16. Important UX Rules for the Entire Application

## Rule 1 — Navigation must never confuse users

Maximum hierarchy:

```text
Global Area
    ↓
Module
    ↓
Page
```

Avoid:

```text
Sidebar
    ↓
Sidebar
       ↓
Sidebar
          ↓
Sidebar
```

---

## Rule 2 — Important actions stay visible

Example:

```text
Create Tournament
```

Should always be visible in the page header.

---

## Rule 3 — LIVE information has priority

During a live event:

```text
LIVE STATUS
MATCH TIMER
CRITICAL ALERTS
```

must be visible without excessive scrolling.

---

## Rule 4 — Don't overuse cards

Cards should group meaningful information.

❌ Bad:

```text
Card
 Card
  Card
   Card
```

✅ Good:

```text
Page
 ├── Metrics Group
 ├── Main Panel
 └── Activity Panel
```

---

# 🎯 Master Design Formula for Internal Pages

```text
DEEP NAVY BACKGROUND
        +
64px GLOBAL NAV
        +
260px CONTEXT NAV
        +
64px HEADER
        +
CLEAR PAGE HEADER
        +
BENTO CONTENT GRID
        +
SEMANTIC REAL-TIME STATES
        +
DATA-FIRST UX
```
