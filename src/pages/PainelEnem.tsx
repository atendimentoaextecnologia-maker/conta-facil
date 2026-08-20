import { useEffect, useMemo, useState } from 'react';
import { GraduationCap, Target, BookOpen, TrendingUp, School, ClipboardList, Brain } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';
import { Kpi, Panel, PainelHeader, PainelFooterCTA, tooltipStyle } from '@/components/painel/PainelShell';

const simulados = [
  { simulado: 'S1', media: 512, participacao: 78, redacao: 540 },
  { simulado: 'S2', media: 528, participacao: 82, redacao: 562 },
  { simulado: 'S3', media: 541, participacao: 85, redacao: 584 },
  { simulado: 'S4', media: 556, participacao: 88, redacao: 601 },
  { simulado: 'S5', media: 569, participacao: 90, redacao: 618 },
  { simulado: 'S6', media: 583, participacao: 93, redacao: 640 },
];

const areas = [
  { area: 'Linguagens', nota: 561, meta: 580 },
  { area: 'Humanas', nota: 594, meta: 590 },
  { area: 'Natureza', nota: 528, meta: 570 },
  { area: 'Matemática', nota: 546, meta: 585 },
  { area: 'Redação', nota: 640, meta: 700 },
];

const habilidades = [
  { hab: 'Interpretação', valor: 78 },
  { hab: 'Álgebra', valor: 62 },
  { hab: 'Geometria', valor: 55 },
  { hab: 'Química', valor: 58 },
  { hab: 'Física', valor: 51 },
  { hab: 'Argumentação', valor: 74 },
];

const turmas = [
  { turma: '3º A', alunos: 38, media: 604, evolucao: 12, presenca: 95 },
  { turma: '3º B', alunos: 35, media: 588, evolucao: 9, presenca: 92 },
  { turma: '3º C', alunos: 40, media: 561, evolucao: 7, presenca: 88 },
  { turma: '3º D', alunos: 33, media: 542, evolucao: 4, presenca: 84 },
  { turma: 'Pré-ENEM (extra)', alunos: 52, media: 619, evolucao: 15, presenca: 97 },
];

