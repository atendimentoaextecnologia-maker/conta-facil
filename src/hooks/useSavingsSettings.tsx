import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SavingsSettings, SavingsProgress } from '@/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { startOfMonth, format } from 'date-fns';

export function useSavingsSettings(selectedMonth?: Date, income?: number, expense?: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const month = selectedMonth || new Date();
  const monthStr = format(startOfMonth(month), 'yyyy-MM-dd');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['savings_settings', user?.id, format(month, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('savings_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', monthStr)
        .maybeSingle();
      
      if (error) throw error;
      return data as SavingsSettings | null;
    },
    enabled: !!user,
  });

  // Calculate savings progress
  const progress: SavingsProgress | null = (() => {
    const currentIncome = income ?? 0;
    const currentExpense = expense ?? 0;
    const percentage = settings?.savings_percentage ?? 30;
    const targetAmount = currentIncome * (percentage / 100);
    const currentSaved = currentIncome - currentExpense;
    const remaining = targetAmount - currentSaved;
    const isOnTrack = currentSaved >= targetAmount;
    const progressPercent = targetAmount > 0 
      ? Math.min((currentSaved / targetAmount) * 100, 100)
      : 0;

    return {
      percentage,
      targetAmount,
      currentSaved,
      remaining,
      income: currentIncome,
      expense: currentExpense,
      isOnTrack,
      progressPercent: Math.max(0, progressPercent),
    };
  })();

  const upsertSettings = useMutation({
    mutationFn: async (savingsPercentage: number) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('savings_settings')
        .upsert(
          { 
            user_id: user.id,
            month: monthStr,
            savings_percentage: savingsPercentage,
          },
          { onConflict: 'user_id,month' }
        )
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings_settings'] });
      toast.success('Meta de economia atualizada!');
    },
    onError: () => {
      toast.error('Erro ao atualizar meta');
    },
  });

  return {
    settings,
    progress,
    isLoading,
    upsertSettings,
  };
}
