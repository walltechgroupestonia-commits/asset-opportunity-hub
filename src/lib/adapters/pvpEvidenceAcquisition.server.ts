const PVP_ORIGIN = "https://pvp.giustizia.it";
const PVP_RESOURCE_ORIGIN = "https://resource-pvp.giustizia.it";
const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024;

export interface PvpPublicAttachment {
  id: number;
  fileName: string;
  relativeUrl: string;
  sourceUrl: string;
  size: number;
  typeCode?: string;
  versionId?: string;
}

export interface PvpPublicAcquisitionMetadata {
  announcementId: string;
  detailUrl: string;
  saleEndpoint: string;
  bucketsHost: string;

  sale: {
    saleDate?: string;
    saleTime?: string;
    offerDeadlineDate?: string;
    offerDeadlineTime?: string;
    publicationDate?: string;
    creationDate?: string;
    saleTypeCode?: string;
    saleTypeLabel?: string;
    saleModeCode?: string;
    saleModeLabel?: string;
    basePrice?: number;
    minimumOffer?: number;
    minimumBidIncrease?: number;
    appraisalValue?: number;
    duplicate?: boolean;
  };

  procedure: {
    id?: number;
    number?: string;
    year?: number;
    procedureTypeCode?: string;
    procedureTypeLabel?: string;
    registryCode?: string;
    registryLabel?: string;
    courtCode?: string;
    courtLabel?: string;
  };

  lot: {
    id?: number;
    code?: string;
    description?: string;
    categoryCode?: string;
    categoryLabel?: string;
    lotTypeCode?: string;
    lotTypeLabel?: string;
  };

  goods: Array<{
    id?: number;
    description?: string;
    assetTypeCode?: string;
    assetTypeLabel?: string;
    categoryCode?: string;
    categoryLabel?: string;
    address?: {
      raw?: string;
      postalCode?: string;
      city?: string;
      provinceCode?: string;
      province?: string;
      region?: string;
      countryCode?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
  }>;

  publicActors: Array<{
    role?: string;
    name?: string;
  }>;

  attachments: PvpPublicAttachment[];
}

interface PvpRuntimeConfig {
  host?: string;
  bucketsHost?: string;
  msUrl?: {
    vendite?: string;
  };
}

interface PvpSaleEnvelope {
  body?: {
    idVendita?: number;
    codTipoVendita?: string;
    descTipoVendita?: string;
    dataVendita?: string;
    oraVendita?: string;
    impoOffertaMinima?: number;
    impoOffertaAumento?: number;
    impoBaseAsta?: number;
    impoStima?: number;
    codModVendita?: string;
    descModVendita?: string;
    dataTermPresOff?: string;
    oraTermPresOff?: string;
    dataDiPubblicazione?: string;
    dataCreazioneAnnuncio?: string;
    duplicato?: boolean;
    procedura?: any;
    lotto?: any;
    beni?: any[];
    soggetti?: any[];
    allegati?: Array<{
      idAllegato?: number;
      nomeFile?: string;
      linkAllegato?: string;
      dimensioneAllegato?: number;
      codiceTipoAllegato?: string;
    }>;
  };
}

function assertAnnouncementId(value: string): string {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) {
    throw new Error("ID annuncio PVP non valido.");
  }
  return normalized;
}

function assertAllowedUrl(url: string, allowedOrigin: string): URL {
  const parsed = new URL(url);
  if (parsed.origin !== allowedOrigin) {
    throw new Error(`Origine PVP non consentita: ${parsed.origin}`);
  }
  return parsed;
}