export default function PainelEnem() {
  const [periodo, setPeriodo] = useState<'6s' | '3s'>('6s');

  useEffect(() => {
    document.title = 'Painel de Simulados ENEM para Escolas | A&X Análise de Dados';
  }, []);

  const dados = useMemo(() => simulados.slice(periodo === '6s' ? -6 : -3), [periodo]);

  const mediaGeral = Math.round(dados.reduce((a, s) => a + s.media, 0) / dados.length);
  const evolucao = dados[dados.length - 1].media - dados[0].media;
  const participacao = Math.round(dados.reduce((a, s) => a + s.participacao, 0) / dados.length);
  const redacao = dados[dados.length - 1].redacao;

  return (
    <main className="min-h-screen bg-ink text-ink-foreground">
      <PainelHeader whatsappText="Olá! Vi o painel de simulados do ENEM e quero um projeto assim para a minha escola." />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gradient-brand text-ink">
          Educação &amp; Escolas
        </span>
        <h1 className="font-display text-2xl md:text-4xl font-bold mt-4 mb-3">
          Painel de Simulados ENEM — Desempenho por Turma e Habilidade
        </h1>
        <p className="text-ink-muted max-w-3xl leading-relaxed">
          Demonstração interativa para escolas e cursinhos: evolução da nota média por simulado, desempenho por área
          do conhecimento, mapa de habilidades com maior dificuldade, redação e ranking de turmas. Dados fictícios,
          estrutura igual à que conectamos ao seu sistema de simulados, cartões-resposta e diário de classe.
        </p>

        <div className="flex gap-2 mt-6">
          {(['3s', '6s'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`text-xs px-3 py-1.5 rounded-md border transition ${
                periodo === p
                  ? 'bg-gradient-brand text-ink border-transparent font-semibold'
                  : 'border-ink-foreground/15 text-ink-muted hover:text-ink-foreground'
              }`}
            >
              Últimos {p.replace('s', ' simulados')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
          <Kpi icon={GraduationCap} label="Nota média" value={`${mediaGeral}`} hint="média geral dos simulados" />
          <Kpi icon={TrendingUp} label="Evolução" value={`+${evolucao} pts`} hint="do primeiro ao último simulado" />
          <Kpi icon={ClipboardList} label="Participação" value={`${participacao}%`} hint="alunos que realizaram as provas" />
          <Kpi icon={BookOpen} label="Redação" value={`${redacao}`} hint="média no último simulado" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <Panel title="Evolução por simulado" subtitle="Nota média geral x média de redação">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="simulado" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis domain={[450, 700]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="media" name="Média geral" stroke="hsl(var(--brand))" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="redacao" name="Redação" stroke="hsl(var(--brand-2))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Desempenho por área" subtitle="Nota alcançada x meta da escola">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areas}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="area" stroke="hsl(var(--ink-muted))" fontSize={10} />
                <YAxis domain={[400, 750]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--ink-foreground) / 0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="nota" name="Nota" fill="hsl(var(--brand))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" name="Meta" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Mapa de habilidades" subtitle="% de acertos por competência avaliada">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={habilidades} outerRadius={95}>
                <PolarGrid stroke="hsl(var(--ink-foreground) / 0.12)" />
                <PolarAngleAxis dataKey="hab" stroke="hsl(var(--ink-muted))" fontSize={10} />
                <PolarRadiusAxis domain={[0, 100]} stroke="hsl(var(--ink-muted))" fontSize={10} />
                <Tooltip contentStyle={tooltipStyle} />
                <Radar name="Acertos (%)" dataKey="valor" stroke="hsl(var(--brand-2))" fill="hsl(var(--brand-2) / 0.35)" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Participação nos simulados" subtitle="% de alunos presentes por aplicação">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--ink-foreground) / 0.08)" />
                <XAxis dataKey="simulado" stroke="hsl(var(--ink-muted))" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--ink-muted))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--ink-foreground) / 0.05)' }} />
                <Bar dataKey="participacao" name="Participação (%)" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <div className="mt-4 rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4 md:p-5 overflow-x-auto">
          <h2 className="font-display font-semibold text-base md:text-lg mb-3">Desempenho por turma</h2>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-muted border-b border-ink-foreground/10">
                <th className="py-2 font-medium">Turma</th>
                <th className="py-2 font-medium">Alunos</th>
                <th className="py-2 font-medium">Média</th>
                <th className="py-2 font-medium">Evolução</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((t) => (
                <tr key={t.turma} className="border-b border-ink-foreground/5 last:border-0">
                  <td className="py-2.5">{t.turma}</td>
                  <td className="py-2.5 text-ink-muted">{t.alunos}</td>
                  <td className="py-2.5 text-ink-muted">{t.media}</td>
                  <td className="py-2.5 text-ink-muted">+{t.evolucao}%</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        t.media >= 590 ? 'bg-success/15 text-success' : t.media >= 555 ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {t.media >= 590 ? 'Acima da meta' : t.media >= 555 ? 'Atenção' : 'Reforço'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {[
            { icon: Target, t: 'Plano de estudo por aluno', d: 'Ranking individual, habilidades críticas e recomendação automática de conteúdos de reforço.' },
            { icon: Brain, t: 'Análise de itens (TRI)', d: 'Dificuldade e discriminação por questão, com simulação de nota no modelo TRI do ENEM.' },
            { icon: School, t: 'Relatório para pais e coordenação', d: 'Boletins em PDF por turma e por aluno, enviados automaticamente após cada simulado.' },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4">
              <c.icon className="h-5 w-5 text-brand" />
              <h3 className="font-display font-semibold mt-2">{c.t}</h3>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <PainelFooterCTA whatsappText="Olá! Quero um painel de simulados do ENEM para a minha escola." />
      </section>
    </main>
  );
}