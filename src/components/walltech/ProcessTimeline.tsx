import { FileSearch, LineChart, Handshake, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const steps: { icon: LucideIcon; step: string; title: string; body: string; kpi: string }[] = [
  {
    icon: FileSearch,
    step: "01",
    title: "Due diligence documentale",
    body: "Estrazione perizia, visure, vincoli urbanistici e stato occupazionale con validazione legale.",
    kpi: "48h media",
  },
  {
    icon: LineChart,
    step: "02",
    title: "Modellazione finanziaria",
    body: "Business plan con costi di liberazione, oneri fiscali, exit value e ROI netto per scenario.",
    kpi: "3 scenari",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Strutturazione operazione",
    body: "Accordo saldo e stralcio, cessione del credito o partecipazione all'asta con capitale dedicato.",
    kpi: "Capitale committed",
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: "Closing & reporting",
    body: "Esecuzione notarile, liberazione immobile e reportistica periodica per investitori e istituzioni.",
    kpi: "Report trimestrale",
  },
];

export function ProcessTimeline() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <p className={`mono-label reveal ${visible ? "reveal-in" : ""} text-primary`}>
          Metodologia operativa
        </p>
        <h2
          className={`reveal ${visible ? "reveal-in" : ""} mt-3 max-w-3xl text-2xl font-bold md:text-3xl`}
          style={{ transitionDelay: "80ms" }}
        >
          Dalla diagnosi del credito al closing, con governance documentata
        </h2>

        <div className="relative mt-10">
          <span className="sweep-line absolute top-6 right-0 left-0 hidden h-px bg-border md:block">
            <span className="sweep-line-bar absolute inset-y-0 left-0 block w-1/4 bg-[image:var(--gradient-signal)]" />
          </span>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.step}
                style={{ transitionDelay: `${120 + i * 90}ms` }}
                className={`reveal ${visible ? "reveal-in" : ""} relative`}
              >
                <span className="relative z-10 flex size-12 items-center justify-center rounded-sm border border-border bg-background">
                  <s.icon className="size-5 text-primary" />
                </span>
                <p className="mono-label mt-4 text-muted-foreground">Fase {s.step}</p>
                <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <span className="mono-label mt-3 inline-block rounded-sm border border-primary/40 px-2 py-1 text-primary">
                  {s.kpi}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
