const items = [
  "Banche & Istituti di Credito",
  "Intermediari Finanziari Art. 106 TUB",
  "Società di Cartolarizzazione L. 130",
  "Servicer NPL & UTP",
  "Family Office & Club Deal",
  "Studi Legali & Commercialisti",
  "Fondi Immobiliari Opportunistici",
  "Recupero Crediti Art. 115 TULPS",
];

export function TrustBar() {
  return (
    <section
      aria-label="Controparti istituzionali servite"
      className="overflow-hidden border-b border-border bg-surface/40 py-4"
    >
      <div className="flex w-max animate-marquee items-center gap-10 pr-10">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mono-label inline-flex shrink-0 items-center gap-3 text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
