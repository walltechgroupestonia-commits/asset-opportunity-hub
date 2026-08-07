import { assignCondition, buildWarnings, clampScore, derivePriority } from "./coreRules";
import { getModuleDefinition } from "./coreRegistry";
import type { DecisionOutcome, DecisionReadiness, EngineDecision, OpportunityInput } from "./coreTypes";

function deriveReadiness(blockingWarnings: number, input: OpportunityInput): DecisionReadiness {
  if (blockingWarnings >= 3) return "BLOCKED";
  if (blockingWarnings > 0) return "REVIEW";
  const highQuality = input.documentCompleteness >= 80 && input.opportunityScore >= 70 && input.riskScore <= 45;
  return highQuality ? "READY" : "CONDITIONALLY_READY";
}

function deriveOutcome(readiness: DecisionReadiness): DecisionOutcome {
  if (readiness === "BLOCKED") return "NO_GO";
  if (readiness === "REVIEW") return "HOLD";
  if (readiness === "CONDITIONALLY_READY") return "GO_WITH_CONDITIONS";
  return "GO";
}

function deriveNextAction(input: OpportunityInput, blockingMessages: string[]): string {
  if (blockingMessages.length > 0) return blockingMessages[0];
  if (input.operations.nextActionDefined && input.operations.nextAction) return input.operations.nextAction;
  return "Aprire il dossier operativo e assegnare la prossima azione.";
}

export function evaluateOpportunity(input: OpportunityInput): EngineDecision {
  const normalized: OpportunityInput = {
    ...input,
    opportunityScore: clampScore(input.opportunityScore),
    riskScore: clampScore(input.riskScore),
    documentCompleteness: clampScore(input.documentCompleteness),
  };

  const moduleDefinition = getModuleDefinition(normalized.module);
  const warnings = buildWarnings(normalized);
  const blocking = warnings.filter((warning) => warning.blocking);
  const readiness = deriveReadiness(blocking.length, normalized);

  return {
    opportunityId: normalized.id,
    condition: assignCondition(normalized),
    readiness,
    outcome: deriveOutcome(readiness),
    priority: derivePriority(normalized),
    score: normalized.opportunityScore,
    risk: normalized.riskScore,
    nextAction: deriveNextAction(normalized, blocking.map((warning) => warning.message)),
    owner: normalized.operations.owner || moduleDefinition.defaultOwner,
    deadline: normalized.operations.deadline || (normalized.operations.urgencyHigh ? "Entro 24 ore" : "Entro 48 ore"),
    evidenceRequired: Array.from(new Set([...moduleDefinition.requiredEvidence, ...normalized.evidence.required, ...normalized.evidence.missing])),
    warnings,
    rationale: [
      `Modulo: ${moduleDefinition.label}.`,
      `Opportunity score: ${normalized.opportunityScore}/100.`,
      `Risk score: ${normalized.riskScore}/100.`,
      `Completezza documentale: ${normalized.documentCompleteness}%.`,
      `${blocking.length} blocchi operativi rilevati.`,
    ],
    generatedAt: new Date().toISOString(),
  };
}
