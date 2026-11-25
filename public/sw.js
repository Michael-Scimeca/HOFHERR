const CACHE_NAME = 'hofherr-v1';
const STATIC_PRECACHE = ['/', '/icon.png', '/apple-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept API, auth, admin, Sanity Studio, or checkout routes
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/studio') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/checkout')
  ) {
    return;
  }

  // Network-first for HTML navigations so CMS updates appear immediately, with cached fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => undefined);
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              caches.match('/') ||
              new Response(
                '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline — Hofherr Meat Co.</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#f5f0e8;font-family:system-ui,sans-serif;text-align:center;padding:24px}h1{color:#c41e3a;margin:0 0 8px}p{color:#b5aea4;max-width:360px}</style></head><body><main><h1>Hofherr Meat Co.</h1><p>You appear to be offline. Reconnect to browse cuts, specials, and online ordering.</p></main></body></html>',
                { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
              )
          )
        )
    );
    return;
  }

  // Cache-first for immutable Next.js build assets and static images/icons
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/images/')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => undefined);
            }
            return response;
          })
      )
    );
  }
});

