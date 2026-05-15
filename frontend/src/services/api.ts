import axios from 'axios';

const API_URL = 'http://localhost:8000/api/mock';

export interface SensorData {
  temperature: number;
  pressure: number;
  vibration: number;
}

export interface EquipmentStatus {
  equipment_id: string;
  name: string;
  status: string;
  speed: number;
  sensor_data: SensorData;
}

export interface ProductionLine {
  line_id: string;
  name: string;
  status: string;
  equipments: EquipmentStatus[];
  defect_rate: number;
  target_production: number;
  current_production: number;
}

export const getLines = async (): Promise<ProductionLine[]> => {
  const response = await axios.get(`${API_URL}/lines`);
  return response.data;
};
