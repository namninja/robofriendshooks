// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDoUqGAfBBuuqqpIjyfLQT8MfB4PXD9Nh8",
    authDomain: "iterablecoffee.firebaseapp.com",
    projectId: "iterablecoffee",
    storageBucket: "iterablecoffee.appspot.com",
    messagingSenderId: "675775245867",
    appId: "1:675775245867:web:f60af66014be13cdbb846e",
    measurementId: "G-V8ECK15MKB"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', JSON.stringify(payload));

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "https://avatars.githubusercontent.com/u/5148773?s=50&v=4",
    actions: [
        {
            action: payload.fcmOptions.link || "https://www.reiterablecoffee.com/"
        }
    ]
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});