// Message Lib for connection to mongodb database and couchDb
const async = require('async');
const Message = require('../models/message');
const tokenGen = require('../services/tokenGenerator');
const Email = require('../services/email');


exports.addMessage = ({ headings, contents, links, deliver_date = Date.now }, user, callback) => {
    const message = new Message({
        coderef: user.coderef,
        headings,
        contents,
        links,
        validation_send_to : user.validation_emails.map((email) => {
            return { email, token: tokenGen(email) };
        }),
        sender: {
            user_id: user._id,
            company: user.company,
            logo: user.logo,
        },
        status: 'pending',
        deliver_date,
    });
    
    message.save()
    .then((message) => {
        // send validation email with token and save in message database.
        async.each(message.validation_send_to, (emailObj, callback) =>{
            const validation_url = `https://maville.me/validatemessage/${message.id}/${emailObj.token}`;
            Email.sendmail(message, emailObj.email, validation_url, callback);
        }, (err) => {
            if (err) throw new Error(err)
            
            callback(null, message);
        });
    })
    .catch((err) => {
        callback({ error: err }, null);
    });
};