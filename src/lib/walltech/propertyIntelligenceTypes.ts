import type{CrossCheckIssue,ParsedDocument}from"./documentParserTypes";
export type SourceClass="OFFICIAL"|"PROCEDURAL_DOCUMENT"|"MARKET"|"USER_INPUT"|"ENGINE_INFERENCE";
export type EvidenceConfidence="CONFIRMED"|"REPORTED"|"ESTIMATED"|"MISSING";
export type PropertyDecision="DISCARD"|"REVIEW"|"DEEP_DIVE"|"INVESTMENT_READY";
export type RiskLevel="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type DocumentEvidenceStatus="ACQUIRED"|"ANALYZED"|"UNREADABLE"|"ERROR";
export interface PropertyDocumentProvenance{sourceClass:SourceClass;sourceLabel:string;sourceUrl?:string;announcementId?:string;attachmentId?:number;attachmentTypeCode?:string;versionId?:string;acquiredAt:string;}
export interface PropertyDocumentEvidence{id:string;fileName:string;mimeType:string;size:number;sha256?:string;status:DocumentEvidenceStatus;parsedDocument?:ParsedDocument;provenance?:PropertyDocumentProvenance;error?:string;processedAt:string;}
export interface PropertyDocumentEvidenceLayer{documents:PropertyDocumentEvidence[];crossChecks:CrossCheckIssue[];globalWarnings:string[];}
export interface ProvenanceValue<T>{value:T|null;sourceClass:SourceClass;sourceLabel:string;confidence:EvidenceConfidence;note?:string;}
export interface PropertyIssue{id:string;area:"PROCEDURE"|"DOCUMENTATION"|"URBAN"|"CADASTRAL"|"OCCUPANCY"|"CONDOMINIUM"|"MARKET"|"FINANCIAL"|"TAX"|"EXIT";title:string;level:RiskLevel;description:string;estimatedCost?:number;sourceLabel:string;confidence:EvidenceConfidence;blocking:boolean;nextCheck?:string;}
export interface InvestmentAssumptions{targetPurchasePrice:number|null;renovationCost:number|null;proceduralCosts:number|null;taxesAndTransferCosts:number|null;condominiumCosts:number|null;financeCosts:number|null;contingency:number|null;expectedSalePrice:number|null;expectedMonthlyRent:number|null;monthsToExit:number|null;}

export type ProcedureTypeCode =
  | "REAL_ESTATE_ENFORCEMENT"
  | "JUDICIAL_LIQUIDATION"
  | "BANKRUPTCY_LEGACY"
  | "INSOLVENCY_PROCEEDING"
  | "OTHER"
  | "UNKNOWN";

export type ProcedureRelationType =
  | "PRIMARY"
  | "JOINED"
  | "MERGED"
  | "CONTINUATION"
  | "RELATED"
  | "UNKNOWN";

export type ProcedureActorRole =
  | "ENFORCEMENT_JUDGE"
  | "DELEGATED_JUDGE"
  | "DELEGATED_PROFESSIONAL"
  | "JUDICIAL_CUSTODIAN"
  | "CURATOR"
  | "JUDICIAL_COMMISSIONER"
  | "LIQUIDATOR"
  | "COURT_APPRAISER"
  | "SALE_SPECIALIST"
  | "SALE_PLATFORM_MANAGER"
  | "OTHER";

export type SaleEventStatus =
  | "SCHEDULED"
  | "DESERTED"
  | "AWARDED"
  | "SUSPENDED"
  | "REVOKED"
  | "CANCELLED"
  | "UNKNOWN";

export type LotSaleScope =
  | "CURRENT"
  | "HISTORICAL"
  | "OUT_OF_CURRENT_SCOPE"
  | "UNKNOWN";

export type DocumentSaleScope =
  | "CURRENT_SALE"
  | "HISTORICAL"
  | "MIXED"
  | "UNRESOLVED";

export type EvidenceAccessLevel =
  | "PUBLIC"
  | "AUTHORIZED"
  | "USER_PROVIDED";

export type IdentityAvailability =
  | "KNOWN"
  | "REDACTED"
  | "NOT_PUBLICLY_AVAILABLE"
  | "UNKNOWN";

export type CreditorRole =
  | "PROCEEDING_CREDITOR"
  | "INTERVENING_CREDITOR"
  | "SECURED_CREDITOR"
  | "CURRENT_CLAIM_HOLDER"
  | "SERVICER"
  | "NEGOTIATION_COUNTERPARTY"
  | "OTHER";

export type CreditorEntityCategory =
  | "BANK"
  | "SPV"
  | "SERVICER"
  | "CONDOMINIUM"
  | "TAX_PUBLIC_CREDITOR"
  | "COMPANY"
  | "PRIVATE_INDIVIDUAL"
  | "OTHER"
  | "UNKNOWN";

export type ExecutionStrategy =
  | "AUCTION"
  | "PRE_AUCTION_SETTLEMENT"
  | "DEEP_DIVE"
  | "MONITOR"
  | "DISCARD"
  | "UNDETERMINED";

export interface ProcedureTypeEvidence {
  code: ProcedureTypeCode;
  officialLabel: ProvenanceValue<string>;
}

export interface ProcedureReference {
  id: string;
  number: ProvenanceValue<string>;
  registry?: ProvenanceValue<string>;
  court?: ProvenanceValue<string>;
  procedureType: ProcedureTypeEvidence;
  relation: ProcedureRelationType;
}

