import React, { useState } from 'react';
import { Transaction } from '../types';
import { TrendingUp, TrendingDown, Filter, Download, Trash2, Calendar } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  // Esses dois itens com '?' são essenciais para os novos botões funcionarem
  onClearAll?: () => void;
  onExport?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onClearAll, onExport }) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  // Pega o mês atual (ex: 2026-02)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    const matchesMonth = t.date.startsWith(selectedMonth);
    return matchesType && matchesMonth;
  });

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm mt-4">
      
      {/* 1. Cabeçalho */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80">
        <h2 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
          <Filter size={16} className="text-emerald-500" />
          Histórico
        </h2>
        
        <div className="flex gap-2">
          {/* Botão de Exportar (Backup) */}
          {onExport && (
            <button onClick={onExport} className="text-neutral-400 hover:text-emerald-400 p-1.5 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Baixar Backup">
              <Download size={16} />
            </button>
          )}
          
          {/* Botão de Limpar Tudo */}
          {transactions.length > 0 && onClearAll && (
            <button onClick={onClearAll} className="text-neutral-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors" title="Apagar Tudo">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Filtros */}
      <div className="p-2 space-y-2 border-b border-neutral-800/50">
        <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
            <Calendar size={14} className="text-neutral-500" />
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent text-sm text-neutral-300 outline-none w-full"/>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setFilterType('all')} className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-all ${filterType === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>Todos</button>
          <button onClick={() => setFilterType('income')} className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-all ${filterType === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-neutral-500 hover:text-neutral-300'}`}>Entradas</button>
          <button onClick={() => setFilterType('expense')} className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-all ${filterType === 'expense' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-neutral-500 hover:text-neutral-300'}`}>Saídas</button>
        </div>
      </div>

      {/* 3. Lista */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-neutral-600"><p className="text-xs">Nada encontrado neste mês.</p></div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="group flex items-center justify-between p-3 rounded-xl bg-neutral-900/40 hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700 transition-all">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-full shrink-0 ${transaction.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {transaction.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-neutral-200 truncate pr-2">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                    <span className="capitalize">{transaction.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-2 shrink-0">
                <span className={`font-bold text-sm ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <button onClick={() => onDelete(transaction.id)} className="text-neutral-600 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
