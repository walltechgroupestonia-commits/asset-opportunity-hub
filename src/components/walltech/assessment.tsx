import { createFileRoute } from "@tanstack/react-router";
import { ServiceQualificationRouter } from "@/components/walltech/ServiceQualificationRouter";

const TITLE = "Walltech Service Qualification";
const DESCRIPTION =
  "Percorso di qualificazione iniziale per indirizzare utenti, imprese, investitori e professionisti verso il servizio corretto.";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ServiceQualificationRouter,
});
