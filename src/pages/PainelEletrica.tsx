import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Lightbulb, Wrench, Timer, ShieldCheck, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpg';

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const execucaoMensal = [
  { mes: 'Jan', linhaViva: 62, postes: 18, iluminacao: 240, ramais: 95 },
  { mes: 'Fev', linhaViva: 58, postes: 21, iluminacao: 268, ramais: 88 },
  { mes: 'Mar', linhaViva: 71, postes: 25, iluminacao: 302, ramais: 104 },
  { mes: 'Abr', linhaViva: 66, postes: 19, iluminacao: 288, ramais: 99 },
  { mes: 'Mai', linhaViva: 78, postes: 27, iluminacao: 331, ramais: 118 },
  { mes: 'Jun', linhaViva: 74, postes: 23, iluminacao: 315, ramais: 112 },
  { mes: 'Jul', linhaViva: 83, postes: 30, iluminacao: 358, ramais: 126 },
  { mes: 'Ago', linhaViva: 91, postes: 28, iluminacao: 372, ramais: 133 },
  { mes: 'Set', linhaViva: 86, postes: 26, iluminacao: 349, ramais: 121 },
  { mes: 'Out', linhaViva: 95, postes: 33, iluminacao: 388, ramais: 140 },
  { mes: 'Nov', linhaViva: 102, postes: 31, iluminacao: 401, ramais: 147 },
  { mes: 'Dez', linhaViva: 97, postes: 29, iluminacao: 377, ramais: 138 },
];

const sla = [
  { mes: 'Jan', dentro: 92, tma: 4.6 },
  { mes: 'Fev', dentro: 90, tma: 4.9 },
  { mes: 'Mar', dentro: 93, tma: 4.4 },
  { mes: 'Abr', dentro: 94, tma: 4.1 },
  { mes: 'Mai', dentro: 91, tma: 4.7 },
  { mes: 'Jun', dentro: 95, tma: 3.9 },
  { mes: 'Jul', dentro: 96, tma: 3.7 },
  { mes: 'Ago', dentro: 94, tma: 3.8 },
  { mes: 'Set', dentro: 97, tma: 3.5 },
  { mes: 'Out', dentro: 96, tma: 3.6 },
  { mes: 'Nov', dentro: 98, tma: 3.3 },
  { mes: 'Dez', dentro: 97, tma: 3.4 },
];

const mixServicos = [
  { name: 'Iluminação pública', value: 3989 },
  { name: 'Ramais e ligações', value: 1421 },
  { name: 'Linha viva', value: 963 },
  { name: 'Troca de poste', value: 310 },
  { name: 'Poda e faixa de servidão', value: 480 },
];

const equipes = [
  { equipe: 'Equipe LV-01', os: 312, produtividade: 96, hh: 1840 },
  { equipe: 'Equipe LV-02', os: 289, produtividade: 92, hh: 1795 },
  { equipe: 'Equipe IP-01', os: 501, produtividade: 89, hh: 2010 },
  { equipe: 'Equipe IP-02', os: 466, produtividade: 87, hh: 1962 },
  { equipe: 'Equipe OBRAS', os: 198, produtividade: 94, hh: 1580 },
];

const regionais = [
  { regional: 'Cuiabá', os: 1980, sla: 97, custo: 2.42 },
  { regional: 'Várzea Grande', os: 1140, sla: 95, custo: 1.31 },
  { regional: 'Rondonópolis', os: 860, sla: 93, custo: 1.05 },
  { regional: 'Sinop', os: 720, sla: 91, custo: 0.94 },
  { regional: 'Cáceres', os: 463, sla: 90, custo: 0.61 },
];

const PIE_COLORS = [
  'hsl(var(--brand))',
  'hsl(var(--brand-2))',
  'hsl(var(--warning))',
  'hsl(var(--success))',
  'hsl(var(--destructive))',
];

const tooltipStyle = {
  background: 'hsl(var(--ink))',
  border: '1px solid hsl(var(--brand) / 0.3)',
  borderRadius: 12,
  color: 'hsl(var(--ink-foreground))',
  fontSize: 12,
};

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Zap;
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

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4 md:p-5">
      <h2 className="font-display font-semibold text-base md:text-lg">{title}</h2>
      {subtitle && <p className="text-xs text-ink-muted mt-1 mb-3">{subtitle}</p>}
      <div className="h-[260px] mt-3">{children}</div>
    </div>
  );
}

