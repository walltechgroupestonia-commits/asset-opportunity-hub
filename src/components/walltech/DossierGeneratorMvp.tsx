import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Download,
  FileCheck2,
  FileText,
  Gauge,
  Printer,
  ShieldCheck,
} from "lucide-react";
import {
  calculateDossierMetrics,
  dossierCompletion,
} from "@/lib/walltech/dossierEngine";
import type { DossierData } from "@/lib/walltech/dossierTypes";
import { imperia1312024 } from "@/data/imperia1312024";
import { analyzePropertyOpportunity } from "@/lib/walltech/propertyIntelligenceEngine";

const propertyAnalysis = analyzePropertyOpportunity(imperia1312024);

const initialData: DossierData = {
  operationCode: imperia1312024.opportunityId,
  title: imperia1312024.title,
  location: `${imperia1312024.asset.city.value}, ${imperia1312024.asset.province.value}`,
  assetType: imperia1312024.asset.propertyType.value ?? "DATO MANCANTE",
  estimatedValue: null,
  acquisitionCost: imperia1312024.assumptions.targetPurchasePrice,
  operatingCosts: null,
  exitValue: imperia1312024.assumptions.expectedSalePrice,
  opportunityScore: propertyAnalysis.opportunityScore,
  riskScore: propertyAnalysis.riskScore,
  condition: "DA ASSEGNARE",
  readiness: propertyAnalysis.decision,
  priority: propertyAnalysis.riskScore >= 85 ? "CRITICAL" : "REVIEW",
  owner: "Walltech Property Team",
  deadline: imperia1312024.procedure.offerDeadline.value ?? "DATO MANCANTE",
  nextAction: propertyAnalysis.requiredNextChecks[0] ?? "NESSUNA AZIONE DISPONIBILE",
  evidenceRequired: imperia1312024.missingDocuments.join("; "),
  documents: [
    ...imperia1312024.availableDocuments.map((label) => ({
      label,
      status: "AVAILABLE" as const,
    })),
    ...imperia1312024.missingDocuments.map((label) => ({
      label,
      status: "MISSING" as const,
    })),
  ],
};

function euro(value: number | null) {
  if (value === null) return "DATO MANCANTE";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DossierGeneratorMvp() {
  const [data] = useState<DossierData>(initialData);
  const printRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(
    () => calculateDossierMetrics(data),
    [data],
  );

  const completion = useMemo(
    () => dossierCompletion(data),
    [data],
  );

  const printDossier = () => window.print();

  const downloadJson = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            dossier: data,
            metrics,
            completion,
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
    anchor.download = `${data.operationCode}-dossier.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 print:hidden">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna a Walltech
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
              onClick={printDossier}
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
                WALLTECH INTELLIGENCE ENGINE™
              </p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                Dossier operativo integrato
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground print:text-black">
                Executive summary, business case, stato documentale e decisione
                operativa dell'opportunità.
              </p>
            </div>

            <aside className="border border-border bg-background/70 p-5 print:bg-white">
              <p className="text-xs text-muted-foreground print:text-black">
                CODICE OPERAZIONE
              </p>
              <p className="mt-2 text-xl font-bold">{data.operationCode}</p>
              <p className="mt-4 text-sm text-muted-foreground print:text-black">
                Owner
              </p>
              <p className="mt-1 font-semibold">{data.owner}</p>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Opportunity Score", `${data.opportunityScore}/100`],
              ["Risk Score", `${data.riskScore}/100`],
              ["Readiness", data.readiness],
              ["Completezza dossier", `${completion}%`],
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
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary print:text-black" />
              <h2 className="text-2xl font-bold">Executive Summary</h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground print:text-black">
                  Operazione
                </p>
                <p className="mt-1 font-semibold">{data.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground print:text-black">
                  Località
                </p>
                <p className="mt-1 font-semibold">{data.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground print:text-black">
                  Asset
                </p>
                <p className="mt-1 font-semibold">{data.assetType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground print:text-black">
                  Valore stimato
                </p>
                <p className="mt-1 font-semibold">
                  {euro(data.estimatedValue)}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-sm leading-7 text-muted-foreground print:text-black">
                Il dossier aggrega dati preliminari, output dell'Assessment e
                output del Decision Engine per supportare la qualificazione
                operativa dell'opportunità.
              </p>
            </div>
          </article>

          <article className="border border-border bg-card/25 p-6 print:bg-white print:text-black">
            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5 text-primary print:text-black" />
              <h2 className="text-2xl font-bold">Business Case</h2>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["Acquisizione", euro(data.acquisitionCost)],
                ["Costi operativi", euro(data.operatingCosts)],
                ["Investimento totale", euro(metrics.totalInvestment)],
                ["Exit value", euro(data.exitValue)],
                ["Margine lordo", euro(metrics.grossMargin)],
                ["ROI indicativo", metrics.roi === null ? "DATO MANCANTE" : `${metrics.roi.toFixed(1)}%`],
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
            <h2 className="text-2xl font-bold">Document Status</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.documents.map((document) => (
              <div
                key={document.label}
                className="border border-border bg-background/70 p-4 print:bg-white"
              >
                <p className="font-semibold">{document.label}</p>
                <p className="mt-2 text-xs text-muted-foreground print:text-black">
                  {document.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <article className="border border-border bg-card/25 p-6 print:bg-white print:text-black">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary print:text-black" />
              <h2 className="text-2xl font-bold">Decision Output</h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["Condition", data.condition],
                ["Priority", data.priority],
                ["Deadline", data.deadline],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border border-border bg-background/70 p-4 print:bg-white"
                >
                  <p className="text-xs text-muted-foreground print:text-black">
                    {label}
                  </p>
                  <p className="mt-2 font-bold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-primary/30 bg-primary/[0.04] p-4 print:border-black print:bg-white">
              <p className="font-semibold">Next Action</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground print:text-black">
                {data.nextAction}
              </p>
            </div>
          </article>

          <article className="border border-border bg-card/25 p-6 print:bg-white print:text-black">
            <h2 className="text-2xl font-bold">Evidence richiesta</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground print:text-black">
              {data.evidenceRequired}
            </p>
          </article>
        </section>

        <section className="mt-8 border border-border bg-card/25 p-6 print:bg-white print:text-black">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-0.5 h-6 w-6 text-primary print:text-black" />
            <div>
              <h2 className="font-semibold">Disclaimer professionale</h2>
              <p className="mt-3 text-xs leading-6 text-muted-foreground print:text-black">
                Il presente dossier ha natura informativa, organizzativa e di
                supporto decisionale. Walltech Group OÜ non svolge attività
                riservate ai professionisti iscritti ad albi o registri. Le
                attività legali, fiscali, notarili, tecniche, estimative,
                urbanistiche e professionali sono svolte esclusivamente dai
                professionisti abilitati incaricati dalle parti.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
