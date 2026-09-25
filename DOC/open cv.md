# RIFTORA — OCR / COMPUTER-VISION LIVE SCORING IMPLEMENTATION

## ROLE

Act as a senior computer-vision engineer, Python backend engineer, Java Spring Boot engineer, and esports broadcast systems architect.

You are implementing a production-oriented **OCR / Computer Vision Live Match Intelligence subsystem** for the existing Riftora esports tournament platform.

Do NOT redesign Riftora.

Do NOT create a second tournament/scoring architecture.

Do NOT replace the existing React + Java Spring Boot architecture.

Integrate this feature into the existing project structure, database model, REST API, WebSocket/STOMP infrastructure, Match Day Operations, Live Scoring, Leaderboard, Command Center, Broadcast, and OBS Overlay systems.

First inspect the existing repository and all available project documentation before modifying code.

The existing project architecture is based on:

* React 19 + Vite + JavaScript
* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA / Hibernate
* MySQL
* Redis
* Spring WebSocket + STOMP
* Flyway
* OBS/browser-source overlays
* Modular monolith architecture

The existing architecture explicitly uses modules including:

* `modules.matchday`
* `modules.scoring`
* `modules.leaderboard`
* `modules.broadcast`
* `modules.overlay`
* `modules.commandcenter`

and follows a modular-monolith approach rather than separate microservices for MVP.

Do not introduce NestJS, Node backend services, Kafka, RabbitMQ, or a new database unless the existing repository already requires them.

---

# 1. CORE OBJECTIVE

Implement a dedicated Python-based computer-vision worker that can consume a live game feed and detect structured match events.

Initial target games:

1. BGMI
2. Free Fire MAX

The system must be designed so additional games can be added later through game-specific parser/profile implementations.

The worker must operate using a **preconfigured Match Context**.

The operator configures the match BEFORE the match starts:

```text
Tournament
    ↓
Match
    ↓
Game
    ↓
Live Source
    ↓
Feed / ROI configuration
    ↓
Match Slot Mapping
    ↓
Player Mapping
    ↓
Scoring Configuration
    ↓
OCR Worker Session
    ↓
Live Vision Processing
```

The worker must NOT perform expensive runtime identity discovery when the identity can already be resolved from the configured match.

---

# 2. IMPORTANT ARCHITECTURAL RULE

The OCR worker is NOT the scoring authority.

The architecture must be:

```text
Live Game Feed
       ↓
Python Vision Worker
       ↓
OCR / CV Detection
       ↓
Candidate Event
       ↓
Spring Boot Ingestion API
       ↓
Validation
       ↓
Deduplication
       ↓
Match / Slot Verification
       ↓
Scoring Engine
       ↓
MySQL
       ↓
Redis
       ↓
STOMP/WebSocket
       ↓
React Command Center
       ↓
Public Leaderboard
       ↓
OBS Overlays
```

Never:

```text
OCR → database score update
```

Never:

```text
OCR → Redis leaderboard update
```

The Python worker may publish candidate events only.

Spring Boot owns:

* validation
* authorization
* match state
* scoring
* deduplication
* correction
* audit trail
* leaderboard calculation
* public state

---

# 3. MATCH PRE-CONFIGURATION

Add a Command Center / Match Operations configuration workflow.

Suggested UI location:

```text
Command Center
    → Match Operations
        → Match
            → Live Feed Configuration
```

or, if an existing match configuration screen already exists, extend it instead of creating a duplicate screen.

The operator must be able to configure:

## Match

```text
Tournament
Match
Round
Game
```

## Live Source

Support an extensible source architecture:

```text
OBS capture
RTMP
SRT
local video
screen capture
file/replay
```

For MVP, prioritize the easiest reliable local/live source available in the existing deployment environment.

Do NOT require the Python worker to directly ingest the public YouTube/Twitch stream if a lower-latency source is available.

Prefer:

```text
Game/OBS output
       ↓
Local capture / RTMP / SRT
       ↓
OCR Worker
```

over:

```text
YouTube/Twitch
       ↓
OCR Worker
```

because public streaming introduces unnecessary latency and compression.

---

# 4. MATCH SLOT MAP

The operator configures the slot map before starting OCR.

Example:

```text
Match #3
Game: BGMI

Slot 01 → Team Alpha
Slot 02 → Team Bravo
Slot 03 → Team Delta
Slot 04 → Team Omega
...
Slot 16 → Team Zeta
```

The worker must receive a resolved context such as:

```json
{
  "sessionId": "live_8f92",
  "matchId": "match_103",
  "game": "BGMI",

  "slots": {
    "01": {
      "teamId": "team_101",
      "teamName": "Team Alpha",
      "players": {
        "AlphaP1": "player_101",
        "AlphaP2": "player_102",
        "AlphaP3": "player_103",
        "AlphaP4": "player_104"
      }
    }
  }
}
```

The worker must treat:

```text
matchId + slotNumber
```

as the identity boundary.

Never use slot number globally.

Correct:

```text
match_103:05
```

Incorrect:

```text
05
```

because Slot 05 can represent a completely different team in another match.

---

