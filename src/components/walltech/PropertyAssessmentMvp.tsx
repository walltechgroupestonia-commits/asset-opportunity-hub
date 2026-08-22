import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPropertyOpportunity,
  type PropertyAssessmentDraft,
  type PropertyAssessmentProvenanceField,
} from "@/lib/walltech/opportunityFactory";
import { savePropertyOpportunity } from "@/lib/walltech/opportunityStore";
import { applyDocumentEvidenceToOpportunity } from "@/lib/walltech/documentEvidenceBridge";
import { buildProcedureIntelligenceContext } from "@/lib/walltech/procedureIntelligenceBridge";
import { buildCreditorIntelligenceContext } from "@/lib/walltech/creditorIntelligenceBridge";
import { buildPropertyStrategyContext } from "@/lib/walltech/propertyStrategyBridge";
import { PropertyDocumentIntake } from "@/components/walltech/PropertyDocumentIntake";
import type { PropertyDocumentEvidenceLayer } from "@/lib/walltech/propertyIntelligenceTypes";
import type { PvpPublicAcquisitionMetadata } from "@/lib/adapters/pvpEvidenceAcquisition.server";
import { createEnginePropertyCase } from "@/lib/walltech/engineCase.functions";

const DOCUMENTS = [
  "Avviso di vendita",
  "Ordinanza / Delega",
  "CTU / Perizia completa",
  "Allegati CTU",
  "Planimetria catastale",
  "Visure ipotecarie aggiornate",
];

const normalizePvpDate = (
  value?: string,
): string => {
  if (!value) return "";

  const raw = value.trim();

  const iso = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})/,
  );

  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const european = raw.match(
    /^(\d{2})[\/.-](\d{2})[\/.-](\d{4})/,
  );

  if (european) {
    return `${european[3]}-${european[2]}-${european[1]}`;
  }

  return "";
};

const normalizePvpTime = (
  value?: string,
): string => {
  if (!value) return "00:00";

  const match = value.trim().match(
    /(\d{1,2}):(\d{2})/,
  );

  if (!match) return "00:00";

  return `${match[1].padStart(2, "0")}:${match[2]}`;
};

const normalizePvpDateTime = (
  date?: string,
  time?: string,
): string => {
  const normalizedDate = normalizePvpDate(date);

  if (!normalizedDate) return "";

  return `${normalizedDate}T${normalizePvpTime(time)}`;
};

