import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Handshake,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type Profile =
  | "private"
  | "entrepreneur"
  | "investor"
  | "professional"
  | "";

type Need =
  | "enforcement"
  | "tax_crisis"
  | "financial_distress"
  | "investment"
  | "professional_support"
  | "";

interface RouteResult {
  title: string;
  label: string;
  description: string;
  cta: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const profiles = [
  {
    id: "private" as const,
    title: "Privato o proprietario",
    description: "Hai un immobile, una procedura o una situazione patrimoniale da comprendere.",
    icon: UserRound,
  },
  {
    id: "entrepreneur" as const,
    title: "Imprenditore o società",
    description: "Devi affrontare criticità patrimoniali, finanziarie o fiscali.",
    icon: Building2,
  },
  {
    id: "investor" as const,
    title: "Investitore o buyer",
    description: "Cerchi opportunità, dossier e accesso a operazioni qualificate.",
    icon: Handshake,
  },
  {
    id: "professional" as const,
    title: "Professionista o partner",
    description: "Vuoi collaborare su un'operazione o indirizzare un cliente.",
    icon: BriefcaseBusiness,
  },
];

const needs = [
  {
    id: "enforcement" as const,
    title: "Procedura esecutiva o pignoramento",
  },
  {
    id: "tax_crisis" as const,
    title: "Crisi fiscale o debiti tributari",
  },
  {
    id: "financial_distress" as const,
    title: "Crisi patrimoniale o finanziaria",
  },
  {
    id: "investment" as const,
    title: "Ricerca di opportunità di investimento",
  },
  {
    id: "professional_support" as const,
    title: "Supporto operativo o collaborazione professionale",
  },
];

function getResult(profile: Profile, need: Need): RouteResult | null {
  if (profile === "private" && need === "enforcement") {
    return {
      title: "SOS Pignoramento™",
      label: "SERVIZIO DEDICATO",
      description:
        "Percorso preliminare per privati e proprietari coinvolti in procedure esecutive, con organizzazione documentale e coordinamento verso professionisti qualificati.",
      cta: "Accedi al servizio",
      href: "/sos-pignoramento",
      icon: ShieldCheck,
    };
  }

  if (
    profile === "entrepreneur" &&
    (need === "tax_crisis" || need === "financial_distress")
  ) {
    if (need === "tax_crisis") {
      return {
        title: "CFI – Crisi Fiscale d'Impresa",
        label: "PARTNER SPECIALIZZATO",
        description:
          "Il caso viene indirizzato al partner specializzato per le attività fiscali e tributarie riservate, svolte da professionisti abilitati.",
        cta: "Continua con CFI",
        href: "/cfi",
        icon: BriefcaseBusiness,
      };
    }

    return {
      title: "SOS Impresa™",
      label: "SERVIZIO DEDICATO",
      description:
        "Percorso preliminare per imprese e amministratori che affrontano criticità patrimoniali o finanziarie, con raccolta dati e coordinamento operativo.",
      cta: "Accedi al servizio",
      href: "/sos-impresa",
      icon: Building2,
    };
  }

  if (profile === "investor" || need === "investment") {
    return {
      title: "Investor Dashboard",
      label: "ACCESSO OPERATIVO",
      description:
        "Accesso alla pipeline delle opportunità, ai dossier disponibili e ai percorsi di approfondimento riservati a investitori e buyer qualificati.",
      cta: "Apri area investitori",
      href: "/investor",
      icon: Handshake,
    };
  }

  if (profile === "professional" || need === "professional_support") {
    return {
      title: "Partner Network",
      label: "PERCORSO PROFESSIONALE",
      description:
        "Percorso di qualifica e collaborazione per studi, advisor e professionisti coinvolti nelle operazioni Walltech.",
      cta: "Richiedi qualifica",
      href: "/crm",
      icon: BriefcaseBusiness,
    };
  }

  return {
    title: "Walltech Preliminary Assessment",
    label: "VALUTAZIONE PRELIMINARE",
    description:
      "La situazione richiede una prima raccolta strutturata delle informazioni prima dell'assegnazione al servizio o al partner competente.",
    cta: "Apri assessment",
    href: "/dossier",
    icon: ShieldCheck,
  };
}

export function ServiceQualificationRouter() {
  const [profile, setProfile] = useState<Profile>("");
  const [need, setNeed] = useState<Need>("");

  const result = useMemo(() => {
    if (!profile || !need) return null;
    return getResult(profile, need);
  }, [profile, need]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla piattaforma
          </a>

          <div className="text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary">
              WALLTECH GROUP OÜ
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Service Qualification Router
            </p>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/20 py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            QUALIFICAZIONE INIZIALE
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Individua il percorso corretto prima di aprire il ciclo operativo.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            La piattaforma classifica la richiesta e la indirizza verso il
            servizio dedicato, il partner specializzato o il modulo operativo
            più coerente.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
            <div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                  STEP 01
                </p>
                <h2 className="mt-3 text-2xl font-bold">Chi sei?</h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {profiles.map(({ id, title, description, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setProfile(id)}
                    className={[
                      "border p-5 text-left transition-colors",
                      profile === id
                        ? "border-primary/70 bg-primary/[0.05]"
                        : "border-border bg-card/30 hover:border-primary/40",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="mt-4 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-10">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                  STEP 02
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  Qual è l'esigenza principale?
                </h2>
              </div>

              <div className="mt-6 grid gap-3">
                {needs.map(({ id, title }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setNeed(id)}
                    className={[
                      "flex items-center justify-between gap-4 border p-4 text-left transition-colors",
                      need === id
                        ? "border-primary/70 bg-primary/[0.05]"
                        : "border-border bg-card/30 hover:border-primary/40",
                    ].join(" ")}
                  >
                    <span className="font-semibold">{title}</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </button>
                ))}
              </div>
            </div>

            <aside className="border border-border bg-card/30 p-6 xl:sticky xl:top-6 xl:h-fit">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-primary">
                RISULTATO
              </p>

              {!result ? (
                <div className="mt-6 border border-dashed border-border p-6">
                  <p className="text-sm leading-7 text-muted-foreground">
                    Seleziona il profilo e l'esigenza principale per ottenere il
                    percorso operativo consigliato.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex h-12 w-12 items-center justify-center border border-primary/40 text-primary">
                    <result.icon className="h-6 w-6" />
                  </div>

                  <p className="mt-6 text-[11px] font-semibold tracking-[0.18em] text-primary">
                    {result.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">{result.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {result.description}
                  </p>

                  <a
                    href={result.href}
                    className="mt-8 inline-flex w-full items-center justify-center bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    {result.cta}
                  </a>
                </div>
              )}

              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs leading-6 text-muted-foreground">
                  Il routing ha natura organizzativa e informativa. Le attività
                  professionali riservate sono svolte esclusivamente dai
                  professionisti abilitati o dai partner qualificati incaricati
                  dalle parti.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
