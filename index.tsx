import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { FinancialCharts } from './components/FinancialCharts';
import { TransactionList } from './components/TransactionList';
import { AIAnalyst } from './components/AIAnalyst';
// Importando os componentes que você JÁ TEM na pasta components
import { BudgetManager } from './components/BudgetManager';
import { SimulationPanel } from './components/SimulationPanel';
import { Transaction, TransactionType, Budget } from './types';
import { LayoutDashboard, Receipt, PieChart, Plus, CheckCircle2, Wallet } from 'lucide-react';
import './index.css';

const App = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'planning'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Carrega Transações
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finmindTransactions');
    if (saved) return JSON.parse(saved);
    return [
      {id: '1', description: 'Salário', amount: 2000, type: 'income', category: 'Renda', date: '2026-02-01'},
      {id: '2', description: 'Almoço', amount: 45, type: 'expense', category: 'Alimentação', date: '2026-02-03'}
    ];
  });

  // Carrega Orçamentos
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

  const addTransaction = (description: string, amount: number, type: TransactionType, category: string, date: string) => {
    const newTransaction: Transaction = { id: crypto.randomUUID(), description, amount, type, category, date };
    setTransactions((prev) => [newTransaction, ...prev]);
    setActiveTab('dashboard');
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

  // Funções de Limpeza e Exportação
  const clearAllTransactions = () => {
    if (confirm('ATENÇÃO: Deseja apagar todo o histórico?')) setTransactions([]);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup_finmind.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-neutral-950 text-neutral-50 selection:bg-emerald-500 selection:text-white">
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] animate-fade-in bg-neutral-900 border border-emerald-500/20 shadow-xl p-4 rounded-xl flex items-center gap-3 text-emerald-400">
          <CheckCircle2 size={20} />
          <div><h4 className="font-bold text-sm">Sucesso!</h4></div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                <LayoutDashboard size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">FinMind</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
                <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                    <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}>Transações</button>
                    <button onClick={() => setActiveTab('planning')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'planning' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}>Planejamento</button>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/20"><Plus size={18} /> Adicionar</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-6">
                <SummaryCards transactions={transactions} />
                <AIAnalyst transactions={transactions} onOpenModal={() => setIsModalOpen(true)} />
                <FinancialCharts transactions={transactions} />
            </div>
        )}

        {/* TRANSAÇÕES */}
        {activeTab === 'transactions' && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Extrato</h2>
                      <button onClick={() => setIsModalOpen(true)} className="md:hidden text-emerald-500 font-bold text-sm">Nova Transação</button>
                    </div>
                    <TransactionList 
                        transactions={transactions} 
                        onDelete={deleteTransaction}
                        onClearAll={clearAllTransactions}
                        onExport={exportData}
                    />
                </div>
            </div>
        )}

        {/* PLANEJAMENTO - Agora usando os arquivos reais! */}
        {activeTab === 'planning' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                 <BudgetManager transactions={transactions} budgets={budgets} onUpdateBudget={updateBudget} />
                 <SimulationPanel transactions={transactions} />
            </div>
        )}

      </main>

      <TransactionForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTransaction={(t) => addTransaction(t.description, t.amount, t.type, t.category, t.date)} />

      {/* Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-2 md:hidden z-40 flex justify-around items-center pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 transition-all ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-neutral-500'}`}><PieChart size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} /><span className="text-[10px] font-medium">Resumo</span></button>
        <div className="relative -top-5"><button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/40 active:scale-90 transition-transform"><Plus size={28} /></button></div>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 transition-all ${activeTab === 'transactions' ? 'text-emerald-500' : 'text-neutral-500'}`}><Receipt size={24} strokeWidth={activeTab === 'transactions' ? 2.5 : 2} /><span className="text-[10px] font-medium">Extrato</span></button>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
