importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

// StaleWhileRevalidate
// Always request files to update the cache if possible
// But if the network connection doesn't exist, fallback to the cache
// And possibly return the cache while the cache is being updated? Unsure about this point
// We aren't event using this strategy anymore but we were previously so I'm leaving this in

// CacheFirst
// Go to the cache and don't refetch if they are there

// test

try {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  const handler = workbox.precaching.createHandlerBoundToURL("/index.html");
  const navigationRoute = new workbox.routing.NavigationRoute(handler);
  workbox.routing.registerRoute(navigationRoute);
} catch (e) {
  // Ignore errors
  // Errors will happen during development since __WB_MANIFEST is undefined
  // Also createHandlerBoundToURL will fail since "/index.html" would not have been pre-cached
  // So that I can actually develop this, I add this try/cache which works great
  // During production, this catch block is not used
  // That being said, I should probably put a warning so this doesn't happen silently
  // Since I can't detect the environment, I'm just going to warn every time
  console.warn("Service working failed to pre-cache files ⚠");
}

// See article for reference
// https://whatwebcando.today/articles/handling-service-worker-updates/
// It's super important to have this though so that we can tell the worker to update
// from the browser.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// This is for caching album artwork
// Since it's dynamically generated we can't pre-cache it
// Also pre-caching thousands of images would be a bad idea
workbox.routing.registerRoute(
  /\.(png|jpeg|jpg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // Cache 1000 artwork images since there could be a *lot*
        // We may may to increase this actually since users will eventually download *lots* of
        // small artwork when scrolling down their song list
        maxEntries: 10000,
        maxAgeSeconds: 365 * 24 * 60 * 60, // cache for 30 days
      }),
    ],
  }),
);

// I assumed this was a good idea to cache mp3 files
// But... it actually downloads the entire song
// It would be worth looking into this further
// An LRU cache would be cache
// workbox.routing.registerRoute(
//   ({ url }) => {
//     return url.pathname.endsWith(".mp3");
//   },
//   new workbox.strategies.CacheFirst({
//     cacheName: "music",
//     plugins: [
//       new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
//       new workbox.rangeRequests.RangeRequestsPlugin(),
//     ],
//   }),
// );
