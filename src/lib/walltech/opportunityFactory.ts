import type {
  PropertyOpportunityInput,
  ProvenanceValue,
} from "./propertyIntelligenceTypes";

export interface PropertyAssessmentDraft {
  title: string;
  address: string;
  city: string;
  province: string;
  propertyType: string;
  occupancy: string;
  tribunal: string;
  procedureNumber: string;
  auctionDate: string;
  offerDeadline: string;
  basePrice: string;
  minimumOffer: string;
  targetPurchasePrice: string;
  availableDocuments: string[];
}

export type PropertyAssessmentProvenanceField =
  | "address"
  | "city"
  | "province"
  | "propertyType"
  | "tribunal"
  | "procedureNumber"
  | "auctionDate"
  | "offerDeadline"
  | "basePrice"
  | "minimumOffer";

export interface PropertyAssessmentProvenanceContext {
  pvpAnnouncementId?: string;
  officialPvpFields?: PropertyAssessmentProvenanceField[];
}

const textValue = (
  value: string,
  label: string,
): ProvenanceValue<string> => {
  const normalized = value.trim();

  return {
    value: normalized || null,
    sourceClass: "USER_INPUT",
    sourceLabel: label,
    confidence: normalized ? "REPORTED" : "MISSING",
  };
};

const numberValue = (
  value: string,
  label: string,
): ProvenanceValue<number> => {
  const normalized = value.trim();
  const parsed = normalized === "" ? null : Number(normalized);
  const valid = parsed !== null && Number.isFinite(parsed);

  return {
    value: valid ? parsed : null,
    sourceClass: "USER_INPUT",
    sourceLabel: label,
    confidence: valid ? "REPORTED" : "MISSING",
  };
};

const missingValue = <T>(
  label: string,
): ProvenanceValue<T> => ({
  value: null,
  sourceClass: "ENGINE_INFERENCE",
  sourceLabel: label,
  confidence: "MISSING",
});