async function fetchPublic(
  url: string,
  allowedOrigin: string,
  accept: string,
): Promise<Response> {
  assertAllowedUrl(url, allowedOrigin);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept,
        "user-agent": "Walltech-Intelligence-Engine-PVP/1.0",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`PVP ha risposto con HTTP ${response.status}.`);
    }

    assertAllowedUrl(response.url || url, allowedOrigin);
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function extractBoMsPath(html: string): string {
  const match = html.match(
    /&quot;bo-ms&quot;:\{&quot;url&quot;:&quot;([^&]+)&quot;/,
  );

  const path = match?.[1];
  if (!path || !path.startsWith("/") || path.includes("://")) {
    throw new Error("Configurazione pubblica bo-ms non trovata.");
  }

  return path;
}

function parseVersionId(relativeUrl: string): string | undefined {
  try {
    const parsed = new URL(relativeUrl, PVP_RESOURCE_ORIGIN);
    return parsed.searchParams.get("versionId") ?? undefined;
  } catch {
    return undefined;
  }
}

export async function discoverPvpPublicSale(
  inputAnnouncementId: string,
): Promise<PvpPublicAcquisitionMetadata> {
  const announcementId = assertAnnouncementId(inputAnnouncementId);
  const detailUrl =
    `${PVP_ORIGIN}/pvp/it/detail_annuncio.page?idAnnuncio=${announcementId}`;

  const detailResponse = await fetchPublic(
    detailUrl,
    PVP_ORIGIN,
    "text/html,application/xhtml+xml",
  );

  const html = await detailResponse.text();
  const boMsPath = extractBoMsPath(html);
  const configUrl =
    `${PVP_ORIGIN}${boMsPath}/fe-config/dettaglio-annunci`;

  const configResponse = await fetchPublic(
    configUrl,
    PVP_ORIGIN,
    "application/json",
  );

  const config = (await configResponse.json()) as PvpRuntimeConfig;

  if (
    config.host !== PVP_ORIGIN ||
    config.bucketsHost !== PVP_RESOURCE_ORIGIN ||
    !config.msUrl?.vendite
  ) {
    throw new Error(
      "Configurazione runtime PVP non valida o non consentita.",
    );
  }

  const venditePath = config.msUrl.vendite.replace(/^\/+|\/+$/g, "");
  if (!/^[A-Za-z0-9_-]+\/ve-ms$/.test(venditePath)) {
    throw new Error("Percorso pubblico vendite PVP non valido.");
  }

  const saleEndpoint =
    `${PVP_ORIGIN}/${venditePath}/vendite/${announcementId}/restricted`;

  const saleResponse = await fetchPublic(
    saleEndpoint,
    PVP_ORIGIN,
    "application/json",
  );

  const envelope = (await saleResponse.json()) as PvpSaleEnvelope;
  const sale = envelope.body;

  if (
    !sale ||
    String(sale.idVendita ?? "") !== announcementId
  ) {
    throw new Error(
      "Risposta vendita PVP non coerente con l'annuncio richiesto.",
    );
  }

  const attachments = (sale.allegati ?? [])
    .map((attachment): PvpPublicAttachment | null => {
      const id = attachment.idAllegato;
      const fileName = attachment.nomeFile?.trim();
      const relativeUrl = attachment.linkAllegato?.trim();
      const size = attachment.dimensioneAllegato;

      if (
        typeof id !== "number" ||
        !fileName ||
        !relativeUrl ||
        typeof size !== "number" ||
        size < 0 ||
        size > MAX_ATTACHMENT_SIZE ||
        !relativeUrl.startsWith(`/allegati/${announcementId}/`)
      ) {
        return null;
      }

      const sourceUrl = new URL(
        relativeUrl,
        config.bucketsHost,
      ).toString();

      assertAllowedUrl(sourceUrl, PVP_RESOURCE_ORIGIN);

      return {
        id,
        fileName,
        relativeUrl,
        sourceUrl,
        size,
        typeCode: attachment.codiceTipoAllegato,
        versionId: parseVersionId(relativeUrl),
      };
    })
    .filter(
      (attachment): attachment is PvpPublicAttachment =>
        attachment !== null,
    );

  return {
    announcementId,
    detailUrl,
    saleEndpoint,
    bucketsHost: config.bucketsHost,

    sale: {
      saleDate: sale.dataVendita,
      saleTime: sale.oraVendita,
      offerDeadlineDate: sale.dataTermPresOff,
      offerDeadlineTime: sale.oraTermPresOff,
      publicationDate: sale.dataDiPubblicazione,
      creationDate: sale.dataCreazioneAnnuncio,
      saleTypeCode: sale.codTipoVendita,
      saleTypeLabel: sale.descTipoVendita,
      saleModeCode: sale.codModVendita,
      saleModeLabel: sale.descModVendita,
      basePrice: sale.impoBaseAsta,
      minimumOffer: sale.impoOffertaMinima,
      minimumBidIncrease: sale.impoOffertaAumento,
      appraisalValue: sale.impoStima,
      duplicate: sale.duplicato,
    },

    procedure: {
      id: sale.procedura?.idProcedura,
      number:
        sale.procedura?.numeRg != null
          ? String(sale.procedura.numeRg)
          : undefined,
      year: sale.procedura?.numeAnnoRg,
      procedureTypeCode: sale.procedura?.codTipoRito,
      procedureTypeLabel: sale.procedura?.descTipoRito,
      registryCode: sale.procedura?.codTipoRegistro,
      registryLabel: sale.procedura?.descTipoRegistro,
      courtCode: sale.procedura?.codUfficio,
      courtLabel: sale.procedura?.descUfficio,
    },

    lot: {
      id: sale.lotto?.idLotto,
      code: sale.lotto?.codLotto,
      description: sale.lotto?.descLotto,
      categoryCode: sale.lotto?.codTipoCategLotto,
      categoryLabel: sale.lotto?.descTipoCategLotto,
      lotTypeCode: sale.lotto?.codTipoLotto,
      lotTypeLabel: sale.lotto?.descTipoLotto,
    },

    goods: (sale.beni ?? []).map((bene: any) => ({
      id: bene.idBene,
      description: bene.descrizione,
      assetTypeCode: bene.codTipologiaBene,
      assetTypeLabel: bene.descTipologiaBene,
      categoryCode: bene.codTipoCategLotto,
      categoryLabel: bene.descTipoCategLotto,
      address: {
        raw: bene.indirizzo?.via,
        postalCode:
          bene.indirizzo?.via?.match(/\b\d{5}\b/)?.[0] ?? undefined,
        city: bene.indirizzo?.descComune,
        provinceCode: bene.indirizzo?.codProvincia,
        province: bene.indirizzo?.descProvincia,
        region: bene.indirizzo?.descRegione,
        countryCode: bene.indirizzo?.codNazione,
        country: bene.indirizzo?.descNazione,
        latitude: bene.indirizzo?.coordinate?.latitudine,
        longitude: bene.indirizzo?.coordinate?.longitudine,
      },
    })),

    publicActors: (sale.soggetti ?? []).map((soggetto: any) => ({
      role: soggetto.ruolo,
      name:
        [soggetto.nome, soggetto.cognome]
          .filter(Boolean)
          .join(" ") || undefined,
    })),

    attachments,
  };
}
