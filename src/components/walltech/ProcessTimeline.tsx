import { FileSearch, LineChart, BadgeCheck, FileCheck2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const steps: {
  icon: LucideIcon;
  step: string;
  title: string;
  body: string;
  kpi: string;
}[] = [
  {
    icon: FileSearch,
    step: "01",
    title: "Opportunity Intake",
    body:
      "Raccolta dell'opportunità, identificazione delle fonti, documenti disponibili e dati iniziali.",
    kpi: "Input strutturato",
  },
  {
    icon: BadgeCheck,
    step: "02",
    title: "Evidence & Validation",
    body:
      "Estrazione delle informazioni, verifica della provenienza, cross-check e rilevazione di missing data e contraddizioni.",
    kpi: "Evidence verificata",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Risk & Scenari",
    body:
      "Analisi dei rischi e costruzione degli scenari economici solo sui dati realmente disponibili e sulle assunzioni esplicite.",
    kpi: "Scenari tracciabili",
  },
  {
    icon: FileCheck2,
    step: "04",
    title: "Decision Gate & Dossier",
    body:
      "Decisione motivata, verifiche ancora necessarie, prossima azione e consolidamento nel Decision Dossier.",
    kpi: "Decisione utilizzabile",
  },
];

export function ProcessTimeline() {
  const { ref, visible } = useReveal();

  return (
    <section ref={ref} className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p
          className={`mono-label reveal ${
            visible ? "reveal-in" : ""
          } text-primary`}
        >
          METODOLOGIA OPERATIVA
        </p>

        <h2
          className={`reveal ${
            visible ? "reveal-in" : ""
          } mt-3 max-w-3xl text-2xl font-bold md:text-3xl`}
          style={{ transitionDelay: "80ms" }}
        >
          Dall'opportunità alla decisione, con evidence tracciabile.
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
                className={`reveal ${
                  visible ? "reveal-in" : ""
                } relative`}
              >
                <span className="relative z-10 flex size-12 items-center justify-center rounded-sm border border-border bg-background">
                  <s.icon className="size-5 text-primary" />
                </span>

                <p className="mono-label mt-4 text-muted-foreground">
                  Fase {s.step}
                </p>

                <h3 className="mt-2 text-base font-semibold">{s.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>

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
