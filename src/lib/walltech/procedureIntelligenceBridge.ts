import type { PvpPublicAcquisitionMetadata } from "../adapters/pvpEvidenceAcquisition.server";
import type {
  EvidenceConfidence,
  ProcedureActor,
  ProcedureActorRole,
  ProcedureIntelligenceContext,
  ProcedureTypeCode,
  ProvenanceValue,
  SourceClass,
} from "./propertyIntelligenceTypes";
import type {
  ParsedDocument,
  ParsedField,
} from "./documentParserTypes";

const pv = <T,>(
  value: T | null | undefined,
  sourceLabel: string,
  sourceClass: SourceClass = "OFFICIAL",
): ProvenanceValue<T> => ({
  value: value ?? null,
  sourceClass,
  sourceLabel,
  confidence:
    value === null || value === undefined || value === ""
      ? "MISSING"
      : "CONFIRMED",
});

const fieldValue = <T = string>(
  document: ParsedDocument | undefined,
  key: string,
): T | null => {
  const field = document?.fields.find(
    (item: ParsedField) => item.key === key,
  );

  return (field?.value as T | null | undefined) ?? null;
};

const parsedConfidence = (
  field: ParsedField | undefined,
): EvidenceConfidence => {
  if (!field || field.confidence === "MISSING") {
    return "MISSING";
  }

  if (field.confidence === "HIGH") {
    return "CONFIRMED";
  }

  if (field.confidence === "MEDIUM") {
    return "REPORTED";
  }

  return "ESTIMATED";
};

const fieldProvenance = <T = string>(
  document: ParsedDocument | undefined,
  key: string,
): ProvenanceValue<T> | undefined => {
  const parsed = document?.fields.find(
    (item: ParsedField) => item.key === key,
  );

  if (!parsed) return undefined;

  return {
    value:
      (parsed.value as T | null | undefined) ??
      null,
    sourceClass: "PROCEDURAL_DOCUMENT",
    sourceLabel:
      parsed.sourceLabel || document?.title || "Documento procedurale",
    confidence: parsedConfidence(parsed),
    ...(parsed.note
      ? { note: parsed.note }
      : {}),
  };
};

const normalizeProcedureType = (
  pvp: PvpPublicAcquisitionMetadata,
  saleNotice?: ParsedDocument,
): ProcedureTypeCode => {
  const fromNotice =
    fieldValue<string>(saleNotice, "procedureType");

  if (
    fromNotice === "JUDICIAL_LIQUIDATION" ||
    fromNotice === "REAL_ESTATE_ENFORCEMENT"
  ) {
    return fromNotice;
  }

  const label =
    pvp.procedure.procedureTypeLabel?.toLowerCase() ?? "";

  if (label.includes("liquidazione giudiziale")) {
    return "JUDICIAL_LIQUIDATION";
  }

  if (
    label.includes("esecuzione") ||
    label.includes("espropriazione")
  ) {
    return "REAL_ESTATE_ENFORCEMENT";
  }

  return "UNKNOWN";
};

const actor = (
  id: string,
  role: ProcedureActorRole,
  roleLabel: string,
  name: string | null,
  procedureRefId: string,
  saleEventId: string,
  sourceDocumentId: string,
): ProcedureActor | null => {
  if (!name) return null;

  return {
    id,
    role,
    roleLabel,
    name: pv(name, "Avviso di vendita"),
    procedureRefIds: [procedureRefId],
    saleEventIds: [saleEventId],
    sourceDocumentIds: [sourceDocumentId],
  };
};

