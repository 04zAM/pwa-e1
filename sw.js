;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_pwa-e1_dashboard',
    urlsToCache = [
        './',
        './assets/js/core/jquery.min.js',
        './assets/js/core/popper.min.js',
        './assets/js/core/bootstrap.min.js',
        './assets/js/plugins/perfect-scrollbar.jquery.min.js',
        'https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE',
        './assets/js/plugins/chartjs.min.js',
        './assets/js/plugins/bootstrap-notify.js',
        './assets/js/now-ui-dashboard.min.js?v=1.5.0',
        './assets/img/apple-icon.png',
        './assets/img/favicon.png',
        'https://fonts.googleapis.com/css?family=Montserrat:400,700,200',
        'https://use.fontawesome.com/releases/v5.7.1/css/all.css',
        './assets/css/bootstrap.min.css',
        './assets/css/now-ui-dashboard.css?v=1.5.0',
        './assets/demo/demo.js',
        './assets/demo/demo.css',
        './assets/js/script.js'
    ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache)
                .then(() => self.skipWaiting())
        })
        .catch(err => console.log('Falló registro de cache', err))
    )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    //Eliminamos lo que ya no se necesita en cache
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
        // Le indica al SW activar el cache actual
        .then(() => self.clients.claim())
    )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
    //Responder ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if (res) {
                //recuperar del cache
                return res
            }
            //recuperar de la petición a la url
            return fetch(e.request)
        })
        .catch(err => console.log('Falló fetch de la url', err))
    )
})

self.addEventListener('push', function(event) {
    console.log(event.data.text());
});