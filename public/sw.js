/*
 * Presco service worker: makes the site installable and usable with a poor or no connection.
 *
 * - Pages: network first (always fresh when online); the last copy of each visited page is
 *   kept for offline use, otherwise /offline/ is shown.
 * - Next.js build assets (/_next/static, content-hashed): cache first.
 * - Images (site images and the Sanity CDN): stale-while-revalidate, capped.
 * - Never touches the Studio, API routes, form posts, or other sites.
 *
 * Bump VERSION to drop all caches on the next visit.
 */
const VERSION = "v1";
const PAGES = `presco-pages-${VERSION}`;
const ASSETS = `presco-assets-${VERSION}`;
const IMAGES = `presco-images-${VERSION}`;
const OFFLINE_URL = "/offline/";
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png", "/img/logo.png"];
const MAX_PAGES = 60;
const MAX_IMAGES = 200;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([PAGES, ASSETS, IMAGES]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("presco-") && !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  const sameOrigin = url.origin === self.location.origin;
  const sanityImage = url.hostname === "cdn.sanity.io" && url.pathname.startsWith("/images/");
  if (!sameOrigin && !sanityImage) return;
  if (sameOrigin && /^\/(studio|api)(\/|$)/.test(url.pathname)) return;
  // React Server Component payloads for client-side navigation: leave to the network.
  if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
  } else if (sameOrigin && url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, ASSETS));
  } else if (sanityImage || request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, IMAGES, MAX_IMAGES));
  }
});

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone()).then(() => trim(PAGES, MAX_PAGES, PRECACHE));
    }
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      // Opaque (cross-origin, no-cors) responses are fine to cache for <img>.
      if (response.ok || response.type === "opaque") {
        cache.put(request, response.clone()).then(() => trim(cacheName, max));
      }
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

/** Keep a cache to `max` entries, oldest first, never removing `pinned` URLs. */
async function trim(cacheName, max, pinned = []) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const removable = keys.filter((req) => !pinned.includes(new URL(req.url).pathname));
  const excess = keys.length - max;
  for (let i = 0; i < excess && i < removable.length; i++) await cache.delete(removable[i]);
}
