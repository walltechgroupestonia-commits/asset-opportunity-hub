import type{CrossCheckIssue,ParsedDocument}from"./documentParserTypes";
export type SourceClass="OFFICIAL"|"PROCEDURAL_DOCUMENT"|"MARKET"|"USER_INPUT"|"ENGINE_INFERENCE";
export type EvidenceConfidence="CONFIRMED"|"REPORTED"|"ESTIMATED"|"MISSING";
export type PropertyDecision="DISCARD"|"REVIEW"|"DEEP_DIVE"|"INVESTMENT_READY";
export type RiskLevel="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type DocumentEvidenceStatus="ACQUIRED"|"ANALYZED"|"UNREADABLE"|"ERROR";
export interface PropertyDocumentEvidence{id:string;fileName:string;mimeType:string;size:number;sha256?:string;status:DocumentEvidenceStatus;parsedDocument?:ParsedDocument;error?:string;processedAt:string;}
export interface PropertyDocumentEvidenceLayer{documents:PropertyDocumentEvidence[];crossChecks:CrossCheckIssue[];globalWarnings:string[];}
export interface ProvenanceValue<T>{value:T|null;sourceClass:SourceClass;sourceLabel:string;confidence:EvidenceConfidence;note?:string;}
export interface PropertyIssue{id:string;area:"PROCEDURE"|"DOCUMENTATION"|"URBAN"|"CADASTRAL"|"OCCUPANCY"|"CONDOMINIUM"|"MARKET"|"FINANCIAL"|"TAX"|"EXIT";title:string;level:RiskLevel;description:string;estimatedCost?:number;sourceLabel:string;confidence:EvidenceConfidence;blocking:boolean;nextCheck?:string;}
export interface InvestmentAssumptions{targetPurchasePrice:number|null;renovationCost:number|null;proceduralCosts:number|null;taxesAndTransferCosts:number|null;condominiumCosts:number|null;financeCosts:number|null;contingency:number|null;expectedSalePrice:number|null;expectedMonthlyRent:number|null;monthsToExit:number|null;}
export interface PropertyOpportunityInput{opportunityId:string;title:string;procedure:any;asset:any;issues:PropertyIssue[];market:any;assumptions:InvestmentAssumptions;availableDocuments:string[];missingDocuments:string[];documentEvidence?:PropertyDocumentEvidenceLayer;}
export interface InvestmentScenario{name:"FLIP"|"RENTAL"|"HOLD";completeness:number;totalCapitalRequired:number|null;grossMargin:number|null;roiPercent:number|null;annualGrossYieldPercent:number|null;missingInputs:string[];}
export interface PropertyIntelligenceOutput{opportunityId:string;decision:PropertyDecision;opportunityScore:number|null;riskScore:number|null;riskCoverage:number;completeness:number;scoreBreakdown:Record<string,number>;topRisks:PropertyIssue[];strengths:string[];requiredNextChecks:string[];scenarios:InvestmentScenario[];decisionReason:string;generatedAt:string;}
