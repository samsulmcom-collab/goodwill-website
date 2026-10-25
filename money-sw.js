const C = "goodwill-money-v1";
const A = ["money.html", "money-manifest.json", "money-icon-192.png", "money-icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => Promise.all(A.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  const mine = A.some(a => new URL(a, self.location).href === u.href);
  if (e.request.method !== "GET" || !mine) return; // never touches the rest of your website
  e.respondWith(fetch(e.request).then(r => {
    const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r;
  }).catch(() => caches.match(e.request)));
});
