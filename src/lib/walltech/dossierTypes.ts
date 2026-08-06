export interface DossierData {
  operationCode: string;
  title: string;
  location: string;
  assetType: string;
  estimatedValue: number;
  acquisitionCost: number;
  operatingCosts: number;
  exitValue: number;
  opportunityScore: number;
  riskScore: number;
  condition: string;
  readiness: string;
  priority: string;
  owner: string;
  deadline: string;
  nextAction: string;
  evidenceRequired: string;
  documents: {
    label: string;
    status: "AVAILABLE" | "PARTIAL" | "MISSING";
  }[];
}

export interface DossierMetrics {
  totalInvestment: number;
  grossMargin: number;
  roi: number;
}
