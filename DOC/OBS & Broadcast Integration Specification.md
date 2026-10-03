# 📄 OBS & BROADCAST INTEGRATION SPECIFICATION
## GameVerse — Esports Tournament Operations & Live Broadcast Platform
### Version: 1.0 | June 2025 | 🎬 Broadcast Infrastructure Document

---

# TABLE OF CONTENTS

1. Document Overview & Broadcast Philosophy
2. Broadcast Architecture Overview
3. OBS Integration Architecture
4. Overlay System Overview
5. Overlay Route Specification
6. Overlay Type 01 — Leaderboard Overlay
7. Overlay Type 02 — Match Information Overlay
8. Overlay Type 03 — Team Statistics Overlay
9. Overlay Type 04 — Player Statistics Overlay
10. Overlay Type 05 — Sponsor Overlay
11. Overlay Type 06 — Winner Overlay
12. Overlay Live Data Update System
13. Overlay Token & Security
14. Overlay Customization & Theming
15. Broadcast Producer Dashboard
16. OBS WebSocket Integration
17. Stream Health Monitoring
18. Overlay Animation Specification
19. Testing & QA for Overlays
20. Troubleshooting Guide

---

---

# SECTION 1 — DOCUMENT OVERVIEW & BROADCAST PHILOSOPHY

---

## 1.1 Purpose

This document defines the complete **OBS & Broadcast Integration Specification** for GameVerse — every overlay type, every live data update mechanism, every route, every animation, and every configuration option that powers professional esports broadcast production on the platform.

## 1.2 Broadcast Philosophy

```
BROADCAST DESIGN PRINCIPLES:

┌─────────────────────────────────────────────────────────────────┐
│ 1. ZERO MANUAL DATA ENTRY                                        │
│    Broadcast producers never type scores, team names, or stats.  │
│    All overlay data flows automatically from the scoring engine. │
├─────────────────────────────────────────────────────────────────┤
│ 2. ALWAYS SHOW SOMETHING                                         │
│    Overlays never go blank. On connection loss, they freeze      │
│    at the last valid state. Blank = broken on live broadcast.    │
├─────────────────────────────────────────────────────────────────┤
│ 3. PRODUCTION-GRADE ANIMATIONS                                   │
│    Every data change animates smoothly. Rank changes, score      │
│    updates, and transitions feel broadcast-quality, not amateur. │
├─────────────────────────────────────────────────────────────────┤
│ 4. BROWSER SOURCE NATIVE                                         │
│    All overlays are designed specifically for OBS Browser Source.│
│    Transparent backgrounds. No scroll. No external fonts loaded. │
│    Offline-tolerant with SockJS fallback.                        │
├─────────────────────────────────────────────────────────────────┤
│ 5. ORGANIZER-BRANDABLE                                           │
│    Every overlay inherits the organization's brand colors,       │
│    fonts, and logo. White-label ready with one configuration.    │
└─────────────────────────────────────────────────────────────────┘
```

## 1.3 Supported OBS Versions

```
COMPATIBILITY:
├── OBS Studio: 28.x, 29.x, 30.x (all current versions)
├── Streamlabs Desktop: 1.x, 2.x (Browser Source compatible)
├── vMix: Any version with Browser Input support
└── XSplit: Broadcaster with webpage source support

Browser Engine: Chromium (embedded in OBS)
├── Supports: WebSocket, SockJS, CSS animations, WebP images
├── Supports: CSS variables, CSS Grid, Flexbox
└── Does NOT support: Certain Web APIs (getUserMedia, etc.)
    → Not needed for overlays
```

## 1.4 Overlay Dimensions Reference

```
STANDARD OVERLAY DIMENSIONS:

Full HD (1080p):   1920 × 1080 pixels  ← Primary target
QHD (1440p):       2560 × 1440 pixels  ← Supported
4K (2160p):        3840 × 2160 pixels  ← Supported (scale factor)

OVERLAY-SPECIFIC DIMENSIONS:
┌──────────────────────────────────────────────────────────────┐
│ Overlay Type              │ Default Size    │ OBS Layer      │
├──────────────────────────────────────────────────────────────┤
│ Leaderboard (Full)        │ 420 × 900 px    │ Right panel    │
│ Leaderboard (Compact/10)  │ 380 × 600 px    │ Right panel    │
│ Match Information Bar     │ 1920 × 80 px    │ Bottom strip   │
│ Team Statistics           │ 480 × 320 px    │ Corner panel   │
│ Player Statistics         │ 360 × 480 px    │ Side panel     │
│ Sponsor Banner            │ 1920 × 120 px   │ Top/bottom bar │
│ Sponsor Logo (corner)     │ 200 × 100 px    │ Corner         │
│ Winner Celebration        │ 1920 × 1080 px  │ Full screen    │
│ Winner Podium             │ 800 × 400 px    │ Center stage   │
└──────────────────────────────────────────────────────────────┘
```

---

---

# SECTION 2 — BROADCAST ARCHITECTURE OVERVIEW

---

## 2.1 Complete Broadcast System Map

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    GAMEVERSE BROADCAST ARCHITECTURE                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │                   DATA SOURCES (Auto, no manual entry)               │   ║
║  │                                                                      │   ║
║  │  Scoring Engine → Leaderboard Engine → MySQL → Caffeine Cache        │   ║
║  │  Match Status Engine → STOMP WebSocket Publisher                     │   ║
║  │  Team/Player Data → Spring Data JPA → REST API                       │   ║
║  └──────────────────────────────┬───────────────────────────────────────┘   ║
║                                 │                                            ║
║                                 ▼ STOMP Events                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │               SPRING BOOT WEBSOCKET SERVER (STOMP)                   │   ║
║  │                                                                      │   ║
║  │  Topics:                                                             │   ║
║  │  /topic/tournament.{id}.leaderboard  → LEADERBOARD_UPDATED          │   ║
║  │  /topic/tournament.{id}.matches      → MATCH_STATUS_CHANGED          │   ║
║  │  /topic/tournament.{id}.overlays     → OVERLAY_COMMAND               │   ║
║  └──────────────────────────────┬───────────────────────────────────────┘   ║
║                                 │                                            ║
║         ┌───────────────────────┼─────────────────────────────┐             ║
║         ▼                       ▼                             ▼             ║
║  ┌─────────────┐   ┌────────────────────────┐   ┌──────────────────────┐   ║
║  │   OVERLAY   │   │   BROADCAST PRODUCER   │   │   OBS STUDIO         │   ║
║  │   SERVER    │   │   DASHBOARD (React)    │   │   (Production PC)    │   ║
║  │             │   │                        │   │                      │   ║
║  │  Serves:    │   │  • Stream config        │   │  Browser Sources:    │   ║
║  │  HTML pages │   │  • OBS scene control   │   │  • Leaderboard OVL  │   ║
║  │  per overlay│   │  • Overlay visibility  │   │  • Match Info OVL   │   ║
║  │  type       │   │  • Stream health       │   │  • Sponsor OVL      │   ║
║  │             │   │  • Annotation tools    │   │  • Winner OVL       │   ║
║  └──────┬──────┘   └────────────────────────┘   └──────────┬───────────┘   ║
║         │                                                   │               ║
║         │ STOMP/SockJS                                      │ STOMP/SockJS  ║
║         │◄──────────────────────────────────────────────────┘               ║
║         │                                                                    ║
║         ▼                                                                    ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │              LIVE STREAM (YouTube / Twitch / Custom RTMP)            │   ║
║  │                                                                      │   ║
║  │  OBS captures:                                                       │   ║
║  │  [Game Video Feed] + [Overlay Browser Sources] → Composite output    │   ║
║  │  → Encoded → RTMP → Platform CDN → Viewers worldwide                │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## 2.2 Data Flow: Score Update → Overlay Visible

```
SCORE → OVERLAY UPDATE FLOW:

[Referee submits result]
        ↓ REST API POST
[Spring Boot validates + saves to MySQL]
        ↓ @TransactionalEventListener
[LeaderboardEngine.recalculate()]
        ↓ Updated leaderboard saved
[SimpMessagingTemplate.convertAndSend(
    "/topic/tournament.{id}.leaderboard",
    LEADERBOARD_UPDATED payload
)]
        ↓ STOMP broker routes
[OBS Browser Source receives STOMP frame]
        ↓ JavaScript event handler
[updateLeaderboardDOM(newData)]
        ↓ DOM manipulation
[CSS transition animates rows to new positions]
        ↓
OVERLAY VISUALLY UPDATED ON STREAM

Total time: ~200-500ms from result submission
Target: < 3 seconds ✅
```

---

---

# SECTION 3 — OBS INTEGRATION ARCHITECTURE

---

## 3.1 OBS Browser Source Configuration

```
HOW BROADCAST PRODUCERS ADD OVERLAYS TO OBS:

Step 1: Open Broadcast Dashboard in GameVerse
        (Command Center → Broadcast → Overlays tab)

Step 2: Find desired overlay type
        Each overlay shows:
        ├── Preview thumbnail
        ├── Copy URL button
        ├── Recommended OBS dimensions
        └── Configuration options

Step 3: In OBS Studio:
        Sources panel → (+) Add → Browser

Step 4: Browser Source Settings:
        ┌─────────────────────────────────────────────────┐
        │ URL:    https://gameverse.gg/overlay/           │
        │         tournament/{id}/leaderboard?            │
        │         token={overlayToken}                    │
        │                                                 │
        │ Width:  420                                     │
        │ Height: 900                                     │
        │                                                 │
        │ ✅ Shutdown source when not visible             │
        │ ✅ Refresh browser when scene becomes active    │
        │                                                 │
        │ Custom CSS: (leave empty — overlay handles it)  │
        └─────────────────────────────────────────────────┘

Step 5: Position overlay in OBS scene layout
        ├── Drag to desired position
        ├── Use OBS alignment guides
        └── Lock layer when positioned

Step 6: Verify in Broadcast Dashboard:
        ├── Overlay shows "🟢 Connected" status
        ├── Preview pane shows live data
        └── Test animation by toggling visibility
```

## 3.2 Recommended OBS Scene Layout

