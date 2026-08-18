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

export interface PartnerFeedCredentials {
  apiKey?: string;
  endpoint?: string;
  token?: string;
}

export interface NormalizedListing {
  id: string;
  sourceId: string;
  sourceLabel: string;
  sourceListingId: string;
  sourceUrl: string;

  title?: string;

  country?: string;
  region?: string;
  province?: string;
  city?: string;
  postalCode?: string;

  assetType?: string;
  surfaceSqm?: number;

  basePrice?: number;
  minimumOffer?: number;

  occupancy?: string;

  procedure?: string;
  procedureNumber?: string;
  court?: string;

  auctionDate?: string;

  sourceClass: "OFFICIAL" | "PROCEDURAL_DOCUMENT" | "MARKET" | "USER_INPUT" | "ENGINE_INFERENCE";
  evidenceAccessLevel: "PUBLIC" | "AUTHORIZED" | "USER_PROVIDED";
  confidence: "CONFIRMED" | "REPORTED" | "ESTIMATED" | "MISSING";
}

/**
 * Contract for a future authorized partner feed / API.
 * No implementation exists yet: live results are never simulated.
 */
export interface PartnerFeedAdapter {
  id: string;
  name: string;
  connect(credentials: PartnerFeedCredentials): Promise<ConnectionTestResult>;
  search(filters: HandoffFilters): Promise<NormalizedListing[]>;
  normalize(results: unknown[]): NormalizedListing[];
  disconnect(): void;
}


export type AuthorizedEvidenceSource =
  | "PST"
  | "SISTER"
  | "PARTNER_API"
  | "USER_PROVIDED"
  | "OTHER";

export interface AuthorizedEvidenceQuery {
  procedureNumber?: string;
  court?: string;
  taxCode?: string;
  vatNumber?: string;
  cadastralSheet?: string;
  cadastralParcel?: string;
  cadastralSub?: string;
  creditorName?: string;
}

export interface AuthorizedCreditorEvidence {
  evidenceId: string;
  source: AuthorizedEvidenceSource;
  sourceLabel: string;
  acquiredAt: string;

  creditorName?: string;
  currentClaimHolder?: string;
  servicerName?: string;

  entityCategory?:
    | "BANK"
    | "SPV"
    | "SERVICER"
    | "CONDOMINIUM"
    | "TAX_PUBLIC_CREDITOR"
    | "COMPANY"
    | "PRIVATE_INDIVIDUAL"
    | "OTHER"
    | "UNKNOWN";

  creditorRole?:
    | "PROCEEDING_CREDITOR"
    | "INTERVENING_CREDITOR"
    | "SECURED_CREDITOR"
    | "CURRENT_CLAIM_HOLDER"
    | "SERVICER"
    | "NEGOTIATION_COUNTERPARTY"
    | "OTHER";

  amount?: number;
  securedRank?: string;

  nplStatus?:
    | "CONFIRMED_NPL"
    | "POSSIBLE_NPL"
    | "NOT_NPL"
    | "UNKNOWN";

  sourceDocumentId?: string;
  note?: string;
}

export interface AuthorizedEvidenceAdapter {
  id: string;
  name: string;

  connect(
    credentials: PartnerFeedCredentials,
  ): Promise<ConnectionTestResult>;

  fetchCreditorEvidence(
    query: AuthorizedEvidenceQuery,
  ): Promise<AuthorizedCreditorEvidence[]>;

  disconnect(): void;
}
