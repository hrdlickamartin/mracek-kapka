const VERSION = '__VERSION__';
const PRECACHE = ['__PRECACHE__'];
const PREFIX = 'mracek-kapka-';
const CACHE = PREFIX + VERSION;
const HASHED = /\/(_expo\/static|assets)\//;

async function fill() {
  const cache = await caches.open(CACHE);
  await Promise.all(
    PRECACHE.map(async (path) => {
      const url = new URL(path, self.registration.scope).href;
      if (HASHED.test(url)) {
        const old = await caches.match(url);
        if (old) return cache.put(url, old);
      }
      const res = await fetch(new Request(url, { cache: 'reload' }));
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      await cache.put(url, res);
    }),
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(fill().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request, { cache: 'no-cache' });
    if (res.status === 200) await cache.put(request.url.split('#')[0].split('?')[0], res.clone());
    return res;
  } catch (error) {
    const hit = (await cache.match(request, { ignoreSearch: true })) || (request.mode === 'navigate' && (await cache.match(self.registration.scope)));
    if (hit) return hit;
    throw error;
  }
}

async function cacheFirst(request) {
  const hit = await caches.match(request, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res.status === 200 && HASHED.test(request.url)) {
    const cache = await caches.open(CACHE);
    await cache.put(request, res.clone());
  }
  return res;
}

async function ranged(request) {
  const hit = await caches.match(request.url, { ignoreSearch: true });
  if (!hit) return fetch(request);
  const body = await hit.arrayBuffer();
  const size = body.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(request.headers.get('range') || '');
  let start = m && m[1] ? Number(m[1]) : 0;
  let end = m && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (m && !m[1] && m[2]) {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  }
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': hit.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  if (request.headers.has('range')) {
    event.respondWith(ranged(request));
    return;
  }
  const html = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
  event.respondWith(html ? networkFirst(request) : cacheFirst(request));
});