```
RECOMMENDED OBS SCENE STRUCTURE FOR GAMEVERSE TOURNAMENT:

Scene: "Match Live" (primary scene)
┌─────────────────────────────────────────────────────────────────────┐
│ OBS SOURCE STACK (bottom to top):                                    │
│                                                                      │
│ Layer 1 (bottom): Game Video Capture / NDI Source                   │
│ Layer 2: OVL-05 Sponsor Banner (top or bottom bar)                  │
│ Layer 3: OVL-02 Match Information Bar (bottom strip)                │
│ Layer 4: OVL-01 Leaderboard Overlay (right side)                   │
│ Layer 5 (top): OVL-WINNER (hidden by default, shown on finale)      │
└─────────────────────────────────────────────────────────────────────┘

Scene: "Break Screen"
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: Tournament graphic (static image)                          │
│ Layer 2: OVL-05 Sponsor Banner (rotating sponsors)                  │
│ Layer 3: OVL-02 Match Info Bar (shows next match countdown)         │
└─────────────────────────────────────────────────────────────────────┘

Scene: "Result Reveal"
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: Game Video Capture                                          │
│ Layer 2: OVL-01 Full Leaderboard (center, full-width variant)       │
│ Layer 3: OVL-03 Team Statistics (featured team)                     │
└─────────────────────────────────────────────────────────────────────┘

Scene: "Grand Finale"
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: Tournament closing graphic                                  │
│ Layer 2: OVL-06 Winner Overlay (full screen)                        │
└─────────────────────────────────────────────────────────────────────┘

Scene: "Player Spotlight"
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: Game Video Capture                                          │
│ Layer 2: OVL-04 Player Statistics (featured player)                 │
│ Layer 3: OVL-05 Sponsor Logo (corner)                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

---

# SECTION 4 — OVERLAY SYSTEM OVERVIEW

---

## 4.1 All Overlay Types

```
GAMEVERSE OVERLAY CATALOG:

┌────┬─────────────────────────────┬───────────────┬──────────────────────────┐
│ ID │ Overlay Name                │ Trigger        │ Auto-Update Source       │
├────┼─────────────────────────────┼───────────────┼──────────────────────────┤
│ 01 │ Leaderboard (Full, 16-team) │ Always visible │ LEADERBOARD_UPDATED      │
│ 01B│ Leaderboard (Compact, Top10)│ Always visible │ LEADERBOARD_UPDATED      │
│ 01C│ Leaderboard (Mini, Top5)    │ Always visible │ LEADERBOARD_UPDATED      │
│ 02 │ Match Information Bar       │ Always visible │ MATCH_STATUS_CHANGED     │
│ 02B│ Match Countdown Timer       │ Scheduled      │ MATCH_STATUS_CHANGED     │
│ 03 │ Team Statistics Panel       │ Producer ctrl  │ RESULT_PUBLISHED         │
│ 03B│ Team vs Team Comparison     │ Producer ctrl  │ RESULT_PUBLISHED         │
│ 04 │ Player Statistics Card      │ Producer ctrl  │ RESULT_PUBLISHED         │
│ 04B│ Player Kill Feed            │ Producer ctrl  │ RESULT_PUBLISHED         │
│ 05 │ Sponsor Banner (Full-width) │ Always visible │ Static (rotates)         │
│ 05B│ Sponsor Logo (Corner)       │ Always visible │ Static                   │
│ 06 │ Winner Celebration (Full)   │ Tournament end │ TOURNAMENT_COMPLETED     │
│ 06B│ Winner Podium (Compact)     │ Tournament end │ TOURNAMENT_COMPLETED     │
│ 06C│ Result Splash (Per-match)   │ Per result     │ RESULT_PUBLISHED         │
└────┴─────────────────────────────┴───────────────┴──────────────────────────┘
```

## 4.2 Overlay Technology Stack

```
OVERLAY TECHNICAL STACK:

RENDERING: Pure HTML5 + CSS3 + Vanilla JavaScript
├── NO React framework (too heavy for OBS browser source)
├── NO external JavaScript libraries in runtime
├── NO external CSS frameworks (no Tailwind CDN)
├── All fonts: Embedded as base64 in CSS (no font CDN calls)
└── All icons: Inline SVG (no icon library CDN)

REAL-TIME: @stomp/stompjs (bundled, minified)
├── Connected to Spring Boot WebSocket STOMP endpoint
├── SockJS fallback: bundled sockjs.min.js
└── Total bundle size: < 40KB (lightweight for OBS)

ANIMATION: CSS Transitions + CSS Animations (GPU-accelerated)
├── transform: translateY (row repositioning)
├── opacity transitions (fade in/out)
├── @keyframes for celebration effects
└── No JavaScript animation libraries (no GSAP, no Anime.js)

FONTS (embedded):
├── Primary: Rajdhani (esports aesthetic, semi-condensed)
├── Secondary: Inter (data readability)
└── Monospace: JetBrains Mono (UIDs, codes)

DELIVERY:
├── Static HTML served by Nginx (5-minute edge cache)
├── Spring Boot injects initial state into HTML template
├── JavaScript connects STOMP for live updates
└── No server-side rendering on update — all client-side DOM
```

---

---

# SECTION 5 — OVERLAY ROUTE SPECIFICATION

---

## 5.1 Complete Route Map

```
OVERLAY URL STRUCTURE:

Base: https://gameverse.gg/overlay/tournament/{tournamentId}/{overlayType}

Query Parameters:
├── token={overlayToken}     REQUIRED: Security token (from Broadcast Dashboard)
├── theme={themeName}        OPTIONAL: dark (default) | light | custom
├── scale={number}           OPTIONAL: 1.0 (default), 1.25, 1.5, 2.0
└── debug={boolean}          OPTIONAL: true shows connection status overlay

COMPLETE ROUTE TABLE:
┌───────────────────────────────────────────────────────────────────────────┐
│ Route                                          │ Overlay Type             │
├───────────────────────────────────────────────────────────────────────────┤
│ /overlay/tournament/{id}/leaderboard           │ OVL-01: Full Leaderboard │
│ /overlay/tournament/{id}/leaderboard/top10     │ OVL-01B: Top 10          │
│ /overlay/tournament/{id}/leaderboard/top5      │ OVL-01C: Top 5 Mini      │
│ /overlay/tournament/{id}/match-info            │ OVL-02: Match Info Bar   │
│ /overlay/tournament/{id}/match-countdown       │ OVL-02B: Match Countdown │
│ /overlay/tournament/{id}/team/{teamId}/stats   │ OVL-03: Team Statistics  │
│ /overlay/tournament/{id}/team/compare          │ OVL-03B: Team vs Team    │
│ /overlay/tournament/{id}/player/{userId}/stats │ OVL-04: Player Stats     │
│ /overlay/tournament/{id}/player/killfeed       │ OVL-04B: Kill Feed       │
│ /overlay/tournament/{id}/sponsor               │ OVL-05: Sponsor Banner   │
│ /overlay/tournament/{id}/sponsor/corner        │ OVL-05B: Sponsor Corner  │
│ /overlay/tournament/{id}/winner                │ OVL-06: Winner Full      │
│ /overlay/tournament/{id}/winner/podium         │ OVL-06B: Winner Podium   │
│ /overlay/tournament/{id}/result-splash         │ OVL-06C: Result Splash   │
└───────────────────────────────────────────────────────────────────────────┘
```

## 5.2 Route Handler Specification (Spring Boot)

```
OVERLAY ROUTE HANDLER:

GET /overlay/tournament/{tournamentId}/{overlayType}
    (+ sub-paths for variants)

Spring Controller: OverlayController.java

Processing Steps:
1. Extract overlay token from query param
2. Validate token:
   ├── Token exists in overlay_configs table
   ├── tournament_id matches route param
   ├── overlay_type matches route param
   ├── token not expired (tournament_end + 30 days)
   └── If invalid: Return 401 Unauthorized HTML error page
3. Fetch initial tournament state:
   ├── Tournament basic info (name, game, status)
   ├── Current leaderboard (from Caffeine cache)
   ├── Current active match status
   ├── Org branding (colors, logo, fonts)
   └── Sponsor data (for sponsor overlays)
4. Render HTML template:
   ├── Inject initial state as window.__INITIAL_STATE__ JSON
   ├── Inject STOMP endpoint URL and overlay token
   ├── Inject org branding as CSS variables
   └── Return complete HTML page
5. Response headers:
   ├── Cache-Control: public, max-age=300 (5 minutes)
   ├── Content-Type: text/html; charset=UTF-8
   └── X-Frame-Options: SAMEORIGIN (OBS is same-origin compatible)
