import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { extractPdfText } from "@/lib/walltech/pdfTextExtractor";
import { runDocumentIntelligence } from "@/lib/walltech/documentIntelligenceEngine";
import {
  acquirePvpDocument,
  discoverPvpSale,
} from "@/lib/adapters/pvpAdapter.functions";
import { crossCheckDocuments } from "@/lib/walltech/documentCrossCheck";
import type { DocumentKind } from "@/lib/walltech/documentParserTypes";
import type {
  PropertyDocumentEvidence,
  PropertyDocumentEvidenceLayer,
} from "@/lib/walltech/propertyIntelligenceTypes";
import type {
  PvpPublicAcquisitionMetadata,
} from "@/lib/adapters/pvpEvidenceAcquisition.server";

interface PropertyDocumentIntakeProps {
  onChange: (
    evidence: PropertyDocumentEvidenceLayer,
    detectedDocuments: string[],
    pvpMetadata?: PvpPublicAcquisitionMetadata,
  ) => void;
  onPvpDiscovery?: (
    metadata: PvpPublicAcquisitionMetadata,
  ) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const standardDocumentLabel = (
  kind: DocumentKind,
): string | null => {
  if (kind === "SALE_NOTICE") return "Avviso di vendita";
  if (
    kind === "DELEGATION_ORDER" ||
    kind === "SALE_HISTORY_ORDER"
  )
    return "Ordinanza / Delega";
  if (kind === "CTU") return "CTU / Perizia completa";
  if (kind === "PLAN") return "Planimetria catastale";
  return null;
};

const statusLabel = (
  document: PropertyDocumentEvidence,
) => {
  if (document.status === "ANALYZED") return "ANALIZZATO";
  if (document.status === "UNREADABLE") return "NON LEGGIBILE";
  if (document.status === "ERROR") return "ERRORE";
  if (document.parsedDocument) return "CLASSIFICATO";
  return "ACQUISITO";
};

export function PropertyDocumentIntake({
  onChange,
  onPvpDiscovery,
}: PropertyDocumentIntakeProps) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] =
    useState<PropertyDocumentEvidenceLayer | null>(null);

  const [pvpAnnouncementId, setPvpAnnouncementId] =
    useState("");

  const [pvpMetadata, setPvpMetadata] =
    useState<PvpPublicAcquisitionMetadata | null>(null);
  const [pvpAttachments, setPvpAttachments] = useState<
    Array<{
      id: number;
      fileName: string;
      size: number;
      typeCode?: string;
    }>
  >([]);
  const [pvpDiscovering, setPvpDiscovering] =
    useState(false);
  const [pvpAcquiringId, setPvpAcquiringId] =
    useState<number | null>(null);
  const [pvpError, setPvpError] =
    useState<string | null>(null);

  const discoverPvpSaleFn =
    useServerFn(discoverPvpSale);
  const acquirePvpDocumentFn =
    useServerFn(acquirePvpDocument);

  const mergePvpEvidence = (
    incoming: PropertyDocumentEvidence,
  ) => {
    const existingDocuments =
      result?.documents ?? [];

    const mergedDocuments = [
      ...existingDocuments,
      incoming,
    ].filter(
      (document, index, all) =>
        !document.sha256 ||
        all.findIndex(
          (candidate) =>
            candidate.sha256 === document.sha256,
        ) === index,
    );

    const parsedDocuments = mergedDocuments
      .map((document) => document.parsedDocument)
      .filter(
        (document): document is NonNullable<
          PropertyDocumentEvidence["parsedDocument"]
        > => Boolean(document),
      );

    const layer: PropertyDocumentEvidenceLayer = {
      documents: mergedDocuments,
      crossChecks:
        crossCheckDocuments(parsedDocuments),
      globalWarnings: Array.from(
        new Set([
          ...(result?.globalWarnings ?? []),
          ...(incoming.parsedDocument?.warnings ?? []),
        ]),
      ),
    };

    const detectedDocuments = Array.from(
      new Set(
        mergedDocuments
          .map((item) =>
            item.parsedDocument
              ? standardDocumentLabel(
                  item.parsedDocument.kind,
                )
              : null,
          )
          .filter(
            (value): value is string =>
              value !== null,
          ),
      ),
    );

    setResult(layer);
    onChange(
      layer,
      detectedDocuments,
      pvpMetadata ?? undefined,
    );
  };

  const discoverPvp = async () => {
    const announcementId =
      pvpAnnouncementId.trim();

    if (!/^\d+$/.test(announcementId)) {
      setPvpError(
        "Inserire un ID annuncio PVP numerico valido.",
      );
      return;
    }

    setPvpDiscovering(true);
    setPvpError(null);
    setPvpAttachments([]);

    try {
      const discovery =
        await discoverPvpSaleFn({
          data: { announcementId },
        });

      const metadata =
        discovery as PvpPublicAcquisitionMetadata;

      setPvpMetadata(metadata);
      onPvpDiscovery?.(metadata);

      setPvpAttachments(
        discovery.attachments.map((item) => ({
          id: item.id,
          fileName: item.fileName,
          size: item.size,
          ...(item.typeCode
            ? { typeCode: item.typeCode }
            : {}),
        })),
      );
    } catch (error) {
      setPvpError(
        error instanceof Error
          ? error.message
          : "Discovery PVP non riuscita.",
      );
    } finally {
      setPvpDiscovering(false);
    }
  };

  const acquireFromPvp = async (
    attachmentId: number,
  ) => {
    const announcementId =
      pvpAnnouncementId.trim();

    setPvpAcquiringId(attachmentId);
    setPvpError(null);

    try {
      const evidence =
        await acquirePvpDocumentFn({
          data: {
            announcementId,
            attachmentId,
          },
        });

      mergePvpEvidence(
        evidence as PropertyDocumentEvidence,
      );
    } catch (error) {
      setPvpError(
        error instanceof Error
          ? error.message
          : "Acquisizione documento PVP non riuscita.",
      );
    } finally {
      setPvpAcquiringId(null);
    }
  };

  const processFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setProcessing(true);

    const timestamp = Date.now();
    const extracted: Array<{
      id: string;
      file: File;
      text: string;
      sha256: string;
    }> = [];

    const evidence: PropertyDocumentEvidence[] = [];

    for (const [index, file] of files.entries()) {
      const id = `DOC-${timestamp}-${index + 1}`;

      if (file.size > MAX_FILE_SIZE) {
        evidence.push({
          id,
          fileName: file.name,
          mimeType: file.type || "application/pdf",
          size: file.size,
          status: "ERROR",
          error:
            "File superiore al limite operativo di 50 MB.",
          processedAt: new Date().toISOString(),
        });
        continue;
      }

      try {
        const extraction = await extractPdfText(file);

        if (!extraction.text.trim()) {
          evidence.push({
            id,
            fileName: file.name,
            mimeType: file.type || "application/pdf",
            size: file.size,
            sha256: extraction.sha256,
            status: "UNREADABLE",
            error:
              "Il PDF non contiene testo estraibile. Potrebbe essere una scansione e richiedere OCR.",
            processedAt: new Date().toISOString(),
          });
          continue;
        }

        extracted.push({
          id,
          file,
          text: extraction.text,
          sha256: extraction.sha256,
        });
      } catch (error) {
        evidence.push({
          id,
          fileName: file.name,
          mimeType: file.type || "application/pdf",
          size: file.size,
          status: "ERROR",
          error:
            error instanceof Error
              ? error.message
              : "Errore durante la lettura del PDF.",
          processedAt: new Date().toISOString(),
        });
      }
    }

    const intelligence = extracted.length
      ? runDocumentIntelligence(
          extracted.map((item) => ({
            id: item.id,
            title: item.file.name,
            text: item.text,
          })),
        )
      : null;

    if (intelligence) {
      for (const item of extracted) {
        const parsedDocument =
          intelligence.documents.find(
            (document) => document.id === item.id,
          );

        const hasSpecificParser =
          parsedDocument?.kind === "SALE_NOTICE" ||
          parsedDocument?.kind === "DELEGATION_ORDER" ||
          parsedDocument?.kind === "SALE_HISTORY_ORDER" ||
          parsedDocument?.kind === "CTU";

        evidence.push({
          id: item.id,
          fileName: item.file.name,
          mimeType:
            item.file.type || "application/pdf",
          size: item.file.size,
          sha256: item.sha256,
          status: hasSpecificParser
            ? "ANALYZED"
            : "ACQUIRED",
          parsedDocument,
          processedAt: new Date().toISOString(),
        });
      }
    }

    const existingDocuments = result?.documents ?? [];

    const mergedDocuments = [
      ...existingDocuments,
      ...evidence,
    ].filter(
      (document, index, all) =>
        !document.sha256 ||
        all.findIndex(
          (candidate) =>
            candidate.sha256 === document.sha256,
        ) === index,
    );

    const parsedDocuments = mergedDocuments
      .map((document) => document.parsedDocument)
      .filter(
        (document): document is NonNullable<
          PropertyDocumentEvidence["parsedDocument"]
        > => Boolean(document),
      );

    const layer: PropertyDocumentEvidenceLayer = {
      documents: mergedDocuments,
      crossChecks: crossCheckDocuments(parsedDocuments),
      globalWarnings: Array.from(
        new Set([
          ...(result?.globalWarnings ?? []),
          ...(intelligence?.globalWarnings ?? []),
        ]),
      ),
    };

    const detectedDocuments = Array.from(
      new Set(
        mergedDocuments
          .map((item) =>
            item.parsedDocument
              ? standardDocumentLabel(
                  item.parsedDocument.kind,
                )
              : null,
          )
          .filter(
            (value): value is string =>
              value !== null,
          ),
      ),
    );

    setResult(layer);
    onChange(
      layer,
      detectedDocuments,
      pvpMetadata ?? undefined,
    );
    setProcessing(false);
    event.target.value = "";
  };

  return (
    <div className="mt-6">
      <div className="mb-6 border border-primary/30 bg-primary/[0.03] p-5">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
          PVP · ACQUISIZIONE UFFICIALE
        </p>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Inserisci l'ID dell'annuncio del Portale delle Vendite
          Pubbliche. L'Engine individua gli allegati ufficiali e
          consente di acquisirli direttamente con provenienza,
          hash, classificazione e analisi documentale.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            inputMode="numeric"
            value={pvpAnnouncementId}
            onChange={(event) =>
              setPvpAnnouncementId(
                event.target.value.replace(/\D/g, ""),
              )
            }
            placeholder="ID annuncio PVP"
            className="min-w-0 flex-1 border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
          />

          <button
            type="button"
            onClick={discoverPvp}
            disabled={pvpDiscovering}
            className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {pvpDiscovering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Leggi allegati PVP
          </button>
        </div>

        {pvpError && (
          <p className="mt-3 text-xs leading-5 text-destructive">
            {pvpError}
          </p>
        )}

        {pvpAttachments.length > 0 && (
          <div className="mt-5 space-y-2">
            {pvpAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex flex-col gap-3 border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="break-all text-sm font-semibold">
                    {attachment.fileName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ID {attachment.id}
                    {" · "}
                    {attachment.typeCode ?? "ALTRO"}
                    {" · "}
                    {(attachment.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    pvpAcquiringId !== null
                  }
                  onClick={() =>
                    acquireFromPvp(attachment.id)
                  }
                  className="inline-flex shrink-0 items-center justify-center gap-2 border border-primary/40 px-4 py-2 text-xs font-semibold text-primary disabled:opacity-50"
                >
                  {pvpAcquiringId ===
                  attachment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Acquisisci
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-3 border border-dashed border-primary/40 bg-primary/[0.03] px-5 py-6 text-sm font-semibold transition-colors hover:bg-primary/[0.06]">
        {processing ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <Upload className="h-5 w-5 text-primary" />
        )}

        {processing
          ? "Analisi documenti in corso..."
          : "Carica PDF della procedura"}

        <input
          type="file"
          accept="application/pdf,.pdf"
          multiple
          disabled={processing}
          onChange={processFiles}
          className="sr-only"
        />
      </label>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        I PDF vengono elaborati nel browser. Il testo estratto
        non viene salvato nel record: vengono conservati hash,
        classificazione, campi strutturati, warning e
        contraddizioni. Le scansioni senza testo restano
        NON LEGGIBILI fino a un successivo ciclo OCR.
      </p>

      {result && (
        <div className="mt-5 space-y-3">
          {result.documents.map((document) => (
            <div
              key={document.id}
              className="border border-border bg-background/70 p-4"
            >
              <div className="flex items-start gap-3">
                {document.status === "ANALYZED" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                )}

                <div className="min-w-0">
                  <p className="break-all text-sm font-semibold">
                    {document.fileName}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>
                      {statusLabel(document)}
                    </span>

                    {document.parsedDocument && (
                      <span>
                        TIPO:{" "}
                        {document.parsedDocument.kind}
                      </span>
                    )}

                    {document.sha256 && (
                      <span>
                        SHA-256:{" "}
                        {document.sha256.slice(0, 16)}…
                      </span>
                    )}
                  </div>

                  {document.error && (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {document.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 border border-border bg-background/70 p-4 text-sm">
            <FileText className="h-5 w-5 text-primary" />
            <span>
              Cross-check rilevati:{" "}
              <strong>{result.crossChecks.length}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
