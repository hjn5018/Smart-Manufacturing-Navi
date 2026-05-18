from fastapi import APIRouter, HTTPException, Body
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.mock_data import ProductionLine, ErrorLog, ControlActionEnum, EquipmentStatusEnum
from app.mock_systems.mock_data_store import mock_lines, mock_logs

router = APIRouter()

DEFAULT_SPEED = 1.0

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
    equipment_id: str = Field(..., description="제어할 설비의 ID (예: eq_101)")
    action: ControlActionEnum = Field(..., description="수행할 제어 명령 (start, stop, set_speed)")
    value: Optional[float] = Field(None, description="set_speed 명령 시 설정할 속도 값 (start/stop 시 생략 가능)")

@router.post("/control")
def control_equipment(
    req: ControlRequest = Body(
        ...,
        openapi_examples={
            "start_equipment": {
                "summary": "설비 가동 (Start)",
                "value": {
                    "equipment_id": "eq_101",
                    "action": "start"
                }
            },
            "stop_equipment": {
                "summary": "설비 정지 (Stop)",
                "value": {
                    "equipment_id": "eq_101",
                    "action": "stop"
                }
            },
            "set_speed": {
                "summary": "속도 변경 (Set Speed)",
                "value": {
                    "equipment_id": "eq_101",
                    "action": "set_speed",
                    "value": 1.5
                }
            }
        }
    )
):
    """설비 제어 요청 (PLC Mock)"""
    for line in mock_lines:
        for eq in line.equipments:
            if eq.equipment_id == req.equipment_id:
                if req.action == ControlActionEnum.STOP:
                    eq.status = EquipmentStatusEnum.STOPPED
                    eq.speed = 0.0
                elif req.action == ControlActionEnum.START:
                    eq.status = EquipmentStatusEnum.RUNNING
                    eq.speed = req.value if req.value is not None else DEFAULT_SPEED
                elif req.action == ControlActionEnum.SET_SPEED and req.value is not None:
                    eq.speed = req.value
                return {"status": "success", "message": f"설비 {eq.name} 제어 완료", "equipment": eq}
    
    raise HTTPException(status_code=404, detail="Equipment not found")

@router.get("/logs", response_model=List[ErrorLog])
def get_error_logs():
    """오류 및 경고 로그 조회"""
    return mock_logs
