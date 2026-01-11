import React from 'react';
import { AIAdvice, ActionType } from '../types';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

interface AdviceDisplayProps {
  advice: AIAdvice | null;
  loading: boolean;
  onReset: () => void;
}

const AdviceDisplay: React.FC<AdviceDisplayProps> = ({ advice, loading, onReset }) => {
  if (loading) {
    return (
      <div className="w-full bg-slate-800/50 rounded-xl p-8 flex flex-col items-center justify-center space-y-4 border border-slate-700 min-h-[200px] animate-pulse">
        <Brain className="w-12 h-12 text-gold animate-bounce" />
        <p className="text-gold font-serif text-lg">Consulting the Oracle...</p>
      </div>
    );
  }

  if (!advice) return null;

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case ActionType.HIT: return 'bg-green-600 text-white border-green-400';
      case ActionType.STAND: return 'bg-red-600 text-white border-red-400';
      case ActionType.DOUBLE: return 'bg-blue-600 text-white border-blue-400';
      case ActionType.SPLIT: return 'bg-purple-600 text-white border-purple-400';
      case ActionType.SURRENDER: return 'bg-yellow-600 text-white border-yellow-400';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="w-full bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      <div className={`p-6 text-center border-b-4 ${getActionColor(advice.action)}`}>
        <h2 className="text-sm uppercase tracking-widest opacity-80 mb-1">Recommended Action</h2>
        <h1 className="text-5xl font-black tracking-tight">{advice.action}</h1>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-slate-700 p-2 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Confidence Score</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 flex-1 bg-slate-700 rounded-full w-32 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-300" 
                  style={{ width: `${advice.confidence}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-green-400">{advice.confidence}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-slate-700 p-2 rounded-lg shrink-0">
            <Brain className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">AI Reasoning</h4>
            <p className="text-slate-300 text-sm leading-relaxed mt-1">
              {advice.explanation}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-center">
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white text-sm underline decoration-slate-600 hover:decoration-white transition-all"
        >
          Clear Hands & Start Over
        </button>
      </div>
    </div>
  );
};

export default AdviceDisplay;
