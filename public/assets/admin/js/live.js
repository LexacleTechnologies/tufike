/*if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register(appUrl + '/sw.js')
        .then(reg => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err));
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});
navigator.serviceWorker.ready.then(function(swRegistration) {
    return swRegistration.sync.register('tufikeSync');
}); */