import { NextResponse, type NextRequest } from "next/server";

/**
 * Receives Content-Security-Policy violation reports (the site sends a report-only policy, see
 * next.config.ts) and writes a one-line summary to the server logs (Vercel → Logs, search
 * "CSP violation"). Accepts both the legacy `application/csp-report` body and the Reporting
 * API's array format. Never stores anything.
 */
export async function POST(req: NextRequest) {
  try {
    const text = (await req.text()).slice(0, 10_000);
    const parsed: unknown = JSON.parse(text);
    const reports = Array.isArray(parsed) ? parsed.map((r) => r?.body) : [(parsed as { "csp-report"?: unknown })["csp-report"]];
    for (const r of reports as Record<string, unknown>[]) {
      if (!r) continue;
      const directive = r["effective-directive"] ?? r.effectiveDirective ?? r["violated-directive"];
      const blocked = r["blocked-uri"] ?? r.blockedURL;
      const page = r["document-uri"] ?? r.documentURL;
      console.warn("CSP violation:", directive, "blocked:", blocked, "on:", page);
    }
  } catch {
    // Malformed report: ignore.
  }
  return new NextResponse(null, { status: 204 });
}
