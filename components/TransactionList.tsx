import React from 'react';
import { Transaction } from '../types';
import { Trash2, ArrowUpRight, ArrowDownLeft, CalendarClock } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-card border border-neutral-800 rounded-2xl border-dashed">
        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <CalendarClock className="text-neutral-600" size={32} />
        </div>
        <p className="text-text-muted font-medium">Nenhuma transação registrada</p>
        <p className="text-sm text-neutral-600 mt-1">Adicione seus gastos para começar</p>
      </div>
    );
  }

  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-card rounded-2xl border border-neutral-800 overflow-hidden shadow-sm animate-fade-in">
      <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
        <h3 className="font-bold text-white text-lg">Histórico</h3>
        <span className="text-xs text-text-muted bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
            {transactions.length} registros
        </span>
      </div>
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {sorted.map((t) => (
          <div key={t.id} className="group flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors border-b border-neutral-800 last:border-0">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                t.type === 'income' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-rose-500/10 text-rose-500'
                }`}>
                {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </div>
              <div>
                <p className="font-semibold text-white text-sm md:text-base">{t.description}</p>
                <div className="flex gap-2 text-xs text-text-muted mt-0.5">
                  <span>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                  <span className="text-neutral-700">•</span>
                  <span className="text-primary">{t.category}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-bold text-sm md:text-base ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <button 
                onClick={() => onDelete(t.id)}
                className="text-neutral-600 hover:text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
