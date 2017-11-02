// Model for message

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    coderef: { type: String, required: true },
    headings: {}, // {fr: 'Titre du message', en: 'message title'}
    contents: {}, // same here as above
    links: [], // [{position: 1, type:'image', url:'http://myimage.com/image.jpeg', description:'test image'},...]
    sender: {
        user_id: ObjectId,
        company: String,
        logo: String,
    },
    status: String, // pending, send, reject, delayed
    validation_send_to: [], // [{email:'useremail', token:'uniq_gen_token'},...]
    validate_by: {
        email: String,
        validate_date: { type: Date},
    },
    deliver_date: { type: Date, default: Date.now},
    create_date: { type: Date, default: Date.now },  
});

module.exports = mongoose.model('message', messageSchema);
