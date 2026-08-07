import { createFileRoute } from "@tanstack/react-router";
import { PropertyDecisionEngineV001 } from "@/components/walltech/PropertyDecisionEngineV001";

const TITLE = "Walltech Property Intelligence Engine™";
const DESCRIPTION =
  "Analisi preliminare di opportunità immobiliari distressed con dati documentali, criticità, score e scenari di investimento.";

export const Route = createFileRoute("/property-intelligence")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PropertyIntelligencePage,
});

function PropertyIntelligencePage() {
  return (
    <main className="min-h-screen bg-background">
      <PropertyDecisionEngineV001 />
    </main>
  );
}
