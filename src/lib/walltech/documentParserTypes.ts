export type DocumentKind="SALE_NOTICE"|"DELEGATION_ORDER"|"SALE_HISTORY_ORDER"|"CTU"|"CADASTRAL"|"PLAN"|"APE"|"OTHER";
export type Confidence="HIGH"|"MEDIUM"|"LOW"|"MISSING";
export interface ParsedField<T=string|number|null>{key:string;label:string;value:T;sourceDocument:DocumentKind;sourceLabel:string;page?:number;confidence:Confidence;note?:string;}
export interface ParsedDocument{id:string;kind:DocumentKind;title:string;fields:ParsedField[];warnings:string[];missingFields:string[];}
export interface CrossCheckIssue{fieldKey:string;severity:"INFO"|"WARNING"|"CRITICAL";message:string;values:Array<{sourceLabel:string;value:string|number|null}>;}
export interface DocumentIntelligenceOutput{documents:ParsedDocument[];crossChecks:CrossCheckIssue[];globalWarnings:string[];flatFields:Record<string,ParsedField>;}
