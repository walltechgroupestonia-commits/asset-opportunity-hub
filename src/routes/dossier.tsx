import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { OPERATIONS } from "@/data/operations";

const TITLE = "Dossier Operativo — WALLTECH GROUP OÜ";
const DESCRIPTION =
  "Investment memorandum istituzionale: executive summary, analisi finanziaria, due diligence, business case e data room per operazioni immobiliari e NPL.";

export const Route = createFileRoute("/dossier")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DossierPage,
});

const asset = OPERATIONS[0]!;

const eur = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const KPIS = [
  { label: "Base d'asta", value: eur(asset.basePrice), note: "Prezzo di riferimento procedura" },
  { label: "Valore di mercato", value: eur(asset.marketValue), note: "OMI + comparables Q2" },
  { label: "Spread lordo", value: eur(asset.marketValue - asset.basePrice), note: "Delta valore / base" },
  { label: "IRR target", value: `${asset.roi.toFixed(1)}%`, note: "Orizzonte 14 mesi" },
];

const FINANCIALS: Array<[string, string, string]> = [
  ["Prezzo di aggiudicazione stimato", eur(asset.basePrice * 1.06), "Ipotesi 2 rilanci"],
  ["Oneri procedurali e fiscali", eur(asset.basePrice * 0.11), "Imposte, decreto, cancellazioni"],
  ["CAPEX ristrutturazione", eur(asset.surface * 620), `${asset.surface} mq × 620 €/mq`],
  ["Costi di gestione e holding", eur(28400), "14 mesi, incl. utenze e IMU"],
  ["Totale investito", eur(asset.basePrice * 1.17 + asset.surface * 620 + 28400), "Full equity"],
  ["Exit lorda attesa", eur(asset.marketValue), "Vendita a valore di mercato"],
];

const DILIGENCE: Array<[string, string, string]> = [
  ["Titolarità e provenienza", "VERIFICATO", "Atto di provenienza 2011, catena continua"],
  ["Ipoteche e gravami", "VERIFICATO", "Cancellazione a cura del giudice dell'esecuzione"],
  ["Conformità urbanistica", "PARZIALE", "Difformità interne sanabili — CILA in sanatoria"],
  ["Conformità catastale", "VERIFICATO", "Planimetria coerente con lo stato dei luoghi"],
  ["Stato occupazionale", asset.occupancy === "libero" ? "LIBERO" : "OCCUPATO", "Perizia del custode giudiziario"],
  ["Spese condominiali", "IN CORSO", "Ultimo biennio a carico dell'aggiudicatario"],
];

const TIMELINE: Array<[string, string, string]> = [
  ["T0", "Mandato e diagnosi peritale", "Settimana 0–2"],
  ["T1", "Strutturazione finanziaria e comitato", "Settimana 2–4"],
  ["T2", "Deposito offerta e asta", asset.auctionDate],
  ["T3", "Decreto di trasferimento", "+60/90 giorni"],
  ["T4", "Esecuzione CAPEX", "Mese 4–10"],
  ["T5", "Exit / messa a reddito", "Mese 12–14"],
];

const DOCS: Array<[string, string]> = [
  ["Perizia CTU integrale", "PDF · 4.2 MB"],
  ["Ordinanza di vendita", "PDF · 0.8 MB"],
  ["Visure ipocatastali", "PDF · 1.1 MB"],
  ["Modello finanziario (base/bear/bull)", "XLSX · 320 KB"],
  ["Report comparables OMI", "PDF · 2.4 MB"],
  ["Term sheet operazione", "PDF · 260 KB"],
];

function SectionHeading({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <header className="border-b border-border pb-4">
      <p className="mono-label text-primary">Sezione {n}</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{sub}</p>
    </header>
  );
}

function Section({
  id,
  n,
  title,
  sub,
  children,
}: {
  id: string;
  n: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <SectionHeading n={n} title={title} sub={sub} />
      {children}
    </section>
  );
}

function DataRow({ cells }: { cells: string[] }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)]">
      <span className="min-w-0 text-foreground">{cells[0]}</span>
      <span className="mono-label self-center whitespace-nowrap text-primary sm:text-right">{cells[1]}</span>
      <span className="col-span-2 min-w-0 text-xs text-muted-foreground sm:col-span-1 sm:text-right">
        {cells[2]}
      </span>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="surface-panel rounded-sm">{children}</div>;
}

function DossierPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="mono-label text-primary">Walltech Group OÜ · Confidential</p>
            <p className="truncate text-sm font-semibold">Dossier Operativo — {asset.rge}</p>
          </div>
          <Link to="/">
            <Button variant="quiet" size="sm">
              Chiudi
            </Button>
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-6 sm:py-14">
        <section className="grid-overlay hero-gradient rounded-sm border border-border p-6 sm:p-10">
          <p className="mono-label text-primary">Institutional Investment Memorandum</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
            {asset.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {asset.city} ({asset.cap}) · {asset.rge} · Asta {asset.auctionDate} · Rating interno{" "}
            <span className="text-primary">{asset.riskScore}</span>
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div key={k.label} className="surface-panel rounded-sm p-5">
                <p className="mono-label text-muted-foreground">{k.label}</p>
                <p className="mt-3 text-2xl font-semibold text-primary sm:text-3xl">{k.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{k.note}</p>
              </div>
            ))}
          </div>
        </section>

        <Section
          id="executive-summary"
          n="01"
          title="Executive Summary"
          sub="Sintesi della tesi d'investimento, del profilo di rischio e della struttura dell'operazione."
        >
          <Panel>
            <div className="space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                L'operazione riguarda un asset {asset.type} in {asset.city}, inserito in procedura
                esecutiva ({asset.rge}), acquisibile a uno sconto strutturale rispetto al valore di
                mercato stimato. La tesi si fonda su uno spread di{" "}
                <span className="text-foreground">{eur(asset.marketValue - asset.basePrice)}</span>{" "}
                riducibile a rischio contenuto grazie a diagnosi peritale completata e vincoli
                procedurali mappati.
              </p>
              <p className="text-foreground">{asset.notes}</p>
            </div>
            <div>
              <DataRow cells={["Struttura", "FULL EQUITY", "Nessuna leva bancaria in ipotesi base"]} />
              <DataRow cells={["Orizzonte", "14 MESI", "Dall'aggiudicazione all'exit"]} />
              <DataRow cells={["Rischio", `CLASSE ${asset.riskScore}`, "Scoring interno Walltech"]} />
            </div>
          </Panel>
        </Section>

        <Section
          id="asset-overview"
          n="02"
          title="Asset Overview"
          sub="Identificazione, consistenza e stato dell'immobile oggetto dell'operazione."
        >
          <Panel>
            <DataRow cells={["Tipologia", asset.type.toUpperCase(), "Destinazione urbanistica coerente"]} />
            <DataRow cells={["Superficie commerciale", `${asset.surface} MQ`, "Al netto delle pertinenze"]} />
            <DataRow cells={["Localizzazione", `${asset.city.toUpperCase()} ${asset.cap}`, "Micro-zona semicentrale"]} />
            <DataRow cells={["Stato occupazionale", asset.occupancy.toUpperCase(), "Verificato dal custode"]} />
            <DataRow cells={["Data d'asta", asset.auctionDate, "Vendita telematica"]} />
          </Panel>
        </Section>

        <Section
          id="financial-analysis"
          n="03"
          title="Financial Analysis"
          sub="Costruzione del costo pieno dell'operazione e dei rendimenti attesi nello scenario base."
        >
          <Panel>
            {FINANCIALS.map(([a, b, c]) => (
              <DataRow key={a} cells={[a, b, c]} />
            ))}
          </Panel>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Scenario bear", `${(asset.roi - 11).toFixed(1)}%`],
              ["Scenario base", `${asset.roi.toFixed(1)}%`],
              ["Scenario bull", `${(asset.roi + 8).toFixed(1)}%`],
            ].map(([l, v]) => (
              <div key={l} className="surface-panel rounded-sm p-5">
                <p className="mono-label text-muted-foreground">{l}</p>
                <p className="mt-2 text-2xl font-semibold text-primary">{v}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="due-diligence"
          n="04"
          title="Due Diligence"
          sub="Esito delle verifiche legali, urbanistiche e catastali condotte sulla posizione."
        >
          <Panel>
            {DILIGENCE.map(([a, b, c]) => (
              <DataRow key={a} cells={[a, b, c]} />
            ))}
          </Panel>
        </Section>

        <Section
          id="business-case"
          n="05"
          title="Business Case"
          sub="Strategia di valorizzazione e opzioni di uscita valutate dal comitato investimenti."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Trading / Flipping", "Ristrutturazione leggera e rivendita a valore pieno entro 14 mesi.", "Preferita"],
              ["Messa a reddito", "Locazione a canone di mercato con yield lordo stimato 6,1%.", "Alternativa"],
              ["Cessione del credito", "Uscita anticipata tramite cessione della posizione a servicer.", "Difensiva"],
            ].map(([t, d, tag]) => (
              <div key={t} className="surface-panel rounded-sm p-6">
                <p className="mono-label text-primary">{tag}</p>
                <h3 className="mt-3 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="timeline"
          n="06"
          title="Timeline"
          sub="Cronoprogramma operativo dalla presa in carico del mandato all'uscita."
        >
          <Panel>
            {TIMELINE.map(([t, l, d]) => (
              <DataRow key={t} cells={[`${t} — ${l}`, d, ""]} />
            ))}
          </Panel>
        </Section>

        <Section
          id="documents"
          n="07"
          title="Attached Documents"
          sub="Documentazione tecnica disponibile nella data room riservata previa autorizzazione."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {DOCS.map(([n, m]) => (
              <div
                key={n}
                className="surface-panel grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-sm p-4"
              >
                <span className="min-w-0 truncate text-sm">{n}</span>
                <span className="mono-label shrink-0 text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>
        </Section>

        <section className="surface-panel rounded-sm p-6 text-center sm:p-10">
          <p className="mono-label text-primary">Accesso riservato</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Request Full Data Room</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            L'accesso integrale a perizie, modello finanziario e term sheet è riservato a investitori
            qualificati e controparti accreditate.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="signal" size="lg" asChild>
              <a href="mailto:info@walltechgroup.eu?subject=Request%20Full%20Data%20Room">
                Request Full Data Room
              </a>
            </Button>
            <Link to="/">
              <Button variant="quiet" size="lg">
                Torna alla piattaforma
              </Button>
            </Link>
          </div>
          <p className="mono-label mt-6 text-muted-foreground">
            Documento riservato — non costituisce offerta al pubblico né sollecitazione all'investimento
          </p>
        </section>
      </main>
    </div>
  );
}
