import type { DossierData, DossierMetrics } from "./dossierTypes";

export function calculateDossierMetrics(
  data: DossierData,
): DossierMetrics {
  const totalInvestment =
    Math.max(0, data.acquisitionCost) + Math.max(0, data.operatingCosts);

  const grossMargin = data.exitValue - totalInvestment;

  const roi =
    totalInvestment > 0
      ? (grossMargin / totalInvestment) * 100
      : 0;

  return {
    totalInvestment,
    grossMargin,
    roi,
  };
}

export function dossierCompletion(data: DossierData): number {
  if (!data.documents.length) return 0;

  const total = data.documents.reduce((sum, document) => {
    if (document.status === "AVAILABLE") return sum + 1;
    if (document.status === "PARTIAL") return sum + 0.5;
    return sum;
  }, 0);

  return Math.round((total / data.documents.length) * 100);
}
