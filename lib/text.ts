/** Collapse whitespace and cut to `max` characters on a word boundary, adding an ellipsis. */
export function truncate(text: string | null | undefined, max = 160): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, "")}…`;
}

/** Format a postal address as display lines. */
export function addressLines(address: {
  streetAddress?: string | null;
  locality?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
} | null | undefined): string[] {
  if (!address) return [];
  return [address.streetAddress, address.locality, address.region, address.country, address.postalCode].filter(
    (line): line is string => Boolean(line?.trim()),
  );
}

/** "+44 (0)1905 755656" -> "tel:+441905755656" */
export const telHref = (phone: string) => `tel:${phone.replace(/\(0\)/, "").replace(/[^\d+]/g, "")}`;

/**
 * Tidy a raw spec value for use in titles and alt text:
 * "FUEL CAP (DIFF. UNDERNEATH TO PAG830)" -> "Fuel Cap",
 * "HEXAGONAL PRESSURE CAP 10LB, SHORT REACH" -> "Hexagonal Pressure Cap 10LB".
 */
export function tidyLabel(raw: string | null | undefined): string {
  let label = (raw ?? "").replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  if (label.length > 30 && label.includes(",")) label = label.slice(0, label.indexOf(",")).trim();
  const letters = label.replace(/[^A-Za-z]/g, "");
  if (letters && letters === letters.toUpperCase()) {
    // ALL CAPS -> Title Case, keeping codes with digits (10LB, 15PSI) as they are.
    label = label
      .split(" ")
      .map((word) => (/\d/.test(word) ? word : word.charAt(0) + word.slice(1).toLowerCase()))
      .join(" ")
      .replace(/\b(And|Or|Of|To|For|With)\b/g, (w) => w.toLowerCase());
  }
  return label;
}
