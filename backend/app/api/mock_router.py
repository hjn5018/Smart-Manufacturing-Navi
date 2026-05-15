from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from app.models.mock_data import ProductionLine, ErrorLog
from app.mock_systems.mock_data_store import mock_lines, mock_logs

router = APIRouter()

@router.get("/lines", response_model=List[ProductionLine])
def get_all_lines():
    """모든 생산 라인의 상태를 조회 (SCADA/MES Mock)"""
    return mock_lines

@router.get("/lines/{line_id}", response_model=ProductionLine)
def get_line(line_id: str):
    """특정 생산 라인의 상세 정보 조회"""
    for line in mock_lines:
        if line.line_id == line_id:
            return line
    raise HTTPException(status_code=404, detail="Line not found")

class ControlRequest(BaseModel):
    equipment_id: str
    action: str  # "start", "stop", "set_speed"
    value: Optional[float] = None

@router.post("/control")
def control_equipment(req: ControlRequest):
    """설비 제어 요청 (PLC Mock)"""
    for line in mock_lines:
        for eq in line.equipments:
            if eq.equipment_id == req.equipment_id:
                if req.action == "stop":
                    eq.status = "stopped"
                    eq.speed = 0.0
                elif req.action == "start":
                    eq.status = "running"
                    eq.speed = req.value if req.value is not None else 1.0
                elif req.action == "set_speed" and req.value is not None:
                    eq.speed = req.value
                return {"status": "success", "message": f"설비 {eq.name} 제어 완료", "equipment": eq}
    
    raise HTTPException(status_code=404, detail="Equipment not found")

@router.get("/logs", response_model=List[ErrorLog])
def get_error_logs():
    """오류 및 경고 로그 조회"""
    return mock_logs
