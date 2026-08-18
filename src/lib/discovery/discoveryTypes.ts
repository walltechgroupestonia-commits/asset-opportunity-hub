import type { NormalizedListing } from "@/lib/adapters/types";

export interface DiscoveryQuery {
  region?: string;
  province?: string;
  city?: string;

  assetType?: string;

  minSurfaceSqm?: number;
  maxSurfaceSqm?: number;

  minBudget?: number;
  maxBudget?: number;

  occupancy?: string;
  procedure?: string;

  auctionDateFrom?: string;
  auctionDateTo?: string;

  page?: number;
  pageSize?: number;
}

export interface DiscoveryResult {
  query: DiscoveryQuery;

  totalMatches: number;
  returnedCount: number;

  page: number;
  pageSize: number;

  hasMore: boolean;

  sourceId: string;
  sourceLabel: string;

  items: NormalizedListing[];
}