# 5. DO NOT TRUST RAW OCR IDENTITY

OCR output is probabilistic.

For example, OCR may produce:

```text
TEAMALPHA
```

when the actual text is:

```text
TEAM_ALPHA
```

Therefore implement a resolution layer:

```text
OCR text
   ↓
normalize
   ↓
exact match
   ↓
alias match
   ↓
fuzzy match
   ↓
configured player/team dictionary
   ↓
confidence calculation
```

But because the Match Context is preloaded, prefer:

```text
slot → known team/player
```

whenever the game UI exposes a slot/player identifier.

Runtime fuzzy identity matching should be a fallback, NOT the primary mechanism.

---

# 6. PYTHON OCR WORKER

Create a dedicated Python worker application.

Suggested structure:

```text
vision-worker/
├── app/
│   ├── main.py
│   │
│   ├── config/
│   │   ├── settings.py
│   │   └── logging.py
│   │
│   ├── api/
│   │   ├── health.py
│   │   └── session.py
│   │
│   ├── capture/
│   │   ├── base.py
│   │   ├── obs_capture.py
│   │   ├── rtmp_capture.py
│   │   ├── srt_capture.py
│   │   └── local_capture.py
│   │
│   ├── vision/
│   │   ├── pipeline.py
│   │   ├── preprocessing.py
│   │   ├── roi.py
│   │   ├── frame_sampling.py
│   │   └── tracking.py
│   │
│   ├── ocr/
│   │   ├── engine.py
│   │   ├── tesseract_engine.py
│   │   ├── paddle_engine.py
│   │   └── easyocr_engine.py
│   │
│   ├── games/
│   │   ├── base.py
│   │   ├── bgmi/
│   │   │   ├── parser.py
│   │   │   ├── regions.py
│   │   │   ├── patterns.py
│   │   │   └── detector.py
│   │   │
│   │   └── free_fire/
│   │       ├── parser.py
│   │       ├── regions.py
│   │       ├── patterns.py
│   │       └── detector.py
│   │
│   ├── context/
│   │   ├── match_context.py
│   │   └── slot_resolver.py
│   │
│   ├── events/
│   │   ├── models.py
│   │   ├── validator.py
│   │   ├── deduplicator.py
│   │   └── publisher.py
│   │
│   └── metrics/
│       ├── latency.py
│       ├── confidence.py
│       └── health.py
│
├── tests/
├── requirements.txt
├── Dockerfile
└── README.md
```

Adapt this structure to the repository if an existing Python/worker structure already exists.

Do not blindly create duplicate infrastructure.

---

# 7. COMPUTER VISION PIPELINE

The worker should NOT OCR every pixel of every frame.

That would be wasteful and slow.

Implement:

```text
Frame
 ↓
Resize / normalize
 ↓
ROI selection
 ↓
Preprocessing
 ↓
Detection
 ↓
OCR only where necessary
 ↓
Temporal validation
 ↓
Event generation
```

Use OpenCV as the base computer-vision layer.

Recommended processing stages:

### Stage 1 — Capture

OpenCV:

```python
cv2.VideoCapture(...)
```

or the appropriate low-latency stream interface.

### Stage 2 — Frame sampling

Do NOT process every frame.

Use configurable sampling.

For example:

```text
60 FPS input
      ↓
5–15 FPS vision processing
```

The exact rate must be configurable and benchmarked.

The system should dynamically increase processing around detected activity and decrease it when the ROI is unchanged.

---

# 8. ROI-BASED PROCESSING

The biggest performance optimization is ROI processing.

Never run OCR against the entire 1080p/1440p frame when the kill feed occupies only a small region.

Store normalized ROI coordinates:

```json
{
  "x": 0.72,
  "y": 0.08,
  "width": 0.25,
  "height": 0.35
}
```

Convert normalized coordinates to actual frame dimensions.

Support multiple ROIs:

```text
kill_feed
player_name
team_name
placement
match_status
elimination_banner
```

Example:

```json
{
  "regions": {
    "kill_feed": {...},
    "placement": {...},
    "player_status": {...}
  }
}
```

---

# 9. GAME PROFILE SYSTEM

Do NOT hard-code BGMI logic throughout the worker.

Create a game profile abstraction.

Example:

```python
class GameVisionProfile:
    game_code
    frame_regions()
    preprocess()
    detect_events()
    parse_event()
    resolve_identity()
```

Implement:

```text
BGMIProfile
FreeFireProfile
```

Future:

```text
PUBGProfile
ValorantProfile
CODMProfile
```

without rewriting the core pipeline.

---

# 10. OCR ENGINE STRATEGY

Do not assume one OCR engine is always best.

Create an OCR abstraction:

```python
class OCREngine:
    def recognize(self, image) -> OCRResult:
        ...
```

Support pluggable engines.

Evaluate:

### Primary candidate

PaddleOCR

Use when accuracy and modern text detection/recognition are important.

### Lightweight fallback

Tesseract

Use where the ROI is clean and predictable.

### Optional alternative

EasyOCR

Use for specific environments where it benchmarks better.

The implementation must allow switching through configuration:

