import { pvpAdapter } from "./pvpAdapter";
import type { ConnectionTestResult, SourceAdapter } from "./types";

function pendingAdapter(id: string, name: string, sourceUrl: string): SourceAdapter {
  const adapter: SourceAdapter = {
    id,
    name,
    status: "PENDING AGREEMENT",
    async testConnection(): Promise<ConnectionTestResult> {
      return {
        status: "PENDING AGREEMENT",
        timestamp: new Date().toISOString(),
        sourceUrl,
        connectionType: "Not available",
        mode: "AWAITING AGREEMENT",
        note: "Connessione disponibile all'attivazione di credenziali / accordo API con la sorgente.",
      };
    },
    buildSearchRequest() {
      return null;
    },
    disconnect() {
      adapter.status = "PENDING AGREEMENT";
    },
  };
  return adapter;
}

export const ADAPTER_REGISTRY: SourceAdapter[] = [
  pvpAdapter,
  pendingAdapter("astalegale", "Astalegale", "https://www.astalegale.net/"),
  pendingAdapter("abilio", "Abilio / Quimmo", "https://www.abilio.com/"),
  pendingAdapter("immobiliallasta", "Immobiliallasta", "https://www.immobiliallasta.it/"),
  pendingAdapter("custom", "Custom API", "https://api.partner.example/v1"),
];

export function getAdapter(id: string): SourceAdapter {
  return ADAPTER_REGISTRY.find((a) => a.id === id) ?? pvpAdapter;
}
