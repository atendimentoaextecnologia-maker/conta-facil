import { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, Percent, Users, Package, Store, Tag, Truck } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { Kpi, Panel, PainelHeader, PainelFooterCTA, PIE_COLORS, tooltipStyle } from '@/components/painel/PainelShell';

const vendasMensais = [
  { mes: 'Jan', vendas: 3.2, meta: 3.0, ticket: 182 },
  { mes: 'Fev', vendas: 2.9, meta: 3.0, ticket: 176 },
  { mes: 'Mar', vendas: 3.6, meta: 3.2, ticket: 188 },
  { mes: 'Abr', vendas: 3.4, meta: 3.2, ticket: 191 },
  { mes: 'Mai', vendas: 4.1, meta: 3.6, ticket: 205 },
  { mes: 'Jun', vendas: 3.8, meta: 3.6, ticket: 197 },
  { mes: 'Jul', vendas: 4.4, meta: 4.0, ticket: 212 },
  { mes: 'Ago', vendas: 4.2, meta: 4.0, ticket: 208 },
  { mes: 'Set', vendas: 4.6, meta: 4.2, ticket: 219 },
  { mes: 'Out', vendas: 5.1, meta: 4.5, ticket: 228 },
  { mes: 'Nov', vendas: 7.3, meta: 6.0, ticket: 246 },
  { mes: 'Dez', vendas: 8.9, meta: 7.5, ticket: 263 },
];

const margemGiro = [
  { mes: 'Jan', margem: 31, giro: 3.1 },
  { mes: 'Fev', margem: 29, giro: 2.9 },
  { mes: 'Mar', margem: 32, giro: 3.3 },
  { mes: 'Abr', margem: 33, giro: 3.2 },
  { mes: 'Mai', margem: 34, giro: 3.6 },
  { mes: 'Jun', margem: 33, giro: 3.5 },
  { mes: 'Jul', margem: 35, giro: 3.8 },
  { mes: 'Ago', margem: 34, giro: 3.7 },
  { mes: 'Set', margem: 36, giro: 3.9 },
  { mes: 'Out', margem: 36, giro: 4.2 },
  { mes: 'Nov', margem: 33, giro: 5.4 },
  { mes: 'Dez', margem: 31, giro: 6.1 },
];

const mixCategorias = [
  { name: 'Moda e vestuário', value: 18400 },
  { name: 'Casa e decoração', value: 12900 },
  { name: 'Eletroportáteis', value: 9800 },
  { name: 'Calçados', value: 7300 },
  { name: 'Beleza e perfumaria', value: 5100 },
];

const lojas = [
  { loja: 'Shopping Centro', vendas: 12.4, margem: 35, conversao: 24, estoque: 92 },
  { loja: 'Av. Brasil', vendas: 9.8, margem: 33, conversao: 21, estoque: 88 },
  { loja: 'Várzea Grande', vendas: 7.2, margem: 31, conversao: 19, estoque: 81 },
  { loja: 'Rondonópolis', vendas: 6.1, margem: 30, conversao: 18, estoque: 76 },
  { loja: 'E-commerce', vendas: 8.9, margem: 38, conversao: 3.4, estoque: 95 },
];

const rupturaSemanal = [
  { sem: 'S1', ruptura: 6.2, cobertura: 42 },
  { sem: 'S2', ruptura: 5.4, cobertura: 45 },
  { sem: 'S3', ruptura: 7.1, cobertura: 38 },
  { sem: 'S4', ruptura: 4.8, cobertura: 49 },
  { sem: 'S5', ruptura: 4.1, cobertura: 52 },
  { sem: 'S6', ruptura: 3.6, cobertura: 55 },
];

