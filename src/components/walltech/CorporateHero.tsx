import {
  ArrowRight,
  Building2,
  Globe2,
  Landmark,
  Network,
  ShieldCheck,
} from "lucide-react";
import heroWalltech from "@/assets/hero-walltech.jpg";

interface CorporateHeroProps {
  onDossier: () => void;
  onOperations: () => void;
}

const focusAreas = [
  { label: "Fonti ed Evidence", icon: Landmark },
  { label: "Document Intelligence", icon: ShieldCheck },
  { label: "Risk & Scenari", icon: Building2 },
  { label: "Decision Dossier", icon: Globe2 },
];

const ecosystemLines = [
  {
    title: "Source & Provenance",
    note: "Identifica origine, affidabilità e stato di ogni dato",
  },
  {
    title: "Document Intelligence",
    note: "Estrae le informazioni e segnala ciò che manca",
  },
  {
    title: "Cross-Check & Risk",
    note: "Confronta evidence, contraddizioni, rischi e blocchi",
  },
  {
    title: "Decision Gate",
    note: "Trasforma l'analisi in una decisione motivata e in una next action",
  },
];

export function CorporateHero({
  onDossier,
  onOperations,
}: CorporateHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0">
        <img
          src={heroWalltech}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.10]"
        />
        <div className="absolute inset-0 bg-background/88" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.28)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.10] via-background/35 to-background" />

      <div className="container relative mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-primary">
            WALLTECH INTELLIGENCE ENGINE™
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-bold leading-[1.08] text-foreground md:text-6xl">
            Da documenti e dati a
            <span className="block text-primary">
              una decisione immobiliare verificabile.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Walltech Intelligence Engine™ trasforma una reale opportunità
            immobiliare in un processo decisionale strutturato: fonti,
            documenti, evidence, rischi, scenari e verifiche necessarie.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Non inventa i dati mancanti e non sostituisce le fonti:
            distingue ciò che è verificato, dichiarato, derivato, assunto,
            mancante o contraddittorio prima di produrre una decisione.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Avvia Assessment
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#walltech-engine"
              className="inline-flex items-center justify-center gap-2 border border-primary/50 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Come funziona l'Engine
            </a>

            <button
              type="button"
              onClick={onOperations}
              className="inline-flex items-center justify-center border border-border bg-background/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Analizza un'opportunità
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {focusAreas.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 border border-border bg-background/65 p-3 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="border border-border bg-card/80 p-5 shadow-2xl shadow-black/10 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                DECISION OPERATING SYSTEM
              </p>

              <h2 className="mt-3 text-2xl font-bold text-foreground">
                Dall'opportunità al Decision Dossier.
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Un unico flusso operativo trasforma dati eterogenei in una
                decisione documentata, verificabile e utilizzabile.
              </p>
            </div>

            <Network className="h-6 w-6 shrink-0 text-primary" />
          </div>

          <div className="mt-5 grid gap-3">
            {ecosystemLines.map(({ title, note }) => (
              <div
                key={title}
                className="border border-border bg-background/75 p-4"
              >
                <p className="font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 border border-primary/35 bg-primary/[0.05] p-4">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-primary">
              PRINCIPIO OPERATIVO
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              Walltech Intelligence Engine™
            </p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Ogni output mantiene separati fatti verificati, dati dichiarati,
              assunzioni, missing data e contraddizioni.
            </p>
          </div>

          <button
            type="button"
            onClick={onDossier}
            className="mt-5 w-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Apri il Decision Dossier
          </button>
        </aside>
      </div>
    </section>
  );
}

