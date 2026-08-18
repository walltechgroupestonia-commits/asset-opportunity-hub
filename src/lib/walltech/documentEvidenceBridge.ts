import type {
  EvidenceConfidence,
  PropertyIssue,
  PropertyOpportunityInput,
  ProvenanceValue,
  SourceClass,
} from "./propertyIntelligenceTypes";
import type {
  Confidence,
  DocumentKind,
  ParsedField,
} from "./documentParserTypes";

interface EvidenceCandidate {
  field: ParsedField;
  kind: DocumentKind;
  sourceClass: SourceClass;
  sourceLabel: string;
}

type TargetArea = "procedure" | "asset" | "market";

interface FieldTarget {
  area: TargetArea;
  key: string;
}

const FIELD_TARGETS: Record<string, FieldTarget> = {
  procedureNumber: {
    area: "procedure",
    key: "procedureNumber",
  },
  judge: {
    area: "procedure",
    key: "judge",
  },
  delegate: {
    area: "procedure",
    key: "delegate",
  },
  auctionDate: {
    area: "procedure",
    key: "auctionDate",
  },
  offerDeadline: {
    area: "procedure",
    key: "offerDeadline",
  },
  basePrice: {
    area: "procedure",
    key: "basePrice",
  },
  minimumOffer: {
    area: "procedure",
    key: "minimumOffer",
  },
  minimumBidIncrease: {
    area: "procedure",
    key: "minimumBidIncrease",
  },
  depositPercent: {
    area: "procedure",
    key: "depositPercent",
  },
  balanceDays: {
    area: "procedure",
    key: "balanceDays",
  },
  saleMode: {
    area: "procedure",
    key: "saleMode",
  },

  ctuAuctionValue: {
    area: "procedure",
    key: "ctuAuctionValue",
  },
  forcedSaleAdjustmentPercent: {
    area: "procedure",
    key: "forcedSaleAdjustmentPercent",
  },

  address: {
    area: "asset",
    key: "address",
  },
  occupancy: {
    area: "asset",
    key: "occupancy",
  },
  cadastralSheet: {
    area: "asset",
    key: "cadastralSheet",
  },
  cadastralParcel: {
    area: "asset",
    key: "cadastralParcel",
  },
  cadastralSub: {
    area: "asset",
    key: "cadastralSub",
  },
  cadastralCategory: {
    area: "asset",
    key: "cadastralCategory",
  },
  cadastralIncome: {
    area: "asset",
    key: "cadastralIncome",
  },
  energyClass: {
    area: "asset",
    key: "energyClass",
  },
  surfaceSummary: {
    area: "asset",
    key: "surfaceSummary",
  },
  urbanCompliance: {
    area: "asset",
    key: "urbanCompliance",
  },
  cadastralCompliance: {
    area: "asset",
    key: "cadastralCompliance",
  },
  servitudes: {
    area: "asset",
    key: "servitudes",
  },

  ctuAppraisalValue: {
    area: "market",
    key: "ctuAppraisalValue",
  },
};

const confidenceToEvidence = (
  confidence: Confidence,
): EvidenceConfidence => {
  if (confidence === "HIGH") return "CONFIRMED";
  if (confidence === "MEDIUM") return "REPORTED";
  if (confidence === "LOW") return "ESTIMATED";
  return "MISSING";
};

const confidenceScore = (
  confidence: Confidence | EvidenceConfidence,
): number => {
  if (
    confidence === "HIGH" ||
    confidence === "CONFIRMED"
  ) {
    return 4;
  }

  if (
    confidence === "MEDIUM" ||
    confidence === "REPORTED"
  ) {
    return 3;
  }

  if (
    confidence === "LOW" ||
    confidence === "ESTIMATED"
  ) {
    return 2;
  }

  return 0;
};

const sourceScore = (
  sourceClass: SourceClass,
): number => {
  if (sourceClass === "OFFICIAL") return 500;
  if (sourceClass === "PROCEDURAL_DOCUMENT") return 400;
  if (sourceClass === "MARKET") return 300;
  if (sourceClass === "USER_INPUT") return 200;
  return 0;
};

