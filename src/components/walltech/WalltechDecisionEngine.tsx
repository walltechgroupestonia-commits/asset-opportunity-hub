const steps = [
  {
    number: "01",
    title: "Origine opportunità",
    description: "Acquisizione da dataset Walltech, feed partner o sorgenti autorizzate.",
    items: ["Dataset Walltech", "Feed partner", "Sorgenti autorizzate"],
    status: "SOURCE READY",
  },
  {
    number: "02",
    title: "Analisi e qualificazione",
    description: "Screening preliminare, verifica documentale, rischio e potenziale.",
    items: ["Screening", "Due diligence", "Opportunity score"],
    status: "ANALYSIS READY",
  },
  {
    number: "03",
    title: "Dossier operativo",
    description: "Organizzazione dei dati, dei documenti e del piano economico.",
    items: ["Documenti", "Workflow", "Business case"],
    status: "DOSSIER READY",
  },
  {
    number: "04",
    title: "Gestione operazione",
    description: "Assegnazione, monitoraggio, partner, reporting e closing.",
    items: ["Owner", "Partner", "Closing"],
    status: "EXECUTION READY",
  },
] as const;

export function WalltechDecisionEngine() {
  return (
    <section aria-labelledby="decision-engine-title" className="border-y border-border bg-card/30">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Walltech Intelligence Platform
          </p>
          <h2 id="decision-engine-title" className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Dalla sorgente dell’opportunità alla gestione completa dell’operazione.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La ricerca è il punto di ingresso. Il prodotto è un’operazione analizzata,
            documentata, assegnata e monitorata fino al closing.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.number} className="relative bg-card p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="font-mono text-xs tracking-[0.2em] text-primary">STEP {step.number}</span>
                <span className="border border-primary/40 px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-primary">
                  {step.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{step.description}</p>

              <ul className="mt-5 space-y-2 border-t border-border pt-5">
                {step.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground/85">
                    <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-5 border border-border bg-background/60 px-4 py-3 text-xs leading-5 text-muted-foreground">
          <strong className="font-semibold text-foreground">Trasparenza delle sorgenti:</strong>{" "}
          i dati demo, i feed partner e le future integrazioni autorizzate devono essere sempre identificati separatamente.
          La raggiungibilità tecnica di una sorgente non equivale all’acquisizione di dati live.
        </div>
      </div>
    </section>
  );
}
