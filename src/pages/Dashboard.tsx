import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { Navigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  LogOut,
  PieChart,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TransactionList from '@/components/TransactionList';
import AddTransactionSheet from '@/components/AddTransactionSheet';
import CategoryChart from '@/components/CategoryChart';
import SavingsCircuitCard from '@/components/SavingsCircuitCard';
import AnnualSummaryCard from '@/components/AnnualSummaryCard';
import ImportCSVSheet from '@/components/ImportCSVSheet';
import logo from '@/assets/logo.jpg';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showImportSheet, setShowImportSheet] = useState(false);
  const [addType, setAddType] = useState<'income' | 'expense'>('expense');
  const { summary, expenseByCategory, isLoading } = useTransactions(selectedMonth);
  const { categories, isLoading: categoriesLoading } = useCategories();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary-foreground/20" />
          <p className="text-primary-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleAddTransaction = (type: 'income' | 'expense') => {
    setAddType(type);
    setShowAddSheet(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="gradient-primary px-4 pt-4 pb-8 rounded-b-3xl shadow-elevated">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-card shadow-card">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <p className="text-primary-foreground/80 text-xs">Olá!</p>
              <p className="text-primary-foreground font-semibold text-sm truncate max-w-[150px]">
                {user.email?.split('@')[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setShowImportSheet(true)}
              title="Importar CSV"
            >
              <Upload className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-primary-foreground font-display font-semibold capitalize">
            {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-card/95 backdrop-blur shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-success" />
              </div>
              <span className="text-xs text-muted-foreground">Receitas</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <p className="font-semibold text-success text-sm">
                {formatCurrency(summary.income)}
              </p>
            )}
          </Card>

          <Card className="p-3 bg-card/95 backdrop-blur shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="h-3 w-3 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground">Despesas</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <p className="font-semibold text-destructive text-sm">
                {formatCurrency(summary.expense)}
              </p>
            )}
          </Card>

          <Card className="p-3 bg-card/95 backdrop-blur shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Saldo</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <p className={`font-semibold text-sm ${summary.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(summary.balance)}
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-2">
        {/* Savings Circuit */}
        <SavingsCircuitCard
          selectedMonth={selectedMonth}
          income={summary.income}
          expense={summary.expense}
        />

        {/* Annual Summary */}
        <AnnualSummaryCard />

        {/* Category Chart */}
        {expenseByCategory.length > 0 && (
          <Card className="p-4 mb-4 shadow-card animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold">Gastos por Categoria</h2>
            </div>
            <CategoryChart data={expenseByCategory} />
          </Card>
        )}

        {/* Transactions */}
        <TransactionList selectedMonth={selectedMonth} />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        <Button
          onClick={() => handleAddTransaction('expense')}
          className="h-14 px-6 rounded-full shadow-elevated bg-destructive hover:bg-destructive/90"
        >
          <TrendingDown className="h-5 w-5 mr-2" />
          Despesa
        </Button>
        <Button
          onClick={() => handleAddTransaction('income')}
          className="h-14 px-6 rounded-full shadow-elevated bg-success hover:bg-success/90"
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          Receita
        </Button>
      </div>

      <AddTransactionSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        type={addType}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />

      <ImportCSVSheet
        open={showImportSheet}
        onOpenChange={setShowImportSheet}
      />
    </div>
  );
}
