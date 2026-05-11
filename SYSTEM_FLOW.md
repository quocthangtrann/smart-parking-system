# Smart Parking System - End-to-End Operational Flow

This document maps out the comprehensive end-to-end operational flow of the Smart Parking System. The technology stack consists of a **React Frontend**, a **Node.js/Express Backend**, an **SQLite Database** (via Sequelize), and a **Python IoT Simulator** communicating via **MQTT**.

---

## 1. High-Level System Architecture

This architecture diagram illustrates how all core components of the system interconnect. It highlights the dual communication protocols used: **REST APIs** for standard CRUD operations and **Socket.io/MQTT** for real-time bidirectional data flow.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#8CC84B,stroke:#333,stroke-width:2px,color:#000
    classDef database fill:#003B57,stroke:#333,stroke-width:2px,color:#fff
    classDef iot fill:#FFD43B,stroke:#333,stroke-width:2px,color:#000
    classDef broker fill:#E91E63,stroke:#333,stroke-width:2px,color:#fff

    %% Components
    subgraph Web_Client [React Web Application]
        UI_Admin[Admin Dashboard]:::frontend
        UI_User[Student/Lecturer UI]:::frontend
    end

    subgraph Server [Node.js / Express Backend]
        API_Layer[REST API Endpoints]:::backend
        Socket_Layer[Socket.io Server]:::backend
        MQTT_Client[MQTT Listener/Publisher]:::backend
    end

    DB[(SQLite Database<br/>Sequelize ORM)]:::database
    Broker((MQTT Broker<br/>Port 1883)):::broker

    subgraph IoT_Edge [Python IoT Simulator]
        Gateway[IoT Gateway / RFID Reader]:::iot
        Sensors[Parking Slot Sensors]:::iot
    end

    %% Connections
    UI_Admin <-->|HTTP/REST| API_Layer
    UI_User <-->|HTTP/REST| API_Layer
    
    UI_Admin <-->|WebSocket/Socket.io| Socket_Layer
    UI_User <-->|WebSocket/Socket.io| Socket_Layer

    API_Layer <-->|Read/Write| DB
    MQTT_Client <-->|Read/Write| DB

    MQTT_Client <-->|Subscribe/Publish| Broker
    Gateway <-->|Publish/Subscribe| Broker
    Sensors -->|Telemetry| Gateway
```

**Explanation:**
- The **React Web Application** serves different views for Admins and standard Users (Students/Lecturers).
- The **Node.js Backend** exposes REST APIs for persistent data (users, policies) and uses Socket.io to push live updates to the frontend.
- The **SQLite Database** acts as the central source of truth for all structured data.
- The **Python IoT Simulator** mimics physical hardware (RFID readers, proximity sensors) and streams data to the Node.js backend via an **MQTT Broker**.

---

## 2. IoT Vehicle Entry/Exit & Real-time Flow

This sequence diagram maps the exact flow of data from the moment a vehicle scans an RFID card at a physical gate, all the way to the UI update on the user's phone or admin dashboard.

```mermaid
sequenceDiagram
    autonumber
    actor Driver
    participant Python IoT as IoT Simulator (RFID)
    participant MQTT as MQTT Broker
    participant Node Backend as Backend (MQTT Listener)
    participant SQLite as Database
    participant Socket as Socket.io Server
    participant React UI as Frontend App

    Driver->>Python IoT: Scans RFID Card
    Python IoT->>MQTT: Publish topic 'parking/gate/entry' (Plate, Time)
    MQTT->>Node Backend: Deliver Message
    
    Node Backend->>SQLite: Query User/Vehicle by Plate
    SQLite-->>Node Backend: Return Vehicle Data
    
    alt is Entry
        Node Backend->>SQLite: Create new Parking Session
        Node Backend->>SQLite: Update Slot Status to 'Occupied'
        SQLite-->>Node Backend: Confirm Save
    else is Exit (Checkout)
        Node Backend->>SQLite: Fetch Active Session & Fee Policy
        SQLite-->>Node Backend: Return Policy
        Node Backend->>Node Backend: Calculate Parking Fee
        Node Backend->>SQLite: Update Session (Exit Time), Create Invoice
        Node Backend->>SQLite: Update Slot Status to 'Empty'
        SQLite-->>Node Backend: Confirm Save
    end

    Node Backend->>Socket: Emit 'session_update' & 'slot_update'
    Socket->>React UI: Broadcast live event
    React UI->>React UI: Re-render SlotGrid / Session Details
