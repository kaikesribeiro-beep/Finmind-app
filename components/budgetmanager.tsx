import React, { useState } from 'react';
import { Transaction, Budget, CATEGORIES } from '../types';
import { Target, Save, Edit2, AlertCircle } from 'lucide-react';

interface BudgetManagerProps {
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudget: (budget: Budget) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ transactions, budgets, onUpdateBudget }) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [limitInput, setLimitInput] = useState<string>('');

  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));

  const getSpentAmount = (category: string) => {
    return currentExpenses
      .filter(t => t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const handleEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setLimitInput(currentLimit > 0 ? currentLimit.toString() : '');
  };

  const handleSave = (category: string) => {
    const limit = parseFloat(limitInput);
    if (!isNaN(limit)) {
      onUpdateBudget({ category, limit });
    }
    setEditingCategory(null);
  };

  return (
    <div className="bg-card border border-neutral-800 rounded-2xl overflow-hidden mb-6 shadow-sm animate-fade-in">
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="text-primary" size={20} />
          <h3 className="font-bold text-white">Metas Mensais</h3>
        </div>
        <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {CATEGORIES.map(category => {
            const budget = budgets.find(b => b.category === category);
            const limit = budget?.limit || 0;
            const spent = getSpentAmount(category);
            const percentage = limit > 0 ? (spent / limit) * 100 : 0;
            const isOverBudget = limit > 0 && spent > limit;

            return (
              <div key={category} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text">{category}</span>
                  
                  {editingCategory === category ? (
                    <div className="flex items-center gap-2 animate-fade-in">
                      <input 
                        type="number" 
                        value={limitInput}
                        onChange={(e) => setLimitInput(e.target.value)}
                        className="w-24 px-2 py-1 text-sm bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-primary"
                        placeholder="R$ 0,00"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSave(category)}
                        className="text-success hover:bg-success/10 p-1 rounded"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">
                        {limit > 0 ? `Meta: R$ ${limit}` : 'Sem meta'}
                      </span>
                      <button 
                        onClick={() => handleEdit(category, limit)}
                        className="text-neutral-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {limit > 0 ? (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${isOverBudget ? 'text-danger' : 'text-neutral-400'}`}>
                        R$ {spent.toFixed(0)} <span className="font-normal text-neutral-600">gastos</span>
                      </span>
                      {isOverBudget && (
                        <div className="flex items-center gap-1 text-danger text-[10px] uppercase font-bold tracking-wide">
                          <AlertCircle size={10} /> Excedido
                        </div>
                      )}
                    </div>
                    <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          percentage > 100 ? 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                          percentage > 80 ? 'bg-amber-400' : 'bg-success shadow-[0_0_10px_rgba(74,222,128,0.3)]'
                        }`}
                      ></div>
                    </div>
                  </div>
                ) : (
                   <div className="h-1 bg-neutral-800 rounded mt-2 opacity-50"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