export default function PainelEletrica() {
  const [periodo, setPeriodo] = useState<'12m' | '6m' | '3m'>('12m');

  useEffect(() => {
    document.title = 'Painel de Serviços Elétricos | A&X Análise de Dados';
  }, []);

  const dados = useMemo(() => {
    const n = periodo === '12m' ? 12 : periodo === '6m' ? 6 : 3;
    return {
      execucao: execucaoMensal.slice(-n),
      sla: sla.slice(-n),
    };
  }, [periodo]);

  const totalOS = dados.execucao.reduce(
    (acc, m) => acc + m.linhaViva + m.postes + m.iluminacao + m.ramais,
    0,
  );
  const slaMedio = Math.round(dados.sla.reduce((a, m) => a + m.dentro, 0) / dados.sla.length);
  const tmaMedio = (dados.sla.reduce((a, m) => a + m.tma, 0) / dados.sla.length).toFixed(1);

  return (
    <main className="min-h-screen bg-ink text-ink-foreground">
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
              href="https://wa.me/5565992747522?text=Ol%C3%A1!%20Vi%20o%20painel%20de%20servi%C3%A7os%20el%C3%A9tricos%20e%20quero%20um%20projeto%20assim."
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com a A&amp;X
            </a>
          </Button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gradient-brand text-ink">
          Energia &amp; Construção Elétrica
        </span>
        <h1 className="font-display text-2xl md:text-4xl font-bold mt-4 mb-3">
          Painel de Serviços Elétricos — Linha Viva, Postes e Iluminação
        </h1>
        <p className="text-ink-muted max-w-3xl leading-relaxed">
          Demonstração interativa de gestão de ordens de serviço para empreiteiras de rede de distribuição:
          manutenção em linha viva, troca de postes, iluminação pública, ramais e podas. Dados fictícios,
          estrutura idêntica à que implantamos com dados reais do seu ERP/OS.
        </p>

        <div className="flex gap-2 mt-6">
          {(['3m', '6m', '12m'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`text-xs px-3 py-1.5 rounded-md border transition ${
                periodo === p
                  ? 'bg-gradient-brand text-ink border-transparent font-semibold'
                  : 'border-ink-foreground/15 text-ink-muted hover:text-ink-foreground'
              }`}
            >
              Últimos {p.replace('m', ' meses')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
          <Kpi icon={Wrench} label="OS executadas" value={totalOS.toLocaleString('pt-BR')} hint="ordens concluídas no período" />
          <Kpi icon={ShieldCheck} label="SLA no prazo" value={`${slaMedio}%`} hint="meta contratual: 92%" />
          <Kpi icon={Timer} label="TMA" value={`${tmaMedio}h`} hint="tempo médio de atendimento" />
          <Kpi icon={TrendingUp} label="Faturamento" value="R$ 6,3 mi" hint="medições aprovadas no período" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <Panel title="Execução por tipo de serviço" subtitle="Volume mensal de OS por natureza do serviço">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.execucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="mes" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--ink-foreground) / 0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="iluminacao" name="Iluminação" stackId="a" fill="hsl(var(--brand))" />
                <Bar dataKey="ramais" name="Ramais" stackId="a" fill="hsl(var(--brand-2))" />
                <Bar dataKey="linhaViva" name="Linha viva" stackId="a" fill="hsl(var(--warning))" />
                <Bar dataKey="postes" name="Troca de poste" stackId="a" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="SLA e tempo médio de atendimento" subtitle="% de OS no prazo x TMA em horas">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados.sla}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="mes" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis yAxisId="l" domain={[80, 100]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 8]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="l" type="monotone" dataKey="dentro" name="SLA (%)" stroke="hsl(var(--brand-2))" strokeWidth={2.5} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="tma" name="TMA (h)" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Mix de serviços no ano" subtitle="Participação de cada natureza no total de OS">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mixServicos} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {mixServicos.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Produtividade por equipe" subtitle="OS concluídas e aderência ao planejado">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipes} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis type="number" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis type="category" dataKey="equipe" width={92} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--ink-foreground) / 0.05)' }} />
                <Bar dataKey="os" name="OS concluídas" fill="hsl(var(--brand))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <div className="mt-4 rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4 md:p-5 overflow-x-auto">
          <h2 className="font-display font-semibold text-base md:text-lg mb-3">Desempenho por regional</h2>
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-muted border-b border-ink-foreground/10">
                <th className="py-2 font-medium">Regional</th>
                <th className="py-2 font-medium">OS</th>
                <th className="py-2 font-medium">SLA</th>
                <th className="py-2 font-medium">Custo (R$ mi)</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {regionais.map((r) => (
                <tr key={r.regional} className="border-b border-ink-foreground/5 last:border-0">
                  <td className="py-2.5">{r.regional}</td>
                  <td className="py-2.5 text-ink-muted">{r.os.toLocaleString('pt-BR')}</td>
                  <td className="py-2.5 text-ink-muted">{r.sla}%</td>
                  <td className="py-2.5 text-ink-muted">
                    {r.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        r.sla >= 95
                          ? 'bg-success/15 text-success'
                          : r.sla >= 92
                            ? 'bg-warning/15 text-warning'
                            : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {r.sla >= 95 ? 'Excelente' : r.sla >= 92 ? 'Atenção' : 'Crítico'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {[
            { icon: Zap, t: 'Linha viva', d: 'Controle de intervenções energizadas, equipes habilitadas e checklist de segurança (NR-10 / NR-35).' },
            { icon: Lightbulb, t: 'Iluminação pública', d: 'Backlog de pontos apagados, tempo de reparo por bairro e consumo evitado com LED.' },
            { icon: Wrench, t: 'Obras e postes', d: 'Avanço físico-financeiro por contrato, medições e materiais aplicados por OS.' },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4">
              <c.icon className="h-5 w-5 text-brand" />
              <h3 className="font-display font-semibold mt-2">{c.t}</h3>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-muted/70 mt-6">
          Dados fictícios criados para demonstração. Em projetos reais conectamos diretamente ao ERP, sistema de OS,
          planilhas de medição e apps de campo, com atualização automática em Power BI ou web.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-gradient-brand text-ink font-semibold">
            <a
              href="https://wa.me/5565992747522?text=Ol%C3%A1!%20Quero%20um%20painel%20de%20servi%C3%A7os%20el%C3%A9tricos%20como%20o%20da%20demonstra%C3%A7%C3%A3o."
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
      </section>
    </main>
  );
}