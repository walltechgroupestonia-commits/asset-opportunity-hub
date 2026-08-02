import { ArrowRight, Building2, HandCoins, Landmark, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";

interface Channel {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  action: "operations" | "debtor" | "partner";
}

const channels: Channel[] = [
  {
    icon: HandCoins,
    title: "Investitori & Buyer",
    body: "Accedi alle opportunità giurisdizionali e pre-asta filtrate, con stima netta del ROI e piano costi integrato.",
    cta: "Esplora Operazioni",
    action: "operations",
  },
  {
    icon: Building2,
    title: "Proprietari / Esecutati",
    body: "Hai l'immobile all'asta o in pignoramento? Richiedi l'analisi azzeramento debito e salvaguardia liquidità.",
    cta: "Richiedi Analisi Gratuita",
    action: "debtor",
  },
  {
    icon: Users,
    title: "Legali & Commercialisti",
    body: "Segnala le posizioni dei tuoi clienti in crisi: offriamo liquidità, investitori e supporto fiscale/societario.",
    cta: "Accreditamento Partner",
    action: "partner",
  },
  {
    icon: Landmark,
    title: "Banche, 115 / 106 / 130",
    body: "Smobilizzo crediti UTP e NPL con sottostante immobiliare mediante acquirenti istituzionali ed esecuzione rapida.",
    cta: "Canale Istituzionale",
    action: "partner",
  },
];

export function ChannelGrid({ onAction }: { onAction: (a: Channel["action"]) => void }) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} id="canali" className="mx-auto max-w-7xl px-5 py-16 md:py-20">
      <p className={`mono-label reveal ${visible ? "reveal-in" : ""} text-primary`}>
        Canali operativi
      </p>
      <h2
        className={`reveal ${visible ? "reveal-in" : ""} mt-3 text-2xl font-bold md:text-3xl`}
        style={{ transitionDelay: "80ms" }}
      >
        Un punto di accesso per ogni controparte
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {channels.map((c, i) => (
          <article
            key={c.title}
            style={{ transitionDelay: `${120 + i * 90}ms` }}
            className={`surface-panel lift-panel reveal ${visible ? "reveal-in" : ""} group flex flex-col rounded-sm p-6 hover:border-primary/60 hover:lift-panel-hover`}
          >
            <span className="flex size-10 items-center justify-center rounded-sm border border-border bg-background transition-colors group-hover:border-primary/60">
              <c.icon className="size-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            <Button
              variant="channel"
              size="sm"
              className="mt-6 justify-between"
              onClick={() => onAction(c.action)}
            >
              {c.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
