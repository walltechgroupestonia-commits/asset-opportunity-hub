import {
  BarChart3,
  FileCheck2,
  Network,
} from "lucide-react";

interface HeroProps {
  onDossier: () => void;
  onOperations: () => void;
}

export function Hero({ onDossier, onOperations }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.09] via-background/20 to-background" />

      <div className="container relative mx-auto px-4 py-24 md:py-28">
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

          <div className="mt-9 flex flex-wrap gap-3">
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

          <div className="mt-10 grid max-w-4xl gap-4 text-sm text-muted-foreground sm:grid-cols-3">
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
      </div>
    </section>
  );
}
