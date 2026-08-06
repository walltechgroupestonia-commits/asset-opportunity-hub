const columns = [
  {
    title: "Ecosystem",
    links: [
      ["Fiscal Assets", "/#ecosystem"],
      ["NPL & Special Situations", "/#ecosystem"],
      ["Real Estate", "/#ecosystem"],
      ["Corporate Advisory", "/#ecosystem"],
    ],
  },
  {
    title: "Engine 001",
    links: [
      ["Assessment", "/assessment"],
      ["Dossier", "/dossier"],
      ["Investor Area", "/investor"],
      ["CRM Intelligence", "/crm"],
    ],
  },
  {
    title: "Europe",
    links: [
      ["Estonia Gateway", "/#estonia"],
      ["Baltic Region", "/#estonia"],
      ["Northern Europe", "/#estonia"],
      ["Contact", "/#contatti"],
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
            Walltech Group OÜ develops opportunity qualification, business
            development, operational workflow and decision-support systems.
            Professional activities reserved by law remain exclusively with
            licensed professionals appointed by the parties.
          </p>
        </div>
      </div>
    </section>
  );
}
