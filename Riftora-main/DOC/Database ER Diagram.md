# 🗄️ DATABASE ER DIAGRAM
## GameVerse — Esports Tournament Operations & Live Broadcast Platform
### Version: 1.0 | June 2025

---

# PART 1: ENTITY OVERVIEW MAP

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        GAMEVERSE DATABASE — ENTITY MAP                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐          │
│  │   AUTH DOMAIN    │    │    ORG DOMAIN     │    │   GAME DOMAIN    │          │
│  │                  │    │                  │    │                  │          │
│  │  users           │    │  organizations   │    │  games           │          │
│  │  user_sessions   │    │  org_members     │    │  game_configs    │          │
│  │  oauth_providers │    │  org_invitations │    │  scoring_templates│         │
│  │  user_devices    │    │  org_plans       │    │  placement_points│          │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘          │
│           │                       │                        │                    │
│           └───────────────────────┼────────────────────────┘                   │
│                                   │                                             │
│  ┌──────────────────┐    ┌────────▼─────────┐    ┌──────────────────┐          │
│  │   TEAM DOMAIN    │    │ TOURNAMENT DOMAIN │    │ SCHEDULE DOMAIN  │          │
│  │                  │    │                  │    │                  │          │
│  │  teams           │    │  tournaments     │    │  matches         │          │
│  │  team_members    │    │  tournament_staff│    │  match_slots     │          │
│  │  team_invitations│    │  prize_positions │    │  match_schedules │          │
│  │  linked_game_accs│    │  tournament_rules│    │                  │          │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘          │
│           │                       │                        │                    │
│           └───────────────────────┼────────────────────────┘                   │
│                                   │                                             │
│  ┌──────────────────┐    ┌────────▼─────────┐    ┌──────────────────┐          │
│  │ REGISTRATION DOM │    │  MATCH OPS DOM   │    │  SCORING DOMAIN  │          │
│  │                  │    │                  │    │                  │          │
│  │  registrations   │    │  room_credentials│    │  match_results   │          │
│  │  registration_   │    │  credential_logs │    │  team_match_     │          │
│  │    rosters       │    │  lobby_events    │    │    results       │          │
│  │  check_ins       │    │  technical_pauses│    │  score_corrections│         │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘          │
│           │                       │                        │                    │
│           └───────────────────────┼────────────────────────┘                   │
│                                   │                                             │
│  ┌──────────────────┐    ┌────────▼─────────┐    ┌──────────────────┐          │
│  │ LEADERBOARD DOM  │    │  BROADCAST DOM   │    │  DISPUTE DOMAIN  │          │
│  │                  │    │                  │    │                  │          │
│  │  leaderboard_    │    │  stream_configs  │    │  disputes        │          │
│  │    entries       │    │  overlay_configs │    │  dispute_evidence│          │
│  │  leaderboard_    │    │  stream_          │    │  dispute_        │          │
│  │    snapshots     │    │    annotations   │    │    resolutions   │          │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘          │
│           │                       │                        │                    │
│           └───────────────────────┼────────────────────────┘                   │
│                                   │                                             │
│  ┌──────────────────┐    ┌────────▼─────────┐    ┌──────────────────┐          │
│  │   PRIZE DOMAIN   │    │  NOTIF DOMAIN    │    │   AUDIT DOMAIN   │          │
│  │                  │    │                  │    │                  │          │
│  │  prize_payouts   │    │  notifications   │    │  audit_logs      │          │
│  │  payout_details  │    │  notif_templates │    │  audit_log_      │          │
│  │  payment_txns    │    │  notif_deliveries│    │    metadata      │          │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘          │
│                                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                                  │
│  │  SPONSOR DOMAIN  │    │  ANALYTICS DOM   │                                  │
│  │                  │    │                  │                                  │
│  │  sponsors        │    │  tournament_     │                                  │
│  │  sponsor_reps    │    │    analytics     │                                  │
│  │  sponsor_assigns │    │  stream_metrics  │                                  │
│  └──────────────────┘    └──────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART 2: DOMAIN-BY-DOMAIN ER DIAGRAMS

---



---

### ECOSYSTEM SIDE: ⚙️ SHARED FOUNDATION / CORE

---

## DOMAIN 1 — AUTHENTICATION & USER MANAGEMENT
### (Module 1)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  users                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  user_id              UUID          NOT NULL                              │
│     username             VARCHAR(30)   NOT NULL  UNIQUE                      │
│     display_name         VARCHAR(100)  NOT NULL                              │
│     email                VARCHAR(255)  NULL      UNIQUE                      │
│     mobile_number        VARCHAR(20)   NULL      UNIQUE                      │
│     mobile_country_code  VARCHAR(5)    NULL                                  │
│     password_hash        VARCHAR(255)  NULL                                  │
│     avatar_url           VARCHAR(500)  NULL                                  │
│     onboarding_path      ENUM('organizer','player','viewer') NULL            │
│     onboarding_completed BOOLEAN       DEFAULT FALSE                         │
│     is_active            BOOLEAN       DEFAULT TRUE                          │
│     is_suspended         BOOLEAN       DEFAULT FALSE                         │
│     suspension_reason    TEXT          NULL                                  │
│     suspended_at         TIMESTAMPTZ   NULL                                  │
│     suspended_by         UUID          NULL  FK → users.user_id              │
│     platform_role        ENUM('super_admin','user') DEFAULT 'user'           │
│     last_login_at        TIMESTAMPTZ   NULL                                  │
│     created_at           TIMESTAMPTZ   DEFAULT NOW()                         │
│     updated_at           TIMESTAMPTZ   DEFAULT NOW()                         │
└─────────────────────────────────────────────────────────────────────────────┘
         │ 1
         │
         │ has many
         │
    ─────┼──────────────────────────────────────────────
         │                    │                    │
         ▼ N                  ▼ N                  ▼ N

┌─────────────────────┐  ┌──────────────────────┐  ┌─────────────────────────┐
│    user_sessions    │  │   oauth_providers    │  │      user_devices       │
├─────────────────────┤  ├──────────────────────┤  ├─────────────────────────┤
│PK session_id  UUID  │  │PK oauth_id    UUID   │  │PK device_id    UUID     │
│FK user_id     UUID  │  │FK user_id     UUID   │  │FK user_id      UUID     │
│   token_hash  TEXT  │  │   provider    ENUM   │  │   device_token TEXT     │
│   ip_address  INET  │  │   ('google',  │  │   platform     ENUM     │
│   user_agent  TEXT  │  │   'discord')  │  │   ('ios',      │
│   expires_at  TSTZ  │  │   provider_id TEXT   │  │   'android',   │
│   is_revoked  BOOL  │  │   email       TEXT   │  │   'web')       │
│   created_at  TSTZ  │  │   linked_at   TSTZ   │  │   is_active    BOOL     │
└─────────────────────┘  └──────────────────────┘  │   created_at   TSTZ     │
                                                    └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                             otp_verifications                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  otp_id          UUID          NOT NULL                                   │
│     mobile_number   VARCHAR(20)   NOT NULL                                   │
│     otp_hash        VARCHAR(255)  NOT NULL                                   │
│     purpose         ENUM('registration','login','reset') NOT NULL            │
│     attempt_count   INT           DEFAULT 0                                  │
│     is_verified     BOOLEAN       DEFAULT FALSE                              │
│     expires_at      TIMESTAMPTZ   NOT NULL                                   │
│     created_at      TIMESTAMPTZ   DEFAULT NOW()                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---



## DOMAIN 15 — NOTIFICATIONS
### (Module 14)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           notification_templates                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  template_id      UUID         NOT NULL                                   │
│     template_code    VARCHAR(50)  NOT NULL  UNIQUE  (e.g., 'NOTIF_02')      │
│     title_template   VARCHAR(200) NOT NULL                                   │
│     body_template    TEXT         NOT NULL                                   │
│     channels         TEXT[]       NOT NULL  (e.g., ['push','sms','in_app']) │
│     priority         ENUM('low','medium','high','critical')                  │
│     is_active        BOOLEAN      DEFAULT TRUE                               │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                              notifications                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  notification_id   UUID         NOT NULL                                  │
│ FK  template_id       UUID         NULL  → notification_templates            │
│ FK  recipient_user_id UUID         NOT NULL  → users                         │
│ FK  tournament_id     UUID         NULL  → tournaments                       │
│ FK  match_id          UUID         NULL  → matches                           │
│                                                                              │
│     title             VARCHAR(200) NOT NULL                                  │
│     body              TEXT         NOT NULL                                  │
│     action_url        VARCHAR(500) NULL                                      │
│     is_read           BOOLEAN      DEFAULT FALSE                             │
│     read_at           TIMESTAMPTZ  NULL                                      │
│     created_at        TIMESTAMPTZ  DEFAULT NOW()                             │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                          notification_deliveries                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  delivery_id       UUID        NOT NULL                                   │
│ FK  notification_id   UUID        NOT NULL  → notifications                  │
│                                                                              │
│     channel           ENUM('in_app','push','sms','email')                   │
│     status            ENUM('pending','sent','delivered','failed')            │
│     gateway_used      VARCHAR(50) NULL  (e.g., 'msg91','twilio','fcm')      │
│     gateway_message_id VARCHAR(200) NULL                                     │
│     attempt_count     INT         DEFAULT 0                                  │
│     last_attempt_at   TIMESTAMPTZ NULL                                       │
│     delivered_at      TIMESTAMPTZ NULL                                       │
│     failure_reason    TEXT        NULL                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---





