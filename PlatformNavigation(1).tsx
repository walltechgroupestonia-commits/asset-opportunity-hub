import { useRouterState } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  FileText,
  Gauge,
  House,
  Network,
  Search,
} from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: House },
  { label: "Assessment", href: "/assessment", icon: Gauge },
  { label: "Operazioni", href: "/#operazioni", icon: Search },
  { label: "Investor Area", href: "/investor", icon: BriefcaseBusiness },
  { label: "CRM Intelligence", href: "/crm", icon: Network },
  { label: "Dossier", href: "/dossier", icon: FileText },
];

export function PlatformNavigation() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav
      aria-label="Navigazione operativa Walltech"
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
    >
      <div className="container mx-auto overflow-x-auto px-4">
        <div className="flex min-w-max items-center gap-2 py-3">
          {items.map(({ label, href, icon: Icon }) => {
            const targetPath = href.split("#")[0] || "/";
            const isActive =
              targetPath === "/"
                ? pathname === "/"
                : pathname.startsWith(targetPath);

            return (
              <a
                key={label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold tracking-[0.08em] transition-colors",
                  isActive
                    ? "border-primary/70 bg-primary/[0.08] text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
