import { buildInvestmentScenarios } from "./propertyScenarioEngine";
import type {
  PropertyOpportunityInput,
  PropertyIntelligenceOutput,
  PropertyIssue,
} from "./propertyIntelligenceTypes";

const clamp = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const riskPenalty = (issue: PropertyIssue) =>
  issue.level === "LOW"
    ? 5
    : issue.level === "MEDIUM"
      ? 15
      : issue.level === "HIGH"
        ? 28
        : 45;

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && value !== "";

export function analyzePropertyOpportunity(
  input: PropertyOpportunityInput,
): PropertyIntelligenceOutput {
  const documentTotal =
    input.availableDocuments.length +
    input.missingDocuments.length;

  const documentation = documentTotal
    ? clamp(
        (input.availableDocuments.length / documentTotal) * 100,
      )
    : 0;

  const procedureValues = [
    input.procedure.procedureNumber?.value,
    input.procedure.auctionDate?.value,
    input.procedure.offerDeadline?.value,
    input.procedure.basePrice?.value,
    input.procedure.minimumOffer?.value,
    input.procedure.delegate?.value,
  ];

  const procedure = clamp(
    (procedureValues.filter(hasValue).length /
      procedureValues.length) *
      100,
  );

  const occupancyValue = (
    input.asset.occupancy?.value || ""
  )
    .toString()
    .trim()
    .toLowerCase();

  const occupancyCoverage = occupancyValue ? 100 : 0;

  const occupancyQuality = !occupancyValue
    ? 0
    : occupancyValue.includes("libero")
      ? 100
      : 50;

  const urbanIssues = input.issues.filter(
    (issue) =>
      issue.area === "URBAN" ||
      issue.area === "CADASTRAL",
  );

  const urbanDocumentsAvailable =
    input.availableDocuments.includes(
      "CTU / Perizia completa",
    ) ||
    input.availableDocuments.includes(
      "Planimetria catastale",
    );

  const urbanEvidenceAvailable =
    urbanDocumentsAvailable ||
    urbanIssues.some(
      (issue) => issue.confidence !== "MISSING",
    );

  const urbanAndCadastralCoverage =
    urbanEvidenceAvailable ? 100 : 0;

  let urbanAndCadastralQuality =
    urbanEvidenceAvailable ? 100 : 0;

  if (urbanEvidenceAvailable) {
    urbanIssues.forEach((issue) => {
      urbanAndCadastralQuality -= riskPenalty(issue);
    });
  }

  urbanAndCadastralQuality = clamp(
    urbanAndCadastralQuality,
  );

  const marketValues = [
    input.market.officialDeclaredValuePerSqm?.value,
    input.market.askingPricePerSqm?.value,
    input.market.estimatedRentPerMonth?.value,
    input.market.areaServicesScore?.value,
  ];

  const market = clamp(
    (marketValues.filter(hasValue).length /
      marketValues.length) *
      100,
  );

  const assumptions = input.assumptions;

  const financialValues = [
    assumptions.targetPurchasePrice,
    assumptions.renovationCost,
    assumptions.proceduralCosts,
    assumptions.taxesAndTransferCosts,
    assumptions.condominiumCosts,
    assumptions.contingency,
    assumptions.expectedSalePrice,
    assumptions.expectedMonthlyRent,
  ];

  const financial = clamp(
    (financialValues.filter(hasValue).length /
      financialValues.length) *
      100,
  );

  const completeness = clamp(
    (procedure +
      documentation +
      occupancyCoverage +
      urbanAndCadastralCoverage +
      market +
      financial) /
      6,
  );

  const riskCoverage = clamp(
    (procedure +
      documentation +
      occupancyCoverage +
      urbanAndCadastralCoverage +
      market) /
      5,
  );

  const rawRisk = clamp(
    input.issues.reduce(
      (sum, issue) => sum + riskPenalty(issue),
      0,
    ),
  );

  const hasCriticalEvidence = input.issues.some(
    (issue) =>
      issue.blocking ||
      (issue.level === "CRITICAL" &&
        issue.confidence !== "MISSING"),
  );

  const riskScore =
    riskCoverage >= 40 || hasCriticalEvidence
      ? rawRisk
      : null;

  const rawOpportunityScore = clamp(
    procedure * 0.15 +
      documentation * 0.2 +
      occupancyQuality * 0.15 +
      urbanAndCadastralQuality * 0.15 +
      market * 0.15 +
      financial * 0.2,
  );

  const opportunityScore =
    completeness >= 50 &&
    market > 0 &&
    financial > 0
      ? rawOpportunityScore
      : null;

  const nextChecks = [
    ...input.missingDocuments.map(
      (document) => `Acquisire: ${document}`,
    ),
    ...input.issues
      .map((issue) => issue.nextCheck)
      .filter(Boolean) as string[],
  ];

  if (!occupancyValue) {
    nextChecks.push(
      "Verificare lo stato di occupazione dell'immobile",
    );
  }

  if (!urbanEvidenceAvailable) {
    nextChecks.push(
      "Acquisire evidence urbanistica e catastale prima di attribuire una valutazione positiva all'area",
    );
  }

  if (
    !input.market.officialDeclaredValuePerSqm?.value
  ) {
    nextChecks.push(
      "Acquisire valori immobiliari dichiarati da fonte ufficiale disponibile",
    );
  }

  if (assumptions.expectedSalePrice === null) {
    nextChecks.push(
      "Definire valore di uscita prudenziale su dati verificati",
    );
  }

  if (assumptions.expectedMonthlyRent === null) {
    nextChecks.push(
      "Definire scenario locativo prudenziale",
    );
  }

  let decision:
    | "DISCARD"
    | "REVIEW"
    | "DEEP_DIVE"
    | "INVESTMENT_READY" = "REVIEW";

  let decisionReason =
    "Evidence insufficiente per attribuire punteggi affidabili. Completare le verifiche richieste.";

  const blockingIssue = input.issues.some(
    (issue) => issue.blocking,
  );

  if (
    blockingIssue ||
    (riskScore !== null && riskScore >= 85)
  ) {
    decision = "DISCARD";
    decisionReason =
      "Sono presenti blocchi o rischi rilevati troppo elevati rispetto all'evidence disponibile.";
  } else if (
    opportunityScore !== null &&
    riskScore !== null &&
    opportunityScore >= 80 &&
    riskScore <= 35 &&
    completeness >= 85 &&
    riskCoverage >= 80
  ) {
    decision = "INVESTMENT_READY";
    decisionReason =
      "Il set informativo è sufficientemente completo per il Decision Gate, ferme le verifiche professionali.";
  } else if (
    opportunityScore !== null &&
    riskScore !== null &&
    opportunityScore >= 55 &&
    riskScore <= 65
  ) {
    decision = "DEEP_DIVE";
    decisionReason =
      "L'opportunità merita approfondimento, ma restano verifiche decisive da completare.";
  }

  return {
    opportunityId: input.opportunityId,
    decision,
    opportunityScore,
    riskScore,
    riskCoverage,
    completeness,
    scoreBreakdown: {
      procedure,
      documentation,
      occupancy: occupancyCoverage,
      urbanAndCadastral: urbanAndCadastralCoverage,
      market,
      financial,
    },
    topRisks: [...input.issues]
      .sort(
        (a, b) =>
          riskPenalty(b) - riskPenalty(a),
      )
      .slice(0, 5),
    strengths: [
      ...(occupancyValue.includes("libero")
        ? ["Immobile indicato come libero"]
        : []),
    ],
    requiredNextChecks: [
      ...new Set(nextChecks),
    ],
    scenarios:
      buildInvestmentScenarios(assumptions),
    decisionReason,
    generatedAt: new Date().toISOString(),
  };
}
