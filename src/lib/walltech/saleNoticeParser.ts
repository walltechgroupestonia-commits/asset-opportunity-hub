import type{ParsedDocument,ParsedField}from"./documentParserTypes";
const pick=(text:string,re:RegExp)=>text.match(re)?.[1]?.trim()??null;
const euro=(v:string|null)=>{if(!v)return null;const n=Number(v.replace(/\./g,"").replace(",",".").replace(/[^0-9.]/g,""));return Number.isFinite(n)?n:null};
const f=<T,>(key:string,label:string,value:T):ParsedField<T>=>({key,label,value,sourceDocument:"SALE_NOTICE",sourceLabel:"Avviso di vendita",confidence:value===null||value===""?"MISSING":"HIGH"});
export function parseSaleNotice(text:string):ParsedDocument{const fields:ParsedField[]=[
f("procedureNumber","Numero procedura",pick(text,/Procedura\s+Esecutiva\s+n\.\s*([^\n]+)/i)??pick(text,/RGE\s*[-:]?\s*([0-9]+\/[0-9]{4})/i)),
f("judge","Giudice",pick(text,/Giudice[^:\n]*:\s*([^\n]+)/i)),
f("delegate","Professionista delegato",pick(text,/professionista\s+delegato\s+(Avv\.[^,\n]+)/i)),
f("auctionDate","Data asta",pick(text,/(\d{1,2}\s+[A-Za-zÀ-ÿ]+\s+\d{4}\s+alle\s+ore\s+\d{1,2}:\d{2})/i)),
f("offerDeadline","Termine offerte",pick(text,/Termine\s+per\s+la\s+presentazione\s+delle\s+offerte:\s*([^\n]+)/i)),
f("basePrice","Prezzo base",euro(pick(text,/Prezzo\s+Base\s+della\s+Vendita:\s*€?\s*([^\n]+)/i))),
f("minimumOffer","Offerta minima",euro(pick(text,/Offerta\s+Minima:\s*€?\s*([^\n]+)/i))),
f("minimumBidIncrease","Rilancio minimo",euro(pick(text,/Aumenti\s+minimi[^:]*:\s*€?\s*([^\n]+)/i))),
f("depositPercent","Cauzione %",(()=>{const x=pick(text,/CAUZIONE[^\n]*?([0-9]+)%/i);return x?Number(x):null})()),
f("balanceDays","Saldo giorni",(()=>{const x=pick(text,/termine\s+massimo\s+di\s+giorni\s+([0-9]+)/i)??pick(text,/entro\s+il\s+termine\s+massimo\s+di\s+([0-9]+)\s+gg/i);return x?Number(x):null})()),
f("address","Indirizzo",pick(text,/(Via\s+[A-Za-zÀ-ÿ'\s]+\s+n\.\s*\d+)/i)),
f("occupancy","Occupazione",pick(text,/OCCUPAZIONE:\s*([^\n]+)/i)),
f("cadastralSheet","Foglio",pick(text,/Fg\.\s*([0-9]+)/i)),
f("cadastralParcel","Mappale",pick(text,/mapp\.\s*([0-9]+)/i)),
f("cadastralSub","Subalterno",pick(text,/sub\.\s*([0-9]+)/i)),
f("cadastralCategory","Categoria catastale",pick(text,/cat\.\s*([A-Z]\/[0-9]+)/i)),
f("cadastralIncome","Rendita catastale",euro(pick(text,/rendita\s*€\s*([0-9.,]+)/i))),
f("energyClass","Classe energetica",pick(text,/Classe\s+([A-G])/i))
];const missingFields=fields.filter(x=>x.confidence==="MISSING").map(x=>x.label);return{id:"sale-notice",kind:"SALE_NOTICE",title:"Avviso di vendita",fields,warnings:missingFields.length?[`Campi non estratti: ${missingFields.join(", ")}`]:[],missingFields};}