```env
OCR_ENGINE=paddle
```

or:

```env
OCR_ENGINE=tesseract
```

Do NOT run all three OCR engines on every frame.

That destroys latency.

Instead:

```text
Primary OCR
     ↓
confidence sufficient?
     ├── YES → accept
     └── NO
          ↓
optional fallback OCR
```

---

# 11. PREPROCESSING

Implement configurable OpenCV preprocessing.

Potential pipeline:

```text
ROI
 ↓
Upscale
 ↓
Grayscale
 ↓
Contrast enhancement
 ↓
Denoise
 ↓
Threshold
 ↓
Morphological cleanup
 ↓
OCR
```

Do not blindly apply every transformation.

Different game UI elements may require different preprocessing.

Create profiles such as:

```text
BGMI_KILL_FEED
BGMI_PLAYER_NAME
FREE_FIRE_KILL_FEED
```

Benchmark each pipeline against recorded gameplay frames.

---

# 12. EVENT DETECTION

The first MVP event should be:

```text
PLAYER_KILL
```

Do not attempt to solve every possible game event initially.

Design the event model to support:

```text
PLAYER_KILL
PLAYER_ELIMINATION
TEAM_ELIMINATION
PLACEMENT_UPDATE
MATCH_END
PLAYER_KNOCK
REVIVE
OBJECTIVE
```

only when supported reliably by the game profile.

---

# 13. TEMPORAL VALIDATION

Never generate an event from a single OCR frame.

Example:

```text
Frame 100
  OCR → "Alpha killed Bravo"

Frame 101
  OCR → "Alpha killed Bravo"

Frame 102
  OCR → "Alpha killed Bravo"
```

Treat these as one event.

Implement temporal stabilization:

```text
candidate detected
       ↓
store candidate
       ↓
observe subsequent frames
       ↓
same event persists?
       ↓
YES
       ↓
confirm event
```

This reduces false positives and duplicate events.

---

# 14. EVENT DEDUPLICATION

Every generated event needs a deterministic/idempotent identity.

Example:

```text
eventFingerprint =
hash(
    matchId +
    eventType +
    killerIdentity +
    victimIdentity +
    normalizedTimestampWindow
)
```

The worker should maintain a short-lived local deduplication cache.

Spring Boot MUST also deduplicate server-side.

Never rely solely on the Python worker.

---

# 15. EVENT CONTRACT

Create a versioned event schema.

Example:

```json
{
  "schemaVersion": 1,
  "eventId": "evt_01J...",
  "sessionId": "live_8f92",
  "matchId": "match_103",

  "eventType": "PLAYER_KILL",

  "game": "BGMI",

  "killer": {
    "slot": 5,
    "playerId": "player_501",
    "rawText": "ALPHAxRAHUL",
    "confidence": 0.97
  },

  "victim": {
    "slot": 6,
    "playerId": "player_601",
    "rawText": "BRAVOxAMAN",
    "confidence": 0.95
  },

  "evidence": {
    "frameTimestamp": 18342.52,
    "frameNumber": 550276,
    "roi": {
      "x": 0.72,
      "y": 0.08,
      "width": 0.25,
      "height": 0.35
    }
  },

  "confidence": 0.96,

  "source": "ocr",

  "createdAt": "..."
}
```

The event must contain enough evidence for debugging and audit.

---

# 16. CONFIDENCE SYSTEM

Implement separate confidence values:

```text
OCR confidence
Identity confidence
Pattern confidence
Temporal confidence
Overall confidence
```

Example:

```text
overall =
weighted(
    OCR confidence,
    identity confidence,
    pattern confidence,
    temporal confirmation
)
```

Do not automatically score low-confidence events.

Define configurable thresholds:

```text
>= 0.90
    AUTO_ACCEPT

0.70–0.89
    REVIEW_REQUIRED

< 0.70
    REJECT
```

These values are starting configuration only and MUST be benchmarked against actual game footage.

Do not hard-code them as universal truth.

---

# 17. HUMAN REVIEW

The Command Center must display OCR events.

Example:

```text
LIVE OCR EVENTS

┌─────────────────────────────────────────────┐
│ 10:42:18                                    │
│ Team Alpha                                  │
│ Rahul  →  Team Bravo / Aman                 │
│                                             │
│ Confidence: 96%                             │
│                                             │
│ [ ACCEPT ] [ REJECT ] [ VIEW EVIDENCE ]    │
└─────────────────────────────────────────────┘
```

For medium-confidence events:

```text
REVIEW REQUIRED
```

The operator can:

```text
Accept
Reject
Correct identity
Correct team
Mark as invalid
```

Every manual correction must create an audit entry.

---

# 18. SPRING BOOT INGESTION

Add OCR ingestion to the existing modular monolith.

Preferred package:

```text
modules.scoring
```

with supporting integration under:

```text
modules.matchday
modules.commandcenter
```

Do NOT create:

```text
modules.ocr
```

unless the existing architecture strongly benefits from a separate integration boundary.

The OCR worker is an external system.

Spring Boot owns the ingestion boundary.

Suggested structure:

