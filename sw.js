const cache_name = 'site_cache';
/* based on:
https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
*/
self.addEventListener('fetch', event => {
  // Prevent the default, and handle the request ourselves.
  if(!event.request.url.startsWith('chrome-extension')){
    event.respondWith(async function() {
      // Try to get the response from a cache.
      const cachedResponse = await caches.match(event.request).catch(function(err){console.log(err)});
      // Return it if we found one.
      if (cachedResponse) return cachedResponse;
      // If we didn't find a match in the cache, use the network and save to cache.
      return caches.open(cache_name).then(function(cache){
        return fetch(event.request)
          .then(function(response){
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(function(err){
            console.log('network error');
          });
      })
    }());
  }
});
