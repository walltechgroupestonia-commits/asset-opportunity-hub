import { createFileRoute } from "@tanstack/react-router";
import { InvestorDashboard } from "@/components/walltech/InvestorDashboard";

const TITLE = "Walltech Investor Dashboard";
const DESCRIPTION =
  "Dashboard operativa per investitori, buyer qualificati e partner autorizzati.";

export const Route = createFileRoute("/investor")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: InvestorDashboard,
});