```text
modules/scoring/

controller/
    LiveEventIngestionController.java

service/
    LiveEventIngestionService.java
    EventValidationService.java
    EventDeduplicationService.java

domain/
    LiveScoringEvent.java
    OCRCandidateEvent.java

repository/
    ...
```

Adapt to existing package conventions.

---

# 19. INGESTION API

Create an authenticated machine-to-machine endpoint.

Example:

```http
POST /v1/matches/{matchId}/live-events
```

The endpoint must:

1. Authenticate worker
2. Validate worker permission/session
3. Verify match exists
4. Verify match is LIVE
5. Verify event session matches match
6. Validate event schema
7. Validate slot IDs
8. Validate player/team relationships
9. Check duplicate fingerprint
10. Apply confidence policy
11. Pass accepted event to scoring engine
12. Persist audit/evidence metadata
13. Publish real-time update

Do not allow a normal browser JWT to impersonate an OCR worker.

Use a dedicated worker credential mechanism.

---

# 20. WORKER AUTHENTICATION

Implement secure machine authentication.

Preferred:

```text
workerId
workerSecret
short-lived access token
```

or another secure service-to-service authentication method compatible with the existing Spring Security architecture.

Never put:

```text
SPRING_JWT_SIGNING_SECRET
```

inside the Python worker.

The worker should receive its own credentials.

Rotate worker credentials.

Scope each worker credential to:

```text
specific organization
specific tournament
specific match/session
```

where practical.

---

# 21. MATCH CONTEXT API

Create an endpoint used when the operator starts OCR.

Example:

```http
POST /v1/matches/{matchId}/vision-session
```

The backend validates the match and returns a signed/authorized context.

Example:

```json
{
  "sessionId": "live_8f92",
  "matchId": "match_103",
  "game": {
    "code": "BGMI",
    "version": "..."
  },

  "status": "LIVE",

  "capture": {
    "sourceType": "RTMP"
  },

  "regions": {
    "killFeed": {...}
  },

  "slots": [...],

  "players": [...],

  "scoring": {
    "killPoints": 1
  },

  "expiresAt": "..."
}
```

Never allow the frontend to arbitrarily construct authoritative slot mappings and send them directly to the worker.

The backend resolves them from the existing match registration/schedule data.

---

# 22. DATABASE INTEGRATION

Reuse existing entities:

```text
matches
match_slots
teams
team_members
registrations
registration_rosters
match_results
team_match_results
lobby_events
audit_logs
```

Do not create duplicate:

```text
ocr_teams
ocr_players
ocr_matches
```

Create only the additional persistence required for computer-vision evidence/session/event tracking.

Possible tables:

```text
vision_sessions
vision_events
vision_event_evidence
```

### vision_sessions

Store:

```text
session_id
match_id
worker_id
status
game
started_at
stopped_at
configuration_version
created_by
```

### vision_events

Store:

```text
event_id
session_id
match_id
event_type
status
confidence
fingerprint
detected_at
processed_at
accepted_at
accepted_by
rejection_reason
```

### vision_event_evidence

Store:

```text
evidence_id
event_id
frame_number
timestamp
roi_coordinates
raw_ocr_text
ocr_engine
ocr_confidence
image_reference
```

Do not store full video frames in MySQL.

Store evidence images in the existing object storage architecture and keep only references/metadata in MySQL.

---

# 23. REDIS

Use Redis for short-lived live state where appropriate.

Potential keys:

```text
vision:session:{sessionId}
vision:events:{matchId}
vision:dedupe:{fingerprint}
```

Do not make Redis the permanent source of truth.

MySQL remains authoritative.

Redis is for:

* low-latency state
* deduplication
* event fan-out
* temporary worker state
* live session health

---

# 24. WEBSOCKET / STOMP

Integrate with the existing Spring WebSocket/STOMP system.

The current architecture already defines WebSocket/STOMP as the real-time layer.

Suggested topics:

```text
/topic/tournament/{tournamentId}/matches/{matchId}/vision
/topic/tournament/{tournamentId}/matches/{matchId}/scoring
/topic/tournament/{tournamentId}/leaderboard
```

Events:

```text
VISION_SESSION_STARTED
VISION_SESSION_STOPPED
VISION_WORKER_CONNECTED
VISION_WORKER_DISCONNECTED

VISION_EVENT_DETECTED
VISION_EVENT_ACCEPTED
VISION_EVENT_REJECTED
VISION_EVENT_REVIEW_REQUIRED

LIVE_SCORE_UPDATED
LEADERBOARD_UPDATED
```

The Command Center should update without polling.

---

# 25. COMMAND CENTER UI

Extend the existing Command Center rather than creating another dashboard.

Existing requirements already define Command Center as a full-screen operational interface with persistent WebSocket connectivity and live match/tournament state.

Add:

## Vision Status

```text
OCR WORKER
● Connected

Game
BGMI

Session
LIVE

Processing
12 FPS

Latency
143 ms

Events
27

Accepted
24

Review
2

Rejected
1
```

## Feed Preview

Show:

```text
LIVE FEED
```

with optional:

```text
ROI overlays
```

for debugging.

## Event Stream

