# LiveSourceValidation — piano file per file

Modulo tecnico di validazione sorgenti, inserito sotto `WalltechSearchEngine`.
Nessun componente esistente viene riscritto; Dossier Integrato, Zapier, HubSpot,
OperationsExplorer e i dialog restano invariati.

## 1. `src/lib/adapters/types.ts` (nuovo)

Interfaccia comune per tutte le sorgenti:

```text
type ConnectionStatus =
  "NOT TESTED" | "CONNECTING" | "CONNECTED" | "SOURCE REACHABLE"
  | "PENDING AGREEMENT" | "ERROR"

interface ConnectionTestResult {
  status: ConnectionStatus
  httpStatus?: number
  latencyMs?: number
  timestamp: string
  sourceUrl: string
  connectionType: "HTTP public probe" | "REST API" | "Feed XML" | "Not available"
  mode: "PUBLIC REACHABILITY" | "READ-ONLY API" | "AWAITING AGREEMENT"
  note?: string
}

interface SearchHandoff { url: string; params: Record<string,string>; label: string }

interface SourceAdapter {
  id: string
  name: string
  status: ConnectionStatus
  testConnection(): Promise<ConnectionTestResult>
  buildSearchRequest(filters: HandoffFilters): SearchHandoff | null
  disconnect(): void
}
```

`HandoffFilters` = gli stessi campi già usati nel motore di ricerca
(comune/provincia, tipologia asset, budget, occupazione, procedura).

## 2. `src/lib/adapters/pvpAdapter.functions.ts` (nuovo)

Server function `probePvp` (`createServerFn`) che esegue una richiesta reale
verso la homepage pubblica PVP (`https://pvp.giustizia.it/pvp/`) con timeout,
e restituisce solo: `httpStatus`, `latencyMs`, `ok`, `timestamp`.
Nessuna estrazione o parsing di annunci.

## 3. `src/lib/adapters/pvpAdapter.ts` (nuovo)

Adapter PVP che implementa `SourceAdapter`:

- `testConnection()` chiama la server function e mappa il risultato in
  `SOURCE REACHABLE` (probe ok) / `ERROR`; connectionType `HTTP public probe`,
  mode `PUBLIC REACHABILITY`;
- `buildSearchRequest(filters)` costruisce il **Search Handoff**: URL della
  ricerca ufficiale PVP con i parametri derivati dai filtri già inseriti;
- `disconnect()` riporta lo stato a `NOT TESTED`.

Testo esplicito nel modulo: verifica di raggiungibilità, nessun dato estratto.

## 4. `src/lib/adapters/registry.ts` (nuovo)

Registro dei 5 adapter: PVP (reale) + Astalegale, Abilio/Quimmo,
Immobiliallasta, Custom API creati da una factory `pendingAdapter` che
restituisce sempre `PENDING AGREEMENT`, mode `AWAITING AGREEMENT`,
connectionType `Not available`, `buildSearchRequest` → `null`.

## 5. `src/components/walltech/LiveSourceValidation.tsx` (nuovo)

- Lista adapter selezionabili (chip/segmented, selezione singola).
- Pulsante **“Testa connessione”** con stato `CONNECTING` durante il test.
- Badge di stato colorato per i sei stati.
- Pannello tecnico a griglia: HTTP status, latenza (ms), timestamp,
  URL sorgente, tipo di connessione, modalità corrente.
- Blocco **Search Handoff**: riepilogo parametri + pulsante “Apri ricerca
  ufficiale PVP” (`target="_blank" rel="noopener noreferrer"`), disabilitato
  per gli adapter in PENDING AGREEMENT.
- Pulsante “Disconnetti” per azzerare lo stato.
- Disclaimer: verifica tecnica di raggiungibilità, nessuna estrazione annunci.
- Prop: `filters` (i filtri correnti) — nessun altro side effect.

Solo token del tema (`surface-panel`, `mono-label`, `text-primary`,
`text-success`, `border-border`), animazioni `reveal` esistenti, layout
responsive `grid gap-4 md:grid-cols-2 lg:grid-cols-3`.

## 6. `src/components/walltech/WalltechSearchEngine.tsx` (modifica minima additiva)

Una sola aggiunta: prop opzionale `onFiltersChange?(filters)`, chiamata quando
i filtri cambiano, così il modulo di validazione può riusare gli stessi valori.
Nessuna modifica a logica, layout, adapter demo o CTA Dossier.

## 7. `src/routes/index.tsx` (modifica minima)

- import di `LiveSourceValidation`;
- stato locale `searchFilters` alimentato da `onFiltersChange`;
- render di `<LiveSourceValidation filters={searchFilters} />` subito sotto
  `<WalltechSearchEngine />`, prima di `<ChannelGrid />`.

## 8. File NON modificati

SiteHeader, Hero, TrustBar, ChannelGrid, ProcessTimeline, OperationsExplorer,
SiteFooter, dialogs.tsx, styles.css, data/operations.ts, hooks.
