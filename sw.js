const CACHE_NAME = 'calendar-app-v1.0.0';
const STATIC_CACHE_NAME = 'calendar-static-v1.0.0';

// キャッシュするリソース
const STATIC_RESOURCES = [
    './',
    './calendar-card.html',
    './manifest.json'
];

// CDNリソース
const CDN_RESOURCES = [
    'https://unpkg.com/react@18/umd/react.development.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Comfortaa:wght@300;400;500;600;700&family=Varela+Round&display=swap'
];

// Service Worker インストール
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker');
    
    event.waitUntil(
        Promise.all([
            // 静的リソースのキャッシュ
            caches.open(STATIC_CACHE_NAME).then(cache => {
                console.log('[SW] Caching static resources');
                return cache.addAll(STATIC_RESOURCES);
            }),
            // CDNリソースのキャッシュ
            caches.open(CACHE_NAME).then(cache => {
                console.log('[SW] Caching CDN resources');
                return Promise.allSettled(
                    CDN_RESOURCES.map(url => 
                        cache.add(url).catch(err => {
                            console.warn('[SW] Failed to cache:', url, err);
                        })
                    )
                );
            })
        ]).then(() => {
            console.log('[SW] Installation completed');
            // 新しいService Workerを即座にアクティブ化
            return self.skipWaiting();
        })
    );
});

// Service Worker アクティベーション
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // 古いキャッシュを削除
                    if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Activation completed');
            // 全てのクライアントを制御下に置く
            return self.clients.claim();
        })
    );
});

// リクエストのインターセプト
self.addEventListener('fetch', event => {
    // HTMLファイルとstatic resources: Cache First戦略
    if (event.request.url.includes('.html') || 
        event.request.url.includes('manifest.json') ||
        event.request.url === self.registration.scope) {
        
        event.respondWith(
            caches.match(event.request).then(response => {
                if (response) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return response;
                }
                
                console.log('[SW] Fetching from network:', event.request.url);
                return fetch(event.request).then(response => {
                    // 成功したレスポンスをキャッシュに保存
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(STATIC_CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                }).catch(() => {
                    // オフライン時のフォールバック
                    return new Response(
                        '<h1>オフラインです</h1><p>インターネット接続を確認してください。</p>',
                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                    );
                });
            })
        );
        return;
    }
    
    // CDNリソース: Stale While Revalidate戦略
    if (event.request.url.startsWith('https://')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        // 成功した場合はキャッシュを更新
                        if (networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // ネットワークエラー時はキャッシュを返す
                        return cachedResponse;
                    });
                    
                    // キャッシュがあればそれを返し、バックグラウンドで更新
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }
    
    // その他のリクエストはそのまま通す
    event.respondWith(fetch(event.request));
});

// オフライン/オンライン状態の変化を監視
self.addEventListener('message', event => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME,
            cached: true
        });
    }
});

// バックグラウンド同期（将来の拡張用）
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('[SW] Background sync triggered');
        // 将来的にデータ同期機能を追加可能
    }
});

console.log('[SW] Service Worker script loaded');