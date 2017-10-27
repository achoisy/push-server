/*
notification class
Constructor arguments: ({content, heading, data, imageUrl} ,userId )
Methods:
  savePush(callback)
  findPushById(id, callback)
  sendByFilter(filtersArray, callback)
*/
const config = require('config');
const Axios = require('axios');

const Push = require('../models/notification');

const baseURL = config.get('Onsignal.baseURL');
const apiKey = config.get('Onsignal.ONESIGNAL_REST_API_KEY');
const url = config.get('Onsignal.url');
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  Authorization: `Basic ${apiKey}`,
};
const axios = Axios.create({
  baseURL,
  headers,
});

class PushClass {
  constructor({
    content,
    heading,
    data,
    imageUrl,
  }, userId) {
    this.notification.app_id = config.get('Onsignal.APP_ID'); // Set App_id
    this.notification.contents = { fr: content };
    this.notification.headings = { fr: heading };
    this.notification.data = data;
    this.notification.ios_attachments = { id1: imageUrl };
    this.notification.big_picture = imageUrl;
    this.notification.buttons = [{ id: 'share_1', text: 'Partager', icon: 'ic_menu_share' }];
    this.notif_status = '';
    this.creator_id = userId;
  }

  savePush(callback) {
    const pushMessage = {
      notification: this.notification,
      creator_id: this.creator_id,
      notif_status: this.notif_status,
    };
    const push = new Push(pushMessage);
    push.save()
      .then((pushObject) => {
        callback(null, pushObject);
      })
      .catch((err) => {
        callback({ error: err }, null);
      });
  }

  findPushById(id, callback) {
    Push.findById(id, (err, pushObject) => {
      if (err) { return callback(err, null); }

      if (pushObject) {
        this.notification = pushObject.notification;
        this.creator_id = pushObject.creator_id;
        this.notif_status = pushObject.notif_status;
      }
      return callback(null, pushObject);
    });
  }

  sendByFilter(filtersArray, callback) {
    this.notification.filters = filtersArray;

    axios.post(url, this.notification)
      .then((res) => {
        if (res.status === 400) { return callback(res.error, null); }

        this.notif_status = res.data;
        return this.savePush((err, pushObject) => {
          if (err) { return callback(err, null); }

          return callback(null, pushObject);
        });
      })
      .catch((err) => {
        callback(err, null);
      });
  }
}

module.exports = PushClass;
