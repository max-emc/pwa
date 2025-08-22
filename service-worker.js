self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("mon-cache").then(cache => {
      return cache.addAll([
        "index.html",
        "manifest.json",
        "icon-192.png",
        "icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

git init
git add .
git commit -m "Première version de ma PWA"

git remote add origin https://github.com/max-emc/pwa.git
git branch -M main
git push -u origin main