const inferPvpPropertyType = (
  metadata: PvpPublicAcquisitionMetadata,
): string => {
  const source = [
    metadata.lot.categoryLabel,
    metadata.lot.lotTypeLabel,
    ...metadata.goods.flatMap((item) => [
      item.assetTypeLabel,
      item.categoryLabel,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    source.includes("appart") ||
    source.includes("abitaz") ||
    source.includes("residen")
  ) {
    return "Appartamento";
  }

  if (
    source.includes("villa") ||
    source.includes("casa indipendente")
  ) {
    return "Villa";
  }

  if (source.includes("ufficio")) {
    return "Ufficio";
  }

  if (source.includes("terreno")) {
    return "Terreno";
  }

  if (
    source.includes("capann") ||
    source.includes("industrial") ||
    source.includes("logistic") ||
    source.includes("magazz")
  ) {
    return "Industriale";
  }

  if (
    source.includes("negozio") ||
    source.includes("commercial")
  ) {
    return "Commerciale";
  }

  return "";
};

const PVP_PROVENANCE_FIELDS: readonly PropertyAssessmentProvenanceField[] = [
  "address",
  "city",
  "province",
  "propertyType",
  "tribunal",
  "procedureNumber",
  "auctionDate",
  "offerDeadline",
  "basePrice",
  "minimumOffer",
];

const isPvpProvenanceField = (
  key: keyof PropertyAssessmentDraft,
): key is PropertyAssessmentProvenanceField =>
  PVP_PROVENANCE_FIELDS.includes(
    key as PropertyAssessmentProvenanceField,
  );

const INITIAL_DRAFT: PropertyAssessmentDraft = {
  title: "",
  address: "",
  city: "",
  province: "",
  propertyType: "",
  occupancy: "",
  tribunal: "",
  procedureNumber: "",
  auctionDate: "",
  offerDeadline: "",
  basePrice: "",
  minimumOffer: "",
  targetPurchasePrice: "",
  availableDocuments: [],
};

export function PropertyAssessmentMvp() {
  const navigate = useNavigate();
  const createEnginePropertyCaseFn =
    useServerFn(createEnginePropertyCase);
  const [draft, setDraft] =
    useState<PropertyAssessmentDraft>(INITIAL_DRAFT);
  const [documentEvidence, setDocumentEvidence] =
    useState<PropertyDocumentEvidenceLayer | null>(null);

  const [pvpMetadata, setPvpMetadata] =
    useState<PvpPublicAcquisitionMetadata | null>(null);

  const pvpOfficialFieldsRef =
    useRef<Set<PropertyAssessmentProvenanceField>>(
      new Set(),
    );

  const update = (
    key: keyof PropertyAssessmentDraft,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    if (isPvpProvenanceField(key)) {
      pvpOfficialFieldsRef.current.delete(key);
    }
  };

  const toggleDocument = (document: string) => {
    setDraft((current) => ({
      ...current,
      availableDocuments:
        current.availableDocuments.includes(document)
          ? current.availableDocuments.filter(
              (item) => item !== document,
            )
          : [...current.availableDocuments, document],
    }));
  };

  const applyPvpMetadataToDraft = (
    metadata: PvpPublicAcquisitionMetadata,
  ) => {
    setPvpMetadata(metadata);

    const primaryAddress =
      metadata.goods.find(
        (item) =>
          item.address?.raw ||
          item.address?.city ||
          item.address?.provinceCode,
      )?.address;

    const procedureNumber =
      metadata.procedure.number
        ? [
            metadata.procedure.number,
            metadata.procedure.year,
          ]
            .filter(
              (value) =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== "",
            )
            .join("/")
        : "";

    const propertyType =
      inferPvpPropertyType(metadata);

    const officialFields =
      new Set<PropertyAssessmentProvenanceField>();

    if (primaryAddress?.raw) {
      officialFields.add("address");
    }

    if (primaryAddress?.city) {
      officialFields.add("city");
    }

    if (primaryAddress?.provinceCode) {
      officialFields.add("province");
    }

    if (propertyType) {
      officialFields.add("propertyType");
    }

    if (metadata.procedure.courtLabel) {
      officialFields.add("tribunal");
    }

    if (procedureNumber) {
      officialFields.add("procedureNumber");
    }

    if (
      normalizePvpDateTime(
        metadata.sale.saleDate,
        metadata.sale.saleTime,
      )
    ) {
      officialFields.add("auctionDate");
    }

    if (
      normalizePvpDateTime(
        metadata.sale.offerDeadlineDate,
        metadata.sale.offerDeadlineTime,
      )
    ) {
      officialFields.add("offerDeadline");
    }

    if (metadata.sale.basePrice != null) {
      officialFields.add("basePrice");
    }

    if (metadata.sale.minimumOffer != null) {
      officialFields.add("minimumOffer");
    }

    pvpOfficialFieldsRef.current = officialFields;

    setDraft((current) => ({
      ...current,

      title:
        current.title ||
        [
          `PVP ${metadata.announcementId}`,
          primaryAddress?.city,
        ]
          .filter(Boolean)
          .join(" · "),

      address:
        primaryAddress?.raw ||
        current.address,

      city:
        primaryAddress?.city ||
        current.city,

      province:
        (
          primaryAddress?.provinceCode ||
          current.province
        ).toUpperCase(),

      propertyType:
        propertyType ||
        current.propertyType,

      tribunal:
        metadata.procedure.courtLabel ||
        current.tribunal,

      procedureNumber:
        procedureNumber ||
        current.procedureNumber,

      auctionDate:
        normalizePvpDateTime(
          metadata.sale.saleDate,
          metadata.sale.saleTime,
        ) ||
        current.auctionDate,

      offerDeadline:
        normalizePvpDateTime(
          metadata.sale.offerDeadlineDate,
          metadata.sale.offerDeadlineTime,
        ) ||
        current.offerDeadline,

      basePrice:
        metadata.sale.basePrice != null
          ? String(metadata.sale.basePrice)
          : current.basePrice,

      minimumOffer:
        metadata.sale.minimumOffer != null
          ? String(metadata.sale.minimumOffer)
          : current.minimumOffer,
    }));
  };

  const updateDocumentEvidence = (
    evidence: PropertyDocumentEvidenceLayer,
    detectedDocuments: string[],
    metadata?: PvpPublicAcquisitionMetadata,
  ) => {
    setDocumentEvidence(evidence);

    if (metadata) {
      applyPvpMetadataToDraft(metadata);
    }

    setDraft((current) => ({
      ...current,
      availableDocuments: Array.from(
        new Set([
          ...current.availableDocuments,
          ...detectedDocuments,
        ]),
      ),
    }));
  };

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const opportunity = createPropertyOpportunity(
      draft,
      {
        pvpAnnouncementId:
          pvpMetadata?.announcementId,
        officialPvpFields:
          Array.from(
            pvpOfficialFieldsRef.current,
          ),
      },
    );

    if (documentEvidence) {
      opportunity.documentEvidence = documentEvidence;
    }

    const enrichedOpportunity =
      applyDocumentEvidenceToOpportunity(opportunity);

    const evidenceDocuments =
      enrichedOpportunity.documentEvidence?.documents ?? [];

    const saleNoticeEvidence =
      evidenceDocuments.find(
        (document) =>
          document.parsedDocument?.kind ===
          "SALE_NOTICE",
      );

    const ctuEvidence =
      evidenceDocuments.find(
        (document) =>
          document.parsedDocument?.kind ===
          "CTU",
      );

    const saleHistoryEvidence =
      evidenceDocuments.find(
        (document) =>
          document.parsedDocument?.kind ===
          "SALE_HISTORY_ORDER",
      );

    if (
      pvpMetadata &&
      saleNoticeEvidence?.parsedDocument
    ) {
      enrichedOpportunity.procedureIntelligence =
        buildProcedureIntelligenceContext({
          pvp: pvpMetadata,
          saleNotice:
            saleNoticeEvidence.parsedDocument,
          saleNoticeDocumentId:
            saleNoticeEvidence.id,
          ...(ctuEvidence?.parsedDocument
            ? {
                ctu:
                  ctuEvidence.parsedDocument,
                ctuDocumentId:
                  ctuEvidence.id,
              }
            : {}),
          ...(saleHistoryEvidence?.parsedDocument
            ? {
                saleHistory:
                  saleHistoryEvidence.parsedDocument,
                saleHistoryDocumentId:
                  saleHistoryEvidence.id,
              }
            : {}),
        });
    }

    enrichedOpportunity.creditorIntelligence =
      buildCreditorIntelligenceContext({
        saleNotice:
          saleNoticeEvidence?.parsedDocument,
        ctu:
          ctuEvidence?.parsedDocument,
      });

    enrichedOpportunity.strategyContext =
      buildPropertyStrategyContext({
        procedureIntelligence:
          enrichedOpportunity.procedureIntelligence,
        creditorIntelligence:
          enrichedOpportunity.creditorIntelligence,
      });

    const persisted =
      await createEnginePropertyCaseFn({
        data: {
          opportunity: enrichedOpportunity,
        },
      });

    savePropertyOpportunity(
      persisted.opportunity,
    );

    void navigate({ to: "/decision" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna all'Engine
          </a>

          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              WALLTECH INTELLIGENCE ENGINE™
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Opportunity Assessment
            </p>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            OPPORTUNITY ASSESSMENT
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Costruisci il record dell'opportunità prima della decisione.
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Inserisci soltanto ciò che conosci. I dati dichiarati
            vengono registrati come input utente; ciò che manca resta
            esplicitamente mancante e dovrà essere verificato prima
            del Decision Gate.
          </p>
        </div>
      </section>

      <form onSubmit={submit}>
        <section className="py-12">
          <div className="container mx-auto grid gap-8 px-4 xl:grid-cols-[1fr_0.42fr]">
            <div className="space-y-8">
              <section className="border border-border bg-card/30 p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                      STEP 01
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                      Identificazione dell'opportunità
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">
                      Titolo opportunità
                    </Label>
                    <Input
                      id="title"
                      className="mt-2"
                      value={draft.title}
                      onChange={(event) =>
                        update("title", event.target.value)
                      }
                      placeholder="Es. Appartamento Milano · procedura 123/2026"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Indirizzo</Label>
                    <Input
                      id="address"
                      className="mt-2"
                      value={draft.address}
                      onChange={(event) =>
                        update("address", event.target.value)
                      }
                      placeholder="Via, numero civico"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Comune</Label>
                    <Input
                      id="city"
                      className="mt-2"
                      value={draft.city}
                      onChange={(event) =>
                        update("city", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="province">Provincia</Label>
                    <Input
                      id="province"
                      className="mt-2"
                      value={draft.province}
                      onChange={(event) =>
                        update(
                          "province",
                          event.target.value.toUpperCase(),
                        )
                      }
                      maxLength={2}
                      placeholder="MI"
                    />
                  </div>

                  <div>
                    <Label>Tipologia immobile</Label>
                    <Select
                      value={draft.propertyType}
                      onValueChange={(value) =>
                        update("propertyType", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Appartamento">
                          Appartamento
                        </SelectItem>
                        <SelectItem value="Villa">
                          Villa / Casa indipendente
                        </SelectItem>
                        <SelectItem value="Commerciale">
                          Commerciale
                        </SelectItem>
                        <SelectItem value="Ufficio">
                          Ufficio
                        </SelectItem>
                        <SelectItem value="Industriale">
                          Industriale / Logistica
                        </SelectItem>
                        <SelectItem value="Terreno">
                          Terreno
                        </SelectItem>
                        <SelectItem value="Altro">
                          Altro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Occupazione</Label>
                    <Select
                      value={draft.occupancy}
                      onValueChange={(value) =>
                        update("occupancy", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Dato non disponibile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Libero">
                          Libero
                        </SelectItem>
                        <SelectItem value="Occupato">
                          Occupato
                        </SelectItem>
                        <SelectItem value="Locato">
                          Locato
                        </SelectItem>
                        <SelectItem value="Da verificare">
                          Da verificare
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="border border-border bg-card/30 p-6">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                  STEP 02
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  Procedura e valori dichiarati
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Compila solo i campi applicabili. Un'opportunità può
                  essere salvata anche se questi dati non sono ancora
                  disponibili.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <Label htmlFor="tribunal">Tribunale</Label>
                    <Input
                      id="tribunal"
                      className="mt-2"
                      value={draft.tribunal}
                      onChange={(event) =>
                        update("tribunal", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="procedureNumber">
                      Numero procedura
                    </Label>
                    <Input
                      id="procedureNumber"
                      className="mt-2"
                      value={draft.procedureNumber}
                      onChange={(event) =>
                        update(
                          "procedureNumber",
                          event.target.value,
                        )
                      }
                      placeholder="Es. 131/2024 RGE"
                    />
                  </div>

                  <div>
                    <Label htmlFor="auctionDate">
                      Data asta
                    </Label>
                    <Input
                      id="auctionDate"
                      type="datetime-local"
                      className="mt-2"
                      value={draft.auctionDate}
                      onChange={(event) =>
                        update("auctionDate", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="offerDeadline">
                      Termine offerte
                    </Label>
                    <Input
                      id="offerDeadline"
                      type="datetime-local"
                      className="mt-2"
                      value={draft.offerDeadline}
                      onChange={(event) =>
                        update(
                          "offerDeadline",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="basePrice">
                      Prezzo base (€)
                    </Label>
                    <Input
                      id="basePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-2"
                      value={draft.basePrice}
                      onChange={(event) =>
                        update("basePrice", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="minimumOffer">
                      Offerta minima (€)
                    </Label>
                    <Input
                      id="minimumOffer"
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-2"
                      value={draft.minimumOffer}
                      onChange={(event) =>
                        update(
                          "minimumOffer",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="targetPurchasePrice">
                      Prezzo di acquisto ipotizzato (€)
                    </Label>
                    <Input
                      id="targetPurchasePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-2"
                      value={draft.targetPurchasePrice}
                      onChange={(event) =>
                        update(
                          "targetPurchasePrice",
                          event.target.value,
                        )
                      }
                    />
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      È un'assunzione dichiarata, non un valore
                      verificato né una stima generata dall'Engine.
                    </p>
                  </div>
                </div>
              </section>

              <section className="border border-border bg-card/30 p-6">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                      STEP 03
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">
                      Documentazione disponibile
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {DOCUMENTS.map((document) => (
                    <label
                      key={document}
                      className="flex cursor-pointer items-center gap-3 border border-border bg-background/70 p-4"
                    >
                      <input
                        type="checkbox"
                        checked={draft.availableDocuments.includes(
                          document,
                        )}
                        onChange={() => toggleDocument(document)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">
                        {document}
                      </span>
                    </label>
                  ))}
                </div>

                <PropertyDocumentIntake
                  onChange={updateDocumentEvidence}
                  onPvpDiscovery={
                    applyPvpMetadataToDraft
                  }
                />
              </section>
            </div>

            <aside className="xl:sticky xl:top-6 xl:h-fit">
              <div className="border border-border bg-card/30 p-6">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                  EVIDENCE POLICY
                </p>

                <div className="mt-5 space-y-4">
                  <div className="border border-border bg-background/70 p-4">
                    <p className="font-semibold">
                      Dati dichiarati
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      I valori inseriti qui vengono classificati come
                      USER_INPUT / REPORTED.
                    </p>
                  </div>

                  <div className="border border-border bg-background/70 p-4">
                    <p className="font-semibold">
                      Dati mancanti
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Nessun dato assente viene stimato o inventato:
                      resta MISSING fino all'acquisizione di evidence.
                    </p>
                  </div>

                  <div className="border border-border bg-background/70 p-4">
                    <p className="font-semibold">
                      Documenti
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Selezionati:{" "}
                      <strong className="text-foreground">
                        {draft.availableDocuments.length}
                      </strong>{" "}
                      / {DOCUMENTS.length}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 border border-primary/30 bg-primary/[0.04] p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    L'Assessment non produce ancora ROI né una
                    raccomandazione di investimento. Prepara il record
                    che verrà analizzato dal Property Intelligence
                    Engine.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="signal"
                  className="mt-6 w-full"
                >
                  Salva e analizza opportunità
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </aside>
          </div>
        </section>
      </form>
    </main>
  );
}