---

### ECOSYSTEM SIDE: 1. 👨💼 ADMIN / TOURNAMENT ORGANIZER PANEL

---

## DOMAIN 2 — ORGANIZATION MANAGEMENT
### (Module 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               organizations                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  org_id              UUID          NOT NULL                               │
│ FK  owner_user_id       UUID          NOT NULL  → users.user_id              │
│ FK  plan_id             UUID          NOT NULL  → org_plans.plan_id          │
│     org_name            VARCHAR(100)  NOT NULL                               │
│     org_slug            VARCHAR(100)  NOT NULL  UNIQUE                       │
│     description         TEXT          NULL                                   │
│     logo_url            VARCHAR(500)  NULL                                   │
│     banner_url          VARCHAR(500)  NULL                                   │
│     primary_color       VARCHAR(7)    NULL                                   │
│     secondary_color     VARCHAR(7)    NULL                                   │
│     website_url         VARCHAR(500)  NULL                                   │
│     is_verified         BOOLEAN       DEFAULT FALSE                          │
│     is_active           BOOLEAN       DEFAULT TRUE                           │
│     kyc_status          ENUM('pending','submitted','approved','rejected')    │
│     created_at          TIMESTAMPTZ   DEFAULT NOW()                          │
│     updated_at          TIMESTAMPTZ   DEFAULT NOW()                          │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1                                              │ N
        │                                               │
        ├─────────────────────────────────              │
        │ N                              │ N            │
        ▼                                ▼              ▼

┌─────────────────────────┐   ┌─────────────────────┐  ┌──────────────────────┐
│       org_members       │   │   org_invitations   │  │       org_plans      │
├─────────────────────────┤   ├─────────────────────┤  ├──────────────────────┤
│PK member_id  UUID       │   │PK invite_id  UUID   │  │PK plan_id     UUID   │
│FK org_id     UUID       │   │FK org_id     UUID   │  │   plan_name   VARCHAR │
│FK user_id    UUID       │   │FK invited_by UUID   │  │   plan_code   ENUM   │
│   org_role   ENUM       │   │   email      TEXT   │  │   ('free',    │
│   ('org_owner',         │   │   role       ENUM   │  │   'starter',  │
│    'org_admin',         │   │   token_hash TEXT   │  │   'pro',      │
│    'tournament_director'│   │   status     ENUM   │  │   'elite')    │
│    'referee',           │   │   ('pending',│  │   max_tournaments    │
│    'broadcast_producer')│   │   'accepted',│  │   INT                │
│   is_active  BOOLEAN    │   │   'expired', │  │   max_admins  INT   │
│   joined_at  TSTZ       │   │   'declined')│  │   price_monthly      │
│   created_at TSTZ       │   │   expires_at TSTZ   │  │   NUMERIC(10,2)      │
│                         │   │   created_at TSTZ   │  │   features    JSONB  │
│ UNIQUE(org_id, user_id) │   └─────────────────────┘  └──────────────────────┘
└─────────────────────────┘
```

---



## DOMAIN 3 — GAME CONFIGURATION MANAGEMENT
### (Module 3)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   games                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  game_id          UUID         NOT NULL                                   │
│     game_name        VARCHAR(100) NOT NULL                                   │
│     game_code        VARCHAR(20)  NOT NULL  UNIQUE  (e.g., 'BGMI','VALORANT')│
│     icon_url         VARCHAR(500) NULL                                       │
│     cover_url        VARCHAR(500) NULL                                       │
│     uid_label        VARCHAR(50)  NOT NULL  (e.g., 'Character ID')           │
│     uid_regex        VARCHAR(200) NOT NULL  (regex pattern for validation)   │
│     uid_example      VARCHAR(100) NULL                                       │
│     max_team_size    INT          NOT NULL                                   │
│     min_team_size    INT          NOT NULL                                   │
│     max_substitutes  INT          DEFAULT 0                                  │
│     is_active        BOOLEAN      DEFAULT TRUE                               │
│     created_at       TIMESTAMPTZ  DEFAULT NOW()                              │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        │ has many
        │
   ─────┼──────────────────────────────────────────
        │                            │
        ▼ N                          ▼ N

┌──────────────────────────────┐   ┌──────────────────────────────────────────┐
│      scoring_templates       │   │         linked_game_accounts             │
├──────────────────────────────┤   ├──────────────────────────────────────────┤
│PK template_id    UUID        │   │PK linked_id     UUID                     │
│FK game_id        UUID        │   │FK user_id       UUID  → users            │
│FK org_id         UUID NULL   │   │FK game_id       UUID  → games            │
│   template_name  VARCHAR     │   │   in_game_uid   VARCHAR(100)             │
│   template_code  ENUM        │   │   in_game_name  VARCHAR(100) NULL        │
│   ('bgis_standard',          │   │   is_primary    BOOLEAN  DEFAULT FALSE   │
│    'bmps_classic',           │   │   status        ENUM                     │
│    'community_cup',          │   │   ('pending','verified','failed')        │
│    'kill_heavy',             │   │   verified_at   TIMESTAMPTZ NULL         │
│    'custom')                 │   │   created_at    TIMESTAMPTZ              │
│   kill_cap       INT NULL    │   │                                          │
│   kill_pts_each  NUMERIC     │   │ UNIQUE(user_id, game_id, in_game_uid)   │
│   tiebreaker_seq JSONB       │   └──────────────────────────────────────────┘
│   is_system_tmpl BOOLEAN     │
│   created_at     TSTZ        │
└──────────────────────────────┘
        │ 1
        │
        ▼ N
┌──────────────────────────────────────────────────────────────────────────────┐
│                            placement_points                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  pp_id          UUID    NOT NULL                                           │
│ FK  template_id    UUID    NOT NULL  → scoring_templates.template_id         │
│     placement      INT     NOT NULL  (1 = 1st place, 2 = 2nd, etc.)         │
│     points         NUMERIC(6,2) NOT NULL                                     │
│                                                                              │
│  UNIQUE(template_id, placement)                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---



## DOMAIN 5 — TOURNAMENT MANAGEMENT
### (Module 5)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                tournaments                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  tournament_id       UUID          NOT NULL                               │
│ FK  org_id              UUID          NOT NULL  → organizations.org_id       │
│ FK  game_id             UUID          NOT NULL  → games.game_id              │
│ FK  scoring_template_id UUID          NOT NULL  → scoring_templates          │
│ FK  created_by          UUID          NOT NULL  → users.user_id              │
│                                                                              │
│     -- Basic Info                                                            │
│     name                VARCHAR(200)  NOT NULL                               │
│     slug                VARCHAR(200)  NOT NULL  UNIQUE                       │
│     short_description   VARCHAR(500)  NULL                                   │
│     banner_url          VARCHAR(500)  NULL                                   │
│     rules_text          TEXT          NULL                                   │
│     rulebook_url        VARCHAR(500)  NULL                                   │
│                                                                              │
│     -- Format                                                                │
│     format_type         ENUM('league','group_stage_finals','multi_day')      │
│     teams_per_match     INT           NOT NULL                               │
│     total_team_slots    INT           NOT NULL                               │
│     total_rounds        INT           NOT NULL                               │
│                                                                              │
│     -- Dates                                                                 │
│     start_date          DATE          NOT NULL                               │
│     end_date            DATE          NOT NULL                               │
│     registration_open   TIMESTAMPTZ   NOT NULL                               │
│     registration_close  TIMESTAMPTZ   NOT NULL                               │
│                                                                              │
│     -- Registration Settings                                                 │
│     entry_fee           NUMERIC(10,2) DEFAULT 0                              │
│     min_team_size       INT           NOT NULL                               │
│     max_team_size       INT           NOT NULL                               │
│     max_substitutes     INT           DEFAULT 0                              │
│     approval_mode       ENUM('auto','manual','invite_only')                  │
│     waitlist_enabled    BOOLEAN       DEFAULT FALSE                          │
│     checkin_required    BOOLEAN       DEFAULT TRUE                           │
│     checkin_open_mins   INT           NULL  (minutes before match)           │
│     checkin_close_mins  INT           NULL                                   │
│                                                                              │
│     -- Prize                                                                 │
│     prize_pool_total    NUMERIC(12,2) DEFAULT 0                              │
│     prize_currency      VARCHAR(3)    DEFAULT 'INR'                          │
│     prize_funded_by     ENUM('entry_fees','sponsor','org') DEFAULT 'entry_fees'│
│                                                                              │
│     -- Status                                                                │
│     status              ENUM(                                                │
│                           'draft',                                           │
│                           'scheduled',                                       │
│                           'registration_open',                               │
│                           'registration_closed',                             │
│                           'check_in',                                        │
│                           'live',                                            │
│                           'completed',                                       │
│                           'cancelled'                                        │
│                         ) DEFAULT 'draft'                                    │
│     published_at        TIMESTAMPTZ   NULL                                   │
│     completed_at        TIMESTAMPTZ   NULL                                   │
│                                                                              │
│     -- Broadcast                                                             │
│     stream_url          VARCHAR(500)  NULL                                   │
│     stream_platform     ENUM('youtube','twitch','custom') NULL               │
│                                                                              │
│     created_at          TIMESTAMPTZ   DEFAULT NOW()                          │
│     updated_at          TIMESTAMPTZ   DEFAULT NOW()                          │
└─────────────────────────────────────────────────────────────────────────────┘
         │ 1
         │
    ─────┼────────────────────────────────────────────────────────
         │              │               │              │
         ▼ N            ▼ N             ▼ N            ▼ N

┌────────────────────┐ ┌───────────────────┐ ┌────────────────────────────────┐
│  tournament_staff  │ │  prize_positions  │ │      tournament_messages       │
├────────────────────┤ ├───────────────────┤ ├────────────────────────────────┤
│PK staff_id  UUID   │ │PK pos_id   UUID   │ │PK  msg_id        UUID          │
│FK tourney_id UUID  │ │FK tourney_id UUID │ │FK  tournament_id UUID          │
│FK user_id   UUID   │ │   position  INT   │ │FK  created_by    UUID          │
│   staff_role ENUM  │ │   label     TEXT  │ │    message_type  ENUM          │
│   ('tournament_dir'│ │   amount    NUMERIC│ │    ('announcement',           │
│    'referee',      │ │   percentage DECIMAL│ │     'pre_tournament',        │
│    'broadcast_prod'│ │   created_at TSTZ │ │     'match_day')              │
│   is_active BOOL   │ │                   │ │    title         VARCHAR(200)  │
│   assigned_at TSTZ │ │UNIQUE(tourney_id, │ │    body          TEXT          │
│                    │ │       position)   │ │    sent_at       TSTZ NULL     │
│UNIQUE(tourney_id,  │ └───────────────────┘ │    created_at    TSTZ          │
│       user_id,     │                       └────────────────────────────────┘
│       staff_role)  │
└────────────────────┘
```