```

## 5.3 Overlay HTML Template Structure

```html
<!-- OVERLAY PAGE STRUCTURE (served by Spring Boot) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GameVerse Overlay — {overlayType}</title>

  <!-- All styles inline — no external CSS requests -->
  <style>
    /* RESET */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* TRANSPARENT BACKGROUND — critical for OBS compositing */
    html, body {
      background: transparent !important;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    /* BRAND CSS VARIABLES — injected by Spring Boot from org config */
    :root {
      --brand-primary:    {org.primaryColor};
      --brand-secondary:  {org.secondaryColor};
      --brand-accent:     {org.accentColor};
      --brand-bg:         {org.overlayBgColor};
      --brand-text:       {org.textColor};
      --brand-font:       '{org.fontFamily}', 'Rajdhani', sans-serif;
    }

    /* OVERLAY-SPECIFIC STYLES (per overlay type, also inline) */
    /* ... all CSS embedded, no @import ... */
  </style>
</head>
<body>

  <!-- OVERLAY ROOT — JavaScript renders into this -->
  <div id="overlay-root">
    <!-- Server-side initial render (prevents flash of empty content) -->
    <!-- Injected by Spring Boot Thymeleaf template -->
  </div>

  <!-- CONNECTION STATUS DOT (configurable to hide) -->
  <div id="connection-dot" class="status-dot disconnected"></div>

  <!-- INITIAL STATE — injected by Spring Boot, eliminates first-load flash -->
  <script>
    window.__INITIAL_STATE__ = /*[[${initialStateJson}]]*/ {};
    window.__CONFIG__ = {
      stompUrl:     'wss://api.gameverse.gg/ws',
      sockjsUrl:    'https://api.gameverse.gg/ws',
      overlayToken: /*[[${overlayToken}]]*/ '',
      tournamentId: /*[[${tournamentId}]]*/ '',
      overlayType:  /*[[${overlayType}]]*/ '',
      debug:        /*[[${debug}]]*/ false
    };
  </script>

  <!-- STOMP RUNTIME — bundled, minified, no CDN -->
  <script src="/overlay/static/stomp.min.js"></script>
  <script src="/overlay/static/sockjs.min.js"></script>

  <!-- OVERLAY ENGINE — shared connection + event handling -->
  <script src="/overlay/static/overlay-engine.js"></script>

  <!-- OVERLAY RENDERER — specific to overlay type -->
  <script src="/overlay/static/{overlayType}-renderer.js"></script>

</body>
</html>
```

---

---

# SECTION 6 — OVERLAY TYPE 01: LEADERBOARD OVERLAY

---

## 6.1 Overview

```
OVERLAY: OVL-01 — Full Leaderboard
Route:   /overlay/tournament/{id}/leaderboard
Size:    420 × 900 px (default) | Variants: Top10 (380×600), Top5 (320×400)
Purpose: Shows live tournament standings during match broadcast
Updates: On every LEADERBOARD_UPDATED STOMP event
```

## 6.2 Visual Layout Specification

```
OVL-01: FULL LEADERBOARD (420 × 900 px)

┌─────────────────────────────────────────────┐ ─ 0px
│  ┌───────────────────────────────────────┐  │
│  │  [ORG LOGO]  BGMI WEEKEND CUP #12     │  │ ← Header (60px)
│  │              Round 2 of 4 • Match 8/16│  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤ ─ 60px
│  COLUMN HEADERS (28px):                     │
│  # │ TEAM      │ PTS  │ KILLS │ CD          │
├─────────────────────────────────────────────┤ ─ 88px
│  ┌─────────────────────────────────────────┐│
│  │ 1▲ [logo] STORM SQUAD    STM │ 62 │38│2 ││ ← Row (52px each)
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ 2▼ [logo] HYDRA ESPORTS  HYD │ 58 │31│1 ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ 3─ [logo] PHOENIX RISING PHX │ 51 │27│1 ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ 4▲ [logo] NEXUS GAMING   NXS │ 48 │24│0 ││
│  └─────────────────────────────────────────┘│
│  ... (rows 5–16, 52px each)                 │
│                                              │
├─────────────────────────────────────────────┤ ─ 860px
│  FOOTER (40px):                             │
│  🟢 LIVE  │  Last updated: 2 sec ago        │
└─────────────────────────────────────────────┘ ─ 900px

ROW ANATOMY (52px height, 420px width):
┌──────────────────────────────────────────────┐
│ [#][▲▼] [16×16 logo] [TEAM NAME   ] [TAG] [PTS] [KLS] [CD] │
│  6px    20px         flex-grow      36px   48px  36px  24px  │
└──────────────────────────────────────────────┘

RANK CHANGE INDICATORS:
▲ (up arrow, green)   = moved up since last match
▼ (down arrow, red)   = moved down since last match
─ (dash, grey)         = no change
★ (star, gold)         = CHICKEN DINNER in last match
```

## 6.3 Leaderboard Data Schema (from STOMP)

```
DATA CONSUMED FROM: LEADERBOARD_UPDATED event
(Section 5.2 of Real-Time Architecture Document)

FIELDS USED BY LEADERBOARD OVERLAY:

Per team row:
├── rank                → Rank number (1, 2, 3...)
├── rankChangeDirection → "UP" | "DOWN" | "SAME"
├── teamName            → "Storm Squad"
├── teamTag             → "STM"
├── logoUrl             → CDN URL for team logo (16×16 in overlay)
├── totalPoints         → 62.0 → display as "62"
├── totalKills          → 38
├── chickenDinners      → 2 (CD column)
└── isDisqualified      → If true: show ⚠️ DQ badge

Tournament header:
├── tournamentName      → "BGMI Weekend Cup #12"
├── matchesCompleted    → 8
├── totalMatches        → 16 → display "Match 8/16"
├── currentRound        → 2
└── totalRounds         → 4 → display "Round 2 of 4"
```

## 6.4 Leaderboard Animation Specification

```
ANIMATION BEHAVIOR ON LEADERBOARD_UPDATED:

STEP 1: Receive STOMP event (LEADERBOARD_UPDATED)
STEP 2: Compare new ranking order with current DOM order
STEP 3: Flash animation on changed cells:
         → Points that changed: background flash yellow → normal (300ms)
         → New kills: same yellow flash
STEP 4: Calculate new vertical positions for all rows
STEP 5: Apply CSS transitions for row repositioning:
         → All rows: transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1)
         → Rows animate to new Y positions simultaneously
         → Ascending team: translateY moves UP, color pulse green
         → Descending team: translateY moves DOWN, color pulse red
STEP 6: After animation completes (600ms):
         → Update rank numbers
         → Update rank change arrows (▲ ▼ ─)
         → Update "Last updated: X sec ago" footer

CHICKEN DINNER ANIMATION:
When isChickenDinner changes to true for a match:
→ Row: Gold border glow animation (1.5s)
→ ★ star icon: spin animation (500ms)
→ Row background: brief gold highlight (800ms)
→ Then: returns to normal styled row

DISQUALIFICATION:
When isDisqualified becomes true:
→ Row: red strikethrough effect on team name
→ DQ badge appears: ⚠️ DQ (red pill badge)
→ Row moves to bottom of leaderboard
→ Points displayed in red: "38pts (DQ)"

INITIAL LOAD (no animation):
→ window.__INITIAL_STATE__ pre-populates all 16 rows
→ Renders instantly with correct data
→ No "loading" state visible
→ First STOMP update: animates from there
```

## 6.5 Leaderboard Variants

```
OVL-01B: TOP 10 LEADERBOARD
Route:   /overlay/tournament/{id}/leaderboard/top10
Size:    380 × 600 px
Changes: Only shows rank 1–10, rows slightly smaller (42px)
Use:     When full 16-team list is too tall for scene layout

OVL-01C: TOP 5 MINI LEADERBOARD
Route:   /overlay/tournament/{id}/leaderboard/top5
Size:    320 × 340 px
Changes: Only shows rank 1–5, compact rows (40px)
         No kill/CD columns (points only)
Use:     Corner placement, secondary stream (mobile stream)
```

---

---

# SECTION 7 — OVERLAY TYPE 02: MATCH INFORMATION OVERLAY

---

## 7.1 Overview

```
OVERLAY: OVL-02 — Match Information Bar
Route:   /overlay/tournament/{id}/match-info
Size:    1920 × 80 px (full-width bottom bar)
Purpose: Shows current match status, round info, and timing
Updates: On MATCH_STATUS_CHANGED STOMP event
```

## 7.2 Visual Layout Specification

```
OVL-02: MATCH INFORMATION BAR (1920 × 80 px)

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [TOURNAMENT NAME]     [ROUND]      [MATCH STATUS]    [MATCH TIMER]     │
│  BGMI Weekend Cup #12  Round 2/4    ● IN PROGRESS     ⏱ 12:34           │
│                        Match 3/16   [green pulse dot]                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

SECTIONS (left to right):
├── LEFT SECTION (480px):
│   ├── Tournament name: "BGMI Weekend Cup #12"
│   └── Organization: "by Hydra Events" (small, below)
│
├── CENTER-LEFT (320px):
│   ├── Round: "Round 2 of 4"
│   └── Match: "Match 3 of 16"
│
├── CENTER (480px):
│   ├── Status: ● IN PROGRESS (pulsing green dot)
│   │   OR: ⏸ PAUSED (pulsing orange)
│   │   OR: LOBBY OPEN (static blue)
│   │   OR: COMPLETED (static grey)
│   └── Referee name: "Ref: Mike J." (small, below)
│
└── RIGHT SECTION (640px):
    ├── Match timer: ⏱ 12:34 (counting up from match start)
    │   OR: Next match in: 08:42 (countdown to next match)
    └── Scheduled time: "Scheduled: 2:30 PM IST" (small, below)

STATUS COLORS:
├── SCHEDULED:      Blue background pill  #3B82F6
├── LOBBY_OPEN:     Cyan background pill  #06B6D4
├── IN_PROGRESS:    Green background pill #10B981 (pulsing animation)
├── PAUSED:         Orange background pill #F59E0B (pulsing animation)
├── RESULT_SUBMITTED: Purple background   #8B5CF6
└── COMPLETED:      Grey background pill  #6B7280
```

## 7.3 Match Information Data Schema

```
DATA CONSUMED FROM: MATCH_STATUS_CHANGED event

FIELDS USED:
├── tournamentName    → "BGMI Weekend Cup #12"
├── orgName           → "Hydra Events"
├── matchNumber       → 3
├── totalMatches      → 16
├── roundNumber       → 2
├── totalRounds       → 4
├── currentStatus     → "IN_PROGRESS"
├── actualStartTime   → ISO timestamp (for elapsed timer calculation)
├── scheduledStart    → ISO timestamp
├── assignedReferee.username → "RefMike"
└── estimatedEndTime  → ISO timestamp (optional, if available)

TIMER LOGIC:
In Progress:   elapsed = now - actualStartTime → display MM:SS (counting up)
Paused:        elapsed frozen at pause time, "⏸ 12:34" shown
Scheduled:     countdown = scheduledStart - now → "Starts in MM:SS"
Completed:     match duration shown → "Duration: 34:21"
```

## 7.4 Match Information Variant

```
OVL-02B: MATCH COUNTDOWN TIMER
Route:   /overlay/tournament/{id}/match-countdown
Size:    400 × 200 px
Purpose: Standalone countdown to next match (used in break screens)
Updates: On MATCH_STATUS_CHANGED

VISUAL:
┌──────────────────────────────────────┐
│          NEXT MATCH STARTS IN        │
│                                      │
│           08 : 42 : 19              │
│         HH    MM    SS               │
│                                      │
│   Round 2 of 4  ·  Match 4 of 16   │
└──────────────────────────────────────┘

Behavior:
├── Timer counts down to next scheduled match
├── At 0:00: transitions to "MATCH STARTING" state
├── When match starts: transitions to "MATCH IN PROGRESS" display
└── Pulses red when under 60 seconds remaining
```

---

---

# SECTION 8 — OVERLAY TYPE 03: TEAM STATISTICS OVERLAY

---

## 8.1 Overview

```
OVERLAY: OVL-03 — Team Statistics Panel
Route:   /overlay/tournament/{id}/team/{teamId}/stats
Size:    480 × 320 px
Purpose: Feature a specific team's performance stats
Updates: On RESULT_PUBLISHED STOMP event
Control: Broadcast Producer selects featured team in Broadcast Dashboard
```

## 8.2 Visual Layout Specification

```
OVL-03: TEAM STATISTICS PANEL (480 × 320 px)

┌─────────────────────────────────────────────────┐ ─ 0px
│  ┌─────────────────────────────────────────┐   │
│  │ [TEAM LOGO 48×48] HYDRA ESPORTS   HYD  │   │ ← Team Header (72px)
│  │                   Rank #2              │   │
│  └─────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤ ─ 72px
│  TOURNAMENT STATS (this tournament)             │
│                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┐ │
│  │  POINTS  │  KILLS   │   CDs    │ MATCHES  │ │ ← Stat row 1
│  │   58.0   │    31    │    1     │    8     │ │
│  └──────────┴──────────┴──────────┴──────────┘ │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  LAST MATCH PERFORMANCE                  │  │ ← Last match
│  │  Match 8  ·  Placement: 3rd  ·  Kills: 5│  │
│  │  Points: 15.0                            │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  MATCH HISTORY (sparkline):                     │
│  [1st][3rd][2nd][5th][4th][2nd][1st][3rd]      │ ← Placement chart
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │
│                                                 │
└─────────────────────────────────────────────────┘ ─ 320px

STAT CARD VALUES:
├── POINTS:   Sum of all total_points across published matches
├── KILLS:    Sum of all raw_kills across published matches
├── CDs:      Count of chicken dinners (1st place finishes)
└── MATCHES:  Count of completed matches
```

## 8.3 Dynamic Team Selection

```
DYNAMIC TEAM URL:
/overlay/tournament/{id}/team/{teamId}/stats

teamId can be:
├── Specific UUID:  /team/team-uuid-abc/stats
│   → Always shows this specific team
│   → Producer sets up per team in OBS
│
└── Dynamic:        /team/featured/stats
    → Shows whichever team the producer has "Featured"
    → Broadcast Dashboard: Team Spotlight selector
    → Producer picks team → OVERLAY_COMMAND sent
    → Overlay switches to featured team

FEATURED TEAM CONTROL:
Producer Dashboard → Team Spotlight → Select "Hydra Esports"
→ OVERLAY_COMMAND {
    command: "UPDATE_FEATURED_TEAM",
    overlayType: "TEAM_STATS",
    params: { teamId: "team-uuid-hyd", teamName: "Hydra Esports" }
  }
→ Overlay JS receives command → fetches team data → updates display
```

## 8.4 Team vs Team Comparison Variant

```
OVL-03B: TEAM VS TEAM COMPARISON
Route:   /overlay/tournament/{id}/team/compare
         ?teamA={teamId}&teamB={teamId}
Size:    800 × 300 px
Purpose: Side-by-side stat comparison of two featured teams
Updates: On RESULT_PUBLISHED

VISUAL:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [HYD LOGO] HYDRA ESPORTS    VS    STORM SQUAD [STM LOGO]               │
│  ─────────────────────────────────────────────────────────────          │
│  Rank:     #2                      #1                                   │
│  Points:   58.0    ────────────    62.0                                 │
│  Kills:    31      ────────────    38                                   │
│  CDs:      1       ────────────    2                                    │
│  Avg Pos:  3.9     ────────────    3.2                                  │
│  Best:     1st     ────────────    1st                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Bar widths are proportional (e.g., kills: 31 vs 38 → 44% vs 56% of bar)
Leading team's bar is brand accent color, trailing is muted.
```

---

---

# SECTION 9 — OVERLAY TYPE 04: PLAYER STATISTICS OVERLAY

---

## 9.1 Overview

```
OVERLAY: OVL-04 — Player Statistics Card
Route:   /overlay/tournament/{id}/player/{userId}/stats
Size:    360 × 480 px
Purpose: Spotlight individual player performance stats
Updates: On RESULT_PUBLISHED STOMP event
Control: Broadcast Producer selects featured player in Broadcast Dashboard
```

## 9.2 Visual Layout Specification

```
OVL-04: PLAYER STATISTICS CARD (360 × 480 px)

┌────────────────────────────────────────────┐ ─ 0px
│  ┌──────────────────────────────────────┐  │
│  │  [AVATAR 64×64]  ARJUN SHARMA        │  │ ← Player Header (88px)
│  │                  ArjunOP             │  │
│  │  [TEAM LOGO 20×20] Hydra Esports    │  │
│  └──────────────────────────────────────┘  │
├────────────────────────────────────────────┤ ─ 88px
│  IN-GAME NAME: ArjunOP                     │ ← UID display (36px)
│  BGMI ID: 549****567 (masked)              │
├────────────────────────────────────────────┤ ─ 124px
│  TOURNAMENT STATS:                         │
│                                            │
│  ┌────────────┬────────────┬────────────┐  │
│  │   TOTAL    │  AVG KILLS │  BEST GAME │  │ ← Stat row (80px)
│  │  KILLS: 18 │  2.25/mtch │  6 kills   │  │
│  └────────────┴────────────┴────────────┘  │
│                                            │
│  ┌────────────┬────────────┬────────────┐  │
│  │  MATCHES   │ AVG PLACE  │    CDs     │  │ ← Stat row (80px)
│  │     8      │    3.9     │     1      │  │
│  └────────────┴────────────┴────────────┘  │
├────────────────────────────────────────────┤ ─ 364px
│  MATCH-BY-MATCH KILLS:                     │
│  M1  M2  M3  M4  M5  M6  M7  M8           │ ← Kill chart (80px)
│  ██  █   ███ █   ██  █   ████ █            │
│  6   2   5   1   3   2   6   2            │
└────────────────────────────────────────────┘ ─ 480px

DATA SOURCE:
├── Player info: users table + team_members
├── In-game UID: registration_rosters.in_game_uid (masked in display)
├── Tournament stats: Aggregated from team_match_results
│   (Note: Individual player kill tracking not supported in BGMI
│    without game API — shows team kill stats attributed to player)
└── Match history: team_match_results per match
```

## 9.3 Player Kill Feed Variant

```
OVL-04B: PLAYER KILL FEED (Conceptual — Manual Entry)
Route:   /overlay/tournament/{id}/player/killfeed
Size:    400 × 200 px

NOTE: Since GameVerse has no direct BGMI game API access,
kill feed data is manually curated by Broadcast Producer
or pulled from post-match result data.

VISUAL:
┌──────────────────────────────────────────────────┐
│  KILL FEED                          Match 3 ● LIVE│
│  ──────────────────────────────────────────────  │
│  🔫 ArjunOP (HYD)    eliminated   PhxSniper      │
│  🔫 StormIGL (STM)   eliminated   NxsPlayer3     │
│  🐔 Storm Squad      — CHICKEN DINNER —           │
└──────────────────────────────────────────────────┘

Implementation: Broadcast Producer manually inputs
kill events in Broadcast Dashboard annotation tool.
Each annotation pushed via OVERLAY_COMMAND to this overlay.
```

---

---

# SECTION 10 — OVERLAY TYPE 05: SPONSOR OVERLAY

---

## 10.1 Overview

```
OVERLAY: OVL-05 — Sponsor Banner
Route:   /overlay/tournament/{id}/sponsor
Size:    1920 × 120 px (full-width banner)
Purpose: Display tournament sponsor branding during broadcast
Updates: Static (rotates between sponsors on timer)
         Refreshes on OVERLAY_DATA_REFRESH command
```

## 10.2 Visual Layout Specification

```
OVL-05: SPONSOR BANNER (1920 × 120 px)

SINGLE SPONSOR MODE:
┌──────────────────────────────────────────────────────────────────────────┐
│  PRESENTED BY             [SPONSOR LOGO 300×80]                          │
│  ──────────────                                                          │
│  "Powering Esports Champions"          https://techbrandpro.com          │
└──────────────────────────────────────────────────────────────────────────┘

MULTI-SPONSOR ROTATION MODE (3 sponsors):
Sponsor A displays for 15 seconds
→ Fade out transition (500ms)
→ Sponsor B fades in (500ms)
→ Sponsor B displays for 15 seconds
→ Fade to Sponsor C... → Loops

SPONSOR TIER DISPLAY:
├── TITLE SPONSOR ("Presented by"):
│   └── Logo: 300×80px, "PRESENTED BY" label, tagline shown
├── GOLD SPONSOR ("Supported by"):
│   └── Logo: 200×60px, smaller display
└── COMMUNITY SPONSOR ("Community Partner"):
    └── Logo: 160×50px, text only or small logo

SPONSOR CORNER VARIANT (OVL-05B):
Route:   /overlay/tournament/{id}/sponsor/corner
Size:    200 × 100 px
Content: Just sponsor logo + "Partner" label
Use:     Always-on corner placement during match live scenes
```

## 10.3 Sponsor Data Schema

```
DATA SOURCE:
Spring Boot fetches from tournament_sponsors + sponsors tables

window.__INITIAL_STATE__.sponsors = [
  {
    "sponsorId": "sponsor-uuid-1",
    "companyName": "TechBrand Pro",
    "logoUrl": "https://cdn.gameverse.gg/sponsors/techbrand.webp",
    "tagline": "Powering Esports Champions",
    "websiteUrl": "https://techbrandpro.com",
    "tier": "TITLE",
    "displayDurationSeconds": 15,
    "displayOrder": 1
  },
  {
    "sponsorId": "sponsor-uuid-2",
    "companyName": "GearMax",
    "logoUrl": "https://cdn.gameverse.gg/sponsors/gearmax.webp",
    "tagline": "Level Up Your Gear",
    "tier": "GOLD",
    "displayDurationSeconds": 12,
    "displayOrder": 2
  }
]

ROTATION LOGIC (JavaScript):
├── Array of sponsors with displayDurationSeconds
├── Display each in order for its duration
├── Loop continuously
├── On OVERLAY_DATA_REFRESH: restart rotation with updated sponsor list
└── On OVERLAY_COMMAND { command: "SHOW_SPONSOR", sponsorId: "uuid" }:
    Skip to specific sponsor (for planned sponsor moments)
```

---

---

# SECTION 11 — OVERLAY TYPE 06: WINNER OVERLAY

---

## 11.1 Overview

```
OVERLAY: OVL-06 — Winner Celebration (Full Screen)
Route:   /overlay/tournament/{id}/winner
Size:    1920 × 1080 px (full screen)
Purpose: Epic winner reveal when tournament is COMPLETED
Updates: On TOURNAMENT_COMPLETED STOMP event
Trigger: Automatic on tournament completion OR manual producer trigger
```

## 11.2 Visual Layout Specification

```
OVL-06: WINNER OVERLAY (1920 × 1080 px)

PHASE 1: ENTRY ANIMATION (3 seconds)
────────────────────────────────────
Gold particles rain from top
Tournament logo fades in center (scales 0 → 1, 800ms ease-out)
"TOURNAMENT COMPLETE" text slides up from below (500ms)

PHASE 2: CHAMPION REVEAL (shown until scene change)
───────────────────────────────────────────────────
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                    ✦ ✦ ✦ BGMI WEEKEND CUP #12 ✦ ✦ ✦                       │ ← Title
│                         TOURNAMENT COMPLETE                                  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      🏆  CHAMPIONS  🏆                               │   │ ← Champion
│  │                                                                      │   │   section
│  │          [LARGE TEAM LOGO 200×200]                                   │   │   (500px)
│  │          ══════════════════════════════════                          │   │
│  │                  STORM SQUAD                                         │   │
│  │                    [STM]                                             │   │
│  │                                                                      │   │
│  │          62 Points  ·  38 Kills  ·  2 Chicken Dinners               │   │
│  │                                                                      │   │
│  │   ┌──────────────────────────────────────────────────────────────┐  │   │
│  │   │ TEAM ROSTER:                                                  │  │   │
│  │   │ ArjunOP  ·  RaviSnipe  ·  KiranRush  ·  DevIGL              │  │   │
│  │   └──────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────┐   │ ← Podium
│  │   🥈 2nd Place    │  │                   │  │   🥉 3rd Place        │   │   row
│  │   HYDRA ESPORTS   │  │                   │  │   PHOENIX RISING      │   │   (200px)
│  │   [HYD LOGO]      │  │    [podium art]   │  │   [PHX LOGO]         │   │
│  │   58 pts · 31 kills│  │                   │  │   51 pts · 27 kills  │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │ ← Prize
│  │  💰 PRIZE POOL: ₹15,000    🥇 ₹7,500  🥈 ₹5,000  🥉 ₹2,500         │   │   row
│  └──────────────────────────────────────────────────────────────────────┘   │   (80px)
│                                                                              │
│  [SPONSOR LOGOS ROW]                                                         │ ← Sponsors
│  Powered by: TechBrand Pro  ·  GearMax                                      │   (80px)
│                                                                              │
│                      gameverse.gg                                            │ ← Footer
└──────────────────────────────────────────────────────────────────────────────┘

ANIMATION DETAIL:
├── Gold confetti particles: CSS @keyframes, 200 particles
├── Champion section: scale(0.8) → scale(1), 800ms spring easing
├── Podium row: slides up from bottom, staggered (2nd, then 3rd)
├── Prize row: fades in last
└── Continuous: subtle shimmer animation on champion border
```

## 11.3 Winner Data Schema

```
DATA CONSUMED FROM: TOURNAMENT_COMPLETED STOMP event + REST API fetch

window.__INITIAL_STATE__ when winner overlay loads:
{
  "tournament": {
    "id": "tid-001",
    "name": "BGMI Weekend Cup #12",
    "game": "BGMI",
    "prizePool": 15000.00,
    "currency": "INR"
  },
  "winners": [
    {
      "position": 1,
      "team": {
        "teamId": "team-uuid-stm",
        "teamName": "Storm Squad",
        "teamTag": "STM",
        "logoUrl": "https://cdn.gameverse.gg/teams/stm.webp",
        "logoUrlLarge": "https://cdn.gameverse.gg/teams/stm-lg.webp"
      },
      "stats": {
        "totalPoints": 62.0,
        "totalKills": 38,
        "chickenDinners": 2,
        "matchesPlayed": 16
      },
      "roster": [
        { "username": "ArjunOP", "displayName": "Arjun Sharma" },
        { "username": "RaviSnipe", "displayName": "Ravi Kumar" },
        { "username": "KiranRush", "displayName": "Kiran Singh" },
        { "username": "DevIGL", "displayName": "Dev Patel" }
      ],
      "prizeAmount": 7500.00
    },
    {
      "position": 2,
      "team": { ... },
      "prizeAmount": 5000.00
    },
    {
      "position": 3,
      "team": { ... },
      "prizeAmount": 2500.00
    }
  ],
  "sponsors": [ ... ],
  "org": {
    "orgName": "Hydra Events",
    "logoUrl": "https://..."
  }
}
```

## 11.4 Winner Overlay Variants

```
OVL-06B: WINNER PODIUM (Compact)
Route:   /overlay/tournament/{id}/winner/podium
Size:    800 × 400 px
Purpose: Smaller winner reveal for corner or secondary placement
Content: Top 3 podium without full-screen celebration
Use:     Side panel during final match reveal

OVL-06C: RESULT SPLASH (Per-Match)
Route:   /overlay/tournament/{id}/result-splash
Size:    1920 × 400 px (horizontal banner)
Purpose: Shows top 3 results after EACH match (not just final)
Trigger: Automatic on RESULT_PUBLISHED (every match)
Auto-hide: After 15 seconds (configurable in Broadcast Dashboard)

OVL-06C VISUAL:
┌──────────────────────────────────────────────────────────────────────────┐
│  MATCH 3 RESULTS              Round 2                                    │
│  ─────────────────────────────────────────────────────────────────────   │
│  🥇 STORM SQUAD    STM   Placement: 1st   Kills: 8   Points: 23         │
│  🥈 HYDRA ESPORTS  HYD   Placement: 2nd   Kills: 6   Points: 18         │
│  🥉 PHOENIX RISING PHX   Placement: 3rd   Kills: 5   Points: 15         │
└──────────────────────────────────────────────────────────────────────────┘

TRIGGER BEHAVIOR:
→ RESULT_PUBLISHED event received
→ Result splash slides in from top (400ms)
→ Displays for 15 seconds
→ Slides out to top (400ms)
→ Automatically hides (CSS: display none)
→ No producer action needed

Can be overridden:
→ OVERLAY_COMMAND { command: HIDE, overlayType: RESULT_SPLASH }
   Dismisses early if producer wants to switch scene
→ OVERLAY_COMMAND { command: SHOW, overlayType: RESULT_SPLASH }
   Re-shows if producer missed it
```

---

---

# SECTION 12 — OVERLAY LIVE DATA UPDATE SYSTEM

---

## 12.1 Overlay Engine Architecture

```
OVERLAY ENGINE (overlay-engine.js):

Shared across ALL overlay types. Responsibilities:
├── STOMP connection management
├── Reconnection with exponential backoff
├── Event routing to overlay-specific renderer
├── Sequence number tracking (detect missed events)
├── Connection status dot management
└── Token refresh coordination

INITIALIZATION SEQUENCE:

1. Page loads → window.__INITIAL_STATE__ available
2. Overlay-type renderer.init(__INITIAL_STATE__) called
   → Renders initial state to DOM (instant, no flash)
3. overlay-engine.connect() called:
   → Create SockJS instance
   → Create STOMP Client
   → Connect with overlayToken in headers
4. On CONNECTED:
   → Subscribe to relevant STOMP topics
   → Status dot: 🟢 green
5. Events received → dispatched to renderer
6. Renderer updates DOM with animations

STOMP SUBSCRIPTION PER OVERLAY TYPE:
┌──────────────────────────────────────────────────────────────────────┐
│ Overlay Type       │ STOMP Subscriptions                             │
├──────────────────────────────────────────────────────────────────────┤
│ Leaderboard (all)  │ /topic/tournament.{id}.leaderboard             │
│                    │ /topic/tournament.{id}.overlays                 │
├──────────────────────────────────────────────────────────────────────┤
│ Match Info Bar     │ /topic/tournament.{id}.matches                  │
│                    │ /topic/tournament.{id}.overlays                 │
├──────────────────────────────────────────────────────────────────────┤
│ Team Statistics    │ /topic/tournament.{id}.leaderboard             │
│                    │ /topic/tournament.{id}.overlays                 │
├──────────────────────────────────────────────────────────────────────┤
│ Player Statistics  │ /topic/tournament.{id}.leaderboard             │
│                    │ /topic/tournament.{id}.overlays                 │
├──────────────────────────────────────────────────────────────────────┤
│ Sponsor Banner     │ /topic/tournament.{id}.overlays                 │
│                    │ (static rotation, minimal WS needed)           │
├──────────────────────────────────────────────────────────────────────┤
│ Winner Overlay     │ /topic/tournament.{id}.status                   │
│                    │ /topic/tournament.{id}.overlays                 │
├──────────────────────────────────────────────────────────────────────┤
│ Result Splash      │ /topic/tournament.{id}.matches                  │
│                    │ /topic/tournament.{id}.overlays                 │
└──────────────────────────────────────────────────────────────────────┘
```

## 12.2 Event Handler Mapping

```
EVENT → OVERLAY ACTION MAPPING:

LEADERBOARD_UPDATED:
├── Leaderboard overlays (01, 01B, 01C):
│   → updateRankedRows(event.data.leaderboard)
│   → animateRankChanges(event.data.leaderboard)
├── Team Statistics overlay (03):
│   → findFeaturedTeam(event.data.leaderboard, featuredTeamId)
│   → updateTeamStats(featuredTeamData)
└── Player Statistics overlay (04):
    → findTeamOfPlayer(event.data.leaderboard, featuredPlayerId)
    → updatePlayerStats(playerData)

MATCH_STATUS_CHANGED:
├── Match Info Bar (02, 02B):
│   → updateStatusBadge(event.data.currentStatus)
│   → updateTimer(event.data.actualStartTime)
│   → updateMatchInfo(event.data.matchNumber, roundNumber)
└── Result Splash (06C):
    → If status = COMPLETED: auto-hide splash
    → If status = IN_PROGRESS: clear previous result

RESULT_PUBLISHED:
├── Result Splash (06C):
│   → buildResultSplash(event.data.results)
│   → showSplash() → autoHideAfter(15000ms)
└── Team/Player Stats:
    → Update last match performance section

TOURNAMENT_COMPLETED:
└── Winner Overlay (06, 06B):
    → fetchWinnerData() via REST API
    → playChampionRevealAnimation()
    → renderWinnerPodium(winnerData)

OVERLAY_COMMAND:
└── All overlays:
    switch(event.data.command) {
      case 'SHOW':             showOverlay()
      case 'HIDE':             hideOverlay()
      case 'UPDATE':           updateData(event.data.params)
      case 'REFRESH':          fetchFullData() → re-render
      case 'UPDATE_FEATURED':  setFeaturedEntity(params.entityId)
      case 'SHOW_SPONSOR':     jumpToSponsor(params.sponsorId)
    }
```

## 12.3 Live Update Latency by Overlay Type

```
LATENCY FROM EVENT TO VISIBLE OVERLAY CHANGE:

┌──────────────────────────────────────────────────────────────────┐
│ Overlay Type          │ Event Source         │ Target Latency    │
├──────────────────────────────────────────────────────────────────┤
│ Leaderboard           │ LEADERBOARD_UPDATED  │ < 500ms           │
│                       │ (after result submit)│ (incl. animation) │
├──────────────────────────────────────────────────────────────────┤
│ Match Info Bar        │ MATCH_STATUS_CHANGED │ < 300ms           │
│                       │ (status change)      │                   │
├──────────────────────────────────────────────────────────────────┤
│ Result Splash         │ RESULT_PUBLISHED     │ < 400ms           │
│                       │ (after verification) │ (slide animation) │
├──────────────────────────────────────────────────────────────────┤
│ Team Statistics       │ LEADERBOARD_UPDATED  │ < 500ms           │
├──────────────────────────────────────────────────────────────────┤
│ Winner Overlay        │ TOURNAMENT_COMPLETED │ < 2000ms          │
│                       │ + REST API fetch     │ (data + animation)│
├──────────────────────────────────────────────────────────────────┤
│ Sponsor Banner        │ Static rotation      │ N/A (timer-based) │
└──────────────────────────────────────────────────────────────────┘

TOTAL FROM RESULT SUBMIT → OVERLAY VISIBLE:
Referee submits → DB → Leaderboard calc → STOMP → OBS Browser → DOM → Screen
~200ms (network + processing) + ~600ms (CSS animation) = ~800ms total
Well within 3-second target ✅
```

---

---

# SECTION 13 — OVERLAY TOKEN & SECURITY

---

## 13.1 Token Lifecycle

```
OVERLAY TOKEN MANAGEMENT:

GENERATION:
├── Trigger: Broadcast Producer opens Overlay Management in Broadcast Dashboard
├── Spring Boot: Generate UUID v4 overlay token
├── Store in overlay_configs:
│   ├── tournament_id
│   ├── overlay_type
│   ├── token_hash (SHA-256 — raw token never stored)
│   ├── created_at
│   ├── expires_at (tournament end date + 30 days)
│   └── is_active (true)
└── Raw token returned ONCE to Broadcast Dashboard (like a secret key)

TOKEN IN URL:
/overlay/tournament/{id}/leaderboard?token=550e8400-e29b-41d4-a716...
└── Token is a query parameter (not a path segment)
└── URL is used in OBS Browser Source settings

VALIDATION ON EVERY REQUEST:
GET /overlay/tournament/{id}/leaderboard?token=...
├── SHA-256 hash the token from query param
├── Lookup in overlay_configs WHERE token_hash = ? AND tournament_id = ?
├── Check: is_active = true
├── Check: expires_at > NOW()
├── Check: overlay_type matches URL path
├── If valid: Serve overlay HTML with initial state injected
└── If invalid: Return 401 HTML error page (not blank, shows error message)

TOKEN ROTATION:
Broadcast Producer → Broadcast Dashboard → Rotate Token button
├── Old token: is_active = false (immediate)
├── New token: generated
├── Producer updates OBS Browser Source URL with new token
├── Old OBS source: Next heartbeat check fails → disconnects
└── New OBS source: Connects and works normally

WHAT TOKEN GRANTS:
├── Serve overlay HTML page ✅
├── STOMP subscribe to public tournament topics ✅
├── STOMP subscribe to /topic/tournament.{id}.overlays ✅
└── No access to: command topics, user queues, admin APIs ❌

TOKEN SECURITY PROPERTIES:
├── Compromise risk: LOW (overlay data is mostly public leaderboard data)
├── Mitigation: Instant rotation if compromised
└── No PII exposed: Overlay never shows player UIDs, emails, phone numbers
```

---

---

# SECTION 14 — OVERLAY CUSTOMIZATION & THEMING

---

## 14.1 Theme System

```
THEMING ARCHITECTURE:

Overlays support two theming approaches:

APPROACH 1: Organization Brand Kit (Automatic)
─────────────────────────────────────────────
Org Owner/Admin configures brand in Organization Settings:
├── Primary color:   #6B48FF (purple)
├── Secondary color: #FF4B6E (coral)
├── Accent color:    #FFD700 (gold)
├── Background:      #0A0A1A (near black)
├── Text color:      #FFFFFF
├── Font family:     "Rajdhani" (or custom)
└── Logo URL:        org logo for overlay header

These inject as CSS variables into every overlay:
:root {
  --brand-primary:   #6B48FF;
  --brand-secondary: #FF4B6E;
  --brand-accent:    #FFD700;
  --brand-bg:        #0A0A1A;
  --brand-text:      #FFFFFF;
}

All overlay CSS uses var(--brand-primary) etc.
Change org colors → all overlays update on next load.

APPROACH 2: URL Theme Parameter
───────────────────────────────
?theme=dark    → Default dark esports theme
?theme=light   → Light background theme
?theme=minimal → Clean minimal (less glassmorphism)
?theme=custom  → Uses ONLY org brand variables (no defaults)

APPROACH 3: Scale Parameter
────────────────────────────
?scale=1.0     → Default (1080p)
?scale=1.25    → Slightly larger text
?scale=1.5     → Large (for 1440p streams)
?scale=2.0     → Double size (for 4K streams)
All px values multiplied by scale factor via CSS transform
```

## 14.2 Visual Design Specifications

```
DESIGN LANGUAGE — GAMEVERSE OVERLAYS:

AESTHETIC: Dark esports with glassmorphism accents

BASE COLORS (default dark theme):
├── Background:    rgba(10, 10, 26, 0.90)   (near-black, 90% opacity)
├── Glass panels:  rgba(255, 255, 255, 0.05) (frosted glass effect)
├── Borders:       rgba(255, 255, 255, 0.10)
├── Text primary:  #FFFFFF
├── Text secondary:#A0AEC0 (muted grey)
└── Text accent:   var(--brand-primary)

EFFECTS:
├── Backdrop blur:  backdrop-filter: blur(10px) on panels
├── Box shadows:    0 4px 16px rgba(0,0,0,0.4) on cards
├── Borders:        1px solid rgba(255,255,255,0.08)
└── Gradients:      Linear gradient from brand-primary to brand-secondary
                    on rank #1 row, header, etc.

RANK COLOR CODING:
├── Rank 1:   Gold gradient background  → #FFD700 accent
├── Rank 2:   Silver tint               → #C0C0C0 accent
├── Rank 3:   Bronze tint               → #CD7F32 accent
├── Ranks 4+: Default glass panel
└── DQ teams: Red tint + strikethrough

RANK CHANGE COLORS:
├── Moved up (▲):   #10B981 (emerald green)
├── Moved down (▼): #EF4444 (red)
└── No change (─):  #6B7280 (grey)

TYPOGRAPHY:
├── Tournament name:    Rajdhani Bold, 24px
├── Team names:         Rajdhani SemiBold, 18px
├── Team tags:          Rajdhani Regular, 14px, muted
├── Points/stats:       JetBrains Mono, 16px (monospace for alignment)
├── Headers:            Rajdhani Bold, 12px, uppercase, letter-spacing: 2px
└── Footer/timestamps:  Inter, 11px, muted
```

---

---

# SECTION 15 — BROADCAST PRODUCER DASHBOARD

---

## 15.1 Dashboard Overview

```
BROADCAST PRODUCER DASHBOARD
(React component within Command Center: /command-center/{id}/broadcast)

SECTIONS:
┌──────────────────────────────────────────────────────────────────────────┐
│  BROADCAST DASHBOARD — BGMI Weekend Cup #12                              │
├──────────────────────────────┬───────────────────────────────────────────┤
│  SECTION A: STREAM STATUS    │  SECTION B: OVERLAY MANAGEMENT           │
│                              │                                           │
│  Platform: YouTube ✅         │  OVL-01 Leaderboard    🟢 Connected      │
│  Bitrate: 6000kbps ✅         │  OVL-02 Match Bar      🟢 Connected      │
│  FPS: 60 ✅                   │  OVL-05 Sponsor        🟢 Connected      │
│  Dropped: 0.02% ✅            │  OVL-06 Winner         ⚫ Standby        │
│  CPU: 47% ✅                  │                                           │
│  Viewers: 1,204               │  [Configure] [Copy URL] [Rotate Token]   │
│  Peak: 1,842                  │                                           │
├──────────────────────────────┼───────────────────────────────────────────┤
│  SECTION C: OBS CONTROL      │  SECTION D: LEADERBOARD PREVIEW          │
│                              │                                           │
│  OBS: 🟢 Connected           │  [Live preview of leaderboard overlay]   │
│  Current Scene: Match Live   │  1. Storm Squad    STM  62pts             │
│                              │  2. Hydra Esports  HYD  58pts            │
│  Quick Scenes:               │  3. Phoenix Rising PHX  51pts            │
│  [Match Live] [Break Screen] │  ...                                      │
│  [Result Show] [Grand Finale]│                                           │
├──────────────────────────────┼───────────────────────────────────────────┤
│  SECTION E: OVERLAY COMMANDS │  SECTION F: STREAM ANNOTATIONS           │
│                              │                                           │
│  Result Splash: [Show][Hide] │  [⚡ Match Start]  [🎮 Match End]         │
│  Team Spotlight: [Select ▾]  │  [🐔 Chicken Dinner] [💬 Custom]         │
│  Player Spotlight: [Select ▾]│                                           │
│  Sponsor: [Jump to ▾]        │  Recent:                                  │
│  Winner Screen: [Trigger]    │  14:30:05 - Match 3 Start               │
│                              │  14:42:18 - Chicken Dinner (Storm)       │
│                              │  14:44:55 - Match 3 End                  │
└──────────────────────────────┴───────────────────────────────────────────┘
```

## 15.2 Overlay Management Panel

```
OVERLAY MANAGEMENT (SECTION B — DETAILED):

For each overlay type:
┌─────────────────────────────────────────────────────────────────────────┐
│  🎬 LEADERBOARD OVERLAY (OVL-01)                         🟢 CONNECTED   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Browser Source URL:                                                     │
│  https://gameverse.gg/overlay/tournament/tid-001/leaderboard             │
│  ?token=550e8400-e29b-41d4-a716-446655440000                             │
│                               [📋 Copy URL]  [🔄 Rotate Token]          │
│                                                                          │
│  OBS Settings:   Width: 420px  Height: 900px                            │
│                                [📋 Copy Settings]                        │
│                                                                          │
│  Configuration:                                                          │
│  ├── Theme:    [Dark ▾]                                                  │
│  ├── Scale:    [1.0 ▾]                                                   │
│  ├── Show top: [16 teams ▾]                                             │
│  ├── Show kills column:   [✅ Yes]                                       │
│  ├── Show CD column:      [✅ Yes]                                       │
│  └── Animate rank changes:[✅ Yes]                                       │
│                                                [💾 Save Configuration]  │
│                                                                          │
│  Connected browsers: 1  (OBS Browser Source)                            │
│  Last update received: 2 seconds ago                                    │
│  Preview: [Small leaderboard thumbnail showing live data]                │
│                                                                          │
│  Actions:  [👁️ Preview Full] [📡 Force Refresh] [⚙️ Advanced]           │
└─────────────────────────────────────────────────────────────────────────┘
```

## 15.3 OBS Scene Control

```
OBS SCENE CONTROL (SECTION C — DETAILED):

Requires OBS WebSocket connection to producer's OBS instance.

Connection Setup:
├── Producer opens OBS → Tools → WebSocket Server Settings → Enable
├── Port: 4455, Password: [set by producer]
├── In Broadcast Dashboard: Enter ws://localhost:4455 + password
└── Click Connect → "🟢 OBS Connected — 8 scenes detected"

Quick Scene Buttons:
[Match Live]    → OBS scene: "Match Live" (game capture + leaderboard + bar)
[Break Screen]  → OBS scene: "Break Screen" (graphic + sponsor + countdown)
[Result Show]   → OBS scene: "Result Show" (game + full leaderboard)
[Grand Finale]  → OBS scene: "Grand Finale" (winner overlay full screen)
[Player Spot]   → OBS scene: "Player Spotlight" (game + player card)

Auto-Trigger (configurable):
├── RESULT_PUBLISHED → Auto switch to "Result Show" scene
│   Producer setting: [✅ Auto-switch on result]
│   Duration: Switch back to "Match Live" after [30 ▾] seconds
│
└── TOURNAMENT_COMPLETED → Auto switch to "Grand Finale" scene
    Producer setting: [✅ Auto-switch on tournament complete]

Implementation:
Spring Boot → OVERLAY_COMMAND { command: SCENE_CHANGE, scene: "Match Live" }
→ Broadcast Dashboard React component receives STOMP event
→ Calls OBS WebSocket API: SetCurrentProgramScene
→ OBS switches scene
→ Dashboard shows: "✅ Scene switched to Match Live"
```

---

---

# SECTION 16 — OBS WEBSOCKET INTEGRATION

---

## 16.1 OBS WebSocket Protocol

```
OBS WEBSOCKET INTEGRATION:

OBS Studio 28+ includes OBS WebSocket server (obs-websocket 5.x protocol).
GameVerse Broadcast Dashboard connects to producer's local OBS instance.

CONNECTION:
Producer's OBS Machine:
└── OBS Studio running on Windows/Mac/Linux
    └── WebSocket server: ws://localhost:4455
        └── Password: set by producer in OBS settings

GameVerse Broadcast Dashboard (React):
└── Connects to ws://localhost:4455 via WebSockets API
    (Note: Browser connects to localhost — requires producer on same machine
     OR proxy configuration for remote OBS)

OPERATIONS USED:

1. GetSceneList
   → List all configured OBS scenes
   → Displayed as quick-switch buttons in dashboard
   → Used to validate scene names

2. SetCurrentProgramScene
   → Switch OBS to named scene
   → Triggered by: Producer button OR auto-trigger on STOMP event

3. GetStreamStatus
   → Check if stream is live, bitrate, FPS, dropped frames
   → Polled every 5 seconds for stream health display

4. StartStream / StopStream
   → Start/stop stream from dashboard (convenience)
   → Confirmation dialog before stopping

5. GetStats
   → CPU usage, memory usage, rendering lag
   → Displayed in stream health section

NOTE ON ARCHITECTURE:
OBS WebSocket is browser-to-OBS, not server-to-OBS.
Spring Boot does NOT directly control OBS.
The React Broadcast Dashboard (running in producer's browser)
connects directly to local OBS WebSocket.
Spring Boot sends STOMP events → React receives →
React calls OBS WebSocket API.
```

---

---

# SECTION 17 — STREAM HEALTH MONITORING

---

## 17.1 Stream Health Dashboard

```
STREAM HEALTH INDICATORS:

DATA SOURCES:
├── OBS WebSocket: GetStreamStatus + GetStats (every 5 seconds)
├── YouTube/Twitch API: Viewer count (every 60 seconds)
└── STOMP: STREAM_HEALTH_UPDATE event (pushed by server when fetched)

HEALTH METRICS DISPLAYED:

Metric              Good          Warning          Critical
──────────────────────────────────────────────────────────────
Bitrate             > 4500kbps    2000–4500kbps    < 2000kbps
FPS                 > 55fps       45–55fps         < 45fps
Dropped Frames      < 0.5%        0.5–2%           > 2%
CPU Usage           < 70%         70–85%           > 85%
OBS Connection      Connected     Reconnecting     Disconnected
Stream Status       Live          Starting         Offline

VISUAL INDICATORS:
├── 🟢 Green dot = Good (all metrics in "Good" range)
├── 🟡 Yellow dot = Warning (any metric in "Warning" range)
├── 🔴 Red dot = Critical (any metric in "Critical" range)
└── ⚫ Grey dot = Stream offline / OBS not connected

ALERTS:
├── Bitrate drops below 2000kbps: Toast alert (P1)
├── Dropped frames exceeds 2%: Toast alert (P1)
├── OBS disconnects: Prominent banner + notification (P0)
└── Stream goes offline unexpectedly: Immediate alert (P0)
```

---

---

# SECTION 18 — OVERLAY ANIMATION SPECIFICATION

---

## 18.1 Complete Animation Reference

```
ALL ANIMATIONS USED ACROSS OVERLAYS:

LEADERBOARD ANIMATIONS:
─────────────────────────────────────────────────────────────
rankRowSlide:
  Property:  transform: translateY
  Duration:  600ms
  Easing:    cubic-bezier(0.4, 0, 0.2, 1) (Material ease)
  Trigger:   Rank order changes after LEADERBOARD_UPDATED

rankUp:
  Property:  background-color flash (transparent → green → transparent)
  Duration:  1200ms
  Keyframes: 0% → transparent | 30% → rgba(16,185,129,0.3) | 100% → transparent
  Trigger:   Team rank improves

rankDown:
  Property:  background-color flash (transparent → red → transparent)
  Duration:  1200ms
  Keyframes: 0% → transparent | 30% → rgba(239,68,68,0.2) | 100% → transparent
  Trigger:   Team rank drops

pointsUpdate:
  Property:  color flash on points value (white → gold → white)
  Duration:  800ms
  Trigger:   Points value changes for a team

chickenDinner:
  Property:  gold border glow + star spin
  Duration:  1500ms (border) + 500ms (star spin)
  Trigger:   Team achieves chicken dinner (1st place)

MATCH INFO BAR ANIMATIONS:
─────────────────────────────────────────────────────────────
statusPulse (IN_PROGRESS):
  Property:  opacity 1 → 0.4 → 1
  Duration:  1500ms, infinite
  Trigger:   Match status = IN_PROGRESS

statusPulseOrange (PAUSED):
  Property:  opacity + background-color pulse orange
  Duration:  1000ms, infinite
  Trigger:   Match status = PAUSED

timerTick:
  Property:  No animation (just text update every second)
  Format:    MM:SS counting up from match start

RESULT SPLASH ANIMATIONS:
─────────────────────────────────────────────────────────────
splashSlideIn:
  Property:  transform: translateY(-100%) → translateY(0)
  Duration:  400ms
  Easing:    cubic-bezier(0.34, 1.56, 0.64, 1) (spring overshoot)
  Trigger:   RESULT_PUBLISHED event

splashSlideOut:
  Property:  transform: translateY(0) → translateY(-100%)
  Duration:  300ms
  Easing:    ease-in
  Trigger:   After displayDurationSeconds OR OVERLAY_COMMAND HIDE

WINNER OVERLAY ANIMATIONS:
─────────────────────────────────────────────────────────────
confettiRain:
  Type:      CSS @keyframes on 200 particle divs
  Duration:  3000ms initial burst + continuous subtle fall
  Colors:    Brand primary, gold, white, silver

championReveal:
  Property:  transform: scale(0.8) opacity(0) → scale(1) opacity(1)
  Duration:  800ms
  Easing:    cubic-bezier(0.34, 1.56, 0.64, 1) (spring)
  Delay:     1500ms (after confetti starts)

podiumSlideUp:
  Property:  transform: translateY(100%) → translateY(0)
  Duration:  500ms
  Easing:    ease-out
  Delay:     2nd place: 2500ms | 3rd place: 2800ms

shimmerBorder:
  Type:      CSS @keyframes on champion card border
  Property:  background-position (gradient slide)
  Duration:  2000ms, infinite
  Effect:    Gold shimmer animating along border

SPONSOR BANNER ANIMATIONS:
─────────────────────────────────────────────────────────────
sponsorFadeOut:
  Property:  opacity: 1 → 0
  Duration:  500ms
  Trigger:   Timer expires for current sponsor

sponsorFadeIn:
  Property:  opacity: 0 → 1
  Duration:  500ms
  Trigger:   After previous sponsor fades out

PERFORMANCE NOTES:
├── All animations use transform and opacity only (GPU-accelerated)
├── No layout-triggering properties animated (no width, height, top, left)
├── will-change: transform applied to animated elements
└── 60fps maintained on OBS Chromium (tested requirement)
```

---

---

# SECTION 19 — TESTING & QA FOR OVERLAYS

---

## 19.1 Testing Strategy

```
OVERLAY TESTING APPROACH:

UNIT TESTS (Vitest + JSDOM):
├── Leaderboard renderer:
│   ├── Renders correct number of rows (16, 10, 5)
│   ├── Correct rank order (highest points first)
│   ├── Rank change direction calculated correctly
│   ├── DQ teams shown at bottom with DQ badge
│   └── Points formatted correctly (no decimals for whole numbers)
│
├── Match info bar:
│   ├── Status badge shows correct color per status enum
│   ├── Timer counts up correctly from actualStartTime
│   └── Countdown shows correct time to scheduled start
│
└── Result splash:
    ├── Shows top 3 from results array (sorted by placement)
    ├── Auto-hides after displayDurationSeconds
    └── OVERLAY_COMMAND HIDE dismisses early

INTEGRATION TESTS (Spring Boot Test):
├── Overlay route: GET /overlay/tournament/{id}/leaderboard
│   ├── Valid token → 200 with HTML containing __INITIAL_STATE__
│   ├── Invalid token → 401 HTML error page
│   ├── Expired token → 401 HTML error page
│   └── __INITIAL_STATE__ contains correct leaderboard data
│
└── Overlay STOMP connection:
    ├── Connect with valid overlay token → CONNECTED
    ├── Subscribe to /topic/tournament.{id}.leaderboard → allowed
    ├── Subscribe to /topic/tournament.{id}.command → denied
    └── Cannot subscribe to /user/*/queue/* with overlay token

VISUAL REGRESSION TESTS (Playwright):
├── Screenshot each overlay with test tournament data
├── Compare to baseline screenshots (pixel diff < 0.1%)
├── Test overlay on different viewport sizes (scale parameter)
├── Test both dark and light themes
└── Test each animation with video recording

E2E BROADCAST TESTS (Playwright with OBS simulation):
├── Submit match result
│   → Assert: Leaderboard overlay updates within 3 seconds
│   → Assert: Rank change animations play (CSS class check)
│   → Assert: Result splash appears automatically
│   → Assert: Result splash disappears after 15 seconds
│
├── Tournament complete
│   → Assert: Winner overlay displays champion team name
│   → Assert: Confetti animation plays (class check)
│   → Assert: All top 3 teams shown correctly
│
├── Reconnection
│   → Kill STOMP connection
│   → Assert: Connection dot turns red (⚫ → 🔴)
│   → Wait for reconnect (5 seconds)
│   → Assert: Connection dot turns green
│   → Assert: Leaderboard shows current data (not stale)
│
└── Overlay token rotation
    → Rotate token in Broadcast Dashboard
    → Assert: Old overlay disconnects (dot goes grey)
    → Load overlay with new token URL
    → Assert: New overlay connects and shows correct data
```

---

---

# SECTION 20 — TROUBLESHOOTING GUIDE

---

## 20.1 Common Issues & Resolutions

```
TROUBLESHOOTING GUIDE FOR BROADCAST PRODUCERS:

─────────────────────────────────────────────────────────────────────
ISSUE: Overlay shows blank/white background in OBS
─────────────────────────────────────────────────────────────────────
Cause:   OBS Browser Source custom CSS overriding transparent bg
Fix:     Clear the "Custom CSS" field in OBS Browser Source settings
         The overlay handles its own background transparency.

─────────────────────────────────────────────────────────────────────
ISSUE: Overlay shows "401 - Invalid Token" error
─────────────────────────────────────────────────────────────────────
Cause A: Token was rotated — URL is outdated
Fix:     Go to Broadcast Dashboard → Overlays → Copy new URL
         Update OBS Browser Source with new URL

Cause B: Tournament ended > 30 days ago — token expired
Fix:     Contact GameVerse support if needed for post-event access

─────────────────────────────────────────────────────────────────────
ISSUE: Connection status dot is 🔴 Red (disconnected)
─────────────────────────────────────────────────────────────────────
Cause A: OBS production machine lost internet
Fix:     Check internet connection. Overlay auto-reconnects when restored.
         Data is frozen at last known state — safe to continue broadcasting.

Cause B: GameVerse server restart/maintenance
Fix:     Wait 30-60 seconds. Overlay reconnects automatically.
         Status page: https://status.gameverse.gg

─────────────────────────────────────────────────────────────────────
ISSUE: Leaderboard not updating after result submitted
─────────────────────────────────────────────────────────────────────
Cause A: Result not yet published (pending director verification)
Check:   Command Center → Scoring → Result status = PENDING_VERIFICATION
Fix:     Director must verify and approve the result

Cause B: Overlay disconnected from WebSocket
Check:   Connection status dot is red/grey
Fix:     Refresh OBS Browser Source (right-click → Refresh)
         Or click "Force Refresh" in Broadcast Dashboard

─────────────────────────────────────────────────────────────────────
ISSUE: OBS WebSocket shows "Not Connected" in Broadcast Dashboard
─────────────────────────────────────────────────────────────────────
Check 1: OBS Studio is running on the production machine
Check 2: OBS → Tools → WebSocket Server Settings → Server Enabled ✅
Check 3: Port 4455 is not blocked by firewall
Check 4: Password in Broadcast Dashboard matches OBS WebSocket password
Fix:     Verify all above. Firewall: allow port 4455 on loopback (localhost).
Note:    OBS WebSocket only works when dashboard open on SAME machine as OBS.

─────────────────────────────────────────────────────────────────────
ISSUE: Overlay text too small / too large for stream
─────────────────────────────────────────────────────────────────────
Fix:     Add scale parameter to overlay URL:
         ?scale=1.5  → 50% larger
         ?scale=2.0  → Double size (for 4K)
         OR: Adjust OBS Browser Source dimensions proportionally

─────────────────────────────────────────────────────────────────────
ISSUE: Winner overlay did not appear on tournament completion
─────────────────────────────────────────────────────────────────────
Cause A: Winner overlay not added as Browser Source in OBS
Fix:     Add /overlay/tournament/{id}/winner as Browser Source
         Switch to Grand Finale scene that contains this source

Cause B: Auto-trigger not configured
Fix:     Broadcast Dashboard → OBS Control → ✅ Auto-switch on complete

Cause C: Tournament completed but winner overlay in wrong OBS scene
Fix:     Manually click [Grand Finale] scene button in Broadcast Dashboard
         OR drag winner overlay Browser Source into correct scene in OBS

─────────────────────────────────────────────────────────────────────
ISSUE: Sponsor rotation stopped / showing wrong sponsor
─────────────────────────────────────────────────────────────────────
Fix:     Broadcast Dashboard → Overlay Commands → Sponsor → [Force Refresh]
         This sends OVERLAY_DATA_REFRESH command → sponsor overlay reloads list
```

## 20.2 Quick Diagnostic Checklist

```
PRE-TOURNAMENT BROADCAST CHECKLIST:

T-60 minutes before first match:

OVERLAYS:
☐ All Browser Sources added to OBS scenes
☐ All overlays showing 🟢 Connected in Broadcast Dashboard
☐ Leaderboard preview shows registered teams (alphabetical pre-tournament)
☐ Match Info Bar shows "SCHEDULED" status for Match 1
☐ Sponsor banner showing correct sponsors and rotating
☐ Winner overlay added to Grand Finale scene (hidden/standby)

OBS:
☐ OBS WebSocket connected in Broadcast Dashboard
☐ All 4+ scenes configured (Match Live, Break, Result, Finale)
☐ Stream configured (key, platform URL)
☐ Test stream to confirm bitrate/quality

BROADCAST DASHBOARD:
☐ Stream health shows green for all metrics
☐ Viewer count polling working (shows 0 pre-stream)
☐ OBS scene quick-switch buttons tested
☐ Annotation tools tested (dummy annotation added + deleted)

TOURNAMENT:
☐ All team registrations APPROVED
☐ Match schedule published
☐ Check-in window timing confirmed with organizer
☐ First match start time confirmed

COMMUNICATION:
☐ Contact channel with Tournament Director confirmed (Discord/WhatsApp)
☐ Contact with Referees confirmed
☐ Escalation contact for tech issues confirmed
```

---

---

## DOCUMENT COMPLETION SUMMARY

---

## Overlay Coverage

| Overlay | Route | Auto-Update | Animation | Status |
|---------|-------|:-----------:|:---------:|--------|
| OVL-01: Leaderboard Full | `/leaderboard` | ✅ LEADERBOARD_UPDATED | ✅ Row slide + rank flash | ✅ Defined |
| OVL-01B: Leaderboard Top10 | `/leaderboard/top10` | ✅ | ✅ | ✅ Defined |
| OVL-01C: Leaderboard Top5 | `/leaderboard/top5` | ✅ | ✅ | ✅ Defined |
| OVL-02: Match Info Bar | `/match-info` | ✅ MATCH_STATUS_CHANGED | ✅ Status pulse | ✅ Defined |
| OVL-02B: Match Countdown | `/match-countdown` | ✅ | ✅ Red pulse < 60s | ✅ Defined |
| OVL-03: Team Statistics | `/team/{id}/stats` | ✅ RESULT_PUBLISHED | ✅ Data flash | ✅ Defined |
| OVL-03B: Team vs Team | `/team/compare` | ✅ | ✅ Bar animation | ✅ Defined |
| OVL-04: Player Statistics | `/player/{id}/stats` | ✅ RESULT_PUBLISHED | ✅ Data flash | ✅ Defined |
| OVL-04B: Kill Feed | `/player/killfeed` | ✅ Manual + STOMP | ✅ Slide in | ✅ Defined |
| OVL-05: Sponsor Banner | `/sponsor` | Static rotation | ✅ Fade transition | ✅ Defined |
| OVL-05B: Sponsor Corner | `/sponsor/corner` | Static | None | ✅ Defined |
| OVL-06: Winner Full | `/winner` | ✅ TOURNAMENT_COMPLETED | ✅ Confetti + reveal | ✅ Defined |
| OVL-06B: Winner Podium | `/winner/podium` | ✅ | ✅ Podium slide | ✅ Defined |
| OVL-06C: Result Splash | `/result-splash` | ✅ RESULT_PUBLISHED | ✅ Slide in/out | ✅ Defined |

## Document Statistics

| Element | Count |
|---------|-------|
| Overlay Types Defined | 14 |
| Overlay Routes Defined | 14 |
| Animation Types Specified | 15+ |
| STOMP Events Consumed | 6 |
| OBS Operations Used | 5 |
| Troubleshooting Scenarios | 8 |
| Pre-Tournament Checklist Items | 20 |

---

## Document Sign-Off

| Role | Name | Status |
|------|------|--------|
| Product Lead | — | Pending Review |
| Engineering Lead | — | Pending Review |
| Broadcast / Design Lead | — | Pending Review |
| QA Lead | — | Pending Review |

---

> **Document:** GameVerse OBS & Broadcast Integration Specification | **Version:** 1.0 | **Overlays:** 14 Types | **Status:** Complete ✅