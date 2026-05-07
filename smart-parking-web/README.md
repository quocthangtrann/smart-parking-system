# Smart Parking System - Admin & Mobile Web

A professional, high-performance web application for managing and monitoring smart parking infrastructure. This project features a comprehensive Admin Dashboard and a responsive Mobile UI for Students and Lecturers.

## 🚀 Features

### Admin Dashboard
*   **Infrastructure Monitoring**: Real-time map-based oversight of parking gates and hardware status.
*   **Device Management**: Detailed diagnostic monitoring for cameras, sensors, and barriers.
*   **Credential Management**: Centralized RFID card tracking and security blocking.
*   **Notification System**: Broadcast alerts to users with granular targeting (SMS, Email, Push).
*   **Fee Policy Management**: Flexible configuration of semester-based parking rates and rules.

### Mobile Experience
*   **Real-time Map**: Interactive parking availability view for students and lecturers.
*   **Digital Parking Card**: Dynamic QR-based identification for seamless entry/exit.
*   **Reservation System**: Dedicated slot booking for lecturers.
*   **Billing History**: Transparent oversight of parking sessions and payments.

## 🛠 Tech Stack
*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Maps**: Leaflet.js
*   **Routing**: React Router DOM

## 🏁 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm or yarn

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/smart-parking-system.git
    cd smart-parking-system/smart-parking-web
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Running the Application
*   **Development Mode**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

*   **Production Build**:
    ```bash
    npm run build
    ```
    The optimized assets will be generated in the `dist` folder.

## 📁 Project Structure
```text
src/
├── components/     # Reusable UI components (Maps, KPI cards, etc.)
├── layouts/        # Page wrappers (AdminLayout, MobileLayout)
├── pages/
│   ├── admin/      # Admin dashboard modules (Devices, Notifications, etc.)
│   ├── student/    # Student-specific mobile views
│   ├── lecturer/   # Lecturer-specific mobile views
│   └── shared/     # Common features (Map, Billing, Settings)
└── styles/         # Global CSS and themes
```

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
