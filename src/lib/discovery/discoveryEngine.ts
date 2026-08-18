import type { NormalizedListing } from "@/lib/adapters/types";
import type {
  DiscoveryQuery,
  DiscoveryResult,
} from "./discoveryTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

const matchesText = (
  value: string | undefined,
  expected: string | undefined,
): boolean => {
  if (!expected?.trim()) return true;
  if (!value) return false;

  return value
    .toLocaleLowerCase("it-IT")
    .includes(expected.trim().toLocaleLowerCase("it-IT"));
};

const matchesNumberMin = (
  value: number | undefined,
  minimum: number | undefined,
): boolean => {
  if (minimum === undefined) return true;
  return value !== undefined && value >= minimum;
};

const matchesNumberMax = (
  value: number | undefined,
  maximum: number | undefined,
): boolean => {
  if (maximum === undefined) return true;
  return value !== undefined && value <= maximum;
};

const matchesDateMin = (
  value: string | undefined,
  minimum: string | undefined,
): boolean => {
  if (!minimum) return true;
  if (!value) return false;

  return value >= minimum;
};

const matchesDateMax = (
  value: string | undefined,
  maximum: string | undefined,
): boolean => {
  if (!maximum) return true;
  if (!value) return false;

  return value <= maximum;
};

const normalizePage = (page: number | undefined): number =>
  Number.isInteger(page) && page && page > 0
    ? page
    : DEFAULT_PAGE;

const normalizePageSize = (
  pageSize: number | undefined,
): number => {
  if (!Number.isInteger(pageSize) || !pageSize || pageSize <= 0) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(pageSize, MAX_PAGE_SIZE);
};

export function runDiscovery(
  listings: NormalizedListing[],
  query: DiscoveryQuery,
): DiscoveryResult {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);

  const filtered = listings.filter((listing) =>
    matchesText(listing.region, query.region) &&
    matchesText(listing.province, query.province) &&
    matchesText(listing.city, query.city) &&
    matchesText(listing.assetType, query.assetType) &&
    matchesNumberMin(
      listing.surfaceSqm,
      query.minSurfaceSqm,
    ) &&
    matchesNumberMax(
      listing.surfaceSqm,
      query.maxSurfaceSqm,
    ) &&
    matchesNumberMin(
      listing.minimumOffer ?? listing.basePrice,
      query.minBudget,
    ) &&
    matchesNumberMax(
      listing.minimumOffer ?? listing.basePrice,
      query.maxBudget,
    ) &&
    matchesText(listing.occupancy, query.occupancy) &&
    matchesText(listing.procedure, query.procedure) &&
    matchesDateMin(
      listing.auctionDate,
      query.auctionDateFrom,
    ) &&
    matchesDateMax(
      listing.auctionDate,
      query.auctionDateTo,
    ),
  );

  const start = (page - 1) * pageSize;
  const items = filtered.slice(
    start,
    start + pageSize,
  );

  return {
    query,
    totalMatches: filtered.length,
    returnedCount: items.length,
    page,
    pageSize,
    hasMore: start + items.length < filtered.length,
    sourceId: items[0]?.sourceId ?? "unknown",
    sourceLabel:
      items[0]?.sourceLabel ?? "Fonte non disponibile",
    items,
  };
}
