import asyncio
import random
from app.mock_systems.mock_data_store import mock_lines
from app.models.mock_data import EquipmentStatusEnum

async def process_simulation():
    """실시간 공정 시뮬레이션: 1초마다 생산량 증가 및 센서 데이터 변동"""
    while True:
        for line in mock_lines:
            if line.status == EquipmentStatusEnum.RUNNING:
                active_equipments = [eq for eq in line.equipments if eq.status == EquipmentStatusEnum.RUNNING]
                
                # 1. 센서 데이터 실시간 변동 및 불량률 계산
                total_defect_penalty = 0.0
                for eq in line.equipments:
                    if eq.status == EquipmentStatusEnum.RUNNING:
                        # 약간의 노이즈(+-0.5 온도, +-0.1 진동)를 더해서 변동성 시뮬레이션
                        eq.sensor_data.temperature += random.uniform(-0.5, 0.5)
                        eq.sensor_data.vibration += random.uniform(-0.1, 0.1)
                        
                        # 값이 비정상적으로 튀지 않도록 Bound 설정
                        eq.sensor_data.temperature = max(20.0, min(80.0, eq.sensor_data.temperature))
                        eq.sensor_data.vibration = max(0.0, min(5.0, eq.sensor_data.vibration))
                        
                        # 적정 온도(약 40도)와 진동(약 1.0)을 벗어날수록 불량률 증가 (패널티)
                        temp_diff = abs(eq.sensor_data.temperature - 40.0)
                        vib_diff = abs(eq.sensor_data.vibration - 1.0)
                        
                        if temp_diff > 10.0:
                            total_defect_penalty += (temp_diff - 10.0) * 0.002
                        if vib_diff > 0.5:
                            total_defect_penalty += (vib_diff - 0.5) * 0.01

                # 동적 불량률 적용 (기본 불량률 0.01 + 센서 패널티)
                line.defect_rate = min(1.0, max(0.01, 0.01 + total_defect_penalty))
                
                # 2. 생산량 증가 (해당 라인의 장비 중 가동중인 장비들의 평균 속도에 비례)
                if active_equipments:
                    avg_speed = sum(eq.speed for eq in active_equipments) / len(active_equipments)
                    # 속도가 1.0일 때 1초에 1개씩 생산한다고 가정
                    production_increase = int(max(1, 1 * avg_speed))
                    line.current_production += production_increase

                # 3. 목표 생산량 도달 시 자동 중단 로직
                if line.current_production >= line.target_production:
                    line.current_production = line.target_production
                    line.status = EquipmentStatusEnum.STOPPED
                    for eq in line.equipments:
                        eq.status = EquipmentStatusEnum.STOPPED

        await asyncio.sleep(1.0)
