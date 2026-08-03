import { probePvp } from "./pvpAdapter.functions";
import type { ConnectionTestResult, HandoffFilters, SearchHandoff, SourceAdapter } from "./types";

const PVP_HOME = "https://pvp.giustizia.it/pvp/";
const PVP_SEARCH = "https://pvp.giustizia.it/pvp/it/ricerca.page";

const ASSET_LABEL: Record<string, string> = {
  residenziale: "Immobili residenziali",
  commerciale: "Immobili commerciali / uffici",
  industriale: "Immobili industriali / logistica",
};

const PROCEDURE_LABEL: Record<string, string> = {
  esecuzione: "Esecuzione immobiliare",
  fallimentare: "Liquidazione giudiziale",
  "pre-asta": "Pre-asta / stragiudiziale",
};

export const pvpAdapter: SourceAdapter = {
  id: "pvp",
  name: "PVP — Portale Vendite Pubbliche",
  status: "NOT TESTED",

  async testConnection(): Promise<ConnectionTestResult> {
    const probe = await probePvp();
    const base = {
      timestamp: probe.timestamp,
      sourceUrl: probe.sourceUrl,
      latencyMs: probe.latencyMs,
      connectionType: "HTTP public probe" as const,
      mode: "PUBLIC REACHABILITY" as const,
    };
    if (probe.ok && probe.httpStatus !== null) {
      return {
        ...base,
        status: "SOURCE REACHABLE",
        httpStatus: probe.httpStatus,
        note: "Verifica tecnica di raggiungibilità della homepage pubblica. Nessun annuncio è stato letto o estratto.",
      };
    }
    return {
      ...base,
      status: "ERROR",
      ...(probe.httpStatus !== null && { httpStatus: probe.httpStatus }),
      note: probe.note ?? "Sorgente non raggiungibile al momento del test.",
    };
  },

  buildSearchRequest(filters: HandoffFilters): SearchHandoff {
    const params: Record<string, string> = {};
    if (filters.area.trim()) params["Comune / Provincia"] = filters.area.trim();
    if (filters.assetType !== "all")
      params["Tipologia"] = ASSET_LABEL[filters.assetType] ?? filters.assetType;
    if (filters.maxBudget !== "all")
      params["Budget massimo"] = `${Number(filters.maxBudget).toLocaleString("it-IT")} €`;
    if (filters.occupancy !== "all") params["Occupazione"] = filters.occupancy;
    if (filters.procedure !== "all")
      params["Procedura"] = PROCEDURE_LABEL[filters.procedure] ?? filters.procedure;

    return {
      url: PVP_SEARCH,
      params,
      label: "Apri ricerca ufficiale PVP",
    };
  },

  disconnect() {
    pvpAdapter.status = "NOT TESTED";
  },
};

export { PVP_HOME };
