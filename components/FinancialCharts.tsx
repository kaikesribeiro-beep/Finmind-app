import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, CATEGORIES } from '../types';

interface FinancialChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#64748b'];

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryData = CATEGORIES.map(cat => {
    const value = expenses
      .filter(t => t.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: cat, value };
  }).filter(item => item.value > 0);

  const dailyDataMap = new Map<string, { date: string; income: number; expense: number }>();
  
  transactions.forEach(t => {
    const dateObj = new Date(t.date);
    const dateLabel = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!dailyDataMap.has(dateLabel)) {
      dailyDataMap.set(dateLabel, { date: dateLabel, income: 0, expense: 0 });
    }
    const entry = dailyDataMap.get(dateLabel)!;
    if (t.type === 'income') entry.income += t.amount;
    else entry.expense += t.amount;
  });

  const dailyData = Array.from(dailyDataMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-neutral-800 p-8 rounded-2xl flex items-center justify-center h-64 text-neutral-600">
        Gráficos aguardando dados...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
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
                wrapperStyle={{ color: '#a3a3a3', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-neutral-800 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-bold text-white mb-6">Fluxo Recente</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} stroke="#666" />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} stroke="#666" />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                cursor={{fill: '#262626'}}
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }}/>
              <Bar dataKey="income" name="Entrada" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="expense" name="Saída" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
