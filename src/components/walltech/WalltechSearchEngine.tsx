import { useMemo, useState } from "react";
import { Gauge, Loader2, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReveal } from "@/hooks/use-reveal";

/* ------------------------- Adapter interface layer ------------------------ */

export type AdapterStatus = "READY" | "PENDING AGREEMENT";

export interface SearchFilters {
  area: string;
  assetType: string;
  maxBudget: string;
  occupancy: string;
  procedure: string;
}

export interface WalltechListing {
  id: string;
  source: string;
  title: string;
  area: string;
  assetType: string;
  basePrice: number;
  marketValue: number;
  occupancy: string;
  procedure: string;
}

export interface SourceAdapter {
  id: string;
  label: string;
  status: AdapterStatus;
  fetch(filters: SearchFilters): Promise<WalltechListing[]>;
}

/* ------------------------------- Demo data -------------------------------- */

const DEMO: WalltechListing[] = [
  {
    id: "pvp-1",
    source: "pvp",
    title: "Trilocale con cantina",
    area: "Milano (MI)",
    assetType: "residenziale",
    basePrice: 148000,
    marketValue: 246000,
    occupancy: "libero",
    procedure: "esecuzione",
  },
  {
    id: "pvp-2",
    source: "pvp",
    title: "Negozio fronte strada",
    area: "Bologna (BO)",
    assetType: "commerciale",
    basePrice: 92000,
    marketValue: 151000,
    occupancy: "occupato",
    procedure: "fallimentare",
  },
  {
    id: "ila-1",
    source: "immobiliallasta",
    title: "Villetta con giardino",
    area: "Verona (VR)",
    assetType: "residenziale",
    basePrice: 236000,
    marketValue: 358000,
    occupancy: "occupato",
    procedure: "esecuzione",
  },
  {
    id: "api-1",
    source: "custom",
    title: "Capannone logistico",
    area: "Padova (PD)",
    assetType: "industriale",
    basePrice: 284000,
    marketValue: 465000,
    occupancy: "libero",
    procedure: "pre-asta",
  },
  {
    id: "api-2",
    source: "custom",
    title: "Ufficio direzionale",
    area: "Torino (TO)",
    assetType: "commerciale",
    basePrice: 118000,
    marketValue: 179000,
    occupancy: "libero",
    procedure: "pre-asta",
  },
];

function matches(l: WalltechListing, f: SearchFilters) {
  const q = f.area.trim().toLowerCase();
  if (q && !l.area.toLowerCase().includes(q)) return false;
  if (f.assetType !== "all" && l.assetType !== f.assetType) return false;
  if (f.maxBudget !== "all" && l.basePrice > Number(f.maxBudget)) return false;
  if (f.occupancy !== "all" && l.occupancy !== f.occupancy) return false;
  if (f.procedure !== "all" && l.procedure !== f.procedure) return false;
  return true;
}

function demoAdapter(id: string, label: string, status: AdapterStatus): SourceAdapter {
  return {
    id,
    label,
    status,
    async fetch(filters) {
      if (status !== "READY") return [];
      return DEMO.filter((l) => l.source === id && matches(l, filters));
    },
  };
}

export const ADAPTERS: SourceAdapter[] = [
  demoAdapter("pvp", "PVP", "READY"),
  demoAdapter("astalegale", "Astalegale", "PENDING AGREEMENT"),
  demoAdapter("abilio", "Abilio / Quimmo", "PENDING AGREEMENT"),
  demoAdapter("immobiliallasta", "Immobiliallasta", "READY"),
  demoAdapter("custom", "Custom API", "READY"),
];

/* --------------------------------- Scoring -------------------------------- */

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function scoreOf(l: WalltechListing) {
  const spread = (l.marketValue - l.basePrice) / l.marketValue; // 0..1
  let s = spread * 130;
  if (l.occupancy === "libero") s += 12;
  if (l.procedure === "pre-asta") s += 8;
  return Math.max(0, Math.min(100, Math.round(s)));
}

/* -------------------------------- Component -------------------------------- */

const DEFAULTS: SearchFilters = {
  area: "",
  assetType: "all",
  maxBudget: "all",
  occupancy: "all",
  procedure: "all",
};

type Outcome = { counts: Record<string, number>; listings: WalltechListing[] };