---



## DOMAIN 7 — MATCH SCHEDULING & SLOT MANAGEMENT
### (Module 7)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  matches                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  match_id           UUID          NOT NULL                                │
│ FK  tournament_id      UUID          NOT NULL  → tournaments                 │
│ FK  assigned_referee   UUID          NULL      → users                       │
│                                                                              │
│     match_number       INT           NOT NULL                                │
│     round_number       INT           NOT NULL                                │
│     match_label        VARCHAR(100)  NULL  (e.g., "Grand Finale - Match 1") │
│     scheduled_start    TIMESTAMPTZ   NOT NULL                                │
│     actual_start       TIMESTAMPTZ   NULL                                    │
│     actual_end         TIMESTAMPTZ   NULL                                    │
│                                                                              │
│     status             ENUM(                                                 │
│                           'scheduled',                                       │
│                           'lobby_open',                                      │
│                           'in_progress',                                     │
│                           'paused',                                          │
│                           'result_submitted',                                │
│                           'pending_verification',                            │
│                           'completed',                                       │
│                           'voided',                                          │
│                           'rescheduled'                                      │
│                         ) DEFAULT 'scheduled'                                │
│                                                                              │
│     void_reason        TEXT          NULL                                    │
│     voided_by          UUID          NULL  → users                           │
│     voided_at          TIMESTAMPTZ   NULL                                    │
│                                                                              │
│     created_at         TIMESTAMPTZ   DEFAULT NOW()                           │
│     updated_at         TIMESTAMPTZ   DEFAULT NOW()                           │
│                                                                              │
│  UNIQUE(tournament_id, match_number)                                         │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                               match_slots                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  slot_id          UUID  NOT NULL                                          │
│ FK  match_id         UUID  NOT NULL  → matches                               │
│ FK  registration_id  UUID  NULL      → registrations  (NULL = bye/TBD)       │
│ FK  team_id          UUID  NULL      → teams                                 │
│                                                                              │
│     slot_number      INT   NOT NULL                                          │
│     is_bye           BOOLEAN  DEFAULT FALSE                                  │
│     no_show          BOOLEAN  DEFAULT FALSE                                  │
│     no_show_at       TIMESTAMPTZ  NULL                                       │
│                                                                              │
│  UNIQUE(match_id, slot_number)                                               │
│  UNIQUE(match_id, registration_id)  -- team can be in match only once        │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                            technical_pauses                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  pause_id        UUID          NOT NULL                                   │
│ FK  match_id        UUID          NOT NULL  → matches                        │
│ FK  declared_by     UUID          NOT NULL  → users (referee)                │
│ FK  resolved_by     UUID          NULL      → users                          │
│                                                                              │
│     reason          ENUM(                                                    │
│                       'game_crash',                                          │
│                       'unauthorized_player',                                 │
│                       'network_issue',                                       │
│                       'observer_issue',                                      │
│                       'other'                                                │
│                     )                                                        │
│     reason_notes    TEXT          NULL                                       │
│     paused_at       TIMESTAMPTZ   NOT NULL                                   │
│     est_resume_at   TIMESTAMPTZ   NULL                                       │
│     resumed_at      TIMESTAMPTZ   NULL                                       │
│     resolution      ENUM('resumed','voided')  NULL                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---



## DOMAIN 9 — MATCH RESULTS & SCORING
### (Modules 9 & 10)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               match_results                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  result_id        UUID         NOT NULL                                   │
│ FK  match_id         UUID         NOT NULL  UNIQUE  → matches                │
│ FK  submitted_by     UUID         NOT NULL  → users (referee)                │
│ FK  verified_by      UUID         NULL      → users (director)               │
│                                                                              │
│     submission_status  ENUM(                                                 │
│                           'submitted',                                       │
│                           'pending_verification',                            │
│                           'published',                                       │
│                           'correction_in_progress'                           │
│                         )                                                    │
│     screenshot_url   VARCHAR(500)  NULL                                      │
│     has_anomaly_flag BOOLEAN       DEFAULT FALSE                             │
│     anomaly_details  TEXT          NULL                                      │
│     submitted_at     TIMESTAMPTZ   NOT NULL                                  │
│     verified_at      TIMESTAMPTZ   NULL                                      │
│     published_at     TIMESTAMPTZ   NULL                                      │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                           team_match_results                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  tmr_id           UUID          NOT NULL                                  │
│ FK  result_id        UUID          NOT NULL  → match_results                 │
│ FK  match_id         UUID          NOT NULL  → matches                       │
│ FK  registration_id  UUID          NOT NULL  → registrations                 │
│ FK  team_id          UUID          NOT NULL  → teams                         │
│                                                                              │
│     placement        INT           NOT NULL                                  │
│     raw_kills        INT           NOT NULL  DEFAULT 0                       │
│     effective_kills  INT           NOT NULL  DEFAULT 0  (after kill cap)     │
│     kill_points      NUMERIC(8,2)  NOT NULL  DEFAULT 0                       │
│     placement_points NUMERIC(8,2)  NOT NULL  DEFAULT 0                       │
│     total_points     NUMERIC(8,2)  NOT NULL  DEFAULT 0                       │
│     is_chicken_dinner BOOLEAN      DEFAULT FALSE                             │
│     is_disqualified  BOOLEAN       DEFAULT FALSE                             │
│     dq_reason        TEXT          NULL                                      │
│                                                                              │
│  UNIQUE(result_id, registration_id)                                          │
│  UNIQUE(result_id, placement)  -- no two teams same placement                │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                            score_corrections                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  correction_id     UUID          NOT NULL                                 │
│ FK  tmr_id            UUID          NOT NULL  → team_match_results           │
│ FK  dispute_id        UUID          NULL      → disputes                     │
│ FK  corrected_by      UUID          NOT NULL  → users (director)             │
│                                                                              │
│     field_corrected   ENUM('placement','raw_kills','is_disqualified')        │
│     old_value         VARCHAR(50)   NOT NULL                                 │
│     new_value         VARCHAR(50)   NOT NULL                                 │
│     correction_reason TEXT          NOT NULL                                 │
│     created_at        TIMESTAMPTZ   DEFAULT NOW()                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---