```text
10:42:18
Alpha → Bravo
KILL
96%

10:42:21
Delta → Omega
KILL
94%
```

## Controls

```text
[ Start OCR ]
[ Pause ]
[ Resume ]
[ Stop ]

[ Test Feed ]
[ Calibrate ROI ]
[ Reconfigure ]
```

Dangerous actions must require confirmation:

```text
Stop OCR
Reset session
Clear pending events
```

---

# 26. ROI CALIBRATION UI

Create an operator calibration mode.

The user sees the live frame.

Allow:

```text
Drag rectangle
Resize rectangle
Name region
Save region
Test OCR
```

Example:

```text
┌──────────────────────────────┐
│                              │
│       GAME FEED              │
│                              │
│                 ┌─────────┐  │
│                 │ KILL    │  │
│                 │ FEED    │  │
│                 └─────────┘  │
│                              │
└──────────────────────────────┘

Region:
[ kill_feed ]

[ Test OCR ]

Detected:
Alpha → Bravo
Confidence: 97%

[ Save Configuration ]
```

Store coordinates normalized to:

```text
0.0 → 1.0
```

so configurations remain resolution-independent.

---

# 27. LIVE FEED PERFORMANCE

The worker must prioritize low latency.

Target architecture:

```text
Capture
 ↓
small frame queue
 ↓
ROI extraction
 ↓
vision processing
 ↓
OCR
 ↓
event validation
 ↓
HTTP/WebSocket ingestion
```

Avoid unbounded queues.

Use a bounded queue:

```text
max queue size = configurable
```

When overloaded:

```text
drop old frames
process newest frame
```

For live esports scoring, processing a frame that is 10 seconds old is worse than dropping it.

The system should favor:

```text
freshness > processing every frame
```

---

# 28. THREADING / ASYNC MODEL

Do not perform capture, OCR, and network publishing on the same blocking loop.

Use separate stages:

```text
Capture Thread
      ↓
Frame Queue
      ↓
Vision Worker
      ↓
Event Queue
      ↓
Publisher
```

or an equivalent asyncio/thread/process architecture.

Benchmark CPU/GPU usage.

If OCR is CPU-heavy, allow multiprocessing.

If GPU acceleration is available, expose a configurable GPU mode.

---

# 29. HARDWARE ACCELERATION

Support optional:

```text
CPU mode
GPU mode
```

Do not require GPU for the initial MVP.

The worker must run correctly on CPU.

If CUDA-compatible hardware is available, allow OCR/model acceleration.

Configuration:

```env
VISION_DEVICE=auto
```

Possible values:

```text
auto
cpu
cuda
```

---

# 30. NETWORK LATENCY

The OCR worker should not wait for the next database write before continuing detection.

Use:

```text
detect
 ↓
queue event
 ↓
continue processing
```

and independently:

```text
event queue
 ↓
Spring Boot ingestion
```

If Spring Boot temporarily becomes unavailable:

```text
queue events locally
```

for a bounded period.

Do not lose events silently.

But do not allow an unlimited local queue.

---

# 31. FAILURE HANDLING

Implement:

### Worker disconnected

Command Center:

```text
OCR WORKER DISCONNECTED
Last event: 2.4s ago

[Reconnect]
```

### Feed unavailable

```text
LIVE FEED UNAVAILABLE
```

### OCR overloaded

```text
VISION DEGRADED
Processing rate reduced
```

### Backend unavailable

```text
SCORING SERVER UNAVAILABLE
Events buffered locally
```

### Match not LIVE

Worker must refuse to process authoritative scoring events.

### Match completed

Worker automatically stops or transitions to read-only/evidence mode.

---

# 32. MANUAL FALLBACK

OCR must NEVER make the existing manual scoring workflow unusable.

The referee must still be able to:

```text
Enter result manually
Correct score
Verify result
Reject OCR event
```

If OCR fails completely:

```text
Manual scoring continues normally.
```

This is essential.

---

# 33. SCORING ENGINE INTEGRATION

OCR event:

```text
PLAYER_KILL
```

must be converted into the existing scoring model.

Example:

```text
OCR:
Team Alpha player kills Team Bravo player

        ↓

Spring Boot

        ↓

Validate:
- Match active?
- Player belongs to Alpha?
- Victim belongs to Bravo?
- Event duplicate?
- Event accepted?
- Scoring rules active?

        ↓

Scoring Engine

        ↓

Team Alpha +1 kill
        ↓
placement + kill points
        ↓
team_match_results
        ↓
leaderboard recalculation
```

Do not create a second scoring engine inside Python.

The existing Live Scoring & Points Engine remains authoritative.

The existing platform defines live scoring as its own module and leaderboard as a dependent module; preserve that boundary.

---

# 34. LEADERBOARD UPDATE

After an accepted scoring event:

```text
Score change
   ↓
Leaderboard calculation
   ↓
Redis update
   ↓
STOMP event
   ↓
React
   ↓
OBS
```

Public viewers must see the updated leaderboard through the existing leaderboard infrastructure.

Do not create a separate OCR leaderboard.

---

# 35. OBS INTEGRATION

