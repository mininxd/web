// Service Worker for RTC File Transfer App

const CACHE_NAME = 'rtc-file-transfer-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/components/fileTransferApp.js',
  '/src/components/senderMode.js',
  '/src/components/receiverMode.js',
  '/src/utils/dom.js',
  '/src/utils/fileOperations.js',
  '/src/utils/peerManager.js',
  '/src/utils/qrcode.js',
  '/style.css',
  '/node_modules/peerjs/dist/peerjs.min.js',
  '/node_modules/qrcode/lib/browser.js',
  '/node_modules/jsqr/dist/jsqr.js',
  '/node_modules/jszip/dist/jszip.min.js'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Clone the request for fetch
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  console.log('Service worker activated');
});