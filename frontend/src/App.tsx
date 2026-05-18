import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { FactorySimulator } from './components/FactorySimulator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#090e17] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
        {/* Background glowing effects for premium feel */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="fixed top-[40%] left-[60%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <main className="relative z-10 pt-4 pb-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulator" element={<FactorySimulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
