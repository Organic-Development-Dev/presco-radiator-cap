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
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="field-input bg-white"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={pending}>
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
