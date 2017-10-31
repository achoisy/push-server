const firebase = require('firebase-admin');

const serviceAccount = require('../config/firebase-adminsdk');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://notification-dad22.firebaseio.com',
});


exports.sendMessage = (topic, payload, callback) => {
  // Send message
};
