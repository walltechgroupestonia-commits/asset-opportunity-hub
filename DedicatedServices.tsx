import {
  BriefcaseBusiness,
  Building2,
  Handshake,
  ShieldCheck,
} from "lucide-react";

interface ServiceCardProps {
  title: string;
  label: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function ServiceCard({
  title,
  label,
  description,
  cta,
  href,
  icon: Icon,
}: ServiceCardProps) {
  return (
    <article className="border border-border bg-background/70 p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center border border-primary/40 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="border border-border px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      <a
        href={href}
        className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary"
      >
        {cta.toUpperCase()}
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

export function DedicatedServices() {
  return (
    <section
      id="servizi-dedicati"
      aria-labelledby="dedicated-services-title"
      className="border-y border-border bg-card/20 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            SERVIZI DEDICATI
          </p>
          <h2
            id="dedicated-services-title"
            className="mt-4 text-3xl font-bold text-foreground md:text-4xl"
          >
            Percorsi distinti per esigenze differenti.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            La piattaforma orienta ogni utente verso il servizio o il partner
            specializzato più adatto, mantenendo separati i ruoli operativi e le
            attività professionali riservate.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ServiceCard
            title="SOS Pignoramento™"
            label="SERVIZIO DEDICATO"
            description="Per proprietari e privati coinvolti in procedure esecutive. Analisi preliminare, organizzazione documentale e coordinamento del percorso operativo con professionisti qualificati."
            cta="Scopri il servizio"
            href="#sos-pignoramento"
            icon={ShieldCheck}
          />

          <ServiceCard
            title="SOS Impresa™"
            label="SERVIZIO DEDICATO"
            description="Per imprenditori e società che affrontano situazioni patrimoniali o finanziarie complesse. Coordinamento operativo e raccolta strutturata delle informazioni."
            cta="Analizza la situazione"
            href="#sos-impresa"
            icon={Building2}
          />

          <ServiceCard
            title="CFI – Crisi Fiscale d'Impresa"
            label="PARTNER SPECIALIZZATO"
            description="Routing verso il partner specializzato quando emergono criticità fiscali, tributarie o di risanamento che richiedono professionisti abilitati."
            cta="Continua con CFI"
            href="#cfi"
            icon={BriefcaseBusiness}
          />

          <ServiceCard
            title="Investitori & Buyer"
            label="ACCESSO OPERATIVO"
            description="Accesso alle operazioni selezionate, ai dossier operativi e ai percorsi di approfondimento disponibili sulla piattaforma."
            cta="Accedi alle opportunità"
            href="#operazioni"
            icon={Handshake}
          />
        </div>

        <div className="mt-8 border border-border bg-background/70 p-5">
          <p className="text-xs leading-6 text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Disclaimer professionale.
            </strong>{" "}
            Walltech Group OÜ sviluppa piattaforme di analisi, organizzazione
            documentale, workflow operativi e supporto decisionale. Non svolge
            attività riservate ai professionisti iscritti ad albi o registri. Le
            attività legali, fiscali, notarili, tecniche, estimative e ogni altra
            attività professionale regolamentata sono svolte esclusivamente da
            professionisti abilitati o da partner qualificati incaricati dalle
            parti.
          </p>
        </div>
      </div>
    </section>
  );
}
