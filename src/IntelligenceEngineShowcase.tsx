import {
  BarChart3,
  BrainCircuit,
  FileCheck2,
  FolderLock,
  Gauge,
  Network,
} from "lucide-react";

const modules = [
  {
    title: "Assessment",
    description: "Raccolta strutturata dei dati e qualificazione iniziale.",
    icon: Gauge,
    href: "/assessment",
  },
  {
    title: "Decision Engine",
    description: "Score, rischio, prossima azione, owner, deadline ed evidence.",
    icon: BrainCircuit,
    href: "/assessment",
  },
  {
    title: "Dossier",
    description: "Executive summary, documenti, business case e workflow.",
    icon: FileCheck2,
    href: "/dossier",
  },
  {
    title: "Investor Area",
    description: "Operazioni qualificate, KPI, dossier e accesso controllato.",
    icon: BarChart3,
    href: "/investor",
  },
  {
    title: "Data Room",
    description: "Documenti, versioni, permessi, NDA e completezza.",
    icon: FolderLock,
    href: "/dossier",
  },
  {
    title: "CRM Intelligence",
    description: "Lead, opportunità, owner, next action, evidence e closing.",
    icon: Network,
    href: "/crm",
  },
];

export function IntelligenceEngineShowcase() {
  return (
    <section id="walltech-engine" className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-primary">
              WALLTECH INTELLIGENCE ENGINE™
            </p>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
              Il super prodotto proprietario che rafforza tutto l'ecosistema.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              L'Engine non sostituisce Walltech: è figlio di Walltech e ne
              amplifica metodo, affidabilità, capacità operativa e fiducia.
            </p>

            <div className="mt-8 border border-primary/40 bg-primary/[0.04] p-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                ENGINE 001 · MILESTONE
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Questa prima versione costituisce la base tecnologica per i futuri
                Engine del gruppo.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(({ title, description, icon: Icon, href }) => (
              <a
                key={title}
                href={href}
                className="border border-border bg-card/35 p-5 transition-colors hover:border-primary/60 hover:bg-primary/[0.04]"
              >
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                <span className="mt-6 inline-flex text-xs font-semibold tracking-[0.12em] text-primary">
                  APRI MODULO →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
