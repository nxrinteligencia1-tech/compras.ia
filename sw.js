const CACHE_NAME = 'compras-ia-cache-v4';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/Header.tsx',
  '/components/ListaDeCompras.tsx',
  '/components/ItemDaLista.tsx',
  '/components/AdicionarItemForm.tsx'
];

// Instala o Service Worker e armazena os arquivos do app shell em cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e salvando arquivos do App Shell.');
        return cache.addAll(APP_SHELL_URLS);
      })
  );
});

// Ativa o Service Worker e limpa caches antigos.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta as requisições com a estratégia "Stale-While-Revalidate".
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET ou são de extensões do chrome.
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Busca na rede em segundo plano para atualizar o cache.
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Se a busca for bem-sucedida, atualiza o cache.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Retorna a resposta do cache imediatamente se existir, caso contrário, espera a resposta da rede.
        // Isso torna o aplicativo rápido (carrega do cache) e atualizado (busca atualizações em segundo plano).
        return cachedResponse || fetchPromise;
      });
    })
  );
});
