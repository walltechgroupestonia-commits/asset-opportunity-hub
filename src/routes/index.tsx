import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PlatformNavigation } from "@/components/walltech/PlatformNavigation";
import { CorporateHero } from "@/components/walltech/CorporateHero";
import { TrustBar } from "@/components/walltech/TrustBar";
import { ChooseYourPath } from "@/components/walltech/ChooseYourPath";
import { IntelligenceEngineShowcase } from "@/components/walltech/IntelligenceEngineShowcase";
import {
  WalltechSearchEngine,
  type SearchFilters,
} from "@/components/walltech/WalltechSearchEngine";
import { LiveSourceValidation } from "@/components/walltech/LiveSourceValidation";
import { ProcessTimeline } from "@/components/walltech/ProcessTimeline";
import { OperationsExplorer } from "@/components/walltech/OperationsExplorer";
import { PlatformFooterMap } from "@/components/walltech/PlatformFooterMap";
import { SiteFooter } from "@/components/walltech/SiteFooter";

const TITLE = "WALLTECH GROUP OÜ — European Business Ecosystem";
const DESCRIPTION =
  "Fiscal Assets, NPL, Real Estate, Corporate Advisory, Estonia Gateway and Walltech Intelligence Engine.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const openDossier = () => void navigate({ to: "/dossier" });

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    area: "",
    assetType: "all",
    maxBudget: "all",
    occupancy: "all",
    procedure: "all",
  });

  const scrollToOperations = () =>
    document.getElementById("operazioni")?.scrollIntoView({
      behavior: "smooth",
    });

  return (
    <div className="min-h-screen bg-background">
      <PlatformNavigation />

      <main>
        <CorporateHero
          onDossier={openDossier}
          onOperations={scrollToOperations}
        />
        <TrustBar />
        <ChooseYourPath />
        <IntelligenceEngineShowcase />

        <WalltechSearchEngine
          onDossier={openDossier}
          onFiltersChange={setSearchFilters}
        />

        <LiveSourceValidation filters={searchFilters} />

        <ProcessTimeline />
        <OperationsExplorer onDossier={openDossier} />
      </main>

      <PlatformFooterMap />
      <SiteFooter />

    </div>
  );
}
