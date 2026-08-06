import { createFileRoute } from "@tanstack/react-router";
import { DossierGeneratorMvp } from "@/components/walltech/DossierGeneratorMvp";

const TITLE = "Walltech Dossier Generator";
const DESCRIPTION =
  "Dossier operativo integrato con business case, scoring, document status e decision output.";

export const Route = createFileRoute("/dossier")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: DossierGeneratorMvp,
});
