import {
  BarChart3,
  Building2,
  FileCheck2,
  Network,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface HeroProps {
  onDossier: () => void;
  onOperations: () => void;
}

const liveMetrics = [
  {
    label: "Operazioni monitorate",
    value: "18.400+",
    icon: Building2,
  },
  {
    label: "Dossier qualificati",
    value: "286",
    icon: FileCheck2,
  },
  {
    label: "Asset in valutazione",
    value: "74",
    icon: TrendingUp,
  },
];

export function Hero({ onDossier, onOperations }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.32)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.32)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.09] via-background/25 to-background" />

      <div className="container relative mx-auto px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="max-w-5xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary">
              WALLTECH INTELLIGENCE PLATFORM
            </p>

            <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-[1.08] text-foreground md:text-6xl">
              Analisi, qualificazione e coordinamento di
              <span className="block text-primary">
                operazioni immobiliari e patrimoniali complesse.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Una piattaforma operativa per organizzare dati, documenti,
              workflow, business case e decisioni dalla sorgente
              dell&apos;opportunità fino al closing, nel rispetto dei ruoli dei
              professionisti abilitati.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onDossier}
                className="inline-flex items-center justify-center bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Richiedi il Dossier Integrato
              </button>

              <button
                type="button"
                onClick={onOperations}
                className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                Esplora le operazioni
              </button>
            </div>

            <div className="mt-8 grid max-w-4xl gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Analisi e scoring operativo</span>
              </div>

              <div className="flex items-center gap-3">
                <FileCheck2 className="h-5 w-5 text-primary" />
                <span>Dossier e workflow documentato</span>
              </div>

              <div className="flex items-center gap-3">
                <Network className="h-5 w-5 text-primary" />
                <span>Coordinamento con partner qualificati</span>
              </div>
            </div>
          </div>

          <aside className="border border-border bg-card/70 p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                  LIVE PLATFORM STATUS
                </p>
                <h2 className="mt-3 text-xl font-bold text-foreground">
                  Intelligence operativa
                </h2>
              </div>
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <div className="mt-5 grid gap-3">
              {liveMetrics.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border border-border bg-background/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <strong className="text-lg text-foreground">{value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-5 border border-primary/30 bg-primary/[0.04] p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                STATO SISTEMA
              </p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Routing, dossier e moduli operativi
                </span>
                <span className="text-sm font-semibold text-foreground">
                  ATTIVI
                </span>
              </div>
            </div>

            <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
              Indicatori dimostrativi. I dati operativi reali saranno collegati
              ai moduli Assessment, CRM, Dossier e Investor Area.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
