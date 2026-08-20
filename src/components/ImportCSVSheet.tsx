import { useState, useRef } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, 
  FileSpreadsheet, 
  Loader2, 
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ParsedTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  selected: boolean;
}

interface ImportCSVSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImportCSVSheet({ open, onOpenChange }: ImportCSVSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [importedCount, setImportedCount] = useState(0);
  
  const { createTransaction } = useTransactions();
  const { categories } = useCategories();
  
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const parseCSV = (content: string): ParsedTransaction[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const transactions: ParsedTransaction[] = [];
    
    // Skip header if present (detect by checking if first line contains typical header words)
    let startIndex = 0;
    const firstLine = lines[0]?.toLowerCase() || '';
    if (
      firstLine.includes('data') || 
      firstLine.includes('date') || 
      firstLine.includes('descri') ||
      firstLine.includes('valor') ||
      firstLine.includes('amount')
    ) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Handle both comma and semicolon separators
      const separator = line.includes(';') ? ';' : ',';
      const parts = line.split(separator).map(p => p.trim().replace(/^"|"$/g, ''));
      
      if (parts.length < 3) continue;

      // Try to detect date, description, and amount
      // Common formats: date, description, amount OR description, date, amount
      let date = '';
      let description = '';
      let amount = 0;

      // Try to find date (DD/MM/YYYY or YYYY-MM-DD format)
      for (const part of parts) {
        const dateMatch = part.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
        if (dateMatch) {
          const [, d, m, y] = dateMatch;
          date = `${y}-${m}-${d}`;
          break;
        }
        const isoMatch = part.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
          date = part;
          break;
        }
      }

      // Try to find amount (number with optional comma/dot decimal)
      for (const part of parts) {
        // Clean the value: remove currency symbols and spaces
        const cleaned = part.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num !== 0) {
          // We want expenses, so take absolute value
          amount = Math.abs(num);
          break;
        }
      }

      // The remaining part is likely the description
      for (const part of parts) {
        if (
          !part.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/) && 
          !part.match(/\d{4}-\d{2}-\d{2}/) &&
          isNaN(parseFloat(part.replace(/[R$\s\.,]/g, '')))
        ) {
          if (part.length > description.length) {
            description = part;
          }
        }
      }

      if (date && description && amount > 0) {
        transactions.push({
          id: `${i}-${Date.now()}`,
          date,
          description,
          amount,
          selected: true,
        });
      }
    }

    return transactions;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCSV(content);
      
      if (parsed.length === 0) {
        toast.error('Não foi possível identificar transações no arquivo');
        return;
      }

      setParsedData(parsed);
      setStep('preview');
      toast.success(`${parsed.length} transações encontradas`);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const toggleTransaction = (id: string) => {
    setParsedData(prev => 
      prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t)
    );
  };

  const toggleAll = (checked: boolean) => {
    setParsedData(prev => prev.map(t => ({ ...t, selected: checked })));
  };

  const handleImport = async () => {
    const selectedTransactions = parsedData.filter(t => t.selected);
    
    if (selectedTransactions.length === 0) {
      toast.error('Selecione pelo menos uma transação');
      return;
    }

    setIsImporting(true);
    let successCount = 0;

    try {
      for (const transaction of selectedTransactions) {
        await createTransaction.mutateAsync({
          description: transaction.description,
          amount: transaction.amount,
          type: 'expense',
          category_id: selectedCategoryId || null,
          date: transaction.date,
        });
        successCount++;
      }

      setImportedCount(successCount);
      setStep('success');
      toast.success(`${successCount} transações importadas com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao importar. ${successCount} de ${selectedTransactions.length} importadas.`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setParsedData([]);
    setSelectedCategoryId('');
    setStep('upload');
    setImportedCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const selectedCount = parsedData.filter(t => t.selected).length;
  const totalAmount = parsedData.filter(t => t.selected).reduce((sum, t) => sum + t.amount, 0);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] flex flex-col">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="font-display">
                Importar Extrato CSV
              </SheetTitle>
              <SheetDescription>
                {step === 'upload' && 'Selecione um arquivo CSV do seu extrato bancário'}
                {step === 'preview' && 'Revise e confirme as transações'}
                {step === 'success' && 'Importação concluída'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {step === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-xs h-48 border-2 border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Clique para selecionar</p>
                <p className="text-sm text-muted-foreground">ou arraste o arquivo CSV</p>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground max-w-xs">
              <p className="font-medium mb-2">Formatos suportados:</p>
              <p>Data, Descrição, Valor</p>
              <p className="text-xs mt-2">Separadores: vírgula (,) ou ponto-e-vírgula (;)</p>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <>
            <div className="space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedCount === parsedData.length}
                    onCheckedChange={(checked) => toggleAll(!!checked)}
                  />
                  <span className="text-sm">
                    {selectedCount} de {parsedData.length} selecionadas
                  </span>
                </div>
                <span className="text-sm font-semibold text-destructive">
                  Total: {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="space-y-2">
                <Label>Categoria para importação</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="flex-1 -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((transaction) => (
                    <TableRow key={transaction.id} className={!transaction.selected ? 'opacity-50' : ''}>
                      <TableCell>
                        <Checkbox 
                          checked={transaction.selected}
                          onCheckedChange={() => toggleTransaction(transaction.id)}
                        />
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(transaction.date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-sm max-w-[150px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-destructive">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep('upload');
                  setParsedData([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Voltar
              </Button>
              <Button
                className="flex-1"
                onClick={handleImport}
                disabled={isImporting || selectedCount === 0}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  `Importar ${selectedCount} transações`
                )}
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{importedCount} transações</p>
              <p className="text-muted-foreground">importadas com sucesso!</p>
            </div>
            <Button onClick={handleClose} className="mt-4">
              Concluir
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
