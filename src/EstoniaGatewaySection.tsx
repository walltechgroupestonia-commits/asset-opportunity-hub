import { ArrowRight, Building2, Globe2, Laptop2, Network } from "lucide-react";

export function EstoniaGatewaySection() {
  return (
    <section id="estonia" className="border-y border-border bg-card/20 py-16">
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-primary">
            ESTONIA · BALTIC · NORTHERN EUROPE
          </p>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Estonia as a strategic European gateway.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Walltech Group OÜ opera dall'Estonia per connettere aziende, capitali,
            opportunità e innovazione tra Italia, Baltico, Nord Europa e mercato
            europeo.
          </p>

          <a
            href="/assessment"
            className="mt-7 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Valuta il percorso Estonia
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Digital Infrastructure", Laptop2],
            ["European Market Access", Globe2],
            ["Company & Business Development", Building2],
            ["Baltic & Northern Europe Network", Network],
          ].map(([label, Icon]) => {
            const IconComponent = Icon as typeof Globe2;
            return (
              <div
                key={label as string}
                className="border border-border bg-background/70 p-5"
              >
                <IconComponent className="h-5 w-5 text-primary" />
                <p className="mt-4 font-semibold text-foreground">{label as string}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
