import {
  BarChart3,
  BrainCircuit,
  FileCheck2,
  FolderLock,
  Gauge,
  Network,
} from "lucide-react";

const modules = [
  {
    title: "Opportunity Intake",
    description:
      "Raccoglie l'opportunità, i dati iniziali e gli elementi necessari per avviare l'analisi.",
    icon: Gauge,
    href: "/assessment",
  },
  {
    title: "Source & Provenance",
    description:
      "Registra origine, affidabilità e stato delle informazioni utilizzate nel processo.",
    icon: Network,
    href: "/assessment",
  },
  {
    title: "Document Intelligence",
    description:
      "Organizza i documenti, estrae evidence e segnala dati mancanti o contraddittori.",
    icon: FolderLock,
    href: "/assessment",
  },
  {
    title: "Risk & Scenari",
    description:
      "Valuta rischi, assunzioni e scenari economici senza inventare i dati mancanti.",
    icon: BarChart3,
    href: "/decision",
  },
  {
    title: "Decision Gate",
    description:
      "Converte l'analisi in una decisione motivata, verifiche richieste e prossima azione.",
    icon: BrainCircuit,
    href: "/decision",
  },
  {
    title: "Decision Dossier",
    description:
      "Consolida fonti, evidence, rischi, scenari e decisione in un output utilizzabile.",
    icon: FileCheck2,
    href: "/dossier",
  },
];

export function IntelligenceEngineShowcase() {
  return (
    <section
      id="walltech-engine"
      aria-labelledby="walltech-engine-title"
      className="border-t border-border bg-background py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 xl:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-primary">
              WALLTECH INTELLIGENCE ENGINE™
            </p>

            <h2
              id="walltech-engine-title"
              className="mt-4 text-3xl font-bold text-foreground md:text-5xl"
            >
              Il sistema operativo per decisioni immobiliari verificabili.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Un unico flusso collega opportunità, fonti, documenti, evidence,
              rischio e decisione finale mantenendo separati fatti verificati,
              dati dichiarati, assunzioni e missing data.
            </p>

            <div className="mt-8 border border-primary/40 bg-primary/[0.04] p-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                ENGINE 001 · FUNCTIONAL CORE
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Questa versione concentra il prodotto su un risultato:
                trasformare una reale opportunità immobiliare in un Decision
                Dossier documentato, verificabile e utilizzabile.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(({ title, description, icon: Icon, href }) => (
              <a
                key={title}
                href={href}
                className="border border-border bg-card/35 p-5 transition-colors hover:border-primary/60 hover:bg-primary/[0.04]"
              >
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                <span className="mt-6 inline-flex text-xs font-semibold tracking-[0.12em] text-primary">
                  APRI MODULO →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
