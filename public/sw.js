const staticCacheName = 'tufike';
const assets = [
    '/',
    '/riders',
    '/drivers',
    '/vehicles',
    '/rides',
    '/distress',
    '/transactions',
    '/support',
    '/packages',
    '/notifications',
    '/promotions',
    '/points',
    '/profile',
    '/users',
    '/assets/admin/css/material-dashboard.css',
    '/assets/admin/plugins/nprogress/nprogress.css',
    '/assets/admin/plugins/animate.css/animate.min.css',
    '/assets/admin/plugins/magnific-popup/magnific-popup.css',
    '/assets/admin/plugins/owl.carousel/assets/owl.carousel.min.css',
    '/assets/admin/plugins/owl.carousel/assets/owl.theme.default.min.css',
    '/assets/admin/plugins/datatables/datatables.min.css',
    '/assets/admin/plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css',
    '/assets/admin/plugins/nouislider/nouislider.min.css',
    '/assets/admin/plugins/select2/css/select2.css',
    '/assets/admin/plugins/lightg/css/lightgallery.css',
    '/assets/admin/plugins/sweetalert2/dist/sweetalert2.css',
    '/assets/admin/css/chat-dark.min.css',
    '/assets/admin/css/icons.css',
    '/assets/admin/css/app.css',
    '/assets/admin/js/core/jquery.min.js',
    '/assets/admin/js/socket.io.js',
    '/assets/admin/js/core/popper.min.js',
    '/assets/admin/js/core/bootstrap-material-design.min.js',
    '/assets/admin/js/plugins/chartist.min.js',
    '/assets/admin/js/plugins/bootstrap-notify.js',
    '/assets/admin/plugins/datatables/datatables.min.js',
    '/assets/admin/plugins/select2/js/select2.min.js',
    '/assets/admin/plugins/momentjs/moment.js',
    '/assets/admin/plugins/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js',
    '/assets/admin/plugins/nouislider/nouislider.js',
    '/assets/admin/plugins/lightg/js/lightgallery-all.min.js',
    '/assets/admin/js/material-dashboard.js',
    '/assets/admin/plugins/nprogress/nprogress.js',
    '/assets/admin/plugins/node-waves/waves.min.js',
    '/assets/admin/plugins/magnific-popup/jquery.magnific-popup.min.js',
    '/assets/admin/plugins/owl.carousel/owl.carousel.min.js',
    '/assets/admin/plugins/sweetalert2/dist/sweetalert2.min.js',
    '/assets/admin/demo/demo.js',
    '/assets/admin/js/app.js',
    '/assets/admin/fonts/MaterialIcons-Regular.eot',
    '/assets/admin/fonts/MaterialIcons-Regular.woff2',
    '/assets/admin/fonts/MaterialIcons-Regular.woff',
    '/assets/admin/fonts/MaterialIcons-Regular.ttf',
    '/assets/admin/fonts/Framework7Icons-Regular.eot',
    '/assets/admin/fonts/Framework7Icons-Regular.woff2',
    '/assets/admin/fonts/Framework7Icons-Regular.woff',
    '/assets/admin/fonts/Framework7Icons-Regular.ttf',
    '/assets/admin/img/logos/apple-touch-icon-180x180.png',
    '/assets/admin/img/logos/favicon-32x32.png',
    '/assets/admin/img/icons/crown.svg',
];
// install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});
// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});
// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});

self.addEventListener('sync', function(event) {
    if (event.tag == 'lexaSync') {
        event.waitUntil(console.log('Background Syncing'));
    }
});