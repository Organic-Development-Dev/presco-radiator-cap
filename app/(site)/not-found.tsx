import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-6 text-gray-600">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go back home
        </Link>
        <Link href="/products/" className="btn-outline">
          Browse products
        </Link>
      </div>
      <p className="mt-12 text-sm text-gray-600">
        Looking for a specific part?{" "}
        <Link href="/contact-us/" className="text-accent underline hover:no-underline">
          Contact our sales team
        </Link>
        .
      </p>
    </section>
  );
}
