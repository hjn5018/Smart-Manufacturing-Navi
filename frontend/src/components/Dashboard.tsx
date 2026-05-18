import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLines, controlEquipment } from '../services/api';
import type { ProductionLine } from '../services/api';
import { Activity, Settings, AlertTriangle, CheckCircle2, Map } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLines();
        setLines(data);
      } catch (error) {
        console.error('Failed to fetch lines', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // 1초마다 실시간 갱신 (시뮬레이션)
    return () => clearInterval(interval);
  }, []);

  const handleControl = async (equipment_id: string, action: string, value?: number) => {
    try {
      await controlEquipment(equipment_id, action, value);
    } catch (error) {
      console.error('Failed to control equipment', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-medium animate-pulse">시스템 초기화 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* 헤더 섹션 */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
            Smart Manufacturing Navi
          </h1>
          <p className="text-slate-400 mt-1">실시간 공정 모니터링 및 AI 제어 센터</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/simulator" className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/20">
            <Map className="w-4 h-4" /> 팩토리 뷰
          </Link>
          <div className="flex items-center space-x-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 shadow-lg backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-emerald-400 tracking-wide">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* 라인 카드 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {lines.map((line) => (
          <div key={line.line_id} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl hover:border-slate-600/60 hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300 group">

            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  {line.name}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${line.status === 'running' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                    {line.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">목표 생산량: {line.target_production.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{line.current_production.toLocaleString()}</div>
                <div className="text-sm font-medium text-slate-400 mt-1">현재 생산량</div>
              </div>
            </div>

            {/* 생산 진척도 프로그레스 바 */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>진척도</span>
                <span className="text-cyan-400">{((line.current_production / line.target_production) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-900/80 rounded-full h-3 overflow-hidden border border-slate-800/50">
                <div
                  className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  style={{ width: `${(line.current_production / line.target_production) * 100}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 주요 지표 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-700/30">
                <div className="text-slate-400 text-sm font-medium mb-2">불량률 (Defect Rate)</div>
                <div className="text-3xl font-bold text-rose-400">{(line.defect_rate * 100).toFixed(1)}<span className="text-lg text-rose-400/70">%</span></div>
              </div>
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-700/30">
                <div className="text-slate-400 text-sm font-medium mb-2">가동 설비 수 (Active)</div>
                <div className="text-3xl font-bold text-cyan-400">{line.equipments.length}<span className="text-lg text-cyan-400/70">ea</span></div>
              </div>
            </div>


            {/* 설비 리스트 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
                <Settings className="w-4 h-4 text-slate-400" /> Equipment Details
              </h3>
              {line.equipments.map(eq => (
                <div key={eq.equipment_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/80 transition-colors">
                  <div className="flex items-center gap-4">
                    {eq.status === 'running' ?
                      <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div> :
                      <div className="p-2 bg-amber-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-400" /></div>
                    }
                    <div>
                      <div className="font-semibold text-slate-200">{eq.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">온도: {eq.sensor_data.temperature.toFixed(1)}°C | 진동: {eq.sensor_data.vibration.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1.5 rounded-lg shadow-inner">
                      {eq.speed.toFixed(1)}x
                    </div>
                    {eq.status === 'running' ? (
                      <button onClick={() => handleControl(eq.equipment_id, 'stop')} className="px-3 py-1.5 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500/40 text-xs font-bold transition cursor-pointer">정지</button>
                    ) : (
                      <button onClick={() => handleControl(eq.equipment_id, 'start')} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/40 text-xs font-bold transition cursor-pointer">가동</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
