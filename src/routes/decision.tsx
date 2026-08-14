import { createFileRoute } from "@tanstack/react-router";
import { PropertyDecisionEngine } from "@/components/walltech/PropertyDecisionEngine";

const TITLE = "Walltech Property Decision Engine";
const DESCRIPTION =
  "Decision Engine immobiliare basato su Opportunity Record, evidence, missing data, rischi, scenari economici e Decision Gate.";

export const Route = createFileRoute("/decision")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PropertyDecisionEngine,
});
