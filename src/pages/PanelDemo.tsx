import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { panels } from '@/data/panels';
import logo from '@/assets/logo.jpg';

export default function PanelDemo() {
  const { slug } = useParams();
  const panel = panels.find((p) => p.slug === slug);

  useEffect(() => {
    if (panel) {
      document.title = `${panel.title} | A&X Análise de Dados`;
    }
  }, [panel]);

  if (!panel || !panel.embedUrl) {
    return (
      <main className="min-h-screen bg-ink text-ink-foreground flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl font-bold">Painel não encontrado</h1>
        <p className="text-ink-muted">Esta demonstração não está disponível.</p>
        <Button asChild>
          <Link to="/#portfolio">Voltar ao portfólio</Link>
        </Button>
      </main>
    );
  }

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
          <Button asChild variant="outline" size="sm" className="border-ink-foreground/20 bg-transparent text-ink-foreground hover:bg-ink-foreground/10">
            <a href={panel.embedUrl} target="_blank" rel="noopener noreferrer">
              <Maximize2 className="h-4 w-4" />
              Tela cheia
            </a>
          </Button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gradient-brand text-ink">
          {panel.sector}
        </span>
        <h1 className="font-display text-2xl md:text-4xl font-bold mt-4 mb-3">{panel.title}</h1>
        <p className="text-ink-muted max-w-3xl leading-relaxed">{panel.desc}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {panel.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-1 rounded-md bg-ink-foreground/5 border border-ink-foreground/10 text-ink-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-xl overflow-hidden border border-ink-foreground/10 bg-black/40">
          <iframe
            title={panel.title}
            src={panel.embedUrl}
            className="w-full h-[70vh] min-h-[520px]"
            frameBorder={0}
            allowFullScreen
          />
        </div>

        {panel.source && (
          <p className="text-xs text-ink-muted/70 mt-4">
            Demonstração pública em Power BI.{' '}
            <a
              href={panel.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand inline-flex items-center gap-1 hover:underline"
            >
              Fonte: {panel.source.label}
              <ExternalLink className="h-3 w-3" />
            </a>
            . Os painéis de clientes são confidenciais; este exemplo usa dados públicos para ilustrar a estrutura de análise.
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild className="bg-gradient-brand text-ink font-semibold">
            <a href="https://wa.me/5565992747522?text=Ol%C3%A1!%20Vi%20os%20pain%C3%A9is%20no%20site%20e%20quero%20um%20projeto%20de%20BI." target="_blank" rel="noopener noreferrer">
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
