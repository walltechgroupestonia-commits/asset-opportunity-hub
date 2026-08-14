import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Download,
  FileCheck2,
  Gauge,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { analyzePropertyOpportunity } from "@/lib/walltech/propertyIntelligenceEngine";
import type { PropertyOpportunityInput } from "@/lib/walltech/propertyIntelligenceTypes";
import { loadPropertyOpportunity } from "@/lib/walltech/opportunityStore";

const decisionLabel = (value: string) =>
  ({
    DISCARD: "NON PROCEDERE",
    REVIEW: "DA RIVEDERE",
    DEEP_DIVE: "APPROFONDIRE",
    INVESTMENT_READY: "PRONTA PER DECISIONE",
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

function score(value: number | null) {
  return value === null ? "N/D" : `${value}/100`;
}

export function PropertyDecisionDossier() {
  const [opportunity, setOpportunity] =
    useState<PropertyOpportunityInput | null>(null);
  const [loaded, setLoaded] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  const downloadJson = () => {
    if (!opportunity || !analysis) return;

    const blob = new Blob(
      [
        JSON.stringify(
          {
            opportunity,
            analysis,
            generatedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${opportunity.opportunityId}-decision-dossier.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-20">
          <p className="text-sm text-muted-foreground">
            Caricamento Decision Dossier...
          </p>
        </div>
      </main>
    );
  }

  if (!opportunity || !analysis) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/40">
          <div className="container mx-auto px-4 py-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna all'Engine
            </a>
          </div>
        </header>

        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl border border-border bg-card/30 p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <h1 className="mt-5 text-3xl font-bold">
              Nessun dossier disponibile.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Il Decision Dossier richiede un Opportunity Record
              generato dall'Assessment. Nessun caso demo viene caricato
              automaticamente.
            </p>
            <a
              href="/assessment"
              className="mt-7 inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Avvia Assessment
            </a>
          </div>
        </section>
      </main>
    );
  }

  const asset = opportunity.asset;
  const procedure = opportunity.procedure;
  const flipScenario = analysis.scenarios.find(
    (item) => item.name === "FLIP",
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 print:hidden">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <a
            href="/decision"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna al Decision Engine
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadJson}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold"
            >
              <Download className="h-4 w-4" />
              Esporta dati
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Printer className="h-4 w-4" />
              Genera PDF
            </button>
          </div>
        </div>
      </header>

      <div
        ref={printRef}
        className="container mx-auto px-4 py-10 print:max-w-none print:px-0 print:py-0"
      >
        <section className="border border-border bg-card/25 p-6 print:border-0 print:bg-white print:text-black">
          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-primary print:text-black">
                WALLTECH PROPERTY DECISION DOSSIER™
              </p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                Decision Dossier
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground print:text-black">
                Opportunity Record, evidence disponibile, missing data,
                rischi, scenari economici e Decision Gate in un unico
                output verificabile.
              </p>
            </div>

            <aside className="border border-border bg-background/70 p-5 print:bg-white">
              <p className="text-xs text-muted-foreground print:text-black">
                CODICE OPPORTUNITÀ
              </p>
              <p className="mt-2 text-lg font-bold">
                {opportunity.opportunityId}
              </p>
              <p className="mt-4 text-xs text-muted-foreground print:text-black">
                DECISION GATE
              </p>
              <p className="mt-2 font-bold text-primary print:text-black">
                {decisionLabel(analysis.decision)}
              </p>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Punteggio Opportunità", score(analysis.opportunityScore)],
              ["Punteggio Rischio", score(analysis.riskScore)],
              ["Completezza", `${analysis.completeness}%`],
              [
                "Copertura valutazione rischio",
                `${analysis.riskCoverage}%`,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border border-border bg-background/70 p-5 print:bg-white"
              >
                <p className="text-xs text-muted-foreground print:text-black">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <article className="border border-border bg-card/25 p-6 print:bg-white print:text-black">
            <h2 className="text-2xl font-bold">
              Sintesi dell'opportunità
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                ["Titolo", opportunity.title],
                [
                  "Località",
                  [asset.city?.value, asset.province?.value]
                    .filter(Boolean)
                    .join(", ") || "DATO MANCANTE",
                ],
                [
                  "Indirizzo",
                  asset.address?.value ?? "DATO MANCANTE",
                ],
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
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground print:text-black">
                    {label}
                  </p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-border bg-card/25 p-6 print:bg-white print:text-black">
            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5 text-primary print:text-black" />
              <h2 className="text-2xl font-bold">
                Scenario economico
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {[
                [
                  "Prezzo acquisto ipotizzato",
                  euro(opportunity.assumptions.targetPurchasePrice),
                ],
                [
                  "Capitale richiesto",
                  euro(flipScenario?.totalCapitalRequired ?? null),
                ],
                [
                  "Valore di uscita",
                  euro(opportunity.assumptions.expectedSalePrice),
                ],
                [
                  "Margine lordo",
                  euro(flipScenario?.grossMargin ?? null),
                ],
                [
                  "ROI",
                  flipScenario?.roiPercent === null ||
                  flipScenario?.roiPercent === undefined
                    ? "DATO MANCANTE"
                    : `${flipScenario.roiPercent}%`,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-border pb-3"
                >
                  <span className="text-sm text-muted-foreground print:text-black">
                    {label}
                  </span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 border border-border bg-card/25 p-6 print:bg-white print:text-black">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-primary print:text-black" />
            <h2 className="text-2xl font-bold">
              Stato documentale
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {opportunity.availableDocuments.map((document) => (
              <div
                key={`available-${document}`}
                className="border border-border bg-background/70 p-4 print:bg-white"
              >
                <p className="font-semibold">{document}</p>
                <p className="mt-2 text-xs text-muted-foreground print:text-black">
                  DISPONIBILE
                </p>
              </div>
            ))}

            {opportunity.missingDocuments.map((document) => (
              <div
                key={`missing-${document}`}
                className="border border-border bg-background/70 p-4 print:bg-white"
              >
                <p className="font-semibold">{document}</p>
                <p className="mt-2 text-xs text-muted-foreground print:text-black">
                  MANCANTE
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <article className="border border-border bg-card/25 p-6 print:bg-white print:text-black">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary print:text-black" />
              <h2 className="text-2xl font-bold">
                Decision Gate
              </h2>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {decisionLabel(analysis.decision)}
            </p>

            <p className="mt-4 text-sm leading-7 text-muted-foreground print:text-black">
              {analysis.decisionReason}
            </p>
          </article>

          <article className="border border-border bg-card/25 p-6 print:bg-white print:text-black">
            <h2 className="text-2xl font-bold">
              Verifiche successive
            </h2>

            {analysis.requiredNextChecks.length ? (
              <ul className="mt-5 space-y-3 text-sm leading-6">
                {analysis.requiredNextChecks.map((check) => (
                  <li key={check}>• {check}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground print:text-black">
                Nessuna verifica successiva registrata.
              </p>
            )}
          </article>
        </section>

        <section className="mt-8 border border-border bg-card/25 p-6 print:bg-white print:text-black">
          <h2 className="text-2xl font-bold">
            Scenari disponibili
          </h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {analysis.scenarios.map((scenario) => (
              <div
                key={scenario.name}
                className="border border-border bg-background/70 p-5 print:bg-white"
              >
                <p className="font-semibold">
                  {scenarioLabel(scenario.name)}
                </p>
                <p className="mt-3 text-sm">
                  Completezza: {scenario.completeness}%
                </p>
                <p className="mt-2 text-sm">
                  Capitale: {euro(scenario.totalCapitalRequired)}
                </p>
                <p className="mt-2 text-sm">
                  ROI:{" "}
                  {scenario.roiPercent === null
                    ? "DATO MANCANTE"
                    : `${scenario.roiPercent}%`}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 border border-border bg-card/25 p-6 print:bg-white print:text-black">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-0.5 h-6 w-6 text-primary print:text-black" />
            <div>
              <h2 className="font-semibold">
                Disclaimer professionale
              </h2>
              <p className="mt-3 text-xs leading-6 text-muted-foreground print:text-black">
                Il presente dossier ha natura informativa,
                organizzativa e di supporto decisionale. Walltech
                Group OÜ non svolge attività riservate ai
                professionisti iscritti ad albi o registri. Le
                attività legali, fiscali, notarili, tecniche,
                estimative, urbanistiche e professionali sono svolte
                esclusivamente dai professionisti abilitati incaricati
                dalle parti.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
