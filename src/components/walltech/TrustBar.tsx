const items = [
  "Fonti & Provenienza",
  "Documenti & Evidence",
  "Fatti Verificati",
  "Dati Dichiarati",
  "Assunzioni Esplicite",
  "Missing Data",
  "Contraddizioni",
  "Risk & Decision Gate",
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