```

**Explanation:**
1. A driver presents an RFID card (simulated by Python script).
2. The Python script publishes the scan event to the MQTT broker.
3. The Node.js backend, listening to the broker, receives the payload and checks the SQLite database.
4. If it's an entry, a new session is created. If it's an exit, the system calculates the fee based on the duration and policy, then generates an invoice.
5. The backend emits an event via Socket.io to all connected web clients.
6. The React frontend instantly updates the parking map and session history without requiring a page refresh.

---

## 3. Authentication & Authorization Flow

This sequence diagram illustrates the secure login process using JSON Web Tokens (JWT) to ensure that users only access permitted resources.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React UI as Frontend App
    participant Node Backend as Express Server
    participant SQLite as Database

    User->>React UI: Enters Username & Password
    React UI->>Node Backend: POST /api/auth/login
    Node Backend->>SQLite: Query user by username
    
    alt User not found or Invalid Password
        SQLite-->>Node Backend: Return null / Hash mismatch
        Node Backend-->>React UI: 401 Unauthorized
        React UI-->>User: Show Error Message
    else Credentials Valid
        SQLite-->>Node Backend: Return User Object (Role, ID)
        Node Backend->>Node Backend: Sign JWT Payload (Secret Key)
        Node Backend-->>React UI: 200 OK + JWT Token + User Data
        React UI->>React UI: Save Token to LocalStorage/Context
        React UI-->>User: Redirect to Role Dashboard
    end

    Note over User, SQLite: Accessing Protected Routes
    User->>React UI: Clicks on 'History Billing'
    React UI->>Node Backend: GET /api/billing (Header: Bearer Token)
    Node Backend->>Node Backend: Verify JWT Signature
    Node Backend->>SQLite: Fetch Data
    SQLite-->>Node Backend: Return Data
    Node Backend-->>React UI: 200 OK + JSON Payload
```

**Explanation:**
1. The user submits credentials which are verified against the hashed password in SQLite.
2. Upon success, the Node.js server generates a JWT containing the user's identity and role.
3. The React frontend stores this token and attaches it as a `Bearer` header to all subsequent API requests.
4. The backend middleware verifies the JWT on protected routes before querying the database, ensuring strict authorization control between Admin, Student, and Lecturer roles.

---

## 4. Dynamic Fee Policy & Billing Flow

This flowchart demonstrates the logic engine used to calculate dynamic parking fees based on temporal conditions (e.g., time of day, day of the week) configured by the Admin.

```mermaid
graph TD
    Start([Vehicle Exits Gate]) --> ReadTime[Read Checkout Time & Vehicle Type]
    ReadTime --> QueryDB[(Fetch Active Fee Policy from SQLite)]
    QueryDB --> CheckDay{Is it Weekend?}
    
    CheckDay -- Yes --> CalcWeekend[Apply Weekend Flat Rate]
    CheckDay -- No --> CheckTime{Checkout Time Before 6:00 PM?}
    
    CheckTime -- Yes --> CalcDay[Apply Daytime Rate]
    CheckTime -- No --> CalcNight[Apply Evening Rate]
    
    CalcDay --> Invoice[Generate Invoice Record]
    CalcNight --> Invoice
    CalcWeekend --> Invoice
    
    Invoice --> SaveDB[(Save to Billing Table)]
    SaveDB --> EmitSocket[Emit 'new_invoice' via Socket.io]
    EmitSocket --> End([React UI Displays Unpaid Bill])
```

**Explanation:**
1. When a vehicle exits, the system determines the exact exit timestamp and the type of vehicle (Car/Motorbike).
2. It fetches the currently active `FeePolicy` from the database.
3. The logic tree checks if the current day is a weekend. If not, it checks if the exit time is before or after the 6:00 PM threshold.
4. The calculated rate is used to generate a new billing invoice, which is saved to the database.
5. Finally, a real-time event alerts the user's app that they have a new pending payment.

---

## 5. Admin Dashboard & Device Monitoring Flow

This flowchart explains how the Admin Dashboard maintains a live overview of system health by combining historical data with real-time heartbeat monitoring of physical IoT hardware.

```mermaid
flowchart LR
    Admin([Admin Opens Dashboard]) --> FetchStats[GET /api/analytics]
    FetchStats --> DB[(SQLite Database)]
    DB --> ReturnStats[Return Revenue, Users, Occupancy]
    ReturnStats --> RenderUI[Render Charts & Metrics]
    
    subgraph Real-Time IoT Monitoring
        Device[IoT Gate Sensor] -- MQTT Heartbeat (Every 30s) --> MQTT_Broker((MQTT Broker))
        MQTT_Broker --> Backend[Node.js Listener]
        Backend -- Update Timestamp --> DB
        Backend -- emit 'device_update' --> Socket[Socket.io]
    end
    
    Socket -.->|Push live status| RenderUI
    
    RenderUI --> CheckStatus{Timestamp < 60s?}
    CheckStatus -- Yes --> DisplayOnline[Display 'ONLINE' 🟢]
    CheckStatus -- No --> DisplayOffline[Display 'OFFLINE' 🔴]
```

**Explanation:**
1. Upon loading the dashboard, the React app makes a standard REST call to retrieve aggregated analytics (e.g., total revenue, daily occupancy).
2. Concurrently, IoT devices publish lightweight "heartbeat" messages to the MQTT broker every 30 seconds.
3. The Node.js backend processes these heartbeats and broadcasts them to the Admin UI via Socket.io.
4. The frontend evaluates the last seen timestamp. If a device hasn't checked in within 60 seconds, its status automatically degrades to "Offline", allowing admins to instantly spot hardware failures.
