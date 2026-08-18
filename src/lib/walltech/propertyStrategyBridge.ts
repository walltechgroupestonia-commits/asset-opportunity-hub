import type {
  CreditorIntelligenceContext,
  ExecutionStrategy,
  ProcedureIntelligenceContext,
  PropertyStrategyContext,
} from "./propertyIntelligenceTypes";

const unique = <T,>(values: T[]): T[] =>
  [...new Set(values)];

const hasCurrentSale = (
  procedure:
    | ProcedureIntelligenceContext
    | undefined,
): boolean => {
  if (
    !procedure?.currentSaleEventId
  ) {
    return false;
  }

  const event =
    procedure.saleEvents.find(
      (item) =>
        item.saleEventId ===
        procedure.currentSaleEventId,
    );

  return Boolean(
    event &&
    event.status === "SCHEDULED" &&
    event.activeLotIds.length > 0,
  );
};

const hasCurrentClaimHolder = (
  creditors:
    | CreditorIntelligenceContext
    | undefined,
): boolean =>
  Boolean(
    creditors?.positions.some(
      (position) =>
        position.role ===
          "CURRENT_CLAIM_HOLDER" &&
        position.identityAvailability ===
          "KNOWN",
    ),
  );

const hasNegotiationCounterparty = (
  creditors:
    | CreditorIntelligenceContext
    | undefined,
): boolean =>
  Boolean(
    creditors?.positions.some(
      (position) =>
        position.role ===
          "NEGOTIATION_COUNTERPARTY" &&
        position.identityAvailability ===
          "KNOWN",
    ),
  );

const hasConfirmedNpl = (
  creditors:
    | CreditorIntelligenceContext
    | undefined,
): boolean =>
  Boolean(
    creditors?.positions.some(
      (position) =>
        position.nplStatus?.value ===
        "CONFIRMED_NPL",
    ),
  );

export function buildPropertyStrategyContext(input: {
  procedureIntelligence?:
    ProcedureIntelligenceContext;
  creditorIntelligence?:
    CreditorIntelligenceContext;
}): PropertyStrategyContext {
  const {
    procedureIntelligence,
    creditorIntelligence,
  } = input;

  const currentSaleAvailable =
    hasCurrentSale(
      procedureIntelligence,
    );

  const currentClaimHolderKnown =
    hasCurrentClaimHolder(
      creditorIntelligence,
    );

  const negotiationCounterpartyKnown =
    hasNegotiationCounterparty(
      creditorIntelligence,
    );

  const confirmedNpl =
    hasConfirmedNpl(
      creditorIntelligence,
    );

  const creditorCounterpartyKnown =
    currentClaimHolderKnown ||
    negotiationCounterpartyKnown;

  const candidateStrategies:
    ExecutionStrategy[] = [];

  if (currentSaleAvailable) {
    candidateStrategies.push("AUCTION");
  }

  candidateStrategies.push(
    "PRE_AUCTION_SETTLEMENT",
  );

  candidateStrategies.push(
    "DEEP_DIVE",
  );

  let recommendedStrategy:
    ExecutionStrategy =
      currentSaleAvailable
        ? "AUCTION"
        : "DEEP_DIVE";

  let reason =
    currentSaleAvailable
      ? "Esiste una vendita corrente schedulata con lotto attivo. La strategia asta è operativamente disponibile."
      : "Non risulta una vendita corrente sufficientemente determinata. È necessario approfondire l'evidence.";

  const requiresCreditorIntelligence =
    !creditorCounterpartyKnown;

  if (creditorCounterpartyKnown) {
    recommendedStrategy =
      "PRE_AUCTION_SETTLEMENT";

    reason =
      confirmedNpl
        ? "È identificata una controparte creditoria negoziabile e l'evidence autorizzata conferma uno stato NPL. La strategia pre-auction può essere valutata concretamente, ferme le verifiche economiche, legali e negoziali."
        : "È identificata una controparte creditoria negoziabile. La strategia pre-auction può essere valutata concretamente; nessuno stato NPL viene inferito in assenza di evidence esplicita.";
  }

  return {
    recommendedStrategy,
    candidateStrategies:
      unique(candidateStrategies),
    reason,
    requiresCreditorIntelligence,
  };
}
