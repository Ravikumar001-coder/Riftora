# 📄 DOCUMENT 4: SYSTEM ARCHITECTURE (REVISED)
## GameVerse — Esports Tournament Operations & Live Broadcast Platform
### Stack: React 19 + Java 21 Spring Boot | Version: 2.0 | June 2025

---

# TABLE OF CONTENTS

1. Document Overview & Architecture Philosophy
2. High-Level System Architecture
3. Frontend Architecture (React 19)
4. Backend Architecture (Spring Boot)
5. Real-Time Infrastructure (Spring WebSocket + STOMP)
6. Database Architecture (MySQL + JPA/Hibernate)
7. File Storage & CDN
8. Authentication & Security Architecture (Spring Security)
9. Payment Infrastructure
10. Notification Infrastructure
11. OBS Overlay Infrastructure
12. Background Job Processing
13. Caching Strategy
14. Search Infrastructure
15. Monitoring & Observability
16. Deployment & Infrastructure (DevOps)
17. Network Architecture & Security
18. Disaster Recovery & Business Continuity
19. Technology Stack Summary
20. Architecture Decision Records (ADRs)

---

---

# SECTION 1 — DOCUMENT OVERVIEW & ARCHITECTURE PHILOSOPHY

---

## 1.1 Purpose

This document defines the complete technical system architecture for the GameVerse platform using **React 19** on the frontend and **Java 21 + Spring Boot** on the backend. It covers infrastructure design, technology choices, service boundaries, data flows, real-time communication, security architecture, and deployment strategy.

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

## 1.2 Architecture Goals

| Goal | Description | Priority |
|------|-------------|---------|
| **Real-Time First** | Match status, leaderboard, credentials propagate to all consumers within 2–3 seconds via STOMP/WebSocket | 🔴 Critical |
| **Mobile-Optimized** | 70%+ players on mobile; 4G-friendly; 2.5s LCP target on public pages | 🔴 Critical |
| **High Availability** | 99.5% uptime overall; 99.9% during active tournament windows | 🔴 Critical |
| **Secure by Default** | Spring Security RBAC; credential encryption; JWT stateless auth; field-level encryption | 🔴 Critical |
| **India-First** | Indian payment rails (Razorpay); DLT-compliant SMS; Indian CDN PoPs; INR-native | 🔴 Critical |
| **Horizontally Scalable** | Stateless Spring Boot instances behind load balancer; scale at tournament peaks | 🟠 High |
| **Developer Velocity** | Modular monolith with clean package boundaries; OpenAPI contract-first | 🟠 High |
| **Cost-Efficient** | MySQL over managed NoSQL; Redis added at scale; RabbitMQ deferred to V2 | 🟠 High |
| **Observable** | Actuator health endpoints; structured logging; Sentry + Datadog integration | 🟠 High |

## 1.3 Architecture Style

GameVerse uses a **Spring Boot Modular Monolith** for MVP — a single deployable JAR organized into well-defined Spring component packages mirroring the 21 platform modules. This architecture is intentionally designed for clean extraction into microservices at V2 scale.

```
MVP (Current):
┌─────────────────────────────────────────┐
│    SPRING BOOT MODULAR MONOLITH         │
│  Single JAR → All 21 modules inside    │
│  Clean package boundaries enforced     │
│  Domain events via Spring Events       │
└─────────────────────────────────────────┘
              ↓ When warranted:
V2 (Scale):
┌──────────────────────────────────────────────────┐
│  AUTH SERVICE │ TOURNAMENT SERVICE │ SCORING SVC │
│  NOTIF. SVC   │ BROADCAST SERVICE  │ PAYMENT SVC │
│  All communicate via RabbitMQ message broker      │
└──────────────────────────────────────────────────┘
              ↓ If hyper-scale:
V3: Full Microservices with service mesh
```

## 1.4 Key Architecture Constraints

| Constraint | Implication |
|-----------|-------------|
| No BGMI/Free Fire public game API | All match data entered manually; no automated score ingestion |
| Indian payment regulations | Razorpay mandatory; TDS compliance; RBI escrow rules |
| OBS browser source requirement | Overlay service must serve lightweight HTML + STOMP WebSocket |
| Real-time leaderboard for 500+ concurrent viewers | STOMP topics + Redis pub-sub at scale |
| Room credential security | AES-256 field encryption; strict Spring Security access control |
| Indian SMS DLT regulations | TRAI DLT-registered templates via MSG91 |
| Java ecosystem constraints | Spring Security for RBAC; Hibernate for ORM; Bean Validation for input |
| MySQL as primary database | JPA/Hibernate ORM; Flyway for schema migrations |

---

---

# SECTION 2 — HIGH-LEVEL SYSTEM ARCHITECTURE

---

## 2.1 System Context Diagram

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                           EXTERNAL ACTORS                                 ║
║                                                                           ║
║  [Organizers]  [Players/Captains]  [Viewers]  [Referees]  [OBS Studio]  ║
║       │               │               │            │            │         ║
╚═══════╪═══════════════╪═══════════════╪════════════╪════════════╪═════════╝
        │               │               │            │            │
        ▼               ▼               ▼            ▼            ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║              CLOUDFLARE (DNS + CDN + WAF + DDoS Protection)              ║
╚═══════════════════════════════════════════════════════════════════════════╝
        │                      │                       │
        ▼                      ▼                       ▼
  [HTTPS — React SPA]   [WS/STOMP Traffic]    [Overlay Requests]
        │                      │                       │
╔═══════╪══════════════════════╪═══════════════════════╪═══════════════════╗
║       ▼                      ▼                       ▼    NGINX LAYER    ║
║  ┌─────────┐          ┌────────────┐           ┌──────────┐             ║
║  │  NGINX  │          │   NGINX    │           │  NGINX   │             ║
║  │  (SPA)  │          │  (API+WS)  │           │(Overlay) │             ║
║  └────┬────┘          └─────┬──────┘           └────┬─────┘             ║
║       │                     │                        │                   ║
╚═══════╪═════════════════════╪════════════════════════╪═══════════════════╝
        │                     │                        │
        ▼                     ▼                        ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║                      REACT 19 SPA (Vite Build)                           ║
║  ├── Served as static files via NGINX / Vercel                           ║
║  ├── Communicates with Spring Boot via REST API                          ║
║  ├── Real-time via STOMP WebSocket                                       ║
║  └── OBS Overlays: standalone HTML pages                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                  SPRING BOOT MODULAR MONOLITH                            ║
║                     (Java 21 — Single JAR)                               ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │                    SPRING MVC — REST API LAYER                      │ ║
║  │  @RestController per module │ OpenAPI/Swagger docs auto-generated   │ ║
║  └──────────────────────────────┬──────────────────────────────────────┘ ║
║                                 │                                         ║
║  ┌──────────────────────────────▼──────────────────────────────────────┐ ║
║  │               SPRING SECURITY — SECURITY LAYER                      │ ║
║  │  JWT Filter │ RBAC Authorization │ Method-level @PreAuthorize       │ ║
║  └──────────────────────────────┬──────────────────────────────────────┘ ║
║                                 │                                         ║
║  ┌──────────────────────────────▼──────────────────────────────────────┐ ║
║  │                  SERVICE LAYER (Business Logic)                      │ ║
║  │  @Service beans │ @Transactional │ Spring Events (domain events)    │ ║
║  └──────────────────────────────┬──────────────────────────────────────┘ ║
║                                 │                                         ║
║  ┌──────────────────────────────▼──────────────────────────────────────┐ ║
║  │           SPRING DATA JPA + HIBERNATE — DATA ACCESS LAYER           │ ║
║  │  @Repository │ JPA Entities │ JPQL Queries │ Criteria API          │ ║
║  └──────────────────────────────┬──────────────────────────────────────┘ ║
║                                 │                                         ║
║  ┌──────────────────────────────▼──────────────────────────────────────┐ ║
║  │           SPRING WEBSOCKET + STOMP — REAL-TIME LAYER                │ ║
║  │  STOMP broker │ Topic subscriptions │ Destination-based routing    │ ║
║  └──────────────────────────────┬──────────────────────────────────────┘ ║
╚════════════════════════════════╪══════════════════════════════════════════╝
                                 │
              ┌──────────────────┼──────────────────────┐
              ▼                  ▼                       ▼
     ┌─────────────────┐ ┌─────────────┐      ┌─────────────────┐
     │  MySQL 8 (InnoDB│ │  Redis 7    │      │  Spring         │
     │  Primary DB)    │ │  (Cache +   │      │  Scheduler      │
     │                 │ │  Pub/Sub)   │      │  (Background    │
     │  Flyway Schema  │ │  [Phase 2+] │      │   Jobs)         │
     │  Migrations     │ └─────────────┘      └─────────────────┘
     └────────┬────────┘
              │
     ┌────────▼────────┐
     │  MySQL Read     │
     │  Replica        │
     │  [Phase 2+]     │
     └─────────────────┘
```

---

## 2.2 Service Boundaries & Responsibilities

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SERVICE BOUNDARY MAP                              │
├─────────────────┬───────────────────────────────┬───────────────────────┤
│ Layer           │ Responsibility                 │ Technology            │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ React SPA       │ All user-facing UI, forms,     │ React 19 + Vite +    │
│                 │ dashboards, overlays            │ JavaScript            │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ Spring MVC      │ REST API endpoints, request    │ Spring Boot 3 +      │
│ REST Layer      │ validation, response mapping    │ Spring MVC           │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ Spring Security │ JWT auth, RBAC enforcement,    │ Spring Security 6 +  │
│ Layer           │ method-level authorization      │ JWT (JJWT library)   │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ Service Layer   │ Business logic, transactions,  │ @Service + @Trans-   │
│                 │ domain event publishing         │ actional + Spring    │
│                 │                                 │ Events               │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ Data Access     │ Database CRUD, complex queries, │ Spring Data JPA +   │
│ Layer           │ entity mappings                 │ Hibernate + MySQL    │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ WebSocket Layer │ Real-time event broadcast,     │ Spring WebSocket +   │
│                 │ STOMP topic routing             │ STOMP Protocol       │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ Scheduler Layer │ Cron jobs, credential release, │ Spring Scheduler +  │
│                 │ notifications, analytics        │ @Scheduled           │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ MySQL 8         │ Source-of-truth persistence,   │ MySQL 8 (InnoDB)    │
│ Primary         │ all write operations            │ + Flyway migrations  │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ Redis (Phase 2) │ Leaderboard cache, STOMP       │ Redis 7 + Spring    │
│                 │ multi-instance pub/sub          │ Data Redis           │
├─────────────────┼───────────────────────────────┼───────────────────────┤
│ File Storage    │ User uploads, screenshots,     │ Cloudflare R2 /     │
│                 │ generated graphics              │ AWS S3               │
└─────────────────┴───────────────────────────────┴───────────────────────┘
```

---

## 2.3 Module-to-Package Mapping

