/* Come Home to Each Other - shows the "new words on the bridge" notification */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (err) {}
  e.waitUntil(Promise.all([
    self.registration.showNotification(d.title || 'Come Home to Each Other', {
      body: d.body || 'New words are on the bridge',
      icon: 'icon-192.png', badge: 'icon-192.png',
      tag: 'chte', renotify: true,
      data: { url: d.url || './' }
    }),
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => list.forEach(c => c.postMessage('chte-pull')))
  ]));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