const numberOrNull = (value: string): number | null => {
  const normalized = value.trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export function createPropertyOpportunity(
  draft: PropertyAssessmentDraft,
  provenance: PropertyAssessmentProvenanceContext = {},
): PropertyOpportunityInput {
  const opportunityId = `WT-PROP-${Date.now()}`;

  const standardDocuments = [
    "Avviso di vendita",
    "Ordinanza / Delega",
    "CTU / Perizia completa",
    "Allegati CTU",
    "Planimetria catastale",
    "Visure ipotecarie aggiornate",
  ];

  const availableDocuments = Array.from(
    new Set(draft.availableDocuments),
  );

  const missingDocuments = standardDocuments.filter(
    (document) => !availableDocuments.includes(document),
  );

  const opportunity: PropertyOpportunityInput = {
    opportunityId,
    title:
      draft.title.trim() ||
      [draft.city.trim(), draft.address.trim()]
        .filter(Boolean)
        .join(" · ") ||
      "Nuova opportunità immobiliare",

    procedure: {
      tribunal: textValue(draft.tribunal, "Input utente"),
      procedureNumber: textValue(
        draft.procedureNumber,
        "Input utente",
      ),
      judge: missingValue<string>("Da acquisire"),
      delegate: missingValue<string>("Da acquisire"),
      delegatePhone: missingValue<string>("Da acquisire"),
      delegateAddress: missingValue<string>("Da acquisire"),
      custodian: missingValue<string>("Da acquisire"),
      auctionDate: textValue(draft.auctionDate, "Input utente"),
      offerDeadline: textValue(
        draft.offerDeadline,
        "Input utente",
      ),
      saleMode: missingValue<string>("Da acquisire"),
      basePrice: numberValue(draft.basePrice, "Input utente"),
      minimumOffer: numberValue(
        draft.minimumOffer,
        "Input utente",
      ),
      minimumBidIncrease: missingValue<number>("Da acquisire"),
      depositPercent: missingValue<number>("Da acquisire"),
      balanceDays: missingValue<number>("Da acquisire"),
    },

    asset: {
      address: textValue(draft.address, "Input utente"),
      city: textValue(draft.city, "Input utente"),
      province: textValue(draft.province, "Input utente"),
      propertyType: textValue(
        draft.propertyType,
        "Input utente",
      ),
      floor: missingValue<string>("Da acquisire"),
      rooms: missingValue<string>("Da acquisire"),
      occupancy: textValue(draft.occupancy, "Input utente"),
      cadastralSheet: missingValue<string>("Da acquisire"),
      cadastralParcel: missingValue<string>("Da acquisire"),
      cadastralSub: missingValue<string>("Da acquisire"),
      cadastralCategory: missingValue<string>("Da acquisire"),
      cadastralIncome: missingValue<number>("Da acquisire"),
      energyClass: missingValue<string>("Da acquisire"),
    },

    issues: missingDocuments.length
      ? [
          {
            id: "assessment-documents",
            area: "DOCUMENTATION",
            title: "Documentazione da completare",
            level: "HIGH",
            description:
              "L'Assessment iniziale non dispone ancora dell'intero set documentale necessario alla verifica.",
            sourceLabel: "Assessment",
            confidence: "CONFIRMED",
            blocking: false,
            nextCheck:
              "Acquisire e verificare i documenti mancanti prima del Decision Gate definitivo.",
          },
        ]
      : [],

    market: {
      officialDeclaredValuePerSqm:
        missingValue<number>("Fonte ufficiale da acquisire"),
      askingPricePerSqm:
        missingValue<number>("Dato di mercato da acquisire"),
      estimatedRentPerMonth:
        missingValue<number>("Analisi locativa da acquisire"),
      estimatedDaysOnMarket:
        missingValue<number>("Da acquisire"),
      areaServicesScore:
        missingValue<number>("Analisi area da acquisire"),
      safetyScore:
        missingValue<number>("Analisi area da acquisire"),
      parkingAvailability:
        missingValue<string>("Analisi parcheggi da acquisire"),
    },

    assumptions: {
      targetPurchasePrice: numberOrNull(
        draft.targetPurchasePrice,
      ),
      renovationCost: null,
      proceduralCosts: null,
      taxesAndTransferCosts: null,
      condominiumCosts: null,
      financeCosts: null,
      contingency: null,
      expectedSalePrice: null,
      expectedMonthlyRent: null,
      monthsToExit: null,
    },
  availableDocuments,
  missingDocuments,
  documentEvidence: {
    documents: [],
    crossChecks: [],
    globalWarnings: [],
  },
  };

  const officialFields = new Set(
    provenance.officialPvpFields ?? [],
  );

  const officialSourceLabel =
    provenance.pvpAnnouncementId
      ? `PVP ${provenance.pvpAnnouncementId} · fonte ufficiale`
      : "PVP · fonte ufficiale";

  const markOfficial = (
    value: ProvenanceValue<unknown>,
  ) => {
    if (value.value === null) return;

    value.sourceClass = "OFFICIAL";
    value.sourceLabel = officialSourceLabel;
    value.confidence = "CONFIRMED";
  };

  if (officialFields.has("tribunal")) {
    markOfficial(opportunity.procedure.tribunal);
  }

  if (officialFields.has("procedureNumber")) {
    markOfficial(opportunity.procedure.procedureNumber);
  }

  if (officialFields.has("auctionDate")) {
    markOfficial(opportunity.procedure.auctionDate);
  }

  if (officialFields.has("offerDeadline")) {
    markOfficial(opportunity.procedure.offerDeadline);
  }

  if (officialFields.has("basePrice")) {
    markOfficial(opportunity.procedure.basePrice);
  }

  if (officialFields.has("minimumOffer")) {
    markOfficial(opportunity.procedure.minimumOffer);
  }

  if (officialFields.has("address")) {
    markOfficial(opportunity.asset.address);
  }

  if (officialFields.has("city")) {
    markOfficial(opportunity.asset.city);
  }

  if (officialFields.has("province")) {
    markOfficial(opportunity.asset.province);
  }

  if (officialFields.has("propertyType")) {
    markOfficial(opportunity.asset.propertyType);
  }

  return opportunity;
}
