import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/walltech/SiteHeader";
import { Hero } from "@/components/walltech/Hero";
import { TrustBar } from "@/components/walltech/TrustBar";
import {
  WalltechSearchEngine,
  type SearchFilters,
} from "@/components/walltech/WalltechSearchEngine";
import { LiveSourceValidation } from "@/components/walltech/LiveSourceValidation";
import { ChannelGrid } from "@/components/walltech/ChannelGrid";
import { ProcessTimeline } from "@/components/walltech/ProcessTimeline";
import { OperationsExplorer } from "@/components/walltech/OperationsExplorer";
import { SiteFooter } from "@/components/walltech/SiteFooter";
import { DossierDialog, DebtorDialog, PartnerDialog } from "@/components/walltech/dialogs";

const TITLE = "WALLTECH GROUP OÜ — Real Estate & NPL Advisory Hub";
const DESCRIPTION =
  "Diagnostica peritale, modellazione finanziaria e strutturazione di operazioni in pre-asta su mercati IT, ES e DE.";

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
  const [dossier, setDossier] = useState(false);
  const [debtor, setDebtor] = useState(false);
  const [partner, setPartner] = useState(false);

  const scrollToOperations = () =>
    document.getElementById("operazioni")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onDossier={() => setDossier(true)} />
      <main>
        <Hero onDossier={() => setDossier(true)} onOperations={scrollToOperations} />
        <TrustBar />
        <WalltechSearchEngine onDossier={() => setDossier(true)} />
        <ChannelGrid
          onAction={(a) => {
            if (a === "operations") scrollToOperations();
            if (a === "debtor") setDebtor(true);
            if (a === "partner") setPartner(true);
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
