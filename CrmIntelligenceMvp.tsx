import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Filter,
  Network,
  Search,
} from "lucide-react";
import {
  calculateCrmSummary,
  opportunityWarnings,
} from "@/lib/walltech/crmEngine";
import type {
  CrmOpportunity,
  CrmStage,
} from "@/lib/walltech/crmTypes";

const initialOpportunities: CrmOpportunity[] = [
  {
    id: "WT-CRM-001",
    title: "Colella · Portafoglio NPL",
    client: "Larioinvest / Solution",
    businessUnit: "NPL",
    stage: "EXECUTION",
    owner: "Massimo Dongu",
    value: 1800000,
    fee: 90000,
    probability: 70,
    nextAction: "Completare agreement e documentazione DD",
    deadline: "Entro 24 ore",
    evidence: "Agreement firmato e documenti caricati",
    feeProtected: true,
    buyerAvailable: true,
    updatedAt: "06/08/2026",
  },
  {
    id: "WT-CRM-002",
    title: "Minerva · Fiscal Assets",
    client: "Minerva Srl",
    businessUnit: "Fiscal Assets",
    stage: "OPPORTUNITY",
    owner: "Massimo Dongu",
    value: 17000000,
    fee: 0,
    probability: 45,
    nextAction: "Verificare fee, cedente e controparte",
    deadline: "Entro 48 ore",
    evidence: "Profilo operazione e documentazione minima",
    feeProtected: false,
    buyerAvailable: false,
    updatedAt: "06/08/2026",
  },
  {
    id: "WT-CRM-003",
    title: "AD Advisor · Fiscal Assets",
    client: "AD Advisor SpA",
    businessUnit: "Fiscal Assets",
    stage: "ASSESSMENT",
    owner: "Massimo Dongu",
    value: 14000000,
    fee: 0,
    probability: 35,
    nextAction: "Qualification call e document check",
    deadline: "Questa settimana",
    evidence: "Verbale call e source file",
    feeProtected: false,
    buyerAvailable: false,
    updatedAt: "06/08/2026",
  },
  {
    id: "WT-CRM-004",
    title: "Predict · European Advisory",
    client: "Predict",
    businessUnit: "Corporate Advisory",
    stage: "PROPOSAL",
    owner: "Massimo Dongu",
    value: 250000,
    fee: 25000,
    probability: 55,
    nextAction: "Follow-up proposta e decisione pilot",
    deadline: "Oggi",
    evidence: "Proposta inviata e risposta del terminale",
    feeProtected: true,
    buyerAvailable: true,
    updatedAt: "06/08/2026",
  },
];

const stages: CrmStage[] = [
  "LEAD",
  "ASSESSMENT",
  "OPPORTUNITY",
  "PROPOSAL",
  "EXECUTION",
  "CLOSING",
  "WON",
  "LOST",
];

