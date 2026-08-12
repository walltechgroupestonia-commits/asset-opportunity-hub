import { createFileRoute } from "@tanstack/react-router";
import { DossierGeneratorMvp } from "@/components/walltech/DossierGeneratorMvp";
import { PropertyDecisionEngineV001 } from "@/components/walltech/PropertyDecisionEngineV001";

const TITLE = "Walltech Dossier Generator";
const DESCRIPTION =
  "Dossier operativo integrato con business case, scoring, document status e decision output.";

function DossierPage() {
  return (
    <>
      <DossierGeneratorMvp />
      <PropertyDecisionEngineV001 />
    </>
  );
}

export const Route = createFileRoute("/dossier")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: DossierPage,
});
