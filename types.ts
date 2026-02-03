export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export type HealthStatus = 'POSITIVE' | 'NEUTRAL' | 'RISK';

export interface AnalysisData {
  healthStatus: HealthStatus;
  mainInsight: string; 
  monthlyComparison: string; 
  biggestSpender: {
    category: string;
    amount: number;
    comment: string;
  };
  alerts: string[]; 
  suggestions: string[]; 
  projectedBalance: string; 
  lastUpdated: number;
}

export interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

export const CATEGORIES = [
  'Renda',
  'Comida',
  'Transporte',
  'Despesa', // Geral
  'Outros',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Investimentos',
];