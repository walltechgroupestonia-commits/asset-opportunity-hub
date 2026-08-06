import {
  ArrowRight,
  Building2,
  Globe2,
  Landmark,
  Network,
  ShieldCheck,
} from "lucide-react";

interface CorporateHeroProps {
  onDossier: () => void;
  onOperations: () => void;
}

const focusAreas = [
  { label: "Fiscal Assets", icon: Landmark },
  { label: "NPL & Special Situations", icon: ShieldCheck },
  { label: "Real Estate Opportunities", icon: Building2 },
  { label: "Estonia & Northern Europe", icon: Globe2 },
];

export function CorporateHero({
  onDossier,
  onOperations,
}: CorporateHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.28)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.08] via-background/35 to-background" />

      <div className="container relative mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-primary">
            WALLTECH GROUP OÜ · ESTONIA
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-bold leading-[1.08] text-foreground md:text-6xl">
            European Business Ecosystem
            <span className="block text-primary">
              for opportunities, advisory and intelligent execution.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Walltech connects qualified opportunities, investors, companies and
            professional expertise across Italy, Estonia, the Baltic region and
            Northern Europe.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Accedi ai servizi
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#walltech-engine"
              className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Walltech Intelligence Engine™
            </a>

            <button
              type="button"
              onClick={onOperations}
              className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Esplora le operazioni
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {focusAreas.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 border border-border bg-background/60 p-3"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="border border-border bg-card/75 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                WALLTECH ECOSYSTEM
              </p>
              <h2 className="mt-3 text-2xl font-bold text-foreground">
                One group. Multiple opportunity lines.
              </h2>
            </div>
            <Network className="h-6 w-6 text-primary" />
          </div>

          <div className="mt-5 grid gap-3">
            {[
              ["Fiscal Assets & Tax Credits", "Opportunities and origination"],
              ["NPL & Distressed Assets", "Qualified transactions and dossiers"],
              ["Corporate Advisory", "Business development and structuring"],
              ["Estonia Gateway", "European expansion and market access"],
            ].map(([title, note]) => (
              <div
                key={title}
                className="border border-border bg-background/70 p-4"
              >
                <p className="font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onDossier}
            className="mt-5 w-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Apri il Dossier Integrato
          </button>
        </aside>
      </div>
    </section>
  );
}
