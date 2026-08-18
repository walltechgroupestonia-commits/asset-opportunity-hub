import type {
  AuthorizedCreditorEvidence,
  AuthorizedEvidenceAdapter,
  AuthorizedEvidenceQuery,
  ConnectionTestResult,
  PartnerFeedCredentials,
} from "./types";

function pendingConnectionResult(
  sourceUrl: string,
): ConnectionTestResult {
  return {
    status: "PENDING AGREEMENT",
    timestamp: new Date().toISOString(),
    sourceUrl,
    connectionType: "Not available",
    mode: "AWAITING AGREEMENT",
    note:
      "Fonte autorizzata non connessa. Nessun dato viene simulato o inferito.",
  };
}

function createPendingAuthorizedEvidenceAdapter(
  id: string,
  name: string,
  sourceUrl: string,
): AuthorizedEvidenceAdapter {
  return {
    id,
    name,

    async connect(
      _credentials: PartnerFeedCredentials,
    ): Promise<ConnectionTestResult> {
      return pendingConnectionResult(sourceUrl);
    },

    async fetchCreditorEvidence(
      _query: AuthorizedEvidenceQuery,
    ): Promise<AuthorizedCreditorEvidence[]> {
      return [];
    },

    disconnect(): void {
      // Adapter non connesso: nessuno stato runtime da resettare.
    },
  };
}

export const pstAuthorizedEvidenceAdapter =
  createPendingAuthorizedEvidenceAdapter(
    "pst",
    "PST — Portale Servizi Telematici",
    "https://pst.giustizia.it/",
  );

export const sisterAuthorizedEvidenceAdapter =
  createPendingAuthorizedEvidenceAdapter(
    "sister",
    "SISTER — Servizi Catastali e Ipotecari",
    "https://sister.agenziaentrate.gov.it/",
  );

export const AUTHORIZED_EVIDENCE_ADAPTERS:
  AuthorizedEvidenceAdapter[] = [
    pstAuthorizedEvidenceAdapter,
    sisterAuthorizedEvidenceAdapter,
  ];

export function getAuthorizedEvidenceAdapter(
  id: string,
): AuthorizedEvidenceAdapter | undefined {
  return AUTHORIZED_EVIDENCE_ADAPTERS.find(
    (adapter) => adapter.id === id,
  );
}
