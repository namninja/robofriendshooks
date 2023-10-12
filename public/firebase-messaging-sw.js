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


// Create a new custom push class
class CustomPushEvent extends Event {
  constructor(data) {
    super('push');
    Object.assign(this, data);
    this.custom = true;
  }
}
// This event listener obtains the notification with payload from API and converts it to a Data Message so that it can be used with onBackgroundMessage and prevent duplication
self.addEventListener('push', (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;
  // Kep old event data to override
  const oldData = e.data;
  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });
  // Stop event propagation
  e.stopImmediatePropagation();
  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});
// Retrieve firebase messaging


// display background push message
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  
  console.log('[firebase-messaging-sw.js] Received background message ', payload); // debug info
  console.log(payload)
  const { title, body, icon, ...restPayload } = payload.data;
  const notificationOptions = {
    body,
    icon: icon || '/icons/firebase-logo.png', // path to your "fallback" firebase notification logo
    data: restPayload,
  };
  return self.registration.showNotification(title, notificationOptions);
});

// This Event Listener listens for a notificationclick, specifically, when a user clicks on the background web push
  
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] notificationclick ', event); // debug info
  console.log(event);
 // must close the notification
 event.notification.close();
  let url = "http://localhost:3000" // set defaul root domain of website

  // check to see if event payload contains click_action URL for redirect
  if (event.notification.data && event.notification.data.click_action) {
    url = event.notification.data.click_action
  }
  console.log(url)
 
  // create a URL object to access root domain of click_action URL
  let destinationUrl = new URL(url)
  // build root domain so that the format matches what is pulled from the browser
  let originalUrl = destinationUrl.origin + destinationUrl.pathname
  console.log(originalUrl)

  // Filter through the browser tabs and identify the URL where the Push originated and bring it back into focus, instead of opening a new tab
  event.waitUntil(
    clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url == originalUrl) {
          return client.focus().then(function (client) {
            //Service Workers do not have access to DOM Elements, so we must send a Post Message.  There must be a corresponding listener in the App code to retrieve this message
            client.postMessage({
              action: 'redirect-from-notificationclick',
              url: url,
            });
          })
        }
        // If not, then open the target URL in a new window/tab.
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }
    }));
})



//2nd try
  // event.notification.close();
  //   //click_action described at https://github.com/BrunoS3D/firebase-messaging-sw.js#click-action
  //   if (event.notification.data && event.notification.data.click_action) {
  //   console.log("hereI am")
  //   self.clients.openWindow(event.notification.data.click_action);
  //   } else {
  //     self.clients.openWindow(event.currentTarget.origin);
  //   }

//Original
// // Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//     apiKey: "AIzaSyDoUqGAfBBuuqqpIjyfLQT8MfB4PXD9Nh8",
//     authDomain: "iterablecoffee.firebaseapp.com",
//     projectId: "iterablecoffee",
//     storageBucket: "iterablecoffee.appspot.com",
//     messagingSenderId: "675775245867",
//     appId: "1:675775245867:web:f60af66014be13cdbb846e",
//     measurementId: "G-V8ECK15MKB"
// };

// firebase.initializeApp(firebaseConfig);


// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', JSON.stringify(payload));
//   console.log(payload)
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     //icon: payload.notification.icon || "https://avatars.githubusercontent.com/u/5148773?s=50&v=4",
//     //icon: payload.data.icon,
//     // actions: [
//     //     {
//     //         action: payload.fcmOptions.link || "https://www.reiterablecoffee.com/"
//     //     }
//     // ]
//     action: "https://www.reiterablecoffee.com/"
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
