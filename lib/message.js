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
        validation_send_to : user.validation_emails,
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
        async.each(message.validation_send_to, (email, callback) =>{
            const emailToken = tokenGen.encode(email);
            const validation_url = `https://maville.me/validatemessage/${message.id}/${emailToken}`;
            Email.sendmail(message, email, validation_url, callback);
        }, (err) => {
            if (err) throw new Error(err)
            
            callback(null, message);
        });
    })
    .catch((err) => {
        callback({ error: err }, null);
    });
};

exports.validate = (messageId, emailToken, callback) => {
    Message.findById(messageId).exec()
    .then((message)=>{
        if (!message) {
            throw new Error("Le Message n'existe pas ou son Id est incorrecte.");
        }
        
        if (message.validation_send_to.some(email => email === tokenGen.decode(emailToken))) {
            message.validate_by = { email, validate_date: Date.now() };
            
            if (message.deliver_date <= Date.now()) { // Deliver msg now !!
                // TODO
            } else { // Plans Deliver
                // TODO
            }
            
            message.status = 'Sending';
            return callback(null, message);
        }
        
        throw new Error("Action non authorisée");
    })
    .catch((err) => {
       callback({ error: err.message }, null); 
    });
};
