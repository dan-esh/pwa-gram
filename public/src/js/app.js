
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification(){
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'Welcome to our Notification service!',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US',// BCP47
      vibrate: [100, 50, 200],// format: vibration(ms), pause, vibration(ms), pause
      badge: '/src/images/icons/app-icon-96x96.png',// android badges
      tag: 'confirm-notification',
      renotify: true,// vibration for every new notification
      actions: [
        { action: 'confirm', title: 'OK', icon: '/src/images/icons/app-icon-96x96.png' },
        { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' }
      ]
    };
    navigator.serviceWorker.ready
      .then(function(swReg){
        swReg.showNotification('Successfully subscribed!', options);
      });
  }
  // var options = {
  //   body: 'Welcome to our Notification service!'
  // };
  // new Notification('Successfully subscribed!', options);
}

function configurePushSubscription(){
  if (!('serviceWorker' in navigator)){
    return;
  } 
  var reg;
  navigator.serviceWorker.ready
    .then(function(swReg){
      reg = swReg;
      return swReg.pushManager.getSubscription();
    }).then(function(sub){
      if(sub === null) {
        // Create a new subscription
        var vapidPublicKey = 'BBE51ugQ3s4NEtXZFKpiFoIS5qMAJzREaJJaD_7_MJ9juMiaqEQylJUGiB2jUOVeQxfsrZpUhHfG-7kvRytL798';
        var convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      } else {
        // We have an existing subscription
        // we tell the backend?
      }
    })
    .then(function(newSub){
      return fetch('https://pwagram-3506a.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then(function(res){
      if (res.ok) {
        displayConfirmNotification();
      }
    })
    .catch(function(err){
      console.log(err);
    });
}

// note: asking for notification permission implicitly grants push permission
function askForNotificationPermission(){
  Notification.requestPermission(function(result){
    console.log('User Choice: ', result);
    if(result !== 'granted') {
      console.log('Permission for notification not granted!');
    } else {
      // Hide button the button once we get an answer
      configurePushSubscription();
      //displayConfirmNotification();
    }
  });
}

if('Notification' in window && 'serviceWorker' in navigator) {
  for (var i=0;i<enableNotificationsButtons.length;i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}