import { createFileRoute } from "@tanstack/react-router";
import { WalltechDossier } from "@/components/walltech/WalltechDossier";

const TITLE = "Walltech Operation Dossier";
const DESCRIPTION =
  "Dossier operativo preliminare per la qualificazione e il coordinamento di operazioni immobiliari complesse.";

export const Route = createFileRoute("/dossier")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: WalltechDossier,
});
