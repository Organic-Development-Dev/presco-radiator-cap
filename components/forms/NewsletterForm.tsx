"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type FormState } from "@/app/actions/forms";
import { Honeypot } from "./Honeypot";

const initialState: FormState = { status: "idle" };

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  if (state.status === "success") {
    return (
      <p role="status" className={className}>
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className={`relative ${className ?? ""}`} noValidate>
      <Honeypot />
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email*"
          className="w-full min-w-0 rounded-md border border-white bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-white/80 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button type="submit" className="shrink-0 rounded-md bg-white px-4 py-1.5 text-sm text-primary transition-colors hover:bg-white/90 disabled:opacity-60" disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-200">
          {state.message}
        </p>
      )}
    </form>
  );
}
