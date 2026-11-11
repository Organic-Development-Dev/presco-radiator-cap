import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity GROQ-powered webhook target. Configure in sanity.io/manage -> API -> Webhooks:
 *   URL:        https://www.presco-radiator-caps.com/api/revalidate
 *   Trigger on: create, update, delete
 *   Projection: { _type, "slug": slug.current }
 *   Secret:     SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Missing _type" }, { status: 400 });
    }
    revalidateTag(body._type, "max");
    if (body.slug) revalidateTag(`${body._type}:${body.slug}`, "max");
    return NextResponse.json({ revalidated: [body._type, body.slug].filter(Boolean) });
  } catch (err) {
    console.error("Revalidate webhook failed", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
