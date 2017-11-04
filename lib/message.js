// Message Lib for connection to mongodb database and couchDb
const config = require('config');
const async = require('async');
const Message = require('../models/message');
const tokenGen = require('../services/tokenGenerator');
const Email = require('../services/email');
const Pouchdb = require ('./couchdb');
const Push = reuqire('./notification');
const Agenda = require('agenda');

const mongoConnectionString = config.get('Agendadb'); 

const agenda = new Agenda({db: {address: mongoConnectionString}});

function createJob(message) {
    Message.findById(messageId).exec()
    .then((message) => {
        if (!message) {
            throw new Error(`Message: ${messageId} n'existe pas`);
        }
        
        return message;
    })
    .then((message) => {
        Pouchdb.addMessage(message, (err, response) =>{
            message.couchdb = response;

            if (err) {
                message.status = "Couchdb_Failed";
                message.save();
                throw new Error({ error: err, msg_id: message.id });
            } 
   
            // Try to push message now
            const pushMessage = {
                headings: message.headings,
                contents: message.contents,
                data: { 
                    message_id: message.id, 
                    user_id: message.sender.user_id,
                },
                imageUrl: message.sender.logo,
            };
            const filterArray = [
                {
                    field: 'tag',
                    key: message.coderef,
                    relation: 'exists',
                }    
            ];
            const push = new Push(pushMessage, message.sender.user_id);
            push.senByFilter(filterArray, (err, pushObject) => {
                if (err) {
                    message.status = "Push_Failed";
                    message.save();
                    throw new Error({ error: err, msg_id: message.id });
                }
                       
                message.notification = { 
                    push_id: pushObject.id,
                };
                message.status = "sended";
                message.save();
                done();
            });
        });
    })
    .catch((err) => {
        throw new Error(err);
    });

}

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
            message.status = 'Sending';
            message.save();
            return callback(null, true);
        }
        
        throw new Error("Action non authorisée");
    })
    .catch((err) => {
       callback({ error: err.message }, null); 
    });
};

exports.agenda = (messageId, callback) => {
    Message.findById(messageId).exec()
    .then((message) => {
        if (!message) {
            throw new Error("Le Message n'existe pas ou son Id est incorrecte.");
        }

        agenda.define('send_Message', (job, done) => {
            const messageId = job.attrs.data.messageId;
            createJob(messageId);
        });
        
        agenda.on('ready', function(){
            if (message.deliver_date <= Date.now) {
                agenda.now('send_Message', { messageId: message.id});
            } else {
                agenda.schedule(message.deliver_date, 'send_Message', { messageId: message.id });
            }
        });
    })
    .catch((err) => {
       callback({ error: err }, null); 
    });
};

