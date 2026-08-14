import { createFileRoute } from "@tanstack/react-router";
import { PropertyAssessmentMvp } from "@/components/walltech/PropertyAssessmentMvp";

const TITLE = "Walltech Opportunity Assessment";
const DESCRIPTION =
  "Assessment strutturato dell'opportunità immobiliare: dati dichiarati, provenance, documentazione disponibile e missing data prima del Decision Gate.";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PropertyAssessmentMvp,
});
