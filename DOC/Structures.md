# GameVerse Folder Structures

This document outlines the detailed folder structures for both the **Frontend** (React SPA) and **Backend** (Spring Boot Modular Monolith) applications based on the GameVerse ecosystem and architecture.

---

## 1. 🖥️ Frontend Architecture (React + Vite)

The frontend uses a feature-based architecture combined with portal-based page organization to cleanly separate the four ecosystem sides while sharing business logic and UI components.

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

---

## 2. ⚙️ Backend Architecture (Spring Boot Modular Monolith)

The backend follows a **Modular Monolith** architecture packaged by feature/domain. This prevents the complexity of microservices while keeping the code highly decoupled, allowing easy extraction of services in the future.

```text
gameverse-backend/
│
├── src/main/java/com/gameverse/
│   │
│   ├── GameverseApplication.java             # Spring Boot Main Entry Point
│   │
│   ├── core/                                 # Global/Cross-Cutting Concerns
│   │   ├── config/                           # Bean configurations (Cors, Redis, OpenAPI)
│   │   ├── security/                         # Spring Security, JWT filters, Role validators
│   │   ├── exceptions/                       # Global Exception Handler, Custom exceptions
│   │   ├── websocket/                        # STOMP / WebSocket configuration
│   │   └── common/                           # Shared DTOs, Base Entities (Auditable)
│   │
│   └── modules/                              # Business Domains (Package-by-Feature)
│       │
│       ├── auth/                             # Authentication & Users (MOD-01)
│       │   ├── controller/                   # AuthController, UserController
│       │   ├── service/                      # AuthService, TokenService
│       │   ├── model/                        # User, Role, Session (JPA Entities)
│       │   ├── repository/                   # UserRepository, RoleRepository
│       │   └── dto/                          # LoginRequest, UserResponse, JwtDTO
│       │
│       ├── organization/                     # Organizations & Permissions (MOD-02)
│       │   ├── controller/                   # OrgController, OrgMemberController
│       │   ├── service/                      # OrgService, InvitationService
│       │   ├── model/                        # Organization, OrgMember, OrgRole
│       │   └── repository/                   # OrgRepository, OrgMemberRepository
│       │
│       ├── tournament/                       # Tournaments & Games (MOD-03, MOD-05)
│       │   ├── controller/                   # TournamentController, GameController
│       │   ├── service/                      # TournamentService, GameConfigService
│       │   ├── model/                        # Tournament, Game, PrizePool, RuleSet
│       │   └── repository/                   # TournamentRepository, GameRepository
│       │
│       ├── participant/                      # Teams, Players & Registration (MOD-04, MOD-06)
│       │   ├── controller/                   # TeamController, RegistrationController
│       │   ├── service/                      # TeamService, RegistrationService, UidValidator
│       │   ├── model/                        # Team, Player, Registration, Waitlist
│       │   └── repository/                   # TeamRepository, RegistrationRepository
│       │
│       ├── match/                            # Scheduling & Match Ops (MOD-07, MOD-08, MOD-09)
│       │   ├── controller/                   # MatchController, ScheduleController
│       │   ├── service/                      # ScheduleGenerator, MatchOpsService, CredentialService
│       │   ├── model/                        # Match, MatchSlot, RoomCredential
│       │   └── repository/                   # MatchRepository, MatchSlotRepository
│       │
│       ├── scoring/                          # Live Scoring & Leaderboard (MOD-10, MOD-11)
│       │   ├── controller/                   # ResultController, LeaderboardController
│       │   ├── service/                      # PointsEngine, LeaderboardCalculator
│       │   ├── model/                        # MatchResult, LeaderboardSnapshot
│       │   └── repository/                   # ResultRepository, LeaderboardRepository
│       │
│       ├── broadcast/                        # Stream Overlays & CC (MOD-12, MOD-13, MOD-21)
│       │   ├── controller/                   # OverlayController, CommandController
│       │   ├── service/                      # WebsocketPublisher, StreamStatusService
│       │   └── dto/                          # WsMessageDTO, OverlayStateDTO
│       │
│       └── notification/                     # Announcements & Chat (MOD-14, MOD-15)
│           ├── controller/                   # NotificationController, ChatController
│           ├── service/                      # EmailService, SmsService, ChatModerator
│           ├── model/                        # NotificationTemplate, ChatMessage
│           └── repository/                   # NotificationRepository, ChatRepository
│
├── src/main/resources/
│   ├── application.yml                       # Spring Boot configuration (Default/Local)
│   ├── application-prod.yml                  # Production configuration
│   ├── db/migration/                         # Flyway SQL Migration Scripts
│   │   ├── V1__init_auth_schema.sql
│   │   ├── V2__init_org_schema.sql
│   │   └── V3__init_tournament_schema.sql
│   ├── i18n/                                 # Localization files (messages_en.properties)
│   └── templates/                            # Email HTML templates (Thymeleaf/Freemarker)
│
├── src/test/java/com/gameverse/               # Unit and Integration Tests
│   ├── core/
│   └── modules/                              # Tests mirroring the module structure
│       ├── auth/
│       └── match/
│
├── pom.xml                                   # Maven dependencies (or build.gradle)
├── Dockerfile                                # Containerization config
└── README.md                                 # Backend setup instructions
```
