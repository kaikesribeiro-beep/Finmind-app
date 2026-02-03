import React from 'react';
import { Transaction } from '../types';
import { ArrowUp, ArrowDown, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Saldo Principal - Destaque */}
      <div className="md:col-span-3 bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${balance >= 0 ? 'from-emerald-500/10' : 'from-rose-500/10'} to-transparent rounded-bl-full transition-all group-hover:scale-110`}></div>
        <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">Saldo Atual</p>
        <div className="flex items-center gap-3">
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            <div className={`p-2 rounded-full ${balance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                <Wallet size={24} />
            </div>
        </div>
        <p className="text-xs text-text-muted mt-2 opacity-60">Baseado em todas as transações</p>
      </div>

      {/* Cards Menores */}
      <div className="bg-card hover:bg-card-hover border border-neutral-800 p-5 rounded-xl transition-all flex items-center justify-between group">
        <div>
          <p className="text-text-muted text-xs font-medium uppercase mb-1">Entradas</p>
          <h3 className="text-xl font-bold text-success">
            R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-full text-success group-hover:bg-emerald-500/20 transition-colors">
            <ArrowUp size={20} />
        </div>
      </div>

      <div className="bg-card hover:bg-card-hover border border-neutral-800 p-5 rounded-xl transition-all flex items-center justify-between group">
        <div>
          <p className="text-text-muted text-xs font-medium uppercase mb-1">Saídas</p>
          <h3 className="text-xl font-bold text-danger">
            R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="p-3 bg-rose-500/10 rounded-full text-danger group-hover:bg-rose-500/20 transition-colors">
            <ArrowDown size={20} />
        </div>
      </div>
    </div>
  );
};
