export type WalltechModuleKey =
  | "property"
  | "fiscal-assets"
  | "npl"
  | "corporate-advisory"
  | "estonia-gateway"
  | "surroga"
  | "cfi";

export type OpportunityCondition =
  | "NON_EXISTENCE"
  | "DANGER"
  | "EMERGENCY"
  | "NORMAL"
  | "AFFLUENCE"
  | "POWER";

export type DecisionReadiness = "BLOCKED" | "REVIEW" | "CONDITIONALLY_READY" | "READY";
export type DecisionOutcome = "NO_GO" | "HOLD" | "GO_WITH_CONDITIONS" | "GO";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface CounterpartyState {
  sourceAvailable: boolean;
  sellerOrOriginatorAvailable: boolean;
  buyerOrRecipientAvailable: boolean;
  partnerAvailable?: boolean;
}

export interface FeeState {
  defined: boolean;
  amount?: number;
  currency?: "EUR" | "USD" | "GBP";
  payerIdentified: boolean;
  maturityDefined: boolean;
  protectedByAgreement: boolean;
  collectionProbability?: number;
  expectedDaysToRevenue?: number;
}

export interface EvidenceState {
  required: string[];
  available: string[];
  missing: string[];
  verified: string[];
}

export interface OperationalState {
  ownerAssigned: boolean;
  owner?: string;
  nextActionDefined: boolean;
  nextAction?: string;
  deadlineDefined: boolean;
  deadline?: string;
  urgencyHigh?: boolean;
}

export interface ComplianceState {
  walltechRoleDefined: boolean;
  walltechRole?: string;
  reservedActivityDetected: boolean;
  regulatedProfessionalsRequired: boolean;
  disclaimerApplied: boolean;
}

export interface OpportunityInput {
  id: string;
  title: string;
  module: WalltechModuleKey;
  estimatedValue?: number;
  opportunityScore: number;
  riskScore: number;
  documentCompleteness: number;
  counterparties: CounterpartyState;
  fee: FeeState;
  evidence: EvidenceState;
  operations: OperationalState;
  compliance: ComplianceState;
  notes?: string[];
}

export interface EngineWarning {
  code: string;
  severity: Priority;
  message: string;
  blocking: boolean;
}

export interface EngineDecision {
  opportunityId: string;
  condition: OpportunityCondition;
  readiness: DecisionReadiness;
  outcome: DecisionOutcome;
  priority: Priority;
  score: number;
  risk: number;
  nextAction: string;
  owner: string;
  deadline: string;
  evidenceRequired: string[];
  warnings: EngineWarning[];
  rationale: string[];
  generatedAt: string;
}
