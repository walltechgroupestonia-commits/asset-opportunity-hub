import type { OpportunityInput } from "./coreTypes";
import type {
  PropertyOpportunityInput,
  PropertyIntelligenceOutput,
} from "./propertyIntelligenceTypes";

export function buildPropertyCoreInput(
  opportunity: PropertyOpportunityInput,
  analysis: PropertyIntelligenceOutput,
): OpportunityInput {
  const nextAction =
    analysis.requiredNextChecks[0] ??
    "Completare l'Assessment e verificare l'evidence disponibile.";

  const deadline = opportunity.procedure.offerDeadline?.value
    ? `Entro ${opportunity.procedure.offerDeadline.value}`
    : "Entro 48 ore";

  const evidenceRequired = [
    ...opportunity.availableDocuments,
    ...opportunity.missingDocuments,
    ...analysis.requiredNextChecks,
  ];

  const sourceAvailable =
    opportunity.availableDocuments.length > 0 ||
    (opportunity.documentEvidence?.documents.length ?? 0) > 0;

  const sellerOrOriginatorAvailable = false;
  const buyerOrRecipientAvailable = false;

  const feeDefined = false;
  const feeProtected = false;

  const blockingComplianceIssue = opportunity.issues.some(
    (issue) => issue.blocking || issue.area === "TAX",
  );

  return {
    id: opportunity.opportunityId,
    title: opportunity.title,
    module: "property",
    estimatedValue:
      opportunity.assumptions.expectedSalePrice ??
      opportunity.assumptions.targetPurchasePrice ??
      undefined,
    opportunityScore: analysis.opportunityScore ?? 0,
    riskScore: analysis.riskScore ?? 100,
    documentCompleteness: analysis.completeness,

    counterparties: {
      sourceAvailable,
      sellerOrOriginatorAvailable,
      buyerOrRecipientAvailable,
      partnerAvailable: false,
    },

    fee: {
      defined: feeDefined,
      currency: "EUR",
      payerIdentified: false,
      maturityDefined: false,
      protectedByAgreement: feeProtected,
    },

    evidence: {
      required: Array.from(new Set(evidenceRequired)),
      available: opportunity.availableDocuments,
      missing: opportunity.missingDocuments,
      verified:
        opportunity.documentEvidence?.documents
          .filter((document) => document.status === "ANALYZED")
          .map((document) => document.fileName) ?? [],
    },

    operations: {
      ownerAssigned: true,
      owner: "Walltech Property Team",
      nextActionDefined: Boolean(nextAction),
      nextAction,
      deadlineDefined: Boolean(deadline),
      deadline,
      urgencyHigh: Boolean(opportunity.procedure.auctionDate?.value),
    },

    compliance: {
      walltechRoleDefined: true,
      walltechRole:
        "Segnalazione di opportunità, analisi preliminare, organizzazione documentale e coordinamento.",
      reservedActivityDetected: blockingComplianceIssue,
      regulatedProfessionalsRequired: true,
      disclaimerApplied: true,
    },
  };
}
