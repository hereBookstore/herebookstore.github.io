// --- 缓存配置 ---
const CACHE_NAME = "one2ten-cache-v9";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/banner.css",
  "/base.css",
  "/footer.css",
  "/header.css",
  "/modules.css",
  "/services.css",
  "/scripts.js",
  "/manifest.json",
  "/favicon.ico",
];

// --- 安装阶段：预缓存关键资源 ---
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
});

// --- 激活阶段：清除旧缓存并接管控制权 ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// --- 拦截请求：采用缓存优先策略 ---
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
