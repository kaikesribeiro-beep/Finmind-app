import React, { useState } from 'react';
import { Transaction, CATEGORIES } from '../types';
import { Trash2, ArrowUpRight, ArrowDownLeft, CalendarClock, Search, Filter, Edit2, RefreshCw } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM

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

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todas' || t.category === filterCategory;
    const matchesMonth = t.date.startsWith(filterMonth);
    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Sort by date descending
  const sorted = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-card rounded-2xl border border-neutral-800 overflow-hidden shadow-sm animate-fade-in">
      
      {/* Filters Header */}
      <div className="p-5 border-b border-neutral-800 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">Histórico</h3>
            <span className="text-xs text-text-muted bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
                {filteredTransactions.length} registros
            </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             {/* Search */}
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                 <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:border-primary outline-none"
                 />
             </div>

             {/* Category Filter */}
             <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                 <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:border-primary outline-none appearance-none cursor-pointer"
                 >
                    <option value="Todas">Todas as Categorias</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                 </select>
             </div>

             {/* Month Filter */}
             <input 
                type="month" 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:border-primary outline-none [color-scheme:dark] cursor-pointer"
             />
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {sorted.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm italic">
                Nenhuma transação encontrada para os filtros selecionados.
            </div>
        ) : (
            sorted.map((t) => (
            <div key={t.id} className="group flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors border-b border-neutral-800 last:border-0">
                <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative ${
                    t.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                    {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    {t.isFixed && (
                        <div className="absolute -bottom-1 -right-1 bg-neutral-800 rounded-full p-0.5 border border-neutral-700">
                             <RefreshCw size={10} className="text-primary" />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-white text-sm md:text-base truncate">{t.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-text-muted mt-0.5">
                    <span>{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                    <span className="text-neutral-700">•</span>
                    <span className="text-primary">{t.category}</span>
                    </div>
                </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 pl-2">
                <span className={`font-bold text-sm md:text-base whitespace-nowrap ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                
                <div className="flex gap-1">
                    <button 
                        onClick={() => onEdit(t)}
                        className="text-neutral-500 hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all"
                        title="Editar"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => onDelete(t.id)}
                        className="text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-all"
                        title="Excluir"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};