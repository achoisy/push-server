const firebase = require('firebase-admin');

const serviceAccount = require('../config/firebase-adminsdk');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://notification-dad22.firebaseio.com',
});


exports.sendMessage = (topic, payload, callback) => {
  // Send a message to devices subscribed to the provided topic.
  // topic = string, payload = { data:{} }
  firebase.messaging().sendToTopic(topic, payload)
    .then((response) => {
      callback(null, response);
    })
    .catch((error) => {
      callback(error, null);
    });
};
