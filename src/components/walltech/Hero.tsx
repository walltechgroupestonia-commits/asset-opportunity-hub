import { ShieldCheck, Cpu, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-walltech.jpg";

const metrics = [
  { label: "Procedure monitorate", value: "18.400+" },
  { label: "Mercati coperti", value: "IT · ES · DE" },
  { label: "Legal partner", value: "60+" },
  { label: "Latenza ingestion", value: "< 12h" },
];

export function Hero({ onDossier, onOperations }: { onDossier: () => void; onOperations: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <img
        src={heroImage}
        alt="Rappresentazione astratta di analisi dati immobiliari su mercati europei"
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover opacity-45"
      />
      <div className="hero-gradient absolute inset-0" />
      <div className="grid-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
        <p className="mono-label text-primary">Real Estate &amp; NPL Advisory Hub</p>
        <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] font-bold md:text-6xl">
          Diagnostica peritale, modellazione finanziaria e{" "}
          <span className="text-signal-gradient">strutturazione di operazioni in pre-asta</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          SOS Pignoramento — Engine di Analisi Diagnostica &amp; Risk Assessment. I dati pubblicati
          sono elaborati da algoritmi proprietari e validati dal network di legal partner
          qualificati.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="signal" size="lg" onClick={onDossier}>
            Richiedi il Dossier Integrato
          </Button>
          <Button variant="quiet" size="lg" onClick={onOperations}>
            Esplora le operazioni
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Cpu className="size-4 text-primary" /> Algoritmi proprietari di scoring
          </span>
          <span className="inline-flex items-center gap-2">
            <Scale className="size-4 text-primary" /> Validazione legale qualificata
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> Prospetto economico dettagliato
          </span>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-surface px-5 py-5">
              <dt className="mono-label text-muted-foreground">{m.label}</dt>
              <dd className="mt-2 font-display text-2xl font-bold">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