```
SPRING BOOT MODULAR MONOLITH — PACKAGE STRUCTURE

com.gameverse.platform
│
├── modules.auth                  (MOD-01: Authentication & User Management)
├── modules.organization          (MOD-02: Organization Management)
├── modules.game                  (MOD-03: Game Configuration)
├── modules.team                  (MOD-04: Team & Player Management)
├── modules.tournament            (MOD-05: Tournament Management)
├── modules.registration          (MOD-06: Registration & Verification)
├── modules.schedule              (MOD-07: Match Scheduling & Slots)
├── modules.credentials           (MOD-08: Secure Room Credentials)
├── modules.matchday              (MOD-09: Match Day Operations)
├── modules.scoring               (MOD-10: Live Scoring & Points Engine)
├── modules.leaderboard           (MOD-11: Leaderboard Engine)
├── modules.broadcast             (MOD-12: Live Streaming & Broadcast)
├── modules.overlay               (MOD-13: OBS Overlay System)
├── modules.notification          (MOD-14: Announcement & Notifications)
├── modules.chat                  (MOD-15: Live Chat & Moderation)
├── modules.payment               (MOD-16: Prize Pool & Payment)
├── modules.analytics             (MOD-17: Analytics & Reporting)
├── modules.branding              (MOD-18: Tournament Branding)
├── modules.sponsor               (MOD-19: Sponsor Management)
├── modules.audit                 (MOD-20: Audit Trail & Disputes)
└── modules.commandcenter         (MOD-21: Esports Command Center)

INTERNAL STRUCTURE PER MODULE:
modules.tournament/
├── controller/
│   └── TournamentController.java         (@RestController)
├── service/
│   └── TournamentService.java            (@Service)
├── repository/
│   └── TournamentRepository.java         (JpaRepository)
├── entity/
│   └── Tournament.java                   (@Entity)
├── dto/
│   ├── request/
│   │   └── CreateTournamentRequest.java  (Bean Validation)
│   └── response/
│       └── TournamentResponse.java
├── mapper/
│   └── TournamentMapper.java             (MapStruct)
├── event/
│   └── TournamentStatusChangedEvent.java (Spring Event)
└── exception/
    └── TournamentNotFoundException.java
```

---

---

# SECTION 3 — FRONTEND ARCHITECTURE (REACT 19)

---

## 3.1 Frontend Overview

```
FRONTEND: React 19 Single Page Application
│
├── Build Tool:      Vite (fast HMR, optimized production builds)
├── Language:        JavaScript (strict mode)
├── Router:          React Router v7
├── Server State:    TanStack Query v5 (REST API data fetching + caching)
├── Forms:           React Hook Form + Zod (validation)
├── Styling:         Tailwind CSS v4
├── Real-Time:       @stomp/stompjs + sockjs-client
├── UI Components:   shadcn/ui (Radix UI primitives + Tailwind)
├── Charts:          Recharts (analytics visualizations)
└── Deployment:      Nginx static serve / Vercel
```

## 3.2 Application Folder Structure

```text
gameverse-frontend/
│
├── public/                           # Static assets served directly
│   ├── overlay/                      # HTML templates for OBS overlays
│   ├── fonts/
│   └── images/
│
├── src/
│   ├── app/                          # Core application setup
│   │   ├── App.jsx
│   │   ├── AppProviders.jsx
│   │   ├── queryClient.js
│   │   └── ErrorBoundary.jsx
│   │
│   ├── portals/                      # The 4 Ecosystem Sides (Page-level routing)
│   │   │
│   │   ├── admin/                    # 1. Organizer Panel
│   │   │   ├── layout/
│   │   │   │   └── AdminLayout.jsx
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── EventsPage.jsx
│   │   │   │   └── EventDetailsPage.jsx
│   │   │   ├── components/
│   │   │   └── routes/
│   │   │
│   │   ├── player/                   # 2. Player/Team Portal
│   │   │   ├── layout/
│   │   │   │   └── PlayerLayout.jsx
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── MyTeamPage.jsx
│   │   │   │   └── MyTournamentsPage.jsx
│   │   │   ├── components/
│   │   │   └── routes/
│   │   │
│   │   ├── public/                   # 3. Public Website
│   │   │   ├── layout/
│   │   │   │   └── PublicLayout.jsx
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── EventsPage.jsx
│   │   │   │   ├── LivePage.jsx
│   │   │   │   └── LeaderboardPage.jsx
│   │   │   ├── components/
│   │   │   └── routes/
│   │   │
│   │   └── production/               # 4. Stream Control Panel
│   │       ├── layout/
│   │       │   └── ProductionLayout.jsx
│   │       ├── pages/
│   │       │   ├── DashboardPage.jsx
│   │       │   ├── LiveControlPage.jsx
│   │       │   └── OverlayControlPage.jsx
│   │       ├── components/
│   │       └── routes/
│   │
│   ├── features/                     # Feature-based business logic (State, API, Components)
│   │   ├── auth/
│   │   ├── organizations/
│   │   ├── tournaments/
│   │   ├── registrations/
│   │   ├── teams/
│   │   ├── players/
│   │   ├── check-in/
│   │   ├── matches/
│   │   ├── scoring/
│   │   ├── leaderboard/
│   │   ├── results/
│   │   ├── live-operations/
│   │   ├── broadcast/
│   │   └── notifications/
│   │
│   ├── components/                   # Global, shared UI components
│   │   ├── ui/                       # Base design system (buttons, inputs)
│   │   ├── common/                   # Shared business components (e.g. UserAvatar)
│   │   ├── feedback/                 # Toast, Modal, Alerts
│   │   └── navigation/               # Shared Nav bars, Sidebars
│   │
│   ├── layouts/                      # Global layouts
│   ├── routes/                       # Global route configurations & guards
│   ├── hooks/                        # Global custom hooks (e.g., useWindowSize)
│   ├── store/                        # Global state (Zustand)
│   ├── services/                     # Third-party services (Axios base, WebSockets)
│   ├── config/                       # Environment configs
│   ├── constants/                    # Enums, static lists
│   ├── lib/                          # Utility wrappers (clsx, twMerge)
│   ├── styles/                       # Global CSS, Tailwind base
│   ├── utils/                        # Pure helper functions
│   │
│   └── main.jsx                      # Vite Entry Point
│
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 3.3 State Management Architecture

```
STATE ARCHITECTURE (React 19 + TanStack Query + Zustand):

┌─────────────────────────────────────────────────────────────┐
│                 SERVER STATE (TanStack Query)                │
│                                                              │
│  useQuery('tournaments', fetchTournaments)                   │
│  → Fetches from Spring Boot REST API                        │
│  → Cached in TanStack Query cache                           │
│  → Auto-refetch on window focus, stale time configured      │
│  → Invalidated on mutations (useMutation)                   │
│                                                              │
│  Key queries:                                               │
│  ├── Tournament list (stale: 30s)                           │
│  ├── Registration list (stale: 10s)                         │
│  ├── Match schedule (stale: 60s)                            │
│  └── Analytics (stale: 5min)                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               REAL-TIME STATE (Zustand + STOMP)             │
│                                                              │
│  stompStore:                                                │
│  ├── connection: StompClient                                │
│  ├── status: 'connecting' | 'connected' | 'disconnected'   │
│  ├── leaderboard: LeaderboardEntry[]   ← STOMP topic       │
│  ├── matchStatuses: Record<id, status> ← STOMP topic       │
│  ├── checkinGrid: CheckinStatus[]      ← STOMP topic       │
│  ├── pendingActions: PendingAction[]   ← STOMP topic       │
│  └── streamHealth: StreamMetrics       ← STOMP topic       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   AUTH STATE (Zustand)                      │
│                                                              │
│  authStore:                                                 │
│  ├── user: UserProfile | null                               │
│  ├── accessToken: string | null  (in-memory only)           │
│  ├── orgRoles: OrgRole[]                                    │
│  └── tournamentRoles: TournamentRole[]                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  UI STATE (React Local)                     │
│                                                              │
│  useState / useReducer per component:                       │
│  ├── Modal open/closed                                      │
│  ├── Active tab selection                                   │
│  ├── Filter values                                          │
│  └── Form step progress (wizard)                            │
└─────────────────────────────────────────────────────────────┘
```

## 3.4 API Integration Pattern

```
REACT → SPRING BOOT API COMMUNICATION:

1. Axios Client Configuration:
   ├── Base URL: https://api.gameverse.gg/api/v1
   ├── Request interceptor: Attach Authorization: Bearer {token}
   ├── Response interceptor: Handle 401 → auto-refresh token
   └── Retry logic: 3 retries on network errors

2. TanStack Query Integration:
   ├── All GET requests via useQuery
   ├── All mutations (POST/PATCH/DELETE) via useMutation
   ├── On mutation success: queryClient.invalidateQueries([key])
   └── Global error boundary: Sentry capture + toast notification

3. Form Submission Flow:
   React Hook Form → Zod validation → useMutation → 
   Axios POST → Spring Boot → DB → Response →
   TanStack Query invalidation → UI re-renders
```

## 3.5 Rendering Strategy

| Page Type | Strategy | Reason |
|-----------|----------|--------|
| Landing, About | Static HTML (served by Nginx) | Maximum performance; no dynamic content |
| Tournament Directory | React + TanStack Query (client fetch on load) | SEO handled via SSR proxy or meta tags |
| Public Tournament Page | React + TanStack Query | Real-time via STOMP after hydration |
| Dashboard pages | React (client-rendered) | Auth-protected; personalized |
| Command Center | React (client-rendered, full CSR) | Maximum interactivity; not SEO-critical |
| OBS Overlay pages | Standalone HTML + Vanilla JS + STOMP | No framework overhead; pure transparent HTML |
| Admin Panel | React (client-rendered) | Internal tool; not SEO-critical |

---

---

# SECTION 4 — BACKEND ARCHITECTURE (SPRING BOOT)

---

## 4.1 Spring Boot Application Overview

```
SPRING BOOT MODULAR MONOLITH SPECIFICATION:

Runtime:          Java 21 (LTS) — Virtual Threads (Project Loom) enabled
Framework:        Spring Boot 3.3.x
Server:           Embedded Tomcat (default) → can swap to Undertow for WS
API Style:        RESTful JSON API via Spring MVC
ORM:              Spring Data JPA + Hibernate 6
Schema Migration: Flyway
Validation:       Bean Validation (Jakarta Validation 3) + Hibernate Validator
Security:         Spring Security 6 (JWT stateless)
Real-Time:        Spring WebSocket + STOMP Protocol
API Docs:         SpringDoc OpenAPI 3 (Swagger UI auto-generated)
Serialization:    Jackson (JSON)
Mapping:          MapStruct (Entity ↔ DTO)
Testing:          JUnit 5 + Mockito + Spring Boot Test + Testcontainers
```

## 4.2 Spring Application Layer Architecture

```
HTTP REQUEST → SPRING MVC PIPELINE:

