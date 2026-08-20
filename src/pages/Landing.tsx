import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/landing/Reveal';
import { CountUp } from '@/components/landing/CountUp';
import { TechMarquee } from '@/components/landing/TechMarquee';
import {
  BarChart3,
  Database,
  LineChart,
  PieChart,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  LogIn,
  Zap,
  Users,
  TrendingUp,
  Brain,
  Search,
  Workflow,
  Rocket,
  Quote,
  MessageCircle,
} from 'lucide-react';
import logo from '@/assets/logo.jpg';
import logoTransparent from '@/assets/logo-transparent.png';
import heroBg from '@/assets/hero-data.jpg';
import { panels } from '@/data/panels';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const services = [
    {
      icon: BarChart3,
      title: 'Painéis Power BI',
      desc: 'Dashboards interativos sob medida que transformam dados em decisões em tempo real.',
    },
    {
      icon: Database,
      title: 'Engenharia de Dados',
      desc: 'Modelagem, ETL e integração de fontes diversas em um único pipeline confiável.',
    },
    {
      icon: Brain,
      title: 'Análise Avançada',
      desc: 'Estatística, KPIs e insights que revelam oportunidades escondidas no seu negócio.',
    },
    {
      icon: Sparkles,
      title: 'Automação & IA',
      desc: 'Aplicações inteligentes com IA para automatizar processos e ganhar produtividade.',
    },
  ];

  const portfolio = panels;

  const cases = [
    {
      sector: 'Varejo',
      title: 'Redução de 32% no estoque parado',
      desc: 'Painel de gestão de inventário integrando ERP e vendas, identificando SKUs de baixo giro e otimizando compras.',
      metric: '+R$ 1,2M',
      label: 'em capital liberado',
    },
    {
      sector: 'Saúde',
      title: 'Centralização de KPIs assistenciais',
      desc: 'Dashboard executivo unificando 7 unidades hospitalares, com indicadores de ocupação, faturamento e qualidade.',
      metric: '40h/mês',
      label: 'economizadas em relatórios',
    },
    {
      sector: 'Agronegócio',
      title: 'Análise de produtividade por talhão',
      desc: 'Cruzamento de dados climáticos, insumos e colheita para previsão de safra e tomada de decisão no campo.',
      metric: '+18%',
      label: 'de produtividade',
    },
    {
      sector: 'Financeiro',
      title: 'Conta Fácil — gestão financeira',
      desc: 'Aplicativo próprio de controle de receitas e despesas com importação de extratos e categorização inteligente.',
      metric: '100%',
      label: 'mobile-first',
    },
  ];

  const stats = [
    { end: 10, suffix: '+', label: 'anos de experiência' },
    { end: 80, suffix: '+', label: 'projetos entregues' },
    { end: 15, suffix: '+', label: 'setores atendidos' },
    { end: 99, suffix: '%', label: 'satisfação dos clientes' },
  ];

  const process = [
    {
      icon: Search,
      step: '01',
      title: 'Diagnóstico',
      desc: 'Entendemos o negócio, mapeamos fontes de dados e definimos os indicadores que realmente movem o ponteiro.',
    },
    {
      icon: Workflow,
      step: '02',
      title: 'Estrutura',
      desc: 'Modelagem, ETL e governança: um pipeline confiável para que todo mundo veja o mesmo número.',
    },
    {
      icon: BarChart3,
      step: '03',
      title: 'Painel',
      desc: 'Dashboards claros, rápidos e desenhados para decisão — não para enfeite de reunião.',
    },
    {
      icon: Rocket,
      step: '04',
      title: 'Evolução',
      desc: 'Treinamento do time, monitoramento e melhorias contínuas conforme o negócio muda.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Antes a gente discutia qual número estava certo. Hoje discute o que fazer com ele. O painel virou a pauta da reunião de segunda.',
      name: 'Diretor Comercial',
      role: 'Rede de varejo — 12 lojas',
    },
    {
      quote:
        'Reduzimos de dois dias para dez minutos o fechamento do relatório gerencial. O time voltou a analisar em vez de montar planilha.',
      name: 'Controller',
      role: 'Grupo hospitalar',
    },
    {
      quote:
        'A previsão de safra ficou muito mais confiável cruzando clima e insumos. Ganhamos margem só por decidir na hora certa.',
      name: 'Gerente de Operações',
      role: 'Agronegócio',
    },
  ];

  const faq = [
    {
      q: 'Quanto tempo leva para ter o primeiro painel no ar?',
      a: 'Na maioria dos projetos entregamos uma primeira versão funcional em 2 a 3 semanas, já com os indicadores prioritários. A partir daí evoluímos em ciclos curtos.',
    },
    {
      q: 'Preciso ter os dados organizados antes de começar?',
      a: 'Não. Boa parte do nosso trabalho é justamente organizar: conectamos ERP, planilhas, sistemas próprios e bancos de dados e transformamos tudo em um modelo único e confiável.',
    },
    {
      q: 'Trabalham só com Power BI?',
      a: 'Power BI é nossa especialidade, mas também entregamos com Python, SQL, Azure/Fabric e aplicações web sob medida quando o cenário pede.',
    },
    {
      q: 'Atendem empresas fora de Mato Grosso?',
      a: 'Sim. Atendemos todo o Brasil de forma remota, com reuniões periódicas e suporte contínuo.',
    },
    {
      q: 'Meus dados ficam seguros?',
      a: 'Sim. Trabalhamos com acesso mínimo necessário, ambientes segregados, controle de permissões por usuário e boas práticas de LGPD.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'A&X Tecnologia',
    description:
      'Consultoria em análise de dados, painéis Power BI, engenharia de dados e automação com IA.',
    email: 'atendimento@aextecnologia.com.br',
    telephone: '+55-65-99274-7522',
    areaServed: 'BR',
    knowsAbout: ['Power BI', 'Business Intelligence', 'Engenharia de Dados', 'Automação com IA'],
  };

  return (
    <div className="min-h-screen bg-ink text-ink-foreground selection:bg-brand/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* NAV */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-xl bg-ink/85 border-b border-ink-foreground/10 shadow-lg shadow-ink/40'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-ink-foreground transition group-hover:shadow-glow ring-1 ring-brand/20">
              <img src={logo} alt="A&X Tecnologia" className="w-full h-full object-contain p-1" />
            </div>
            <span className="font-display font-extrabold tracking-tight text-xl md:text-2xl">
              A&X <span className="text-gradient-brand">Tecnologia</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ink-muted">
            {[
              ['#servicos', 'Serviços'],
              ['#processo', 'Processo'],
              ['#cases', 'Cases'],
              ['#portfolio', 'Portfólio'],
              ['#sobre', 'Sobre'],
              ['#contato', 'Contato'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="relative hover:text-ink-foreground transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all hover:after:w-full"
              >
                {label}
              </a>
            ))}
          </nav>
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-brand text-ink font-semibold gap-2 hover:opacity-90 transition">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-brand/10 blur-3xl" />

        {/* Logo watermark sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage: `url(${logoTransparent})`,
            backgroundSize: 'auto 60%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(30%) brightness(1.15)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-brand text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                +10 anos transformando dados em resultado
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-6">
                Seus dados já sabem a resposta.{' '}
                <span className="text-gradient-brand">A gente faz eles falarem.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lg text-ink-muted mb-8 max-w-xl">
                Painéis Power BI, engenharia de dados e automação com IA para empresas que
                cansaram de decidir no achismo. Do dado bruto ao insight que gera lucro.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="flex flex-wrap gap-3">
                <a href="#contato">
                  <Button size="lg" className="bg-gradient-brand text-ink font-semibold gap-2 shadow-glow hover:opacity-90 transition">
                    Diagnóstico gratuito
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <a href="#portfolio">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-ink-foreground/20 bg-transparent hover:bg-ink-foreground/10 text-slate-600"
                  >
                    Ver painéis
                  </Button>
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="text-xs text-ink-muted/70 mt-5 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand" />
                Primeira conversa sem compromisso — resposta em até 24h úteis.
              </p>
            </Reveal>
          </div>

          {/* MINI DASHBOARD */}
          <Reveal delay={200} className="hidden lg:block">
            <div className="relative animate-float">
              <div className="glass rounded-3xl p-5 shadow-glow">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-muted">Receita acumulada</p>
                    <p className="font-display text-3xl font-bold">
                      <CountUp end={4.8} decimals={1} prefix="R$ " suffix="M" />
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-brand bg-brand/10 border border-brand/30 rounded-full px-2.5 py-1">
                    +23,4%
                  </span>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {[38, 52, 44, 66, 58, 78, 71, 92, 84, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-brand opacity-80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { l: 'Margem', v: '31,2%' },
                    { l: 'Ticket', v: 'R$ 842' },
                    { l: 'Churn', v: '1,8%' },
                  ].map((k) => (
                    <div key={k.l} className="rounded-xl bg-ink-foreground/5 border border-ink-foreground/10 p-3">
                      <p className="text-[10px] uppercase tracking-widest text-ink-muted">{k.l}</p>
                      <p className="font-display font-bold text-lg">{k.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* STATS */}
        <div className="relative max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="glass rounded-2xl p-5 h-full">
                  <div className="font-display text-3xl md:text-4xl font-bold text-gradient-brand">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="text-xs md:text-sm text-ink-muted mt-1">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TechMarquee />

      {/* SERVIÇOS */}
      <section id="servicos" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-3">
                O que fazemos
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Soluções que entregam clareza
              </h2>
              <p className="text-ink-muted max-w-2xl mx-auto">
                Combinamos engenharia, design e estatística para criar produtos de dados que sua equipe
                realmente usa no dia a dia.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <Card className="glass p-6 h-full hover:border-brand/40 hover:-translate-y-1 transition duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-4 group-hover:bg-brand/20 group-hover:shadow-glow transition">
                    <s.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section id="processo" className="py-20 md:py-28 bg-ink-soft/40 border-y border-ink-foreground/10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-3">Como trabalhamos</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Do caos à decisão em 4 etapas</h2>
              <p className="text-ink-muted max-w-2xl mx-auto">
                Um método enxuto, com entregas em ciclos curtos — você vê valor antes do projeto acabar.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 100}>
                <div className="relative h-full rounded-2xl glass p-6 hover:border-brand/40 transition">
                  <span className="absolute top-5 right-5 font-display text-4xl font-bold text-ink-foreground/10">
                    {p.step}
                  </span>
                  <p.icon className="h-6 w-6 text-brand mb-4" />
                  <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section id="cases" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-3">
                Cases reais
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Resultados que falam por si
              </h2>
              <p className="text-ink-muted max-w-2xl mx-auto">
                Mais de uma década entregando projetos para varejo, saúde, agronegócio e indústria.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {cases.map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <Card className="h-full glass p-7 hover:border-brand/40 hover:-translate-y-1 transition duration-300">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs text-brand font-semibold tracking-widest uppercase">
                      {c.sector}
                    </span>
                    <TrendingUp className="h-5 w-5 text-brand/70" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3 text-ink-foreground">{c.title}</h3>
                  <p className="text-sm leading-relaxed mb-5 text-ink-muted">{c.desc}</p>
                  <div className="flex items-baseline gap-2 pt-4 border-t border-ink-foreground/10">
                    <span className="font-display text-2xl font-bold text-gradient-brand">{c.metric}</span>
                    <span className="text-sm text-ink-muted">{c.label}</span>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO COM IMAGENS */}
      <section id="portfolio" className="py-20 md:py-28 bg-ink-soft/40 border-y border-ink-foreground/10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-3">
                Portfólio
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Painéis e relatórios em destaque
              </h2>
              <p className="text-ink-muted max-w-2xl mx-auto">
                Uma amostra dos projetos que entregamos. Clique para acessar a demonstração de cada painel.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {portfolio.map((p, i) => {
              const href = p.internalLink ?? `/paineis/${p.slug}`;
              return (
                <Reveal key={p.title} delay={i * 90}>
                <Card className="group glass h-full overflow-hidden hover:border-brand/40 transition flex flex-col">
                  <div className="relative aspect-video overflow-hidden bg-black/40">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      width={1280}
                      height={800}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-70" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gradient-brand text-ink">
                        {p.sector}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3 className="font-display font-bold text-xl">{p.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed flex-1">{p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-1 rounded-md bg-ink-foreground/5 border border-ink-foreground/10 text-ink-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={href}
                      className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:gap-3 transition-all mt-2"
                    >
                      {p.internalLink ? 'Acessar' : 'Ver painel'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Card>
                </Reveal>
              );
            })}
          </div>

          <p className="text-center text-xs text-ink-muted/60 mt-8">
            * Painéis de clientes são confidenciais. As demonstrações abertas usam bases públicas em Power BI para ilustrar a estrutura e a profundidade das análises que entregamos.
          </p>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-3">Depoimentos</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">O que muda na prática</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="h-full glass rounded-2xl p-7 flex flex-col gap-5 hover:border-brand/40 transition">
                  <Quote className="h-7 w-7 text-brand/60" />
                  <blockquote className="text-sm leading-relaxed text-ink-foreground/90 flex-1">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="pt-4 border-t border-ink-foreground/10">
                    <div className="font-display font-semibold">{t.name}</div>
                    <div className="text-xs text-ink-muted">{t.role}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="relative py-20 md:py-28 bg-ink-soft/40 border-y border-ink-foreground/10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `url(${logoTransparent})`,
            backgroundSize: 'auto 55%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(30%) brightness(1.15)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-3">
              Sobre a A&X
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Dados são a chave para o crescimento
            </h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              Há mais de <strong className="text-white">10 anos</strong> a A&X Tecnologia atua na análise
              e visualização de dados, ajudando empresas de diferentes portes a enxergarem o que
              realmente importa nos seus números.
            </p>
            <p className="text-ink-muted leading-relaxed mb-8">
              Trabalhamos com Power BI, SQL, Python e ferramentas modernas de cloud para entregar
              soluções completas — do dado bruto ao painel executivo. Nossa missão é fazer com que
              cada empresa tome decisões com confiança, baseadas em informação confiável.
            </p>
            <ul className="space-y-3">
              {[
                'Especialistas certificados em Power BI',
                'Metodologia ágil e entregas iterativas',
                'Suporte e evolução contínua dos painéis',
                'Atendimento personalizado em todo o Brasil',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-foreground/85">
                  <CheckCircle2 className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140} className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand/15 to-brand-alt/15 border border-ink-foreground/10 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  { icon: LineChart, label: 'Crescimento' },
                  { icon: PieChart, label: 'Análise' },
                  { icon: Shield, label: 'Segurança' },
                  { icon: Users, label: 'Pessoas' },
                ].map((i) => (
                  <div
                    key={i.label}
                    className="aspect-square rounded-2xl glass flex flex-col items-center justify-center gap-2 hover:border-brand/40 transition"
                  >
                    <i.icon className="h-8 w-8 text-brand" />
                    <span className="text-sm text-ink-muted">{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-3">Dúvidas frequentes</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold">Perguntas que sempre nos fazem</h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Accordion type="single" collapsible className="space-y-3">
              {faq.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="glass rounded-2xl px-5 border-ink-foreground/10"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-ink-muted leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* CTA / CONTATO */}
      <section id="contato" className="relative py-20 md:py-28 overflow-hidden bg-ink-soft border-t border-ink-foreground/10">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-brand/10 blur-3xl" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: `url(${logoTransparent})`,
            backgroundSize: 'auto 50%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(30%) brightness(1.15)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Vamos transformar seus dados juntos?
            </h2>
            <p className="text-ink-muted mb-10 max-w-xl mx-auto">
              Conte seu desafio em 15 minutos. Se fizer sentido, mostramos exatamente o que dá para
              extrair dos seus dados hoje — sem compromisso.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Reveal>
            <a
              href="mailto:atendimento@aextecnologia.com.br"
              className="group h-full flex items-center gap-4 p-5 rounded-2xl glass hover:border-brand/40 transition text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-brand" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-ink-muted uppercase tracking-wider">E-mail</div>
                <div className="font-medium truncate">atendimento@aextecnologia.com.br</div>
              </div>
            </a>
            </Reveal>
            <Reveal delay={100}>
            <a
              href="https://wa.me/5565992747522"
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full flex items-center gap-4 p-5 rounded-2xl glass hover:border-brand/40 transition text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-brand" />
              </div>
              <div>
                <div className="text-xs text-ink-muted uppercase tracking-wider">Telefone / WhatsApp</div>
                <div className="font-medium">(65) 99274-7522</div>
              </div>
            </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-ink-foreground/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-muted">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md overflow-hidden bg-ink-foreground">
              <img src={logo} alt="A&X" className="w-full h-full object-contain p-0.5" />
            </div>
            <span>© {new Date().getFullYear()} A&X Tecnologia — Análise de Dados</span>
          </div>
          <Link to="/auth" className="hover:text-ink-foreground transition flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Acessar Conta Fácil
          </Link>
        </div>
      </footer>

      {/* WHATSAPP FLUTUANTE */}
      <a
        href="https://wa.me/5565992747522?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20quero%20falar%20sobre%20an%C3%A1lise%20de%20dados."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-brand text-ink font-semibold px-4 py-3 shadow-glow hover:scale-105 transition"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline text-sm">Falar agora</span>
      </a>
    </div>
  );
}