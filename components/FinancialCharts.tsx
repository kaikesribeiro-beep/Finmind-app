import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Transaction, CATEGORIES } from '../types';

interface FinancialChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#64748b', '#71717a'];

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-neutral-800 p-8 rounded-2xl flex items-center justify-center h-64 text-neutral-600">
        Gráficos aguardando dados...
      </div>
    );
  }

  // Data for Pie Chart (Expenses by Category)
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryData = CATEGORIES.map(cat => {
    const value = expenses
      .filter(t => t.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: cat, value };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);

  // Data for Bar Chart (Daily Flow - Last 7 days with activity)
  const dailyDataMap = new Map<string, { date: string; fullDate: string; income: number; expense: number }>();
  transactions.forEach(t => {
     // Use string comparison to avoid TZ issues
    const dateStr = t.date; 
    const dateObj = new Date(dateStr);
    const dateLabel = `${dateObj.getUTCDate().toString().padStart(2, '0')}/${(dateObj.getUTCMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!dailyDataMap.has(dateStr)) {
      dailyDataMap.set(dateStr, { date: dateLabel, fullDate: dateStr, income: 0, expense: 0 });
    }
    const entry = dailyDataMap.get(dateStr)!;
    if (t.type === 'income') entry.income += t.amount;
    else entry.expense += t.amount;
  });
  
  const dailyData = Array.from(dailyDataMap.values())
    .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
    .slice(-10); // Show last 10 active days

  // Data for Line Chart (Balance Evolution - Monthly)
  const monthlyDataMap = new Map<string, { month: string; sortKey: string; balance: number }>();
  
  // Initialize balance accumulator
  // This logic is simplified: it calculates net for each month, it's not a running total balance since beginning of time, but monthly performance.
  transactions.forEach(t => {
      const monthKey = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyDataMap.has(monthKey)) {
          monthlyDataMap.set(monthKey, { month: monthKey, sortKey: monthKey, balance: 0 });
      }
      const entry = monthlyDataMap.get(monthKey)!;
      if (t.type === 'income') entry.balance += t.amount;
      else entry.balance -= t.amount;
  });

  const evolutionData = Array.from(monthlyDataMap.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .slice(-6); // Last 6 months

  return (
    <div className="space-y-6 mb-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart */}
        <div className="bg-card border border-neutral-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6">Despesas por Categoria</h3>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#e0e0e0' }}
                />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ color: '#a3a3a3', fontSize: '11px' }}
                />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-neutral-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6">Fluxo Diário (Recente)</h3>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} stroke="#666" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} stroke="#666" />
                <Tooltip 
                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    cursor={{fill: '#262626'}}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                <Bar dataKey="income" name="Entrada" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Saída" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
        </div>

        {/* Evolution Line Chart */}
        {evolutionData.length > 1 && (
             <div className="bg-card border border-neutral-800 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-white mb-6">Evolução de Saldo (Mensal)</h3>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#666" />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} stroke="#666" />
                    <Tooltip 
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="balance" name="Saldo Mensal" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
        )}
    </div>
  );
};