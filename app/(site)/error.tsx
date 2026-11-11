"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="container-site flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Something went wrong</h1>
      <p className="mt-6 text-gray-600">
        Sorry, this page couldn&apos;t be loaded. Please try again, or get in touch if the problem continues.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-outline">
          Go back home
        </Link>
      </div>
      {error.digest && <p className="mt-8 text-xs text-gray-400">Error reference: {error.digest}</p>}
    </section>
  );
}
