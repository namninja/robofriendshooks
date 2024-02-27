// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDoUqGAfBBuuqqpIjyfLQT8MfB4PXD9Nh8",
//   authDomain: "iterablecoffee.firebaseapp.com",
//   projectId: "iterablecoffee",
//   storageBucket: "iterablecoffee.appspot.com",
//   messagingSenderId: "675775245867",
//   appId: "1:675775245867:web:f60af66014be13cdbb846e",
//   measurementId: "G-V8ECK15MKB"
// };
const firebaseConfig = {
  apiKey: "AIzaSyA6RiOyGxu5MjFoeHtJ6cAFID8GjnBFAk0",
  authDomain: "iterablecoffee.firebaseapp.com",
  projectId: "iterablecoffee",
  storageBucket: "iterablecoffee.appspot.com",
  messagingSenderId: "675775245867",
  appId: "1:675775245867:web:c6b7690a148b297abb846e",
  measurementId: "G-NTD9MQNCE8"
};
// let apiKey = "7b84bb10d87c4be69656670f2e8b5479"
// let userEmail = "nam.ngo+digitest@iterable.com"

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// export const fetchToken = (setTokenFound) => {
//   return getToken(messaging, { vapidKey: 'BFDo_pQlZx6E4rm81Cb0l399lEM63gS0nSgeIECKyBUUnh9kQQEXgTm8XfXqZuia51Plc1dz1aRRxjZCIPFV0mc' }).then((currentToken) => {
//     if (currentToken) {
//       console.log('current token for client: ', currentToken);
//       setTokenFound(true);
//       // Track the token -> client mapping, by sending to backend server
//       // show on the UI that permission is secured
//       var myHeaders = new Headers();
//       myHeaders.append("api_key", apiKey);
//       myHeaders.append("Content-Type", "application/json");

//       var raw = JSON.stringify({
//         "email": userEmail,
//         "browserToken": currentToken
//       });

//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//       };

//       fetch("https://api.iterable.com/api/users/registerBrowserToken", requestOptions)
//         .then(response => response.text())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));

//         var dataFields = JSON.stringify({
//           "email": userEmail,
//           "eventName": "WebPush Browser Token Received",
//           dataFields: {
//             "browserToken": currentToken
//           }
//         });
//         var eventRequestOptions = {
//           method: 'POST',
//           headers: myHeaders,
//           body: dataFields,
//           redirect: 'follow'
//         };
//         fetch("https://api.iterable.com/api/events/track", eventRequestOptions)
//         .then(response => response.text())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));
      
//     } else {
//       console.log('No registration token available. Request permission to generate one.');
//       setTokenFound(false);
//       // shows on the UI that permission is required 
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // catch error while creating client token
//   });
// }

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log("onMessageListener resolved")
//       console.log("the payload ", payload)
//       resolve(payload);
//     });
//   });

let apiKey = "7b84bb10d87c4be69656670f2e8b5479";
let ss_apiKey = "fc87af3bba4b44ff8a53680bd7a1b5b3"
// let apiKey = "ff5502e639a94001bbff68b962c28616";
// let ss_apiKey = "0172dd49a26c4a158837337ab17d3dbf"
let userEmail = "nam.ngo+digitest@iterable.com";
//let userId = "95f7d936cdadd3a450325375d80552d63de51907643466f05d08e10ec1ec539f"
let messageTypeId = "115895"
let didSubscribe = false
let didUnsubscribe = false
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = async (setTokenFound) => {
  try {
    // Check notification permission when the page loads
    console.log('Initial notification permission:', Notification.permission);

    // Request notification permission and handle incoming messages
    const permission = await Notification.requestPermission();
    console.log('Updated notification permission:', permission);

    if (permission === 'granted') {
      // Permission is granted, proceed with token fetching
      if (!didSubscribe) {
        didSubscribe = true
        const subHeaders = new Headers();
        subHeaders.append("api_key", ss_apiKey);
        subHeaders.append("Content-Type", "application/json");
        var subRequestOptions = {
          method: 'PATCH',
          headers: subHeaders,
          redirect: 'follow'
        };
        
        fetch("/api/subscriptions/messageType/" + messageTypeId + "/user/" + userEmail, subRequestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
          
      }

      
      const currentToken = await getToken(messaging, { vapidKey: 'BFDo_pQlZx6E4rm81Cb0l399lEM63gS0nSgeIECKyBUUnh9kQQEXgTm8XfXqZuia51Plc1dz1aRRxjZCIPFV0mc' });

      if (currentToken) {
        console.log(currentToken)
        const myHeaders = new Headers();
        myHeaders.append("api_key", apiKey);
        myHeaders.append("Content-Type", "application/json");
        
        var userRaw = JSON.stringify({
          "email": userEmail,
          "dataFields": {
            "robotfriends": currentToken
          }
        });
        
        var userRequestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: userRaw,
          redirect: 'follow'
        };
        
        fetch("https://api.iterable.com/api/users/update", userRequestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));


        
        const raw = JSON.stringify({
          "email": userEmail,
            "browserToken": currentToken
        });

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        // Asynchronously set the new or current token
        const registerResponse = await fetch("https://api.iterable.com/api/users/registerBrowserToken", requestOptions);
        const registerResult = await registerResponse.text();
        console.log(registerResult);

        setTokenFound(true);
      } else {
        console.log('No registration token available. Request permission to generate one.');
        setTokenFound(false);
      }
    } else {
      console.log('Notification permission denied.');
      if (!didUnsubscribe) {
      const unsubHeaders = new Headers();
      unsubHeaders.append("api_key", ss_apiKey);
      unsubHeaders.append("Content-Type", "application/json");
      var unsubRequestOptions = {
        method: 'DELETE',
        headers: unsubHeaders,
        redirect: 'follow'
      };
      
      fetch("https://api.iterable.com/api/subscriptions/messageType/" + messageTypeId + "/user/" + userEmail, unsubRequestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      setTokenFound(false);
      didUnsubscribe = true
    }
    }
  } catch (err) {
    console.log('An error occurred while retrieving or updating token. ', err);
    setTokenFound(false);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("onMessageListener resolved");
      console.log("the payload ", payload);
      resolve(payload);
    });
  });
