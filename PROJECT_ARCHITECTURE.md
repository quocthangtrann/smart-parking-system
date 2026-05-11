# Smart Parking System - Project Architecture

This document provides a comprehensive overview of the project's folder structure and the purpose of each key file across the Backend, Frontend, and IoT Simulator modules.

---

## 📂 Root Directory
*   `README.md`: Basic project setup and running instructions.
*   `PROJECT_ARCHITECTURE.md`: (This file) Detailed architecture documentation.
*   `.gitignore`: Specifies files and folders to be ignored by Git.

---

## 🖥️ Backend (`smart-parking-backend/`)
The backend is built with **Node.js** and **Express**, using **Sequelize** as an ORM for the **SQLite** database. It handles API requests, MQTT message processing, and real-time Socket.io broadcasts.

### Core Files
*   `server.js`: The entry point. Initializes Express, Socket.io, and connects to the database and MQTT broker.
*   `database.sqlite`: The SQLite database file containing all persistent data.
*   `seed.js`: Database seeder script to populate initial users, slots, and devices.
*   `.env`: Environment variables (Port, MQTT Broker URL, etc.).

### Folders
*   `models/`: Defines database schemas using Sequelize (User, Vehicle, Slot, Session, Billing, Notification, Device).
*   `routes/`: Express API routes for different modules:
    *   `auth.js`: User authentication (Login/Role selection).
    *   `vehicles.js`: Vehicle registration and management.
    *   `billing.js`: Invoices and payment processing.
    *   `notifications.js`: User and system notifications.
    *   `sessions.js`: Real-time and historical parking sessions.
    *   `devices.js`: Management of IoT hardware status.
*   `services/`: Core business logic services:
    *   `mqttService.js`: **Critical Component**. Handles all incoming MQTT traffic from sensors/gates and updates the database & frontend via Socket.io.
*   `middleware/`: Express middleware (e.g., JWT authentication checks).

---

## 🌐 Frontend (`smart-parking-web/`)
A modern **React** application built with **Vite** and **Tailwind CSS**. It provides three distinct interfaces: **Admin**, **Lecturer**, and **Student**.

### Core Files
*   `main.jsx`: Entry point for React.
*   `App.jsx`: Main routing configuration using `react-router-dom`.
*   `api/config.js`: Centralized API and Socket.io configuration.

### Folders (`src/`)
*   `pages/`: UI Pages grouped by user role:
    *   `admin/`: Dashboard, Device management, Parking lot visualization, Policy settings.
    *   `student/` & `lecturer/`: Role-specific homepages and features like "Reserve Slot".
    *   `shared/`: Common features like `MyVehicle`, `Notifications`, `HistoryBilling`, and `DigitalCard`.
*   `layouts/`: Wrapper components for different user views (`AdminLayout`, `MobileLayout`).
*   `components/`: Reusable UI elements (`SharedMap`, `SharedUI`).
*   `assets/`: Images and static resources.

---

## 🤖 IoT Simulator (`fake-parking-place/`)
A **Python** suite that simulates physical hardware behavior (Sensors, Gates, RFID readers) using **PySide6** for the GUI and **Paho-MQTT** for communication.

### Core Files
*   `MQTT_broker.py`: A local MQTT broker script (if not using an external one like Mosquitto).
*   `Fake_parking/`:
    *   `simulator_app.py`: The core simulation logic. Manages device heartbeats, environmental alerts, and MQTT payload construction.
    *   `lot_a.py`, `lot_b.py`, `lot_c.py`: Entry scripts to launch specific simulated parking lots.

---

## 🔄 Data Flow Summary
1.  **Sensor/Gate Action**: User interacts with the Python Simulator (`lot_a.py`).
2.  **MQTT Publish**: Simulator sends a JSON payload to the MQTT Broker.
3.  **Backend Ingestion**: `mqttService.js` receives the message, updates `database.sqlite`.
4.  **Socket.io Broadcast**: Backend pushes the update to all connected web clients.
5.  **Frontend Update**: The React dashboard updates UI components (like `SlotGrid`) instantly without a page refresh.

---

## 🚀 Key API Endpoints
*   `POST /api/auth/login`: User authentication.
*   `GET /api/vehicles/user/:id`: Retrieve user vehicles.
*   `PATCH /api/billing/:id/pay`: Mark an invoice as paid.
*   `GET /api/sessions/user/:id/active`: Track current parking duration.
