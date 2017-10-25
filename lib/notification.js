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

class NotifiClass {
  constructor({ content, heading, data, imageUrl }, userId) {
    const appId = config.get('Onsignal.APP_ID'); // Set App_id
    this.message.creator_id = userId;
    this.message.app_id = appId;
    this.message.contents = { fr: content };
    this.message.headings = { fr: heading };
    this.message.data = data;
    this.message.ios_attachments = { id1: imageUrl };
    this.message.big_picture = imageUrl;
    this.message.buttons = [{ id: 'share_1', text: 'Partager', icon: 'ic_menu_share' }];
  }
  savePush() {
    const {
      creator_id,
      app_id,
      contents,
      headings,
      data,
      ios_attachments,}
    const push = new Push({

    });
  }
  updatePush() {

  }
  sendByFilter(filtersArray, callback = null) {
    const message = {
      ...this.message,
      filters: filtersArray,
    };

    axios.post(url, message)
    .then((res) => {

    })
    .catch((err) => {

    });
  }
}
