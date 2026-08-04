import { Database, Handshake, Radio, ShieldCheck } from "lucide-react";

type SourceState = "demo" | "partner" | "live";

interface SourceCardProps {
  title: string;
  description: string;
  state: SourceState;
  active?: boolean;
}

const stateMeta: Record<SourceState, { label: string; note: string }> = {
  demo: { label: "DEMO DATASET", note: "Dati dimostrativi a fini illustrativi." },
  partner: { label: "PARTNER FEED", note: "Dati ricevuti da partner autorizzati." },
  live: { label: "LIVE VERIFIED SOURCE", note: "Disponibile solo con integrazione API autorizzata." },
};

function SourceCard({ title, description, state, active = false }: SourceCardProps) {
  const meta = stateMeta[state];

  return (
    <article className={[
      "border p-5 transition-colors",
      active ? "border-primary/70 bg-primary/[0.05]" : "border-border bg-card/40",
    ].join(" ")}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {state === "demo" && <Database className="h-5 w-5 text-primary" />}
          {state === "partner" && <Handshake className="h-5 w-5 text-primary" />}
          {state === "live" && <Radio className="h-5 w-5 text-primary" />}
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <span className={[
          "whitespace-nowrap border px-2 py-1 text-[10px] font-semibold tracking-[0.18em]",
          active ? "border-primary/60 text-primary" : "border-border text-muted-foreground",
        ].join(" ")}>
          {meta.label}
        </span>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">{meta.note}</p>
    </article>
  );
}

export function DataSourceTransparency() {
  return (
    <section aria-labelledby="data-source-title" className="border-y border-border bg-background py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-primary">
              <ShieldCheck className="h-4 w-4" />
              TRASPARENZA DELLE SORGENTI
            </div>
            <h2 id="data-source-title" className="text-2xl font-bold text-foreground md:text-3xl">
              Origine e stato dei dati
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              La piattaforma distingue sempre tra dataset dimostrativi, feed ricevuti da partner e sorgenti live autorizzate. La raggiungibilità tecnica di un portale non equivale all'acquisizione dei suoi dati.
            </p>
          </div>
          <div className="border border-primary/40 bg-primary/[0.04] px-4 py-3 text-xs font-semibold tracking-[0.16em] text-primary">
            MODALITÀ ATTUALE: DEMO DATASET
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SourceCard
            title="Dataset Walltech"
            description="Contenuti interni utilizzati per dimostrare ricerca, classificazione e workflow operativo."
            state="demo"
            active
          />
          <SourceCard
            title="Feed Partner"
            description="Canale predisposto per dati forniti da soggetti convenzionati e disciplinati da accordo."
            state="partner"
          />
          <SourceCard
            title="Sorgente live"
            description="Connessione futura a API o feed ufficiali con credenziali, autorizzazioni e tracciamento."
            state="live"
          />
        </div>
      </div>
    </section>
  );
}
