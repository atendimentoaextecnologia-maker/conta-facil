import { CategorySummary } from '@/types';

interface CategoryChartProps {
  data: CategorySummary[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-3">
      {/* Bar Chart */}
      <div className="h-4 rounded-full overflow-hidden bg-muted flex">
        {data.map((item, index) => (
          <div
            key={item.category_id}
            className="h-full transition-all"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.category_color,
            }}
            title={`${item.category_name}: ${formatCurrency(item.total)}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {data.slice(0, 5).map((item) => (
          <div key={item.category_id} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.category_color }}
              />
              <span className="text-sm truncate">{item.category_name}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-medium">{formatCurrency(item.total)}</span>
              <span className="text-xs text-muted-foreground w-10 text-right">
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
        {data.length > 5 && (
          <p className="text-xs text-muted-foreground text-center pt-1">
            +{data.length - 5} outras categorias
          </p>
        )}
      </div>
    </div>
  );
}
