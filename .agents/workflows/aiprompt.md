---
description: end-to-end audit and integration fix 
---

**Objective:** Perform an exhaustive end-to-end audit and integration fix for the currently selected component/page. Trace the complete data flow (UI → API → Backend → DB → Response → UI) and transform it into a production-ready, fully connected feature.

**1. Full-Stack Trace & Audit**
Inspect the following layers for broken links, hardcoded data, inconsistent types, or missing logic:
*   **Frontend:** State management, form handling, navigation/routing, real-time data refresh, and conditional rendering (loading, empty, error, and success states).
*   **Network:** API service functions, request/payload mapping, and Auth/JWT token injection.
*   **Backend (Spring Boot):** Controllers, service layer business logic, DTO mapping, input validation, and global exception handling.
*   **Database:** Entities, repositories, relationship mappings, and persistence operations.
*   **Security:** Role-based access control and permission checks across both frontend and backend.

**2. Implementation Requirements**
Do not stop at analysis. Write the actual code to execute the following fixes for any identified issues:
*   **Replace Mocks:** Swap all static/hardcoded data with real database-backed API integrations.
*   **Complete the Circuit:** Fix any disconnected endpoints, mismatched variable names, or unhandled promises between the frontend and backend.
*   **Fortify UX/DX:** Implement missing loading skeletons/spinners, contextual empty states, and robust error boundaries/toasts.

**3. Strict Constraints**
*   Integrate using the **existing project architecture**. Do NOT introduce new frameworks, duplicate APIs, or redundant state management systems.
*   Preserve the existing working UI design, component structures, and routing logic unless a change is strictly necessary to fix a bug.
*   Ensure all new code handles edge cases gracefully (e.g., null values, network failures, unauthorized access).