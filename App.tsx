
import React, { useState } from 'react';
import Calculator from './components/Calculator';
import AiAssistant from './components/AiAssistant';
import { CalculationResult } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const addToHistory = (calc: CalculationResult) => {
    setHistory(prev => [calc, ...prev].slice(0, 10));
    setLastResult(calc.result);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Gemini Calc
        </h1>
        <p className="text-slate-400 text-sm">Professional Arithmetic with AI Insights</p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Calculator Section */}
        <div className="lg:col-span-5 flex justify-center">
          <Calculator onResult={addToHistory} />
        </div>

        {/* AI Side Panel */}
        <div className="lg:col-span-7 space-y-6">
          <AiAssistant lastResult={lastResult} history={history} />
          
          {/* Recent History Desktop View */}
          <div className="hidden lg:block bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <i className="fas fa-history text-indigo-400"></i>
              Recent Calculations
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {history.length === 0 ? (
                <p className="text-slate-500 italic text-sm">No recent calculations</p>
              ) : (
                history.map((item) => (
                  <div key={item.timestamp} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800 transition-colors hover:border-slate-600">
                    <span className="text-slate-400 text-sm font-mono">{item.expression}</span>
                    <span className="text-indigo-300 font-bold font-mono"> = {item.result}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-slate-500 text-xs flex gap-4">
        <span>&copy; 2024 Gemini Calc</span>
        <span>|</span>
        <span className="hover:text-slate-300 cursor-pointer transition-colors">Documentation</span>
        <span>|</span>
        <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
      </footer>
    </div>
  );
};

export default App;
