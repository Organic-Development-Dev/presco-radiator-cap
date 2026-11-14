"use client";

import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile widget. Renders nothing when no site key is configured (local dev).
 * Adds a hidden `cf-turnstile-response` input to the surrounding <form>.
 */
export function Turnstile() {
  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="light" />
    </>
  );
}