## DOMAIN 10 — DISQUALIFICATIONS
### (Module 9)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            disqualifications                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  dq_id              UUID         NOT NULL                                 │
│ FK  tournament_id      UUID         NOT NULL  → tournaments                  │
│ FK  registration_id    UUID         NOT NULL  → registrations                │
│ FK  match_id           UUID         NULL      → matches  (match-level DQ)    │
│ FK  recommended_by     UUID         NULL      → users  (referee who flagged) │
│ FK  confirmed_by       UUID         NULL      → users  (director who confirmed)│
│                                                                              │
│     dq_scope           ENUM('match','tournament')  NOT NULL                  │
│     reason             TEXT          NOT NULL                                │
│     evidence_url       VARCHAR(500)  NULL                                    │
│     status             ENUM('recommended','confirmed','overturned')          │
│     recommended_at     TIMESTAMPTZ   NULL                                    │
│     confirmed_at       TIMESTAMPTZ   NULL                                    │
│     created_at         TIMESTAMPTZ   DEFAULT NOW()                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---



## DOMAIN 13 — DISPUTE RESOLUTION
### (Module 20)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 disputes                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  dispute_id         UUID         NOT NULL                                 │
│ FK  tournament_id      UUID         NOT NULL  → tournaments                  │
│ FK  match_id           UUID         NOT NULL  → matches                      │
│ FK  registration_id    UUID         NOT NULL  → registrations (disputing team)│
│ FK  submitted_by       UUID         NOT NULL  → users (team captain)         │
│ FK  assigned_to        UUID         NULL      → users (director/admin)       │
│                                                                              │
│     reference_number   VARCHAR(50)  NOT NULL  UNIQUE  (e.g., DSP-BGMI-0042) │
│     dispute_type       ENUM(                                                 │
│                           'incorrect_kill_count',                            │
│                           'incorrect_placement',                             │
│                           'unauthorized_player',                             │
│                           'technical_issue',                                 │
│                           'other'                                            │
│                         )                                                    │
│     description        TEXT         NOT NULL                                 │
│     claimed_kills      INT          NULL  (what team says they had)          │
│     claimed_placement  INT          NULL                                     │
│                                                                              │
│     priority           ENUM('low','medium','high','critical') DEFAULT 'medium'│
│     affects_standings  BOOLEAN      DEFAULT FALSE                            │
│     standing_impact_pts NUMERIC(6,2) NULL                                   │
│                                                                              │
│     status             ENUM(                                                 │
│                           'open',                                            │
│                           'under_review',                                    │
│                           'resolved_upheld',                                 │
│                           'resolved_denied',                                 │
│                           'escalated',                                       │
│                           'closed'                                           │
│                         ) DEFAULT 'open'                                     │
│     window_closes_at   TIMESTAMPTZ  NOT NULL                                 │
│     resolved_at        TIMESTAMPTZ  NULL                                     │
│     escalated_at       TIMESTAMPTZ  NULL                                     │
│     created_at         TIMESTAMPTZ  DEFAULT NOW()                            │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
   ─────┼──────────────────────────────
        │                   │
        ▼ N                 ▼ N

┌──────────────────────────┐   ┌──────────────────────────────────────────────┐
│    dispute_evidence      │   │         dispute_resolutions                  │
├──────────────────────────┤   ├──────────────────────────────────────────────┤
│PK  evidence_id   UUID    │   │PK  resolution_id   UUID                      │
│FK  dispute_id    UUID    │   │FK  dispute_id      UUID  → disputes           │
│FK  uploaded_by   UUID    │   │FK  resolved_by     UUID  → users             │
│                          │   │                                              │
│    evidence_type ENUM    │   │    resolution_type ENUM                      │
│    ('screenshot',        │   │    ('upheld','denied','partial')             │
│     'video',             │   │    resolution_note TEXT  NOT NULL            │
│     'text')              │   │    score_corrected BOOLEAN  DEFAULT FALSE    │
│    file_url  VARCHAR(500)│   │    correction_id   UUID NULL → score_        │
│    description TEXT NULL │   │                        corrections           │
│    created_at TSTZ       │   │    is_final        BOOLEAN  DEFAULT FALSE    │
└──────────────────────────┘   │    created_at      TIMESTAMPTZ               │
                                └──────────────────────────────────────────────┘
```

---



## DOMAIN 14 — PRIZE POOL & PAYMENT
### (Module 16)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              prize_payouts                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  payout_id          UUID          NOT NULL                                │
│ FK  tournament_id      UUID          NOT NULL  → tournaments                 │
│ FK  prize_position_id  UUID          NOT NULL  → prize_positions             │
│ FK  registration_id    UUID          NOT NULL  → registrations               │
│ FK  team_id            UUID          NOT NULL  → teams                       │
│ FK  captain_user_id    UUID          NOT NULL  → users                       │
│ FK  initiated_by       UUID          NULL      → users (director)            │
│ FK  payment_txn_id     UUID          NULL      → payment_transactions        │
│                                                                              │
│     position           INT           NOT NULL                                │
│     gross_amount       NUMERIC(12,2) NOT NULL                                │
│     tds_amount         NUMERIC(12,2) DEFAULT 0                               │
│     net_amount         NUMERIC(12,2) NOT NULL                                │
│                                                                              │
│     status             ENUM(                                                 │
│                           'pending',                                         │
│                           'details_submitted',                               │
│                           'queued',                                          │
│                           'processing',                                      │
│                           'completed',                                       │
│                           'failed',                                          │
│                           'expired'                                          │
│                         ) DEFAULT 'pending'                                  │
│                                                                              │
│     details_deadline   TIMESTAMPTZ   NULL                                    │
│     details_submitted_at TIMESTAMPTZ NULL                                    │
│     initiated_at       TIMESTAMPTZ   NULL                                    │
│     completed_at       TIMESTAMPTZ   NULL                                    │
│     created_at         TIMESTAMPTZ   DEFAULT NOW()                           │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ 1 (encrypted)
┌─────────────────────────────────────────────────────────────────────────────┐
│                             payout_details                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  detail_id         UUID          NOT NULL                                 │
│ FK  payout_id         UUID          NOT NULL  UNIQUE  → prize_payouts        │
│ FK  submitted_by      UUID          NOT NULL  → users                        │
│                                                                              │
│     payout_method     ENUM('upi','bank_transfer')  NOT NULL                 │
│                                                                              │
│     -- UPI Fields                                                            │
│     upi_id_enc        BYTEA         NULL  (encrypted)                        │
│     upi_verified      BOOLEAN       DEFAULT FALSE                            │
│     upi_bank_name     VARCHAR(100)  NULL  (from UPI validation - not enc)   │
│                                                                              │
│     -- Bank Fields                                                           │
│     account_num_enc   BYTEA         NULL  (encrypted)                        │
│     ifsc_code         VARCHAR(20)   NULL                                     │
│     account_name      VARCHAR(200)  NULL                                     │
│                                                                              │
│     submitted_at      TIMESTAMPTZ   NOT NULL                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---



## DOMAIN 16 — AUDIT TRAIL
### (Module 20)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               audit_logs                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  log_id           UUID         NOT NULL                                   │
│ FK  actor_user_id    UUID         NULL  → users (NULL = system action)       │
│ FK  org_id           UUID         NULL  → organizations                      │
│ FK  tournament_id    UUID         NULL  → tournaments                        │
│ FK  match_id         UUID         NULL  → matches                            │
│                                                                              │
│     action_code      VARCHAR(100) NOT NULL                                   │
│     -- Examples:                                                             │
│     -- 'registration_submitted', 'credential_released'                       │
│     -- 'result_published', 'dispute_created', 'score_corrected'             │
│     -- 'tournament_status_changed', 'dq_confirmed'                           │
│                                                                              │
│     entity_type      VARCHAR(50)  NULL  (e.g., 'tournament', 'match')       │
│     entity_id        UUID         NULL  (the affected record's ID)           │
│                                                                              │
│     old_value        JSONB        NULL  (state before action)               │
│     new_value        JSONB        NULL  (state after action)                │
│     metadata         JSONB        NULL  (additional context)                │
│                                                                              │
│     ip_address       INET         NULL                                       │
│     user_agent       TEXT         NULL                                       │
│     created_at       TIMESTAMPTZ  DEFAULT NOW()                              │
│                                                                              │
│  -- Append-only table (no UPDATEs or DELETEs allowed)                       │
│  INDEX(tournament_id, created_at)                                            │
│  INDEX(actor_user_id, created_at)                                            │
│  INDEX(action_code, created_at)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---



## DOMAIN 17 — SPONSOR MANAGEMENT
### (Module 19)

```
┌──────────────────────────────────────────┐
│               sponsors                   │
├──────────────────────────────────────────┤
│PK sponsor_id    UUID                     │
│FK org_id        UUID  → organizations    │
│   company_name  VARCHAR(200)             │
│   logo_url      VARCHAR(500) NULL        │
│   website_url   VARCHAR(500) NULL        │
│   is_active     BOOLEAN DEFAULT TRUE     │
│   created_at    TIMESTAMPTZ              │
└──────────────────────────────────────────┘
        │ 1
        │
   ─────┼──────────────────────────
        │               │
        ▼ N             ▼ N

