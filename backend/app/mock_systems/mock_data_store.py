from datetime import datetime
from app.models.mock_data import ProductionLine, EquipmentStatus, SensorData, ErrorLog

# 가상 생산 라인 데이터
mock_lines = [
    ProductionLine(
        line_id="line_1",
        name="제 1 조립 라인",
        status="running",
        equipments=[
            EquipmentStatus(
                equipment_id="eq_101",
                name="초기 가공 프레스",
                status="running",
                speed=1.5,
                sensor_data=SensorData(temperature=25.5, pressure=1.0, vibration=0.5)
            ),
            EquipmentStatus(
                equipment_id="eq_102",
                name="조립 로봇 암 A",
                status="running",
                speed=1.0,
                sensor_data=SensorData(temperature=45.2, pressure=2.1, vibration=1.2)
            )
        ],
        defect_rate=0.02,
        target_production=1000,
        current_production=450
    ),
    ProductionLine(
        line_id="line_2",
        name="제 2 포장 라인",
        status="running",
        equipments=[
            EquipmentStatus(
                equipment_id="eq_201",
                name="자동 포장기",
                status="running",
                speed=2.0,
                sensor_data=SensorData(temperature=30.0, pressure=1.5, vibration=0.8)
            )
        ],
        defect_rate=0.05,
        target_production=800,
        current_production=300
    )
]

# 가상 에러 로그 데이터
mock_logs = [
    ErrorLog(
        log_id="log_001",
        equipment_id="eq_102",
        error_code="ERR_TEMP_HIGH",
        message="로봇 암 A 모터 온도 경고 임계치 초과",
        timestamp=datetime.now(),
        resolved=False
    ),
    ErrorLog(
        log_id="log_002",
        equipment_id="eq_201",
        error_code="ERR_VIB_WARN",
        message="포장기 진동 수치 불안정",
        timestamp=datetime.now(),
        resolved=True
    )
]