┌─────────────────────────────────────────────────────────────┐
│                    TOMCAT HTTP SERVER                        │
│                  (Embedded in Spring Boot)                   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                   SPRING SECURITY FILTER CHAIN              │
│                                                              │
│  Filter 1: CorsFilter                                       │
│    → Allow React origin (http://localhost:5173, prod URL)   │
│                                                              │
│  Filter 2: JwtAuthenticationFilter (custom)                 │
│    → Extract Bearer token from Authorization header         │
│    → Validate JWT signature (RS256 public key)              │
│    → Check token expiry                                     │
│    → Load UserDetails from token claims                     │
│    → Set SecurityContextHolder                              │
│                                                              │
│  Filter 3: RateLimitFilter (custom)                         │
│    → Check per-user/per-IP rate limits (in-memory or Redis) │
│                                                              │
│  Filter 4: RequestLoggingFilter                             │
│    → Log method, URI, user, duration                        │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  SPRING MVC DISPATCHER SERVLET              │
│                                                              │
│  → Routes to appropriate @RestController                    │
│  → @PreAuthorize RBAC check (method-level security)         │
│  → @Valid Bean Validation on @RequestBody                   │
│  → @PathVariable, @RequestParam extraction                  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    @RestController LAYER                     │
│                                                              │
│  Responsibilities:                                          │
│  ├── Accept HTTP request                                    │
│  ├── Delegate to @Service (no business logic in controller) │
│  ├── Map response to DTO                                    │
│  └── Return ResponseEntity<ApiResponse<T>>                  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    @Service LAYER                            │
│                                                              │
│  Responsibilities:                                          │
│  ├── All business logic                                     │
│  ├── @Transactional boundary management                     │
│  ├── Repository calls                                       │
│  ├── Cross-module service calls                             │
│  ├── Publish Spring ApplicationEvents                       │
│  └── External API calls (Razorpay, SMS, FCM)               │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│               SPRING DATA JPA @Repository LAYER             │
│                                                              │
│  ├── JpaRepository<Entity, UUID> (standard CRUD)           │
│  ├── @Query("JPQL") for custom queries                     │
│  ├── Specification API for dynamic filters                  │
│  └── MySQL 8 via HikariCP connection pool                   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  SPRING APPLICATION EVENTS                   │
│     (Domain Events published AFTER transaction commits)     │
│                                                              │
│  TournamentStatusChangedEvent                               │
│      ├── → AuditEventListener.logAction()                  │
│      ├── → NotificationEventListener.dispatchNotif()       │
│      └── → WebSocketEventListener.broadcast()              │
│                                                              │
│  MatchResultPublishedEvent                                  │
│      ├── → LeaderboardEventListener.recalculate()          │
│      ├── → AuditEventListener.logAction()                  │
│      └── → WebSocketEventListener.broadcast()              │
│                                                              │
│  CredentialReleasedEvent                                    │
│      ├── → NotificationEventListener.dispatch()            │
│      └── → AuditEventListener.logAction()                  │
└─────────────────────────────────────────────────────────────┘
```

## 4.3 Standard API Response Format

```
ALL API RESPONSES FOLLOW THIS ENVELOPE:

Success Response (200/201):
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-06-15T10:30:00Z",
  "requestId": "req-uuid-abc123"
}

Error Response (4xx/5xx):
{
  "success": false,
  "error": {
    "code": "TOURNAMENT_NOT_FOUND",
    "message": "Tournament with ID xyz does not exist",
    "details": [],
    "documentation": "https://docs.gameverse.gg/errors/TOURNAMENT_NOT_FOUND"
  },
  "timestamp": "2025-06-15T10:30:00Z",
  "requestId": "req-uuid-abc123"
}

Validation Error Response (400):
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": [
      { "field": "entry_fee", "message": "must be greater than or equal to 0" },
      { "field": "start_date", "message": "must be in the future" }
    ]
  }
}

IMPLEMENTATION: GlobalExceptionHandler (@RestControllerAdvice)
├── MethodArgumentNotValidException → 400 with field errors
├── AccessDeniedException → 403
├── EntityNotFoundException → 404
├── InvalidStateTransitionException → 409
├── BusinessRuleException → 422
└── Exception (catch-all) → 500 with Sentry capture
```

## 4.4 Spring Security RBAC Architecture

```
ROLE-BASED ACCESS CONTROL IMPLEMENTATION:

SECURITY LAYERS (both must pass):

