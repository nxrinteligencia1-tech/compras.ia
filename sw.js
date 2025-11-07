const CACHE_NAME = 'compras-ia-cache-v2'; // Versão do cache atualizada
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/Header.tsx',
  '/components/ListaDeCompras.tsx',
  '/components/ItemDaLista.tsx',
  '/components/AdicionarItemForm.tsx',
  '/components/BotaoInstalar.tsx',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/'
];

// Instala o Service Worker e armazena os arquivos do app shell em cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e salvando arquivos essenciais.');
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
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
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

        // Se não, busca na rede, clona e armazena no cache.
        return fetch(event.request).then(
          networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(error => {
            console.error('Falha na busca pela rede e item não está no cache.', error);
            // Opcional: Retornar uma página offline de fallback aqui.
        });
      })
  );
});
