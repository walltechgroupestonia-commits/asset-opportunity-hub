export type Readiness = "READY" | "REVIEW" | "BLOCKED";
export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Condition = "NORMAL" | "EMERGENCY" | "DANGER";

export interface DecisionInput {
  opportunityScore: number;
  riskScore: number;
  documentsComplete: boolean;
  ownerAssigned: boolean;
  nextActionDefined: boolean;
  deadlineDefined: boolean;
  evidenceAvailable: boolean;
  feeDefined: boolean;
  feeProtected: boolean;
  buyerAvailable: boolean;
  urgencyHigh: boolean;
}

export interface DecisionOutput {
  condition: Condition;
  readiness: Readiness;
  priority: Priority;
  nextAction: string;
  owner: string;
  deadline: string;
  evidenceRequired: string;
  readyForClosing: boolean;
  warnings: string[];
}
