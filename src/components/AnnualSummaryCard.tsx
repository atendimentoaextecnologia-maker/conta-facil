import { useState, useRef } from 'react';
import { useAnnualSummary } from '@/hooks/useAnnualSummary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Target,
  Trophy,
  AlertCircle,
  Download,
  Loader2
} from 'lucide-react';
import { generateAnnualReportPDF } from './AnnualReportPDF';
import { toast } from 'sonner';

export default function AnnualSummaryCard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { summary, isLoading } = useAnnualSummary(selectedYear);

  const handleExportPDF = async () => {
    if (!summary || isExporting) return;
    
    setIsExporting(true);
    try {
      await generateAnnualReportPDF({
        summary,
        chartElement: chartRef.current,
      });
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Erro ao exportar relatório');
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card className="p-4 mb-4 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-40 w-full" />
      </Card>
    );
  }

  const hasData = summary.months.some((m) => m.totalIncome > 0 || m.totalSpent > 0);
  const maxValue = Math.max(
    ...summary.months.map((m) => Math.max(m.totalIncome, m.totalBudget, m.totalSpent))
  );

  return (
    <Card className="p-4 mb-4 shadow-card animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold">Resumo Anual</h2>
        </div>
        <div className="flex items-center gap-1">
          {hasData && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleExportPDF}
              disabled={isExporting}
              title="Exportar PDF"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSelectedYear((y) => y - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">{selectedYear}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSelectedYear((y) => y + 1)}
            disabled={selectedYear >= currentYear}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum dado para {selectedYear}</p>
        </div>
      ) : (
        <>
          {/* Annual Chart */}
          <div ref={chartRef} className="bg-card">
            <div className="flex items-end justify-between gap-1 h-28 mb-3 px-1">
              {summary.months.map((month) => {
                const incomeHeight = maxValue > 0 ? (month.totalIncome / maxValue) * 100 : 0;
                const spentHeight = maxValue > 0 ? (month.totalSpent / maxValue) * 100 : 0;
                const isOverBudget = month.totalSpent > month.totalBudget;
                
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center gap-0.5 h-24">
                      {/* Income bar */}
                      <div
                        className="w-2 rounded-t bg-success/60 transition-all"
                        style={{ height: `${incomeHeight}%`, minHeight: month.totalIncome > 0 ? '2px' : '0' }}
                        title={`Receita: ${formatCurrencyFull(month.totalIncome)}`}
                      />
                      {/* Spent bar */}
                      <div
                        className={`w-2 rounded-t transition-all ${
                          isOverBudget ? 'bg-destructive' : 'bg-destructive/60'
                        }`}
                        style={{ height: `${spentHeight}%`, minHeight: month.totalSpent > 0 ? '2px' : '0' }}
                        title={`Gasto: ${formatCurrencyFull(month.totalSpent)}`}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 capitalize">
                      {month.monthLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-success/60" />
                <span>Receitas</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-destructive/60" />
                <span>Gastos em metas</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-success" />
                <span className="text-xs text-muted-foreground">Total Receitas</span>
              </div>
              <p className="font-semibold text-success">{formatCurrency(summary.totals.totalIncome)}</p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Total Orçado</span>
              </div>
              <p className="font-semibold text-primary">{formatCurrency(summary.totals.totalBudget)}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs text-muted-foreground">Total Gasto</span>
              </div>
              <p className="font-semibold text-destructive">{formatCurrency(summary.totals.totalSpent)}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Saldo Anual</span>
              </div>
              <p className={`font-semibold ${summary.totals.totalBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(summary.totals.totalBalance)}
              </p>
            </div>
          </div>

          {/* Best/Worst Month */}
          {(summary.totals.bestMonth || summary.totals.worstMonth) && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex gap-2">
                {summary.totals.bestMonth && (
                  <div className="flex-1 flex items-center gap-2 text-xs">
                    <Trophy className="h-3.5 w-3.5 text-success" />
                    <span className="text-muted-foreground">Melhor:</span>
                    <span className="font-medium capitalize">{summary.totals.bestMonth.monthLabel}</span>
                    <span className="text-success">({summary.totals.bestMonth.savingsRate.toFixed(0)}%)</span>
                  </div>
                )}
                {summary.totals.worstMonth && summary.totals.bestMonth !== summary.totals.worstMonth && (
                  <div className="flex-1 flex items-center gap-2 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-muted-foreground">Pior:</span>
                    <span className="font-medium capitalize">{summary.totals.worstMonth.monthLabel}</span>
                    <span className="text-destructive">({summary.totals.worstMonth.savingsRate.toFixed(0)}%)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
