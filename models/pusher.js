const mongoose = require('mongoose');

const pusherSchema = new mongoose.Schema({
    pusher_name: String,
    description: String,
    logo: String,
    suggestion: Boolean,
    follow: Boolean,
    main_email: { type: String, lowercase: true },
    validation_emails: [],
    timezone: String,
    visible_by: String,  // None, All, 30, 971, 75010
    profil: {
        contact_email: String,
        telephone: {},
        web: String,
        facebook: String,
        twitter: String,
        instagram: String,
    },
    address: {
        addressLine1: String,
        addressLine2: String,
        codepostal: Number,
        ville: String,
        state: String,
        pays: String,
        countryCode: String,
    },
    create_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pusher', pusherSchema);