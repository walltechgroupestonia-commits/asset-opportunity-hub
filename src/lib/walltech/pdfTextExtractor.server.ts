import { createHash } from "node:crypto";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  WorkerMessageHandler,
} from "pdfjs-dist/legacy/build/pdf.worker.mjs";

const pdfjsGlobal = globalThis as typeof globalThis & {
  pdfjsWorker?: {
    WorkerMessageHandler: typeof WorkerMessageHandler;
  };
};

pdfjsGlobal.pdfjsWorker = {
  WorkerMessageHandler,
};

export interface ServerPdfTextPage {
  page: number;
  text: string;
}

export interface ServerPdfTextExtractionResult {
  text: string;
  pages: ServerPdfTextPage[];
  pageCount: number;
  sha256: string;
}

export async function extractPdfTextFromBytes(
  input: Uint8Array,
): Promise<ServerPdfTextExtractionResult> {
  const bytes = new Uint8Array(input);

  const sha256 = createHash("sha256")
    .update(bytes)
    .digest("hex");

  const loadingTask = getDocument({
    data: bytes,
  });

  const pdf = await loadingTask.promise;
  const pages: ServerPdfTextPage[] = [];

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
    sha256,
  };
}
