import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileSearch,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { analyzePropertyOpportunity } from "@/lib/walltech/propertyIntelligenceEngine";
import type {
  PropertyIntelligenceOutput,
  PropertyOpportunityInput,
} from "@/lib/walltech/propertyIntelligenceTypes";
import { loadPropertyOpportunity } from "@/lib/walltech/opportunityStore";

const decisionLabel = (value: string) =>
  ({
    DISCARD: "NON PROCEDERE",
    REVIEW: "DA RIVEDERE",
    DEEP_DIVE: "APPROFONDIRE",
    INVESTMENT_READY: "PRONTA PER DECISIONE",
  })[value] ?? value;

const riskLabel = (value: string) =>
  ({
    LOW: "BASSO",
    MEDIUM: "MEDIO",
    HIGH: "ALTO",
    CRITICAL: "CRITICO",
  })[value] ?? value;

const areaLabel = (value: string) =>
  ({
    PROCEDURE: "PROCEDURA",
    DOCUMENTATION: "DOCUMENTAZIONE",
    URBAN: "URBANISTICA",
    CADASTRAL: "CATASTALE",
    OCCUPANCY: "OCCUPAZIONE",
    CONDOMINIUM: "CONDOMINIO",
    MARKET: "MERCATO",
    FINANCIAL: "FINANZIARIO",
    TAX: "FISCALE",
    EXIT: "USCITA",
  })[value] ?? value;

const scenarioLabel = (value: string) =>
  ({
    FLIP: "RIVENDITA",
    RENTAL: "LOCAZIONE",
    HOLD: "MANTENIMENTO",
  })[value] ?? value;

