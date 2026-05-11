# Implementation Plan - QA Automation Suite

This plan outlines the implementation of a comprehensive automation testing suite for the Smart Parking System, covering API validation and End-to-End (E2E) UI journeys.

## User Review Required

> [!IMPORTANT]
> **Dependencies**: Running these tests will require `jest`, `supertest` in the backend, and `selenium`, `pytest`, `webdriver-manager` for Python. I will provide instructions to install these.
> [!WARNING]
> **Database Reset**: API tests will use a temporary SQLite database to avoid corrupting your production `database.sqlite`.

## Proposed Changes

### 1. Backend API Automation (`smart-parking-backend/`)
We will use **Jest** and **Supertest** to validate all REST endpoints.

#### [NEW] [auth.test.js](file:///Users/leuyentran/Downloads/smart-parking-system/smart-parking-backend/tests/api/auth.test.js)
*   Tests for Login success/failure.
*   Token validation.

#### [NEW] [vehicles.test.js](file:///Users/leuyentran/Downloads/smart-parking-system/smart-parking-backend/tests/api/vehicles.test.js)
*   CRUD operations for vehicles.
*   Validation for mandatory fields (License Plate, Owner).

#### [NEW] [billing.test.js](file:///Users/leuyentran/Downloads/smart-parking-system/smart-parking-backend/tests/api/billing.test.js)
*   Testing the `PATCH /pay` endpoint.
*   Verifying invoice status transitions.

#### [NEW] [setup.js](file:///Users/leuyentran/Downloads/smart-parking-system/smart-parking-backend/tests/api/setup.js)
*   Global setup to initialize an in-memory or temporary SQLite DB for testing.

---

### 2. Frontend E2E Automation (`e2e_tests/`)
We will use **Selenium (Python)** to simulate real browser interactions.

#### [NEW] [test_user_flow.py](file:///Users/leuyentran/Downloads/smart-parking-system/e2e_tests/test_user_flow.py)
*   **Journey**: Login -> Add Vehicle -> View History -> Logout.
*   Assertions on DOM elements (success messages, table rows).

#### [NEW] [test_admin_flow.py](file:///Users/leuyentran/Downloads/smart-parking-system/e2e_tests/test_admin_flow.py)
*   **Journey**: Login as Admin -> Monitor Slots -> Verify Device Status.
*   Real-time check: Asserting that slot color changes after an MQTT event (using a subprocess to trigger the simulator).

---

### 3. Documentation
#### [NEW] [TESTING_README.md](file:///Users/leuyentran/Downloads/smart-parking-system/TESTING_README.md)
*   Step-by-step guide to installing `pytest`, `selenium`, and `jest`.
*   Commands to run specific suites.

## Verification Plan

### Automated Tests
1.  **Backend**: Run `npm test` inside `smart-parking-backend`.
2.  **Frontend**: Run `pytest e2e_tests/` (requires Chrome/ChromeDriver).

### Manual Verification
*   Confirm that the test database cleanup works correctly.
*   Verify that Selenium opens the browser and performs the clicks as expected.
