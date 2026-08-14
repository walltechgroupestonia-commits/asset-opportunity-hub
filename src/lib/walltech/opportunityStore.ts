import type { PropertyOpportunityInput } from "./propertyIntelligenceTypes";

const STORAGE_KEY = "walltech.propertyOpportunity.v1";

export function savePropertyOpportunity(
  opportunity: PropertyOpportunityInput,
): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(opportunity),
  );
}

export function loadPropertyOpportunity(): PropertyOpportunityInput | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PropertyOpportunityInput;
  } catch {
    return null;
  }
}

export function clearPropertyOpportunity(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
}