Do not make OCR directly control OBS.

Use:

```text
OCR
 ↓
Scoring
 ↓
Leaderboard
 ↓
STOMP
 ↓
OBS overlay
```

Existing OBS browser-source overlays consume authoritative Riftora data.

This keeps broadcast state consistent with the scoring system.

The existing PRD specifically defines browser-source overlays driven by live tournament data.

---

# 36. MATCH START FLOW

Implement exactly this operational flow:

```text
Tournament Director
        ↓
Open Command Center
        ↓
Select upcoming match
        ↓
Open Live Feed Configuration
        ↓
Backend loads:
    game
    match
    teams
    slots
    players
    scoring rules
        ↓
Operator configures:
    source
    ROI
    OCR profile
        ↓
[Test Feed]
        ↓
OCR detects sample text
        ↓
Operator verifies
        ↓
[Start Live Tracking]
        ↓
Backend creates Vision Session
        ↓
Worker receives signed Match Context
        ↓
Worker connects to live feed
        ↓
Worker enters RUNNING
```

---

# 37. LIVE MATCH FLOW

```text
LIVE FEED
   ↓
Frame
   ↓
ROI extraction
   ↓
OpenCV preprocessing
   ↓
Game-specific detector
   ↓
OCR
   ↓
Text normalization
   ↓
Known slot/player resolution
   ↓
Temporal confirmation
   ↓
Confidence calculation
   ↓
Candidate event
   ↓
Spring Boot
   ↓
Validation
   ↓
Deduplication
   ↓
AUTO ACCEPT / REVIEW
   ↓
Scoring Engine
   ↓
Match Result State
   ↓
Leaderboard
   ↓
Redis
   ↓
STOMP
   ├── Command Center
   ├── Public Tournament
   └── OBS
```

---

# 38. MATCH END FLOW

When referee/operator marks the match complete:

```text
Match → COMPLETED
        ↓
Backend sends MATCH_COMPLETED
        ↓
Worker stops authoritative detection
        ↓
Worker uploads pending evidence
        ↓
Worker closes session
        ↓
Final scoring verification
        ↓
Leaderboard snapshot
        ↓
Audit event
```

Never allow OCR to continue modifying completed match scores.

---

# 39. SECURITY

The vision system must follow the existing Spring Security architecture.

Implement:

* worker authentication
* scoped permissions
* signed match context
* short-lived session credentials
* HTTPS
* request IDs
* event IDs
* audit logging
* replay protection
* rate limiting
* input validation

Never trust:

```text
matchId
teamId
playerId
slot
score
```

from the worker without backend validation.

The worker proposes events.

The backend decides whether they are valid.

---

# 40. AUDITABILITY

Every accepted/rejected/corrected OCR event must be traceable.

Audit information:

```text
who/what generated it
worker
session
match
timestamp
raw OCR
parsed identity
confidence
decision
operator
correction
final scoring result
```

This must integrate with the existing Audit Trail module.

---

# 41. OBSERVABILITY

Expose worker metrics:

```text
worker_connected
feed_connected
frames_received
frames_processed
frames_dropped
ocr_requests
ocr_latency_ms
vision_latency_ms
event_latency_ms
events_detected
events_accepted
events_rejected
events_reviewed
ocr_confidence_avg
queue_depth
cpu_usage
memory_usage
gpu_usage
```

Expose health:

```http
/health
/ready
/metrics
```

Spring Boot should expose its own ingestion/vision-session health through Actuator.

---

# 42. PERFORMANCE TARGETS

Do not claim hard real-world OCR accuracy without testing actual game footage.

Use these as engineering targets:

```text
Capture-to-detection latency:
< 500 ms target

Detection-to-backend:
< 200 ms target

Backend event propagation:
< 500 ms target

End-to-end:
aim for < 1.5 seconds
```

These are targets to benchmark, not guarantees.

The existing platform's general real-time goal is 2–3 second propagation for live state, so the OCR pipeline should fit within that budget rather than create a competing latency requirement.

---

# 43. TESTING

Create automated tests for:

## Python

* frame extraction
* ROI extraction
* preprocessing
* OCR normalization
* game parser
* player resolution
* slot resolution
* confidence scoring
* temporal stabilization
* event deduplication
* event serialization
* worker reconnect
* feed failure

## Spring Boot

* worker authentication
* invalid match
* invalid slot
* invalid player
* duplicate event
* low-confidence event
* completed match
* paused match
* unauthorized worker
* scoring integration
* leaderboard update
* WebSocket event

## Integration

Test:

```text
Recorded gameplay
      ↓
Python worker
      ↓
Spring Boot
      ↓
MySQL
      ↓
Redis
      ↓
STOMP
      ↓
React
```

---

# 44. RECORDED VIDEO TEST HARNESS

This is mandatory.

Do not develop OCR exclusively against live gameplay.

Create:

```text
vision-worker/test-data/
├── bgmi/
├── free-fire/
├── clean/
├── compressed/
├── low-resolution/
├── fast-action/
├── duplicate-events/
└── false-positive/
```

Create a replay runner:

```bash
python -m app.replay --video test.mp4 --profile bgmi
```

