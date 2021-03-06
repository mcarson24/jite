const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// TODO: Implement asset caching
// self.addEventListener('install', e => {
//   e.waitUntil(
//     caches.open('cache-v1').then(cache => {
//       return cache.addAll(
//         [
//           // '/',
//           // '/index.html',
//           // '/css/style.css',
//           // '/js/index.js',
//           // '/images/logo.png',
//         ]
//       );
//     })
//   );
// });

const cacheName = 'static-resources';

const matchCallback = ({ request }) => {
  return (
    // CSS
    request.destination === 'style' ||
    // JavaScript
    request.destination === 'script'
  );
};

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

registerRoute(
  matchCallback, 
  new StaleWhileRevalidate({
  cacheName,
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200]
    })
  ],
}));

