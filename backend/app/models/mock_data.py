from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SensorData(BaseModel):
    temperature: float
    pressure: float
    vibration: float

class EquipmentStatus(BaseModel):
    equipment_id: str
    name: str
    status: str  # "running", "stopped", "error"
    speed: float # e.g. conveyor belt speed
    sensor_data: SensorData

class ProductionLine(BaseModel):
    line_id: str
    name: str
    status: str  # "running", "stopped", "maintenance"
    equipments: List[EquipmentStatus]
    defect_rate: float
    target_production: int
    current_production: int

class ErrorLog(BaseModel):
    log_id: str
    equipment_id: str
    error_code: str
    message: str
    timestamp: datetime
    resolved: bool
