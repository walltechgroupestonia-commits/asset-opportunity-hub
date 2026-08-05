import {
  ArrowLeft,
  BadgeEuro,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Gauge,
  Network,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const kpis = [
  { label: "Lead attivi", value: "38", note: "12 qualificati", icon: UserRound },
  { label: "Opportunità aperte", value: "17", note: "6 ad alta priorità", icon: BriefcaseBusiness },
  { label: "Valore pipeline", value: "€4,82M", note: "Dato dimostrativo", icon: CircleDollarSign },
  { label: "Time to next action", value: "2,4 gg", note: "Media operativa", icon: CalendarClock },
];

const stages = [
  { name: "Lead", count: 38, value: "€1,10M" },
  { name: "Assessment", count: 21, value: "€1,62M" },
  { name: "Opportunity", count: 17, value: "€4,82M" },
  { name: "Proposal", count: 8, value: "€2,14M" },
  { name: "Execution", count: 5, value: "€1,76M" },
  { name: "Closing", count: 3, value: "€980K" },
];

const opportunities = [
  {
    code: "WT-CRM-001",
    title: "Milano · Operazione pre-asta",
    owner: "Property Team",
    nextAction: "Verifica documenti",
    deadline: "06/08/2026",
    status: "Assessment",
  },
  {
    code: "WT-CRM-014",
    title: "DTA · Cedente corporate",
    owner: "Fiscal Assets",
    nextAction: "Invio proposta",
    deadline: "07/08/2026",
    status: "Opportunity",
  },
  {
    code: "WT-CRM-021",
    title: "Estonia · Holding structure",
    owner: "Corporate Team",
    nextAction: "Raccolta KYC",
    deadline: "08/08/2026",
    status: "Lead",
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

export function CrmIntelligence() {
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
              CRM Intelligence
            </p>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-primary">
                CRM & DEAL FLOW
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Lead, opportunità, owner e prossime azioni sotto controllo.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                Vista operativa per monitorare il ciclo commerciale e produttivo,
                dalla prima richiesta fino al closing, con evidenze, scadenze e
                responsabilità assegnate.
              </p>
            </div>

            <aside className="border border-border bg-background/70 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Integrazione predisposta</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Questa interfaccia è dimostrativa e predisposta per future
                    integrazioni con HubSpot, Zapier e sistemi documentali.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map(({ label, value, note, icon: Icon }) => (
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
              eyebrow="PIPELINE"
              title="Flusso commerciale e produttivo"
              description="Ogni opportunità deve avere stato, owner, prossima azione, scadenza ed evidenza."
            />

            <div className="space-y-3">
              {stages.map((item, index) => (
                <div
                  key={item.name}
                  className="grid grid-cols-[44px_1fr_auto] items-center gap-4 border border-border bg-background/60 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center border border-primary/40 text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.count} record
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-border bg-card/30 p-6">
            <SectionHeader
              eyebrow="CONTROL PANEL"
              title="Indicatori operativi"
            />

            <div className="space-y-5">
              {[
                ["Lead senza owner", "2"],
                ["Opportunità senza prossima azione", "3"],
                ["Scadenze entro 72 ore", "6"],
                ["Dossier incompleti", "5"],
                ["Closing previsti", "3"],
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
              <Gauge className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                L’obiettivo operativo è ridurre i tempi morti e garantire che ogni
                ciclo abbia una prossima azione verificabile.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-card/20 py-14">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="ACTIVE OPPORTUNITIES"
            title="Opportunità in lavorazione"
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
                  <Network className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Owner</span>
                    <strong>{item.owner}</strong>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Stato</span>
                    <strong>{item.status}</strong>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Prossima azione</span>
                    <strong className="text-right">{item.nextAction}</strong>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Scadenza</span>
                    <strong>{item.deadline}</strong>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href="/dossier"
                    className="inline-flex items-center justify-center border border-primary/50 px-4 py-3 text-sm font-semibold text-primary"
                  >
                    Apri dossier
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Aggiorna ciclo
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
          <article className="border border-border bg-card/30 p-6">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Evidence</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Ogni passaggio deve essere supportato da un documento, una risposta,
              un’attività completata o una registrazione verificabile.
            </p>
          </article>

          <article className="border border-border bg-card/30 p-6">
            <BadgeEuro className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Time to Revenue</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Priorità alle opportunità con fee definita, accordo protetto e
              monetizzazione verificabile.
            </p>
          </article>

          <article className="border border-border bg-card/30 p-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Dossier & Workflow</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Documentazione, attività, owner, scadenze e decisioni raccolti in un
              unico flusso operativo.
            </p>
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
                La dashboard organizza dati, workflow, evidenze e attività
                operative. Walltech Group OÜ non svolge attività riservate ai
                professionisti iscritti ad albi o registri. Le attività legali,
                fiscali, notarili, tecniche, estimative, bancarie e ogni altra
                attività professionale regolamentata sono svolte esclusivamente
                dai professionisti abilitati incaricati dalle parti.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
