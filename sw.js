const CACHE_NAME = 'compras-ia-cache-v3'; // Versão do cache incrementada para forçar atualização
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
        // Adiciona todos os arquivos essenciais do app.
        // URLs externas como CDNs serão cacheadas dinamicamente no evento 'fetch'.
        return cache.addAll(APP_SHELL_URLS);
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
  // Ignora requisições que não são GET ou são de extensões do chrome.
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Estratégia: Cache, e se falhar, busca na rede (Cache falling back to network)
  // Para recursos do app, isso os torna offline.
  // Para recursos externos (CDNs), isso os armazena em cache após o primeiro download.
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
            // Verifica se a resposta é válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
              return networkResponse;
            }

            // Clona a resposta para poder armazená-la no cache e retorná-la ao navegador.
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          }
        ).catch(error => {
            console.error('Falha na busca pela rede e o item não está no cache:', error);
            // Opcional: Retornar uma página offline de fallback aqui.
        });
      })
  );
});
