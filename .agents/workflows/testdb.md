---
description: test DB
---

**Role:** 
Act as a Senior QA Automation Engineer and Full-Stack Tester. 

**Objective:** 
Verify that the data displayed on the user interface for `[Insert Application/Page Name, e.g., Riftora Dashboard]` is dynamically retrieved from the database via backend logic, accurately reflects the current state of the database, and contains zero hard-coded placeholder values.

## Verification Steps & Logic Checks

### 1. Network & API Interception
* **Action:** Monitor all outgoing XHR/Fetch requests upon page load using browser developer tools or an interception proxy.
* **Target:** Identify the specific API endpoints responsible for fetching the displayed metrics (e.g., active counts, lists, user profiles).
* **Validation:** Compare the JSON payload returned by the API with the exact values rendered on the UI. If the API returns a null, empty, or modified state, the UI must reflect this exact change immediately.

### 2. CRUD State Change (The Dynamic Test)
* **Action:** Trigger a state-changing action through the application (Create, Update, or Delete a record). 
* **Example:** If the UI shows "23 Pending Registrations", submit a new registration or approve an existing one.
* **Validation:** Refresh the target page (or observe the WebSocket update). Verify that the UI automatically updates the metric (e.g., to "24" or "22") without requiring code redeployment. If the number remains static, flag it as potentially hard-coded or cached improperly.

### 3. Database Cross-Referencing (If DB access is granted)
* **Action:** Execute a direct SQL/NoSQL query matching the business logic of the UI component.
* **Validation:** Ensure the raw count/data from the database matches the API response and UI. If the UI displays data filtered by a specific condition (e.g., `status = 'active'`), ensure the backend query applies this exact condition and doesn't just return a static mock array.

### 4. Edge Case & Zero-State Logic
* **Action:** Manipulate the database or API to return `0` items or an empty state.
* **Validation:** The UI should gracefully handle the empty state (e.g., showing "0 Active Tournaments" or "No data available") rather than breaking or defaulting to a hard-coded fallback number.

## Output Requirements
Provide a detailed report categorizing each inspected data point into one of the following statuses:
* **[PASS - Dynamic]:** Value matches API/DB and updates upon state change.
* **[FAIL - Hard-coded]:** Value does not change despite DB/API manipulation.
* **[FAIL - Logic Error]:** Value is dynamic, but calculates incorrectly (e.g., counting 'Rejected' items as 'Pending').