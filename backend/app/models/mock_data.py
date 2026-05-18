from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class EquipmentStatusEnum(str, Enum):
    RUNNING = "running"
    STOPPED = "stopped"
    ERROR = "error"
    MAINTENANCE = "maintenance"

class ControlActionEnum(str, Enum):
    START = "start"
    STOP = "stop"
    SET_SPEED = "set_speed"

class SensorData(BaseModel):
    temperature: float
    pressure: float
    vibration: float

class EquipmentStatus(BaseModel):
    equipment_id: str
    name: str
    status: EquipmentStatusEnum
    speed: float # e.g. conveyor belt speed
    sensor_data: SensorData

class ProductionLine(BaseModel):
    line_id: str
    name: str
    status: EquipmentStatusEnum
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
