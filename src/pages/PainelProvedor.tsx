import { useEffect, useMemo, useState } from 'react';
import { Wifi, UserPlus, UserMinus, Gauge, Headphones, Router, Signal } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { Kpi, Panel, PainelHeader, PainelFooterCTA, PIE_COLORS, tooltipStyle } from '@/components/painel/PainelShell';

const baseAssinantes = [
  { mes: 'Jan', ativos: 12400, novos: 480, cancelados: 210 },
  { mes: 'Fev', ativos: 12680, novos: 495, cancelados: 215 },
  { mes: 'Mar', ativos: 12990, novos: 540, cancelados: 230 },
  { mes: 'Abr', ativos: 13320, novos: 565, cancelados: 235 },
  { mes: 'Mai', ativos: 13680, novos: 590, cancelados: 230 },
  { mes: 'Jun', ativos: 14010, novos: 575, cancelados: 245 },
  { mes: 'Jul', ativos: 14380, novos: 620, cancelados: 250 },
  { mes: 'Ago', ativos: 14720, novos: 605, cancelados: 265 },
  { mes: 'Set', ativos: 15090, novos: 640, cancelados: 270 },
  { mes: 'Out', ativos: 15480, novos: 670, cancelados: 280 },
  { mes: 'Nov', ativos: 15890, novos: 700, cancelados: 290 },
  { mes: 'Dez', ativos: 16260, novos: 665, cancelados: 295 },
];

const qualidadeRede = [
  { mes: 'Jan', uptime: 99.2, latencia: 21 },
  { mes: 'Fev', uptime: 99.1, latencia: 23 },
  { mes: 'Mar', uptime: 99.4, latencia: 19 },
  { mes: 'Abr', uptime: 99.5, latencia: 18 },
  { mes: 'Mai', uptime: 99.3, latencia: 20 },
  { mes: 'Jun', uptime: 99.6, latencia: 17 },
  { mes: 'Jul', uptime: 99.7, latencia: 16 },
  { mes: 'Ago', uptime: 99.6, latencia: 17 },
  { mes: 'Set', uptime: 99.8, latencia: 15 },
  { mes: 'Out', uptime: 99.7, latencia: 15 },
  { mes: 'Nov', uptime: 99.9, latencia: 14 },
  { mes: 'Dez', uptime: 99.8, latencia: 14 },
];

const planos = [
  { name: '300 Mega', value: 6100 },
  { name: '500 Mega', value: 4900 },
  { name: '700 Mega', value: 2800 },
  { name: '1 Giga', value: 1760 },
  { name: 'Empresarial', value: 700 },
];

const chamados = [
  { tipo: 'Sem conexão', qtd: 1240, sla: 94 },
  { tipo: 'Lentidão', qtd: 980, sla: 91 },
  { tipo: 'Instalação', qtd: 760, sla: 97 },
  { tipo: 'Financeiro', qtd: 540, sla: 98 },
  { tipo: 'Wi-Fi / equipamento', qtd: 430, sla: 89 },
];

const cidades = [
  { cidade: 'Cuiabá', assinantes: 6420, churn: 1.6, uptime: 99.8, arpu: 112 },
  { cidade: 'Várzea Grande', assinantes: 3980, churn: 1.9, uptime: 99.6, arpu: 104 },
  { cidade: 'Rondonópolis', assinantes: 2410, churn: 2.3, uptime: 99.3, arpu: 98 },
  { cidade: 'Sinop', assinantes: 2100, churn: 2.1, uptime: 99.4, arpu: 101 },
  { cidade: 'Sorriso', assinantes: 1350, churn: 2.7, uptime: 99.0, arpu: 95 },
];

