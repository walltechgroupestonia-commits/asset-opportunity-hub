import {
  BarChart3,
  Building2,
  FileCheck2,
  Gauge,
  Search,
  ShieldAlert,
} from "lucide-react";

const features = [
  {
    title: "Ricerca qualificata",
    description:
      "Filtri operativi per area, tipologia, budget, occupazione e procedura.",
    icon: Search,
  },
  {
    title: "Opportunity Score",
    description:
      "Valutazione sintetica del potenziale dell’operazione e della qualità dei dati.",
    icon: Gauge,
  },
  {
    title: "Analisi economica",
    description:
      "Prezzo, valore stimato, margine, costi, rendimento e scenario di uscita.",
    icon: BarChart3,
  },
  {
    title: "Rischio operativo",
    description:
      "Indicatori su documentazione, complessità, tempi e criticità della procedura.",
    icon: ShieldAlert,
  },
  {
    title: "Dossier operativo",
    description:
      "Contenitore unico per evidenze, documenti, note, partner, timeline e attività.",
    icon: FileCheck2,
  },
  {
    title: "Asset intelligence",
    description:
      "Normalizzazione delle informazioni provenienti da dataset, partner e future API.",
    icon: Building2,
  },
];

export function PropertyIntelligence() {
  return (
    <section
      id="property-intelligence"
      aria-labelledby="property-intelligence-title"
      className="bg-card/20 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            PROPERTY INTELLIGENCE
          </p>
          <h2
            id="property-intelligence-title"
            className="mt-4 text-3xl font-bold text-foreground md:text-4xl"
          >
            Dalla ricerca alla decisione operativa.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Il modulo Property Intelligence raccoglie, qualifica e organizza le
            informazioni necessarie per valutare un’operazione prima di aprire il
            dossier e avviare la due diligence.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="border border-border bg-background/60 p-5"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center border border-primary/40 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#operazioni"
            className="inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Esplora le operazioni
          </a>
          <a
            href="#platform"
            className="inline-flex items-center justify-center border border-border px-5 py-3 text-sm font-semibold text-foreground"
          >
            Torna ai moduli
          </a>
        </div>
      </div>
    </section>
  );
}
