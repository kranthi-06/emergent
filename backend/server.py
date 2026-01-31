from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db_name = os.environ.get('DB_NAME', 'emergent_db')
db = client[db_name]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models


class SensorData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    temperature: float
    humidity: float
    soil_moisture: float
    pump_status: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SensorDataCreate(BaseModel):
    temperature: float
    humidity: float
    soil_moisture: float
    pump_status: str # The status REPORTED by the ESP32

class SensorResponse(BaseModel):
    id: str
    command: str # "ON" or "OFF"
    source: str # "AUTO" or "MANUAL" - useful for debugging/display
    valid_for_sec: int = 60 # Safety: Command expires if not refreshed

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class SystemConfig(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    auto_mode: bool = True
    moisture_threshold: float = 40.0
    manual_pump_state: bool = False # True = ON, False = OFF
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# --- Configuration Endpoints ---

@api_router.get("/config", response_model=SystemConfig)
async def get_config():
    # fetch the latest config
    config = await db.system_config.find_one({}, sort=[("updated_at", -1)])
    if not config:
        # Return default if no config exists
        return SystemConfig()
    return SystemConfig(**config)

@api_router.post("/config", response_model=SystemConfig)
async def update_config(config: SystemConfig):
    doc = config.model_dump()
    doc['updated_at'] = datetime.now(timezone.utc)
    # Store history of config changes
    await db.system_config.insert_one(doc)
    return config

# --- Sensor & Logic Endpoints ---

@api_router.post("/sensors", response_model=SensorResponse)
async def create_sensor_data(input: SensorDataCreate):
    # 1. Save the Sensor Data
    data_dict = input.model_dump()
    data_obj = SensorData(**data_dict)
    
    doc = data_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.sensor_readings.insert_one(doc)
    
    # 2. Get Current Configuration (The "Brain")
    config_doc = await db.system_config.find_one({}, sort=[("updated_at", -1)])
    if not config_doc:
        config = SystemConfig() # Use defaults if nothing found
    else:
        config = SystemConfig(**config_doc)
    
    # 3. Decision Logic
    command = "OFF"
    source = "AUTO"
    
    if config.auto_mode:
        source = "AUTO"
        # Automatic Logic
        if input.soil_moisture < config.moisture_threshold:
            command = "ON"
        else:
            command = "OFF"
    else:
        source = "MANUAL"
        # Manual Logic
        if config.manual_pump_state:
            command = "ON"
        else:
            command = "OFF"

    # 4. Return the command to the ESP32
    return SensorResponse(
        id=data_obj.id, 
        command=command,
        source=source,
        valid_for_sec=60 # Command is valid for 1 minute
    )

@api_router.get("/sensors", response_model=List[SensorData])
async def get_sensor_data():
    # Get the latest 20 readings, sorted by timestamp descending
    readings = await db.sensor_readings.find({}, {"_id": 0}).sort("timestamp", -1).to_list(20)
    
    for reading in readings:
        if isinstance(reading['timestamp'], str):
            reading['timestamp'] = datetime.fromisoformat(reading['timestamp'])
    
    return readings

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()