import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface AnnualMonthData {
  month: string;
  monthLabel: string;
  totalBudget: number;
  totalSpent: number;
  totalIncome: number;
  balance: number;
  savingsRate: number;
}

export interface AnnualSummary {
  year: number;
  months: AnnualMonthData[];
  totals: {
    totalBudget: number;
    totalSpent: number;
    totalIncome: number;
    totalBalance: number;
    avgSavingsRate: number;
    bestMonth: AnnualMonthData | null;
    worstMonth: AnnualMonthData | null;
  };
}

export function useAnnualSummary(year: number = new Date().getFullYear()) {
  const { user } = useAuth();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['annual_summary', user?.id, year],
    queryFn: async (): Promise<AnnualSummary> => {
      if (!user) {
        return {
          year,
          months: [],
          totals: {
            totalBudget: 0,
            totalSpent: 0,
            totalIncome: 0,
            totalBalance: 0,
            avgSavingsRate: 0,
            bestMonth: null,
            worstMonth: null,
          },
        };
      }

      const yearStart = startOfYear(new Date(year, 0, 1));
      const yearEnd = endOfYear(new Date(year, 0, 1));
      const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

      // Fetch all transactions for the year
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .gte('date', format(yearStart, 'yyyy-MM-dd'))
        .lte('date', format(yearEnd, 'yyyy-MM-dd'));

      if (txError) throw txError;

      // Fetch savings settings for the year
      const { data: savingsSettings, error: settingsError } = await supabase
        .from('savings_settings')
        .select('savings_percentage, month')
        .eq('user_id', user.id)
        .gte('month', format(yearStart, 'yyyy-MM-dd'))
        .lte('month', format(yearEnd, 'yyyy-MM-dd'));

      if (settingsError) throw settingsError;

      const monthsData: AnnualMonthData[] = monthsInYear.map((monthDate) => {
        const monthStr = format(startOfMonth(monthDate), 'yyyy-MM-dd');
        const monthLabel = format(monthDate, 'MMM', { locale: ptBR });

        // Filter transactions for this month
        const monthTransactions = transactions?.filter((t) => {
          const txDate = new Date(t.date);
          return txDate.getMonth() === monthDate.getMonth() && txDate.getFullYear() === monthDate.getFullYear();
        }) || [];

        // Get savings percentage for this month (default 30%)
        const monthSettings = savingsSettings?.find((s) => s.month === monthStr);
        const savingsPercentage = monthSettings?.savings_percentage ?? 30;

        const totalIncome = monthTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpenses = monthTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        // Budget is based on savings percentage
        const totalBudget = totalIncome * (Number(savingsPercentage) / 100);
        const balance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        return {
          month: monthStr,
          monthLabel,
          totalBudget,
          totalSpent: totalExpenses,
          totalIncome,
          balance,
          savingsRate,
        };
      });

      // Calculate totals
      const totalBudget = monthsData.reduce((sum, m) => sum + m.totalBudget, 0);
      const totalSpent = monthsData.reduce((sum, m) => sum + m.totalSpent, 0);
      const totalIncome = monthsData.reduce((sum, m) => sum + m.totalIncome, 0);
      const totalBalance = monthsData.reduce((sum, m) => sum + m.balance, 0);
      
      const monthsWithData = monthsData.filter((m) => m.totalIncome > 0 || m.totalSpent > 0);
      const avgSavingsRate = monthsWithData.length > 0
        ? monthsWithData.reduce((sum, m) => sum + m.savingsRate, 0) / monthsWithData.length
        : 0;

      const bestMonth = monthsWithData.length > 0
        ? monthsWithData.reduce((best, m) => (m.savingsRate > best.savingsRate ? m : best), monthsWithData[0])
        : null;
      const worstMonth = monthsWithData.length > 0
        ? monthsWithData.reduce((worst, m) => (m.savingsRate < worst.savingsRate ? m : worst), monthsWithData[0])
        : null;

      return {
        year,
        months: monthsData,
        totals: {
          totalBudget,
          totalSpent,
          totalIncome,
          totalBalance,
          avgSavingsRate,
          bestMonth,
          worstMonth,
        },
      };
    },
    enabled: !!user,
  });

  return {
    summary: summary || {
      year,
      months: [],
      totals: {
        totalBudget: 0,
        totalSpent: 0,
        totalIncome: 0,
        totalBalance: 0,
        avgSavingsRate: 0,
        bestMonth: null,
        worstMonth: null,
      },
    },
    isLoading,
  };
}
