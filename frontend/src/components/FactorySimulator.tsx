import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Box, CheckCircle2, Zap } from 'lucide-react';
import { getLines } from '../services/api';
import type { ProductionLine } from '../services/api';

export const FactorySimulator: React.FC = () => {
  const [lines, setLines] = useState<ProductionLine[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLines();
        setLines(data);
      } catch (error) {
        console.error('Failed to fetch lines', error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-200 animate-in fade-in duration-700 w-full overflow-hidden">
       <style>{`
        /* Blueprint Grid Background */
        .blueprint-bg {
          background-color: #0f172a;
          background-image: 
            linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        @keyframes conveyor-x {
          0% { background-position: 0 0; }
          100% { background-position: -40px 0; }
        }
        .conveyor-running {
          animation: conveyor-x 1s linear infinite;
        }

        @keyframes move-product-1 {
          0% { left: 0%; transform: scale(0.8); opacity: 0; background-color: #94a3b8; border-color: #64748b; border-radius: 4px; }
          5% { opacity: 1; transform: scale(1); }
          45% { background-color: #94a3b8; border-color: #64748b; border-radius: 4px; }
          55% { background-color: #d4a373; border-color: #bc6c25; border-radius: 12px; }
          95% { opacity: 1; transform: scale(1); background-color: #d4a373; border-color: #bc6c25; border-radius: 12px; }
          100% { left: 100%; transform: scale(0.8); opacity: 0; background-color: #d4a373; border-color: #bc6c25; border-radius: 12px; }
        }
        
        @keyframes move-product-2 {
          0% { left: 0%; transform: scale(0.8); opacity: 0; background-color: #94a3b8; border-color: #64748b; border-radius: 4px; }
          5% { opacity: 1; transform: scale(1); }
          20% { background-color: #94a3b8; border-color: #64748b; border-radius: 4px; }
          30% { background-color: #eab308; border-color: #ca8a04; border-radius: 8px; }
          70% { background-color: #eab308; border-color: #ca8a04; border-radius: 8px; }
          80% { background-color: #d4a373; border-color: #bc6c25; border-radius: 12px; }
          95% { opacity: 1; transform: scale(1); background-color: #d4a373; border-color: #bc6c25; border-radius: 12px; }
          100% { left: 100%; transform: scale(0.8); opacity: 0; background-color: #d4a373; border-color: #bc6c25; border-radius: 12px; }
        }

        .product-animate-1 { animation: move-product-1 10s linear infinite both; }
        .product-animate-2 { animation: move-product-2 10s linear infinite both; }

        @keyframes inner-product-1 {
          0%, 45% { background-color: #cbd5e1; border-radius: 2px; }
          55%, 100% { background-color: #faedcd; border-radius: 50%; }
        }

        @keyframes inner-product-2 {
          0%, 20% { background-color: #cbd5e1; border-radius: 2px; }
          30%, 70% { background-color: #fef08a; border-radius: 4px; }
          80%, 100% { background-color: #faedcd; border-radius: 50%; }
        }

        .product-inner-animate-1 { animation: inner-product-1 10s linear infinite both; }
        .product-inner-animate-2 { animation: inner-product-2 10s linear infinite both; }
      `}</style>
      <header className="flex items-center justify-between mb-8 z-10 relative max-w-screen-2xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-md border border-slate-700/50 transition-colors">
          <ArrowLeft className="w-5 h-5" /> 대시보드로 돌아가기
        </Link>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-tight">
          Factory Floor View (Top-Down)
        </h1>
        <div className="flex items-center space-x-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <span className="text-sm font-semibold text-cyan-400 tracking-wider">SIMULATOR ACTIVE</span>
        </div>
      </header>

      {/* Main Factory Floor Area */}
      <div className="w-full max-w-screen-2xl mx-auto bg-slate-900 border-2 border-slate-700/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative h-[750px] blueprint-bg">
        
        <div className="absolute inset-0 flex flex-col justify-around p-8 md:p-12">
          {lines.map((line) => (
            <div key={line.line_id} className="relative w-full h-56 border border-slate-700/50 bg-slate-800/40 rounded-2xl backdrop-blur-md flex items-center shadow-2xl">
              
              {/* Line info */}
              <div className="absolute top-2 left-6 z-30 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700">
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className={`w-5 h-5 ${line.status === 'running' ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                  {line.name}
                </div>
                <div className="text-sm text-slate-400 mt-1">생산량: <span className="text-cyan-400 font-mono">{line.current_production}</span> / {line.target_production}</div>
              </div>

              {/* Conveyor Track (Top-Down view) */}
              <div className="absolute left-40 right-40 h-20 bg-slate-800 rounded border-y-4 border-slate-600 flex items-center overflow-hidden shadow-inner">
                {/* Belt texture */}
                <div className={`w-full h-full bg-slate-700 opacity-90 ${line.status === 'running' ? 'conveyor-running' : ''}`} style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.4) 50%)', backgroundSize: '40px 100%' }}></div>
              </div>

              {/* Input Station (Raw Materials) */}
              <div className="absolute left-6 w-32 h-32 bg-slate-700 border-4 border-slate-500 rounded-xl flex flex-col items-center justify-center shadow-xl z-20 bg-gradient-to-br from-slate-600 to-slate-800">
                <Box className="text-slate-400 w-10 h-10 mb-2" />
                <span className="text-xs font-bold text-slate-300">재료 투입구</span>
                <div className="w-16 h-2 bg-amber-500/50 rounded-full mt-2"></div>
              </div>

              {/* Equipments spaced along the track */}
              <div className="absolute left-40 right-40 h-full flex justify-around items-center z-20 pointer-events-none">
                {line.equipments.map((eq) => (
                  <div key={eq.equipment_id} className="relative flex flex-col items-center justify-center pointer-events-auto">
                    {/* Machine top-down shape */}
                    <div className={`w-28 h-36 bg-gradient-to-br from-slate-600 to-slate-800 border-4 ${eq.status === 'running' ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'border-slate-500 shadow-lg'} rounded-2xl flex flex-col items-center justify-center transition-all duration-300`}>
                      <div className={`w-5 h-5 rounded-full mb-3 ${eq.status === 'running' ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'}`}></div>
                      <div className="w-16 h-10 bg-slate-900 border-2 border-slate-700 rounded text-[10px] font-mono text-cyan-400 flex flex-col items-center justify-center leading-tight">
                        <span>T: {eq.sensor_data.temperature.toFixed(1)}</span>
                        <span>V: {eq.sensor_data.vibration.toFixed(2)}</span>
                      </div>
                      
                      {/* Robotic Arm Representation for assembly/robot */}
                      {eq.name.includes('로봇') && (
                         <div className={`absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-6 bg-slate-400 rounded-full origin-left border-2 border-slate-500 ${eq.status === 'running' ? 'animate-[spin_2s_linear_infinite]' : ''}`} style={{ animationDirection: 'alternate', animationIterationCount: 'infinite' }}></div>
                      )}
                    </div>
                    <span className="absolute -bottom-8 text-sm font-bold text-slate-200 bg-slate-900/90 px-3 py-1 rounded-md whitespace-nowrap border border-slate-700">{eq.name}</span>
                  </div>
                ))}
              </div>

              {/* Output Station (Finished Goods) */}
              <div className="absolute right-6 w-32 h-32 bg-slate-700 border-4 border-slate-500 rounded-xl flex flex-col items-center justify-center shadow-xl z-20 bg-gradient-to-bl from-slate-600 to-slate-800">
                <CheckCircle2 className="text-emerald-400 w-10 h-10 mb-2" />
                <span className="text-xs font-bold text-slate-300">완제품 배출구</span>
                <div className="flex gap-1 mt-2">
                  <div className="w-4 h-4 bg-emerald-500/80 rounded-sm"></div>
                  <div className="w-4 h-4 bg-emerald-500/80 rounded-sm"></div>
                  <div className="w-4 h-4 bg-emerald-500/80 rounded-sm"></div>
                </div>
              </div>

              {/* Moving Products (Top-Down blocks) */}
              {line.status === 'running' && (
                <div className="absolute left-40 right-40 h-20 pointer-events-none flex items-center z-10 overflow-hidden">
                  {/* Generate multiple products with animation delay */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`absolute w-12 h-12 border-2 shadow-lg flex items-center justify-center ${line.equipments.length === 1 ? 'product-animate-1' : 'product-animate-2'}`}
                      style={{ animationDelay: `${i * (10 / 8)}s` }}
                    >
                      <div 
                        className={`w-6 h-6 opacity-70 ${line.equipments.length === 1 ? 'product-inner-animate-1' : 'product-inner-animate-2'}`}
                        style={{ animationDelay: `${i * (10 / 8)}s` }}
                      ></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
