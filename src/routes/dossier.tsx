import { createFileRoute } from "@tanstack/react-router";
import { PropertyDecisionDossier } from "@/components/walltech/PropertyDecisionDossier";

const TITLE = "Walltech Property Decision Dossier";
const DESCRIPTION =
  "Decision Dossier immobiliare basato su Opportunity Record, evidence, missing data, scenari economici e Decision Gate.";

export const Route = createFileRoute("/dossier")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PropertyDecisionDossier,
});
