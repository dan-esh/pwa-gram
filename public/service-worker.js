importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');
importScripts('workbox-sw.prod.v2.1.3.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'google-fonts',
  cacheExpiration: {
    maxEntries: 3,
    maxAgeSeconds: 60 * 60 * 24 * 30
  }
}));

workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'material-css'
}));

workboxSW.router.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'post-images'
}));

workboxSW.router.registerRoute('https://pwagram-3506a.firebaseio.com/posts.json', function(args){
  return fetch(args.event.request)
  .then(function (res) {
    var clonedRes = res.clone();
    clearAllData('posts')
      .then(function(){
        return clonedRes.json()
      })
      .then(function(data){
        for (var key in data) {
          writeData('posts',data[key]);
        }
      });
    return res;
  })
});

workboxSW.router.registerRoute(function(routeData){
    return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function(args){
  return caches.match(args.event.request)
  .then(function (response) {
    if (response) {
      return response;
    } else {
      return fetch(args.event.request)
        .then(function (res) {
          return caches.open('dynamic')
            .then(function (cache) {
              cache.put(args.event.request.url, res.clone());
              return res;
            })
        })
        .catch(function (err) {
          return caches.match('/offline.html')
            .then(function (res) {
              return res;
            });
        });
    }
  })
});

workboxSW.precache([
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "119c8a04ba71037bf1d95d726d48f8af"
  },
  {
    "url": "manifest.json",
    "revision": "d72c6592955f11957a0375a3a2a9a418"
  },
  {
    "url": "offline.html",
    "revision": "c667534afb57936a6f0dc8b363993d5f"
  },
  {
    "url": "src/css/app.css",
    "revision": "f27b4d5a6a99f7b6ed6d06f6583b73fa"
  },
  {
    "url": "src/css/feed.css",
    "revision": "2b5a0f7e18bf29fb7828eedf81dfc602"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/images/icons/app-icon-144x144.png",
    "revision": "83011e228238e66949f0aa0f28f128ef"
  },
  {
    "url": "src/images/icons/app-icon-192x192.png",
    "revision": "f927cb7f94b4104142dd6e65dcb600c1"
  },
  {
    "url": "src/images/icons/app-icon-256x256.png",
    "revision": "86c18ed2761e15cd082afb9a86f9093d"
  },
  {
    "url": "src/images/icons/app-icon-384x384.png",
    "revision": "fbb29bd136322381cc69165fd094ac41"
  },
  {
    "url": "src/images/icons/app-icon-48x48.png",
    "revision": "45eb5bd6e938c31cb371481b4719eb14"
  },
  {
    "url": "src/images/icons/app-icon-512x512.png",
    "revision": "d42d62ccce4170072b28e4ae03a8d8d6"
  },
  {
    "url": "src/images/icons/app-icon-96x96.png",
    "revision": "56420472b13ab9ea107f3b6046b0a824"
  },
  {
    "url": "src/images/icons/apple-icon-114x114.png",
    "revision": "74061872747d33e4e9f202bdefef8f03"
  },
  {
    "url": "src/images/icons/apple-icon-120x120.png",
    "revision": "abd1cfb1a51ebe8cddbb9ada65cde578"
  },
  {
    "url": "src/images/icons/apple-icon-144x144.png",
    "revision": "b4b4f7ced5a981dcd18cb2dc9c2b215a"
  },
  {
    "url": "src/images/icons/apple-icon-152x152.png",
    "revision": "841f96b69f9f74931d925afb3f64a9c2"
  },
  {
    "url": "src/images/icons/apple-icon-180x180.png",
    "revision": "2e5e6e6f2685236ab6b0c59b0faebab5"
  },
  {
    "url": "src/images/icons/apple-icon-57x57.png",
    "revision": "cc93af251fd66d09b099e90bfc0427a8"
  },
  {
    "url": "src/images/icons/apple-icon-60x60.png",
    "revision": "18b745d372987b94d72febb4d7b3fd70"
  },
  {
    "url": "src/images/icons/apple-icon-72x72.png",
    "revision": "b650bbe358908a2b217a0087011266b5"
  },
  {
    "url": "src/images/icons/apple-icon-76x76.png",
    "revision": "bf10706510089815f7bacee1f438291c"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/images/sf-boat.jpg",
    "revision": "0f282d64b0fb306daf12050e812d6a19"
  },
  {
    "url": "src/js/app.min.js",
    "revision": "cb94625ee4a2468f924f3050874d5c73"
  },
  {
    "url": "src/js/feed.min.js",
    "revision": "1a69738ccc948e5e009ba125cdbcae17"
  },
  {
    "url": "src/js/fetch.min.js",
    "revision": "a026ba6a7091efa99db9e80ae8220a19"
  },
  {
    "url": "src/js/idb.min.js",
    "revision": "525b2810c73987682842ad098fdfcc84"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.min.js",
    "revision": "37da1a68333a79c65219e459e74ea5e0"
  },
  {
    "url": "src/js/utility.min.js",
    "revision": "181fe1ab4a82c2f8fdd35cf34898cf68"
  }
]);

self.addEventListener('sync', function(event){
    console.log('[Service Worker] background sync', event);
    if (event.tag === 'sync-new-post') {
      console.log('[Service Worker] Syncing new Posts');
      event.waitUntil(
        readAllData('sync-posts')
          .then(function(data){
            for (var dt of data) {
              var postData = new FormData();
              postData.append('id', dt.id);
              postData.append('title', dt.title);
              postData.append('location', dt.location);
              postData.append('rawLocationLat', dt.rawLocation.lat);
              postData.append('rawLocationLng', dt.rawLocation.lng);
              postData.append('file', dt.picture, dt.id + '.png');
              fetch('https://us-central1-pwagram-3506a.cloudfunctions.net/storePostData', {
                method: 'POST',
                body: postData
              })
              .then(function(res){
                console.log('Sent data', res);
                if (res.ok) {
                  res.json()
                    .then(function(resData){
                      deleteItemFromData('sync-posts', resData.id);
                    });
                  
                }
              })
              .catch(function(err){
                console.log('Error while sending data', err, {err});
              });
            }
          })
      );
    }  
  });
  
  self.addEventListener('notificationclick', function(event){
    var notification = event.notification;
    var action = event.action;
    console.log(notification);
    
    if(action === 'confirm') {
      console.log('Confirm was chosen');
      notification.close();
    } else {
      console.log(action);
      event.waitUntil(
        clients.matchAll()
          .then(function(cli){
            var client = cli.find(function(c){
              return c.visibilityState === 'visible';
            });
  
            if (client !== undefined){
              client.navigate(notification.data.url);
              client.focus();
            } else {
              clients.openWindow(notification.data.url);
            }
            notification.close();
          })
      );
      
    }
  });
  
  self.addEventListener('notificationclose', function(event){
    console.log('Notification was closed', event);
  });
  
  self.addEventListener('push', function(event){
    console.log('Push notification Rx', event);
  
    var data = {
      title: 'New!', 
      content:'Dummy content',
      openUrl: '/'
    };
    if (event.data) {
      data = JSON.parse(event.data.text());
    }
  
    var options = {
      body: data.content,
      icon: '/src/images/icons/app-icon-96x96.png',
      badge: '/src/images/icons/app-icon-96x96.png',
      data: {
        url: data.openUrl 
      }
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });