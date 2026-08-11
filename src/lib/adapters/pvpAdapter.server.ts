export const PVP_HOME_URL = "https://pvp.giustizia.it/pvp/it/homepage.page";

const PVP_FALLBACK_URLS = [
  PVP_HOME_URL,
  "https://pvp.giustizia.it/pvp/",
] as const;

export interface PvpProbe {
  ok: boolean;
  httpStatus: number | null;
  latencyMs: number;
  timestamp: string;
  sourceUrl: string;
  note?: string;
}

/**
 * Technical reachability probe of the official PVP public portal.
 *
 * The probe is deliberately server-side so browser CORS rules do not turn a
 * reachable public source into a false negative. It only measures public HTTP
 * reachability/status/latency. No listing is read, parsed, stored or scraped.
 */
export async function probePvpHomepage(): Promise<PvpProbe> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  let lastStatus: number | null = null;
  let lastUrl = PVP_HOME_URL;
  let lastError = "PVP probe fallita";

  try {
    for (const url of PVP_FALLBACK_URLS) {
      lastUrl = url;
      try {
        const res = await fetch(url, {
          method: "GET",
          redirect: "follow",
          headers: {
            accept: "text/html,application/xhtml+xml",
            "user-agent": "Walltech-Intelligence-Engine-PVP-Probe/1.0",
          },
          signal: controller.signal,
        });

        lastStatus = res.status;

        // Any 2xx/3xx response proves that the official public endpoint is
        // reachable. We do not consume or parse the response body.
        if (res.status >= 200 && res.status < 400) {
          return {
            ok: true,
            httpStatus: res.status,
            latencyMs: Date.now() - started,
            timestamp: new Date().toISOString(),
            sourceUrl: res.url || url,
            note: "Endpoint pubblico PVP raggiungibile. Nessun annuncio letto, estratto o memorizzato.",
          };
        }

        lastError = `PVP ha risposto con HTTP ${res.status}`;
      } catch (error) {
        lastError = error instanceof Error ? error.message : "PVP probe fallita";
        if (controller.signal.aborted) break;
      }
    }

    return {
      ok: false,
      httpStatus: lastStatus,
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
      sourceUrl: lastUrl,
      note: lastError,
    };
  } finally {
    clearTimeout(timer);
  }
}
