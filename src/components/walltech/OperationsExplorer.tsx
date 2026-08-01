import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, Radio, RotateCcw, Search } from "lucide-react";
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
import { COUNTRY_LABEL, OPERATIONS, TYPE_LABEL, type Operation } from "@/data/operations";

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const DEFAULTS = { q: "", country: "all", type: "all", budget: "all", occupancy: "all" };

function OperationCard({ op, onDossier }: { op: Operation; onDossier: () => void }) {
  return (
    <article className="surface-panel flex flex-col rounded-sm p-5 transition-colors hover:border-primary/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono-label text-primary">{op.rge}</p>
          <h3 className="mt-2 text-base leading-snug font-semibold">{op.title}</h3>
        </div>
        <span className="mono-label rounded-sm border border-border px-2 py-1 text-muted-foreground">
          Risk {op.riskScore}
        </span>
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-3.5" /> {op.city} · {op.cap} · {COUNTRY_LABEL[op.country]}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border text-sm">
        <div className="bg-background px-3 py-2.5">
          <dt className="mono-label text-muted-foreground">Offerta minima</dt>
          <dd className="mt-1 font-display font-bold">{euro.format(op.basePrice)}</dd>
        </div>
        <div className="bg-background px-3 py-2.5">
          <dt className="mono-label text-muted-foreground">Valore di mercato</dt>
          <dd className="mt-1 font-display font-bold">{euro.format(op.marketValue)}</dd>
        </div>
        <div className="bg-background px-3 py-2.5">
          <dt className="mono-label text-muted-foreground">ROI netto stimato</dt>
          <dd className="mt-1 font-display font-bold text-success">{op.roi.toFixed(1)}%</dd>
        </div>
        <div className="bg-background px-3 py-2.5">
          <dt className="mono-label text-muted-foreground">Stato</dt>
          <dd className="mt-1 font-display font-bold capitalize">{op.occupancy}</dd>
        </div>
      </dl>

      <p className="mt-4 flex-1 text-xs leading-relaxed text-muted-foreground">{op.notes}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="mono-label text-muted-foreground">
          {TYPE_LABEL[op.type]} · {op.surface} m² · {op.auctionDate}
        </span>
        <Button variant="signal" size="sm" onClick={onDossier}>
          Dossier
        </Button>
      </div>
    </article>
  );
}

export function OperationsExplorer({ onDossier }: { onDossier: () => void }) {
  const [filters, setFilters] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [filters]);

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return OPERATIONS.filter((op) => {
      if (
        q &&
        !`${op.city} ${op.cap} ${op.rge} ${op.title}`.toLowerCase().includes(q)
      )
        return false;
      if (filters.country !== "all" && op.country !== filters.country) return false;
      if (filters.type !== "all" && op.type !== filters.type) return false;
      if (filters.budget !== "all" && op.basePrice > Number(filters.budget)) return false;
      if (filters.occupancy !== "all" && op.occupancy !== filters.occupancy) return false;
      return true;
    });
  }, [filters]);

  const set = (k: keyof typeof DEFAULTS, v: string) => setFilters((f) => ({ ...f, [k]: v }));

  return (
    <section id="operazioni" className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label text-primary">Ricerca avanzata &amp; filtri operazioni</p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">Pipeline pre-asta e giurisdizionale</h2>
          </div>
          <p className="mono-label inline-flex items-center gap-2 rounded-sm border border-success/40 px-3 py-1.5 text-success">
            <Radio className="size-3.5" /> Sotto-sistema Ingestion: Attivo (PVP &amp; Portali Aste)
          </p>
        </div>

        <div className="surface-panel mt-8 rounded-sm p-5">
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <Label className="mono-label text-muted-foreground">Città, CAP o R.G.E.</Label>
              <div className="relative mt-2">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filters.q}
                  onChange={(e) => set("q", e.target.value.slice(0, 80))}
                  placeholder="Milano, 20144, 418/2024"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label className="mono-label text-muted-foreground">Mercato Europeo</Label>
              <Select value={filters.country} onValueChange={(v) => set("country", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i Paesi (UE)</SelectItem>
                  <SelectItem value="IT">Italia (IT)</SelectItem>
                  <SelectItem value="ES">Spagna (ES)</SelectItem>
                  <SelectItem value="DE">Germania (DE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mono-label text-muted-foreground">Tipologia Asset</Label>
              <Select value={filters.type} onValueChange={(v) => set("type", v)}>
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

            <div>
              <Label className="mono-label text-muted-foreground">Offerta Min. Max (€)</Label>
              <Select value={filters.budget} onValueChange={(v) => set("budget", v)}>
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

            <div>
              <Label className="mono-label text-muted-foreground">Stato Occupazione</Label>
              <Select value={filters.occupancy} onValueChange={(v) => set("occupancy", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="libero">Solo Immobili Liberi</SelectItem>
                  <SelectItem value="occupato">Occupati / Da Liberare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button variant="quiet" size="sm" onClick={() => setFilters(DEFAULTS)}>
              <RotateCcw className="size-3.5" /> Azzera tutti i filtri
            </Button>
            <span className="mono-label inline-flex items-center gap-2 text-muted-foreground">
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Caricamento…
                </>
              ) : (
                `${results.length} operazioni in pipeline`
              )}
            </span>
          </div>
        </div>

        {!loading && results.length === 0 ? (
          <div className="surface-panel mt-8 rounded-sm px-6 py-16 text-center">
            <h3 className="text-lg font-semibold">Nessuna operazione trovata</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Prova a modificare i parametri di ricerca o ad azzerare i filtri.
            </p>
            <Button variant="signal" className="mt-6" onClick={() => setFilters(DEFAULTS)}>
              Mostra Tutte le Operazioni
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((op) => (
              <OperationCard key={op.id} op={op} onDossier={onDossier} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
