import {
  BriefcaseBusiness,
  Building2,
  FileSearch2,
  Globe2,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";

const units = [
  {
    title: "Fiscal Assets",
    description:
      "Origination, qualificazione e coordinamento di opportunità legate a crediti fiscali e asset tributari.",
    icon: Landmark,
  },
  {
    title: "NPL & Special Situations",
    description:
      "Operazioni su crediti deteriorati, portafogli, asset distressed e situazioni complesse.",
    icon: ShieldCheck,
  },
  {
    title: "Real Estate Opportunities",
    description:
      "Asset, pre-asta, portafogli immobiliari e opportunità qualificate per investitori e buyer.",
    icon: Building2,
  },
  {
    title: "CFI – Crisi Fiscale d'Impresa",
    description:
      "Routing verso partner e professionisti specializzati per criticità fiscali e risanamento.",
    icon: Scale,
  },
  {
    title: "Surroga",
    description:
      "Percorsi dedicati e qualificazione preliminare delle opportunità compatibili.",
    icon: FileSearch2,
  },
  {
    title: "Corporate Advisory",
    description:
      "Business development, partnership, strutturazione e supporto operativo alle imprese.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Estonia Gateway",
    description:
      "Accesso a Estonia, Baltico e Nord Europa per imprese, investitori e nuovi progetti.",
    icon: Globe2,
  },
];

export function WalltechEcosystem() {
  return (
    <section id="ecosystem" className="border-y border-border bg-card/20 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            THE WALLTECH ECOSYSTEM
          </p>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Opportunità, advisory e sviluppo europeo sotto un unico brand.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
            Ogni linea opera in modo autonomo ma beneficia dello stesso metodo,
            della stessa rete e della capacità progettuale di Walltech Group OÜ.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {units.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="border border-border bg-background/70 p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center border border-primary/40 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
              <a
                href="/assessment"
                className="mt-6 inline-flex text-xs font-semibold tracking-[0.12em] text-primary"
              >
                ESPLORA IL PERCORSO →
              </a>
            </article>
          ))}

          <article className="border border-primary/50 bg-primary/[0.05] p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              SUPER PRODUCT
            </p>
            <h3 className="mt-5 text-xl font-bold text-foreground">
              Walltech Intelligence Engine™
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Il sistema proprietario che qualifica opportunità, produce dossier
              e supporta decisioni lungo l'intero ecosistema.
            </p>
            <a
              href="#walltech-engine"
              className="mt-6 inline-flex text-xs font-semibold tracking-[0.12em] text-primary"
            >
              SCOPRI L'ENGINE →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
