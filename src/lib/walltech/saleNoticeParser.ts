import type {
  ParsedDocument,
  ParsedField,
} from "./documentParserTypes";

const pick = (text: string, re: RegExp) =>
  text.match(re)?.[1]?.trim() ?? null;

const euro = (value: string | null) => {
  if (!value) return null;

  const normalized = value
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};

const field = <T,>(
  key: string,
  label: string,
  value: T,
): ParsedField => ({
  key,
  label,
  value,
  sourceDocument: "SALE_NOTICE",
  sourceLabel: "Avviso di vendita",
  confidence:
    value === null || value === ""
      ? "MISSING"
      : "HIGH",
});

const procedureNumber = (text: string) =>
  pick(
    text,
    /Procedura\s+Esecutiva\s+n\.?\s*([0-9]+\s*\/\s*[0-9]{4})/i,
  ) ??
  pick(
    text,
    /RGE\s*[-:]?\s*([0-9]+\s*\/\s*[0-9]{4})/i,
  ) ??
  pick(
    text,
    /(?:R\.?\s*G\.?|L\.?\s*G\.?)\s*N\.?\s*([0-9]+\s*\/\s*[0-9]{4})/i,
  );

const judge = (text: string) =>
  pick(
    text,
    /Giudice\s+Delegato\s*:\s*(.+?)(?=\s+Curatore\s*:)/i,
  ) ??
  pick(
    text,
    /Giudice[^:\n]*:\s*(.+?)(?=\s+(?:Curatore|Professionista|Delegato)\s*:|\s*\[PAGE|\n|$)/i,
  );

const procedureType = (text: string) => {
  if (/Liquidazione\s+Giudiziale/i.test(text)) {
    return "JUDICIAL_LIQUIDATION";
  }

  if (/Procedura\s+Esecutiva|R\.?\s*G\.?\s*E\.?/i.test(text)) {
    return "REAL_ESTATE_ENFORCEMENT";
  }

  return null;
};

const currentLot = (text: string) =>
  pick(
    text,
    /LOTTO\s+N\.?\s*([0-9]+)(?:\s*\([^)]*\))?/i,
  );

const experimentNumber = (text: string) => {
  const raw = pick(
    text,
    /(?:-|–)\s*(Primo|Secondo|Terzo|Quarto|Quinto|Sesto|Settimo|Ottavo|Nono|Decimo)\s+esperimento\s*(?:-|–)/i,
  );

  if (!raw) return null;

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

  return map[raw.toLowerCase()] ?? null;
};

