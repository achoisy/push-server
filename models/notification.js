const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const notifSchema = new mongoose.Schema({
  notification: {
    app_id: { type: String, required: true },
    contents: {},
    headings: {},
    data: {},
    ios_attachments: {},
    big_picture: {},
    buttons: {},
    filters: [],
  },
  notif_status: {}, // set state of a notification: created, pending, send, delay
  creator_id: mongoose.Schema.Types.ObjectId,
  create_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('notification', notifSchema);
