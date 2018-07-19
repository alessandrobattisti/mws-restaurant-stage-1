const cache_name = 'site_cache';
const urls = [
  '/',
  '/data/restaurants.json',
  '/js/reg.js',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(cache_name)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urls);
      })
  );
});

/* based on:
https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
*/
self.addEventListener('fetch', event => {
  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function() {
    // Try to get the response from a cache.
    const cachedResponse = await caches.match(event.request).catch(function(err){console.log(err)});
    // Return it if we found one.
    if (cachedResponse) return cachedResponse;
    // If we didn't find a match in the cache, use the network and save to cache.
    return caches.open(cache_name).then(function(cache){
      response = fetch(event.request).then(function(response){
        cache.put(event.request, response.clone());
        return response;}).catch(function(err){console.log(event.request, 'network error')});
        return response;
    })
  }());
});
