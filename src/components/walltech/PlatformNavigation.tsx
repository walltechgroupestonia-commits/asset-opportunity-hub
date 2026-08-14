import {
  FileText,
  Gauge,
  House,
  Network,
} from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: House },
  { label: "Assessment", href: "/assessment", icon: Gauge },
  { label: "Decision Engine", href: "/decision", icon: Network },
  { label: "Dossier", href: "/dossier", icon: FileText },
];

export function PlatformNavigation() {
  return (
    <nav
      aria-label="Navigazione operativa Walltech"
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
    >
      <div className="container mx-auto overflow-x-auto px-4">
        <div className="flex min-w-max items-center gap-2 py-3">
          {items.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-semibold tracking-[0.08em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
