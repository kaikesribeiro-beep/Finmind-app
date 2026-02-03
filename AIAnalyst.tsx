import React, { useState } from 'react';
import { AnalysisData, Transaction, HealthStatus } from '../types';
import { BrainCircuit, AlertTriangle, Lightbulb, TrendingUp, RefreshCw, Activity, ShieldCheck, ShieldAlert, Zap, Plus } from 'lucide-react';
import { analyzeFinances } from '../services/geminiService';

interface AIAnalystProps {
  transactions: Transaction[];
  onOpenModal: () => void;
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({ transactions, onOpenModal }) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeFinances(transactions);
    setAnalysis(result);
    setLoading(false);
  };

  const getHealthStyles = (status: HealthStatus) => {
    switch (status) {
      case 'POSITIVE':
        return { 
            bg: 'bg-emerald-500/10', 
            border: 'border-emerald-500/20', 
            text: 'text-emerald-400', 
            icon: ShieldCheck,
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        };
      case 'RISK':
        return { 
            bg: 'bg-rose-500/10', 
            border: 'border-rose-500/20', 
            text: 'text-rose-400', 
            icon: ShieldAlert,
            glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]'
        };
      default:
        return { 
            bg: 'bg-blue-500/10', 
            border: 'border-blue-500/20', 
            text: 'text-blue-400', 
            icon: Activity,
            glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]'
        };
    }
  };

  if (!analysis && !loading) {
    return (
      <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-indigo-500/20 p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 animate-fade-in relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                <BrainCircuit size={24} />
            </div>
            <h2 className="text-xl font-bold">Análise Inteligente</h2>
          </div>
          <p className="text-indigo-200/80 text-sm max-w-md">
            Identifique riscos, oportunidades de economia e receba projeções baseadas no seu perfil.
          </p>
        </div>
        
        {transactions.length === 0 ? (
           <button
             onClick={onOpenModal}
             className="relative z-10 whitespace-nowrap bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/50"
           >
             <Plus size={18} />
             Adicione Dados
           </button>
        ) : (
           <button
             onClick={handleAnalyze}
             className="relative z-10 whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:bg-neutral-800 flex items-center gap-2 shadow-lg shadow-indigo-900/50"
           >
             {loading ? <RefreshCw className="animate-spin" /> : <Zap size={18} />}
             Analisar Agora
           </button>
        )}
      </div>
    );
  }

  const styles = analysis ? getHealthStyles(analysis.healthStatus) : getHealthStyles('NEUTRAL');
  const StatusIcon = styles.icon;

  return (
    <div className="space-y-6 mb-8 animate-fade-in">
      {/* Main Health Card */}
      <div className={`rounded-2xl border ${styles.border} ${styles.bg} ${styles.glow} p-6 transition-all relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex gap-4">
            <div className={`p-3 rounded-2xl bg-black/20 backdrop-blur-sm ${styles.text}`}>
              {loading ? <RefreshCw className="animate-spin" /> : <StatusIcon size={32} />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1 text-white">Saúde Financeira</p>
              {loading ? (
                <div className="h-8 w-48 bg-white/10 animate-pulse rounded"></div>
              ) : (
                <>
                  <h2 className={`text-2xl font-bold text-white leading-tight mb-2`}>
                    {analysis?.mainInsight}
                  </h2>
                  <p className="text-indigo-200 text-sm flex items-center gap-2 bg-black/20 w-fit px-3 py-1 rounded-full border border-white/5">
                    <TrendingUp size={14} /> {analysis?.projectedBalance}
                  </p>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className={`p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70`}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {analysis && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-neutral-800 p-5 rounded-2xl shadow-sm flex flex-col hover:border-neutral-700 transition-colors">
             <div className="flex items-center gap-2 mb-3 text-blue-400">
               <Activity size={18} />
               <h3 className="font-bold text-xs uppercase tracking-wide">Contexto</h3>
             </div>
             <p className="text-neutral-300 text-sm leading-relaxed mb-4 flex-grow">{analysis.monthlyComparison}</p>
             <div className="mt-auto pt-3 border-t border-neutral-800">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-text-muted">Maior impacto:</span>
                    <span className="text-white font-semibold">{analysis.biggestSpender.category}</span>
                </div>
             </div>
          </div>

          <div className="bg-card border border-neutral-800 p-5 rounded-2xl shadow-sm flex flex-col hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 mb-3 text-amber-500">
               <AlertTriangle size={18} />
               <h3 className="font-bold text-xs uppercase tracking-wide">Atenção</h3>
             </div>
             {analysis.alerts.length > 0 ? (
               <ul className="space-y-2">
                 {analysis.alerts.map((alert, i) => (
                   <li key={i} className="flex gap-2 text-xs text-neutral-300 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                     <div className="min-w-[4px] h-full bg-amber-500 rounded-full"></div>
                     {alert}
                   </li>
                 ))}
               </ul>
             ) : (
               <div className="flex-grow flex items-center justify-center text-center text-neutral-500 text-xs italic">
                 Tudo sob controle.
               </div>
             )}
          </div>

          <div className="bg-card border border-neutral-800 p-5 rounded-2xl shadow-sm flex flex-col hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
               <Lightbulb size={18} />
               <h3 className="font-bold text-xs uppercase tracking-wide">Recomendação</h3>
             </div>
             <ul className="space-y-3">
               {analysis.suggestions.slice(0, 3).map((sugg, i) => (
                 <li key={i} className="flex gap-3 text-sm text-neutral-300">
                   <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 text-[10px] font-bold border border-emerald-500/20">
                     {i + 1}
                   </div>
                   {sugg}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      )}
    </div>
  );
};