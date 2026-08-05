const columns = [
  {
    title: "Platform",
    links: [
      ["Home", "/"],
      ["Assessment", "/assessment"],
      ["Operazioni", "/#operazioni"],
      ["Investor Dashboard", "/investor"],
      ["CRM Intelligence", "/crm"],
      ["Dossier", "/dossier"],
    ],
  },
  {
    title: "Servizi dedicati",
    links: [
      ["SOS Pignoramento™", "/assessment"],
      ["SOS Impresa™", "/assessment"],
      ["CFI – Crisi Fiscale d'Impresa", "/assessment"],
      ["Partner Network", "/crm"],
    ],
  },
  {
    title: "Walltech",
    links: [
      ["Operating System", "/#platform"],
      ["Property Intelligence", "/#property-intelligence"],
      ["Trasparenza dati", "/#data-source-title"],
      ["Contatti", "/#contatti"],
    ],
  },
];

export function PlatformFooterMap() {
  return (
    <section className="border-t border-border bg-card/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-primary">
                {column.title.toUpperCase()}
              </h2>
              <div className="mt-5 grid gap-3">
                {column.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs leading-6 text-muted-foreground">
            Walltech Group OÜ sviluppa piattaforme di analisi, organizzazione
            documentale, workflow operativi e supporto decisionale. Le attività
            professionali riservate sono svolte esclusivamente dai professionisti
            abilitati incaricati dalle parti.
          </p>
        </div>
      </div>
    </section>
  );
}
