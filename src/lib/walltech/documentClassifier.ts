import type{DocumentKind}from"./documentParserTypes";
export function classifyDocument(text:string):DocumentKind{
const t=text
  .toLowerCase()
  .replace(/[’‘`´]/g, "'");
if(t.includes("avviso di vendita"))return"SALE_NOTICE";
if(
  (
    t.includes("riduzioni basi d'asta") ||
    t.includes("riduzione della base d'asta") ||
    t.includes("riduzione del 25% della base d'asta")
  ) &&
  (
    t.includes("esperimenti di vendita") ||
    t.includes("verbale negativo") ||
    t.includes("senza esito")
  ) &&
  (
    t.includes("visto si autorizza") ||
    t.includes("si richiede l'autorizzazione") ||
    t.includes("presenta istanza")
  )
)return"SALE_HISTORY_ORDER";
if(t.includes("delega")&&(t.includes("professionista delegato")||t.includes("giudice dell'esecuzione")))return"DELEGATION_ORDER";
if(t.includes("relazione di stima")||t.includes("esperto stimatore")||t.includes("ctu")||t.includes("elaborato peritale")||t.includes("relazione peritale"))return"CTU";
if(t.includes("visura catastale")||t.includes("catasto fabbricati"))return"CADASTRAL";
if(t.includes("attestato di prestazione energetica")||t.includes("classe energetica"))return"APE";
if(t.includes("planimetria"))return"PLAN";
return"OTHER";
}