┌────────────────────────┐  ┌─────────────────────────────────────────────────┐
│    sponsor_reps        │  │          sponsor_assignments                    │
├────────────────────────┤  ├─────────────────────────────────────────────────┤
│PK rep_id    UUID       │  │PK  assign_id      UUID                          │
│FK sponsor_id UUID      │  │FK  sponsor_id     UUID  → sponsors              │
│FK user_id   UUID       │  │FK  tournament_id  UUID  → tournaments           │
│   created_at TSTZ      │  │FK  assigned_by    UUID  → users                 │
└────────────────────────┘  │    placement_slots JSONB NULL                   │
                             │    -- overlay positions, banner placements      │
                             │    created_at     TIMESTAMPTZ                   │
                             └─────────────────────────────────────────────────┘
```

---



## DOMAIN 18 — ANALYTICS
### (Module 17)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          tournament_analytics                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  analytics_id      UUID          NOT NULL                                 │
│ FK  tournament_id     UUID          NOT NULL  UNIQUE  → tournaments          │
│                                                                              │
│     total_registered  INT           DEFAULT 0                                │
│     total_approved    INT           DEFAULT 0                                │
│     total_checked_in  INT           DEFAULT 0                                │
│     total_no_shows    INT           DEFAULT 0                                │
│     total_matches     INT           DEFAULT 0                                │
│     total_disputes    INT           DEFAULT 0                                │
│     disputes_upheld   INT           DEFAULT 0                                │
│     total_prize_paid  NUMERIC(12,2) DEFAULT 0                                │
│     entry_fees_collected NUMERIC(12,2) DEFAULT 0                             │
│     peak_viewer_count INT           DEFAULT 0                                │
│     avg_viewer_count  INT           DEFAULT 0                                │
│     total_stream_mins INT           DEFAULT 0                                │
│     updated_at        TIMESTAMPTZ   DEFAULT NOW()                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            stream_metrics                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  metric_id         UUID          NOT NULL                                 │
│ FK  tournament_id     UUID          NOT NULL  → tournaments                  │
│                                                                              │
│     recorded_at       TIMESTAMPTZ   NOT NULL                                 │
│     viewer_count      INT           DEFAULT 0                                │
│     bitrate_kbps      INT           NULL                                     │
│     fps               INT           NULL                                     │
│     dropped_frames_pct NUMERIC(5,2) NULL                                     │
│     cpu_usage_pct     NUMERIC(5,2)  NULL                                     │
│                                                                              │
│  INDEX(tournament_id, recorded_at)                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---





---

### ECOSYSTEM SIDE: 2. 🎮 PLAYER & TEAM PORTAL

---

## DOMAIN 4 — TEAM & PLAYER MANAGEMENT
### (Module 4)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   teams                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  team_id         UUID         NOT NULL                                    │
│ FK  captain_user_id UUID         NOT NULL  → users.user_id                   │
│ FK  game_id         UUID         NOT NULL  → games.game_id                   │
│     team_name       VARCHAR(100) NOT NULL                                    │
│     team_tag        VARCHAR(10)  NOT NULL  (e.g., "HYD")                    │
│     team_slug       VARCHAR(100) NOT NULL  UNIQUE                            │
│     logo_url        VARCHAR(500) NULL                                        │
│     country         VARCHAR(2)   NULL      (ISO 3166-1 alpha-2)              │
│     is_active       BOOLEAN      DEFAULT TRUE                                │
│     total_matches   INT          DEFAULT 0                                   │
│     total_wins      INT          DEFAULT 0                                   │
│     created_at      TIMESTAMPTZ  DEFAULT NOW()                               │
│     updated_at      TIMESTAMPTZ  DEFAULT NOW()                               │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
   ─────┼──────────────────────────────────
        │                        │
        ▼ N                      ▼ N

┌─────────────────────────────┐  ┌─────────────────────────────────────────┐
│        team_members         │  │           team_invitations              │
├─────────────────────────────┤  ├─────────────────────────────────────────┤
│PK member_id     UUID        │  │PK  invite_id     UUID                   │
│FK team_id       UUID        │  │FK  team_id       UUID  → teams          │
│FK user_id       UUID        │  │FK  invited_by    UUID  → users          │
│FK game_id       UUID        │  │    invited_email VARCHAR(255) NULL       │
│   role          ENUM        │  │    invited_user_id UUID NULL → users     │
│   ('captain',               │  │    in_game_uid   VARCHAR(100) NULL       │
│    'player',                │  │    role          ENUM                    │
│    'substitute')            │  │    ('player','substitute')               │
│   in_game_uid   VARCHAR(100)│  │    status        ENUM                    │
│   in_game_name  VARCHAR(100)│  │    ('pending','accepted',               │
│   is_active     BOOLEAN     │  │     'declined','expired')               │
│   joined_at     TSTZ        │  │    token_hash    VARCHAR(255)           │
│   left_at       TSTZ NULL   │  │    expires_at    TIMESTAMPTZ            │
│                             │  │    created_at    TIMESTAMPTZ            │
│ UNIQUE(team_id, user_id)    │  └─────────────────────────────────────────┘
└─────────────────────────────┘
```

---



## DOMAIN 6 — REGISTRATION & VERIFICATION
### (Module 6)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               registrations                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  registration_id     UUID          NOT NULL                               │
│ FK  tournament_id       UUID          NOT NULL  → tournaments                │
│ FK  team_id             UUID          NOT NULL  → teams                      │
│ FK  captain_user_id     UUID          NOT NULL  → users                      │
│                                                                              │
│     reference_number    VARCHAR(50)   NOT NULL  UNIQUE  (e.g., GV-BGMI-004821)│
│     status              ENUM(                                                │
│                           'draft',                                           │
│                           'submitted',                                       │
│                           'under_review',                                    │
│                           'correction_requested',                            │
│                           'correction_submitted',                            │
│                           'approved',                                        │
│                           'rejected',                                        │
│                           'waitlisted',                                      │
│                           'withdrawn'                                        │
│                         ) DEFAULT 'draft'                                    │
│                                                                              │
│     entry_fee_paid      NUMERIC(10,2) DEFAULT 0                              │
│     payment_status      ENUM('not_required','pending','paid','refunded')     │
│     payment_txn_id      UUID          NULL  → payment_transactions           │
│                                                                              │
│     rules_agreed        BOOLEAN       DEFAULT FALSE                          │
│     rules_agreed_at     TIMESTAMPTZ   NULL                                   │
│     rules_agreed_ip     INET          NULL                                   │
│                                                                              │
│     flag_score          ENUM('green','yellow','red') DEFAULT 'green'         │
│     rejection_reason    TEXT          NULL                                   │
│     correction_notes    TEXT          NULL                                   │
│     correction_deadline TIMESTAMPTZ   NULL                                   │
│                                                                              │
│     slot_number         INT           NULL  (assigned after approval)        │
│     approved_by         UUID          NULL  → users                          │
│     approved_at         TIMESTAMPTZ   NULL                                   │
│                                                                              │
│     created_at          TIMESTAMPTZ   DEFAULT NOW()                          │
│     updated_at          TIMESTAMPTZ   DEFAULT NOW()                          │
│                                                                              │
│  UNIQUE(tournament_id, team_id)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                            registration_rosters                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  roster_id        UUID          NOT NULL                                  │
│ FK  registration_id  UUID          NOT NULL  → registrations                 │
│ FK  user_id          UUID          NOT NULL  → users                         │
│ FK  team_member_id   UUID          NULL      → team_members                  │
│                                                                              │
│     player_role      ENUM('player','substitute')  NOT NULL                   │
│     in_game_uid      VARCHAR(100)  NOT NULL                                  │
│     in_game_name     VARCHAR(100)  NULL                                      │
│     is_active        BOOLEAN       DEFAULT TRUE                              │
│     activated_at     TIMESTAMPTZ   NULL  (when substitute activated)         │
│     activated_by     UUID          NULL  → users (captain who activated)     │
│                                                                              │
│  UNIQUE(registration_id, user_id)                                            │
│  UNIQUE(registration_id, in_game_uid)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
        │                              │
        │                              │
        ▼                              ▼
