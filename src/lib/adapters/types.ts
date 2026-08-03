export type ConnectionStatus =
  | "NOT TESTED"
  | "CONNECTING"
  | "CONNECTED"
  | "SOURCE REACHABLE"
  | "PENDING AGREEMENT"
  | "ERROR";

export type ConnectionType = "HTTP public probe" | "REST API" | "Feed XML" | "Not available";

export type ConnectionMode = "PUBLIC REACHABILITY" | "READ-ONLY API" | "AWAITING AGREEMENT";

export interface HandoffFilters {
  area: string;
  assetType: string;
  maxBudget: string;
  occupancy: string;
  procedure: string;
}

export interface ConnectionTestResult {
  status: ConnectionStatus;
  httpStatus?: number;
  latencyMs?: number;
  timestamp: string;
  sourceUrl: string;
  connectionType: ConnectionType;
  mode: ConnectionMode;
  note?: string;
}

export interface SearchHandoff {
  url: string;
  params: Record<string, string>;
  label: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  status: ConnectionStatus;
  testConnection(): Promise<ConnectionTestResult>;
  buildSearchRequest(filters: HandoffFilters): SearchHandoff | null;
  disconnect(): void;
}