export default function PainelProvedor() {
  const [periodo, setPeriodo] = useState<'12m' | '6m' | '3m'>('12m');

  useEffect(() => {
    document.title = 'Painel para Provedores de Internet | A&X Análise de Dados';
  }, []);

  const dados = useMemo(() => {
    const n = periodo === '12m' ? 12 : periodo === '6m' ? 6 : 3;
    return { base: baseAssinantes.slice(-n), rede: qualidadeRede.slice(-n) };
  }, [periodo]);

  const ativos = dados.base[dados.base.length - 1].ativos;
  const novos = dados.base.reduce((a, m) => a + m.novos, 0);
  const churn = (
    (dados.base.reduce((a, m) => a + m.cancelados, 0) / dados.base.reduce((a, m) => a + m.ativos, 0)) * 100
  ).toFixed(1);
  const uptime = (dados.rede.reduce((a, m) => a + m.uptime, 0) / dados.rede.length).toFixed(2);

  return (
    <main className="min-h-screen bg-ink text-ink-foreground">
      <PainelHeader whatsappText="Olá! Vi o painel para provedores de internet e quero um projeto assim." />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gradient-brand text-ink">
          Telecom &amp; Provedores de Internet
        </span>
        <h1 className="font-display text-2xl md:text-4xl font-bold mt-4 mb-3">
          Painel para Provedores de Internet — Base, Churn e Qualidade de Rede
        </h1>
        <p className="text-ink-muted max-w-3xl leading-relaxed">
          Demonstração interativa para ISPs: evolução da base de assinantes, churn, ARPU, uptime, latência,
          chamados de suporte e desempenho por cidade. Dados fictícios, estrutura igual à que conectamos ao seu
          ERP (IXC, MK-Auth, SGP), Zabbix e sistema de chamados.
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
          <Kpi icon={Wifi} label="Assinantes ativos" value={ativos.toLocaleString('pt-BR')} hint="base final do período" />
          <Kpi icon={UserPlus} label="Novas ativações" value={novos.toLocaleString('pt-BR')} hint="instalações concluídas" />
          <Kpi icon={UserMinus} label="Churn médio" value={`${churn.replace('.', ',')}%`} hint="meta: abaixo de 2%" />
          <Kpi icon={Gauge} label="Uptime da rede" value={`${uptime.replace('.', ',')}%`} hint="disponibilidade média" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <Panel title="Ativações x cancelamentos" subtitle="Movimentação mensal da base">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.base}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="mes" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--ink-foreground) / 0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="novos" name="Novos" fill="hsl(var(--brand))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelados" name="Cancelados" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Qualidade da rede" subtitle="Uptime (%) x latência média (ms)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados.rede}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="mes" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis yAxisId="l" domain={[98.5, 100]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 40]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="l" type="monotone" dataKey="uptime" name="Uptime (%)" stroke="hsl(var(--brand-2))" strokeWidth={2.5} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="latencia" name="Latência (ms)" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Base por plano" subtitle="Distribuição de assinantes por velocidade contratada">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planos} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {planos.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Chamados de suporte" subtitle="Volume por motivo no período">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chamados} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis type="number" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis type="category" dataKey="tipo" width={120} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--ink-foreground) / 0.05)' }} />
                <Bar dataKey="qtd" name="Chamados" fill="hsl(var(--brand))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <div className="mt-4 rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4 md:p-5 overflow-x-auto">
          <h2 className="font-display font-semibold text-base md:text-lg mb-3">Desempenho por cidade</h2>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-muted border-b border-ink-foreground/10">
                <th className="py-2 font-medium">Cidade</th>
                <th className="py-2 font-medium">Assinantes</th>
                <th className="py-2 font-medium">Churn</th>
                <th className="py-2 font-medium">ARPU</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {cidades.map((c) => (
                <tr key={c.cidade} className="border-b border-ink-foreground/5 last:border-0">
                  <td className="py-2.5">{c.cidade}</td>
                  <td className="py-2.5 text-ink-muted">{c.assinantes.toLocaleString('pt-BR')}</td>
                  <td className="py-2.5 text-ink-muted">{c.churn.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%</td>
                  <td className="py-2.5 text-ink-muted">R$ {c.arpu}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        c.churn <= 1.8 ? 'bg-success/15 text-success' : c.churn <= 2.4 ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {c.churn <= 1.8 ? 'Excelente' : c.churn <= 2.4 ? 'Atenção' : 'Crítico'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {[
            { icon: Signal, t: 'Monitoramento de rede', d: 'Uptime por POP e OLT, quedas por região e correlação entre falhas e cancelamentos.' },
            { icon: Headphones, t: 'Suporte e SLA', d: 'Tempo de primeira resposta, reincidência de chamados e satisfação (NPS) por técnico.' },
            { icon: Router, t: 'Receita e inadimplência', d: 'ARPU por plano, inadimplência por faixa de atraso e projeção de faturamento.' },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4">
              <c.icon className="h-5 w-5 text-brand" />
              <h3 className="font-display font-semibold mt-2">{c.t}</h3>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <PainelFooterCTA whatsappText="Olá! Quero um painel para provedor de internet como o da demonstração." />
      </section>
    </main>
  );
}