import { Building2, FileSearch2, Landmark, Network, Scale, Waypoints } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  status: string;
  icon: React.ReactNode;
  href: string;
}

function ModuleCard({ title, description, status, icon, href }: ModuleCardProps) {
  return (
    <a href={href} className="group border border-border bg-card/40 p-5 transition-colors hover:border-primary/60 hover:bg-primary/[0.04]">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center border border-border text-primary transition-colors group-hover:border-primary/50">
          {icon}
        </div>
        <span className="border border-border px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
          {status}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-8 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary">
        APRI MODULO <span aria-hidden="true">→</span>
      </div>
    </a>
  );
}

export function OperatingSystem() {
  return (
    <section id="platform" aria-labelledby="operating-system-title" className="border-y border-border bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">WALLTECH OPERATING SYSTEM</p>
          <h2 id="operating-system-title" className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Un’unica piattaforma per governare l’intero ciclo operativo.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Ogni modulo raccoglie dati, produce evidenze e alimenta il percorso dall’analisi iniziale fino al dossier, all’esecuzione e al closing.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ModuleCard title="Property Intelligence" description="Ricerca, screening, qualificazione e analisi delle opportunità immobiliari." status="ATTIVO" icon={<Building2 className="h-5 w-5" />} href="#operazioni" />
          <ModuleCard title="Dossier Intelligence" description="Documentazione, due diligence, business case, workflow e report operativi." status="ATTIVO" icon={<FileSearch2 className="h-5 w-5" />} href="#operazioni" />
          <ModuleCard title="Fiscal Assets" description="DTA, NPL, crediti fiscali, matching e strutturazione delle operazioni." status="ROADMAP" icon={<Landmark className="h-5 w-5" />} href="#fiscal-assets" />
          <ModuleCard title="Advisory" description="Corporate finance, ristrutturazione, crisi d’impresa e operazioni straordinarie." status="ROADMAP" icon={<Scale className="h-5 w-5" />} href="#advisory" />
          <ModuleCard title="Corporate & Estonia" description="Company formation, governance, holding e sviluppo internazionale." status="ROADMAP" icon={<Waypoints className="h-5 w-5" />} href="#estonia" />
          <ModuleCard title="CRM & Deal Flow" description="Lead, operazioni, owner, prossime azioni, KPI, evidenze e closing." status="INTEGRAZIONE" icon={<Network className="h-5 w-5" />} href="#crm" />
        </div>
      </div>
    </section>
  );
}