┌─────────────────────────────┐  ┌────────────────────────────────────────────┐
│         check_ins           │  │           payment_transactions             │
├─────────────────────────────┤  ├────────────────────────────────────────────┤
│PK checkin_id    UUID        │  │PK  txn_id           UUID                   │
│FK registration_id UUID      │  │FK  registration_id  UUID NULL → registrations│
│FK tournament_id  UUID       │  │FK  user_id          UUID     → users        │
│FK checked_in_by UUID        │  │                                            │
│   checkin_type ENUM         │  │    gateway          VARCHAR(50)            │
│   ('self','manual')         │  │    gateway_order_id VARCHAR(200) UNIQUE     │
│   checkin_at  TSTZ          │  │    gateway_txn_id   VARCHAR(200) NULL       │
│   ip_address  INET NULL     │  │    amount           NUMERIC(10,2)          │
└─────────────────────────────┘  │    currency         VARCHAR(3)             │
                                  │    status           ENUM                   │
                                  │    ('pending','captured',                  │
                                  │     'failed','refunded')                   │
                                  │    payment_method   VARCHAR(50) NULL       │
                                  │    captured_at      TIMESTAMPTZ NULL       │
                                  │    refunded_at      TIMESTAMPTZ NULL       │
                                  │    refund_id        VARCHAR(200) NULL      │
                                  │    metadata         JSONB NULL             │
                                  │    created_at       TIMESTAMPTZ            │
                                  └────────────────────────────────────────────┘
```

---



## DOMAIN 8 — SECURE ROOM CREDENTIAL MANAGEMENT
### (Module 8)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             room_credentials                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  credential_id    UUID          NOT NULL                                  │
│ FK  match_id         UUID          NOT NULL  → matches                       │
│ FK  entered_by       UUID          NOT NULL  → users (referee)               │
│ FK  released_by      UUID          NULL      → users                         │
│ FK  rotated_from     UUID          NULL      → room_credentials (prev cred)  │
│                                                                              │
│     room_id_encrypted    BYTEA     NOT NULL  (AES-256 encrypted)             │
│     password_encrypted   BYTEA     NOT NULL  (AES-256 encrypted)             │
│     encryption_key_ref   VARCHAR(100) NOT NULL  (key ID in key management)   │
│                                                                              │
│     release_mode     ENUM('instant','timed','manual')  NOT NULL              │
│     scheduled_release_at  TIMESTAMPTZ  NULL  (for timed mode)               │
│     released_at      TIMESTAMPTZ   NULL                                      │
│     expires_at       TIMESTAMPTZ   NULL                                      │
│                                                                              │
│     is_active        BOOLEAN       DEFAULT TRUE                              │
│     is_revoked       BOOLEAN       DEFAULT FALSE                             │
│     revoked_at       TIMESTAMPTZ   NULL                                      │
│     revoke_reason    VARCHAR(200)  NULL                                      │
│                                                                              │
│     entry_hash       VARCHAR(255)  NOT NULL  (hash of Room ID + Password)    │
│     created_at       TIMESTAMPTZ   DEFAULT NOW()                             │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                             credential_logs                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  log_id          UUID         NOT NULL                                    │
│ FK  credential_id   UUID         NOT NULL  → room_credentials                │
│ FK  user_id         UUID         NOT NULL  → users                           │
│ FK  match_id        UUID         NOT NULL  → matches                         │
│                                                                              │
│     action          ENUM(                                                    │
│                       'entered',     -- referee saved creds                  │
│                       'released',    -- system/referee released              │
│                       'viewed',      -- player/captain viewed                │
│                       'rotated',     -- creds rotated for security           │
│                       'revoked',     -- creds revoked                        │
│                       'acknowledged' -- player confirmed receipt             │
│                     )                                                        │
│     ip_address      INET         NULL                                        │
│     user_agent      TEXT         NULL                                        │
│     device_id       UUID         NULL  → user_devices                        │
│     created_at      TIMESTAMPTZ  DEFAULT NOW()                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---





---

### ECOSYSTEM SIDE: 3. 📺 PUBLIC LIVE TOURNAMENT WEBSITE

---

## DOMAIN 11 — LEADERBOARD ENGINE
### (Module 11)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            leaderboard_entries                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  entry_id           UUID          NOT NULL                                │
│ FK  tournament_id      UUID          NOT NULL  → tournaments                 │
│ FK  registration_id    UUID          NOT NULL  → registrations               │
│ FK  team_id            UUID          NOT NULL  → teams                       │
│                                                                              │
│     current_rank       INT           NOT NULL                                │
│     previous_rank      INT           NULL  (rank before last update)         │
│     rank_change        INT           NULL  (+ = moved up, - = moved down)   │
│                                                                              │
│     total_points       NUMERIC(10,2) NOT NULL  DEFAULT 0                     │
│     total_kills        INT           NOT NULL  DEFAULT 0                     │
│     total_matches      INT           NOT NULL  DEFAULT 0                     │
│     chicken_dinners    INT           NOT NULL  DEFAULT 0                     │
│     avg_placement      NUMERIC(5,2)  NULL                                    │
│     highest_kill_game  INT           DEFAULT 0                               │
│                                                                              │
│     is_eliminated      BOOLEAN       DEFAULT FALSE                           │
│     last_updated_at    TIMESTAMPTZ   DEFAULT NOW()                           │
│                                                                              │
│  UNIQUE(tournament_id, registration_id)                                      │
│  INDEX(tournament_id, current_rank)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │ triggers when match published
        │
        ▼ N
┌─────────────────────────────────────────────────────────────────────────────┐
│                          leaderboard_snapshots                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  snapshot_id        UUID          NOT NULL                                │
│ FK  tournament_id      UUID          NOT NULL  → tournaments                 │
│ FK  triggered_by_match UUID          NULL      → matches                     │
│                                                                              │
│     snapshot_data      JSONB         NOT NULL  (full ranked list at moment)  │
│     snapshot_at        TIMESTAMPTZ   NOT NULL  DEFAULT NOW()                 │
│     round_number       INT           NULL                                    │
│     match_number       INT           NULL                                    │
│                                                                              │
│  INDEX(tournament_id, snapshot_at)                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---





---

### ECOSYSTEM SIDE: 4. 🎥 PRODUCTION & STREAM CONTROL PANEL

---

## DOMAIN 12 — BROADCAST & STREAMING
### (Modules 12 & 13)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             stream_configs                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  config_id          UUID         NOT NULL                                 │
│ FK  tournament_id      UUID         NOT NULL  UNIQUE  → tournaments          │
│ FK  configured_by      UUID         NOT NULL  → users (broadcast producer)   │
│                                                                              │
│     platform           ENUM('youtube','twitch','custom')  NOT NULL           │
│     channel_id         VARCHAR(200)  NULL                                    │
│     stream_url         VARCHAR(500)  NULL                                    │
│     stream_key_enc     BYTEA         NULL  (encrypted)                       │
│     rtmp_url           VARCHAR(500)  NULL                                    │
│                                                                              │
│     obs_ws_url         VARCHAR(200)  NULL  (e.g., ws://localhost:4455)       │
│     obs_ws_pass_enc    BYTEA         NULL                                    │
│     obs_connected      BOOLEAN       DEFAULT FALSE                           │
│     obs_scenes         JSONB         NULL  (list of detected OBS scenes)     │
│                                                                              │
│     is_live            BOOLEAN       DEFAULT FALSE                           │
│     stream_started_at  TIMESTAMPTZ   NULL                                    │
│     stream_ended_at    TIMESTAMPTZ   NULL                                    │
│     created_at         TIMESTAMPTZ   DEFAULT NOW()                           │
│     updated_at         TIMESTAMPTZ   DEFAULT NOW()                           │
└─────────────────────────────────────────────────────────────────────────────┘
        │ 1
        │
   ─────┼────────────────────────────────
        │                    │
        ▼ N                  ▼ N

┌────────────────────────────┐  ┌──────────────────────────────────────────────┐
│     overlay_configs        │  │          stream_annotations                  │
├────────────────────────────┤  ├──────────────────────────────────────────────┤
│PK overlay_id  UUID         │  │PK  annotation_id   UUID                      │
│FK tournament_id UUID       │  │FK  tournament_id   UUID  → tournaments        │
│FK config_id   UUID         │  │FK  created_by      UUID  → users             │
│   overlay_type ENUM        │  │                                              │
│   ('leaderboard_full',     │  │    label           ENUM                      │
│    'top10',                │  │    ('match_start','match_end',               │
│    'match_info_bar',       │  │     'chicken_dinner','custom')               │
│    'sponsor_banner',       │  │    custom_label    VARCHAR(100) NULL         │
│    'result_splash',        │  │    stream_timestamp INTERVAL NULL            │
│    'grand_finale')         │  │    created_at      TIMESTAMPTZ               │
│   overlay_url  TEXT        │  └──────────────────────────────────────────────┘
│   token        UUID        │
│   is_visible   BOOLEAN     │  ┌──────────────────────────────────────────────┐
│   position_cfg JSONB NULL  │  │           match_vod_links                    │
│   style_cfg    JSONB NULL  │  ├──────────────────────────────────────────────┤
│   is_active    BOOLEAN     │  │PK  vod_id        UUID                        │
│   created_at   TSTZ        │  │FK  match_id      UUID  → matches             │
│   updated_at   TSTZ        │  │FK  linked_by     UUID  → users               │
└────────────────────────────┘  │    vod_url       VARCHAR(500)                │
                                 │    start_offset  INTERVAL NULL               │
                                 │    platform      ENUM                        │
                                 │    created_at    TIMESTAMPTZ                 │
                                 └──────────────────────────────────────────────┘
```

