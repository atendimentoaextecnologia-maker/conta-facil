const TECHS = [
  'Power BI', 'SQL Server', 'Python', 'Azure', 'Databricks', 'dbt',
  'Fabric', 'Snowflake', 'Supabase', 'DAX', 'Power Automate', 'Looker Studio',
];

export function TechMarquee() {
  const items = [...TECHS, ...TECHS];
  return (
    <div className="relative overflow-hidden py-6 border-y border-ink-foreground/10">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-ink to-transparent" />
      <ul className="flex w-max gap-10 animate-marquee">
        {items.map((t, i) => (
          <li
            key={`${t}-${i}`}
            className="text-sm md:text-base font-display font-semibold tracking-wide text-ink-muted/70 whitespace-nowrap"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}