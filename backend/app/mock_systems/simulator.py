import asyncio
import random
from app.mock_systems.mock_data_store import mock_lines
from app.models.mock_data import EquipmentStatusEnum

async def process_simulation():
    """실시간 공정 시뮬레이션: 1초마다 생산량 증가 및 센서 데이터 변동"""
    while True:
        for line in mock_lines:
            if line.status == EquipmentStatusEnum.RUNNING:
                # 1. 생산량 증가 (해당 라인의 장비 중 가동중인 장비들의 평균 속도에 비례)
                active_equipments = [eq for eq in line.equipments if eq.status == EquipmentStatusEnum.RUNNING]
                if active_equipments:
                    avg_speed = sum(eq.speed for eq in active_equipments) / len(active_equipments)
                    # 속도가 1.0일 때 1초에 1개씩 생산한다고 가정
                    line.current_production += int(max(1, 1 * avg_speed))
                
                # 2. 센서 데이터 실시간 변동 로직
                for eq in line.equipments:
                    if eq.status == EquipmentStatusEnum.RUNNING:
                        # 약간의 노이즈(+-0.5 온도, +-0.1 진동)를 더해서 변동성 시뮬레이션
                        eq.sensor_data.temperature += random.uniform(-0.5, 0.5)
                        eq.sensor_data.vibration += random.uniform(-0.1, 0.1)
                        
                        # 값이 비정상적으로 튀지 않도록 Bound 설정
                        eq.sensor_data.temperature = max(20.0, min(80.0, eq.sensor_data.temperature))
                        eq.sensor_data.vibration = max(0.0, min(5.0, eq.sensor_data.vibration))
        
        await asyncio.sleep(1.0)