export default function PainelVarejo() {
  const [periodo, setPeriodo] = useState<'12m' | '6m' | '3m'>('12m');

  useEffect(() => {
    document.title = 'Painel de Lojas de Departamento | A&X Análise de Dados';
  }, []);

  const dados = useMemo(() => {
    const n = periodo === '12m' ? 12 : periodo === '6m' ? 6 : 3;
    return { vendas: vendasMensais.slice(-n), margem: margemGiro.slice(-n) };
  }, [periodo]);

  const faturamento = dados.vendas.reduce((a, m) => a + m.vendas, 0);
  const ticket = Math.round(dados.vendas.reduce((a, m) => a + m.ticket, 0) / dados.vendas.length);
  const margemMedia = Math.round(dados.margem.reduce((a, m) => a + m.margem, 0) / dados.margem.length);

  return (
    <main className="min-h-screen bg-ink text-ink-foreground">
      <PainelHeader whatsappText="Olá! Vi o painel de lojas de departamento e quero um projeto assim." />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gradient-brand text-ink">
          Varejo &amp; Lojas de Departamento
        </span>
        <h1 className="font-display text-2xl md:text-4xl font-bold mt-4 mb-3">
          Painel de Lojas de Departamento — Vendas, Margem e Estoque
        </h1>
        <p className="text-ink-muted max-w-3xl leading-relaxed">
          Demonstração interativa para redes de lojas: faturamento por unidade, ticket médio, margem, giro de estoque,
          ruptura e conversão. Dados fictícios, estrutura igual à que implantamos com dados reais do seu ERP e PDV.
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
          <Kpi icon={ShoppingBag} label="Faturamento" value={`R$ ${faturamento.toFixed(1).replace('.', ',')} mi`} hint="vendas líquidas no período" />
          <Kpi icon={Tag} label="Ticket médio" value={`R$ ${ticket}`} hint="por cupom fiscal" />
          <Kpi icon={Percent} label="Margem bruta" value={`${margemMedia}%`} hint="meta: 32%" />
          <Kpi icon={Users} label="Conversão em loja" value="21%" hint="visitantes que compram" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <Panel title="Vendas x meta" subtitle="Faturamento mensal em R$ milhões">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.vendas}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="mes" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--ink-foreground) / 0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="vendas" name="Vendas (R$ mi)" fill="hsl(var(--brand))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" name="Meta (R$ mi)" fill="hsl(var(--brand-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Margem e giro de estoque" subtitle="% de margem bruta x giro (vezes no ano)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados.margem}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="mes" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis yAxisId="l" domain={[20, 45]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 8]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="l" type="monotone" dataKey="margem" name="Margem (%)" stroke="hsl(var(--brand-2))" strokeWidth={2.5} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="giro" name="Giro (x)" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Mix por categoria" subtitle="Participação no faturamento do ano">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mixCategorias} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {mixCategorias.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Ruptura e cobertura de estoque" subtitle="% de itens em falta x dias de cobertura">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rupturaSemanal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="sem" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="cobertura" name="Cobertura (dias)" stroke="hsl(var(--brand))" fill="hsl(var(--brand) / 0.2)" strokeWidth={2} />
                <Area type="monotone" dataKey="ruptura" name="Ruptura (%)" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <div className="mt-4 rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4 md:p-5 overflow-x-auto">
          <h2 className="font-display font-semibold text-base md:text-lg mb-3">Desempenho por loja</h2>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-muted border-b border-ink-foreground/10">
                <th className="py-2 font-medium">Loja</th>
                <th className="py-2 font-medium">Vendas (R$ mi)</th>
                <th className="py-2 font-medium">Margem</th>
                <th className="py-2 font-medium">Conversão</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lojas.map((l) => (
                <tr key={l.loja} className="border-b border-ink-foreground/5 last:border-0">
                  <td className="py-2.5">{l.loja}</td>
                  <td className="py-2.5 text-ink-muted">{l.vendas.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</td>
                  <td className="py-2.5 text-ink-muted">{l.margem}%</td>
                  <td className="py-2.5 text-ink-muted">{l.conversao}%</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        l.margem >= 34 ? 'bg-success/15 text-success' : l.margem >= 31 ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {l.margem >= 34 ? 'Excelente' : l.margem >= 31 ? 'Atenção' : 'Crítico'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {[
            { icon: Store, t: 'Performance por loja', d: 'Comparativo de vendas, margem e conversão por unidade, com ranking e alertas automáticos.' },
            { icon: Package, t: 'Gestão de estoque', d: 'Ruptura, cobertura, curva ABC e sugestão de reposição por SKU e loja.' },
            { icon: Truck, t: 'Compras e fornecedores', d: 'Lead time, cumprimento de pedidos e impacto de atrasos na venda perdida.' },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4">
              <c.icon className="h-5 w-5 text-brand" />
              <h3 className="font-display font-semibold mt-2">{c.t}</h3>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <PainelFooterCTA whatsappText="Olá! Quero um painel de varejo como o da demonstração." />
      </section>
    </main>
  );
}