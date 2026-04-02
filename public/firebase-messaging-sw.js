importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAxvIUYzDHnh0qA7Tr9JZvuiRslvbi9Ruk",
  authDomain: "lost-and-found-8c75c.firebaseapp.com",
  projectId: "lost-and-found-8c75c",
  storageBucket: "lost-and-found-8c75c.firebasestorage.app",
  messagingSenderId: "249983120157",
  appId: "1:249983120157:web:f73a9a975404c52e1727f4",
  measurementId: "G-2WQTGFJX2E"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