export interface ProcedureActor {
  id: string;
  role: ProcedureActorRole;
  roleLabel: string;
  name: ProvenanceValue<string>;
  procedureRefIds: string[];
  saleEventIds?: string[];
  sourceDocumentIds: string[];
}

export interface StructuredPropertyAddress {
  street: ProvenanceValue<string>;
  postalCode: ProvenanceValue<string>;
  city: ProvenanceValue<string>;
  province: ProvenanceValue<string>;
  locality?: ProvenanceValue<string>;
  country: ProvenanceValue<string>;
}

export interface CadastralBody {
  id: string;
  sheet?: ProvenanceValue<string>;
  parcel?: ProvenanceValue<string>;
  sub?: ProvenanceValue<string>;
  category?: ProvenanceValue<string>;
  cadastralIncome?: ProvenanceValue<string | number>;
  surfaceSummary?: ProvenanceValue<string>;
}

export interface ProcedureAsset {
  assetId: string;
  lotId: string;
  label: string;
  address?: StructuredPropertyAddress;
  cadastralBodies: CadastralBody[];
  occupancy?: ProvenanceValue<string>;
  energyClass?: ProvenanceValue<string>;
  urbanCompliance?: ProvenanceValue<string>;
  cadastralCompliance?: ProvenanceValue<string>;
  servitudes?: ProvenanceValue<string>;
  sourceDocumentIds: string[];
}

export interface ProcedureLot {
  lotId: string;
  label: ProvenanceValue<string>;
  saleScope: LotSaleScope;
  assetIds: string[];
  sourceDocumentIds: string[];
}

export interface SaleEventHistoryItem {
  historyEventId: string;
  experimentNumber?: number;
  experimentLabel?: ProvenanceValue<string>;
  status: SaleEventStatus;
  lotIds: string[];
  basePrice?: ProvenanceValue<number>;
  minimumBidIncrease?: ProvenanceValue<number>;
  authorizationDate?: ProvenanceValue<string>;
  sourceDocumentIds: string[];
  note?: string;
}

export interface SaleEvent {
  saleEventId: string;
  procedureRefIds: string[];
  announcementId?: string;
  announcementDate?: ProvenanceValue<string>;
  saleDate?: ProvenanceValue<string>;
  experimentLabel?: ProvenanceValue<string>;
  status: SaleEventStatus;
  activeLotIds: string[];
  previousAnnouncementIds: string[];
  history?: SaleEventHistoryItem[];
  noticeDocumentId?: string;
}

export interface DocumentScopeAssignment {
  documentEvidenceId: string;
  scope: DocumentSaleScope;
  procedureRefIds: string[];
  saleEventIds: string[];
  lotIds: string[];
  assetIds: string[];
  note?: string;
}

export interface CreditorPosition {
  id: string;
  role: CreditorRole;
  entityCategory: CreditorEntityCategory;
  identityAvailability: IdentityAvailability;
  name?: ProvenanceValue<string>;
  amount?: ProvenanceValue<number>;
  securedRank?: ProvenanceValue<string>;
  relatedCreditorId?: string;
  sourceDocumentIds: string[];
  accessLevel: EvidenceAccessLevel;
  nplStatus?: ProvenanceValue<
    "CONFIRMED_NPL" | "POSSIBLE_NPL" | "NOT_NPL" | "UNKNOWN"
  >;
}

export interface AuthorizedEvidenceSourceStatus {
  sourceId: string;
  sourceLabel: string;
  status:
    | "NOT_TESTED"
    | "PENDING_AGREEMENT"
    | "CONNECTED"
    | "ERROR";
  evidenceAvailable: boolean;
  note?: string;
}

export interface CreditorIntelligenceContext {
  positions: CreditorPosition[];
  publicIdentityRestricted: boolean;
  requiresAuthorizedEvidence: boolean;
  authorizedEvidenceSources?: AuthorizedEvidenceSourceStatus[];
}

export interface ProcedureIntelligenceContext {
  jurisdiction: {
    countryCode: string;
    countryName: string;
  };
  procedures: ProcedureReference[];
  actors: ProcedureActor[];
  saleEvents: SaleEvent[];
  lots: ProcedureLot[];
  assets: ProcedureAsset[];
  documentScopes: DocumentScopeAssignment[];
  currentSaleEventId?: string;
}

export interface PropertyStrategyContext {
  recommendedStrategy: ExecutionStrategy;
  candidateStrategies: ExecutionStrategy[];
  reason?: string;
  requiresCreditorIntelligence: boolean;
}


export interface PropertyOpportunityInput{opportunityId:string;title:string;procedure:any;asset:any;issues:PropertyIssue[];market:any;assumptions:InvestmentAssumptions;availableDocuments:string[];missingDocuments:string[];documentEvidence?:PropertyDocumentEvidenceLayer;
  procedureIntelligence?:ProcedureIntelligenceContext;
  creditorIntelligence?:CreditorIntelligenceContext;
  strategyContext?:PropertyStrategyContext;}
export interface InvestmentScenario{name:"FLIP"|"RENTAL"|"HOLD";completeness:number;totalCapitalRequired:number|null;grossMargin:number|null;roiPercent:number|null;annualGrossYieldPercent:number|null;missingInputs:string[];}
export interface PropertyIntelligenceOutput{opportunityId:string;decision:PropertyDecision;opportunityScore:number|null;riskScore:number|null;riskCoverage:number;completeness:number;scoreBreakdown:Record<string,number>;topRisks:PropertyIssue[];strengths:string[];requiredNextChecks:string[];scenarios:InvestmentScenario[];decisionReason:string;generatedAt:string;}
