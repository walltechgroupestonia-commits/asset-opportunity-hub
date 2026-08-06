import { createFileRoute } from "@tanstack/react-router";
import { AssessmentEngineMvp } from "@/components/walltech/AssessmentEngineMvp";

const TITLE = "Walltech Assessment Engine";
const DESCRIPTION = "Assessment preliminare con Opportunity Score, Risk Score, priorità, next action ed evidence.";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AssessmentEngineMvp,
});