const documentPriority = (
  fieldKey: string,
  kind: DocumentKind,
): number => {
  const target = FIELD_TARGETS[fieldKey];

  if (target?.area === "procedure") {
    if (kind === "SALE_NOTICE") return 40;
    if (kind === "DELEGATION_ORDER") return 30;
    if (kind === "CTU") return 20;
    return 10;
  }

  if (
    target?.area === "asset" ||
    target?.area === "market"
  ) {
    if (kind === "CTU") return 40;
    if (kind === "SALE_NOTICE") return 30;
    if (kind === "CADASTRAL") return 25;
    if (kind === "APE") return 25;
    return 10;
  }

  return 0;
};

const candidateScore = (
  candidate: EvidenceCandidate,
): number =>
  sourceScore(candidate.sourceClass) +
  documentPriority(
    candidate.field.key,
    candidate.kind,
  ) +
  confidenceScore(candidate.field.confidence);

const currentScore = (
  value: ProvenanceValue<unknown> | undefined,
): number => {
  if (!value || value.value === null) return -1;

  return (
    sourceScore(value.sourceClass) +
    confidenceScore(value.confidence)
  );
};

const sameValue = (
  left: unknown,
  right: unknown,
): boolean => {
  if (left === right) return true;

  if (
    typeof left === "number" &&
    typeof right === "number"
  ) {
    return Math.abs(left - right) < 0.000001;
  }

  const normalize = (value: unknown) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  return normalize(left) === normalize(right);
};

const asProvenanceValue = (
  candidate: EvidenceCandidate,
): ProvenanceValue<unknown> => ({
  value: candidate.field.value,
  sourceClass: candidate.sourceClass,
  sourceLabel: candidate.sourceLabel,
  confidence: confidenceToEvidence(
    candidate.field.confidence,
  ),
  ...(candidate.field.note
    ? { note: candidate.field.note }
    : {}),
});

const bestCandidate = (
  candidates: EvidenceCandidate[],
  key: string,
): EvidenceCandidate | undefined =>
  candidates
    .filter(
      (candidate) =>
        candidate.field.key === key &&
        candidate.field.confidence !== "MISSING" &&
        candidate.field.value !== null &&
        candidate.field.value !== "",
    )
    .sort(
      (a, b) =>
        candidateScore(b) - candidateScore(a),
    )[0];

const conflictIssue = (
  key: string,
  existing: ProvenanceValue<unknown>,
  candidate: EvidenceCandidate,
): PropertyIssue => ({
  id: `document-conflict-${key}`,
  area: "DOCUMENTATION",
  title: `Dato non coincidente: ${candidate.field.label}`,
  level: "MEDIUM",
  description:
    `Il valore già presente (${String(existing.value)}) ` +
    `non coincide con il valore documentale (${String(candidate.field.value)}). ` +
    "Il sistema mantiene traccia della discrepanza e richiede verifica prima del Decision Gate.",
  sourceLabel: candidate.sourceLabel,
  confidence: "CONFIRMED",
  blocking: false,
  nextCheck:
    `Verificare la discrepanza relativa a ${candidate.field.label} sulle fonti disponibili.`,
});

const buildCtuIssues = (
  candidates: EvidenceCandidate[],
): PropertyIssue[] => {
  const issues: PropertyIssue[] = [];

  const urban = bestCandidate(
    candidates,
    "urbanCompliance",
  );

  if (
    urban &&
    /non conforme|difformit/i.test(
      String(urban.field.value),
    )
  ) {
    issues.push({
      id: "ctu-urban-compliance",
      area: "URBAN",
      title:
        "Difformità urbanistico-edilizie rilevate nella CTU",
      level: "HIGH",
      description:
        String(urban.field.value) +
        ". La CTU costituisce evidence procedurale; regolarizzabilità, interventi e costi devono essere verificati da tecnico abilitato presso gli uffici competenti.",
      sourceLabel: urban.sourceLabel,
      confidence: confidenceToEvidence(
        urban.field.confidence,
      ),
      blocking: false,
      nextCheck:
        "Verificare conformità urbanistico-edilizia, titolo legittimante, possibilità di regolarizzazione e costi con tecnico abilitato.",
    });
  }

  const cadastral = bestCandidate(
    candidates,
    "cadastralCompliance",
  );

  if (
    cadastral &&
    /non conforme|difformit/i.test(
      String(cadastral.field.value),
    )
  ) {
    issues.push({
      id: "ctu-cadastral-compliance",
      area: "CADASTRAL",
      title:
        "Difformità catastali rilevate nella CTU",
      level: "HIGH",
      description:
        String(cadastral.field.value) +
        ". Occorre verificare planimetrie, identificativi catastali e stato di fatto con professionista abilitato.",
      sourceLabel: cadastral.sourceLabel,
      confidence: confidenceToEvidence(
        cadastral.field.confidence,
      ),
      blocking: false,
      nextCheck:
        "Verificare conformità catastale e corrispondenza con lo stato di fatto.",
    });
  }

  const occupancy = bestCandidate(
    candidates,
    "occupancy",
  );

  if (
    occupancy &&
    /senza titolo/i.test(
      String(occupancy.field.value),
    )
  ) {
    issues.push({
      id: "ctu-occupancy-without-title",
      area: "OCCUPANCY",
      title:
        "Occupazione da parte di terzi senza titolo rilevata nella CTU",
      level: "HIGH",
      description:
        "La CTU riferisce che l'immobile risulta occupato da terzi senza titolo. Lo stato deve essere verificato alla data corrente e distinto per ciascun corpo o unità.",
      sourceLabel: occupancy.sourceLabel,
      confidence: confidenceToEvidence(
        occupancy.field.confidence,
      ),
      blocking: false,
      nextCheck:
        "Verificare stato attuale di occupazione, soggetti presenti, titolo opponibile e tempi/modalità di liberazione con i professionisti competenti.",
    });
  }

  return issues;
};

export function applyDocumentEvidenceToOpportunity(
  input: PropertyOpportunityInput,
): PropertyOpportunityInput {
  const layer = input.documentEvidence;

  if (!layer?.documents.length) {
    return input;
  }

  const candidates: EvidenceCandidate[] = [];

  for (const document of layer.documents) {
    const parsed = document.parsedDocument;
    if (!parsed) continue;

    const sourceClass =
      document.provenance?.sourceClass ??
      "PROCEDURAL_DOCUMENT";

    for (const field of parsed.fields) {
      candidates.push({
        field,
        kind: parsed.kind,
        sourceClass,
        sourceLabel:
          field.sourceLabel ||
          document.provenance?.sourceLabel ||
          document.fileName,
      });
    }
  }

  const next: PropertyOpportunityInput = {
    ...input,
    procedure: {
      ...input.procedure,
    },
    asset: {
      ...input.asset,
    },
    market: {
      ...input.market,
    },
    issues: [...input.issues],
  };

  const conflicts: PropertyIssue[] = [];

  for (const [
    parsedKey,
    target,
  ] of Object.entries(FIELD_TARGETS)) {
    const candidate = bestCandidate(
      candidates,
      parsedKey,
    );

    if (!candidate) continue;

    const container = next[target.area] as Record<
      string,
      ProvenanceValue<unknown>
    >;

    const existing = container[target.key];

    if (
      existing?.value !== null &&
      existing?.value !== undefined &&
      !sameValue(
        existing.value,
        candidate.field.value,
      )
    ) {
      conflicts.push(
        conflictIssue(
          target.key,
          existing,
          candidate,
        ),
      );
    }

    if (
      !existing ||
      candidateScore(candidate) >
        currentScore(existing)
    ) {
      container[target.key] =
        asProvenanceValue(candidate);
    }
  }

  const derivedIssues = [
    ...buildCtuIssues(candidates),
    ...conflicts,
  ];

  const issueMap = new Map<string, PropertyIssue>();

  for (const issue of [
    ...next.issues,
    ...derivedIssues,
  ]) {
    issueMap.set(issue.id, issue);
  }

  next.issues = Array.from(issueMap.values());

  return next;
}
