export const PVP_HOME_URL = "https://pvp.giustizia.it/pvp/";

export interface PvpProbe {
  ok: boolean;
  httpStatus: number | null;
  latencyMs: number;
  timestamp: string;
  sourceUrl: string;
  note?: string;
}

/**
 * Technical reachability probe of the PVP public homepage.
 * It only measures HTTP status and latency — no listing data is read or parsed.
 */
export async function probePvpHomepage(): Promise<PvpProbe> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(PVP_HOME_URL, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "Walltech-Connectivity-Probe/1.0" },
      signal: controller.signal,
    });
    return {
      ok: res.ok,
      httpStatus: res.status,
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
      sourceUrl: PVP_HOME_URL,
    };
  } catch (error) {
    return {
      ok: false,
      httpStatus: null,
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
      sourceUrl: PVP_HOME_URL,
      note: error instanceof Error ? error.message : "Probe fallita",
    };
  } finally {
    clearTimeout(timer);
  }
}
