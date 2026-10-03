---
description: test page/function/module end-to-end.**
---

**Integrate the currently selected page/function/module end-to-end.**

First inspect the existing frontend, backend, database schema, APIs, roles, and project docs. **Reuse existing architecture and code; do not create duplicates or mock APIs.**

Connect:

**React → API → Spring Boot Controller → Service → Repository/JPA → MySQL → API → React**

Implement all required:

* API integration
* Database/migrations if needed
* Authentication + RBAC
* Validation + business rules
* Loading/error/empty/success states
* WebSocket/STOMP if required
* Remove mock/hardcoded data where applicable

Then run the real application and test the selected functionality with **Playwright against the real frontend + backend + database**.

Test:

* Happy path
* Validation/errors
* Authorization
* Create/update/delete persistence
* Refresh/navigation
* Responsive UI
* Real-time behavior if applicable

Fix all failures and rerun tests until the selected functionality works end-to-end.

**Do not modify unrelated modules. Do not declare completion until Playwright passes and database persistence is verified.**
