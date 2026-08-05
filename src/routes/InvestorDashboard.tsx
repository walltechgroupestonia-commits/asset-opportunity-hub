import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  FileText,
  FolderLock,
  Gauge,
  LineChart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const summaryKpis = [
  {
    label: "Opportunità disponibili",
    value: "24",
    note: "+6 negli ultimi 30 giorni",
    icon: Building2,
  },
  {
    label: "Operazioni in analisi",
    value: "11",
    note: "5 ad alta priorità",
    icon: Gauge,
  },
  {
    label: "Dossier attivi",
    value: "8",
    note: "3 in verifica specialistica",
    icon: FileText,
  },
  {
    label: "Valore operazioni",
    value: "€18,4M",
    note: "Pipeline complessiva",
    icon: TrendingUp,
  },
];

const pipeline = [
  { stage: "Origination", count: 24, value: "€18,4M" },
  { stage: "Screening", count: 11, value: "€7,8M" },
  { stage: "Dossier", count: 8, value: "€5,6M" },
  { stage: "Verifiche", count: 5, value: "€3,9M" },
  { stage: "Decisione", count: 3, value: "€2,1M" },
  { stage: "Closing", count: 2, value: "€1,4M" },
];

const opportunities = [
  {
    code: "WT-IT-MI-001",
    title: "Milano · Residenziale pre-asta",
    stage: "Dossier attivo",
    score: "84/100",
    roi: "27,4%",
    value: "€305.000",
  },
  {
    code: "WT-IT-RM-014",
    title: "Roma · Commerciale",
    stage: "Screening",
    score: "79/100",
    roi: "22,1%",
    value: "€860.000",
  },
  {
    code: "WT-IT-TO-008",
    title: "Torino · Portafoglio immobiliare",
    stage: "Verifiche",
    score: "81/100",
    roi: "24,8%",
    value: "€1.240.000",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function InvestorDashboard() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla piattaforma
          </a>

          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              WALLTECH GROUP OÜ
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Investor Dashboard
            </p>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-primary">
                INVESTOR AREA
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Pipeline, dossier e decisioni in un’unica dashboard.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                Vista operativa dedicata a investitori, buyer qualificati,
                family office e partner autorizzati per monitorare opportunità,
                avanzamento dei dossier e stato della documentazione.
              </p>
            </div>

            <aside className="border border-border bg-background/70 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Accesso qualificato</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    I dati mostrati sono dimostrativi. L’accesso a dossier,
                    documenti e Data Room è subordinato a qualifica, NDA e
                    autorizzazioni.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryKpis.map(({ label, value, note, icon: Icon }) => (
              <article
                key={label}
                className="border border-border bg-background/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-bold">{value}</p>
                  </div>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-4 text-xs text-muted-foreground">{note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto grid gap-8 px-4 xl:grid-cols-[1fr_0.8fr]">
          <article className="border border-border bg-card/30 p-6">
            <SectionHeader
              eyebrow="DEAL FLOW"
              title="Pipeline operativa"
              description="Stato sintetico delle operazioni lungo il percorso Walltech."
            />

            <div className="space-y-3">
              {pipeline.map((item, index) => (
                <div
                  key={item.stage}
                  className="grid grid-cols-[44px_1fr_auto_auto] items-center gap-4 border border-border bg-background/60 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center border border-primary/40 text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="font-semibold">{item.stage}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.count} operazioni
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{item.value}</span>
                  <LineChart className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>
          </article>

          <article className="border border-border bg-card/30 p-6">
            <SectionHeader
              eyebrow="PERFORMANCE"
              title="Indicatori di portafoglio"
              description="Dati dimostrativi per la futura vista analitica."
            />

            <div className="space-y-5">
              {[
                ["ROI medio indicativo", "24,9%"],
                ["Opportunity score medio", "81/100"],
                ["Tempo medio screening", "3,2 giorni"],
                ["Dossier completi", "62%"],
                ["Operazioni ad alta priorità", "5"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-border pb-3"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 border border-primary/30 bg-primary/[0.04] p-4">
              <BarChart3 className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                Le metriche finanziarie e operative diventano definitive solo
                dopo verifica dei dati e validazione da parte dei professionisti
                competenti.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-card/20 py-14">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="OPPORTUNITIES"
            title="Operazioni in evidenza"
            description="Selezione dimostrativa delle opportunità attualmente presenti nella pipeline."
          />

          <div className="grid gap-4 xl:grid-cols-3">
            {opportunities.map((item) => (
              <article
                key={item.code}
                className="border border-border bg-background/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-primary">
                      {item.code}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  </div>
                  <BriefcaseBusiness className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Stato</p>
                    <p className="mt-1 text-sm font-semibold">{item.stage}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Score</p>
                    <p className="mt-1 text-sm font-semibold">{item.score}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">ROI</p>
                    <p className="mt-1 text-sm font-semibold">{item.roi}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    Valore operazione
                  </p>
                  <p className="mt-1 text-xl font-bold">{item.value}</p>
                </div>

                <a
                  href="/dossier"
                  className="mt-6 inline-flex w-full items-center justify-center border border-primary/50 px-4 py-3 text-sm font-semibold text-primary"
                >
                  Apri dossier
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2">
          <article className="border border-border bg-card/30 p-6">
            <FolderLock className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Data Room</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Documenti organizzati, accessi tracciati e permessi differenziati
              per operazione e ruolo.
            </p>
            <button
              type="button"
              className="mt-6 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Richiedi accesso
            </button>
          </article>

          <article className="border border-border bg-card/30 p-6">
            <CalendarClock className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">
              Investor briefing
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Richiedi un incontro di approfondimento sull’operazione, sul
              dossier e sul relativo workflow.
            </p>
            <button
              type="button"
              className="mt-6 border border-border px-5 py-3 text-sm font-semibold text-foreground"
            >
              Prenota briefing
            </button>
          </article>
        </div>
      </section>

      <section className="border-t border-border bg-card/20 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 border border-border bg-background/70 p-6">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">Disclaimer professionale</h2>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                La dashboard ha natura informativa, organizzativa e di supporto
                decisionale. Walltech Group OÜ non svolge attività riservate ai
                professionisti iscritti ad albi o registri e non sostituisce
                avvocati, notai, commercialisti, consulenti fiscali, tecnici
                abilitati, periti, mediatori o altri professionisti
                regolamentati. Le verifiche specialistiche e le valutazioni
                definitive sono eseguite esclusivamente dai professionisti
                incaricati dalle parti.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
