import caseVarejo from '@/assets/case-varejo.jpg';
import caseSaude from '@/assets/case-saude.jpg';
import caseAgro from '@/assets/case-agro.jpg';
import caseContaFacil from '@/assets/case-conta-facil.jpg';
import caseEletrica from '@/assets/case-eletrica.jpg';
import caseVarejoDept from '@/assets/case-varejo-dept.jpg';
import caseProvedor from '@/assets/case-provedor.jpg';
import caseEnem from '@/assets/case-enem.jpg';

export interface PanelDemo {
  slug: string;
  image: string;
  sector: string;
  title: string;
  desc: string;
  tags: string[];
  /** URL "publish to web" do Power BI, embutida no site */
  embedUrl?: string;
  /** Origem pública dos dados exibidos na demonstração */
  source?: { label: string; url: string };
  /** Rota interna (produto próprio) */
  internalLink?: string;
}

export const panels: PanelDemo[] = [
  {
    slug: 'servicos-eletricos',
    image: caseEletrica,
    sector: 'Energia & Construção Elétrica',
    title: 'Painel de Serviços Elétricos',
    desc: 'Gestão de OS de linha viva, troca de postes, iluminação pública e ramais: SLA, TMA, produtividade por equipe e desempenho por regional. Demonstração interativa com dados fictícios.',
    tags: ['Power BI', 'OS/ERP', 'SLA'],
    internalLink: '/paineis-eletrica',
  },
  {
    slug: 'lojas-departamento',
    image: caseVarejoDept,
    sector: 'Varejo & Lojas de Departamento',
    title: 'Painel de Lojas de Departamento',
    desc: 'Vendas x meta por loja, ticket médio, margem, giro e ruptura de estoque, mix por categoria e conversão. Demonstração interativa com dados fictícios.',
    tags: ['Power BI', 'ERP/PDV', 'Estoque'],
    internalLink: '/paineis-varejo',
  },
  {
    slug: 'provedor-internet',
    image: caseProvedor,
    sector: 'Telecom & Provedores de Internet',
    title: 'Painel para Provedores de Internet',
    desc: 'Base de assinantes, churn, ARPU, uptime, latência, chamados de suporte e desempenho por cidade — integrável a IXC, MK-Auth, SGP e Zabbix.',
    tags: ['Power BI', 'ISP', 'Churn'],
    internalLink: '/paineis-provedor',
  },
  {
    slug: 'simulados-enem',
    image: caseEnem,
    sector: 'Educação & Escolas',
    title: 'Painel de Simulados ENEM',
    desc: 'Evolução das notas por simulado, desempenho por área e habilidade, redação e ranking de turmas para escolas e cursinhos preparatórios.',
    tags: ['Power BI', 'Educação', 'TRI'],
    internalLink: '/paineis-enem',
  },
  {
    slug: 'varejo-vendas-estoque',
    image: caseVarejo,
    sector: 'Varejo & Financeiro',
    title: 'Painel de Gastos e Execução Orçamentária',
    desc: 'Modelo de painel executivo com acompanhamento de execução financeira, comparativos por período e drill-down por categoria — a mesma estrutura que aplicamos em vendas, estoque e margem no varejo.',
    tags: ['Power BI', 'SQL', 'ETL'],
    embedUrl:
      'https://app.powerbi.com/view?r=eyJrIjoiMjQ5NWViZTYtZWJlMi00ZmFkLWIyMDUtOWM1YmM4MThlZTRjIiwidCI6ImI1NjYxMzUwLWMyZTQtNDNkYy1iY2U4LWYwMDNkZGY4YTNjNCJ9',
    source: {
      label: 'Tesouro Transparente (dados públicos)',
      url: 'https://www.tesourotransparente.gov.br/visualizacao/painel-de-monitoramentos-dos-gastos-com-covid-19',
    },
  },
  {
    slug: 'saude-indicadores',
    image: caseSaude,
    sector: 'Saúde',
    title: 'KPIs de Saúde Multi-Unidade',
    desc: 'Painel de monitoramento com mapas, séries temporais e indicadores por região — estrutura idêntica à que usamos para ocupação, faturamento e qualidade assistencial em redes hospitalares.',
    tags: ['Power BI', 'Azure', 'DAX'],
    embedUrl:
      'https://app.powerbi.com/view?r=eyJrIjoiYzQyOTI4M2ItZTQwMC00ODg4LWJiNTQtODc5MzljNWIzYzg3IiwidCI6IjlhNTU0YWQzLWI1MmItNDg2Mi1hMzZmLTg0ZDg5MWU1YzcwNSJ9',
    source: {
      label: 'Ministério da Saúde — Sala Nacional de Arboviroses',
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/arboviroses/monitoramento-das-arboviroses',
    },
  },
  {
    slug: 'agro-safras',
    image: caseAgro,
    sector: 'Agronegócio',
    title: 'Produtividade e Safras',
    desc: 'Painel com dados de safra, armazenagem e produção regional. É o mesmo modelo aplicado em produtividade por talhão, custo de insumos e previsão de colheita.',
    tags: ['Power BI', 'Python', 'GIS'],
    embedUrl:
      'https://app.powerbi.com/view?r=eyJrIjoiNDdkNDM4ZjctYzk0OS00NWVjLWFlYjktZWQ4Njg3MDEyMTg0IiwidCI6ImU2ZDkwZGYzLWYxOGItNGJkZC04MDhjLWFhNmQwZjY4YjgwOSJ9',
    source: {
      label: 'Conab — Safras e Armazenagem',
      url: 'https://www.conab.gov.br/info-agro/safras',
    },
  },
  {
    slug: 'conta-facil',
    image: caseContaFacil,
    sector: 'Produto Próprio',
    title: 'A&X Conta Fácil',
    desc: 'Aplicativo mobile-first de gestão financeira com importação de extratos, categorização e relatórios anuais em PDF.',
    tags: ['React', 'Cloud', 'PWA'],
    internalLink: '/auth',
  },
];