---



# PART 3: COMPLETE RELATIONSHIP MAP

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                         GAMEVERSE — COMPLETE RELATIONSHIP MAP                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  users ──────────────────────────────────────────────────────────────────────────────   │
│    │                                                                                      │
│    ├──[1:N]──► user_sessions            (one user → many sessions)                      │
│    ├──[1:N]──► oauth_providers          (one user → many OAuth links)                   │
│    ├──[1:N]──► user_devices             (one user → many devices)                       │
│    ├──[1:N]──► linked_game_accounts     (one user → many game UIDs)                     │
│    │                                                                                      │
│    ├──[1:N]──► organizations            (user as owner)                                  │
│    ├──[1:N]──► org_members              (user holds many org roles)                      │
│    ├──[1:N]──► teams                    (user as captain)                                │
│    ├──[1:N]──► team_members             (user in many teams)                             │
│    │                                                                                      │
│    ├──[1:N]──► registrations            (as captain)                                     │
│    ├──[1:N]──► registration_rosters     (as player/sub in rosters)                       │
│    ├──[1:N]──► check_ins                (checked in self or others)                      │
│    │                                                                                      │
│    ├──[1:N]──► match_results            (submitted_by referee)                           │
│    ├──[1:N]──► room_credentials         (entered_by referee)                             │
│    ├──[1:N]──► credential_logs          (all credential events)                          │
│    │                                                                                      │
│    ├──[1:N]──► disputes                 (submitted_by captain)                           │
│    ├──[1:N]──► dispute_resolutions      (resolved_by director)                           │
│    ├──[1:N]──► score_corrections        (corrected_by director)                          │
│    │                                                                                      │
│    ├──[1:N]──► prize_payouts            (as captain/winner)                              │
│    ├──[1:N]──► payout_details           (submitted payment details)                      │
│    │                                                                                      │
│    └──[1:N]──► audit_logs              (all platform actions)                            │
│                                                                                           │
│  organizations                                                                            │
│    ├──[1:N]──► org_members              (org has many members)                           │
│    ├──[1:N]──► org_invitations          (org has many pending invites)                   │
│    ├──[1:N]──► tournaments              (org runs many tournaments)                       │
│    └──[1:N]──► sponsors                 (org has many sponsors)                          │
│                                                                                           │
│  org_plans ──[1:N]──► organizations     (plan applied to many orgs)                      │
│                                                                                           │
│  games                                                                                    │
│    ├──[1:N]──► scoring_templates        (game has many scoring templates)                │
│    ├──[1:N]──► linked_game_accounts     (game has many linked UIDs)                      │
│    ├──[1:N]──► teams                    (game has many teams)                            │
│    └──[1:N]──► tournaments              (game has many tournaments)                       │
│                                                                                           │
│  scoring_templates ──[1:N]──► placement_points   (template has N placements)             │
│                                                                                           │
│  tournaments                                                                              │
│    ├──[1:N]──► tournament_staff         (tournament has many staff)                      │
│    ├──[1:N]──► prize_positions          (tournament has many prize tiers)                │
│    ├──[1:N]──► tournament_messages      (tournament has many announcements)              │
│    ├──[1:N]──► registrations            (tournament has many team registrations)         │
│    ├──[1:N]──► matches                  (tournament has many matches)                    │
│    ├──[1:N]──► leaderboard_entries      (tournament has one entry per team)              │
│    ├──[1:N]──► leaderboard_snapshots    (tournament has many historical snapshots)       │
│    ├──[1:1]──► stream_configs           (tournament has one stream config)               │
│    ├──[1:N]──► overlay_configs          (tournament has many overlays)                   │
│    ├──[1:N]──► stream_annotations       (tournament has many stream moments)             │
│    ├──[1:N]──► disputes                 (tournament has many disputes)                   │
│    ├──[1:N]──► disqualifications        (tournament has many DQs)                        │
│    ├──[1:N]──► prize_payouts            (tournament has N prize payouts)                 │
│    ├──[1:N]──► notifications            (tournament triggers many notifications)         │
│    ├──[1:N]──► audit_logs              (tournament has full audit history)              │
│    ├──[1:N]──► sponsor_assignments      (tournament has many sponsors)                   │
│    ├──[1:1]──► tournament_analytics     (tournament has one analytics record)            │
│    └──[1:N]──► stream_metrics           (tournament has many metric snapshots)           │
│                                                                                           │
│  teams                                                                                    │
│    ├──[1:N]──► team_members             (team has many members)                          │
│    ├──[1:N]──► team_invitations         (team has many pending invitations)              │
│    └──[1:N]──► registrations            (team can register in many tournaments)          │
│                                                                                           │
│  registrations                                                                            │
│    ├──[1:N]──► registration_rosters     (registration has many players)                  │
│    ├──[1:1]──► check_ins                (registration has one check-in)                  │
│    ├──[1:N]──► match_slots              (registration appears in many match slots)       │
│    ├──[1:N]──► team_match_results       (registration has results per match)             │
│    ├──[1:N]──► disputes                 (registration can raise disputes)                │
│    ├──[1:N]──► disqualifications        (registration can be disqualified)               │
│    ├──[1:1]──► leaderboard_entries      (registration has one leaderboard entry)         │
│    └──[1:1]──► prize_payouts            (registration can win one prize)                 │
│                                                                                           │
│  matches                                                                                  │
│    ├──[1:N]──► match_slots              (match has N team slots)                         │
│    ├──[1:N]──► technical_pauses         (match can have pauses)                          │
│    ├──[1:1]──► room_credentials         (match has one active credential set)            │
│    ├──[1:N]──► credential_logs          (match has credential access logs)               │
│    ├──[1:1]──► match_results            (match has one result)                           │
│    ├──[1:N]──► disputes                 (match can have disputes)                        │
│    └──[1:N]──► match_vod_links          (match can have VODs linked)                     │
│                                                                                           │
│  match_results ──[1:N]──► team_match_results  (result has one row per team)              │
│  team_match_results ──[1:N]──► score_corrections (result row can be corrected)           │
│                                                                                           │
│  prize_positions ──[1:1]──► prize_payouts      (position maps to one payout)             │
│  prize_payouts   ──[1:1]──► payout_details     (payout has one payment detail)           │
│                                                                                           │
│  disputes ──[1:N]──► dispute_evidence          (dispute has evidence files)              │
│  disputes ──[1:1]──► dispute_resolutions       (dispute has one resolution)              │
│                                                                                           │
│  notifications ──[1:N]──► notification_deliveries (notification sent via N channels)    │
│                                                                                           │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART 4: KEY INDEXES & CONSTRAINTS

