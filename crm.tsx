import { createFileRoute } from "@tanstack/react-router";
import { CrmIntelligenceMvp } from "@/components/walltech/CrmIntelligenceMvp";

const TITLE = "Walltech CRM Intelligence";
const DESCRIPTION =
  "CRM operativo per pipeline, owner, next action, evidence, fee e closing.";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: CrmIntelligenceMvp,
});
