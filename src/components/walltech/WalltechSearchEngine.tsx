import { useState } from "react";
import { ArrowRight, FileSearch, ShieldCheck } from "lucide-react";
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

export interface SearchFilters {
  area: string;
  assetType: string;
  maxBudget: string;
  occupancy: string;
  procedure: string;
}

const DEFAULTS: SearchFilters = {
  area: "",
  assetType: "all",
  maxBudget: "all",
  occupancy: "all",
  procedure: "all",
};

export function WalltechSearchEngine({
  onFiltersChange,
}: {
  onFiltersChange?: (filters: SearchFilters) => void;
}) {
  const { ref, visible } = useReveal<HTMLElement>();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULTS);

  const update = (next: SearchFilters) => {
    setFilters(next);
    onFiltersChange?.(next);
  };

  const set = (key: keyof SearchFilters, value: string) =>
    update({ ...filters, [key]: value });

  return (
    <section
      ref={ref}
      id="opportunity-intake"
      className="border-b border-border bg-surface/30"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <p
          className={`mono-label reveal ${
            visible ? "reveal-in" : ""
          } text-primary`}
        >
          OPPORTUNITY INTAKE
        </p>

        <h2
          className={`reveal ${
            visible ? "reveal-in" : ""
          } mt-3 text-2xl font-bold md:text-3xl`}
          style={{ transitionDelay: "80ms" }}
        >
          Definisci il contesto dell'opportunità da analizzare.
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          Questi dati servono a qualificare il caso e preparare la verifica
          delle fonti. Non vengono generati valori di mercato, ROI o score in
          assenza di evidence verificabile.
        </p>

        <div className="surface-panel mt-8 rounded-sm p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="min-w-0">
              <Label className="mono-label text-muted-foreground">
                Comune / Provincia
              </Label>
              <Input
                className="mt-2"
                value={filters.area}
                maxLength={80}
                placeholder="Milano, MI"
                onChange={(e) => set("area", e.target.value)}
              />
            </div>

            <div className="min-w-0">
              <Label className="mono-label text-muted-foreground">
                Tipologia Asset
              </Label>
              <Select
                value={filters.assetType}
                onValueChange={(value) => set("assetType", value)}
              >
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
              <Label className="mono-label text-muted-foreground">
                Budget massimo
              </Label>
              <Select
                value={filters.maxBudget}
                onValueChange={(value) => set("maxBudget", value)}
              >
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
              <Label className="mono-label text-muted-foreground">
                Stato occupazione
              </Label>
              <Select
                value={filters.occupancy}
                onValueChange={(value) => set("occupancy", value)}
              >
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
              <Label className="mono-label text-muted-foreground">
                Procedura
              </Label>
              <Select
                value={filters.procedure}
                onValueChange={(value) => set("procedure", value)}
              >
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
            <Button asChild variant="signal">
              <a href="/assessment">
                <FileSearch className="size-4" />
                Avvia Assessment
                <ArrowRight className="size-4" />
              </a>
            </Button>

            <Button variant="quiet" size="sm" onClick={() => update(DEFAULTS)}>
              Azzera dati
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-border bg-background/70 p-5">
            <FileSearch className="size-5 text-primary" />
            <h3 className="mt-4 font-semibold text-foreground">
              Prima il contesto
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Localizzazione, tipologia, procedura e stato conosciuto vengono
              trattati come input dichiarati finché non sono supportati da una
              fonte verificabile.
            </p>
          </div>

          <div className="border border-border bg-background/70 p-5">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="mt-4 font-semibold text-foreground">
              Poi la provenance
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              L'Engine distingue sempre dati dichiarati, evidence verificata,
              assunzioni, missing data e contraddizioni prima del Decision Gate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
