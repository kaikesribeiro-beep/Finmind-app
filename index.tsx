import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { FinancialCharts } from './components/FinancialCharts';
import { TransactionList } from './components/TransactionList';
import { AIAnalyst } from './components/AIAnalyst';
import { BudgetManager } from './components/BudgetManager';
import { SimulationPanel } from './components/SimulationPanel';
import { Transaction, TransactionType, Budget } from './types';
import { LayoutDashboard, Receipt, PieChart, Target, Plus, CheckCircle2 } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'planning'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finmindTransactions');
    if (saved) return JSON.parse(saved);
    
    // Initial Sample Data
    return [
      {id: '1', description: 'Salário', amount: 2000, type: 'income', category: 'Renda', date: '2026-02-01'},
      {id: '2', description: 'Almoço', amount: 45, type: 'expense', category: 'Comida', date: '2026-02-03'}
    ];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('finmind_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('finmindTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finmind_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (
    description: string,
    amount: number,
    type: TransactionType,
    category: string,
    date: string
  ) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount,
      type,
      category,
      date,
    };
    setTransactions((prev) => [...prev, newTransaction]);
    setActiveTab('dashboard');
    
    // Trigger success feedback
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter(t => t.id !== id));
  };

  const updateBudget = (newBudget: Budget) => {
    setBudgets(prev => {
      const filtered = prev.filter(b => b.category !== newBudget.category);
      return [...filtered, newBudget];
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-background text-text selection:bg-primary selection:text-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] animate-fade-in bg-card border border-emerald-500/20 shadow-xl shadow-black/50 p-4 rounded-xl flex items-center gap-3 text-emerald-400">
          <div className="bg-emerald-500/20 p-2 rounded-full">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Sucesso!</h4>
            <p className="text-xs text-neutral-400">Transação adicionada.</p>
          </div>
        </div>
      )}

      {/* Navbar Desktop / Header Mobile */}
      <nav className="bg-card border-b border-neutral-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30">
                <LayoutDashboard size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">FinMind</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
                <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-800">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-neutral-800 text-white shadow' : 'text-text-muted hover:text-white'}`}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('transactions')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-neutral-800 text-white shadow' : 'text-text-muted hover:text-white'}`}
                    >
                        Transações
                    </button>
                    <button 
                        onClick={() => setActiveTab('planning')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'planning' ? 'bg-neutral-800 text-white shadow' : 'text-text-muted hover:text-white'}`}
                    >
                        Planejamento
                    </button>
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 text-sm shadow-lg shadow-primary/20"
                >
                  <Plus size={18} />
                  Adicionar
                </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-6">
                <SummaryCards transactions={transactions} />
                <AIAnalyst transactions={transactions} onOpenModal={() => setIsModalOpen(true)} />
                <FinancialCharts transactions={transactions} />
            </div>
        )}

        {/* VIEW: TRANSACTIONS */}
        {activeTab === 'transactions' && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Todas as Transações</h2>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="md:hidden text-primary font-bold text-sm"
                      >
                        Nova Transação
                      </button>
                    </div>
                    <TransactionList transactions={transactions} onDelete={deleteTransaction} />
                </div>
            </div>
        )}

        {/* VIEW: PLANNING */}
        {activeTab === 'planning' && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div>
                    <BudgetManager transactions={transactions} budgets={budgets} onUpdateBudget={updateBudget} />
                 </div>
                 <div>
                    <SimulationPanel transactions={transactions} />
                 </div>
            </div>
        )}

      </main>

      {/* Global Transaction Modal */}
      <TransactionForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTransaction} 
      />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-neutral-800 p-2 md:hidden z-40 flex justify-around items-center pb-safe">
        <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 transition-all ${activeTab === 'dashboard' ? 'text-primary' : 'text-neutral-500'}`}
        >
            <PieChart size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Resumo</span>
        </button>
        
        <div className="relative -top-5">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center w-14 h-14 bg-primary rounded-full text-white shadow-lg shadow-primary/40 active:scale-90 transition-transform"
             >
                <Plus size={28} />
             </button>
        </div>

        <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 transition-all ${activeTab === 'transactions' ? 'text-primary' : 'text-neutral-500'}`}
        >
            <Receipt size={24} strokeWidth={activeTab === 'transactions' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Extrato</span>
        </button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);