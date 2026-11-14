"use client";

import { useActionState, useId } from "react";
import { submitEnquiry, type FormState } from "@/app/actions/forms";
import { ENQUIRY_TYPES } from "@/lib/enquiry";
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
  // React resets the form after every action, so refill it from what the server echoed back.
  const value = (field: string) => state.values?.[field];
  // Link each input to its error message for screen readers.
  const a11y = (field: string, inputId: string) =>
    err(field) ? { "aria-invalid": true as const, "aria-describedby": `${inputId}-error` } : {};

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
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
          <input id={`${id}-name`} name="name" required autoComplete="name" defaultValue={value("name")} {...a11y("name", `${id}-name`)} className="field-input" />
        </Field>
        <Field id={`${id}-email`} label="Email" error={err("email")}>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" defaultValue={value("email")} {...a11y("email", `${id}-email`)} className="field-input" />
        </Field>
        <Field id={`${id}-phone`} label="Phone (optional)" error={err("phone")}>
          <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" defaultValue={value("phone")} {...a11y("phone", `${id}-phone`)} className="field-input" />
        </Field>
        <Field id={`${id}-company`} label="Company (optional)" error={err("company")}>
          <input id={`${id}-company`} name="company" autoComplete="organization" defaultValue={value("company")} {...a11y("company", `${id}-company`)} className="field-input" />
        </Field>
      </div>
      {kind === "contact" && (
        <Field id={`${id}-type`} label="Enquiry type" error={err("enquiryType")}>
          <select id={`${id}-type`} name="enquiryType" defaultValue={value("enquiryType") ?? ""} className="field-input">
            <option value="">Please choose (optional)</option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
      )}
      <Field id={`${id}-message`} label="Message" error={err("message")}>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          defaultValue={value("message") ?? defaultMessage}
          {...a11y("message", `${id}-message`)}
          className="field-input"
        />
      </Field>

      <Turnstile resetKey={state} />

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
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
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