export function buildProcedureIntelligenceContext(input: {
  pvp: PvpPublicAcquisitionMetadata;
  saleNotice: ParsedDocument;
  saleNoticeDocumentId: string;
  ctu?: ParsedDocument;
  ctuDocumentId?: string;
  saleHistory?: ParsedDocument;
  saleHistoryDocumentId?: string;
}): ProcedureIntelligenceContext {
  const {
    pvp,
    saleNotice,
    saleNoticeDocumentId,
    ctu,
    ctuDocumentId,
    saleHistory,
    saleHistoryDocumentId,
  } = input;

  const procedureRefId =
    `PVP-PROC-${pvp.procedure.id ?? `${pvp.procedure.number ?? "UNKNOWN"}-${pvp.procedure.year ?? "UNKNOWN"}`}`;

  const saleEventId =
    `PVP-SALE-${pvp.announcementId}`;

  const currentLotFromNotice =
    fieldValue<string>(saleNotice, "currentLot");

  const pvpLotLabel =
    pvp.lot.code ??
    pvp.lot.description ??
    (pvp.lot.id != null
      ? String(pvp.lot.id)
      : "UNKNOWN");

  const lotId =
    pvp.lot.id != null
      ? `PVP-LOT-${pvp.lot.id}`
      : `PVP-LOT-${currentLotFromNotice ?? pvpLotLabel}`;

  const procedureType =
    normalizeProcedureType(pvp, saleNotice);

  const procedureNumberFromNotice =
    fieldValue<string>(
      saleNotice,
      "procedureNumber",
    );

  const experimentNumber =
    fieldValue<number>(
      saleNotice,
      "experimentNumber",
    );

  const currentLotConfirmed =
    currentLotFromNotice !== null;

  const historyLotNumber =
    fieldValue<string>(
      saleHistory,
      "historyLotNumber",
    );

  const historyMatchesCurrentLot =
    currentLotFromNotice !== null &&
    historyLotNumber !== null &&
    String(Number(currentLotFromNotice)) ===
      String(Number(historyLotNumber));

  const previousExperimentsWithoutOutcome =
    fieldValue<number>(
      saleHistory,
      "previousExperimentsWithoutOutcome",
    );

  const previousBasePrice =
    fieldValue<number>(
      saleHistory,
      "previousBasePrice",
    );

  const nextExperimentNumber =
    fieldValue<number>(
      saleHistory,
      "nextExperimentNumber",
    );

  const nextBasePrice =
    fieldValue<number>(
      saleHistory,
      "nextBasePrice",
    );

  const nextMinimumBidIncrease =
    fieldValue<number>(
      saleHistory,
      "nextMinimumBidIncrease",
    );

  const historyAuthorizationDate =
    fieldValue<string>(
      saleHistory,
      "authorizationDate",
    );

  const historyAuthorizationGranted =
    fieldValue<boolean>(
      saleHistory,
      "authorizationGranted",
    );

  const ctuLotNumber =
    fieldValue<string>(ctu, "ctuLotNumber");

  const ctuMatchesCurrentLot =
    currentLotFromNotice !== null &&
    ctuLotNumber !== null &&
    String(Number(currentLotFromNotice)) ===
      String(Number(ctuLotNumber));

  const pvpAssetIds = pvp.goods.map((good, index) =>
    good.id != null
      ? `PVP-ASSET-${good.id}`
      : `PVP-ASSET-${pvp.announcementId}-${index + 1}`,
  );

  const ctuBodyCodes = ctuMatchesCurrentLot
    ? [
        ...new Set(
          (ctu?.fields ?? [])
            .map((item) =>
              item.key.match(/^ctuBody:([^:]+):/)?.[1],
            )
            .filter((value): value is string => Boolean(value)),
        ),
      ]
    : [];

  const hasStructuredCtuBodies =
    ctuBodyCodes.length > 1;

  const assetIds = hasStructuredCtuBodies
    ? ctuBodyCodes.map(
        (code) => `CTU-ASSET-${lotId}-${code}`,
      )
    : pvpAssetIds;

  const actors = [
    actor(
      `ACTOR-${saleEventId}-JUDGE`,
      "DELEGATED_JUDGE",
      "Giudice Delegato",
      fieldValue<string>(saleNotice, "judge"),
      procedureRefId,
      saleEventId,
      saleNoticeDocumentId,
    ),
    actor(
      `ACTOR-${saleEventId}-CURATOR`,
      "CURATOR",
      "Curatore",
      fieldValue<string>(saleNotice, "curator"),
      procedureRefId,
      saleEventId,
      saleNoticeDocumentId,
    ),
    actor(
      `ACTOR-${saleEventId}-SPECIALIST`,
      "SALE_SPECIALIST",
      "Soggetto specializzato / banditore",
      fieldValue<string>(
        saleNotice,
        "saleSpecialist",
      ),
      procedureRefId,
      saleEventId,
      saleNoticeDocumentId,
    ),
    actor(
      `ACTOR-${saleEventId}-PLATFORM`,
      "SALE_PLATFORM_MANAGER",
      "Gestore piattaforma vendita",
      fieldValue<string>(
        saleNotice,
        "salePlatform",
      ),
      procedureRefId,
      saleEventId,
      saleNoticeDocumentId,
    ),
  ].filter(
    (item): item is ProcedureActor =>
      item !== null,
  );

  return {
    jurisdiction: {
      countryCode:
        pvp.goods[0]?.address?.countryCode ??
        "ITA",
      countryName:
        pvp.goods[0]?.address?.country ??
        "Italia",
    },

    procedures: [
      {
        id: procedureRefId,
        number: pv(
          procedureNumberFromNotice ??
            (
              pvp.procedure.number &&
              pvp.procedure.year
                ? `${pvp.procedure.number}/${pvp.procedure.year}`
                : pvp.procedure.number
            ) ??
            null,
          "Avviso di vendita / PVP",
        ),
        registry: pv(
          pvp.procedure.registryLabel ??
            pvp.procedure.registryCode ??
            null,
          "Portale delle Vendite Pubbliche",
        ),
        court: pv(
          pvp.procedure.courtLabel ??
            null,
          "Portale delle Vendite Pubbliche",
        ),
        procedureType: {
          code: procedureType,
          officialLabel: pv(
            pvp.procedure.procedureTypeLabel ??
              fieldValue<string>(
                saleNotice,
                "procedureType",
              ),
            "Avviso di vendita / PVP",
          ),
        },
        relation: "PRIMARY",
      },
    ],

    actors,

    saleEvents: [
      {
        saleEventId,
        procedureRefIds: [procedureRefId],
        announcementId: pvp.announcementId,
        announcementDate: pv(
          pvp.sale.publicationDate ?? null,
          "Portale delle Vendite Pubbliche",
        ),
        saleDate: pv(
          fieldValue<string>(
            saleNotice,
            "auctionDate",
          ) ??
            (
              pvp.sale.saleDate
                ? `${pvp.sale.saleDate}${pvp.sale.saleTime ? ` ${pvp.sale.saleTime}` : ""}`
                : null
            ),
          "Avviso di vendita",
        ),
        experimentLabel: pv(
          experimentNumber != null
            ? `Esperimento ${experimentNumber}`
            : null,
          "Avviso di vendita",
        ),
        status: "SCHEDULED",
        activeLotIds:
          currentLotConfirmed
            ? [lotId]
            : [],
        previousAnnouncementIds: [],
        history:
          saleHistoryDocumentId &&
          saleHistory &&
          historyMatchesCurrentLot
            ? [
                ...(previousExperimentsWithoutOutcome !== null
                  ? [
                      {
                        historyEventId:
                          `${saleEventId}-HISTORY-PREVIOUS`,
                        experimentLabel: pv(
                          `Esperimenti 1-${previousExperimentsWithoutOutcome}`,
                          "Provvedimento storico vendite",
                          "PROCEDURAL_DOCUMENT",
                        ),
                        status: "DESERTED" as const,
                        lotIds: [lotId],
                        ...(previousBasePrice !== null
                          ? {
                              basePrice: pv(
                                previousBasePrice,
                                "Provvedimento storico vendite",
                                "PROCEDURAL_DOCUMENT",
                              ),
                            }
                          : {}),
                        sourceDocumentIds: [
                          saleHistoryDocumentId,
                        ],
                        note:
                          `Il documento attesta ${previousExperimentsWithoutOutcome} esperimenti precedenti senza esito. ` +
                          "L'eventuale base precedente riportata si riferisce all'ultimo esperimento richiamato; non vengono inventati announcement ID storici.",
                      },
                    ]
                  : []),
                ...(nextExperimentNumber !== null
                  ? [
                      {
                        historyEventId:
                          `${saleEventId}-HISTORY-${nextExperimentNumber}-AUTH`,
                        experimentNumber:
                          nextExperimentNumber,
                        experimentLabel: pv(
                          `Esperimento ${nextExperimentNumber}`,
                          "Provvedimento storico vendite",
                          "PROCEDURAL_DOCUMENT",
                        ),
                        status:
                          historyAuthorizationGranted === true
                            ? ("SCHEDULED" as const)
                            : ("UNKNOWN" as const),
                        lotIds: [lotId],
                        ...(nextBasePrice !== null
                          ? {
                              basePrice: pv(
                                nextBasePrice,
                                "Provvedimento storico vendite",
                                "PROCEDURAL_DOCUMENT",
                              ),
                            }
                          : {}),
                        ...(nextMinimumBidIncrease !== null
                          ? {
                              minimumBidIncrease: pv(
                                nextMinimumBidIncrease,
                                "Provvedimento storico vendite",
                                "PROCEDURAL_DOCUMENT",
                              ),
                            }
                          : {}),
                        ...(historyAuthorizationDate !== null
                          ? {
                              authorizationDate: pv(
                                historyAuthorizationDate,
                                "Provvedimento storico vendite",
                                "PROCEDURAL_DOCUMENT",
                              ),
                            }
                          : {}),
                        sourceDocumentIds: [
                          saleHistoryDocumentId,
                        ],
                        note:
                          historyAuthorizationGranted === true
                            ? "Nuovo esperimento autorizzato secondo i dati estratti dal provvedimento."
                            : "Nuovo esperimento rilevato nel documento, ma autorizzazione non confermata dal parser.",
                      },
                    ]
                  : []),
              ]
            : undefined,
        noticeDocumentId:
          saleNoticeDocumentId,
      },
    ],

    lots: [
      {
        lotId,
        label: pv(
          currentLotFromNotice
            ? `LOTTO ${currentLotFromNotice}`
            : pvpLotLabel,
          currentLotConfirmed
            ? "Avviso di vendita"
            : "Portale delle Vendite Pubbliche",
        ),
        saleScope:
          currentLotConfirmed
            ? "CURRENT"
            : "UNKNOWN",
        assetIds,
        sourceDocumentIds: [
          saleNoticeDocumentId,
          ...(ctuMatchesCurrentLot && ctuDocumentId
            ? [ctuDocumentId]
            : []),
        ],
      },
    ],

    assets: hasStructuredCtuBodies
      ? ctuBodyCodes.map((code) => {
          const baseGood = pvp.goods[0];

          return {
            assetId: `CTU-ASSET-${lotId}-${code}`,
            lotId,
            label:
              fieldValue<string>(
                ctu,
                `ctuBody:${code}:label`,
              ) ?? `Corpo ${code}`,
            address: baseGood?.address
              ? {
                  street: pv(
                    fieldValue<string>(
                      saleNotice,
                      "address",
                    ) ??
                      baseGood.address.raw ??
                      null,
                    fieldValue<string>(
                      saleNotice,
                      "address",
                    )
                      ? "Avviso di vendita"
                      : "Portale delle Vendite Pubbliche",
                  ),
                  postalCode: pv(
                    baseGood.address.postalCode ?? null,
                    "Portale delle Vendite Pubbliche",
                  ),
                  city: pv(
                    baseGood.address.city ?? null,
                    "Portale delle Vendite Pubbliche",
                  ),
                  province: pv(
                    baseGood.address.province ??
                      baseGood.address.provinceCode ??
                      null,
                    "Portale delle Vendite Pubbliche",
                  ),
                  country: pv(
                    baseGood.address.country ??
                      baseGood.address.countryCode ??
                      null,
                    "Portale delle Vendite Pubbliche",
                  ),
                }
              : undefined,
            cadastralBodies: [
              {
                id: `CTU-CADASTRAL-${lotId}-${code}`,
                sheet: fieldProvenance<string>(
                  ctu,
                  `ctuBody:${code}:sheet`,
                ),
                parcel: fieldProvenance<string>(
                  ctu,
                  `ctuBody:${code}:parcel`,
                ),
                sub: fieldProvenance<string>(
                  ctu,
                  `ctuBody:${code}:sub`,
                ),
                category: fieldProvenance<string>(
                  ctu,
                  `ctuBody:${code}:category`,
                ),
                cadastralIncome:
                  fieldProvenance<string | number>(
                    ctu,
                    `ctuBody:${code}:income`,
                  ),
                surfaceSummary:
                  fieldProvenance<string>(
                    ctu,
                    `ctuBody:${code}:surface`,
                  ),
              },
            ],
            sourceDocumentIds: [
              saleNoticeDocumentId,
              ...(ctuDocumentId
                ? [ctuDocumentId]
                : []),
            ],
          };
        })
      : pvp.goods.map((good, index) => ({
          assetId: pvpAssetIds[index],
          lotId,
          label:
            good.assetTypeLabel ??
            good.description ??
            `Asset ${index + 1}`,
          address: good.address
            ? {
                street: pv(
                  fieldValue<string>(
                    saleNotice,
                    "address",
                  ) ??
                    good.address.raw ??
                    null,
                  fieldValue<string>(
                    saleNotice,
                    "address",
                  )
                    ? "Avviso di vendita"
                    : "Portale delle Vendite Pubbliche",
                ),
                postalCode: pv(
                  good.address.postalCode ?? null,
                  "Portale delle Vendite Pubbliche",
                ),
                city: pv(
                  good.address.city ?? null,
                  "Portale delle Vendite Pubbliche",
                ),
                province: pv(
                  good.address.province ??
                    good.address.provinceCode ??
                    null,
                  "Portale delle Vendite Pubbliche",
                ),
                country: pv(
                  good.address.country ??
                    good.address.countryCode ??
                    null,
                  "Portale delle Vendite Pubbliche",
                ),
              }
            : undefined,
          cadastralBodies:
            ctuMatchesCurrentLot
              ? [
                  {
                    id: `CTU-CADASTRAL-${lotId}`,
                    sheet: fieldProvenance<string>(
                      ctu,
                      "cadastralSheet",
                    ),
                    parcel: fieldProvenance<string>(
                      ctu,
                      "cadastralParcel",
                    ),
                    sub: fieldProvenance<string>(
                      ctu,
                      "cadastralSub",
                    ),
                    category: fieldProvenance<string>(
                      ctu,
                      "cadastralCategory",
                    ),
                    cadastralIncome:
                      fieldProvenance<string | number>(
                        ctu,
                        "cadastralIncome",
                      ),
                    surfaceSummary:
                      fieldProvenance<string>(
                        ctu,
                        "surfaceSummary",
                      ),
                  },
                ]
              : [],
          occupancy:
            ctuMatchesCurrentLot
              ? fieldProvenance<string>(
                  ctu,
                  "occupancy",
                )
              : undefined,
          energyClass:
            ctuMatchesCurrentLot
              ? fieldProvenance<string>(
                  ctu,
                  "energyClass",
                )
              : undefined,
          urbanCompliance:
            ctuMatchesCurrentLot
              ? fieldProvenance<string>(
                  ctu,
                  "urbanCompliance",
                )
              : undefined,
          cadastralCompliance:
            ctuMatchesCurrentLot
              ? fieldProvenance<string>(
                  ctu,
                  "cadastralCompliance",
                )
              : undefined,
          servitudes:
            ctuMatchesCurrentLot
              ? fieldProvenance<string>(
                  ctu,
                  "servitudes",
                )
              : undefined,
          sourceDocumentIds: [
            saleNoticeDocumentId,
            ...(ctuMatchesCurrentLot && ctuDocumentId
              ? [ctuDocumentId]
              : []),
          ],
        })),

    documentScopes: [
      {
        documentEvidenceId:
          saleNoticeDocumentId,
        scope: "CURRENT_SALE",
        procedureRefIds: [procedureRefId],
        saleEventIds: [saleEventId],
        lotIds:
          currentLotConfirmed
            ? [lotId]
            : [],
        assetIds:
          currentLotConfirmed
            ? assetIds
            : [],
        note:
          "L'Avviso di vendita corrente determina il perimetro della vendita corrente. L'assenza di altri lotti dall'Avviso non costituisce prova del loro esito.",
      },
      ...(ctu && ctuDocumentId
        ? [
            {
              documentEvidenceId: ctuDocumentId,
              scope: ctuMatchesCurrentLot
                ? ("CURRENT_SALE" as const)
                : ("UNRESOLVED" as const),
              procedureRefIds: [procedureRefId],
              saleEventIds: ctuMatchesCurrentLot
                ? [saleEventId]
                : [],
              lotIds: ctuMatchesCurrentLot
                ? [lotId]
                : [],
              assetIds: ctuMatchesCurrentLot
                ? assetIds
                : [],
              note: ctuMatchesCurrentLot
                ? `CTU associata al lotto corrente: CTU lotto ${ctuLotNumber} = Avviso lotto ${currentLotFromNotice}.`
                : `CTU non assegnata al current sale scope: CTU lotto ${ctuLotNumber ?? "non determinato"}; Avviso lotto ${currentLotFromNotice ?? "non determinato"}. Nessun esito viene inferito.`,
            },
          ]
        : []),
    ],

    currentSaleEventId: saleEventId,
  };
}