It should output:

```text
Frame
Timestamp
OCR
Detected Event
Confidence
Latency
```

This lets the team benchmark changes without repeatedly running live matches.

---

# 45. GOLDEN DATASET

Create manually verified event annotations.

Example:

```json
{
  "timestamp": 18342.52,
  "event": "PLAYER_KILL",
  "killerPlayerId": "player_501",
  "victimPlayerId": "player_601"
}
```

Measure:

```text
Precision
Recall
F1
False Positive Rate
False Negative Rate
Detection Latency
```

Do not optimize solely for OCR character accuracy.

The important metric is:

```text
correct esports event detection
```

---

# 46. GAME-SPECIFIC STRATEGY

Do NOT assume plain OCR is enough for all game UI.

Use a hybrid pipeline:

```text
OpenCV
+
OCR
+
template matching
+
color/shape detection
+
optional lightweight object detection
```

For example:

```text
Text-heavy element
→ OCR

Known icon
→ template/object detection

Stable UI position
→ ROI

Repeated event
→ temporal tracking
```

Use the cheapest reliable detector for each element.

Do not use a large AI model when simple computer vision solves the problem.

---

# 47. OPTIONAL OBJECT DETECTION

Design the system so an object detector can be added later.

Potential architecture:

```text
Frame
 ↓
Object Detector
 ↓
Candidate Region
 ↓
OCR
 ↓
Event Parser
```

Possible models may be introduced only after benchmark evidence shows OCR/OpenCV alone is insufficient.

Do not introduce an expensive model into MVP merely because it is "AI".

---

# 48. CONFIGURATION VERSIONING

Every live vision session must store:

```text
configurationVersion
```

If ROI/profile/scoring configuration changes:

```text
v1
v2
v3
```

Never silently mutate the configuration used by an active match.

For an active session:

```text
configuration immutable
```

unless the operator explicitly stops/reconfigures/restarts the session.

This is important for auditability.

---

# 49. API CONTRACTS

Follow the existing Riftora API conventions.

The existing API uses:

```text
/v1/{resource}/{id}/{sub-resource}
```

and standardized success/error envelopes.

Add OCR/vision endpoints consistently.

Suggested endpoints:

```http
POST /v1/matches/{matchId}/vision-sessions
GET  /v1/matches/{matchId}/vision-sessions
GET  /v1/vision-sessions/{sessionId}
POST /v1/vision-sessions/{sessionId}/start
POST /v1/vision-sessions/{sessionId}/pause
POST /v1/vision-sessions/{sessionId}/resume
POST /v1/vision-sessions/{sessionId}/stop

GET  /v1/vision-sessions/{sessionId}/events
POST /v1/vision-events/{eventId}/accept
POST /v1/vision-events/{eventId}/reject
POST /v1/vision-events/{eventId}/correct

POST /v1/matches/{matchId}/live-events
```

Do not duplicate endpoints if equivalent existing endpoints already exist. Extend existing contracts where appropriate.

---

# 50. RATE LIMITING

Respect existing API rate limiting.

Do not send one HTTP request per video frame.

Never:

```text
10 FPS
→ 10 API requests/sec
```

Instead:

```text
Frames
 ↓
Events
 ↓
Event queue
 ↓
Batch or event-driven ingestion
```

Typical event rate should be much lower than frame rate.

If batching is useful, support:

```http
POST /v1/matches/{matchId}/live-events/batch
```

but only if it fits the existing API conventions.

---

# 51. FRONTEND IMPLEMENTATION

Use existing React architecture.

Do not introduce a global state library if the current project does not already use one for this functionality.

Reuse existing:

* design system
* buttons
* cards
* dialogs
* tables
* badges
* WebSocket hooks
* API client
* route guards
* Command Center layout

Add only the necessary components.

Suggested:

```text
components/vision/
    VisionStatusCard.jsx
    VisionFeedPreview.jsx
    VisionEventList.jsx
    VisionEventReview.jsx
    VisionRoiEditor.jsx
    VisionMetrics.jsx
    VisionSessionControls.jsx
```

Use JavaScript, not TypeScript, consistent with the existing React architecture.

---

# 52. USER PERMISSIONS

Use existing role boundaries.

Primary users:

```text
Tournament Director
Referee
Broadcast Producer
```

Recommended authority:

### Tournament Director

Can:

```text
configure
start
stop
review
accept
reject
correct
```

### Referee

Can:

```text
view
start if assigned
review
accept/reject according to match permissions
```

### Broadcast Producer

Can:

```text
view vision state
view events
view scoring
```

but should not independently modify authoritative match scores unless the existing permission model explicitly grants it.

Follow the existing role matrix rather than inventing new roles. The existing platform distinguishes Tournament Director, Referee, and Broadcast Producer responsibilities at tournament/match scope.

---

# 53. NO AUTOMATIC FINAL RESULT

OCR events may update live scoring.

But final match completion must still follow the existing result verification process.

The pipeline should support:

```text
OCR-assisted live events
+
human verification
+
final result confirmation
```

Do not automatically finalize a match solely because OCR stopped detecting events.

---

