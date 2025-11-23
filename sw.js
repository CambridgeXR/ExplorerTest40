const CACHE_NAME = 'vr-explorer-v1.40'; 

const REPO_PATH = '/ExplorerTest40/';
const ASSETS_TO_CACHE = [
    REPO_PATH,
    REPO_PATH + 'index.html',
    REPO_PATH + 'style.css',
    REPO_PATH + 'video-data.js',
    REPO_PATH + 'manifest.json',
    'https://aframe.io/releases/1.4.2/aframe.min.js',
    'https://cdn.jsdelivr.net/npm/webxr-polyfill@latest/build/webxr-polyfill.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'reload' })));
            })
            .catch(err => console.error('Service Worker: Cache open failed', err))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
                if (response) return response;
                return fetch(event.request);
            })
    );
});
