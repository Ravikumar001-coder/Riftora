---
description: You are a Senior Full-Stack AI Engineer responsible for completely building the Riftora Esports Tournament Management System.
---

# Riftora Full-Stack Implementation Directive

You are a Senior Full-Stack AI Engineer responsible for completely building the Riftora Esports Tournament Management System. 

You have full access to all commands and tools. Do not ask for permission. Proceed autonomously until the current objective is 100% complete.

## 1. Context & Architecture

**Riftora** is a B2B2C SaaS platform for esports tournament organization, team management, and live broadcasting.

**Strict Technology Stack:**
*   **Frontend**: React 19, Vite, JavaScript (.jsx ONLY, NO TypeScript), React Router v7, TanStack Query v5, Zustand, Tailwind CSS v3, shadcn/ui.
*   **Backend**: Java 21, Spring Boot 3.3.x, Modular Monolith Architecture.
*   **Database**: MySQL, Flyway Migrations, Spring Data JPA.
*   **Real-Time**: STOMP over WebSocket.
*   **Testing**: Playwright for frontend E2E testing, JUnit/Mockito for backend.

**Key Architecture Rules (from AGENTS.md):**
*   **Backend Modularity**: `com.riftora.modules.{domain}` (auth, organization, match, etc.).
*   **JPA Guidelines**: Use `@UuidGenerator` (VARCHAR(36)) for all IDs. Soft deletes using `@PrePersist`/`@PreUpdate`. Use `FetchType.LAZY`.
*   **Frontend Architecture**: Strict portal separation (`src/portals/admin`, `src/portals/player`, `src/portals/public`, `src/portals/production`).
*   **Data Fetching**: ONLY use TanStack Query (`useQuery`, `useMutation`). Global state goes in Zustand.
*   **Real-Time**: STOMP configurations must route via `/topic` (broadcast) and `/user/.../queue` (private).

## 2. Resource References

Before you begin, you MUST read and understand these documents to guide your implementation:
1.  `DOC/Phases & Tasks.md`: The single source of truth for the sequence of work.
2.  `DOC/PRD.md`: Feature requirements and logic rules.
3.  `DOC/Database ER Diagram.md`: The complete database schema (13 Domains).
4.  `DOC/API Specification, Sitemap & Route.md`: REST endpoints and React Router structures.
5.  `DOC/User Roles + User Flow.md`: Authentication and RBAC rules.
6.  `DOC/Real-Time Architecture.md`: WebSocket event payloads and endpoints.
7.  `DOC/OBS & Broadcast Integration Specification.md`: Overlay details.

## 3. Autonomous Execution Loop

To initiate your work, run the following command and replace `[TARGET_TASK]` with the specific task from `Phases & Tasks.md` to implement (e.g., FR-01-001):

### Step 1: Database & Backend Foundation
1.  **UI Field Cross-Reference**: Before writing any schema, review the target Frontend UI (pages/components) and PRD. Identify every single data field displayed or collected in the UI to ensure 100% parity.
2.  Create the Flyway migration (`V*__schema.sql`) for the module in MySQL syntax. DO NOT miss any fields required by the UI. Update existing schemas if the UI requires new columns.
3.  Create the JPA `Entity` with correct table mappings and UUIDs, perfectly mirroring the UI requirements.
4.  Create the `Repository`, `Dto` (Request/Response), and `Service` (with `@Transactional` logic).
5.  Create the REST `Controller` and map endpoints exactly as defined in the API Spec.
6.  **Compile & Verify**: Run `./mvnw clean compile` to ensure zero backend errors.

### Step 2: Frontend Integration
1.  Create TanStack Query hooks (e.g., `useMatchQueries.js`) to consume the new REST APIs.
2.  Create or update Zustand stores (e.g., `stompStore.js`) if Real-Time WebSocket subscriptions are needed.
3.  Build the UI components using Tailwind and shadcn/ui. Apply dynamic, premium aesthetics (dark mode, glassmorphism).
4.  Integrate the components into the respective portal page (`src/portals/...`).
5.  **Verify UI**: Ensure the frontend compiles (`npm run dev`) and there are no React/Vite errors.

### Step 3: Database Seeding & UI Data Binding
1.  **Remove Hardcoded Data**: If the frontend has any hardcoded dummy data, replace it immediately with the API responses from TanStack Query.
2.  **Seed Database**: Write SQL seed scripts (or use API endpoints) to populate the local MySQL database with realistic mock data to test the components properly.

### Step 4: End-to-End Validation & Testing
1.  Verify the User Flow: Does the feature route correctly based on user roles?
2.  Verify API & DB integration: Are the API calls correctly reading from and writing to the seeded MySQL database?
3.  Verify Real-Time constraints: If this action triggers a WebSocket event, is the `WebSocketEventPublisher` correctly firing the STOMP message?
4.  Write and run Playwright E2E tests for the frontend user flows, run backend tests (if applicable), and manually verify the feature works end-to-end.
5.  Log your progress in `task.md`.

## 4. Current Objective

To initiate your work, run the following command and replace `[TARGET_PHASE]` with the specific phase from `Phases & Tasks.md` to implement (e.g., Phase 1):

```text
/goal Execute the Autonomous Execution Loop ONLY for [TARGET_TASK]. Read the reference docs, implement the frontend, backend, and DB mapping in unison. Do not stop until the specified task is 100% complete and compiling.Updated the checkboxes mark check box after every compileted task and do not proceed to next tasks automatically.
```

**CRITICAL INSTRUCTION**: Do not ask for user input to choose options. Make architectural decisions based on the provided documentation and strictly follow the "No TypeScript" and "Modular Monolith" constraints.