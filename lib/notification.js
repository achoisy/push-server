
const config = require('config');
const Axios = require('axios');
const Message = require('./message');

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

exports.Push = (messageId, callback) => {
  Message.findById(messageId, (err, {
    coderef,
    contents,
    headings,
    data, // Data pass to app on push click
    imageUrl,
  }) => {
    if (err) {
      callback({ error: err }, null);
    }

    const notification = {
      app_id: config.get('Onsignal.APP_ID'),
      data,
      ios_attachments: { id1: imageUrl },
      big_picture: imageUrl,
      buttons: [{ id: 'share_1', text: 'Partager', icon: 'ic_menu_share' }],
      contents: {
        en: contents.fr,
      },
      headings: {
        en: headings.fr,
      },
      filters: [
        {
          field: 'tag',
          key: coderef,
          relation: 'exists',
        },
      ],
    };

    axios.post(url, notification)
      .then((res) => {
        if (res.errors) { return callback(res.errors, null); }

        Message.updateMessageStatus(messageId, 'Message envoye');
        Message.updateMessageNotification(messageId, res.data);
        return callback(null, res);
      })
      .catch((err1) => {
        callback(err1, null);
      });
  });
};