const curator = (text: string) =>
  pick(
    text,
    /Curatore\s*:\s*(.+?)(?=\s+(?:DISCIPLINARE|AVVISO|Il\s+Curatore)|\s*\[PAGE|\n|$)/i,
  );

const saleSpecialist = (text: string) =>
  pick(
    text,
    /(I\.?V\.?G\.?\s+Rimini\s+S\.?r\.?[l1]\.?)(?=\s*\{?delegato\}?|\s+con\s+sede)/i,
  );

const salePlatform = (text: string) =>
  pick(
    text,
    /operazioni\s+della\s+procedura\s+di\s+vendita\s+telematica\s+saranno\s+gestite\s+da\s+([A-Za-z0-9]+Aste)/i,
  );

const assetAddress = (text: string) =>
  pick(
    text,
    /vendita\s+competitiva[\s\S]{0,1200}?LOTTO\s+N\.?\s*[0-9]+[\s\S]{0,1200}?alla\s+(Via\s+[A-Za-zÀ-ÿ'\s]+\s+n\.?\s*\d+)/i,
  ) ??
  pick(
    text,
    /LOTTO\s+N\.?\s*[0-9]+[\s\S]{0,1600}?alla\s+(Via\s+[A-Za-zÀ-ÿ'\s]+\s+n\.?\s*\d+)/i,
  );

const auctionDate = (text: string) => {
  const match = text.match(
    /IL\s+GIORNO\s+([0-9](?:\s*[0-9])?)\s*(?:\([^)]*\))?\s+([A-ZÀ-ÿ](?:\s*[A-ZÀ-ÿ]){2,})\s+([0-9]{4})(?:\s*\([^)]*\))?\s+ALLE\s+ORE\s+([0-9]{1,2}[:.][0-9]{2})/i,
  );

  if (match) {
    const day = match[1].replace(/\s+/g, "");
    const month = match[2].replace(/\s+/g, "");
    const time = match[4].replace(".", ":");
    return `${day} ${month} ${match[3]} alle ore ${time}`;
  }

  return pick(
    text,
    /(\d{1,2}\s+[A-Za-zÀ-ÿ]+\s+\d{4}\s+alle\s+ore\s+\d{1,2}[:.]\d{2})/i,
  );
};

const offerDeadline = (text: string) =>
  pick(
    text,
    /(?:devono\s+essere\s+redatte\s+e\s+depositate|depositate)\s+(entro\s+le\s+ore\s+[0-9]{1,2}[.:][0-9]{2}\s+dell['’]ultimo\s+giorno\s+non\s+festivo\s+precedente\s+quello\s+della\s+vendita)/i,
  ) ??
  pick(
    text,
    /Termine\s+per\s+la\s+presentazione\s+delle\s+offerte:\s*([^;\n]+)/i,
  );

export function parseSaleNotice(
  text: string,
): ParsedDocument {
  const fields: ParsedField[] = [
    field(
      "procedureNumber",
      "Numero procedura",
      procedureNumber(text),
    ),

    field(
      "procedureType",
      "Tipo procedura",
      procedureType(text),
    ),

    field(
      "currentLot",
      "Lotto corrente",
      currentLot(text),
    ),

    field(
      "experimentNumber",
      "Numero esperimento",
      experimentNumber(text),
    ),

    field(
      "judge",
      "Giudice",
      judge(text),
    ),

    field(
      "delegate",
      "Professionista delegato",
      pick(
        text,
        /professionista\s+delegato\s+(Avv\.[^,;\n]+)/i,
      ),
    ),

    field(
      "curator",
      "Curatore",
      curator(text),
    ),

    field(
      "saleSpecialist",
      "Soggetto specializzato / banditore",
      saleSpecialist(text),
    ),

    field(
      "salePlatform",
      "Gestore piattaforma vendita",
      salePlatform(text),
    ),

    field(
      "auctionDate",
      "Data asta",
      auctionDate(text),
    ),

    field(
      "offerDeadline",
      "Termine offerte",
      offerDeadline(text),
    ),

    field(
      "basePrice",
      "Prezzo base",
      euro(
        pick(
          text,
          /PREZZO\s+BASE\s+D['’]ASTA[^:]*:\s*€?\s*([0-9][0-9.,]*)/i,
        ) ??
          pick(
            text,
            /Prezzo\s+Base\s+della\s+Vendita:\s*€?\s*([0-9][0-9.,]*)/i,
          ),
      ),
    ),

    field(
      "minimumOffer",
      "Offerta minima",
      euro(
        pick(
          text,
          /OFFERTA\s+MINIMA\s*:\s*€?\s*([0-9][0-9.,]*)/i,
        ),
      ),
    ),

    field(
      "minimumBidIncrease",
      "Rilancio minimo",
      euro(
        pick(
          text,
          /(?:RILANCIO|AUMENTI?)\s+MINIM[OI][^:]*:\s*€?\s*([0-9][0-9.,]*)/i,
        ),
      ),
    ),

    field(
      "depositPercent",
      "Cauzione %",
      (() => {
        const value = pick(
          text,
          /CAUZIONE[^%]{0,160}?([0-9]+)\s*%/i,
        );
        return value ? Number(value) : null;
      })(),
    ),

    field(
      "balanceDays",
      "Saldo giorni",
      (() => {
        const value =
          pick(
            text,
            /termine\s+massimo\s+di\s+giorni\s+([0-9]+)/i,
          ) ??
          pick(
            text,
            /entro\s+il\s+termine\s+massimo\s+di\s+([0-9]+)\s+gg/i,
          );

        return value ? Number(value) : null;
      })(),
    ),

    field(
      "address",
      "Indirizzo immobile in vendita",
      assetAddress(text),
    ),

    field(
      "occupancy",
      "Occupazione",
      pick(
        text,
        /OCCUPAZIONE:\s*([^;\n]+)/i,
      ),
    ),

    field(
      "cadastralSheet",
      "Foglio",
      pick(text, /Fg\.\s*([0-9]+)/i),
    ),

    field(
      "cadastralParcel",
      "Mappale",
      pick(text, /mapp\.\s*([0-9]+)/i),
    ),

    field(
      "cadastralSub",
      "Subalterno",
      pick(text, /sub\.\s*([0-9]+)/i),
    ),

    field(
      "cadastralCategory",
      "Categoria catastale",
      pick(text, /cat\.\s*([A-Z]\/[0-9]+)/i),
    ),

    field(
      "cadastralIncome",
      "Rendita catastale",
      euro(
        pick(
          text,
          /rendita\s*€\s*([0-9.,]+)/i,
        ),
      ),
    ),

    field(
      "energyClass",
      "Classe energetica",
      pick(text, /Classe\s+([A-G])/i),
    ),
  ];

  const missingFields = fields
    .filter(
      (item) => item.confidence === "MISSING",
    )
    .map((item) => item.label);

  return {
    id: "sale-notice",
    kind: "SALE_NOTICE",
    title: "Avviso di vendita",
    fields,
    warnings: missingFields.length
      ? [
          `Campi non estratti: ${missingFields.join(", ")}`,
        ]
      : [],
    missingFields,
  };
}
