/** Helpers for reading catalogue filters/pagination from URL search params. */

export type SearchParams = Record<string, string | string[] | undefined>;

export const PAGE_SIZE = 24;

/** URL param names used by the catalogue filter form. */
export const FILTER_PARAMS = { application: "application", type: "type", page: "page" } as const;

export function paramList(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).map((v) => v.trim()).filter(Boolean);
}

export function firstParam(value: string | string[] | undefined): string {
  return paramList(value)[0] ?? "";
}

export type CatalogueFilters = { applications: string[]; types: string[] };

/** Read selected filters, keeping only values that exist in the facet lists. */
export function parseFilters(
  searchParams: SearchParams,
  facets: { applications: string[]; partTypes: string[] },
): CatalogueFilters {
  const allowedApps = new Set(facets.applications);
  const allowedTypes = new Set(facets.partTypes);
  return {
    applications: [...new Set(paramList(searchParams[FILTER_PARAMS.application]))].filter((v) => allowedApps.has(v)),
    types: [...new Set(paramList(searchParams[FILTER_PARAMS.type]))].filter((v) => allowedTypes.has(v)),
  };
}

export function parsePage(searchParams: SearchParams): number {
  const n = Number.parseInt(firstParam(searchParams[FILTER_PARAMS.page]), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Build a catalogue URL with the given filters and page. */
export function catalogueHref(basePath: string, filters: CatalogueFilters, page = 1): string {
  const qs = new URLSearchParams();
  filters.applications.forEach((v) => qs.append(FILTER_PARAMS.application, v));
  filters.types.forEach((v) => qs.append(FILTER_PARAMS.type, v));
  if (page > 1) qs.set(FILTER_PARAMS.page, String(page));
  const query = qs.toString();
  return query ? `${basePath}?${query}` : basePath;
}

const collator = new Intl.Collator("en-GB", { numeric: true, sensitivity: "base" });

/** Natural sort ("PAG9" before "PAG10"). */
export function naturalCompare(a: string, b: string): number {
  return collator.compare(a, b);
}
