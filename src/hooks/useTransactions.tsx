import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, MonthSummary, CategorySummary } from '@/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export function useTransactions(selectedMonth?: Date) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const month = selectedMonth || new Date();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id, format(month, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) return [];
      
      const start = format(startOfMonth(month), 'yyyy-MM-dd');
      const end = format(endOfMonth(month), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'category'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação adicionada!');
    },
    onError: () => {
      toast.error('Erro ao adicionar transação');
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação excluída!');
    },
    onError: () => {
      toast.error('Erro ao excluir transação');
    },
  });

  // Calculate summary
  const summary: MonthSummary = transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount);
      if (t.type === 'income') {
        acc.income += amount;
      } else {
        acc.expense += amount;
      }
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );

  // Calculate by category
  const expenseByCategory: CategorySummary[] = transactions
    .filter(t => t.type === 'expense' && t.category)
    .reduce((acc: CategorySummary[], t) => {
      const existing = acc.find(c => c.category_id === t.category_id);
      const amount = Number(t.amount);
      
      if (existing) {
        existing.total += amount;
      } else if (t.category) {
        acc.push({
          category_id: t.category_id!,
          category_name: t.category.name,
          category_color: t.category.color,
          category_icon: t.category.icon,
          total: amount,
          percentage: 0,
        });
      }
      return acc;
    }, [])
    .map(c => ({
      ...c,
      percentage: summary.expense > 0 ? (c.total / summary.expense) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    transactions,
    isLoading,
    createTransaction,
    deleteTransaction,
    summary,
    expenseByCategory,
  };
}
