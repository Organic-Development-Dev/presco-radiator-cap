/*
 * Presco service worker: makes the site installable and usable with a poor or no connection.
 *
 * - Pages: network first (always fresh when online); the last copy of each visited page is
 *   kept for offline use, otherwise /offline/ is shown.
 * - Next.js build assets (/_next/static, content-hashed): cache first.
 * - Sanity CDN images (URLs are content-addressed, never change): cache first, fetched with CORS
 *   so they're stored at their real size (opaque responses count as ~7 MB each against quota).
 * - Other site images: stale-while-revalidate. Both capped.
 * - Navigation preload is on, so page requests don't wait for the worker to start.
 * - Never touches the Studio, API routes, form posts, or other sites.
 *
 * Bump VERSION to drop all caches on the next visit.
 */
const VERSION = "v2";
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
      .then(() => self.registration.navigationPreload?.enable())
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
    event.respondWith(networkFirstPage(request, event.preloadResponse));
  } else if (sameOrigin && url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, ASSETS));
  } else if (sanityImage) {
    event.respondWith(cacheFirstSanityImage(request));
  } else if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, IMAGES, MAX_IMAGES));
  }
});

async function networkFirstPage(request, preloadResponse) {
  const cache = await caches.open(PAGES);
  try {
    const response = (await preloadResponse) || (await fetch(request));
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

async function cacheFirstSanityImage(request) {
  const cache = await caches.open(IMAGES);
  const cached = await cache.match(request.url);
  if (cached) return cached;
  try {
    const response = await fetch(request.url, { mode: "cors", credentials: "omit" });
    if (response.ok) cache.put(request.url, response.clone()).then(() => trim(IMAGES, MAX_IMAGES));
    return response;
  } catch {
    // CORS or network failure: let the browser load it normally (not cached).
    return fetch(request);
  }
}

async function staleWhileRevalidate(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) {
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
