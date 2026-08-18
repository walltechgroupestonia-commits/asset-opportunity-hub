import type {
  AuthorizedEvidenceSourceStatus,
  CreditorIntelligenceContext,
  CreditorPosition,
  EvidenceAccessLevel,
  EvidenceConfidence,
  IdentityAvailability,
  ProvenanceValue,
} from "./propertyIntelligenceTypes";
import type {
  ParsedDocument,
} from "./documentParserTypes";
import type {
  AuthorizedCreditorEvidence,
} from "../adapters/types";

const hasFieldValue = (
  document: ParsedDocument | undefined,
  key: string,
): boolean =>
  Boolean(
    document?.fields.some(
      (field) =>
        field.key === key &&
        field.value !== null &&
        field.value !== "",
    ),
  );

const evidenceValue = <T,>(
  value: T | null | undefined,
  sourceLabel: string,
  confidence: EvidenceConfidence = "CONFIRMED",
): ProvenanceValue<T> | undefined => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return undefined;
  }

  return {
    value,
    sourceClass: "PROCEDURAL_DOCUMENT",
    sourceLabel,
    confidence,
  };
};

const accessLevelFromSource = (
  source: AuthorizedCreditorEvidence["source"],
): EvidenceAccessLevel =>
  source === "USER_PROVIDED"
    ? "USER_PROVIDED"
    : "AUTHORIZED";

const identityAvailability = (
  name: string | undefined,
): IdentityAvailability =>
  name ? "KNOWN" : "UNKNOWN";

const buildPositionsFromEvidence = (
  evidence: AuthorizedCreditorEvidence[],
): CreditorPosition[] => {
  const positions: CreditorPosition[] = [];

  for (const item of evidence) {
    const accessLevel =
      accessLevelFromSource(item.source);

    const primaryName =
      item.currentClaimHolder ??
      item.creditorName;

    if (
      primaryName ||
      item.creditorRole ||
      item.entityCategory ||
      item.amount !== undefined ||
      item.securedRank ||
      item.nplStatus
    ) {
      positions.push({
        id: `${item.evidenceId}-CREDITOR`,
        role:
          item.currentClaimHolder
            ? "CURRENT_CLAIM_HOLDER"
            : item.creditorRole ?? "OTHER",
        entityCategory:
          item.entityCategory ?? "UNKNOWN",
        identityAvailability:
          identityAvailability(primaryName),
        ...(evidenceValue(
          primaryName,
          item.sourceLabel,
        )
          ? {
              name: evidenceValue(
                primaryName,
                item.sourceLabel,
              ),
            }
          : {}),
        ...(evidenceValue(
          item.amount,
          item.sourceLabel,
        )
          ? {
              amount: evidenceValue(
                item.amount,
                item.sourceLabel,
              ),
            }
          : {}),
        ...(evidenceValue(
          item.securedRank,
          item.sourceLabel,
        )
          ? {
              securedRank: evidenceValue(
                item.securedRank,
                item.sourceLabel,
              ),
            }
          : {}),
        sourceDocumentIds:
          item.sourceDocumentId
            ? [item.sourceDocumentId]
            : [],
        accessLevel,
        ...(item.nplStatus
          ? {
              nplStatus: {
                value: item.nplStatus,
                sourceClass:
                  "PROCEDURAL_DOCUMENT",
                sourceLabel:
                  item.sourceLabel,
                confidence: "CONFIRMED",
                note:
                  "Stato NPL riportato esplicitamente dall'evidence autorizzata; non derivato dalla categoria dell'entità.",
              },
            }
          : {}),
      });
    }

    if (item.servicerName) {
      const primaryPositionId =
        positions.at(-1)?.id;

      positions.push({
        id: `${item.evidenceId}-SERVICER`,
        role: "SERVICER",
        entityCategory: "SERVICER",
        identityAvailability: "KNOWN",
        name: {
          value: item.servicerName,
          sourceClass:
            "PROCEDURAL_DOCUMENT",
          sourceLabel:
            item.sourceLabel,
          confidence: "CONFIRMED",
        },
        ...(primaryPositionId
          ? {
              relatedCreditorId:
                primaryPositionId,
            }
          : {}),
        sourceDocumentIds:
          item.sourceDocumentId
            ? [item.sourceDocumentId]
            : [],
        accessLevel,
      });
    }
  }

  return positions;
};

export function buildCreditorIntelligenceContext(input: {
  saleNotice?: ParsedDocument;
  ctu?: ParsedDocument;
  authorizedDocuments?: ParsedDocument[];
  authorizedCreditorEvidence?: AuthorizedCreditorEvidence[];
  authorizedEvidenceSources?: AuthorizedEvidenceSourceStatus[];
}): CreditorIntelligenceContext {
  const {
    saleNotice,
    ctu,
    authorizedDocuments = [],
    authorizedCreditorEvidence = [],
    authorizedEvidenceSources = [],
  } = input;

  const documentHasCreditorEvidence =
    authorizedDocuments.some(
      (document) =>
        hasFieldValue(
          document,
          "creditorName",
        ) ||
        hasFieldValue(
          document,
          "currentClaimHolder",
        ) ||
        hasFieldValue(
          document,
          "servicerName",
        ),
    );

  const positions =
    buildPositionsFromEvidence(
      authorizedCreditorEvidence,
    );

  const usableCreditorEvidence =
    documentHasCreditorEvidence ||
    positions.length > 0;

  const publicDocumentsPresent =
    Boolean(saleNotice || ctu);

  const sourceHasStructuredEvidence = (
    sourceId: string,
  ): boolean =>
    authorizedCreditorEvidence.some(
      (evidence) =>
        evidence.source.toLowerCase() ===
        sourceId.toLowerCase(),
    );

  return {
    positions,
    publicIdentityRestricted:
      publicDocumentsPresent &&
      !usableCreditorEvidence,
    requiresAuthorizedEvidence:
      !usableCreditorEvidence,
    authorizedEvidenceSources:
      authorizedEvidenceSources.map(
        (source) => ({
          ...source,
          evidenceAvailable:
            source.evidenceAvailable ||
            sourceHasStructuredEvidence(
              source.sourceId,
            ),
        }),
      ),
  };
}
