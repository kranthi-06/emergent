# Emergent - Smart Agriculture IoT System

Emergent is a full-stack IoT solution designed for precision agriculture and automated irrigation control. It integrates ESP32-based hardware sensors with a responsive web dashboard to monitor environmental conditions in real-time and manage water usage efficiently.

![Dashboard Preview](frontend/public/dashboard-preview.png)

## Features

- **Real-Time Monitoring**: Live tracking of soil moisture, temperature, humidity, and pump status.
- **Automated Control**: Intelligent irrigation logic that triggers pumps based on configurable moisture thresholds.
- **Alert System**: Configurable SMS and Email notifications for critical events (e.g., low moisture, sensor disconnects).
- **Data Analytics**: Interactive charts to visualize historical trends and environmental patterns.
- **Offline Resilience**: Local caching ensures data remains visible even during temporary network interruptions.
- **Weather Integration**: Local weather forecasts integrated directly into the dashboard.

## Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **API**: Python FastAPI
- **Database**: MongoDB Atlas
- **Driver**: Motor (Async MongoDB driver)

### Hardware
- **Controller**: ESP32
- **Sensors**: Capacitive Soil Moisture, DHT11/22 (Temp/Humidity)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/kranthi-06/emergent.git
    cd emergent
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r ../requirements.txt
    ```
    Create a `.env` file in `backend/` with your database credentials:
    ```env
    MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
    DB_NAME=emergent_db
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend**
    ```bash
    # From backend directory
    uvicorn server:app --reload
    ```

2.  **Start the Dashboard**
    ```bash
    # From frontend directory
    npm run dev
    ```
    Access the dashboard at `http://localhost:5173`.

## Deployment

The project is configured for deployment on **Vercel**.
- The `vercel.json` handles the build and routing for both the React frontend and FastAPI backend.

## License

This project is licensed under the MIT License.
