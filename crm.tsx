import { createFileRoute } from "@tanstack/react-router";
import { CrmIntelligence } from "@/components/walltech/CrmIntelligence";

const TITLE = "Walltech CRM Intelligence";
const DESCRIPTION =
  "Dashboard operativa per lead, opportunità, owner, scadenze, evidenze e closing.";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: CrmIntelligence,
});
