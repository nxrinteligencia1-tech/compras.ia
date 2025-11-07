const CACHE_NAME = 'compras-ia-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  'https://cdn.tailwindcss.com'
];

// Instala o Service Worker e armazena os arquivos do app shell em cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Ativa o Service Worker e limpa caches antigos.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Intercepta as requisições de rede.
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Estratégia: Cache, caindo para a rede (Cache first, then network)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Se o recurso estiver no cache, retorna-o.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se não, busca na rede.
        return fetch(event.request).then(
          networkResponse => {
            // Se a requisição for bem-sucedida, clona e armazena no cache.
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            // Retorna a resposta da rede.
            return networkResponse;
          }
        ).catch(error => {
            console.error('Falha na busca pela rede e item não está no cache.', error);
            // Opcional: Retornar uma página offline de fallback aqui.
        });
      })
  );
});
