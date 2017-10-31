// Model for message

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    headings: {}, // {fr: 'Titre du message', en: 'message title'}
    contents: {}, // same here as above
    links: [], // [{position: 1, type:'image', url:'http://myimage.com/image.jpeg', description:'test image'},...]
    sender: {
        user_id: ObjectId,
        company: String,
        logo: String,
        codepostal: String,
    },
    deliver_date: { type: Date, default: Date.now},
    create_date: { type: Date, default: Date.now },  
});

module.exports = mongoose.model('message', messageSchema);
