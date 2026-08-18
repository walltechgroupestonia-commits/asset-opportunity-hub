import { discoverPvpPublicSale } from "./pvpEvidenceAcquisition.server";
import { extractPdfTextFromBytes } from "../walltech/pdfTextExtractor.server";
import { runDocumentIntelligence } from "../walltech/documentIntelligenceEngine";
import type { PropertyDocumentEvidence } from "../walltech/propertyIntelligenceTypes";

const PVP_RESOURCE_ORIGIN = "https://resource-pvp.giustizia.it";
const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024;

function assertResourceUrl(url: string): URL {
  const parsed = new URL(url);

  if (parsed.origin !== PVP_RESOURCE_ORIGIN) {
    throw new Error(`Origine allegato PVP non consentita: ${parsed.origin}`);
  }

  return parsed;
}

async function fetchAttachmentBytes(
  sourceUrl: string,
  expectedSize: number,
): Promise<Uint8Array> {
  assertResourceUrl(sourceUrl);

  if (
    !Number.isFinite(expectedSize) ||
    expectedSize < 0 ||
    expectedSize > MAX_ATTACHMENT_SIZE
  ) {
    throw new Error("Dimensione allegato PVP non valida.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(sourceUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/pdf,application/octet-stream",
        "user-agent": "Walltech-Intelligence-Engine-PVP/1.0",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Download allegato PVP fallito con HTTP ${response.status}.`,
      );
    }

    assertResourceUrl(response.url || sourceUrl);

    const lengthHeader = response.headers.get("content-length");
    const declaredSize = lengthHeader ? Number(lengthHeader) : null;

    if (
      declaredSize !== null &&
      (
        !Number.isFinite(declaredSize) ||
        declaredSize > MAX_ATTACHMENT_SIZE
      )
    ) {
      throw new Error("Allegato PVP superiore al limite operativo.");
    }

    const bytes = new Uint8Array(await response.arrayBuffer());

    if (bytes.byteLength > MAX_ATTACHMENT_SIZE) {
      throw new Error("Allegato PVP superiore al limite operativo.");
    }

    if (
      bytes.byteLength < 5 ||
      String.fromCharCode(...bytes.slice(0, 5)) !== "%PDF-"
    ) {
      throw new Error("L'allegato PVP acquisito non è un PDF valido.");
    }

    return bytes;
  } finally {
    clearTimeout(timer);
  }
}

export async function acquirePvpPublicDocument(
  announcementId: string,
  attachmentId: number,
): Promise<PropertyDocumentEvidence> {
  const discovery = await discoverPvpPublicSale(announcementId);
  const attachment = discovery.attachments.find(
    (item) => item.id === attachmentId,
  );

  if (!attachment) {
    throw new Error(
      "Allegato PVP richiesto non trovato tra gli allegati pubblici validi.",
    );
  }

  const bytes = await fetchAttachmentBytes(
    attachment.sourceUrl,
    attachment.size,
  );

  const extraction = await extractPdfTextFromBytes(bytes);
  const processedAt = new Date().toISOString();

  if (!extraction.text.trim()) {
    return {
      id: `PVP-${announcementId}-${attachment.id}`,
      fileName: attachment.fileName,
      mimeType: "application/pdf",
      size: bytes.byteLength,
      sha256: extraction.sha256,
      status: "UNREADABLE",
      provenance: {
        sourceClass: "OFFICIAL",
        sourceLabel: "Portale delle Vendite Pubbliche",
        sourceUrl: attachment.sourceUrl,
        announcementId,
        attachmentId: attachment.id,
        attachmentTypeCode: attachment.typeCode,
        versionId: attachment.versionId,
        acquiredAt: processedAt,
      },
      error:
        "Il PDF PVP non contiene testo estraibile e richiede un successivo ciclo OCR.",
      processedAt,
    };
  }

  const intelligence = runDocumentIntelligence([
    {
      id: `PVP-${announcementId}-${attachment.id}`,
      title: attachment.fileName,
      text: extraction.text,
    },
  ]);

  const parsedDocument = intelligence.documents[0];
  const hasSpecificParser =
    parsedDocument?.kind === "SALE_NOTICE" ||
    parsedDocument?.kind === "DELEGATION_ORDER" ||
    parsedDocument?.kind === "CTU";

  return {
    id: `PVP-${announcementId}-${attachment.id}`,
    fileName: attachment.fileName,
    mimeType: "application/pdf",
    size: bytes.byteLength,
    sha256: extraction.sha256,
    status: hasSpecificParser ? "ANALYZED" : "ACQUIRED",
    parsedDocument,
    provenance: {
      sourceClass: "OFFICIAL",
      sourceLabel: "Portale delle Vendite Pubbliche",
      sourceUrl: attachment.sourceUrl,
      announcementId,
      attachmentId: attachment.id,
      attachmentTypeCode: attachment.typeCode,
      versionId: attachment.versionId,
      acquiredAt: processedAt,
    },
    processedAt,
  };
}
