import { createFileRoute } from "@tanstack/react-router";
import { DecisionEngineMvp } from "@/components/walltech/DecisionEngineMvp";

const TITLE = "Walltech Decision Engine";
const DESCRIPTION =
  "Decision Engine operativo per condition, readiness, priority, next action, owner, deadline ed evidence.";

export const Route = createFileRoute("/decision")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: DecisionEngineMvp,
});