function euro(value: number | null) {
  if (value === null) return "DATO MANCANTE";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border bg-background/70 p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function DecisionContent({
  opportunity,
  analysis,
}: {
  opportunity: PropertyOpportunityInput;
  analysis: PropertyIntelligenceOutput;
}) {
  const procedure = opportunity.procedure;
  const asset = opportunity.asset;

  return (
    <>
      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            PROPERTY DECISION ENGINE
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Dall'Opportunity Record al Decision Gate.
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Il motore analizza soltanto i dati disponibili, distingue
            evidence, input dichiarati e missing data e genera le
            verifiche necessarie prima di una decisione definitiva.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto space-y-8 px-4">
          <section className="border border-border bg-card/30 p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                  OPPORTUNITY RECORD
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  {opportunity.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {opportunity.opportunityId}
                </p>
              </div>

              <div className="border border-primary/40 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  DECISION GATE
                </p>
                <p className="mt-1 font-bold text-primary">
                  {decisionLabel(analysis.decision)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <Metric
                label="Punteggio Opportunità"
                value={analysis.opportunityScore === null ? "N/D" : `${analysis.opportunityScore}/100`}
              />
              <Metric
                label="Punteggio Rischio"
                value={analysis.riskScore === null ? "N/D" : `${analysis.riskScore}/100`}
              />
              <Metric
                label="Completezza"
                value={`${analysis.completeness}%`}
              />
              <Metric
                label="Copertura valutazione rischio"
                value={`${analysis.riskCoverage}%`}
              />
              <Metric
                label="Documenti disponibili"
                value={`${opportunity.availableDocuments.length}`}
              />
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <article className="border border-border bg-card/30 p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">
                  Opportunità dichiarata
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Comune", asset.city?.value ?? "DATO MANCANTE"],
                  ["Provincia", asset.province?.value ?? "DATO MANCANTE"],
                  [
                    "Tipologia",
                    asset.propertyType?.value ?? "DATO MANCANTE",
                  ],
                  [
                    "Occupazione",
                    asset.occupancy?.value ?? "DATO MANCANTE",
                  ],
                  [
                    "Procedura",
                    procedure.procedureNumber?.value ??
                      "DATO MANCANTE",
                  ],
                  [
                    "Tribunale",
                    procedure.tribunal?.value ?? "DATO MANCANTE",
                  ],
                  [
                    "Prezzo base",
                    euro(procedure.basePrice?.value ?? null),
                  ],
                  [
                    "Offerta minima",
                    euro(procedure.minimumOffer?.value ?? null),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border border-border bg-background/70 p-4"
                  >
                    <p className="text-xs text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="border border-border bg-card/30 p-6">
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">
                  Completezza per area
                </h2>
              </div>

              <div className="mt-6 space-y-3">
                {Object.entries(analysis.scoreBreakdown).map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 border-b border-border pb-3"
                    >
                      <span className="text-sm capitalize text-muted-foreground">
                        {label}
                      </span>
                      <strong>{value}%</strong>
                    </div>
                  ),
                )}
              </div>
            </article>
          </section>

          <section className="border border-border bg-card/30 p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">
                Rischi e criticità
              </h2>
            </div>

            {analysis.topRisks.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {analysis.topRisks.map((risk) => (
                  <div
                    key={risk.id}
                    className="border border-border bg-background/70 p-5"
                  >
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary">
                      {areaLabel(risk.area)} ·{" "}
                      {riskLabel(risk.level)}
                    </p>
                    <h3 className="mt-3 font-semibold">
                      {risk.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {risk.description}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Fonte: {risk.sourceLabel} ·{" "}
                      {risk.confidence}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                Nessuna criticità registrata nell'Assessment
                corrente. Questo non equivale ad assenza di rischio:
                può indicare dati ancora mancanti.
              </p>
            )}
          </section>

          <section className="border border-border bg-card/30 p-6">
            <div className="flex items-center gap-3">
              <FileSearch className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">
                Scenari economici
              </h2>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Nessun ROI viene prodotto se gli input necessari non
              sono disponibili.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {analysis.scenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className="border border-border bg-background/70 p-5"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                    {scenarioLabel(scenario.name)}
                  </p>

                  <div className="mt-5 space-y-3 text-sm">
                    <p>
                      Completezza:{" "}
                      <strong>{scenario.completeness}%</strong>
                    </p>
                    <p>
                      Capitale richiesto:{" "}
                      <strong>
                        {euro(scenario.totalCapitalRequired)}
                      </strong>
                    </p>
                    <p>
                      ROI:{" "}
                      <strong>
                        {scenario.roiPercent === null
                          ? "DATO MANCANTE"
                          : `${scenario.roiPercent}%`}
                      </strong>
                    </p>
                  </div>

                  {scenario.missingInputs.length ? (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-xs font-semibold text-muted-foreground">
                        INPUT MANCANTI
                      </p>
                      <ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">
                        {scenario.missingInputs.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_0.72fr]">
            <article className="border border-border bg-card/30 p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">
                  Verifiche successive
                </h2>
              </div>

              {analysis.requiredNextChecks.length ? (
                <ul className="mt-6 space-y-3">
                  {analysis.requiredNextChecks.map((check) => (
                    <li
                      key={check}
                      className="border border-border bg-background/70 p-4 text-sm leading-6"
                    >
                      {check}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">
                  Nessuna verifica successiva registrata.
                </p>
              )}
            </article>

            <aside className="border border-primary/30 bg-primary/[0.04] p-6">
              <div className="flex items-start gap-3">
                {analysis.decision === "INVESTMENT_READY" ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                )}

                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                    DECISIONE PRELIMINARE
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">
                    {decisionLabel(analysis.decision)}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {analysis.decisionReason}
                  </p>
                </div>
              </div>

              <a
                href="/assessment"
                className="mt-6 inline-flex w-full items-center justify-center border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50"
              >
                Aggiorna Assessment
              </a>
            </aside>
          </section>
        </div>
      </section>
    </>
  );
}

export function PropertyDecisionEngine() {
  const [opportunity, setOpportunity] =
    useState<PropertyOpportunityInput | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOpportunity(loadPropertyOpportunity());
    setLoaded(true);
  }, []);

  const analysis = useMemo(
    () =>
      opportunity
        ? analyzePropertyOpportunity(opportunity)
        : null,
    [opportunity],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna all'Engine
          </a>

          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              WALLTECH INTELLIGENCE ENGINE™
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Property Decision Engine
            </p>
          </div>
        </div>
      </header>

      {!loaded ? (
        <section className="container mx-auto px-4 py-20">
          <p className="text-sm text-muted-foreground">
            Caricamento Opportunity Record...
          </p>
        </section>
      ) : opportunity && analysis ? (
        <DecisionContent
          opportunity={opportunity}
          analysis={analysis}
        />
      ) : (
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl border border-border bg-card/30 p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <h1 className="mt-5 text-3xl font-bold">
              Nessuna opportunità da analizzare.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Il Decision Engine richiede un Opportunity Record
              generato dall'Assessment. Nessun caso demo viene
              caricato automaticamente.
            </p>

            <a
              href="/assessment"
              className="mt-7 inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Avvia Assessment
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
