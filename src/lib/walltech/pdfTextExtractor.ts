import {
  GlobalWorkerOptions,
  getDocument,
} from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface PdfTextPage {
  page: number;
  text: string;
}

export interface PdfTextExtractionResult {
  text: string;
  pages: PdfTextPage[];
  pageCount: number;
  sha256: string;
}

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

export async function extractPdfText(
  file: File,
): Promise<PdfTextExtractionResult> {
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    throw new Error("Il file selezionato non è un PDF.");
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const hash = await crypto.subtle.digest(
    "SHA-256",
    bytes,
  );

  const loadingTask = getDocument({
    data: bytes,
  });

  const pdf = await loadingTask.promise;
  const pages: PdfTextPage[] = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber += 1
  ) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const text = content.items
      .map((item) =>
        "str" in item ? item.str : "",
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    pages.push({
      page: pageNumber,
      text,
    });
  }

  const text = pages
    .map(
      ({ page, text: pageText }) =>
        `[PAGE ${page}]\n${pageText}`,
    )
    .join("\n\n")
    .trim();

  return {
    text,
    pages,
    pageCount: pdf.numPages,
    sha256: toHex(hash),
  };
}
