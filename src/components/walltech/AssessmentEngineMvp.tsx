import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, Gauge, ShieldCheck } from "lucide-react";

type Profile = "private" | "company" | "investor" | "partner" | "";
type Procedure = "none" | "warning" | "active" | "auction" | "";
type Occupancy = "free" | "owner" | "tenant" | "unknown" | "";
type Documents = "complete" | "partial" | "missing" | "";
type Urgency = "low" | "medium" | "high" | "";

interface State {
  profile: Profile;
  city: string;
  assetType: string;
  estimatedValue: string;
  procedure: Procedure;
  occupancy: Occupancy;
  documents: Documents;
  urgency: Urgency;
  notes: string;
}

const initialState: State = {
  profile: "",
  city: "",
  assetType: "",
  estimatedValue: "",
  procedure: "",
  occupancy: "",
  documents: "",
  urgency: "",
  notes: "",
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculate(data: State) {
  let opportunity = 50;
  let risk = 50;

  if (data.profile === "investor") opportunity += 15;
  if (data.profile === "partner") opportunity += 8;
  if (data.profile === "company") opportunity += 5;

  const value = Number(data.estimatedValue.replace(/[^\d]/g, ""));
  if (value >= 500000) opportunity += 15;
  else if (value >= 250000) opportunity += 10;
  else if (value >= 100000) opportunity += 5;

  if (data.procedure === "none") { opportunity += 8; risk -= 15; }
  if (data.procedure === "warning") { opportunity += 4; risk += 5; }
  if (data.procedure === "active") { opportunity += 8; risk += 18; }
  if (data.procedure === "auction") { opportunity += 4; risk += 28; }

  if (data.occupancy === "free") { opportunity += 10; risk -= 15; }
  if (data.occupancy === "owner") risk += 3;
  if (data.occupancy === "tenant") risk += 12;
  if (data.occupancy === "unknown") risk += 20;

  if (data.documents === "complete") { opportunity += 15; risk -= 20; }
  if (data.documents === "partial") { opportunity += 5; risk += 5; }
  if (data.documents === "missing") { opportunity -= 20; risk += 30; }

  if (data.urgency === "high") risk += 12;
  if (data.urgency === "low") risk -= 5;

  const opportunityScore = clamp(opportunity);
  const riskScore = clamp(risk);
  const readiness = data.documents === "missing" || riskScore >= 80
    ? "BLOCKED"
    : opportunityScore >= 65 && riskScore < 65
      ? "READY"
      : "REVIEW";
  const priority = data.urgency === "high" || readiness === "READY"
    ? "HIGH"
    : readiness === "REVIEW"
      ? "MEDIUM"
      : "LOW";

  let nextAction = "Completare la raccolta dati preliminare.";
  let evidence = "Dati identificativi e documentazione minima.";

  if (data.documents === "missing") {
    nextAction = "Richiedere la documentazione essenziale prima di proseguire.";
    evidence = "Titolo di provenienza, visura, planimetria e documenti della procedura.";
  } else if (data.procedure === "auction") {
    nextAction = "Aprire immediatamente un dossier operativo e verificare le scadenze.";
    evidence = "Avviso di vendita, perizia, ordinanza e calendario della procedura.";
  } else if (readiness === "READY") {
    nextAction = "Generare il dossier preliminare e assegnare il caso a un owner.";
    evidence = "Assessment completato, documenti disponibili e next action registrata.";
  }

  const route = data.profile === "investor" ? "/investor" : data.profile === "partner" ? "/crm" : "/dossier";
  return { opportunityScore, riskScore, readiness, priority, nextAction, evidence, route };
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-xs font-semibold tracking-[0.12em] text-muted-foreground">{children}</span>;
}

export function AssessmentEngineMvp() {
  const [data, setData] = useState<State>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const result = useMemo(() => calculate(data), [data]);
  const complete = Boolean(data.profile && data.city && data.assetType && data.procedure && data.occupancy && data.documents && data.urgency);
  const update = <K extends keyof State>(key: K, value: State[K]) => setData((current) => ({ ...current, [key]: value }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Torna a Walltech
          </a>
          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">WALLTECH INTELLIGENCE ENGINE™</p>
            <p className="mt-1 text-xs text-muted-foreground">Assessment Engine · MVP</p>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">QUALIFICAZIONE INIZIALE</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">Trasforma dati preliminari in una prima decisione operativa.</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Compila i dati essenziali. L'Engine genera Opportunity Score, Risk Score, priorità, next action ed evidence richiesta.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto grid gap-8 px-4 xl:grid-cols-[1fr_0.8fr]">
          <form className="border border-border bg-card/30 p-6" onSubmit={(e) => { e.preventDefault(); if (complete) setSubmitted(true); }}>
            <div className="grid gap-6 md:grid-cols-2">
              <label><Label>PROFILO</Label><select value={data.profile} onChange={(e)=>update("profile", e.target.value as Profile)} className="w-full border border-border bg-background px-4 py-3 text-sm"><option value="">Seleziona</option><option value="private">Privato / Proprietario</option><option value="company">Impresa</option><option value="investor">Investitore / Buyer</option><option value="partner">Professionista / Partner</option></select></label>
              <label><Label>CITTÀ / AREA</Label><input value={data.city} onChange={(e)=>update("city", e.target.value)} placeholder="Es. Milano" className="w-full border border-border bg-background px-4 py-3 text-sm" /></label>
              <label><Label>TIPOLOGIA IMMOBILE / ASSET</Label><input value={data.assetType} onChange={(e)=>update("assetType", e.target.value)} placeholder="Es. Residenziale" className="w-full border border-border bg-background px-4 py-3 text-sm" /></label>
              <label><Label>VALORE STIMATO</Label><input value={data.estimatedValue} onChange={(e)=>update("estimatedValue", e.target.value)} placeholder="Es. 300000" inputMode="numeric" className="w-full border border-border bg-background px-4 py-3 text-sm" /></label>
              <label><Label>STATO PROCEDURA</Label><select value={data.procedure} onChange={(e)=>update("procedure", e.target.value as Procedure)} className="w-full border border-border bg-background px-4 py-3 text-sm"><option value="">Seleziona</option><option value="none">Nessuna procedura</option><option value="warning">Precontenzioso</option><option value="active">Procedura attiva</option><option value="auction">Asta fissata</option></select></label>
              <label><Label>OCCUPAZIONE</Label><select value={data.occupancy} onChange={(e)=>update("occupancy", e.target.value as Occupancy)} className="w-full border border-border bg-background px-4 py-3 text-sm"><option value="">Seleziona</option><option value="free">Libero</option><option value="owner">Occupato dal proprietario</option><option value="tenant">Locato / Terzi</option><option value="unknown">Da verificare</option></select></label>
              <label><Label>DOCUMENTAZIONE</Label><select value={data.documents} onChange={(e)=>update("documents", e.target.value as Documents)} className="w-full border border-border bg-background px-4 py-3 text-sm"><option value="">Seleziona</option><option value="complete">Completa</option><option value="partial">Parziale</option><option value="missing">Mancante</option></select></label>
              <label><Label>URGENZA</Label><select value={data.urgency} onChange={(e)=>update("urgency", e.target.value as Urgency)} className="w-full border border-border bg-background px-4 py-3 text-sm"><option value="">Seleziona</option><option value="low">Bassa</option><option value="medium">Media</option><option value="high">Alta</option></select></label>
            </div>
            <label className="mt-6 block"><Label>NOTE</Label><textarea value={data.notes} onChange={(e)=>update("notes", e.target.value)} rows={5} placeholder="Aggiungi informazioni utili..." className="w-full border border-border bg-background px-4 py-3 text-sm" /></label>
            <button type="submit" disabled={!complete} className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Genera assessment <ArrowRight className="h-4 w-4" /></button>
          </form>

          <aside className="border border-border bg-card/30 p-6 xl:sticky xl:top-6 xl:h-fit">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
              <div><p className="text-[11px] font-semibold tracking-[0.22em] text-primary">ENGINE OUTPUT</p><h2 className="mt-3 text-2xl font-bold">{submitted ? "Assessment completato" : "Anteprima dinamica"}</h2></div>
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border border-border bg-background/70 p-4"><p className="text-xs text-muted-foreground">Opportunity Score</p><p className="mt-2 text-3xl font-bold">{result.opportunityScore}</p></div>
              <div className="border border-border bg-background/70 p-4"><p className="text-xs text-muted-foreground">Risk Score</p><p className="mt-2 text-3xl font-bold">{result.riskScore}</p></div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between border border-border bg-background/70 p-4"><span className="text-sm text-muted-foreground">Readiness</span><strong>{result.readiness}</strong></div>
              <div className="flex items-center justify-between border border-border bg-background/70 p-4"><span className="text-sm text-muted-foreground">Priorità</span><strong>{result.priority}</strong></div>
            </div>
            <div className="mt-6 border border-primary/30 bg-primary/[0.04] p-4"><div className="flex items-start gap-3">{result.readiness === "READY" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" /> : result.readiness === "BLOCKED" ? <AlertTriangle className="mt-0.5 h-5 w-5 text-primary" /> : <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />}<div><p className="font-semibold">Next Action</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{result.nextAction}</p></div></div></div>
            <div className="mt-4 border border-border bg-background/70 p-4"><div className="flex items-start gap-3"><FileCheck2 className="mt-0.5 h-5 w-5 text-primary" /><div><p className="font-semibold">Evidence richiesta</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{result.evidence}</p></div></div></div>
            {submitted ? <a href={result.route} className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-primary/50 px-5 py-3 text-sm font-semibold text-primary">Prosegui nel percorso <ArrowRight className="h-4 w-4" /></a> : null}
            <div className="mt-6 border-t border-border pt-5"><p className="text-xs leading-6 text-muted-foreground">Output preliminare e organizzativo. Le verifiche legali, fiscali, tecniche, urbanistiche, estimative e professionali sono svolte esclusivamente dai professionisti abilitati incaricati.</p></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
