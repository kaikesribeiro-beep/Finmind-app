import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SummaryCards } from './components/SummaryCards.tsx';
import { TransactionForm } from './components/TransactionForm.tsx';
import { FinancialCharts } from './components/FinancialCharts.tsx';
import { TransactionList } from './components/TransactionList.tsx';
import { AIAnalyst } from './components/AIAnalyst.tsx';
import { BudgetManager } from './components/BudgetManager.tsx';
import { SimulationPanel } from './components/SimulationPanel.tsx';
import { Transaction, Budget } from './types';
import { LayoutDashboard, Receipt, PieChart, Plus, CheckCircle2, Download } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'planning'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Sucesso!');

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finmindTransactions');
    if (saved) return JSON.parse(saved);
    return [
      {id: '1', description: 'Salário', amount: 3500, type: 'income', category: 'Renda', date: '2026-02-01', isFixed: true},
      {id: '2', description: 'Almoço', amount: 45, type: 'expense', category: 'Comida', date: '2026-02-03', isFixed: false}
    ];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('finmind_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('finmindTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finmind_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Recurring Transactions Logic: Check on load
  useEffect(() => {
    const checkRecurring = () => {
      const today = new Date();
      const currentMonth = today.toISOString().substring(0, 7); // YYYY-MM
      
      const fixedTransactions = transactions.filter(t => t.isFixed);
      let newRecurringAdded = false;

      const newTransactions = [...transactions];

      fixedTransactions.forEach(ft => {
         const ftMonth = ft.date.substring(0, 7);
         // If fixed transaction is from a previous month
         if (ftMonth < currentMonth) {
             // Check if it already exists in current month (simple logic: same description, same amount)
             const alreadyExists = transactions.some(t => 
                 t.date.startsWith(currentMonth) && 
                 t.description === ft.description && 
                 t.amount === ft.amount
             );

             if (!alreadyExists) {
                 // Create clone for this month (set to 1st of month or today)
                 const clone: Transaction = {
                     ...ft,
                     id: crypto.randomUUID(),
                     date: `${currentMonth}-01` // Sets to 1st of current month
                 };
                 newTransactions.push(clone);
                 newRecurringAdded = true;
             }
         }
      });

      if (newRecurringAdded) {
          setTransactions(newTransactions);
          setToastMessage('Despesas recorrentes lançadas!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
      }
    };

    checkRecurring();
    // Dependency array is empty to run once on mount (or when transactions load initially)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleSaveTransaction = (data: Omit<Transaction, 'id'> & { id?: string }) => {
    if (data.id) {
        // Edit existing
        setTransactions(prev => prev.map(t => t.id === data.id ? { ...data, id: data.id! } : t));
        setToastMessage('Transação atualizada!');
    } else {
        // Add new
        const newTransaction: Transaction = {
            ...data,
            id: crypto.randomUUID(),
        };
        setTransactions(prev => [...prev, newTransaction]);
        setToastMessage('Transação adicionada!');
        setActiveTab('dashboard');
    }
    
    setEditingTransaction(null); // Reset edit state
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditClick = (transaction: Transaction) => {
      setEditingTransaction(transaction);
      setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        setTransactions((prev) => prev.filter(t => t.id !== id));
    }
  };

  const updateBudget = (newBudget: Budget) => {
    setBudgets(prev => {
      const filtered = prev.filter(b => b.category !== newBudget.category);
      return [...filtered, newBudget];
    });
  };

  const handleExportCSV = () => {
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Fixo'];
    const rows = transactions.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
        t.category,
        t.type === 'income' ? 'Receita' : 'Despesa',
        t.amount.toFixed(2).replace('.', ','),
        t.isFixed ? 'Sim' : 'Não'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finmind_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h4 className="font-bold text-sm">{toastMessage}</h4>
          </div>
        </div>
      )}

      {/* Navbar */}
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
                    <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-neutral-800 text-white shadow' : 'text-text-muted hover:text-white'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-neutral-800 text-white shadow' : 'text-text-muted hover:text-white'}`}>Transações</button>
                    <button onClick={() => setActiveTab('planning')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'planning' ? 'bg-neutral-800 text-white shadow' : 'text-text-muted hover:text-white'}`}>Planejamento</button>
                </div>
                
                <button 
                  onClick={handleExportCSV}
                  className="p-2.5 text-text-muted hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
                  title="Exportar CSV"
                >
                   <Download size={20} />
                </button>

                <button 
                  onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
                  className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 text-sm shadow-lg shadow-primary/20"
                >
                  <Plus size={18} />
                  Adicionar
                </button>
            </div>
            
            {/* Mobile Export Button (only icon) */}
            <div className="md:hidden">
               <button 
                  onClick={handleExportCSV}
                  className="p-2 text-text-muted hover:text-white"
                >
                   <Download size={20} />
                </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-6">
                <SummaryCards transactions={transactions} />
                <AIAnalyst transactions={transactions} onOpenModal={() => { setEditingTransaction(null); setIsModalOpen(true); }} />
                <FinancialCharts transactions={transactions} />
            </div>
        )}

        {activeTab === 'transactions' && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Todas as Transações</h2>
                    </div>
                    <TransactionList 
                        transactions={transactions} 
                        onDelete={handleDeleteTransaction} 
                        onEdit={handleEditClick}
                    />
                </div>
            </div>
        )}

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

      {/* Global Transaction Modal (Add/Edit) */}
      <TransactionForm 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} 
        onSave={handleSaveTransaction} 
        initialData={editingTransaction}
      />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-neutral-800 p-2 md:hidden z-40 flex justify-around items-center pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 transition-all ${activeTab === 'dashboard' ? 'text-primary' : 'text-neutral-500'}`}>
            <PieChart size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Resumo</span>
        </button>
        
        <div className="relative -top-5">
             <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="flex items-center justify-center w-14 h-14 bg-primary rounded-full text-white shadow-lg shadow-primary/40 active:scale-90 transition-transform">
                <Plus size={28} />
             </button>
        </div>

        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 transition-all ${activeTab === 'transactions' ? 'text-primary' : 'text-neutral-500'}`}>
            <Receipt size={24} strokeWidth={activeTab === 'transactions' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Extrato</span>
        </button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
