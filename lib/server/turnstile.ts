import "server-only";

/** Verify a Cloudflare Turnstile token. Skipped (returns true) when no secret is configured, e.g. locally. */
export async function verifyTurnstile(token: string | undefined, ip?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}
