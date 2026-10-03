---
description: page audit plan
---

Perform a comprehensive UI/UX and data-binding audit of the current webpage. Please structure your analysis according to the following framework:

### 1. Data Binding Audit
Identify all hardcoded content (text, images, lists). For each, specify the recommended dynamic source (e.g., API endpoint, state variable, or prop).

### 2. UI & Layout Analysis
Review the JSX structure and Tailwind CSS classes. Highlight:
- Responsiveness gaps and layout misalignments.
- Missing edge-case states (loading skeletons, empty states, error states).
- Inconsistencies in hover/focus effects.

### 3. Interaction & Behavioral Logic
Document the interaction model for components (buttons, forms, navigation). Define:
- Expected routing and action logic.
- Necessary API integration requirements.
- Validation and error-handling strategies.

### 4. UX Enhancement Proposals
Suggest specific improvements to boost user engagement, such as micro-interactions, motion transitions, or contextual iconography.

### 5. Implementation Roadmap
Provide a prioritized action plan to transition the code to production-ready status. Categorize items by impact (Critical vs. Enhancement) and describe the technical steps for each fix.