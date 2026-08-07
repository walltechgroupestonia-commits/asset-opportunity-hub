import type { WalltechModuleKey } from "./coreTypes";

export interface WalltechModuleDefinition {
  key: WalltechModuleKey;
  label: string;
  description: string;
  defaultOwner: string;
  requiredEvidence: string[];
  route: string;
}

const registry: Record<WalltechModuleKey, WalltechModuleDefinition> = {
  property: { key: "property", label: "Property Intelligence", description: "Ricerca, qualificazione, dossier e coordinamento di opportunità immobiliari.", defaultOwner: "Walltech Property Team", requiredEvidence: ["Fonte dell'opportunità", "Identificativo procedura o asset", "Perizia o valore stimato", "Visure e vincoli disponibili", "Scenario economico preliminare"], route: "/assessment" },
  "fiscal-assets": { key: "fiscal-assets", label: "Fiscal Assets", description: "Origination, qualifica, matching e coordinamento di fiscal assets.", defaultOwner: "Walltech Fiscal Assets Team", requiredEvidence: ["Cedente identificato", "Titolo e natura dell'asset", "Documentazione minima", "Cessionario o buyer target", "Fee e protezione economica"], route: "/assessment" },
  npl: { key: "npl", label: "NPL & Special Situations", description: "Operazioni su crediti deteriorati, portafogli e asset distressed.", defaultOwner: "Walltech Special Situations Team", requiredEvidence: ["Cedente o originator", "GBV o valore nominale", "Contratti e titolarità", "Buyer o cessionario", "Data room minima"], route: "/assessment" },
  "corporate-advisory": { key: "corporate-advisory", label: "Corporate Advisory", description: "Business development, strutturazione e coordinamento operativo.", defaultOwner: "Walltech Corporate Advisory", requiredEvidence: ["Mandato o incarico", "Obiettivo operativo", "Stakeholder", "Business case", "Fee"], route: "/assessment" },
  "estonia-gateway": { key: "estonia-gateway", label: "Estonia Gateway", description: "Percorsi di sviluppo, accesso al mercato e coordinamento europeo.", defaultOwner: "Walltech Estonia Gateway", requiredEvidence: ["Profilo impresa", "Obiettivo di espansione", "Paese di origine", "Mercato target", "Partner richiesti"], route: "/assessment" },
  surroga: { key: "surroga", label: "Surroga", description: "Qualificazione preliminare e routing di opportunità compatibili.", defaultOwner: "Walltech Opportunity Desk", requiredEvidence: ["Soggetti", "Asset o credito", "Struttura economica", "Compliance", "Fee"], route: "/assessment" },
  cfi: { key: "cfi", label: "CFI – Crisi Fiscale d'Impresa", description: "Routing verso partner e professionisti specializzati.", defaultOwner: "CFI Partner Desk", requiredEvidence: ["Soggetto segnalante", "Impresa interessata", "Debito stimato", "Stato procedure", "Consenso e contatti"], route: "/assessment" },
};

export function getModuleDefinition(key: WalltechModuleKey): WalltechModuleDefinition {
  return registry[key];
}

export function getAllModuleDefinitions(): WalltechModuleDefinition[] {
  return Object.values(registry);
}
