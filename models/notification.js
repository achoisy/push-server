const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const notifSchema = new mongoose.Schema({
  app_id: { type: String, required: true },
  cont_lang: Object, // https://documentation.onesignal.com/reference#section-content-language
  attachments: Object, // https://documentation.onesignal.com/reference#section-attachments
  action_buttons: Object, // https:documentation.onesignal.com/reference#section-action-buttons
  apearance: Object, // https://documentation.onesignal.com/reference#section-appearance
  delivery: Object, // https://documentation.onesignal.com/reference#section-delivery
  group_collaps: Object, // https://documentation.onesignal.com/reference#section-grouping-collapsing
  deliver_to_platform: Object, // https://documentation.onesignal.com/reference#section-platform-to-deliver-to
  notif_status: {}, // set state of a notification: created, pending, send, delay
  creator_id: ObjectId,
  create_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('notification', notifSchema);
