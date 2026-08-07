import type { OpportunityInput } from "@/lib/walltech";

export const walltechCoreDemo: OpportunityInput = {
  id: "WT-DEMO-001",
  title: "Operazione immobiliare pre-asta",
  module: "property",
  estimatedValue: 305000,
  opportunityScore: 84,
  riskScore: 32,
  documentCompleteness: 67,
  counterparties: { sourceAvailable: true, sellerOrOriginatorAvailable: true, buyerOrRecipientAvailable: false, partnerAvailable: true },
  fee: { defined: true, amount: 25000, currency: "EUR", payerIdentified: true, maturityDefined: true, protectedByAgreement: false, collectionProbability: 55, expectedDaysToRevenue: 45 },
  evidence: { required: ["Perizia CTU", "Visura catastale", "Ispezione ipotecaria", "Verifica urbanistica"], available: ["Perizia CTU", "Visura catastale"], missing: ["Verifica urbanistica"], verified: ["Perizia CTU"] },
  operations: { ownerAssigned: true, owner: "Walltech Property Team", nextActionDefined: true, nextAction: "Completare la verifica urbanistica.", deadlineDefined: true, deadline: "Entro 48 ore" },
  compliance: { walltechRoleDefined: true, walltechRole: "Analisi preliminare, organizzazione documentale e coordinamento.", reservedActivityDetected: false, regulatedProfessionalsRequired: true, disclaimerApplied: true },
};
