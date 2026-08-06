import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Coins,
  Globe2,
  Handshake,
  Scale,
} from "lucide-react";

type PathCard = {
  title: string;
  description: string;
  eyebrow: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const paths: PathCard[] = [
  {
    title: "Ho un immobile da valorizzare",
    description:
      "Avvia l'Assessment e utilizza il Walltech Intelligence Engine™ per qualificare dati, rischi, documenti e prossima azione.",
    eyebrow: "REAL ESTATE",
    href: "/assessment",
    icon: Building2,
  },
  {
    title: "Ho una procedura esecutiva",
    description:
      "Accedi al percorso dedicato per organizzare la situazione immobiliare e indirizzare le attività riservate ai professionisti qualificati.",
    eyebrow: "SPECIAL SITUATION",
    href: "/assessment",
    icon: Scale,
  },
  {
    title: "Ho crediti fiscali o asset tributari",
    description:
      "Presenta l'opportunità per una prima qualifica operativa, documentale e commerciale della filiera.",
    eyebrow: "FISCAL ASSETS",
    href: "/assessment",
    icon: Coins,
  },
  {
    title: "Voglio sviluppare l'impresa in Estonia",
    description:
      "Valuta un percorso verso Estonia, Baltico e Nord Europa per nuova società, business development e accesso al mercato.",
    eyebrow: "ESTONIA GATEWAY",
    href: "/#estonia",
    icon: Globe2,
  },
  {
    title: "Voglio investire in operazioni qualificate",
    description:
      "Accedi all'Investor Area, alle opportunità selezionate, ai dossier e ai percorsi di approfondimento autorizzati.",
    eyebrow: "INVESTOR AREA",
    href: "/investor",
    icon: BriefcaseBusiness,
  },
  {
    title: "Voglio collaborare con Walltech",
    description:
      "Presenta competenze, opportunità o una proposta di partnership da integrare nell'ecosistema Walltech.",
    eyebrow: "PARTNERSHIP",
    href: "/crm",
    icon: Handshake,
  },
];

export function ChooseYourPath() {
  return (
    <section
      id="choose-your-path"
      aria-labelledby="choose-your-path-title"
      className="border-y border-border bg-card/20 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            SCEGLI IL TUO PERCORSO
          </p>

          <h2
            id="choose-your-path-title"
            className="mt-4 text-3xl font-bold text-foreground md:text-5xl"
          >
            Quale opportunità stai cercando?
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Entra nel percorso più vicino alla tua esigenza. Walltech qualifica
            il caso, organizza le informazioni e collega il visitatore al modulo,
            al servizio o al partner più adatto.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paths.map(({ title, description, eyebrow, href, icon: Icon }) => (
            <a
              key={title}
              href={href}
              className="group border border-border bg-background/70 p-6 transition-colors hover:border-primary/60 hover:bg-primary/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center border border-primary/40 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-semibold tracking-[0.18em] text-primary">
                  {eyebrow}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {description}
              </p>

              <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-primary">
                APRI IL PERCORSO
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 border border-border bg-background/70 p-5">
          <p className="text-xs leading-6 text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Disclaimer professionale.
            </strong>{" "}
            Walltech Group OÜ svolge attività di analisi preliminare,
            organizzazione documentale, workflow operativo e supporto
            decisionale. Le attività legali, fiscali, notarili, tecniche,
            estimative e ogni altra attività professionale regolamentata sono
            svolte esclusivamente dai professionisti abilitati incaricati dalle
            parti.
          </p>
        </div>
      </div>
    </section>
  );
}
