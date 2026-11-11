"use client";

import { useActionState, useId } from "react";
import { submitEnquiry, type FormState } from "@/app/actions/forms";
import { Honeypot } from "./Honeypot";
import { Turnstile } from "./Turnstile";

type Props = {
  kind: "contact" | "enquiry" | "order";
  productId?: string;
  productTitle?: string;
  submitLabel?: string;
};

const initialState: FormState = { status: "idle" };

/** Shared form for the contact page and the product "Enquire Now" / "Order Now" dialogs. */
export function EnquiryForm({ kind, productId, productTitle, submitLabel = "Send" }: Props) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const id = useId();
  const err = (field: string) => state.fieldErrors?.[field]?.[0];

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
        {state.message}
      </div>
    );
  }

  const defaultMessage =
    kind === "order" && productTitle
      ? `I would like to order: ${productTitle}\nQuantity: `
      : kind === "enquiry" && productTitle
        ? `Enquiry about ${productTitle}: `
        : "";

  return (
    <form action={formAction} className="relative space-y-4" noValidate>
      <input type="hidden" name="kind" value={kind} />
      {productId && <input type="hidden" name="productId" value={productId} />}
      {productTitle && <input type="hidden" name="productTitle" value={productTitle} />}
      <Honeypot />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Name" error={err("name")}>
          <input id={`${id}-name`} name="name" required autoComplete="name" className="field-input" />
        </Field>
        <Field id={`${id}-email`} label="Email" error={err("email")}>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="field-input" />
        </Field>
        <Field id={`${id}-phone`} label="Phone (optional)" error={err("phone")}>
          <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className="field-input" />
        </Field>
        <Field id={`${id}-company`} label="Company (optional)" error={err("company")}>
          <input id={`${id}-company`} name="company" autoComplete="organization" className="field-input" />
        </Field>
      </div>
      <Field id={`${id}-message`} label="Message" error={err("message")}>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          defaultValue={defaultMessage}
          className="field-input"
        />
      </Field>

      <Turnstile />

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      )}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
