import React, { useState } from 'react';
import { Transaction, CATEGORIES } from '../types';
import { Sliders, Calculator } from 'lucide-react';

interface SimulationPanelProps {
  transactions: Transaction[];
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [reductionPercent, setReductionPercent] = useState<number>(10);
  
  const currentExpenses = transactions.filter(t => t.type === 'expense');
  const categoryExpenses = currentExpenses
    .filter(t => t.category === selectedCategory)
    .reduce((acc, t) => acc + t.amount, 0);

  const savings = categoryExpenses * (reductionPercent / 100);
  const newCategoryTotal = categoryExpenses - savings;

  if (currentExpenses.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl shadow-sm border border-neutral-800 p-6 mb-8 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4 relative z-10">
        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">Simulador</h3>
          <p className="text-xs text-text-muted">Projete economias ajustando gastos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="space-y-6">
          <div>
            <label className="text-xs text-text-muted mb-2 block font-medium uppercase tracking-wide">Onde economizar?</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-purple-500 outline-none transition-colors appearance-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="mt-2 text-xs text-neutral-500 flex justify-between">
              <span>Gasto atual:</span>
              <span className="font-bold text-white">R$ {categoryExpenses.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wide">Redução</label>
                <span className="text-purple-400 font-bold">{reductionPercent}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5" 
              value={reductionPercent}
              onChange={(e) => setReductionPercent(Number(e.target.value))}
              className="w-full h-2 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        <div className="bg-neutral-950/50 rounded-xl p-6 border border-neutral-800 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2">Economia Mensal</p>
            <h4 className="text-4xl font-bold text-white mb-1">
            R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
            <p className="text-xs text-neutral-500 mb-4">que sobraria no seu bolso</p>
            
            <div className="w-full h-px bg-neutral-800 mb-4"></div>
            
            <div className="flex justify-between w-full text-sm">
                <span className="text-text-muted">Novo gasto:</span>
                <span className="font-bold text-white">R$ {newCategoryTotal.toFixed(2)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
