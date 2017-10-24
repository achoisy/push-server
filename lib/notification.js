const config = require('config');
const Notification = require('../models/notification.js');

class NotifiClass {
  constructor(options) {
    const appId = config.get('Onsignal.APP_ID'); // Set App_id

    this.app_i = appId;
    this.cont_lang = {
      contents: { fr: options.content },
      headings: { fr: options.heading },
    };
    this.attachments = {
      data: options.data,
      ios_attachments: { id1: options.imageUrl },
      big_picture: options.imageUrl,
    };
    this.action_buttons = {
      buttons: [{ id: 'share_1', text: 'Partager', icon: 'ic_menu_share' }],
    };
  }
}
