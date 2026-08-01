export type Country = "IT" | "ES" | "DE";
export type AssetType = "residenziale" | "commerciale" | "industriale";
export type Occupancy = "libero" | "occupato";

export interface Operation {
  id: string;
  rge: string;
  title: string;
  city: string;
  cap: string;
  country: Country;
  type: AssetType;
  basePrice: number;
  marketValue: number;
  surface: number;
  occupancy: Occupancy;
  auctionDate: string;
  roi: number;
  riskScore: "A" | "B" | "C";
  notes: string;
}

export const COUNTRY_LABEL: Record<Country, string> = {
  IT: "Italia",
  ES: "Spagna",
  DE: "Germania",
};

export const TYPE_LABEL: Record<AssetType, string> = {
  residenziale: "Residenziale",
  commerciale: "Commerciale / Uffici",
  industriale: "Industriale / Logistica",
};

export const OPERATIONS: Operation[] = [
  {
    id: "wt-001",
    rge: "R.G.E. 418/2024",
    title: "Appartamento signorile con box auto",
    city: "Milano",
    cap: "20144",
    country: "IT",
    type: "residenziale",
    basePrice: 187500,
    marketValue: 305000,
    surface: 96,
    occupancy: "libero",
    auctionDate: "18/09/2026",
    roi: 27.4,
    riskScore: "A",
    notes: "Vincoli urbanistici sanabili — perizia aggiornata Q2.",
  },
  {
    id: "wt-002",
    rge: "R.G.E. 1121/2023",
    title: "Unità commerciale fronte strada",
    city: "Torino",
    cap: "10121",
    country: "IT",
    type: "commerciale",
    basePrice: 96000,
    marketValue: 158000,
    surface: 130,
    occupancy: "occupato",
    auctionDate: "02/10/2026",
    roi: 31.2,
    riskScore: "B",
    notes: "Contratto 6+6 in essere — analisi liberazione in corso.",
  },
  {
    id: "wt-003",
    rge: "R.G.E. 77/2025",
    title: "Capannone logistico con piazzale",
    city: "Verona",
    cap: "37135",
    country: "IT",
    type: "industriale",
    basePrice: 289000,
    marketValue: 470000,
    surface: 1450,
    occupancy: "libero",
    auctionDate: "25/09/2026",
    roi: 22.8,
    riskScore: "B",
    notes: "Due diligence ambientale completata, nessuna criticità.",
  },
  {
    id: "wt-004",
    rge: "Exp. 302/2024",
    title: "Piso céntrico in zona Eixample",
    city: "Barcellona",
    cap: "08007",
    country: "ES",
    type: "residenziale",
    basePrice: 142000,
    marketValue: 236000,
    surface: 74,
    occupancy: "occupato",
    auctionDate: "11/11/2026",
    roi: 24.1,
    riskScore: "C",
    notes: "Procedura ES — occupazione da verificare con partner legale.",
  },
  {
    id: "wt-005",
    rge: "Az. 12 K 88/25",
    title: "Bürofläche in stabile direzionale",
    city: "Lipsia",
    cap: "04109",
    country: "DE",
    type: "commerciale",
    basePrice: 218000,
    marketValue: 331000,
    surface: 210,
    occupancy: "libero",
    auctionDate: "30/10/2026",
    roi: 19.6,
    riskScore: "A",
    notes: "Zwangsversteigerung — perizia giudiziaria disponibile.",
  },
  {
    id: "wt-006",
    rge: "R.G.E. 954/2024",
    title: "Villetta a schiera con giardino",
    city: "Bologna",
    cap: "40133",
    country: "IT",
    type: "residenziale",
    basePrice: 245000,
    marketValue: 372000,
    surface: 142,
    occupancy: "occupato",
    auctionDate: "07/10/2026",
    roi: 20.3,
    riskScore: "B",
    notes: "Esecutato residente — percorso stragiudiziale attivabile.",
  },
];
