import type {
  ParsedDocument,
  ParsedField,
} from "./documentParserTypes";

const SOURCE_LABEL =
  "Provvedimento storico vendite";

const normalize = (text: string) =>
  text
    .replace(/\r/g, "\n")
    .replace(/[’‘`´]/g, "'")
    .replace(/[ \t]+/g, " ");

const field = <T extends string | number | boolean | null>(
  key: string,
  label: string,
  value: T,
  note?: string,
): ParsedField<T> => ({
  key,
  label,
  value,
  sourceDocument: "SALE_HISTORY_ORDER",
  sourceLabel: SOURCE_LABEL,
  confidence:
    value === null || value === ""
      ? "MISSING"
      : "HIGH",
  ...(note ? { note } : {}),
});

const euro = (
  raw: string | undefined,
): number | null => {
  if (!raw) return null;

  const normalized = raw
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  const value = Number(normalized);

  return Number.isFinite(value)
    ? value
    : null;
};

const ordinalToNumber = (
  value: string | undefined,
): number | null => {
  if (!value) return null;

  const map: Record<string, number> = {
    primo: 1,
    secondo: 2,
    terzo: 3,
    quarto: 4,
    quinto: 5,
    sesto: 6,
    settimo: 7,
    ottavo: 8,
    nono: 9,
    decimo: 10,
  };

  return map[value.toLowerCase()] ?? null;
};

const cardinalToNumber = (
  value: string | undefined,
): number | null => {
  if (!value) return null;

  const map: Record<string, number> = {
    uno: 1,
    un: 1,
    due: 2,
    tre: 3,
    quattro: 4,
    cinque: 5,
    sei: 6,
    sette: 7,
    otto: 8,
    nove: 9,
    dieci: 10,
  };

  return map[value.toLowerCase()] ?? null;
};

export function parseSaleHistoryOrder(
  rawText: string,
): ParsedDocument {
  const text = normalize(rawText);

  const lotMatch = text.match(
    /LOTTO\s+(?:N\.?\s*)?([0-9]+)/i,
  );

  const previousExperimentsMatch =
    text.match(
      /sono\s+stati\s+esperiti\s+senza\s+esito\s+i\s+([a-z]+)\s+esperimenti\s+di\s+vendita\s+relativi\s+al\s+LOTTO\s+(?:N\.?\s*)?([0-9]+)/i,
    );

  const previousExperimentsWithoutOutcome =
    cardinalToNumber(
      previousExperimentsMatch?.[1],
    );

  const previousBaseMatch =
    text.match(
      /verbale\s+negativo\s+ultimo\s+esperimento[\s\S]{0,160}?base\s+asta\s+euro\s+([0-9][0-9.,]*)/i,
    );

  const nextExperimentMatch =
    text.match(
      /(?:•|-)\s*(Primo|Secondo|Terzo|Quarto|Quinto|Sesto|Settimo|Ottavo|Nono|Decimo)\s+esperimento[\s\S]{0,260}?base\s+d['']asta\s+di\s+euro\s+([0-9][0-9.,]*)[\s\S]{0,100}?rilancio\s+minimo\s+euro\s+([0-9][0-9.,]*)/i,
    );

  const authorizationMatch =
    text.match(
      /Visto\s+si\s+autorizza\s+In\s+data:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i,
    );

  const authorizationRequested =
    /si\s+richiede\s+l['']autorizzazione|presenta\s+ISTANZA/i.test(
      text,
    );

  const fields: ParsedField[] = [
    field(
      "historyLotNumber",
      "Lotto storico",
      lotMatch?.[1]
        ? String(Number(lotMatch[1]))
        : null,
    ),

    field(
      "previousExperimentsWithoutOutcome",
      "Esperimenti precedenti senza esito",
      previousExperimentsWithoutOutcome,
      previousExperimentsWithoutOutcome !== null
        ? "Numero di esperimenti dichiarati espressamente come senza esito."
        : undefined,
    ),

    field(
      "previousBasePrice",
      "Base ultimo esperimento precedente",
      euro(previousBaseMatch?.[1]),
    ),

    field(
      "nextExperimentNumber",
      "Numero nuovo esperimento",
      ordinalToNumber(
        nextExperimentMatch?.[1],
      ),
    ),

    field(
      "nextBasePrice",
      "Base nuovo esperimento",
      euro(nextExperimentMatch?.[2]),
    ),

    field(
      "nextMinimumBidIncrease",
      "Rilancio minimo nuovo esperimento",
      euro(nextExperimentMatch?.[3]),
    ),

    field(
      "authorizationDate",
      "Data autorizzazione",
      authorizationMatch?.[1] ?? null,
    ),

    field(
      "authorizationGranted",
      "Autorizzazione concessa",
      authorizationMatch
        ? true
        : authorizationRequested
          ? false
          : null,
      authorizationMatch
        ? "Il documento contiene 'Visto si autorizza'."
        : authorizationRequested
          ? "Il documento contiene una richiesta di autorizzazione, ma non è stata rilevata la formula di concessione."
          : undefined,
    ),
  ];

  const missingFields = fields
    .filter(
      (item) => item.confidence === "MISSING",
    )
    .map((item) => item.label);

  return {
    id: "sale-history-order",
    kind: "SALE_HISTORY_ORDER",
    title:
      "Provvedimento storico vendite / riduzione base d'asta",
    fields,
    warnings: [],
    missingFields,
  };
}
