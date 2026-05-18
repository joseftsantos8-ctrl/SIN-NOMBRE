// Service Worker mínimo para PWA. Cache-first para assets estáticos,
// network-first para módulos JS (que cambian frecuentemente durante desarrollo).

const CACHE_NAME = 'sirena-sp13-v1';
const ASSETS_ESTATICOS = [
    './',
    './index.html',
    './styles.css',
    './manifest.webmanifest',
    './imagen/logo.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_ESTATICOS).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // Para módulos JS (en mismo origen): network-first con fallback a cache
    if (url.origin === location.origin && url.pathname.endsWith('.js')) {
        e.respondWith(
            fetch(e.request)
                .then(resp => {
                    const clon = resp.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clon));
                    return resp;
                })
                .catch(() => caches.match(e.request))
        );
        return;
    }

    // Resto: cache-first
    e.respondWith(
        caches.match(e.request).then(resp => resp || fetch(e.request))
    );
});
