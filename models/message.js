// Model for message

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  coderef: {
    type: String,
    required: true,
  },
  headings: {}, // {fr: 'Titre du message', en: 'message title'}
  contents: {}, // same here as above
  links: [], // [{ type:'youtube', url:'http://myimage.com/youtubelink'},...]
  images: [], // [{ filename: "hdvruxqo", url: "https://res.cloudinary.com/hdvruxqoou.jpg"}]
  sender: {
    user_id: mongoose.Schema.Types.ObjectId,
    company: String,
    logo: String,
  },
  status: String, // pending, sending, sended, reject, delayed
  couchdb: {},
  notification: {},
  validation_send_to: [], // [{email:'useremail', token:'uniq_gen_token'},...]
  validate_by: {
    email: String,
    validate_date: {
      type: Date,
    },
  },
  deliver_date: {
    type: Date,
    default: Date.now,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('message', messageSchema);