function euro(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CrmIntelligenceMvp() {
  const [opportunities, setOpportunities] =
    useState<CrmOpportunity[]>(initialOpportunities);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] =
    useState<CrmStage | "ALL">("ALL");

  const summary = useMemo(
    () => calculateCrmSummary(opportunities),
    [opportunities],
  );

  const filtered = useMemo(() => {
    return opportunities.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.client.toLowerCase().includes(query.toLowerCase()) ||
        item.businessUnit.toLowerCase().includes(query.toLowerCase());

      const matchesStage =
        stageFilter === "ALL" || item.stage === stageFilter;

      return matchesQuery && matchesStage;
    });
  }, [opportunities, query, stageFilter]);

  const updateStage = (id: string, stage: CrmStage) => {
    setOpportunities((current) =>
      current.map((item) =>
        item.id === id ? { ...item, stage } : item,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna a Walltech
          </a>

          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              WALLTECH INTELLIGENCE ENGINE™
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              CRM Intelligence · MVP
            </p>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            CRM INTELLIGENCE
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Pipeline, owner, next action, evidence e income sotto controllo.
          </h1>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {[
              ["Pipeline", euro(summary.totalPipeline)],
              ["Income atteso", euro(summary.expectedIncome)],
              ["Income pesato", euro(summary.weightedIncome)],
              ["Opportunità aperte", String(summary.openOpportunities)],
              ["Azioni urgenti", String(summary.urgentActions)],
              ["Opportunità bloccate", String(summary.blockedOpportunities)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border border-border bg-background/70 p-4"
              >
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 border border-border bg-card/30 p-4 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-3 border border-border bg-background px-4 py-3">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cerca cliente, operazione o business unit"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>

            <label className="flex items-center gap-3 border border-border bg-background px-4 py-3">
              <Filter className="h-4 w-4 text-primary" />
              <select
                value={stageFilter}
                onChange={(event) =>
                  setStageFilter(event.target.value as CrmStage | "ALL")
                }
                className="bg-background text-sm outline-none"
              >
                <option value="ALL">Tutti gli stage</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4">
            {filtered.map((item) => {
              const warnings = opportunityWarnings(item);

              return (
                <article
                  key={item.id}
                  className="border border-border bg-card/30 p-5"
                >
                  <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.18em] text-primary">
                            {item.id}
                          </p>
                          <h2 className="mt-3 text-xl font-bold">
                            {item.title}
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.client} · {item.businessUnit}
                          </p>
                        </div>
                        <BriefcaseBusiness className="h-5 w-5 text-primary" />
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="border border-border bg-background/70 p-3">
                          <p className="text-xs text-muted-foreground">Owner</p>
                          <p className="mt-1 text-sm font-semibold">
                            {item.owner || "MISSING"}
                          </p>
                        </div>
                        <div className="border border-border bg-background/70 p-3">
                          <p className="text-xs text-muted-foreground">Valore</p>
                          <p className="mt-1 text-sm font-semibold">
                            {euro(item.value)}
                          </p>
                        </div>
                        <div className="border border-border bg-background/70 p-3">
                          <p className="text-xs text-muted-foreground">Fee</p>
                          <p className="mt-1 text-sm font-semibold">
                            {euro(item.fee)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                        CICLO OPERATIVO
                      </p>

                      <div className="mt-3 space-y-3">
                        <div className="border border-border bg-background/70 p-3">
                          <p className="text-xs text-muted-foreground">
                            Next Action
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {item.nextAction}
                          </p>
                        </div>

                        <div className="border border-border bg-background/70 p-3">
                          <p className="text-xs text-muted-foreground">
                            Deadline
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {item.deadline}
                          </p>
                        </div>

                        <div className="border border-border bg-background/70 p-3">
                          <p className="text-xs text-muted-foreground">
                            Evidence
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {item.evidence}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                        CONTROL
                      </p>

                      <select
                        value={item.stage}
                        onChange={(event) =>
                          updateStage(item.id, event.target.value as CrmStage)
                        }
                        className="mt-3 w-full border border-border bg-background px-4 py-3 text-sm font-semibold"
                      >
                        {stages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>

                      <div className="mt-3 border border-border bg-background/70 p-3">
                        <p className="text-xs text-muted-foreground">
                          Probability
                        </p>
                        <p className="mt-1 text-lg font-bold">
                          {item.probability}%
                        </p>
                      </div>

                      <div className="mt-3 border border-border bg-background/70 p-3">
                        <p className="text-xs text-muted-foreground">
                          Updated
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {item.updatedAt}
                        </p>
                      </div>

                      <div className="mt-3 border border-primary/30 bg-primary/[0.04] p-3">
                        <div className="flex items-start gap-3">
                          {warnings.length ? (
                            <AlertTriangle className="mt-0.5 h-4 w-4 text-primary" />
                          ) : (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                          )}

                          <div>
                            <p className="text-xs font-semibold">
                              {warnings.length
                                ? `${warnings.length} warning`
                                : "Ciclo completo"}
                            </p>

                            {warnings.length ? (
                              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                {warnings.map((warning) => (
                                  <li key={warning}>• {warning}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <a
                        href="/dossier"
                        className="mt-3 inline-flex w-full items-center justify-center bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                      >
                        Apri dossier
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!filtered.length ? (
            <div className="mt-6 border border-dashed border-border p-8 text-center">
              <Network className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Nessuna opportunità trovata.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
