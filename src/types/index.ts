export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface MonthSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  category_id: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  total: number;
  percentage: number;
}

export interface SavingsSettings {
  id: string;
  user_id: string;
  savings_percentage: number;
  month: string;
  created_at: string;
  updated_at: string;
}

export interface SavingsProgress {
  percentage: number;
  targetAmount: number;
  currentSaved: number;
  remaining: number;
  income: number;
  expense: number;
  isOnTrack: boolean;
  progressPercent: number;
}
