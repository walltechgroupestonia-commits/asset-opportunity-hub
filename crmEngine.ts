import type {
  CrmOpportunity,
  CrmSummary,
} from "./crmTypes";

export function calculateCrmSummary(
  opportunities: CrmOpportunity[],
): CrmSummary {
  const open = opportunities.filter(
    (item) => !["WON", "LOST"].includes(item.stage),
  );

  const totalPipeline = open.reduce(
    (sum, item) => sum + Math.max(0, item.value),
    0,
  );

  const expectedIncome = open.reduce(
    (sum, item) => sum + Math.max(0, item.fee),
    0,
  );

  const weightedIncome = open.reduce(
    (sum, item) =>
      sum + Math.max(0, item.fee) * Math.min(100, Math.max(0, item.probability)) / 100,
    0,
  );

  const urgentActions = open.filter(
    (item) =>
      item.deadline.toLowerCase().includes("oggi") ||
      item.deadline.toLowerCase().includes("24 ore"),
  ).length;

  const blockedOpportunities = open.filter(
    (item) =>
      !item.owner ||
      !item.nextAction ||
      !item.deadline ||
      !item.evidence ||
      !item.feeProtected,
  ).length;

  return {
    totalPipeline,
    expectedIncome,
    weightedIncome,
    openOpportunities: open.length,
    urgentActions,
    blockedOpportunities,
  };
}

export function opportunityWarnings(
  opportunity: CrmOpportunity,
): string[] {
  const warnings: string[] = [];

  if (!opportunity.owner) warnings.push("Owner mancante");
  if (!opportunity.nextAction) warnings.push("Next action mancante");
  if (!opportunity.deadline) warnings.push("Deadline mancante");
  if (!opportunity.evidence) warnings.push("Evidence mancante");
  if (!opportunity.feeProtected) warnings.push("Fee non protetta");
  if (!opportunity.buyerAvailable) warnings.push("Buyer / controparte non disponibile");

  return warnings;
}
