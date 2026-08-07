# WALLTECH INTELLIGENCE ENGINE™ CORE — V001

## Prodotto
Core comune per normalizzazione input, registry dei moduli, controllo controparti, fee, evidence, owner, next action, deadline, compliance, condition, readiness, outcome e warnings.

## Installazione
Copiare mantenendo esattamente i percorsi:
- `src/lib/walltech/`
- `src/data/walltechCoreDemo.ts`
- `src/components/walltech/CoreDecisionPreview.tsx`

Non caricare i file nella root del repository.

## Verifica
```bash
npm install
npm run build
```

## Prima integrazione controllata
```tsx
import { CoreDecisionPreview } from "@/components/walltech/CoreDecisionPreview";
```
Poi inserire `<CoreDecisionPreview />` in una route di test.

## Sicurezza
Il Core non effettua scraping, non acquisisce dati da portali e non dichiara connessioni live. Gli adapter PVP, Astalegale, Abilio/Quimmo saranno un layer separato.

## Commit message
`feat: add Walltech Intelligence Engine core v001`
