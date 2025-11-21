// service-worker.js
const CACHE_NAME = 'todo-list-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    // Adicione os ícones aqui se você os criou
    // '/icon-192.png', 
    // '/icon-512.png'
];

// 1. Instalação: Armazena todos os arquivos essenciais em cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Busca: Intercepta requisições e serve do cache se estiver disponível
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - retorna a resposta do cache
                if (response) {
                    return response;
                }
                // Nenhum item em cache, faz a requisição normal (para Web Service, etc.)
                return fetch(event.request);
            })
    );
});

// 3. Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});