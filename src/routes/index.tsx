import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/walltech/SiteHeader";
import { Hero } from "@/components/walltech/Hero";
import { TrustBar } from "@/components/walltech/TrustBar";
import { WalltechDecisionEngine } from "@/components/walltech/WalltechDecisionEngine";
import {
  WalltechSearchEngine,
  type SearchFilters,
} from "@/components/walltech/WalltechSearchEngine";
import { LiveSourceValidation } from "@/components/walltech/LiveSourceValidation";
import { ChannelGrid } from "@/components/walltech/ChannelGrid";
import { ProcessTimeline } from "@/components/walltech/ProcessTimeline";
import { OperationsExplorer } from "@/components/walltech/OperationsExplorer";
import { SiteFooter } from "@/components/walltech/SiteFooter";
import { DebtorDialog, PartnerDialog } from "@/components/walltech/dialogs";

const TITLE = "WALLTECH GROUP OÜ — Intelligence Platform";
const DESCRIPTION =
  "Piattaforma operativa per analisi, qualificazione, dossier e gestione di operazioni immobiliari, NPL e asset complessi.";

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
  const [debtor, setDebtor] = useState(false);
  const [partner, setPartner] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    area: "",
    assetType: "all",
    maxBudget: "all",
    occupancy: "all",
    procedure: "all",
  });

  const scrollToOperations = () =>
    document.getElementById("operazioni")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onDossier={openDossier} />
      <main>
        <Hero onDossier={openDossier} onOperations={scrollToOperations} />
        <TrustBar />
        <WalltechDecisionEngine />
        <WalltechSearchEngine onDossier={openDossier} onFiltersChange={setSearchFilters} />
        <LiveSourceValidation filters={searchFilters} />
        <ChannelGrid
          onAction={(action) => {
            if (action === "operations") scrollToOperations();
            if (action === "debtor") setDebtor(true);
            if (action === "partner") setPartner(true);
          }}
        />
        <ProcessTimeline />
        <OperationsExplorer onDossier={() => setDossier(true)} />
      </main>
      <SiteFooter />

      <DossierDialog open={dossier} onOpenChange={setDossier} />
      <DebtorDialog open={debtor} onOpenChange={setDebtor} />
      <PartnerDialog open={partner} onOpenChange={setPartner} />
    </div>
  );
}
