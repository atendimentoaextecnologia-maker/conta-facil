import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Category } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import AddCategoryDialog from './AddCategoryDialog';

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'income' | 'expense';
  categories: Category[];
  categoriesLoading: boolean;
}

export default function AddTransactionSheet({
  open,
  onOpenChange,
  type,
  categories,
  categoriesLoading,
}: AddTransactionSheetProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const { createTransaction } = useTransactions();

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }

    await createTransaction.mutateAsync({
      description: description.trim(),
      amount: numericAmount,
      type,
      category_id: categoryId || null,
      date,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategoryId('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    onOpenChange(false);
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers, comma and dot
    const cleaned = value.replace(/[^\d,\.]/g, '');
    setAmount(cleaned);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl h-auto max-h-[90vh]">
          <SheetHeader className="text-left pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                {type === 'income' ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <SheetTitle className="font-display">
                  Nova {type === 'income' ? 'Receita' : 'Despesa'}
                </SheetTitle>
                <SheetDescription>
                  Preencha os dados da transação
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Supermercado, Salário..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="h-12"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                required
                className="h-12 text-lg font-semibold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Categoria</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setShowCategoryDialog(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova
                </Button>
              </div>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Carregando...
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Nenhuma categoria. Crie uma!
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className={`w-full h-14 text-base font-semibold ${
                type === 'income' 
                  ? 'bg-success hover:bg-success/90' 
                  : 'bg-destructive hover:bg-destructive/90'
              }`}
              disabled={createTransaction.isPending}
            >
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                `Adicionar ${type === 'income' ? 'Receita' : 'Despesa'}`
              )}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <AddCategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        type={type}
      />
    </>
  );
}
