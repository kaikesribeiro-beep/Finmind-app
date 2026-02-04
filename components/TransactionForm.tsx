import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, FileText, DollarSign, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CATEGORIES, TransactionType, Transaction } from '../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }) => void;
  initialData?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES[1]); // Default to 'Comida'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode
        setDescription(initialData.description);
        setAmount(initialData.amount.toString());
        setType(initialData.type);
        setCategory(initialData.category);
        setDate(initialData.date);
        setIsFixed(initialData.isFixed || false);
      } else {
        // Add Mode (Reset)
        setDescription('');
        setAmount('');
        setType('expense');
        setCategory(CATEGORIES[1]);
        setDate(new Date().toISOString().split('T')[0]);
        setIsFixed(false);
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('A descrição é obrigatória.');
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }

    onSave({
      id: initialData?.id, // Pass ID if editing
      description,
      amount: val,
      type,
      category,
      date,
      isFixed
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-card w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10 animate-fade-in">
        
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
          <h3 className="text-xl font-bold text-white">
            {initialData ? 'Editar Transação' : 'Nova Transação'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full text-text-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => { setType('income'); setCategory('Renda'); }}
              className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'income' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                  : 'text-text-muted hover:text-white hover:bg-neutral-800'
              }`}
            >
              <CheckCircle2 size={16} className={type === 'income' ? 'opacity-100' : 'opacity-0'} />
              Receita
            </button>
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory('Comida'); }}
              className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'expense' 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' 
                  : 'text-text-muted hover:text-white hover:bg-neutral-800'
              }`}
            >
              <CheckCircle2 size={16} className={type === 'expense' ? 'opacity-100' : 'opacity-0'} />
              Despesa
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Valor (R$)</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors">
                <DollarSign size={20} />
              </div>
              <input
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-700 rounded-xl text-2xl font-bold text-white placeholder-neutral-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                autoFocus={!initialData}
              />
            </div>
          </div>

          <div>
             <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Descrição</label>
             <div className="relative group">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors">
                 <FileText size={20} />
               </div>
               <input
                  type="text"
                  placeholder="Ex: Almoço, Salário, Uber..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Categoria</label>
                  <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors">
                        <Tag size={20} />
                      </div>
                      <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                      >
                          {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                          ))}
                      </select>
                  </div>
              </div>
              
              <div>
                   <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Data</label>
                   <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors">
                         <Calendar size={20} />
                       </div>
                      <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all [color-scheme:dark] cursor-pointer"
                      />
                   </div>
              </div>
          </div>

          {/* Recurring Option */}
          <div className="flex items-center gap-3 p-4 bg-neutral-900 rounded-xl border border-neutral-800 cursor-pointer" onClick={() => setIsFixed(!isFixed)}>
             <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${isFixed ? 'bg-primary border-primary' : 'border-neutral-600'}`}>
                 {isFixed && <CheckCircle2 size={16} className="text-white" />}
             </div>
             <div className="flex-1">
                 <p className="text-sm font-bold text-white flex items-center gap-2">
                    <RefreshCw size={14} className="text-primary" />
                    Despesa Fixa Mensal
                 </p>
                 <p className="text-xs text-text-muted">Repetir automaticamente todo mês</p>
             </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <span>{initialData ? 'Salvar Alterações' : 'Adicionar Transação'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};