import type {
  Confidence,
  ParsedDocument,
  ParsedField,
} from "./documentParserTypes";

const SOURCE_LABEL = "CTU / Perizia";

const normalizeText = (text: string) =>
  text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\u00a0/g, " ");

const uniqueMatches = (
  text: string,
  regex: RegExp,
): string[] => {
  const values: string[] = [];

  for (const match of text.matchAll(regex)) {
    const value = match[1]?.trim();
    if (value && !values.includes(value)) {
      values.push(value);
    }
  }

  return values;
};

const aggregate = (values: string[]): string | null =>
  values.length ? values.join(" · ") : null;

const parseEuro = (value: string | null): number | null => {
  if (!value) return null;

  const normalized = value
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const parsePercent = (
  value: string | null,
): number | null => {
  if (!value) return null;

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

const pick = (
  text: string,
  patterns: RegExp[],
): string | null => {
  for (const pattern of patterns) {
    const value = text.match(pattern)?.[1]?.trim();
    if (value) return value;
  }

  return null;
};

const field = <T extends string | number | null>(
  key: string,
  label: string,
  value: T,
  confidence?: Confidence,
  note?: string,
): ParsedField<T> => ({
  key,
  label,
  value,
  sourceDocument: "CTU",
  sourceLabel: SOURCE_LABEL,
  confidence:
    confidence ??
    (value === null || value === ""
      ? "MISSING"
      : "HIGH"),
  ...(note ? { note } : {}),
});

const findLotNumber = (text: string): string | null => {
  const match = text.match(
    /\bLOTTO\s+(?:N\.?\s*)?([0-9]+)(?:\s*\([^)]*\))?/i,
  );

  if (!match?.[1]) return null;

  return String(Number(match[1]));
};

interface CtuBodyEvidence {
  code: string;
  label: string | null;
  sheet: string | null;
  parcel: string | null;
  sub: string | null;
  category: string | null;
  cadastralIncome: string | null;
  surface: string | null;
}

const findCtuBodies = (
  text: string,
): CtuBodyEvidence[] => {
  const bodies: CtuBodyEvidence[] = [];

  const cadastralMatches = [
    ...text.matchAll(
      /(?:^|\s)([A-Z])\.\s+((?:L['’]immobile|Trattasi)\b[\s\S]{0,2500}?)Identificato\s+in\s+Catasto:\s*-\s*Fabbricati:\s*Comune\s+di\s+[^,]+,\s*Foglio\s+(\d{1,4})\s+p\.?lla\s+(\d{1,7}),\s*sub\.?\s*(\d{1,5}),\s*categoria\s+(A\/\d+)[\s\S]{0,250}?rendita\s*€\s*([0-9.]+,[0-9]{2})[\s\S]{0,180}?superficie\s+totale\s+([0-9]+(?:[.,][0-9]+)?)\s*mq/gi,
    ),
  ];

  for (const match of cadastralMatches) {
    const code = match[1]?.toUpperCase();
    if (!code) continue;

    const description = match[2] ?? "";

    let label: string | null = null;

    const explicitBodyLabel = text.match(
      new RegExp(
        `\\b${code}\\.\\s*(Villa|Villino)\\b`,
        "i",
      ),
    )?.[1];

    if (explicitBodyLabel) {
      label =
        explicitBodyLabel.toLowerCase() === "villa"
          ? "Villa"
          : "Villino";
    } else if (/\bvilla\b/i.test(description)) {
      label = "Villa";
    } else if (/\bvillino\b/i.test(description)) {
      label = "Villino";
    }

    if (
      bodies.some(
        (body) => body.code === code,
      )
    ) {
      continue;
    }

    bodies.push({
      code,
      label,
      sheet: match[3] ?? null,
      parcel: match[4] ?? null,
      sub: match[5] ?? null,
      category: match[6] ?? null,
      cadastralIncome: match[7] ?? null,
      surface: match[8] ?? null,
    });
  }

  return bodies;
};

const findAddress = (text: string): string | null => {
  const identificationIndex = text.search(
    /identificazione\s+dei\s+beni\s+immobili/i,
  );

  const identificationSection =
    identificationIndex >= 0
      ? text.slice(
          identificationIndex,
          identificationIndex + 6000,
        )
      : text;

  const identifiedAddress = pick(
    identificationSection,
    [
      /\b(?:siti|sito|ubicate|ubicati|ubicata|ubicato)\s+in\s+((?:via|viale|piazza|corso|largo)\s+[^,\n;]{2,70}?(?:\s+n\.?\s*|\s+)\d+[a-z]?)/i,
      /\b((?:via|viale|piazza|corso|largo)\s+[^,\n;]{2,70}?\s+n\.?\s*\d+[a-z]?)\b/i,
    ],
  );

  return identifiedAddress;
};

const findOccupancy = (
  text: string,
): {
  value: string | null;
  confidence: Confidence;
  warning?: string;
} => {
  if (
    /\boccupat[ioe]{1,2}\s+da\s+terzi\s+senza\s+titolo\b/i.test(
      text,
    )
  ) {
    return {
      value: "Occupato da terzi senza titolo",
      confidence: "HIGH",
      warning:
        "La CTU rileva occupazione da parte di terzi senza titolo. Verificare lo stato attuale e l'eventuale situazione distinta per ciascun corpo.",
    };
  }

  if (
    /\bimmobil[ei][\s\S]{0,120}\brisult(?:a|ano)\s+liber[oi]\b/i.test(
      text,
    )
  ) {
    return {
      value: "Libero secondo CTU",
      confidence: "HIGH",
    };
  }

  if (/\bnon\s+abitat[oa]\b/i.test(text)) {
    return {
      value: "Non abitato — stato di occupazione da verificare",
      confidence: "MEDIUM",
      warning:
        "La dicitura «non abitato» non viene interpretata automaticamente come «libero».",
    };
  }

  if (/\boccupat[oaie]\b/i.test(text)) {
    return {
      value: "Occupato — titolo e stato attuale da verificare",
      confidence: "MEDIUM",
    };
  }

  return {
    value: null,
    confidence: "MISSING",
  };
};

const findCompliance = (
  text: string,
  area: "urban" | "cadastral",
): {
  value: string | null;
  confidence: Confidence;
} => {
  const anchor =
    area === "urban"
      ? /(?:conformit[aà]\s+urbanistico[\s-]*edilizia|urbanistico[\s-]*edilizi[ao])/i
      : /(?:conformit[aà]\s+catastale|catastalmente)/i;

  const match = anchor.exec(text);
  if (!match) {
    return {
      value: null,
      confidence: "MISSING",
    };
  }

  const section = text.slice(
    match.index,
    match.index + 3500,
  );

  if (
    /\bnon\s+conforme\b/i.test(section) ||
    /\bdifformit[aà]\b/i.test(section) ||
    /\bnon\s+legittimat[oa]\b/i.test(section) ||
    /\babusi?v[oaie]*\b/i.test(section)
  ) {
    return {
      value:
        area === "urban"
          ? "Non conforme / difformità urbanistico-edilizie rilevate"
          : "Non conforme / difformità catastali rilevate",
      confidence: "HIGH",
    };
  }

  if (/\bconforme\b/i.test(section)) {
    return {
      value: "Conforme secondo quanto riportato nella CTU",
      confidence: "HIGH",
    };
  }

  return {
    value: "Verifica descritta nella CTU — esito da approfondire",
    confidence: "MEDIUM",
  };
};

const pickEuroAfter = (
  text: string,
  patterns: RegExp[],
): number | null => {
  const raw = pick(text, patterns);
  return parseEuro(raw);
};

export function parseCtu(
  rawText: string,
): ParsedDocument {
  const text = normalizeText(rawText);
  const warnings: string[] = [];

  const sheets = uniqueMatches(
    text,
    /\bfoglio\s*:?\s*(\d{1,4})\b/gi,
  );

  const parcels = uniqueMatches(
    text,
    /\b(?:foglio|fg\.?)\s*\d{1,4}\s+(?:p\.?\s*lla|part(?:icella)?\.?|mappale)\s*:?\s*(\d{1,7})\s*,?\s*sub(?:alterno)?\.?\s*:?\s*\d{1,5}\b/gi,
  );

  const subs = uniqueMatches(
    text,
    /\bsub(?:alterno)?\.?\s*:?\s*(\d{1,5})\b/gi,
  );

  const categories = uniqueMatches(
    text,
    /\bcategori[ae]\s+(?:catastale\s+)?(?:[:\-]\s*)?(A\/\d+)\b/gi,
  );

  const incomes = uniqueMatches(
    text,
    /\brendita(?:\s+catastale)?\s*(?:[:\-]\s*)?(?:€|euro)?\s*([0-9][0-9.\s]*,[0-9]{2})/gi,
  );

  const surfaces = uniqueMatches(
    text,
    /\bsuperficie(?:\s+catastale)?(?:\s+totale)?[\s:=-]{0,10}([0-9]+(?:[.,][0-9]+)?)\s*(?:m²|mq|m2)\b/gi,
  );

  const energyClass = pick(text, [
    /\bclasse\s+energetica\s*:?\s*([A-G])\b/i,
    /\bclasse\s+di\s+prestazione\s+energetica\s*:?\s*([A-G])\b/i,
  ]);

  const ctuBodies = findCtuBodies(text);

  const occupancy = findOccupancy(text);
  if (occupancy.warning) {
    warnings.push(occupancy.warning);
  }

  const urbanCompliance = findCompliance(text, "urban");
  const cadastralCompliance =
    findCompliance(text, "cadastral");

  if (
    urbanCompliance.value?.toLowerCase().includes("non conforme") ||
    urbanCompliance.value
      ?.toLowerCase()
      .includes("difformità")
  ) {
    warnings.push(
      "La CTU riporta criticità urbanistico-edilizie. La regolarizzabilità e i relativi costi devono essere verificati da tecnico abilitato e presso gli uffici competenti.",
    );
  }

  if (
    cadastralCompliance.value
      ?.toLowerCase()
      .includes("non conforme") ||
    cadastralCompliance.value
      ?.toLowerCase()
      .includes("difformità")
  ) {
    warnings.push(
      "La CTU riporta criticità catastali che richiedono verifica professionale e confronto con lo stato di fatto.",
    );
  }

  if (
    /\b(?:sanabil|regolarizzabil|regolarizzazione)[a-zàèéìòù]*\b/i.test(
      text,
    )
  ) {
    warnings.push(
      "La presenza di riferimenti a sanabilità o regolarizzazione nella CTU non viene trattata come conferma automatica: occorre verifica professionale secondo la normativa e la situazione vigenti.",
    );
  }

  if (
    parcels.length > 1 ||
    subs.length > 1 ||
    categories.length > 1 ||
    incomes.length > 1
  ) {
    warnings.push(
      "La CTU descrive più corpi o unità immobiliari: i valori catastali multipli sono mantenuti aggregati e non devono essere interpretati come riferiti a una singola unità.",
    );
  }

  let servitudes: string | null = null;
  let servitudesConfidence: Confidence = "MISSING";

  if (
    /\bservit[uù][\s\S]{0,300}\bacquedott/i.test(text)
  ) {
    servitudes =
      "Servitù di acquedotto menzionata nella CTU";
    servitudesConfidence = "HIGH";
  } else if (/\bservit[uù]\b/i.test(text)) {
    servitudes =
      "Servitù menzionate nella CTU — natura e permanenza da verificare";
    servitudesConfidence = "MEDIUM";
  }

  const appraisalValue = (() => {
    const summaryMatch = /\briepilogo\s*:/i.exec(text);

    if (summaryMatch) {
      const summarySection = text.slice(
        summaryMatch.index,
        summaryMatch.index + 1800,
      );

      const endMatch =
        /\badeguamenti\s+e\s+correzioni\s+della\s+stima\b/i.exec(
          summarySection,
        );

      const boundedSummary = endMatch
        ? summarySection.slice(0, endMatch.index)
        : summarySection;

      const amounts = [
        ...boundedSummary.matchAll(
          /(?:€|euro)?\s*([0-9][0-9.\s]*,[0-9]{2})/gi,
        ),
      ]
        .map((match) => parseEuro(match[1] ?? null))
        .filter(
          (value): value is number =>
            value !== null && value >= 1000,
        );

      if (amounts.length) {
        return amounts[amounts.length - 1] ?? null;
      }
    }

    return null;
  })();

  const auctionValue = pickEuroAfter(text, [
    /\bprezzo\s+base(?:\s+d['’]asta)?[\s\S]{0,160}?(?:€|euro)?\s*([0-9][0-9.\s]*,[0-9]{2})/i,
    /\bbase\s+d['’]asta[\s\S]{0,160}?(?:€|euro)?\s*([0-9][0-9.\s]*,[0-9]{2})/i,
  ]);

  const forcedSaleAdjustment = parsePercent(
    pick(text, [
      /\briduzion[ei][\s\S]{0,120}?([0-9]+(?:[.,][0-9]+)?)\s*%/i,
      /\babbattimento[\s\S]{0,120}?([0-9]+(?:[.,][0-9]+)?)\s*%/i,
    ]),
  );

  const bodyFields: ParsedField[] =
    ctuBodies.flatMap((body) => [
      field(
        `ctuBody:${body.code}:label`,
        `Corpo ${body.code} — tipologia`,
        body.label,
      ),
      field(
        `ctuBody:${body.code}:sheet`,
        `Corpo ${body.code} — foglio`,
        body.sheet,
      ),
      field(
        `ctuBody:${body.code}:parcel`,
        `Corpo ${body.code} — particella`,
        body.parcel,
      ),
      field(
        `ctuBody:${body.code}:sub`,
        `Corpo ${body.code} — subalterno`,
        body.sub,
      ),
      field(
        `ctuBody:${body.code}:category`,
        `Corpo ${body.code} — categoria`,
        body.category,
      ),
      field(
        `ctuBody:${body.code}:income`,
        `Corpo ${body.code} — rendita`,
        body.cadastralIncome,
      ),
      field(
        `ctuBody:${body.code}:surface`,
        `Corpo ${body.code} — superficie totale`,
        body.surface,
      ),
    ]);

  const fields: ParsedField[] = [
    ...bodyFields,

    field(
      "ctuLotNumber",
      "Numero lotto CTU",
      findLotNumber(text),
    ),

    field(
      "address",
      "Indirizzo",
      findAddress(text),
      undefined,
      "Indirizzo rilevato nel testo della CTU.",
    ),
    field(
      "occupancy",
      "Stato di occupazione",
      occupancy.value,
      occupancy.confidence,
      "Non viene equiparato «non abitato» a «libero».",
    ),
    field(
      "cadastralSheet",
      "Foglio catastale",
      aggregate(sheets),
      sheets.length > 1 ? "MEDIUM" : undefined,
      sheets.length > 1
        ? "La CTU contiene più valori."
        : undefined,
    ),
    field(
      "cadastralParcel",
      "Particella / mappale",
      aggregate(parcels),
      parcels.length > 1 ? "MEDIUM" : undefined,
      parcels.length > 1
        ? "La CTU contiene più corpi o particelle."
        : undefined,
    ),
    field(
      "cadastralSub",
      "Subalterno",
      aggregate(subs),
      subs.length > 1 ? "MEDIUM" : undefined,
      subs.length > 1
        ? "La CTU contiene più subalterni."
        : undefined,
    ),
    field(
      "cadastralCategory",
      "Categoria catastale",
      aggregate(categories),
      categories.length > 1 ? "MEDIUM" : undefined,
      categories.length > 1
        ? "La CTU contiene più categorie catastali."
        : undefined,
    ),
    field(
      "cadastralIncome",
      "Rendita catastale",
      aggregate(incomes),
      incomes.length > 1 ? "MEDIUM" : undefined,
      incomes.length > 1
        ? "Valori multipli mantenuti separati."
        : undefined,
    ),
    field(
      "surfaceSummary",
      "Superfici rilevate",
      aggregate(surfaces),
      surfaces.length > 1 ? "MEDIUM" : undefined,
      surfaces.length > 1
        ? "Sono presenti più superfici; non vengono sommate automaticamente."
        : undefined,
    ),
    field(
      "energyClass",
      "Classe energetica",
      energyClass,
    ),
    field(
      "urbanCompliance",
      "Conformità urbanistico-edilizia",
      urbanCompliance.value,
      urbanCompliance.confidence,
    ),
    field(
      "cadastralCompliance",
      "Conformità catastale",
      cadastralCompliance.value,
      cadastralCompliance.confidence,
    ),
    field(
      "servitudes",
      "Servitù",
      servitudes,
      servitudesConfidence,
    ),
    field(
      "ctuAppraisalValue",
      "Valore di stima CTU",
      appraisalValue,
      appraisalValue === null ? "MISSING" : "HIGH",
      "Valore riportato dal perito; non costituisce una stima indipendente del Walltech Engine.",
    ),
    field(
      "forcedSaleAdjustmentPercent",
      "Abbattimento / riduzione vendita forzata",
      forcedSaleAdjustment,
      forcedSaleAdjustment === null
        ? "MISSING"
        : "HIGH",
    ),
    field(
      "ctuAuctionValue",
      "Valore / prezzo base indicato nella CTU",
      auctionValue,
      auctionValue === null ? "MISSING" : "HIGH",
      "Dato procedurale/peritale, da confrontare con l'avviso di vendita vigente.",
    ),
  ];

  const missingFields = fields
    .filter((item) => item.confidence === "MISSING")
    .map((item) => item.label);

  return {
    id: "ctu",
    kind: "CTU",
    title: "CTU / Perizia",
    fields,
    warnings: Array.from(new Set(warnings)),
    missingFields,
  };
}
