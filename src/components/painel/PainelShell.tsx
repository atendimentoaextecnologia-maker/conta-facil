import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpg';

export const PIE_COLORS = [
  'hsl(var(--brand))',
  'hsl(var(--brand-2))',
  'hsl(var(--warning))',
  'hsl(var(--success))',
  'hsl(var(--destructive))',
];

export const tooltipStyle = {
  background: 'hsl(var(--ink))',
  border: '1px solid hsl(var(--brand) / 0.3)',
  borderRadius: 12,
  color: 'hsl(var(--ink-foreground))',
  fontSize: 12,
};

export function Kpi({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4">
      <div className="flex items-center gap-2 text-ink-muted text-xs uppercase tracking-wider">
        <Icon className="h-4 w-4 text-brand" />
        {label}
      </div>
      <p className="font-display text-2xl md:text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs text-ink-muted mt-1">{hint}</p>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4 md:p-5">
      <h2 className="font-display font-semibold text-base md:text-lg">{title}</h2>
      {subtitle && <p className="text-xs text-ink-muted mt-1 mb-3">{subtitle}</p>}
      <div className="h-[260px] mt-3">{children}</div>
    </div>
  );
}

export function PainelHeader({ whatsappText }: { whatsappText: string }) {
  return (
    <header className="border-b border-ink-foreground/10 sticky top-0 z-20 bg-ink/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/#portfolio" className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink-foreground transition">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-2">
          <img src={logo} alt="A&X Análise de Dados" className="h-7 w-7 rounded object-cover" />
          <span className="font-display font-semibold hidden sm:inline">A&amp;X Análise de Dados</span>
        </div>
        <Button asChild className="bg-gradient-brand text-ink font-semibold" size="sm">
          <a
            href={`https://wa.me/5565992747522?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com a A&amp;X
          </a>
        </Button>
      </div>
    </header>
  );
}

export function PainelFooterCTA({ whatsappText }: { whatsappText: string }) {
  return (
    <>
      <p className="text-xs text-ink-muted/70 mt-6">
        Dados fictícios criados para demonstração. Em projetos reais conectamos diretamente ao seu ERP, CRM,
        sistema de gestão ou planilhas, com atualização automática em Power BI ou web.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="bg-gradient-brand text-ink font-semibold">
          <a
            href={`https://wa.me/5565992747522?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero um painel assim
          </a>
        </Button>
        <Button asChild variant="outline" className="border-ink-foreground/20 bg-transparent text-ink-foreground hover:bg-ink-foreground/10">
          <Link to="/#portfolio">Ver outros painéis</Link>
        </Button>
      </div>
    </>
  );
}