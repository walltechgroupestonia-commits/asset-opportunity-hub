# WT-012 — Property Intelligence Engine V001

Caricare mantenendo esattamente i percorsi:

- src/lib/walltech/propertyIntelligenceTypes.ts
- src/lib/walltech/propertyScenarioEngine.ts
- src/lib/walltech/propertyIntelligenceEngine.ts
- src/data/imperia1312024.ts
- src/components/walltech/PropertyDecisionEngineV001.tsx

V001 NON sostituisce route esistenti.

Per visualizzarlo, importa:
`import { PropertyDecisionEngineV001 } from "@/components/walltech/PropertyDecisionEngineV001";`

e inserisci:
`<PropertyDecisionEngineV001 />`

Principi:
- provenienza dati separata
- niente ROI inventati
- criticità → next checks
- scenari FLIP / RENTAL / HOLD
- caso test reale Imperia 131/2024

Commit:
feat: add Property Intelligence Engine v001
