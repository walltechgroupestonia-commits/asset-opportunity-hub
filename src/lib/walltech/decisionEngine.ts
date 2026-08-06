import type {
  DecisionInput,
  DecisionOutput,
} from "./decisionTypes";

export function runDecisionEngine(input: DecisionInput): DecisionOutput {
  const warnings: string[] = [];

  if (!input.documentsComplete) warnings.push("Documentazione incompleta");
  if (!input.ownerAssigned) warnings.push("Owner non assegnato");
  if (!input.nextActionDefined) warnings.push("Next action mancante");
  if (!input.deadlineDefined) warnings.push("Deadline mancante");
  if (!input.evidenceAvailable) warnings.push("Evidence non disponibile");
  if (!input.feeDefined) warnings.push("Fee non definita");
  if (input.feeDefined && !input.feeProtected) warnings.push("Fee non protetta");
  if (!input.buyerAvailable) warnings.push("Buyer / controparte non disponibile");

  const blocked =
    !input.documentsComplete ||
    !input.ownerAssigned ||
    !input.nextActionDefined ||
    !input.deadlineDefined ||
    !input.feeDefined;

  const readyForClosing =
    !blocked &&
    input.evidenceAvailable &&
    input.feeProtected &&
    input.buyerAvailable &&
    input.opportunityScore >= 70 &&
    input.riskScore <= 45;

  const readiness = readyForClosing
    ? "READY"
    : blocked || input.riskScore >= 80
      ? "BLOCKED"
      : "REVIEW";

  const condition =
    input.riskScore >= 80 || warnings.length >= 5
      ? "DANGER"
      : input.urgencyHigh || warnings.length >= 2
        ? "EMERGENCY"
        : "NORMAL";

  const priority =
    condition === "DANGER" || input.urgencyHigh
      ? "HIGH"
      : readiness === "REVIEW"
        ? "MEDIUM"
        : "LOW";

  let nextAction = "Monitorare il ciclo e aggiornare l'evidence.";
  let owner = "Opportunity Owner";
  let deadline = "Entro 72 ore";
  let evidenceRequired = "Aggiornamento CRM e documento di supporto.";

  if (!input.documentsComplete) {
    nextAction = "Completare la documentazione minima prima di avanzare.";
    owner = "Document Owner";
    deadline = "Entro 24 ore";
    evidenceRequired = "Documenti essenziali caricati e verificabili.";
  } else if (!input.feeDefined || !input.feeProtected) {
    nextAction = "Definire e proteggere la fee prima di aprire nuovo lavoro.";
    owner = "Commercial Owner";
    deadline = "Entro 24 ore";
    evidenceRequired = "Accordo fee o mandato firmato.";
  } else if (!input.buyerAvailable) {
    nextAction = "Attivare ricerca e qualifica della controparte.";
    owner = "Origination Owner";
    deadline = "Entro 48 ore";
    evidenceRequired = "Controparte identificata e risposta registrata.";
  } else if (readyForClosing) {
    nextAction = "Preparare briefing finale e passaggio al closing.";
    owner = "Closing Owner";
    deadline = "Entro 48 ore";
    evidenceRequired = "Checklist closing completa.";
  }

  return {
    condition,
    readiness,
    priority,
    nextAction,
    owner,
    deadline,
    evidenceRequired,
    readyForClosing,
    warnings,
  };
}
