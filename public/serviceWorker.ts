/* eslint-disable no-restricted-globals */
self.addEventListener('install', (event: any) => {
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil((self as any).clients.claim());
});

self.addEventListener('fetch', (event: any) => {
  event.waitUntil(Promise.resolve());
});
