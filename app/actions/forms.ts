"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { writeClient } from "@/lib/server/writeClient";
import { ENQUIRY_TYPES } from "@/lib/enquiry";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const enquirySchema = z.object({
  kind: z.enum(["contact", "enquiry", "order"]),
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  enquiryType: z.enum(ENQUIRY_TYPES).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please enter a message").max(5000),
  productId: z.string().max(100).optional().or(z.literal("")),
  productTitle: z.string().max(200).optional().or(z.literal("")),
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Contact form, product "Enquire Now" and "Order Now".
 * Validates, checks Turnstile, saves an `enquiry` document in Sanity and emails the sales inbox.
 */
export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) return { status: "success", message: "Thanks — we'll be in touch." };

  const parsed = enquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const data = parsed.data;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const human = await verifyTurnstile(formData.get("cf-turnstile-response")?.toString(), ip);
  if (!human) return { status: "error", message: "Spam check failed. Please refresh the page and try again." };

  const results = await Promise.allSettled([
    process.env.SANITY_API_WRITE_TOKEN
      ? writeClient.create({
          _type: "enquiry",
          kind: data.kind,
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          company: data.company || undefined,
          enquiryType: data.enquiryType || undefined,
          message: data.message,
          submittedAt: new Date().toISOString(),
          ...(data.productId ? { product: { _type: "reference", _ref: data.productId, _weak: true } } : {}),
        })
      : Promise.resolve(null),
    sendEmail(data),
  ]);

  const failures = results.filter((r) => r.status === "rejected");
  failures.forEach((f) => console.error("Enquiry delivery failed:", (f as PromiseRejectedResult).reason));
  // Only fail if nothing got through.
  if (failures.length === results.length) {
    return { status: "error", message: "Sorry, something went wrong. Please email or call us instead." };
  }
  return { status: "success", message: "Thanks — your message has been sent. We'll be in touch shortly." };
}

async function sendEmail(data: z.infer<typeof enquirySchema>) {
  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO_EMAIL || !ENQUIRY_FROM_EMAIL) {
    if (process.env.NODE_ENV === "production") throw new Error("Email is not configured");
    console.info("[dev] Enquiry email skipped (Resend not configured):", data);
    return;
  }
  const label = { contact: "Website contact", enquiry: "Product enquiry", order: "Order request" }[data.kind];
  const subject = `${label}${data.productTitle ? ` — ${data.productTitle}` : ""} from ${data.name}`;
  const rows: [string, string | undefined][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company],
    ["Enquiry type", data.enquiryType],
    ["Product", data.productTitle],
  ];
  const html = `<h2>${escapeHtml(label)}</h2><table>${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v!)}</td></tr>`)
    .join("")}</table><p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`;

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: ENQUIRY_FROM_EMAIL,
    to: ENQUIRY_TO_EMAIL.split(",").map((s) => s.trim()),
    replyTo: data.email,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
}

const newsletterSchema = z.object({ email: z.email("Please enter a valid email address") });

/** Newsletter sign-up -> Mailchimp audience. */
export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { status: "success", message: "Thanks for subscribing!" };
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_LIST_ID } = process.env;
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
    console.error("Mailchimp is not configured");
    return { status: "error", message: "Sign-up is temporarily unavailable." };
  }

  const email = parsed.data.email.toLowerCase();
  const hash = createHash("md5").update(email).digest("hex");
  const res = await fetch(
    `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${hash}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, status_if_new: "subscribed" }),
    },
  );
  if (!res.ok) {
    console.error("Mailchimp error", res.status, await res.text());
    return { status: "error", message: "Sorry, we couldn't subscribe you. Please try again later." };
  }
  return { status: "success", message: "Thanks for subscribing!" };
}