export function WalltechSearchEngine({ onDossier }: { onDossier: () => void }) {
  const { ref, visible } = useReveal<HTMLElement>();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const set = (k: keyof SearchFilters, v: string) => setFilters((f) => ({ ...f, [k]: v }));

  const analyze = async () => {
    setLoading(true);
    const results = await Promise.all(
      ADAPTERS.map(async (a) => [a.id, await a.fetch(filters)] as const),
    );
    await new Promise((r) => setTimeout(r, 450));
    const counts: Record<string, number> = {};
    const listings: WalltechListing[] = [];
    for (const [id, rows] of results) {
      counts[id] = rows.length;
      listings.push(...rows);
    }
    listings.sort((a, b) => scoreOf(b) - scoreOf(a));
    setOutcome({ counts, listings });
    setLoading(false);
  };

  const avgScore = useMemo(() => {
    if (!outcome || outcome.listings.length === 0) return 0;
    return Math.round(
      outcome.listings.reduce((sum, l) => sum + scoreOf(l), 0) / outcome.listings.length,
    );
  }, [outcome]);

  return (
    <section ref={ref} id="search-engine" className="border-b border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <p className={`mono-label reveal ${visible ? "reveal-in" : ""} text-primary`}>
          Walltech Search Engine
        </p>
        <h2
          className={`reveal ${visible ? "reveal-in" : ""} mt-3 text-2xl font-bold md:text-3xl`}
          style={{ transitionDelay: "80ms" }}
        >
          Analisi multi-sorgente delle opportunità
        </h2>

        <div className="surface-panel mt-8 rounded-sm p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="min-w-0">
              <Label className="mono-label text-muted-foreground">Comune / Provincia</Label>
              <Input
                className="mt-2"
                value={filters.area}
                maxLength={80}
                placeholder="Milano, MI"
                onChange={(e) => set("area", e.target.value)}
              />
            </div>

            <div className="min-w-0">
              <Label className="mono-label text-muted-foreground">Tipologia Asset</Label>
              <Select value={filters.assetType} onValueChange={(v) => set("assetType", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le Tipologie</SelectItem>
                  <SelectItem value="residenziale">Residenziale</SelectItem>
                  <SelectItem value="commerciale">Commerciale / Uffici</SelectItem>
                  <SelectItem value="industriale">Industriale / Logistica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Label className="mono-label text-muted-foreground">Budget massimo</Label>
              <Select value={filters.maxBudget} onValueChange={(v) => set("maxBudget", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualsiasi Budget</SelectItem>
                  <SelectItem value="100000">Fino a 100.000 €</SelectItem>
                  <SelectItem value="200000">Fino a 200.000 €</SelectItem>
                  <SelectItem value="300000">Fino a 300.000 €</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Label className="mono-label text-muted-foreground">Stato occupazione</Label>
              <Select value={filters.occupancy} onValueChange={(v) => set("occupancy", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="libero">Libero</SelectItem>
                  <SelectItem value="occupato">Occupato / Da liberare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Label className="mono-label text-muted-foreground">Procedura</Label>
              <Select value={filters.procedure} onValueChange={(v) => set("procedure", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le procedure</SelectItem>
                  <SelectItem value="esecuzione">Esecuzione immobiliare</SelectItem>
                  <SelectItem value="fallimentare">Liquidazione giudiziale</SelectItem>
                  <SelectItem value="pre-asta">Pre-asta / Stragiudiziale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button variant="signal" onClick={analyze} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Radar className="size-4" />}
              Analizza opportunità
            </Button>
            <Button variant="quiet" size="sm" onClick={() => setFilters(DEFAULTS)}>
              Azzera filtri
            </Button>
          </div>
        </div>

        {outcome ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            {/* Adapter Manager */}
            <div className="surface-panel rounded-sm p-5">
              <p className="mono-label text-primary">Adapter Manager</p>
              <ul className="mt-4 space-y-2">
                {ADAPTERS.map((a) => {
                  const ready = a.status === "READY";
                  return (
                    <li
                      key={a.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-border bg-background px-3 py-2.5"
                    >
                      <span className="min-w-0 truncate text-sm font-medium">
                        {a.label}
                        {ready ? (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {outcome.counts[a.id] ?? 0} risultati
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`mono-label shrink-0 rounded-sm border px-2 py-1 ${
                          ready
                            ? "border-success/40 text-success"
                            : "border-primary/40 text-primary"
                        }`}
                      >
                        {a.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Prima Analisi Walltech */}
            <div className="surface-panel rounded-sm p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <p className="mono-label text-primary">Prima Analisi Walltech</p>
                  <h3 className="mt-2 text-lg font-semibold">
                    {outcome.listings.length} opportunità aggregate
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <p className="mono-label text-muted-foreground">Opportunity Score</p>
                  <p className="font-display text-3xl font-bold tabular-nums text-success">
                    <Gauge className="mr-1 inline size-5 text-primary" />
                    {avgScore}
                  </p>
                </div>
              </div>

              {outcome.listings.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">
                  Nessuna opportunità con questi parametri. Modifica i filtri e rilancia l'analisi.
                </p>
              ) : (
                <ul className="mt-5 space-y-2">
                  {outcome.listings.slice(0, 4).map((l) => (
                    <li
                      key={l.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-border bg-background px-3 py-2.5"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{l.title}</span>
                        <span className="mono-label text-muted-foreground">
                          {l.area} · {euro.format(l.basePrice)} / {euro.format(l.marketValue)}
                        </span>
                      </span>
                      <span className="mono-label shrink-0 rounded-sm border border-border px-2 py-1 tabular-nums text-success">
                        {scoreOf(l)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Button variant="signal" className="mt-6 w-full sm:w-auto" onClick={onDossier}>
                Richiedi Dossier Integrato
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
