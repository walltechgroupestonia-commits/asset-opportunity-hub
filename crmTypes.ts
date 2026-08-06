export type CrmStage =
  | "LEAD"
  | "ASSESSMENT"
  | "OPPORTUNITY"
  | "PROPOSAL"
  | "EXECUTION"
  | "CLOSING"
  | "WON"
  | "LOST";

export interface CrmOpportunity {
  id: string;
  title: string;
  client: string;
  businessUnit: string;
  stage: CrmStage;
  owner: string;
  value: number;
  fee: number;
  probability: number;
  nextAction: string;
  deadline: string;
  evidence: string;
  feeProtected: boolean;
  buyerAvailable: boolean;
  updatedAt: string;
}

export interface CrmSummary {
  totalPipeline: number;
  expectedIncome: number;
  weightedIncome: number;
  openOpportunities: number;
  urgentActions: number;
  blockedOpportunities: number;
}
