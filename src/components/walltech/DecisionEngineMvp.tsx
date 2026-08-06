import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { runDecisionEngine } from "@/lib/walltech/decisionEngine";
import type { DecisionInput } from "@/lib/walltech/decisionTypes";

const initialInput: DecisionInput = {
  opportunityScore: 72,
  riskScore: 38,
  documentsComplete: true,
  ownerAssigned: true,
  nextActionDefined: true,
  deadlineDefined: true,
  evidenceAvailable: false,
  feeDefined: true,
  feeProtected: false,
  buyerAvailable: false,
  urgencyHigh: false,
};

function BooleanField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 border border-border bg-background/70 p-4">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />
    </label>
  );
}

export function DecisionEngineMvp() {
  const [input, setInput] = useState<DecisionInput>(initialInput);
  const output = useMemo(() => runDecisionEngine(input), [input]);

  const update = <K extends keyof DecisionInput>(
    key: K,
    value: DecisionInput[K],
  ) => setInput((current) => ({ ...current, [key]: value }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
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
              Decision Engine · MVP
            </p>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            DECISION ENGINE
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Trasforma stato operativo e prerequisiti in una decisione eseguibile.
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto grid gap-8 px-4 xl:grid-cols-[1fr_0.9fr]">
          <section className="border border-border bg-card/30 p-6">
            <h2 className="text-xl font-bold">Input operazione</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted-foreground">
                  OPPORTUNITY SCORE
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={input.opportunityScore}
                  onChange={(event) =>
                    update("opportunityScore", Number(event.target.value))
                  }
                  className="w-full border border-border bg-background px-4 py-3"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted-foreground">
                  RISK SCORE
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={input.riskScore}
                  onChange={(event) =>
                    update("riskScore", Number(event.target.value))
                  }
                  className="w-full border border-border bg-background px-4 py-3"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <BooleanField
                label="Documentazione completa"
                checked={input.documentsComplete}
                onChange={(value) => update("documentsComplete", value)}
              />
              <BooleanField
                label="Owner assegnato"
                checked={input.ownerAssigned}
                onChange={(value) => update("ownerAssigned", value)}
              />
              <BooleanField
                label="Next action definita"
                checked={input.nextActionDefined}
                onChange={(value) => update("nextActionDefined", value)}
              />
              <BooleanField
                label="Deadline definita"
                checked={input.deadlineDefined}
                onChange={(value) => update("deadlineDefined", value)}
              />
              <BooleanField
                label="Evidence disponibile"
                checked={input.evidenceAvailable}
                onChange={(value) => update("evidenceAvailable", value)}
              />
              <BooleanField
                label="Fee definita"
                checked={input.feeDefined}
                onChange={(value) => update("feeDefined", value)}
              />
              <BooleanField
                label="Fee protetta"
                checked={input.feeProtected}
                onChange={(value) => update("feeProtected", value)}
              />
              <BooleanField
                label="Buyer / controparte disponibile"
                checked={input.buyerAvailable}
                onChange={(value) => update("buyerAvailable", value)}
              />
              <BooleanField
                label="Urgenza alta"
                checked={input.urgencyHigh}
                onChange={(value) => update("urgencyHigh", value)}
              />
            </div>
          </section>

          <aside className="border border-border bg-card/30 p-6 xl:sticky xl:top-6 xl:h-fit">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                  ENGINE OUTPUT
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  Decisione operativa
                </h2>
              </div>
              <Gauge className="h-6 w-6 text-primary" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Condition</p>
                <p className="mt-2 font-bold">{output.condition}</p>
              </div>
              <div className="border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Readiness</p>
                <p className="mt-2 font-bold">{output.readiness}</p>
              </div>
              <div className="border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Priority</p>
                <p className="mt-2 font-bold">{output.priority}</p>
              </div>
            </div>

            <div className="mt-5 border border-primary/30 bg-primary/[0.04] p-4">
              <div className="flex items-start gap-3">
                {output.readyForClosing ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                ) : output.condition === "DANGER" ? (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-primary" />
                ) : (
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                )}

                <div>
                  <p className="font-semibold">Next Action</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {output.nextAction}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Owner</p>
                <p className="mt-2 font-semibold">{output.owner}</p>
              </div>
              <div className="border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="mt-2 font-semibold">{output.deadline}</p>
              </div>
              <div className="border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Evidence richiesta</p>
                <p className="mt-2 text-sm leading-6">
                  {output.evidenceRequired}
                </p>
              </div>
            </div>

            <div className="mt-5 border border-border bg-background/70 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary">
                WARNINGS
              </p>
              {output.warnings.length ? (
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {output.warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nessun warning operativo.
                </p>
              )}
            </div>

            <a
              href="/dossier"
              className="mt-6 inline-flex w-full items-center justify-center bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Apri il dossier
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
