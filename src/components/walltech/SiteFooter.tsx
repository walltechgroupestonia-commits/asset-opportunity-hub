export function SiteFooter() {
  return (
    <footer id="network" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <p className="font-display text-lg font-bold">WALLTECH GROUP OÜ</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Harju maakond, Tallinn, Estonia — Registry Code: 12693842
        </p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Software Provider, PropTech &amp; Data Advisory Infrastructure for Real Estate Markets
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Termini di Servizio B2B
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Partnership e Legal Network
          </a>
        </div>
      </div>
    </footer>
  );
}
