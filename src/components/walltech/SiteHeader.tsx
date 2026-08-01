import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader({ onDossier }: { onDossier: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-sm bg-[image:var(--gradient-signal)] text-primary-foreground">
            <Activity className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold tracking-tight">WALLTECH GROUP OÜ</p>
            <p className="mono-label text-muted-foreground">PropTech &amp; Data Intelligence</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#canali" className="transition-colors hover:text-foreground">
            Canali
          </a>
          <a href="#operazioni" className="transition-colors hover:text-foreground">
            Operazioni
          </a>
          <a href="#network" className="transition-colors hover:text-foreground">
            Legal Network
          </a>
        </nav>
        <Button variant="signal" size="sm" onClick={onDossier}>
          Dossier Integrato
        </Button>
      </div>
    </header>
  );
}
