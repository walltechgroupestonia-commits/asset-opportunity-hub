import { ShieldCheck, Cpu, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-walltech.jpg";
import { useCountUp, useReveal } from "@/hooks/use-reveal";

type Metric = {
  label: string;
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  text?: string;
};

const metrics: Metric[] = [
  { label: "Procedure monitorate", value: 18400, suffix: "+" },
  { label: "Mercati coperti", text: "IT · ES · DE" },
  { label: "Legal partner", value: 60, suffix: "+" },
  { label: "Latenza ingestion", prefix: "< ", value: 12, suffix: "h" },
];

const nf = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });

function MetricValue({ metric, run }: { metric: Metric; run: boolean }) {
  const animated = useCountUp(metric.value ?? 0, run);
  if (metric.text) return <>{metric.text}</>;
  return (
    <>
      {metric.prefix}
      {nf.format(Math.round(animated))}
      {metric.suffix}
    </>
  );
}

export function Hero({ onDossier, onOperations }: { onDossier: () => void; onOperations: () => void }) {
  const { ref, visible } = useReveal<HTMLDListElement>(0.3);

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
        <p className="mono-label animate-rise text-primary">Real Estate &amp; NPL Advisory Hub</p>
        <h1
          className="animate-rise mt-5 max-w-4xl text-4xl leading-[1.05] font-bold md:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          Diagnostica peritale, modellazione finanziaria e{" "}
          <span className="text-signal-gradient">strutturazione di operazioni in pre-asta</span>.
        </h1>
        <p
          className="animate-rise mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          SOS Pignoramento — Engine di Analisi Diagnostica &amp; Risk Assessment. I dati pubblicati
          sono elaborati da algoritmi proprietari e validati dal network di legal partner
          qualificati.
        </p>

        <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
          <Button variant="signal" size="lg" onClick={onDossier} className="hover-scale">
            Richiedi il Dossier Integrato
          </Button>
          <Button variant="quiet" size="lg" onClick={onOperations}>
            Esplora le operazioni
          </Button>
        </div>

        <div
          className="animate-rise mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"
          style={{ animationDelay: "320ms" }}
        >
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

        <dl
          ref={ref}
          className={`reveal ${visible ? "reveal-in" : ""} mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-4`}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="group bg-surface px-5 py-5 transition-colors hover:bg-surface/70"
            >
              <dt className="mono-label text-muted-foreground">{m.label}</dt>
              <dd className="mt-2 font-display text-2xl font-bold tabular-nums">
                <MetricValue metric={m} run={visible} />
              </dd>
              <span className="mt-3 block h-px w-0 bg-[image:var(--gradient-signal)] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
