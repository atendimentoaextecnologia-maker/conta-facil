import { useState, useEffect, useRef } from 'react';
import { useSavingsSettings } from '@/hooks/useSavingsSettings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  PiggyBank, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Pencil,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface SavingsCircuitCardProps {
  selectedMonth: Date;
  income: number;
  expense: number;
}

export default function SavingsCircuitCard({
  selectedMonth,
  income,
  expense,
}: SavingsCircuitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [percentageInput, setPercentageInput] = useState('30');
  const notifiedRef = useRef(false);
  
  const { settings, progress, isLoading, upsertSettings } = useSavingsSettings(
    selectedMonth,
    income,
    expense
  );

  // Reset notification state when month changes
  useEffect(() => {
    notifiedRef.current = false;
  }, [selectedMonth]);

  // Sync input with settings
  useEffect(() => {
    if (settings?.savings_percentage) {
      setPercentageInput(String(settings.savings_percentage));
    }
  }, [settings]);

  // Notification when savings goal is at risk
  useEffect(() => {
    if (!progress || notifiedRef.current || income === 0) return;

    if (progress.progressPercent < 50 && progress.expense > 0) {
      toast.warning('Atenção: sua economia está abaixo da meta!', {
        description: `Você precisa economizar mais R$ ${Math.abs(progress.remaining).toFixed(2)} para atingir a meta.`,
      });
      notifiedRef.current = true;
    } else if (progress.isOnTrack && progress.currentSaved > 0) {
      toast.success('Parabéns! Você está no caminho certo!', {
        description: `Economia atual: R$ ${progress.currentSaved.toFixed(2)}`,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      notifiedRef.current = true;
    }
  }, [progress, income]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSave = () => {
    const value = parseFloat(percentageInput);
    if (isNaN(value) || value < 1 || value > 100) {
      toast.error('Digite um percentual entre 1 e 100');
      return;
    }
    upsertSettings.mutate(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPercentageInput(String(settings?.savings_percentage ?? 30));
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="p-4 mb-4 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  const percentage = progress?.percentage ?? 30;
  const hasIncome = income > 0;

  return (
    <Card className="p-4 mb-4 shadow-card animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold">Circuito de Economia</h2>
        </div>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 px-2"
          >
            <Pencil className="h-4 w-4 mr-1" />
            {percentage}%
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={percentageInput}
              onChange={(e) => setPercentageInput(e.target.value)}
              className="w-16 h-8 text-center"
              min={1}
              max={100}
            />
            <span className="text-sm text-muted-foreground">%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleSave}
              disabled={upsertSettings.isPending}
            >
              <Check className="h-4 w-4 text-success" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      {!hasIncome ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Adicione receitas para ver seu progresso de economia
          </p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Progresso</span>
              <span className="text-sm font-medium">
                {progress?.progressPercent.toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={progress?.progressPercent ?? 0} 
              className="h-3"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Receita</span>
              </div>
              <p className="font-semibold text-success">
                {formatCurrency(income)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <span className="text-xs text-muted-foreground">Despesa</span>
              </div>
              <p className="font-semibold text-destructive">
                {formatCurrency(expense)}
              </p>
            </div>
          </div>

          {/* Savings Summary */}
          <div className={`rounded-lg p-4 ${
            progress?.isOnTrack 
              ? 'bg-success/10 border border-success/20' 
              : 'bg-warning/10 border border-warning/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Meta: economizar {percentage}%
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(progress?.targetAmount ?? 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">
                  Economizado
                </p>
                <p className={`text-lg font-bold ${
                  progress?.isOnTrack ? 'text-success' : 'text-warning'
                }`}>
                  {formatCurrency(progress?.currentSaved ?? 0)}
                </p>
              </div>
            </div>

            {/* Status Message */}
            <div className={`mt-3 flex items-center gap-2 text-sm ${
              progress?.isOnTrack ? 'text-success' : 'text-warning'
            }`}>
              {progress?.isOnTrack ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Você está no caminho certo! 🎉</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    Faltam {formatCurrency(Math.abs(progress?.remaining ?? 0))} para a meta
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