```sql
-- ══════════════════════════════════════════
-- CRITICAL UNIQUE CONSTRAINTS
-- ══════════════════════════════════════════

-- One registration per team per tournament
ALTER TABLE registrations
  ADD CONSTRAINT uq_registration_team_tournament
  UNIQUE (tournament_id, team_id);

-- One result per match
ALTER TABLE match_results
  ADD CONSTRAINT uq_result_per_match
  UNIQUE (match_id);

-- No duplicate placements in a match result
ALTER TABLE team_match_results
  ADD CONSTRAINT uq_placement_per_result
  UNIQUE (result_id, placement);

-- One leaderboard entry per team per tournament
ALTER TABLE leaderboard_entries
  ADD CONSTRAINT uq_leaderboard_entry
  UNIQUE (tournament_id, registration_id);

-- One stream config per tournament
ALTER TABLE stream_configs
  ADD CONSTRAINT uq_stream_config_per_tournament
  UNIQUE (tournament_id);

-- One check-in per registration
ALTER TABLE check_ins
  ADD CONSTRAINT uq_checkin_per_registration
  UNIQUE (registration_id);

-- ══════════════════════════════════════════
-- PERFORMANCE INDEXES
-- ══════════════════════════════════════════

-- Tournament lookups by status
CREATE INDEX idx_tournaments_status
  ON tournaments(status, created_at DESC);

-- Leaderboard ordered by rank
CREATE INDEX idx_leaderboard_rank
  ON leaderboard_entries(tournament_id, current_rank ASC);

-- Match lookup by tournament + status
CREATE INDEX idx_matches_tournament_status
  ON matches(tournament_id, status);

-- Credential logs per match
CREATE INDEX idx_credential_logs_match
  ON credential_logs(match_id, created_at DESC);

-- Notifications per user (unread)
CREATE INDEX idx_notifications_user_unread
  ON notifications(recipient_user_id, is_read, created_at DESC);

-- Disputes by tournament + status
CREATE INDEX idx_disputes_tournament
  ON disputes(tournament_id, status, created_at DESC);

-- Audit log queries
CREATE INDEX idx_audit_tournament
  ON audit_logs(tournament_id, created_at DESC);

CREATE INDEX idx_audit_actor
  ON audit_logs(actor_user_id, created_at DESC);

-- ══════════════════════════════════════════
-- CRITICAL FOREIGN KEY CONSTRAINTS
-- ══════════════════════════════════════════

-- Cascade rules:
-- tournaments → matches → match_slots (CASCADE DELETE for match_slots only)
-- registrations → registration_rosters (CASCADE DELETE)
-- match_results → team_match_results (CASCADE DELETE)
-- disputes → dispute_evidence (CASCADE DELETE)
-- notifications → notification_deliveries (CASCADE DELETE)

-- Restrict rules (prevent orphan data):
-- organizations DELETE restricted if tournaments exist
-- tournaments DELETE restricted if registrations exist
-- registrations DELETE restricted if payments captured
```

---

# PART 5: STATE MACHINE REFERENCE (DB-Level)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              tournaments.status — VALID TRANSITIONS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  draft ──────────────────────────────────────────────► cancelled            │
│    │                                                                         │
│    ▼                                                                         │
│  scheduled ──────────────────────────────────────────► cancelled            │
│    │                                                                         │
│    ▼  (registration_open date/time arrives)                                  │
│  registration_open ──────────────────────────────────► cancelled            │
│    │                                                                         │
│    ▼  (registration_close date/time arrives)                                 │
│  registration_closed ────────────────────────────────► cancelled            │
│    │                                                                         │
│    ▼  (director opens check-in)                                              │
│  check_in ───────────────────────────────────────────► cancelled            │
│    │                                                                         │
│    ▼  (director opens first match)                                           │
│  live ────────────────────────────────────────────────► cancelled            │
│    │                                                                         │
│    ▼  (director completes tournament)                                        │
│  completed  (TERMINAL — no further transitions)                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                matches.status — VALID TRANSITIONS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  scheduled → lobby_open → in_progress → result_submitted                    │
│                                │              │                             │
│                                ▼              ▼                             │
│                             paused    pending_verification                  │
│                                │              │                             │
│                                ▼              ▼                             │
│                           in_progress     published ──► completed           │
│                                │                                            │
│                                ▼                                            │
│                             voided (TERMINAL)                               │
│                                                                              │
│  rescheduled ← voided (if director creates replacement match)               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│              registrations.status — VALID TRANSITIONS                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  draft → submitted → under_review → approved                                │
│                           │    └──► correction_requested                    │
│                           │               │                                 │
│                           │               ▼                                 │
│                           │    correction_submitted → under_review          │
│                           │                                                 │
│                           └──────────────────────────► rejected             │
│                                                                              │
│  submitted → waitlisted → approved (if slot opens)                          │
│  approved → withdrawn (captain withdraws)                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# PART 6: COMPLETE TABLE SUMMARY

| # | Table Name | Domain | Rows (est. per tournament) | Purpose |
|---|-----------|--------|--------------------------|---------|
| 1 | users | Auth | Platform-wide | All user accounts |
| 2 | user_sessions | Auth | Per user | Active login sessions |
| 3 | oauth_providers | Auth | Per user | Google/Discord links |
| 4 | user_devices | Auth | Per user | Push notification tokens |
| 5 | otp_verifications | Auth | Per registration | OTP records |
| 6 | organizations | Org | Platform-wide | Org accounts |
| 7 | org_members | Org | Per org | Org staff roster |
| 8 | org_invitations | Org | Per org | Pending invites |
| 9 | org_plans | Org | 4 rows | Plan definitions |
| 10 | games | Game | ~20 rows | Game catalog |
| 11 | scoring_templates | Game | Per org + system | Scoring configs |
| 12 | placement_points | Game | ~20 per template | Points per rank |
| 13 | linked_game_accounts | Game | Per user | UID links |
| 14 | teams | Team | Platform-wide | Team records |
| 15 | team_members | Team | Per team | Team roster |
| 16 | team_invitations | Team | Per team | Pending invites |
| 17 | tournaments | Tournament | Per org | Tournament records |
| 18 | tournament_staff | Tournament | ~5 per tournament | Assigned staff |
| 19 | prize_positions | Tournament | ~5 per tournament | Prize tiers |
| 20 | tournament_messages | Tournament | ~10 per tournament | Announcements |
| 21 | registrations | Registration | ~64 per tournament | Team registrations |
| 22 | registration_rosters | Registration | ~320 per tournament | Player roster per reg |
| 23 | check_ins | Registration | ~64 per tournament | Check-in records |
| 24 | payment_transactions | Registration | ~64 per tournament | Payment records |
| 25 | matches | Schedule | ~18 per tournament | Match records |
| 26 | match_slots | Schedule | ~288 per tournament | Team per match slots |
| 27 | technical_pauses | Schedule | ~2 per tournament | Pause records |
| 28 | room_credentials | Credentials | ~18 per tournament | Encrypted creds |
| 29 | credential_logs | Credentials | ~400 per tournament | Access audit |
| 30 | match_results | Scoring | ~18 per tournament | Match result headers |
| 31 | team_match_results | Scoring | ~288 per tournament | Per-team result rows |
| 32 | score_corrections | Scoring | ~3 per tournament | Correction history |
| 33 | disqualifications | Scoring | ~1 per tournament | DQ records |
| 34 | leaderboard_entries | Leaderboard | ~64 per tournament | Live standings |
| 35 | leaderboard_snapshots | Leaderboard | ~18 per tournament | Historical snapshots |
| 36 | stream_configs | Broadcast | 1 per tournament | Stream setup |
| 37 | overlay_configs | Broadcast | ~6 per tournament | OBS overlays |
| 38 | stream_annotations | Broadcast | ~50 per tournament | Stream markers |
| 39 | match_vod_links | Broadcast | ~18 per tournament | VOD links |
| 40 | disputes | Dispute | ~5 per tournament | Dispute records |
| 41 | dispute_evidence | Dispute | ~10 per tournament | Evidence files |
| 42 | dispute_resolutions | Dispute | ~5 per tournament | Resolution records |
| 43 | prize_payouts | Prize | ~5 per tournament | Payout records |
| 44 | payout_details | Prize | ~5 per tournament | Encrypted bank/UPI |
| 45 | notification_templates | Notif | ~25 rows | Template library |
| 46 | notifications | Notif | ~2,000 per tournament | All notifications |
| 47 | notification_deliveries | Notif | ~6,000 per tournament | Per-channel delivery |
| 48 | audit_logs | Audit | ~5,000 per tournament | Complete audit trail |
| 49 | sponsors | Sponsor | Per org | Sponsor accounts |
| 50 | sponsor_reps | Sponsor | Per sponsor | Sponsor user links |
| 51 | sponsor_assignments | Sponsor | Per tournament | Sponsor ↔ tournament |
| 52 | tournament_analytics | Analytics | 1 per tournament | Aggregated stats |
| 53 | stream_metrics | Analytics | ~720 per tournament | Hourly stream health |

---

> **Document:** GameVerse Database ER Diagram | **Version:** 1.0 | **Tables:** 53 | **Domains:** 18 | **Status:** Complete ✅