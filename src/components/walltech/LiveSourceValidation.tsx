import { useMemo, useState } from "react";
import { ExternalLink, Loader2, PlugZap, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import { ADAPTER_REGISTRY } from "@/lib/adapters/registry";
import type { ConnectionStatus, ConnectionTestResult, HandoffFilters } from "@/lib/adapters/types";

const STATUS_CLASS: Record<ConnectionStatus, string> = {
  "NOT TESTED": "border-border text-muted-foreground",
  CONNECTING: "border-primary/40 text-primary",
  CONNECTED: "border-success/40 text-success",
  "SOURCE REACHABLE": "border-success/40 text-success",
  "PENDING AGREEMENT": "border-primary/40 text-primary",
  ERROR: "border-destructive/40 text-destructive",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-sm border border-border bg-background px-3 py-2.5">
      <p className="mono-label text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

export function LiveSourceValidation({ filters }: { filters: HandoffFilters }) {
  const { ref, visible } = useReveal<HTMLElement>();
  const [selectedId, setSelectedId] = useState(ADAPTER_REGISTRY[0]!.id);
  const [status, setStatus] = useState<ConnectionStatus>("NOT TESTED");
  const [result, setResult] = useState<ConnectionTestResult | null>(null);

  const adapter = useMemo(
    () => ADAPTER_REGISTRY.find((a) => a.id === selectedId) ?? ADAPTER_REGISTRY[0]!,
    [selectedId],
  );

  const handoff = result && status !== "ERROR" ? adapter.buildSearchRequest(filters) : null;

  const select = (id: string) => {
    setSelectedId(id);
    setStatus("NOT TESTED");
    setResult(null);
  };

  const test = async () => {
    setStatus("CONNECTING");
    setResult(null);
    try {
      const res = await adapter.testConnection();
      adapter.status = res.status;
      setStatus(res.status);
      setResult(res);
    } catch (error) {
      const res: ConnectionTestResult = {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        sourceUrl: "—",
        connectionType: "Not available",
        mode: "PUBLIC REACHABILITY",
        note: error instanceof Error ? error.message : "Test non riuscito",
      };
      setStatus("ERROR");
      setResult(res);
    }
  };

  const disconnect = () => {
    adapter.disconnect();
    setStatus("NOT TESTED");
    setResult(null);
  };

  const handoffQuery = handoff
    ? Object.entries(handoff.params)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · ")
    : "";

  return (
    <section ref={ref} id="live-source-validation" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <p className={`mono-label reveal ${visible ? "reveal-in" : ""} text-primary`}>
          Live Source Validation
        </p>
        <h2
          className={`reveal ${visible ? "reveal-in" : ""} mt-3 text-2xl font-bold md:text-3xl`}
          style={{ transitionDelay: "80ms" }}
        >
          Verifica tecnica della connessione alle sorgenti
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Test di raggiungibilità dell'endpoint pubblico della sorgente selezionata. Nessun annuncio
          viene letto, estratto o memorizzato: la ricerca prosegue sul portale ufficiale tramite
          Search Handoff.
        </p>

        <div className="surface-panel mt-8 rounded-sm p-5">
          <p className="mono-label text-muted-foreground">Adapter</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ADAPTER_REGISTRY.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => select(a.id)}
                className={`mono-label rounded-sm border px-3 py-2 transition-colors ${
                  a.id === selectedId
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="signal" onClick={test} disabled={status === "CONNECTING"}>
                {status === "CONNECTING" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <PlugZap className="size-4" />
                )}
                Testa connessione
              </Button>
              <Button variant="quiet" size="sm" onClick={disconnect} disabled={!result}>
                <Unplug className="size-4" />
                Disconnetti
              </Button>
            </div>
            <span
              className={`mono-label shrink-0 rounded-sm border px-2 py-1 ${STATUS_CLASS[status]}`}
            >
              {status}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Row label="HTTP status" value={result?.httpStatus ? String(result.httpStatus) : "—"} />
            <Row
              label="Latenza"
              value={result?.latencyMs !== undefined ? `${result.latencyMs} ms` : "—"}
            />
            <Row
              label="Timestamp"
              value={result ? new Date(result.timestamp).toLocaleString("it-IT") : "—"}
            />
            <Row label="URL verificato" value={result?.sourceUrl ?? "—"} />
          </div>

          <p className="mono-label mt-4 text-muted-foreground">
            Raggiungibilità verificata — nessun annuncio acquisito
          </p>

        </div>

        {result ? (
          <div className="surface-panel mt-4 rounded-sm p-5">
            <p className="mono-label text-primary">Search Handoff</p>
            {handoff ? (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Parametri trasferiti alla ricerca ufficiale:{" "}
                  <span className="text-foreground">
                    {handoffQuery || "nessun filtro impostato"}
                  </span>
                </p>
                <Button asChild variant="signal" className="mt-5 w-full sm:w-auto">
                  <a href={handoff.url} target="_blank" rel="noopener noreferrer">
                    {handoff.label}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Handoff non disponibile: la sorgente è in <strong>PENDING AGREEMENT</strong>. Verrà
                attivato al perfezionamento dell'accordo tecnico con il partner.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