# 54. DEVELOPMENT PHASES

Implement in this order.

## Phase 1 — Infrastructure

* Python worker
* health endpoint
* configuration
* logging
* capture abstraction
* replay runner

## Phase 2 — Vision

* OpenCV
* ROI system
* preprocessing
* OCR abstraction
* PaddleOCR/Tesseract implementation
* BGMI parser

## Phase 3 — Event Engine

* event model
* confidence
* temporal validation
* deduplication
* slot resolution

## Phase 4 — Spring Boot

* vision session
* worker authentication
* event ingestion
* validation
* scoring integration
* persistence
* audit

## Phase 5 — Real-Time

* Redis where required
* STOMP events
* Command Center integration
* live event stream

## Phase 6 — UI

* configuration
* feed preview
* ROI calibration
* worker status
* event review
* metrics

## Phase 7 — Free Fire

Implement Free Fire profile only after BGMI pipeline is stable.

## Phase 8 — Production Hardening

* reconnect
* buffering
* monitoring
* metrics
* security
* performance
* load testing
* failure recovery

---

# 55. DO NOT BREAK EXISTING FEATURES

Before modifying anything:

1. Inspect repository structure.
2. Identify current backend modules.
3. Identify current frontend routes.
4. Identify existing Match Day APIs.
5. Identify existing scoring APIs.
6. Identify leaderboard services.
7. Identify WebSocket/STOMP implementation.
8. Identify Redis integration.
9. Identify OBS overlay implementation.
10. Identify existing database entities/migrations.

Then integrate.

Do not rewrite existing modules unnecessarily.

Do not create duplicate:

```text
Match
Team
Player
Tournament
Score
Leaderboard
WebSocket
```

models.

---

# 56. MIGRATION STRATEGY

Use Flyway for new database tables.

Do not modify production tables destructively.

Use migrations such as:

```text
V__create_vision_sessions.sql
V__create_vision_events.sql
V__create_vision_event_evidence.sql
```

Use the repository's existing Flyway naming convention.

---

# 57. DOCKER / LOCAL DEVELOPMENT

Create a reproducible worker environment.

Example:

```text
docker compose
├── mysql
├── redis
├── spring-boot
└── vision-worker
```

Do not force OCR into the same Java container.

Python worker is independently deployable.

Local development should support:

```bash
docker compose up
```

and:

```bash
python -m app.replay ...
```

---

# 58. ENVIRONMENT VARIABLES

Example:

```env
VISION_WORKER_ID=
VISION_WORKER_SECRET=

BACKEND_BASE_URL=

OCR_ENGINE=paddle
VISION_DEVICE=auto

FRAME_SAMPLE_FPS=10
MAX_FRAME_QUEUE=3

EVENT_CONFIDENCE_THRESHOLD=0.90
REVIEW_CONFIDENCE_THRESHOLD=0.70

EVIDENCE_STORAGE_BUCKET=
```

Do not commit secrets.

---

# 59. ACCEPTANCE CRITERIA

The implementation is complete only when:

### Match setup

* Operator can configure game and match.
* Backend loads authoritative slot/team/player mapping.
* Operator can configure/test feed.
* ROI can be configured.
* Vision session can be started.

### Worker

* Worker connects successfully.
* Worker receives Match Context.
* Worker captures live/replay feed.
* Worker processes ROI instead of full frame.
* OCR works through pluggable engine.
* Game parser generates structured candidate events.
* Duplicate events are suppressed.
* Low-confidence events are reviewable.

### Backend

* Worker is authenticated.
* Invalid events are rejected.
* Duplicate events are rejected/idempotent.
* Invalid player/team/slot relationships are rejected.
* Accepted events enter the existing scoring engine.
* Audit records are created.

### Real-time

* Accepted scoring event updates leaderboard.
* Command Center receives event.
* Public leaderboard receives event.
* OBS overlay receives authoritative leaderboard update.

### Failure

* Worker reconnects.
* Feed disconnect is visible.
* Backend outage does not silently lose events.
* Manual scoring remains available.
* Completed matches reject further authoritative OCR events.

### Performance

Benchmark using recorded gameplay.

Measure:

```text
capture → OCR
OCR → event
event → backend
backend → leaderboard
leaderboard → WebSocket
end-to-end latency
```

Do not mark the feature production-ready without benchmark results.

---

# 60. FINAL ENGINEERING PRINCIPLE

The finished system must follow this rule:

```text
PRE-CONFIGURE IDENTITY
        +
FAST COMPUTER VISION
        +
OCR ONLY WHERE NEEDED
        +
TEMPORAL VALIDATION
        +
CONFIDENCE
        +
SERVER-SIDE VALIDATION
        +
HUMAN REVIEW
        +
AUTHORITATIVE SCORING
```

The Python worker is an **event detector**, not the tournament authority.

Spring Boot remains the authority.

MySQL remains the durable source of truth.

Redis remains the low-latency/live-state layer.

STOMP/WebSocket remains the real-time distribution mechanism.

React remains the operational UI.

OBS consumes the same authoritative live data.

Implement this architecture without replacing the existing Riftora platform structure.
