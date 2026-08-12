export interface DossierData {
  operationCode: string;
  title: string;
  location: string;
  assetType: string;
  estimatedValue: number | null;
  acquisitionCost: number | null;
  operatingCosts: number | null;
  exitValue: number | null;
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
  totalInvestment: number | null;
  grossMargin: number | null;
  roi: number | null;
}
