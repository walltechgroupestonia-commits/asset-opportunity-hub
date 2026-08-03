# WalltechSearchEngine — piano file per file

> Nota sui percorsi: nel progetto la cartella reale è `src/components/` (al plurale).
> `src/component/walltech/` non esiste, quindi il file va creato in
> `src/components/walltech/WalltechSearchEngine.tsx`.

## 1. `src/components/walltech/WalltechSearchEngine.tsx` (nuovo)


Componente modulare autonomo, nessuna dipendenza dai componenti esistenti oltre alla UI condivisa (`Button`, `Input`, `Label`, `Select`) e ai token del tema.

Contenuto:

- **Interfaccia Adapter** (esportata, pronta per API/feed reali):

```text
type AdapterStatus = "READY" | "PENDING AGREEMENT"

interface SearchFilters { area, assetType, maxBudget, occupancy, procedure }
interface WalltechListing { id, title, area, assetType, basePrice, marketValue, occupancy, procedure, score }
interface SourceAdapter {
  id: string
  label: string
  status: AdapterStatus
  fetch(filters: SearchFilters): Promise<WalltechListing[]>
}
```

- **Adapter demo locali** (solo rendering iniziale, sostituibili uno a uno):
  PVP = READY, Astalegale = PENDING AGREEMENT, Abilio/Quimmo = PENDING AGREEMENT,
  Immobiliallasta = READY, Custom API = READY.
  Gli adapter PENDING restituiscono array vuoto.

- **Form filtri** (grid responsive, nessuna sovrapposizione):
  Comune/Provincia (input testo), Tipologia Asset, Budget massimo,
  Stato occupazione, Procedura (select).

- **Pulsante principale** "Analizza opportunità" (variante `signal`) con stato di caricamento breve.

- **Pannello "Adapter Manager"** visibile dopo la ricerca: elenco delle 5 sorgenti con badge di stato
  (verde/success per READY, muted/arancio per PENDING AGREEMENT) e conteggio risultati per sorgente.

- **Prima Analisi Walltech**: Opportunity Score aggregato (0–100) calcolato dai dati demo
  (spread valore/offerta, occupazione, procedura), KPI di sintesi e card risultati.
  Pulsante "Richiedi Dossier Integrato" che invoca la prop `onDossier`.

Props: `{ onDossier: () => void }` — nessun altro side effect, nessuna chiamata di rete.

## 2. `src/routes/index.tsx` (modifica minima)

- aggiungere l'import di `WalltechSearchEngine`;
- inserirlo tra `<Hero />`/`<TrustBar />` e `<ChannelGrid />` (subito sotto l'Hero, prima di ChannelGrid);
- passare `onDossier={() => setDossier(true)}` per riusare il `DossierDialog` esistente.

Nessun'altra riga della route viene toccata.

## 3. File NON modificati

SiteHeader, Hero, TrustBar, ChannelGrid, ProcessTimeline, OperationsExplorer, SiteFooter,
dialogs.tsx, styles.css, data/operations.ts, hooks — invariati.
I flussi Dossier Integrato, Zapier e HubSpot restano esattamente come sono.

## Note tecniche

- Solo token semantici del tema (`surface-panel`, `mono-label`, `text-primary`, `bg-surface`,
  `text-success`) — nessun colore hardcoded.
- Animazioni riusate dal sistema esistente (`reveal` / `useReveal`, `pulse-dot`).
- Layout mobile-first: `grid gap-4 md:grid-cols-2 lg:grid-cols-5`, testi con `min-w-0`.
