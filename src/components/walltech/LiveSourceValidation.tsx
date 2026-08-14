import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileWarning,
  Loader2,
  SearchCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import { ADAPTER_REGISTRY } from "@/lib/adapters/registry";
import type {
  ConnectionStatus,
  ConnectionTestResult,
  HandoffFilters,
} from "@/lib/adapters/types";

const PUBLIC_ADAPTERS = ADAPTER_REGISTRY.filter((adapter) => adapter.id !== "custom");

const STATUS_CLASS: Record<ConnectionStatus, string> = {
  "NOT TESTED": "border-border text-muted-foreground",
  CONNECTING: "border-primary/40 text-primary",
  CONNECTED: "border-success/40 text-success",
  "SOURCE REACHABLE": "border-success/40 text-success",
  "PENDING AGREEMENT": "border-primary/40 text-primary",
  ERROR: "border-destructive/40 text-destructive",
};

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  "NOT TESTED": "NON VERIFICATA",
  CONNECTING: "VERIFICA IN CORSO",
  CONNECTED: "CONNESSA",
  "SOURCE REACHABLE": "FONTE RAGGIUNGIBILE",
  "PENDING AGREEMENT": "IN ATTESA DI INTEGRAZIONE",
  ERROR: "ERRORE DI VERIFICA",
};

function DataCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border bg-background/70 p-4">
      <p className="mono-label text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-sm text-foreground">{value}</p>
    </div>
  );
}

export function LiveSourceValidation({
  filters,
}: {
  filters: HandoffFilters;
}) {
  const { ref, visible } = useReveal<HTMLElement>();
  const [selectedId, setSelectedId] = useState(PUBLIC_ADAPTERS[0]!.id);
  const [status, setStatus] = useState<ConnectionStatus>("NOT TESTED");
  const [result, setResult] = useState<ConnectionTestResult | null>(null);

  const adapter = useMemo(
    () =>
      PUBLIC_ADAPTERS.find((item) => item.id === selectedId) ??
      PUBLIC_ADAPTERS[0]!,
    [selectedId],
  );

  const handoff =
    result && status !== "ERROR"
      ? adapter.buildSearchRequest(filters)
      : null;

  const select = (id: string) => {
    setSelectedId(id);
    setStatus("NOT TESTED");
    setResult(null);
  };

  const test = async () => {
    setStatus("CONNECTING");
    setResult(null);

    try {
      const response = await adapter.testConnection();
      adapter.status = response.status;
      setStatus(response.status);
      setResult(response);
    } catch (error) {
      const response: ConnectionTestResult = {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        sourceUrl: "—",
        connectionType: "Not available",
        mode: "PUBLIC REACHABILITY",
        note:
          error instanceof Error
            ? error.message
            : "Verifica della fonte non riuscita.",
      };

      setStatus("ERROR");
      setResult(response);
    }
  };

  const handoffQuery = handoff
    ? Object.entries(handoff.params)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" · ")
    : "";

  return (
    <section
      ref={ref}
      id="source-provenance"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <p
          className={`mono-label reveal ${
            visible ? "reveal-in" : ""
          } text-primary`}
        >
          SOURCE & PROVENANCE
        </p>

        <h2
          className={`reveal ${
            visible ? "reveal-in" : ""
          } mt-3 text-2xl font-bold md:text-3xl`}
          style={{ transitionDelay: "80ms" }}
        >
          Verifica la fonte prima di usare il dato.
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          L'Engine distingue la raggiungibilità tecnica di una fonte dalla
          disponibilità effettiva dei suoi dati. Una fonte raggiungibile non
          significa che annunci o documenti siano stati acquisiti, letti o
          verificati.
        </p>

        <div className="surface-panel mt-8 rounded-sm p-5">
          <p className="mono-label text-muted-foreground">
            FONTI DISPONIBILI
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {PUBLIC_ADAPTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => select(item.id)}
                className={`mono-label rounded-sm border px-3 py-2 transition-colors ${
                  item.id === selectedId
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              variant="signal"
              onClick={test}
              disabled={status === "CONNECTING"}
            >
              {status === "CONNECTING" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SearchCheck className="size-4" />
              )}
              Verifica fonte
            </Button>

            <span
              className={`mono-label shrink-0 rounded-sm border px-2 py-1 ${STATUS_CLASS[status]}`}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <DataCard
              label="STATO"
              value={STATUS_LABEL[status]}
            />
            <DataCard
              label="MODALITÀ"
              value={result?.mode ?? "Non ancora verificata"}
            />
            <DataCard
              label="ULTIMA VERIFICA"
              value={
                result
                  ? new Date(result.timestamp).toLocaleString("it-IT")
                  : "—"
              }
            />
            <DataCard
              label="FONTE"
              value={result?.sourceUrl ?? adapter.name}
            />
          </div>

          {result?.note ? (
            <div className="mt-4 flex gap-3 border border-border bg-background/70 p-4">
              {status === "SOURCE REACHABLE" ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
              ) : (
                <FileWarning className="mt-0.5 size-5 shrink-0 text-primary" />
              )}
              <p className="text-sm leading-6 text-muted-foreground">
                {result.note}
              </p>
            </div>
          ) : null}
        </div>

        {result ? (
          <div className="surface-panel mt-4 rounded-sm p-5">
            {handoff ? (
              <>
                <p className="mono-label text-primary">
                  CONTINUA SULLA FONTE UFFICIALE
                </p>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  I parametri dichiarati nell'Opportunity Intake vengono
                  riportati come riferimento per proseguire la ricerca sulla
                  fonte ufficiale:{" "}
                  <span className="text-foreground">
                    {handoffQuery || "nessun parametro specifico impostato"}
                  </span>
                  .
                </p>

                <Button
                  asChild
                  variant="signal"
                  className="mt-5 w-full sm:w-auto"
                >
                  <a
                    href={handoff.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {handoff.label}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </>
            ) : (
              <>
                <p className="mono-label text-primary">
                  FONTE NON ANCORA INTEGRATA
                </p>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Questa sorgente non viene utilizzata dall'Engine fino
                  all'attivazione di un accesso o accordo tecnico autorizzato.
                  Nessun risultato viene simulato.
                </p>
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
