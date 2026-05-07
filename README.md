# Smart Parking System - Complete Fullstack Suite

A comprehensive Smart Parking Management System integrating IoT simulation, real-time backend monitoring, and a professional React-based administration and mobile interface.

## 📁 Project Structure
```text
smart-parking-system/
├── smart-parking-backend/   # Node.js + Express + SQLite + Socket.io
├── smart-parking-web/       # React (Vite) + Tailwind CSS
└── fake-parking-place/      # IoT Simulation (Python + MQTT)
```

## 🛠 Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons, Leaflet.js, Socket.io-client.
- **Backend**: Node.js, Express, Sequelize, SQLite3, Socket.io, MQTT.js.
- **IoT Simulation**: Python, Paho-MQTT, Mock sensor scripts.

## 🏁 Startup Instructions

### 1. Initialize & Start Backend
Open a terminal in `smart-parking-backend`:
```bash
cd smart-parking-backend
npm install
npm run seed     # Initialize database with sample accounts
npm run dev      # Start backend on port 5000
```

### 2. Start Frontend
Open a terminal in `smart-parking-web`:
```bash
cd smart-parking-web
npm install
npm run dev      # Start frontend on port 5173
```

### 3. Start IoT Simulation
Open a terminal in `fake-parking-place`:
```bash
cd fake-parking-place
# 1. Start MQTT Broker
python MQTT_broker.py
# 2. Start Simulator App
python Fake_parking/simulator_app.py
```

## 🔑 Sample Accounts (Password: 123)
- **Student**: `student1`, `student2`, `student3`
- **Lecturer**: `lecturer1`, `lecturer2`
- **Admin**: `admin1`, `admin2`

## 📡 Real-time Logic
- **Slot States**: Green (Available), Gray (Empty/Inactive), Red (Error), Purple (Reserved).
- **IoT Connection**: Simulated sensors publish to MQTT, backend bridges data to frontend via Socket.io.
- **Auth**: JWT-based login with role-based routing (Student/Lecturer/Admin).
