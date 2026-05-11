# 🧪 Smart Parking System - Testing Guide

This project includes a comprehensive automation suite covering Backend APIs and Frontend End-to-End (E2E) flows.

---

## 🛠️ Prerequisites

### 1. Backend Dependencies (Jest)
Install dependencies in the `smart-parking-backend` directory:
```bash
cd smart-parking-backend
npm install --save-dev jest supertest
```

### 2. Frontend E2E Dependencies (Python)
Install Python dependencies (ensure you are using the correct Python interpreter):
```bash
pip install pytest selenium webdriver-manager
```

---

## 🏃 Running Tests

### 1. API Tests (Backend)
These tests validate your REST endpoints and database logic.
```bash
cd smart-parking-backend
npm test
```

### 2. E2E UI Tests (Frontend)
**Important**: Ensure the Backend, Frontend, and MQTT Broker are all running before starting E2E tests.
```bash
# Run all E2E tests
pytest e2e_tests/

# Run a specific test with visible browser output
pytest e2e_tests/test_user_flow.py -s
```

---

## 📂 Test Architecture

### Backend API (`smart-parking-backend/tests/api/`)
*   `setup.js`: Database synchronization.
*   `auth.test.js`: Validates login and JWT tokens.
*   `vehicles.test.js`: Validates CRUD operations for vehicles.
*   `billing.test.js`: Validates payment processing.

### Frontend E2E (`e2e_tests/`)
*   `conftest.py`: Selenium WebDriver setup and base configuration.
*   `test_user_flow.py`: Tests the user journey from Login to Vehicle management.
*   `test_admin_flow.py`: Tests the admin dashboard and live slot monitoring.

---

## ⚠️ Notes
*   **Headless Mode**: To run E2E tests without opening a browser window, uncomment `options.add_argument("--headless")` in `e2e_tests/conftest.py`.
*   **Database**: API tests are designed to sync the database with `force: true`. Be careful if running these in a production environment.
