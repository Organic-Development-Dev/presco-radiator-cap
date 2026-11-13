import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/text";

/** Shown by the service worker when a page isn't available offline. Pre-cached on install. */
export const metadata: Metadata = { title: "Offline", robots: { index: false, follow: false } };

export default async function OfflinePage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-site py-16 text-center sm:py-24">
      <h1 className="heading-section">You&apos;re offline</h1>
      <p className="mx-auto mt-4 max-w-md text-gray-600">
        This page isn&apos;t available without a connection. Pages you&apos;ve already visited still work. Check your
        connection and try again.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Try again
        </Link>
        {settings?.phone && (
          <a href={telHref(settings.phone)} className="btn-outline">
            Call {settings.phone}
          </a>
        )}
      </div>
    </div>
  );
}
