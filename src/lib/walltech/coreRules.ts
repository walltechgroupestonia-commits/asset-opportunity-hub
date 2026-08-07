import type { EngineWarning, OpportunityCondition, OpportunityInput, Priority } from "./coreTypes";

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function assignCondition(input: OpportunityInput): OpportunityCondition {
  const score = clampScore(input.opportunityScore);
  const risk = clampScore(input.riskScore);
  const hardBlock =
    input.compliance.reservedActivityDetected ||
    !input.compliance.walltechRoleDefined ||
    !input.operations.ownerAssigned;

  if (hardBlock || risk >= 85) return "DANGER";
  if (risk >= 65 || score < 35) return "EMERGENCY";
  if (score >= 90 && risk <= 20) return "POWER";
  if (score >= 80 && risk <= 35) return "AFFLUENCE";
  if (score >= 55 && risk <= 55) return "NORMAL";
  return "NON_EXISTENCE";
}

export function derivePriority(input: OpportunityInput): Priority {
  const score = clampScore(input.opportunityScore);
  const risk = clampScore(input.riskScore);
  if (input.operations.urgencyHigh || risk >= 80) return "CRITICAL";
  if (risk >= 60 || score >= 85) return "HIGH";
  if (risk >= 35 || score >= 55) return "MEDIUM";
  return "LOW";
}

export function buildWarnings(input: OpportunityInput): EngineWarning[] {
  const warnings: EngineWarning[] = [];
  const add = (code: string, severity: Priority, message: string, blocking: boolean) =>
    warnings.push({ code, severity, message, blocking });

  if (!input.counterparties.sourceAvailable)
    add("SOURCE_MISSING", "CRITICAL", "Sorgente dell'opportunità non verificata.", true);
  if (!input.counterparties.sellerOrOriginatorAvailable)
    add("ORIGINATOR_MISSING", "HIGH", "Cedente, venditore o originator non disponibile.", true);
  if (!input.counterparties.buyerOrRecipientAvailable)
    add("BUYER_MISSING", "HIGH", "Buyer, cessionario o controparte finale non disponibile.", true);

  if (!input.fee.defined) add("FEE_UNDEFINED", "CRITICAL", "Fee Walltech non definita.", true);
  if (!input.fee.payerIdentified) add("FEE_PAYER_UNKNOWN", "HIGH", "Soggetto pagatore non identificato.", true);
  if (!input.fee.maturityDefined) add("FEE_MATURITY_UNKNOWN", "HIGH", "Momento di maturazione della fee non definito.", true);
  if (!input.fee.protectedByAgreement) add("FEE_UNPROTECTED", "CRITICAL", "Fee non protetta da accordo.", true);

  if (!input.operations.ownerAssigned) add("OWNER_MISSING", "CRITICAL", "Owner operativo non assegnato.", true);
  if (!input.operations.nextActionDefined) add("NEXT_ACTION_MISSING", "HIGH", "Next action non definita.", true);
  if (!input.operations.deadlineDefined) add("DEADLINE_MISSING", "HIGH", "Deadline non definita.", true);

  if (input.evidence.missing.length > 0)
    add("EVIDENCE_MISSING", "HIGH", `Evidence mancanti: ${input.evidence.missing.join(", ")}.`, true);

  if (!input.compliance.walltechRoleDefined) add("ROLE_UNDEFINED", "CRITICAL", "Ruolo Walltech non definito.", true);
  if (input.compliance.reservedActivityDetected)
    add("RESERVED_ACTIVITY", "CRITICAL", "Rilevata attività riservata: necessario routing a professionista abilitato.", true);
  if (input.compliance.regulatedProfessionalsRequired && !input.compliance.disclaimerApplied)
    add("DISCLAIMER_MISSING", "HIGH", "Disclaimer professionale non applicato.", true);

  return warnings;
}
