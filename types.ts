export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  isFixed?: boolean; // Indicates recurring monthly transaction
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
] as const;

export type CategoryType = typeof CATEGORIES[number];