Layer 1: URL-level Security (SecurityFilterChain)
├── Permit all: GET /api/v1/tournaments/**, GET /api/v1/games/**
├── Permit all: POST /api/v1/auth/**
├── Authenticated: All other /api/v1/** endpoints
└── WebSocket: /ws/** (authenticated via handshake JWT)

Layer 2: Method-level Security (@PreAuthorize)
├── @PreAuthorize("hasRole('SUPER_ADMIN')")
├── @PreAuthorize("@tournamentAuthz.isDirector(#tournamentId, authentication)")
├── @PreAuthorize("@teamAuthz.isCaptain(#teamId, authentication)")
└── Custom Spring Security Beans for complex role checks

AUTHORIZATION FLOW:
HTTP Request arrives
        ↓
JwtAuthenticationFilter extracts JWT
        ↓
JWT Claims loaded:
{
  "sub": "user-uuid",
  "platformRole": "USER",       // or SUPER_ADMIN
  "orgRoles": [
    { "orgId": "uuid", "role": "ORG_OWNER" },
    { "orgId": "uuid2", "role": "REFEREE" }
  ],
  "exp": 1718123400
}
        ↓
GameVerseUserDetails created (implements UserDetails)
└── Granted authorities built from JWT claims:
    ├── ROLE_USER
    ├── ORG_OWNER:org-uuid-123
    ├── REFEREE:org-uuid-456
    └── TOURNAMENT_DIRECTOR:tournament-uuid-789
        ↓
@RestController method called
        ↓
@PreAuthorize evaluated:
@PreAuthorize("@tournamentAuthz.canSubmitResults(#matchId, authentication)")
        ↓
TournamentAuthorizationService.canSubmitResults():
├── Get match → get tournament → get org
├── Check if user is REFEREE assigned to this match
├── OR check if user is TOURNAMENT_DIRECTOR of this tournament
├── OR check if user is ORG_OWNER of parent org
└── Return true/false
```

## 4.5 OpenAPI / Swagger Configuration

```
SPRINGDOC OPENAPI 3 SETUP:

Auto-generated from annotations:
├── @Operation(summary = "Submit match results")
├── @Parameter(description = "Tournament ID")
├── @ApiResponse(responseCode = "201", description = "Results submitted")
├── @SecurityRequirement(name = "Bearer Authentication")
└── @Tag(name = "Match Operations")

Swagger UI accessible at:
├── Dev: http://localhost:8080/swagger-ui.html
└── Prod: https://api.gameverse.gg/swagger-ui.html (auth-protected)

OpenAPI JSON spec at:
└── https://api.gameverse.gg/v3/api-docs

Benefits:
├── React frontend team uses spec to generate JavaScript API types
├── Postman collections auto-imported from spec
└── Contract-first API design enforced
```

---

---

# SECTION 5 — REAL-TIME INFRASTRUCTURE (SPRING WEBSOCKET + STOMP)

---

## 5.1 STOMP Protocol Architecture

```
WHY STOMP OVER RAW WEBSOCKET:
├── Built-in publish/subscribe semantics (topic-based)
├── Native Spring Boot integration (@MessageMapping, @SendTo)
├── Client library support: @stomp/stompjs (React)
├── Message acknowledgment support
└── Headers for auth token passing

SPRING WEBSOCKET + STOMP CONFIGURATION:

WebSocket Endpoint:    /ws  (SockJS fallback for OBS/restricted networks)
Message Broker:        Simple in-memory broker (Phase 1)
                       → Redis-backed broker (Phase 2: STOMP relay)

STOMP Destinations (Server → Client broadcasts):
├── /topic/tournament.{id}.leaderboard       Public leaderboard updates
├── /topic/tournament.{id}.matches           Match status changes
├── /topic/tournament.{id}.checkins          Check-in grid updates
├── /topic/tournament.{id}.announcements     Organizer announcements
├── /topic/tournament.{id}.stream            Stream health metrics
├── /topic/tournament.{id}.command-center    CC pending actions (staff)
├── /topic/tournament.{id}.disputes          Dispute alerts (staff)
│
├── /user/{userId}/queue/notifications       Personal notifications (queue)
├── /user/{userId}/queue/credentials         Match credentials (private)
└── /user/{userId}/queue/team                Team-specific updates

STOMP Destinations (Client → Server):
├── /app/tournament.{id}.subscribe           Client subscribes to tournament
├── /app/chat.{id}.send                      Chat message sent
└── /app/overlay.{id}.ping                   Overlay health ping
```

## 5.2 WebSocket Authentication Flow

```
STOMP HANDSHAKE AUTHENTICATION:

React Client:
const client = new Client({
  brokerURL: 'wss://api.gameverse.gg/ws',
  connectHeaders: {
    Authorization: 'Bearer {accessToken}'    ← JWT in STOMP header
  },
  reconnectDelay: 5000
});

Spring Boot (WebSocket Interceptor):
ChannelInterceptor.preSend():
├── Extract Authorization header from CONNECT frame
├── Validate JWT (same JwtAuthenticationFilter logic)
├── Reject connection if token invalid → StompException
└── Attach user principal to WebSocket session

After CONNECT:
├── Server sends: CONNECTED frame
├── Client subscribes to desired topics
├── Server validates subscription permissions:
│   └── /user/{userId}/queue/* — only own userId allowed
│   └── /topic/tournament.{id}.command-center — staff only
└── Subscriptions confirmed or rejected

CREDENTIAL DELIVERY (private queue):
POST /api/v1/credentials/release
        ↓
Spring Service releases credentials
        ↓
SimpMessagingTemplate.convertAndSendToUser(
    userId,
    "/queue/credentials",
    credentialPayload   ← encrypted until this point, decrypted for delivery
)
        ↓
STOMP frame delivered ONLY to target user's WebSocket session
```

## 5.3 Multi-Instance WebSocket Scaling (Phase 2)

```
PHASE 1 (Single Instance — MVP):
┌────────────────────────────────────────────────────┐
│           Spring Boot Instance                      │
│   In-memory STOMP broker                           │
│   All WebSocket sessions on same JVM               │
│   Simple broker relay: /topic/**, /queue/**        │
└────────────────────────────────────────────────────┘

PHASE 2 (Multi-Instance — Scale):
┌──────────────────┐   ┌──────────────────┐
│ Spring Boot #1   │   │ Spring Boot #2   │
│ WS sessions: 400 │   │ WS sessions: 400 │
└────────┬─────────┘   └────────┬─────────┘
         │                       │
         └──────────┬────────────┘
                    │
         ┌──────────▼──────────┐
         │   STOMP Message     │
         │   Broker Relay      │
         │   (RabbitMQ with    │
         │    STOMP plugin)    │
         └─────────────────────┘

API Server publishes event →
Spring publishes to RabbitMQ STOMP exchange →
RabbitMQ routes to all Spring instances →
Each instance delivers to its connected WebSocket sessions →
All clients receive update regardless of which instance they're on
```

## 5.4 Real-Time Event Flow (End-to-End)

```
LEADERBOARD UPDATE — COMPLETE FLOW:

Referee submits match result:
POST /api/v1/tournaments/{id}/matches/{id}/results
        ↓
MatchResultController.submitResults()
        ↓
MatchResultService.submitResults() [@Transactional]
├── Validate match state (must be IN_PROGRESS)
├── Save MatchResult entity to MySQL
├── Save TeamMatchResult entities (16 rows)
├── Trigger points calculation (ScoringEngine.calculate())
└── Publish MatchResultPublishedEvent (after commit)
        ↓
[Transaction commits to MySQL]
        ↓
LeaderboardEventListener.onMatchResultPublished()
├── LeaderboardEngine.recalculate(tournamentId)
│   ├── SELECT all published results for tournament
│   ├── Sum points, kills, CDs per team
│   ├── Apply tiebreaker sort
│   └── Assign rank numbers
├── Save LeaderboardEntry updates to MySQL
└── Publish WebSocket event
        ↓
WebSocketEventListener.broadcastLeaderboard()
SimpMessagingTemplate.convertAndSend(
    "/topic/tournament.{id}.leaderboard",
    leaderboardPayload
)
        ↓
ALL subscribed clients receive STOMP MESSAGE frame:
├── Tournament public page leaderboard table → animates
├── Player dashboards → standing updates
├── Command Center leaderboard tab → updates
├── OBS Overlay browser sources → overlay animates
└── Sponsor dashboard → batch update (not real-time)
        ↓
Target: < 3 seconds from result submission to visible leaderboard update
```

---

---

# SECTION 6 — DATABASE ARCHITECTURE (MYSQL + JPA/HIBERNATE)

---

## 6.1 MySQL Architecture Overview

```
DATABASE STACK:

Primary Database:
├── MySQL 8.0 (InnoDB storage engine exclusively)
├── Hosted: AWS RDS db.t4g.medium (MVP) → db.r6g.large (scale)
├── Character set: utf8mb4 (full Unicode + emoji support)
├── Collation: utf8mb4_unicode_ci
├── Timezone: UTC (all timestamps stored in UTC)
└── SSL: Required for all connections

Connection Pooling:
└── HikariCP (Spring Boot default, best-in-class)
    ├── Maximum pool size: 20 (per instance)
    ├── Minimum idle: 5
    ├── Connection timeout: 30s
    └── Idle timeout: 600s

Schema Migration:
└── Flyway (versioned migration scripts)
    ├── V1__create_users_table.sql
    ├── V2__create_organizations_table.sql
    ├── V3__create_tournaments_table.sql
    └── ... (one file per schema change)

Read Scaling (Phase 2):
└── MySQL Read Replica (async replication)
    ├── @Transactional(readOnly = true) → routed to replica
    └── Spring Data JPA routing DataSource configuration
```

## 6.2 JPA Entity Design Principles

```
HIBERNATE + JPA CONFIGURATION:

Entity Conventions:
├── All primary keys: UUID (generated by application, not DB)
│   @GeneratedValue(strategy = GenerationType.UUID)
├── All timestamps: OffsetDateTime (UTC)
├── Soft deletes: is_deleted + deleted_at columns (no hard DELETEs)
├── Optimistic locking: @Version on concurrency-sensitive entities
│   (e.g., Tournament, MatchResult, LeaderboardEntry)
├── Audit fields: created_at, updated_at (@EntityListeners)
└── JSON columns: @Column(columnDefinition = "JSON") for JSONB-like storage

Relationship Strategies:
├── @OneToMany: LAZY loading by default (prevent N+1 queries)
├── @ManyToOne: EAGER loading only for frequently needed refs
├── @ManyToMany: Resolved via join @Entity (not @JoinTable)
└── N+1 prevention: @EntityGraph or JOIN FETCH for specific queries

Transaction Management:
├── @Transactional on @Service methods (not controllers)
├── Read-only transactions: @Transactional(readOnly = true) for queries
├── Propagation: REQUIRED (default) — joins existing or creates new
├── Isolation: READ_COMMITTED (default MySQL)
└── Rollback: Automatic on RuntimeException
```

## 6.3 Flyway Migration Strategy

```
SCHEMA VERSIONING WITH FLYWAY:

Migration file naming:
├── V{version}__{description}.sql
├── Example: V20250601_001__create_users_table.sql
└── Repeatable: R__seed_games_catalog.sql

Execution:
├── Runs automatically on Spring Boot startup
├── Checksum validation (won't run modified migrations)
├── Failed migrations: Manual repair required
└── Baseline: Existing database can be baselined for Flyway adoption

Migration in CI/CD:
├── Staging: Auto-apply migrations before deployment
├── Production: Auto-apply migrations as part of deployment pipeline
└── Rollback: Must write compensating migration (no auto-rollback)

Example Migration File (V1__create_users.sql):
├── CREATE TABLE users (...)
├── CREATE INDEX idx_users_username ON users(username)
└── CREATE INDEX idx_users_mobile ON users(mobile_number)
```

## 6.4 Critical Query Patterns

```
PERFORMANCE-CRITICAL QUERIES:

1. Leaderboard Calculation (runs after every match result):
   SELECT te.registration_id,
          te.team_id,
          SUM(tmr.total_points) as total_points,
          SUM(tmr.raw_kills) as total_kills,
          SUM(CASE WHEN tmr.is_chicken_dinner THEN 1 ELSE 0 END) as cds,
          COUNT(tmr.id) as matches_played
   FROM team_match_results tmr
   JOIN match_results mr ON tmr.result_id = mr.id
   JOIN matches m ON mr.match_id = m.id
   WHERE m.tournament_id = :tournamentId
   AND mr.submission_status = 'PUBLISHED'
   GROUP BY te.registration_id, te.team_id
   ORDER BY total_points DESC, cds DESC, total_kills DESC;

   Optimization:
   ├── Composite index: (tournament_id, submission_status) on matches
   ├── Composite index: (result_id, registration_id) on team_match_results
   └── Query cached in Redis for 60s after calculation

2. Registration UID Duplicate Check:
   SELECT COUNT(*) FROM registration_rosters rr
   JOIN tournament_registrations tr ON rr.registration_id = tr.id
   WHERE tr.tournament_id = :tournamentId
   AND rr.in_game_uid = :uid
   AND tr.status NOT IN ('REJECTED', 'WITHDRAWN');

   Optimization:
   └── Composite unique index: (tournament_id, in_game_uid) via JOIN

3. Command Center Pending Actions:
   SELECT
     (SELECT COUNT(*) FROM disputes WHERE tournament_id = :tid AND status = 'OPEN') AS open_disputes,
     (SELECT COUNT(*) FROM match_results WHERE match_id IN (...) AND status = 'PENDING_VERIFICATION') AS pending_results,
     (SELECT COUNT(*) FROM tournament_registrations WHERE tournament_id = :tid AND checked_in = false AND status = 'APPROVED') AS not_checked_in
   -- Cached in application memory, refreshed every 10s via WebSocket
```

## 6.5 MySQL-Specific Optimizations

```
MYSQL 8 CONFIGURATION:

InnoDB Settings:
├── innodb_buffer_pool_size: 75% of available RAM
├── innodb_log_file_size: 1GB (high write throughput during tournaments)
├── innodb_flush_log_at_trx_commit: 1 (full ACID compliance)
└── innodb_io_capacity: 2000 (SSD-optimized)

Query Cache: DISABLED (MySQL 8 default, correct for OLTP)

Binary Logging: ENABLED
├── binlog_format: ROW (for point-in-time recovery)
└── expire_logs_days: 7

Slow Query Log: ENABLED
├── long_query_time: 1 second
└── log_queries_not_using_indexes: ON

Character Set:
└── character_set_server: utf8mb4
    collation_server: utf8mb4_unicode_ci
```

---

---

# SECTION 7 — FILE STORAGE & CDN

---

## 7.1 Storage Architecture

```
FILE UPLOAD FLOW (Spring Boot):

React Client → Presigned URL Request → Spring Boot API
                                               │
                               ┌───────────────▼──────────────┐
                               │  File Validation Service      │
                               │  ├── Extension whitelist      │
                               │  │   (jpg, png, webp, pdf)   │
                               │  ├── MIME type verification   │
                               │  ├── Max size enforcement     │
                               │  │   (avatar: 2MB, banner:   │
                               │  │    5MB, screenshot: 10MB) │
                               │  └── Magic bytes check        │
                               └───────────────┬──────────────┘
                                               │
                               ┌───────────────▼──────────────┐
                               │  Cloudflare R2 / AWS S3      │
                               │  (Pre-signed URL generated)  │
                               └───────────────┬──────────────┘
                                               │
                               ┌───────────────▼──────────────┐
                               │  Client uploads directly     │
                               │  to R2 using presigned URL   │
                               │  (No file data passes through│
                               │   Spring Boot server)        │
                               └───────────────┬──────────────┘
                                               │
                               ┌───────────────▼──────────────┐
                               │  Image Processing (Phase 2)  │
                               │  R2 trigger → Lambda/worker  │
                               │  → Resize + WebP convert    │
                               └───────────────┬──────────────┘
                                               │
                               ┌───────────────▼──────────────┐
                               │  Cloudflare CDN              │
                               │  Indian PoPs: Mumbai, Delhi  │
                               └──────────────────────────────┘
```

## 7.2 Storage Bucket Organization

| Bucket | Contents | Access | CDN Cached | Retention |
|--------|----------|--------|-----------|-----------|
| `gv-user-uploads` | Avatars, logos, banners | Public read | ✅ Yes | Indefinite |
| `gv-evidence` | Result screenshots, dispute evidence | Private (signed URL) | ❌ No | 2 years |
| `gv-generated` | Auto-generated result graphics | Public read | ✅ Yes | 90 days |
| `gv-documents` | Rulebooks (PDF) | Private (signed URL) | ❌ No | 7 years |
| `gv-overlays` | Overlay theme assets, fonts | Public read | ✅ Yes | Indefinite |

---

---

# SECTION 8 — AUTHENTICATION & SECURITY ARCHITECTURE

---

## 8.1 JWT Authentication Architecture

```
TOKEN DESIGN:

Access Token (JWT — RS256 signed):
├── Algorithm: RS256 (asymmetric — private key signs, public key verifies)
├── Expiry: 15 minutes
├── Storage: JavaScript memory ONLY (never localStorage/sessionStorage)
├── Library: JJWT (Java JWT library)
└── Claims:
    {
      "sub": "user-uuid",
      "username": "ArjunOP",
      "platformRole": "USER",
      "orgRoles": [
        { "orgId": "uuid", "role": "ORG_OWNER" }
      ],
      "iat": 1718120400,
      "exp": 1718121300
    }

Refresh Token (Opaque):
├── Format: Cryptographically random UUID (256-bit entropy)
├── Stored: HTTP-only, Secure, SameSite=Strict cookie
├── Expiry: 30 days (sliding)
├── DB record: SHA-256 hash stored in user_sessions table
└── Revocation: Delete DB record (immediate effect)

KEY MANAGEMENT:
├── RS256 Private Key: AWS Secrets Manager (rotated every 90 days)
├── RS256 Public Key: Loaded at startup, cached in Spring Security config
└── Key rotation: Zero-downtime (overlap period — both keys valid for 1 hour)
```

## 8.2 Spring Security Filter Chain

```
SECURITY FILTER CHAIN CONFIGURATION:

1. CORS Filter:
   ├── Allowed origins: https://gameverse.gg, https://www.gameverse.gg
   ├── Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
   ├── Allowed headers: Authorization, Content-Type, X-Request-ID
   └── Allow credentials: true (for refresh token cookie)

2. CSRF: DISABLED (stateless JWT API — no session cookies for API calls)

3. Session Management: STATELESS
   └── No HttpSession created (SecurityContextHolder cleared per request)

4. JwtAuthenticationFilter (OncePerRequestFilter):
   ├── Skip if: public endpoints (auth, public tournament pages)
   ├── Extract: Authorization: Bearer {token}
   ├── Validate: Signature, expiry, not-before
   ├── On valid: Set SecurityContextHolder with GameVerseAuthentication
   └── On invalid: Return 401 immediately

5. ExceptionTranslationFilter:
   ├── AuthenticationException → 401 JSON response
   └── AccessDeniedException → 403 JSON response

6. AuthorizationFilter:
   └── URL-level rules enforced here

URL SECURITY RULES:
├── permitAll: /api/v1/auth/**, /api/v1/games (GET), /api/v1/tournaments (GET public)
├── permitAll: /ws/** (WebSocket - auth handled in handshake interceptor)
├── permitAll: /overlay/** (token-validated separately)
├── permitAll: /actuator/health (load balancer check)
├── hasRole(SUPER_ADMIN): /api/v1/admin/**
├── authenticated: /api/v1/** (all other endpoints)
└── permitAll: /swagger-ui/** (disable in production)
```

## 8.3 Field-Level Encryption

```
ENCRYPTED FIELDS IN MYSQL:

Fields requiring AES-256 encryption at application layer:
├── room_credentials.room_id_encrypted (BINARY(256))
├── room_credentials.password_encrypted (BINARY(256))
├── payout_details.upi_id_encrypted (BINARY(256))
├── payout_details.account_number_encrypted (BINARY(256))
└── stream_configs.stream_key_encrypted (BINARY(256))

Encryption Implementation:
├── Algorithm: AES-256-GCM (authenticated encryption — detects tampering)
├── Key source: AWS Secrets Manager (not in application config)
├── IV: Random 96-bit per encryption (stored alongside ciphertext)
├── Spring @Converter: AttributeConverter<String, byte[]>
│   └── Auto-encrypts on persist, decrypts on read
└── Key rotation: Re-encrypt all records when key rotated (batch job)

Password Hashing:
├── Algorithm: BCrypt (cost factor: 12)
└── Spring Security: BCryptPasswordEncoder
```

## 8.4 Security Headers Configuration (Spring Boot)

```
HTTP SECURITY HEADERS (via Spring Security):

Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://checkout.razorpay.com;
  connect-src 'self' wss://api.gameverse.gg https://api.razorpay.com;
  frame-src https://checkout.razorpay.com;

X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

---

# SECTION 9 — PAYMENT INFRASTRUCTURE

---

## 9.1 Razorpay Integration Architecture

```
ENTRY FEE PAYMENT FLOW (Spring Boot):

Step 1: Create Razorpay Order
POST /api/v1/tournaments/{id}/registrations/payment-order
        ↓
PaymentService.createOrder():
├── Calculate: entry_fee + platform_fee (5%)
├── Call Razorpay Orders API (Razorpay Java SDK)
├── Store: payment_transactions record (status: PENDING)
├── Reserve slot: in-memory/Redis countdown (15 minutes)
└── Return: { orderId, amount, razorpayKeyId, slotExpiresAt }

Step 2: Frontend Payment
React → Razorpay Checkout SDK (JavaScript)
├── Modal opens with UPI/Card/Net Banking options
├── User completes payment
└── SDK returns: { paymentId, orderId, signature }

Step 3A: Webhook Confirmation (Primary — Server-to-Server)
Razorpay → POST https://api.gameverse.gg/api/v1/webhooks/razorpay
├── Spring validates HMAC-SHA256 signature
│   (Razorpay-Signature header vs computed hash)
├── Event: payment.captured
├── PaymentService.confirmPayment():
│   ├── Update payment_transactions.status = CAPTURED
│   ├── Update registration.payment_status = PAID
│   ├── Publish RegistrationPaymentConfirmedEvent
│   └── Notify team captain (NOTIF-02)
└── Release slot reservation

Step 3B: Client Verification (Backup — if webhook delayed)
POST /api/v1/payments/verify
├── Verify Razorpay signature server-side (Java SDK)
├── Idempotent: If webhook already processed, return success
└── Same confirmation flow as Step 3A

Step 4: Reconciliation (Safety Net)
@Scheduled(fixedDelay = 15 minutes):
├── Find PENDING payments older than 10 minutes
├── Query Razorpay API for order status
├── Confirm or release slots based on API response
└── Alert if discrepancy found
```

## 9.2 Prize Payout Architecture

```
PRIZE PAYOUT FLOW:

Trigger: Tournament COMPLETED → PrizePayoutService.initializePayouts()
├── Create PrizePayout records (status: PENDING) for each winner
└── Send payout notification to winning captains

Winner submits details:
PATCH /api/v1/tournaments/{id}/prize-distribution/{payoutId}/submit-details
├── Captain submits UPI ID
├── UPI validation: Razorpay VPA Validation API
├── Store encrypted UPI ID in payout_details
└── Status: DETAILS_SUBMITTED

Director initiates payouts:
POST /api/v1/tournaments/{id}/prize-distribution/initiate
├── Razorpay Payouts API (X-type: payout, fund_account)
│   ├── Create Fund Account for winner (if not exists)
│   ├── Create Payout (amount, mode: UPI)
│   └── Payout ID stored in prize_payouts.gateway_payout_id
├── Status: PROCESSING
└── Webhook: payout.processed → Status: COMPLETED + notify winner

TDS Handling:
├── Prize > ₹10,000: TDS 30% deducted at source
├── Deduction computed in PrizePayout.tds_amount
└── Form 16A generation: Quarterly (manual process at MVP)
```

---

---

# SECTION 10 — NOTIFICATION INFRASTRUCTURE

---

## 10.1 Notification Pipeline (Spring Boot)

```
NOTIFICATION DISPATCH PIPELINE:

Trigger: Domain event published (e.g., MatchResultPublishedEvent)
        ↓
NotificationEventListener.onMatchResultPublished()
├── Resolve recipients: All players in this match (query DB)
├── Apply user notification preferences (check preferences table)
├── Create Notification entities in DB (status: PENDING)
└── For each recipient + channel: Add to dispatch queue

MVP Dispatch (synchronous async via @Async):
├── Spring @Async thread pool processes notification tasks
├── IN-APP: SimpMessagingTemplate → STOMP /user/{id}/queue/notifications
├── PUSH: Firebase Admin SDK → FCM (Android/Chrome) + APNs (iOS/Safari)
├── SMS: MSG91 Java SDK → DLT-registered template
└── EMAIL: SendGrid Java SDK → HTML template

PHASE 2 Dispatch (RabbitMQ):
├── Publisher: NotificationService publishes to RabbitMQ exchange
├── Routing keys: notification.inapp, notification.push, notification.sms
└── Consumers: Separate worker instances per channel type

NOTIFICATION PRIORITY LEVELS:
├── CRITICAL: Room credentials released → All channels simultaneously
├── HIGH: Match starting in 15min → Push + SMS
├── MEDIUM: Registration approved → Push + In-app
└── LOW: Analytics ready → In-app only
```

## 10.2 SMS DLT Compliance

```
INDIA TRAI DLT REQUIREMENTS:

Entity Registration: GameVerse Technologies Pvt Ltd (on DLT portal)
Sender ID: GVRSE (6-character, TRAI-approved)
Gateway: MSG91 (DLT-compliant, built-in template management)

All SMS templates pre-registered with variable placeholders:
├── Template: "Your team {#var#} is approved for {#var#}. Ref: {#var#}. -GVRSE"
├── Template: "Room credentials ready for Match {#var#}. Open app now. -GVRSE"
├── Template: "{#var#} starts in 15 mins. Your slot: {#var#}. -GVRSE"
└── [All 27 notification types registered]

Fallback: Twilio (if MSG91 fails)
└── Twilio India routes through approved DLT sender IDs
```

---

---

# SECTION 11 — OBS OVERLAY INFRASTRUCTURE

---

## 11.1 Overlay Architecture (Spring Boot + STOMP)

```
OBS STUDIO BROWSER SOURCE FLOW:

OBS → Browser Source URL:
https://gameverse.gg/overlay/{tournamentId}/{type}?token={overlayToken}
        ↓
NGINX serves static HTML page (cached 5 minutes)
        ↓
Browser Source loads HTML:
├── Minimal CSS (transparent background)
├── SockJS + STOMP JavaScript client
├── Overlay-type-specific rendering JS
└── Embedded initial data (reduces first-render flash)
        ↓
JavaScript connects to STOMP:
wss://api.gameverse.gg/ws
STOMP CONNECT headers: { overlayToken: "..." }
        ↓
Spring ChannelInterceptor validates overlay token:
├── Token lookup in overlay_configs table
├── Extract tournament_id, overlay_type
└── Accept connection with overlay principal
        ↓
JavaScript subscribes to STOMP topic:
/topic/tournament.{id}.leaderboard
/topic/tournament.{id}.matches
        ↓
On STOMP MESSAGE received:
├── Parse JSON payload
├── Update DOM elements (leaderboard rows, match status)
├── CSS transitions animate changes
└── Rank changes animate with up/down indicators

OVERLAY HOSTING:
├── Static HTML files served by Nginx (separate server block)
├── Path: /var/www/gameverse/overlays/
└── No Spring Boot processing for overlay HTML serving
    (Only WebSocket data comes from Spring Boot)
```

## 11.2 Overlay Types & Data Sources

```
OVERLAY TYPES (all real-time via STOMP):

OVL-01: Full Leaderboard
├── Data: /topic/tournament.{id}.leaderboard
├── Updates: After every match result published
├── Displays: All teams ranked with points, kills, CDs
└── Animation: Rows slide to new positions

OVL-02: Top 10 Leaderboard
├── Same data source as OVL-01
└── Filtered to top 10 teams

OVL-03: Match Info Bar
├── Data: /topic/tournament.{id}.matches
├── Updates: On match status change
└── Displays: Current match number, round, status, timer

OVL-04: Sponsor Banner
├── Data: Static (no STOMP needed)
└── Sponsor logo + text configured via Broadcast Dashboard

OVL-05: Result Splash
├── Data: /topic/tournament.{id}.matches (result_published event)
├── Trigger: Shown for 15 seconds on result publish
└── Displays: Top 3 placements for the completed match

OVL-06: Grand Finale
├── Data: Final leaderboard on tournament COMPLETED event
└── Displays: Champion + top 3 with trophy animation
```

---

---

# SECTION 12 — BACKGROUND JOB PROCESSING

---

## 12.1 Spring Scheduler Architecture

```
BACKGROUND JOB IMPLEMENTATION:

Phase 1 (MVP): Spring @Scheduled + @Async
├── No external queue dependency (simpler operations)
├── Single instance execution (no distributed locking needed)
├── Jobs run in separate thread pool from main API threads
└── Spring @Scheduled(cron = "...") for time-based triggers

Phase 2 (Scale): Quartz Scheduler (clustered)
├── Clustered execution with MySQL-backed job store
├── Distributed locking prevents duplicate execution across instances
└── Job persistence: Survives application restart

SCHEDULED JOBS:

Every 60 seconds:
└── CredentialReleaseJob
    ├── Find scheduled credentials with release_time <= now
    ├── Decrypt credentials (server-side)
    ├── Broadcast via STOMP to eligible players
    └── Update credential status to RELEASED

Every 5 minutes:
└── SlotReservationExpiryJob
    ├── Find payment_transactions PENDING > 15 minutes
    ├── Release reserved slots
    └── Mark transactions as EXPIRED

Every 15 minutes:
└── PaymentReconciliationJob
    ├── Query Razorpay for pending orders
    ├── Confirm captures, release expired orders
    └── Alert if discrepancies found

Every 30 minutes:
└── CorrectionDeadlineJob
    ├── Find correction_requested registrations past deadline
    ├── Auto-reject and initiate refund
    └── Notify captains

Daily 02:00 AM IST:
└── DailyMaintenanceJob
    ├── Compute player career statistics
    ├── Archive completed tournament audit logs
    ├── Clean expired sessions
    └── Rotate old overlay tokens

On Tournament Completion:
└── PostTournamentAnalyticsJob (triggered via Spring Event)
    ├── Compute full tournament analytics snapshot
    ├── Update player career stats
    ├── Generate sponsor report
    └── Archive leaderboard snapshots
```

## 12.2 Async Thread Pool Configuration

```
SPRING ASYNC CONFIGURATION:

Task Executor (General @Async):
├── Core pool size: 10
├── Max pool size: 50
├── Queue capacity: 1000
└── Thread name prefix: "gv-async-"

Notification Executor (@Async for notifications):
├── Core pool size: 20
├── Max pool size: 100
├── Queue capacity: 5000
└── Thread name prefix: "gv-notif-"

Leaderboard Executor (@Async for leaderboard recalc):
├── Core pool size: 5
├── Max pool size: 10
├── Queue capacity: 50
└── Thread name prefix: "gv-lb-"

Scheduler Executor (for @Scheduled jobs):
├── Pool size: 5
└── Thread name prefix: "gv-sched-"
```

---

---

# SECTION 13 — CACHING STRATEGY

---

## 13.1 Cache Layers

```
CACHING ARCHITECTURE:

L1: Browser/CDN Cache
├── Static assets (JS/CSS bundles): Immutable, 1 year cache
├── Images via Cloudflare CDN: 1 day
└── API responses: No browser cache (Cache-Control: no-store)

L2: Spring Application Cache (Phase 1 — In-Memory)
├── Spring Cache + Caffeine (in-process, per-instance)
├── Shared across requests within same JVM
└── NOT shared across multiple Spring instances (single instance MVP)

CAFFEINE CACHE CONFIGURATION:

Cache: leaderboard:{tournamentId}
├── Max size: 500 entries
├── Expire after write: 60 seconds
└── Invalidated on: Match result published

Cache: tournamentState:{tournamentId}
├── Max size: 200 entries
├── Expire after write: 30 seconds
└── Invalidated on: Tournament status change

Cache: gamesCatalog
├── Max size: 1 entry (full list)
├── Expire after write: 1 hour
└── Invalidated on: Game catalog update

Cache: scoringTemplate:{templateId}
├── Max size: 100 entries
├── Expire after write: 12 hours
└── Invalidated on: Template update

L3: Redis Cache (Phase 2 — Distributed)
├── Required when: Multiple Spring Boot instances running
├── Spring Data Redis with RedisTemplate
├── Same cache keys as Caffeine, but distributed
└── Enables cache sharing across all instances

Implementation:
├── Phase 1: @Cacheable("leaderboard") → Caffeine
└── Phase 2: Same annotation → Spring switches to Redis
    (No code change needed — only Spring configuration change)
```

## 13.2 Cache Annotations

```
SPRING CACHE ANNOTATIONS USED:

@Cacheable("leaderboard")
→ On: LeaderboardService.getLeaderboard(tournamentId)
→ Cache key: #tournamentId

@CacheEvict("leaderboard")
→ On: LeaderboardService.recalculate(tournamentId)
→ Evicts cached leaderboard after recalculation

@Cacheable("tournamentState")
→ On: TournamentService.getState(tournamentId)
→ Cache key: #tournamentId

@CacheEvict(value = "tournamentState", key = "#tournamentId")
→ On: TournamentService.changeStatus(tournamentId, newStatus)

@Cacheable("games")
→ On: GameService.getAllGames()
→ Cache key: "all"
```

---

---

# SECTION 14 — SEARCH INFRASTRUCTURE

---

## 14.1 MySQL Full-Text Search

```
SEARCH IMPLEMENTATION (MySQL Full-Text):

Tournament Discovery:
├── MySQL FULLTEXT INDEX on (name, short_description)
├── Query: MATCH(name, short_description) AGAINST(? IN BOOLEAN MODE)
├── Additional filters: status, game_id, start_date range
└── Spring Data JPA: @Query with native SQL for FULLTEXT queries

User/Team Search (organizer tools):
├── MySQL FULLTEXT INDEX on users(username, display_name)
├── MySQL FULLTEXT INDEX on teams(team_name, team_tag)
└── Used for: Staff assignment, member search

Tournament-within-Org Search:
├── Simple LIKE query with index on org_id + name
└── No full-text needed for small result sets

SEARCH LIMITATIONS (MySQL FULLTEXT):
├── Minimum word length: 3 characters (configurable)
├── Stopwords: Filtered by MySQL
└── No fuzzy matching → Future: Add Apache Lucene if needed
```

---

---

# SECTION 15 — MONITORING & OBSERVABILITY

---

## 15.1 Spring Boot Actuator

```
SPRING BOOT ACTUATOR ENDPOINTS:

/actuator/health          → Load balancer health check
/actuator/health/detailed → Full component health
/actuator/metrics         → JVM, HTTP, database metrics
/actuator/loggers         → Dynamic log level management
/actuator/info            → Version, build info
/actuator/env             → Active configuration (secured)

Custom Health Indicators:
├── DatabaseHealthIndicator → MySQL connectivity + query test
├── RedisHealthIndicator → Redis connectivity (Phase 2)
├── WebSocketHealthIndicator → Active WS connections count
└── ExternalServicesHealthIndicator → Razorpay, MSG91 ping

/actuator/health response:
{
  "status": "UP",
  "components": {
    "db": { "status": "UP", "details": { "latencyMs": 8 } },
    "websocket": { "status": "UP", "details": { "connections": 1240 } },
    "diskSpace": { "status": "UP", "details": { "free": "15GB" } },
    "razorpay": { "status": "UP" },
    "msg91": { "status": "UP" }
  }
}
```

## 15.2 Observability Stack

```
OBSERVABILITY TOOLS:

Sentry (Error Tracking):
├── Spring Boot: sentry-spring-boot-starter
├── Captures: All unhandled exceptions with full stack trace
├── Context: User ID, tournament ID, request details attached
├── Performance: Transaction tracing for slow API calls
└── Alerts: Slack + PagerDuty for new error types

Datadog (APM + Infrastructure):
├── Spring Boot: dd-java-agent (attached as JVM agent)
├── Auto-instruments: Spring MVC, JDBC, HikariCP, Spring Scheduler
├── Custom metrics (Micrometer → Datadog):
│   ├── active_tournaments gauge
│   ├── active_websocket_connections gauge
│   ├── leaderboard_recalculation_duration histogram
│   ├── credential_releases counter
│   └── payment_confirmations counter
└── Dashboards: API performance, database, WebSocket health

Structured Logging (SLF4J + Logback + JSON):
├── All log entries in JSON format for Datadog/CloudWatch ingestion
├── MDC (Mapped Diagnostic Context) per request:
│   ├── requestId (UUID correlation)
│   ├── userId (authenticated user)
│   ├── tournamentId (if applicable)
│   └── matchId (if applicable)
└── Log levels:
    ├── ERROR: Exceptions, payment failures, security events
    ├── WARN: Slow queries, retry attempts, credential failures
    ├── INFO: API calls, state transitions, notifications sent
    └── DEBUG: Detailed business logic (disabled in production)

UptimeRobot (External Monitoring):
├── https://api.gameverse.gg/actuator/health → every 60s
├── https://gameverse.gg → every 60s
└── Alert: Email + SMS + Slack on downtime
```

## 15.3 Alerting Rules

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| API Error Rate | > 1% of requests → 5xx | P0 | PagerDuty + Slack |
| API p99 Latency | > 2 seconds | P1 | Slack |
| MySQL Connection Pool | > 90% exhausted | P0 | PagerDuty |
| WebSocket Connections Drop | > 20% in 5 min | P1 | Slack |
| Credential Delivery Failure | Any failure | P0 | PagerDuty + Slack |
| Payment Webhook Missing | Payment PENDING > 30min | P0 | PagerDuty |
| Scheduled Job Failure | Any @Scheduled exception | P1 | Slack |
| JVM Heap Usage | > 80% | P1 | Slack |
| Disk Space | > 80% | P1 | Slack |
| SSL Certificate Expiry | < 30 days | P1 | Email |

---

---

# SECTION 16 — DEPLOYMENT & INFRASTRUCTURE (DEVOPS)

---

## 16.1 Infrastructure Overview

```
PRODUCTION INFRASTRUCTURE:

┌──────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE                               │
│  DNS │ CDN (static assets, overlay HTML) │ WAF │ DDoS Shield   │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                   AWS Mumbai (ap-south-1)                        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                        VPC                               │   │
│  │                                                          │   │
│  │  Public Subnet:                                          │   │
│  │  └── Application Load Balancer (ALB)                    │   │
│  │      ├── Target Group A: React SPA (Nginx, EC2)         │   │
│  │      ├── Target Group B: Spring Boot API (EC2)          │   │
│  │      └── Target Group C: WebSocket /ws (EC2, sticky)    │   │
│  │                                                          │   │
│  │  Private Subnet A (App Tier):                           │   │
│  │  ├── EC2: Spring Boot App Server (t3.medium × 2)        │   │
│  │  │   └── JVM: Java 21, -Xmx2g, -Xms512m               │   │
│  │  │   └── Spring Boot: Port 8080 + WebSocket 8080/ws    │   │
│  │  └── EC2: Nginx + React SPA (t3.small × 2)             │   │
│  │      └── Serves: /var/www/gameverse (Vite build output) │   │
│  │                                                          │   │
│  │  Private Subnet B (Data Tier):                          │   │
│  │  ├── RDS: MySQL 8.0 Primary (db.t4g.medium)             │   │
│  │  ├── RDS: MySQL 8.0 Read Replica × 1 (Phase 2)         │   │
│  │  └── ElastiCache: Redis 7 (cache.t3.micro) (Phase 2)   │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

FRONTEND (React SPA):
├── Option A: Self-hosted on EC2 (Nginx serves Vite build output)
└── Option B: Vercel (auto-deploys from GitHub, global CDN)

FILE STORAGE:
└── Cloudflare R2 (Mumbai-proxied, zero egress fees)

SECRETS:
└── AWS Secrets Manager (Spring Boot reads at startup)
```

## 16.2 CI/CD Pipeline

```
GITHUB ACTIONS — CI/CD PIPELINE:

BACKEND (Spring Boot):
On Pull Request:
├── mvn clean verify (compile + unit tests + integration tests)
├── Checkstyle + SpotBugs (code quality)
├── OWASP Dependency Check (CVE scan)
├── Testcontainers integration tests (MySQL container)
└── SonarQube analysis (code coverage gates)

On Merge to main (after PR approval):
├── mvn clean package -DskipTests (build JAR)
├── docker build → push to AWS ECR
├── Flyway migration on staging MySQL
├── Deploy to staging (EC2 rolling update)
├── Smoke tests against staging API
└── Manual approval gate (requires 1 team member)

On Production Approval:
├── Flyway migration on production MySQL
│   (Applied before app deployment — backward-compatible migrations)
├── Blue-Green deployment:
│   ├── Launch new Spring Boot instances (green)
│   ├── Spring Boot health check: /actuator/health → UP
│   ├── ALB: Shift 10% → 50% → 100% traffic to green
│   ├── Monitor error rate for 5 minutes
│   └── Terminate old instances (blue) on success
└── Post-deploy: Smoke test API endpoints

FRONTEND (React):
On Pull Request:
├── npm run build (Vite production build)
├── JavaScript type check (tsc --noEmit)
├── ESLint + Prettier check
└── Playwright E2E tests (headless Chromium)

On Merge to main:
├── npm run build
├── Deploy to Vercel (if Vercel) OR
│   rsync dist/ to EC2 Nginx root (if self-hosted)
└── Purge Cloudflare cache for updated assets
```

## 16.3 Spring Boot Containerization

```
DOCKER CONFIGURATION:

Multi-Stage Dockerfile (Spring Boot):
Stage 1: Build
├── Image: maven:3.9-eclipse-temurin-21
├── COPY pom.xml + src
└── RUN mvn clean package -DskipTests

Stage 2: Runtime
├── Image: eclipse-temurin:21-jre-alpine (minimal JRE, ~250MB)
├── COPY --from=builder target/gameverse-*.jar app.jar
├── RUN adduser -D gameverse
├── USER gameverse (non-root for security)
├── EXPOSE 8080
├── JVM flags:
│   ├── -Xmx2g (heap max)
│   ├── -Xms512m (heap initial)
│   ├── -XX:+UseG1GC (G1 garbage collector)
│   ├── -XX:+UseContainerSupport (Docker-aware heap sizing)
│   ├── --enable-preview (Java 21 preview features)
│   └── -Dfile.encoding=UTF-8
└── ENTRYPOINT ["java", "-jar", "/app/app.jar"]

Docker Compose (Development):
services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/gameverse
      SPRING_DATA_REDIS_HOST: redis
      JWT_PRIVATE_KEY: ${JWT_PRIVATE_KEY}
    depends_on: [db, redis]

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: gameverse
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes: [mysql_data:/var/lib/mysql]

  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]

  frontend:
    image: node:20-alpine
    working_dir: /app
    command: npm run dev
    ports: ["5173:5173"]
    volumes: [./frontend:/app]
```

---

---

# SECTION 17 — NETWORK ARCHITECTURE & SECURITY

---

## 17.1 Network Security Layers

```
SECURITY LAYER STACK:

Layer 1: Cloudflare (Edge)
├── DDoS mitigation: Automatic, up to layer 7
├── WAF: OWASP Core Rule Set (pre-configured)
├── Bot Management: Blocks credential stuffing, scrapers
├── Rate Limiting: IP-based at edge (before reaching server)
└── SSL: Cloudflare → Origin: Full (Strict) TLS

Layer 2: AWS VPC
├── Security Groups: Allow only 443 (ALB), 22 (Bastion SSH) inbound
├── Private subnets: App and DB tiers have NO internet access
├── NAT Gateway: Allows outbound-only internet for app servers
└── VPC Flow Logs: All traffic logged to CloudWatch

Layer 3: ALB
├── SSL termination (AWS ACM certificate)
├── Redirect HTTP → HTTPS
├── WebSocket support (sticky sessions for WS connections)
└── Health check routing

Layer 4: Nginx
├── Request size limits: max_body_size 10m
├── Connection timeouts: read 30s, write 30s
├── WebSocket upgrade headers
└── Rate limiting (zone-based, per IP)

Layer 5: Spring Security
├── JWT validation on every request
├── RBAC enforcement
├── Input validation (Bean Validation)
└── SQL injection prevention (JPA parameterized queries)

Layer 6: MySQL (Private Subnet)
├── No direct internet access
├── Only accessible from app private subnet
├── TLS required for connections
└── Minimal privilege DB users per service
```

---

---

# SECTION 18 — DISASTER RECOVERY & BUSINESS CONTINUITY

---

## 18.1 Backup & Recovery

```
BACKUP STRATEGY:

MySQL (RDS):
├── Automated backups: 7-day retention (RDS managed)
├── Continuous binlog backup: Point-in-time recovery to 5-minute granularity
├── Daily snapshots: 30-day retention (manual)
├── Cross-region snapshot copy: ap-south-1 → ap-southeast-1 (daily)
└── Recovery test: Monthly restore test on staging

File Storage (Cloudflare R2):
├── Versioning: Enabled on all buckets
└── Cross-region replication: R2 to AWS S3 backup bucket (daily)

Application Config:
└── AWS Secrets Manager: Replicated across AZs (AWS-managed)

RECOVERY TIME OBJECTIVES:

| Failure Scenario               | RTO      | RPO       | Recovery Method          |
|-------------------------------|----------|-----------|--------------------------|
| Single EC2 instance fails      | < 1 min  | 0         | ALB routes to healthy    |
| Spring Boot crash (single)     | < 2 min  | 0         | EC2 Auto Scaling restart |
| MySQL primary fails            | < 5 min  | < 5 min   | RDS Multi-AZ failover    |
| Full AZ outage                 | < 15 min | < 5 min   | Multi-AZ auto-failover   |
| Accidental data deletion       | < 30 min | < 5 min   | Point-in-time restore    |
| Full region failure            | < 4 hrs  | < 6 hrs   | Manual restore to ap-se-1|
```

## 18.2 Tournament-Day Runbook

```
TOURNAMENT DAY OPERATIONAL CHECKLIST:

T-60 minutes before first match:
├── ✅ Verify MySQL primary: healthy + replication lag < 1s
├── ✅ Verify Spring Boot instances: all healthy (/actuator/health)
├── ✅ Verify WebSocket: Test STOMP connection from test client
├── ✅ Verify Razorpay: Test webhook receipt in staging
├── ✅ Verify Cloudflare: Purge CDN cache for tournament assets
└── ✅ Alert on-call engineer: Tournament started

During tournament:
├── Monitor: Datadog dashboard open (API latency, WS connections)
├── Monitor: Sentry error rate (acceptable < 0.5%)
├── Monitor: MySQL slow query log active
└── Monitor: WebSocket active connections (expected: viewers × 1.5)

Incident response:
├── P0 escalation: PagerDuty page on-call + management
├── Status page: https://status.gameverse.gg updated within 5 minutes
├── Organizer communication: In-app announcement + direct contact
└── Post-incident: RCA written within 24 hours
```

---

---

# SECTION 19 — TECHNOLOGY STACK SUMMARY

---

## 19.1 Complete Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND STACK                                        │
├─────────────────────────┬───────────────────┬───────────────────────────┤
│ Category                │ Technology        │ Purpose                   │
├─────────────────────────┼───────────────────┼───────────────────────────┤
│ UI Framework            │ React 19          │ Component-based UI        │
│ Build Tool              │ Vite 5            │ Fast build + HMR dev      │
│ Language                │ JavaScript 5      │ Type safety               │
│ Router                  │ React Router v7   │ Client-side routing       │
│ Server State            │ TanStack Query v5 │ API data fetching + cache │
│ Forms                   │ React Hook Form   │ Performant form handling  │
│ Validation              │ Zod               │ Schema validation         │
│ Styling                 │ Tailwind CSS v4   │ Utility-first CSS         │
│ UI Components           │ shadcn/ui         │ Radix-based components    │
│ Charts                  │ Recharts          │ Analytics visualizations  │
│ WebSocket Client        │ @stomp/stompjs    │ STOMP protocol client     │
│ WS Fallback             │ sockjs-client     │ Polling fallback for OBS  │
│ HTTP Client             │ Axios             │ REST API calls            │
│ Global State            │ Zustand           │ Auth + WS state           │
│ Testing                 │ Vitest + RTL      │ Component testing         │
│ E2E Testing             │ Playwright        │ Browser automation        │
│ Deployment              │ Nginx / Vercel    │ Static file serving       │
└─────────────────────────┴───────────────────┴───────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND STACK                                         │
├─────────────────────────┬───────────────────┬───────────────────────────┤
│ Category                │ Technology        │ Purpose                   │
├─────────────────────────┼───────────────────┼───────────────────────────┤
│ Runtime                 │ Java 21 (LTS)     │ Application runtime       │
│ Framework               │ Spring Boot 3.3   │ Application framework     │
│ Web Layer               │ Spring MVC        │ REST API controllers      │
│ Security                │ Spring Security 6 │ Auth + RBAC               │
│ ORM                     │ Spring Data JPA   │ Database abstraction      │
│ DB Implementation       │ Hibernate 6       │ JPA provider             │
│ DB Migrations           │ Flyway            │ Schema version control    │
│ Validation              │ Bean Validation   │ Request input validation  │
│ WebSocket               │ Spring WebSocket  │ WebSocket server          │
│ Protocol                │ STOMP             │ Pub/sub over WebSocket    │
│ API Documentation       │ SpringDoc OpenAPI │ Swagger UI auto-gen       │
│ JWT                     │ JJWT              │ JWT creation/validation   │
│ JSON                    │ Jackson           │ Serialization             │
│ DTO Mapping             │ MapStruct         │ Entity ↔ DTO mapping      │
│ Caching (Phase 1)       │ Caffeine          │ In-process cache          │
│ Caching (Phase 2)       │ Spring Data Redis │ Distributed cache         │
│ Async Jobs              │ Spring Scheduler  │ Background jobs (@Async)  │
│ Job Queue (Phase 2)     │ RabbitMQ          │ Distributed job queue     │
│ HTTP Client             │ Spring WebClient  │ External API calls        │
│ Password Hash           │ BCrypt            │ Secure password storage   │
│ Encryption              │ JCE AES-256-GCM   │ Field-level encryption    │
│ Testing                 │ JUnit 5 + Mockito │ Unit + integration tests  │
│ Test Containers         │ Testcontainers    │ MySQL in tests            │
│ Build                   │ Maven             │ Dependency management     │
│ Containerization        │ Docker            │ Application packaging     │
└─────────────────────────┴───────────────────┴───────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    DATA & INFRASTRUCTURE STACK                          │
├─────────────────────────┬───────────────────┬───────────────────────────┤
│ Category                │ Technology        │ Purpose                   │
├─────────────────────────┼───────────────────┼───────────────────────────┤
│ Primary Database        │ MySQL 8 (InnoDB)  │ All persistent data       │
│ DB Connection Pool      │ HikariCP          │ MySQL connection pooling  │
│ Cache (Phase 1)         │ Caffeine          │ In-JVM cache              │
│ Cache (Phase 2)         │ Redis 7           │ Distributed cache + WS    │
│ Message Broker (Phase 2)│ RabbitMQ          │ STOMP multi-instance WS   │
│ File Storage            │ Cloudflare R2     │ Object storage (S3-compat)│
│ CDN                     │ Cloudflare        │ Global asset delivery     │
│ Cloud Provider          │ AWS (ap-south-1)  │ Compute + managed DB      │
│ Compute                 │ AWS EC2 (t3.medium│ Application servers       │
│ DB Hosting              │ AWS RDS           │ Managed MySQL             │
│ Cache Hosting           │ AWS ElastiCache   │ Managed Redis (Phase 2)   │
│ Load Balancer           │ AWS ALB           │ HTTP + WebSocket LB       │
│ Container Registry      │ AWS ECR           │ Docker image storage      │
│ Secrets                 │ AWS Secrets Mgr   │ Environment secrets       │
│ Reverse Proxy           │ Nginx             │ SSL termination, static   │
│ CI/CD                   │ GitHub Actions    │ Build + deploy pipeline   │
├─────────────────────────┴───────────────────┴───────────────────────────┤
│                    EXTERNAL SERVICES                                    │
├─────────────────────────┬───────────────────┬───────────────────────────┤
│ Payments                │ Razorpay          │ INR payments + payouts    │
│ SMS (Primary)           │ MSG91             │ DLT-compliant SMS         │
│ SMS (Fallback)          │ Twilio            │ SMS backup channel        │
│ Email                   │ SendGrid          │ Transactional email       │
│ Push Notifications      │ Firebase (FCM)    │ Android + Chrome push     │
│ Push Notifications      │ APNs              │ iOS + Safari push         │
│ Error Tracking          │ Sentry            │ Exception monitoring      │
│ APM                     │ Datadog           │ Performance monitoring    │
│ Uptime                  │ UptimeRobot       │ External health checks    │
│ Image Processing        │ Java ImageIO      │ Server-side image resize  │
│ PDF Generation          │ iText / PDFBox    │ Sponsor reports, receipts │
└─────────────────────────┴───────────────────┴───────────────────────────┘
```

---

---

# SECTION 20 — ARCHITECTURE DECISION RECORDS (ADRs)

---

## ADR-001: Java 21 + Spring Boot over Node.js

| Attribute | Detail |
|-----------|--------|
| **Date** | June 2025 |
| **Status** | Accepted |
| **Decision** | Use Java 21 with Spring Boot 3 as the backend runtime |

**Context:** GameVerse requires a production-grade backend with strong typing, robust security, mature ORM, and enterprise-grade WebSocket support.

**Decision:** Java 21 LTS with Spring Boot 3. Spring Security provides battle-tested RBAC. Spring Data JPA with Hibernate is the industry standard for relational data. Spring WebSocket + STOMP provides first-class real-time support. Virtual Threads (Project Loom, stable in Java 21) improve throughput for I/O-bound operations without reactive complexity.

**Consequences:**
- ✅ Spring Security — mature, audited RBAC framework
- ✅ Spring Data JPA — clean database abstraction with Hibernate
- ✅ Spring WebSocket — native STOMP support
- ✅ Virtual Threads (Java 21) — simple threading model with high throughput
- ✅ Strong ecosystem (OpenAPI, Flyway, Testcontainers, MapStruct)
- ⚠️ Higher memory footprint than Node.js (mitigated by JVM tuning)
- ⚠️ Longer startup time (mitigated by Spring Boot 3 AOT compilation option)

---

## ADR-002: MySQL over PostgreSQL

| Attribute | Detail |
|-----------|--------|
| **Date** | June 2025 |
| **Status** | Accepted |
| **Decision** | Use MySQL 8 (InnoDB) as the primary database |

**Context:** Both MySQL and PostgreSQL are excellent choices. The team has stronger MySQL operational expertise. MySQL 8 has closed the gap with PostgreSQL in features (window functions, CTEs, JSON columns, full-text search).

**Decision:** MySQL 8 with InnoDB storage engine. Spring Data JPA + Hibernate abstract the database well enough that migration to PostgreSQL is feasible if needed.

**Consequences:**
- ✅ Team familiarity reduces operational risk
- ✅ MySQL 8: Full SQL features (window functions, CTEs, JSON)
- ✅ AWS RDS MySQL: Well-supported managed option
- ✅ HikariCP connection pooling works identically
- ⚠️ No native JSONB performance advantage (PostgreSQL)
- ⚠️ No advisory locks (workaround: application-level optimistic locking)

---

## ADR-003: Spring WebSocket + STOMP over Third-Party WS Server

| Attribute | Detail |
|-----------|--------|
| **Date** | June 2025 |
| **Status** | Accepted |
| **Decision** | Use Spring WebSocket with STOMP protocol instead of separate Socket.IO server |

**Context:** Real-time communication is central to GameVerse. Options considered: Spring WebSocket + STOMP (native), Separate Node.js + Socket.IO server, Third-party (Pusher, Ably).

**Decision:** Spring WebSocket + STOMP native integration. STOMP provides topic-based pub/sub semantics natively. @MessageMapping and @SendTo/SimpMessagingTemplate integrate cleanly with Spring Security. SockJS fallback handles OBS browser sources on restricted networks.

**Consequences:**
- ✅ No additional server to deploy and maintain
- ✅ Spring Security authentication flows directly into WebSocket
- ✅ SockJS fallback for OBS/restricted networks
- ✅ @Async event publishers + SimpMessagingTemplate = clean architecture
- ⚠️ Scaling across multiple instances requires RabbitMQ STOMP relay (Phase 2)
- ⚠️ No automatic reconnection client-side (handled by @stomp/stompjs library)

---

## ADR-004: React 19 + Vite over Next.js

| Attribute | Detail |
|-----------|--------|
| **Date** | June 2025 |
| **Status** | Accepted |
| **Decision** | Use React 19 SPA with Vite instead of Next.js |

**Context:** When the backend is Spring Boot (not Node.js), Next.js loses its primary advantage — API routes. SSR requires a Node.js server running alongside the Spring Boot backend. For a Spring Boot + React stack, a plain React SPA served by Nginx is simpler and more cost-effective.

**Decision:** React 19 SPA built with Vite, served as static files by Nginx (or Vercel). SEO for public tournament pages handled via meta tags + social cards (OpenGraph). Future SSR can be added via React Server Components if React ecosystem enables it without Node.js server.

**Consequences:**
- ✅ No Node.js server needed alongside Spring Boot
- ✅ Simpler infrastructure (static files on Nginx)
- ✅ Vite: Best-in-class DX, fast HMR, optimized production builds
- ✅ Cleaner separation: Spring Boot owns ALL data, React owns ALL UI
- ⚠️ No built-in SSR (tournament pages not pre-rendered for SEO)
- ⚠️ Mitigation: Pre-render tournament meta tags via Nginx + Spring Boot API for crawlers (dynamic meta tag injection)

---

## ADR-005: Modular Monolith with Clean Package Boundaries

| Attribute | Detail |
|-----------|--------|
| **Date** | June 2025 |
| **Status** | Accepted |
| **Decision** | Package all 21 modules inside single Spring Boot JAR |

**Context:** Microservices add: distributed tracing, inter-service HTTP/RPC calls, eventual consistency complexity, separate deployments, separate databases per service. For MVP, this overhead slows development without adding value.

**Decision:** Single Spring Boot JAR with 21 well-defined packages. Modules communicate via Spring @Service calls (within JVM) and Spring Application Events (domain events). Module boundaries enforced by code review and architectural tests (ArchUnit).

**Consequences:**
- ✅ Single deployment unit — simple operations
- ✅ In-process calls — no network latency between modules
- ✅ Single @Transactional context — atomic cross-module operations
- ✅ Spring Events enable loose coupling within monolith
- ⚠️ Cannot scale individual modules independently at MVP (not needed)
- ⚠️ Must maintain package discipline → enforced by ArchUnit tests

---

## ADR-006: Caffeine Cache Now, Redis Later

| Attribute | Detail |
|-----------|--------|
| **Date** | June 2025 |
| **Status** | Accepted |
| **Decision** | Use Caffeine in-process cache for Phase 1; add Redis in Phase 2 |

**Context:** Redis adds operational complexity: separate server, connection management, cache invalidation across network. At MVP scale (single Spring Boot instance), an in-process cache is simpler and faster.

**Decision:** Use Spring Cache with Caffeine implementation. When multiple Spring Boot instances are needed, switch to Spring Data Redis — the same @Cacheable annotations work with both. No application code changes required, only Spring configuration.

**Consequences:**
- ✅ Zero infrastructure dependency for caching at MVP
- ✅ Caffeine: Extremely fast in-process cache (nanosecond access)
- ✅ Seamless migration: Same annotations → just change Spring config
- ⚠️ Cache not shared across instances (Phase 1 single-instance only)
- ⚠️ Cache lost on restart (acceptable for short TTL caches)

---

## ADR-007: Flyway for Database Schema Management

| Attribute | Detail |
|-----------|--------|
| **Date** | June 2025 |
| **Status** | Accepted |
| **Decision** | Use Flyway for MySQL schema migrations |

**Context:** Hibernate's auto schema update (hbm2ddl) is dangerous in production. Need controlled, versioned, auditable schema changes.

**Decision:** Flyway with versioned SQL migration scripts. Scripts are checked into Git alongside application code. Applied automatically on Spring Boot startup. Production migrations require backward compatibility (additive only during deployments).

**Consequences:**
- ✅ Schema changes version-controlled in Git
- ✅ Applied automatically in CI/CD pipeline
- ✅ Audit trail of all schema changes
- ✅ Testcontainers runs same migrations in test environment
- ⚠️ No automatic rollback (must write compensating migration)
- ⚠️ Requires discipline: Never modify existing migration files

---

---

## DOCUMENT COMPLETION SUMMARY

---

| Section | Topic | Status |
|---------|-------|--------|
| Section 1 | Overview & Architecture Philosophy | ✅ Complete |
| Section 2 | High-Level Architecture (React + Spring Boot) | ✅ Complete |
| Section 3 | Frontend Architecture (React 19 + Vite) | ✅ Complete |
| Section 4 | Backend Architecture (Spring Boot Modular Monolith) | ✅ Complete |
| Section 5 | Real-Time (Spring WebSocket + STOMP) | ✅ Complete |
| Section 6 | Database (MySQL + JPA/Hibernate + Flyway) | ✅ Complete |
| Section 7 | File Storage & CDN | ✅ Complete |
| Section 8 | Auth & Security (Spring Security + JWT) | ✅ Complete |
| Section 9 | Payment Infrastructure (Razorpay) | ✅ Complete |
| Section 10 | Notification Infrastructure | ✅ Complete |
| Section 11 | OBS Overlay Infrastructure | ✅ Complete |
| Section 12 | Background Jobs (Spring Scheduler + @Async) | ✅ Complete |
| Section 13 | Caching (Caffeine → Redis) | ✅ Complete |
| Section 14 | Search (MySQL Full-Text) | ✅ Complete |
| Section 15 | Monitoring & Observability | ✅ Complete |
| Section 16 | Deployment & DevOps (GitHub Actions + AWS) | ✅ Complete |
| Section 17 | Network Security | ✅ Complete |
| Section 18 | Disaster Recovery | ✅ Complete |
| Section 19 | Technology Stack Summary | ✅ Complete |
| Section 20 | Architecture Decision Records (7 ADRs) | ✅ Complete |

---

## Phase Roadmap Summary

| Phase | Trigger | Changes |
|-------|---------|---------|
| **Phase 1 (MVP)** | Launch | Single Spring Boot instance, Caffeine cache, Spring @Scheduled jobs, MySQL primary only |
| **Phase 2 (Scale)** | > 5 concurrent tournaments OR > 2 Spring instances | Add Redis (cache + STOMP pub-sub), MySQL read replica, RabbitMQ for multi-instance STOMP relay |
| **Phase 3 (Hyper-Scale)** | > 50 concurrent tournaments | Extract Auth, Scoring, Notification as separate Spring Boot services communicating via RabbitMQ |

---

## Document Sign-Off

| Role | Name | Status |
|------|------|--------|
| Engineering Lead | — | Pending Review |
| DevOps Lead | — | Pending Review |
| Security Review | — | Pending Review |
| Product Lead | — | Pending Review |

---

> **Document:** GameVerse System Architecture (React 19 + Java 21 Spring Boot) | **Version:** 2.0 | **Status:** Complete ✅