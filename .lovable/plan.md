# Trasparenza dati — piano file per file

Obiettivo: eliminare ogni indicazione di ricerca live non reale, distinguendo
esplicitamente DEMO DATASET e LIVE PARTNER FEED.

## 1. `src/components/walltech/OperationsExplorer.tsx` (modifica)

- Badge sostituito: da "Sotto-sistema Ingestion: Attivo" a
  **"CONNESSIONE SORGENTE VERIFICATA — DATI LIVE NON ANCORA AUTORIZZATI"**
  (stile neutro/primary, niente pulse verde "attivo").
- Nuovo switch a due modalità (segmented, sopra i filtri):
  - **DEMO DATASET** — filtri e card attuali invariati, con dicitura fissa
    "Dati dimostrativi non provenienti dal PVP" sopra la griglia.
  - **LIVE PARTNER FEED** — nessuna card demo; pannello con
    "In attesa di feed/API autorizzata" e tre stati PVP:
    `SOURCE REACHABLE`, `FEED NOT AUTHORIZED`, `AGREEMENT REQUIRED`.
- Nuovo pulsante **"Continua la ricerca sul PVP ufficiale"** (link esterno,
  `target="_blank" rel="noopener noreferrer"`) che apre la pagina pubblica PVP
  con i parametri disponibili; nessuna dichiarazione di import risultati.
- Contatore risultati mostrato solo in modalità demo (label "risultati demo").
- Logica di filtro, card, dossier e resto del layout invariati.

## 2. `src/lib/adapters/types.ts` (aggiunta)

Nuova interfaccia, senza implementazioni simulate:

```text
interface PartnerFeedCredentials { apiKey?: string; endpoint?: string; token?: string }
interface NormalizedListing { id, title, area, assetType, basePrice, occupancy, procedure, sourceUrl }

interface PartnerFeedAdapter {
  id: string
  name: string
  connect(credentials: PartnerFeedCredentials): Promise<ConnectionTestResult>
  search(filters: HandoffFilters): Promise<NormalizedListing[]>
  normalize(results: unknown[]): NormalizedListing[]
  disconnect(): void
}
```

Nessun adapter live viene istanziato: l'interfaccia è solo predisposizione.

## 3. `src/components/walltech/LiveSourceValidation.tsx` (modifica minima)

Il pannello tecnico mostra solo: HTTP status, latenza, timestamp, URL verificato
e la dicitura fissa **"raggiungibilità verificata — nessun annuncio acquisito"**.
Rimosse le righe "Tipo di connessione" e "Modalità corrente" e ogni wording che
possa suggerire acquisizione dati. Search Handoff e stati restano.

## 4. File NON modificati

Dossier Integrato, Zapier, HubSpot, dialogs.tsx, WalltechSearchEngine,
SiteHeader, Hero, TrustBar, ChannelGrid, ProcessTimeline, SiteFooter,
styles.css, data/operations.ts — invariati. Nessuna modifica grafica al tema.
