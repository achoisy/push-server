// Message Lib for connection to mongodb database and couchDb
const config = require('config');
const _ = require('lodash');
const async = require('async');
const Message = require('../models/message');
const tokenGen = require('../services/tokenGenerator');
const Email = require('../services/email');

exports.addMessage = ({
  headings,
  contents,
  links,
  images,
  deliver_date = Date.now(),
}, user, callback) => {
  const message = new Message({
    coderef: user.coderef,
    headings,
    contents,
    links,
    images,
    validation_send_to: user.validation_emails,
    sender: {
      user_id: user._id,
      company: user.company,
      logo: user.logo,
    },
    status: 'En attente de validation',
    deliver_date, // epoc timestamp in millisecond
  });
  message.save().then((newMessage) => {
    // send validation email with token and save in message database.
    async.each(newMessage.validation_send_to, (email, callback1) => {
      const emailToken = tokenGen.encode(email);
      const validationUrl = `http://localhost:3090/validatemessage/${newMessage.id}/${emailToken}`;
      Email.sendmail(newMessage, email, validationUrl, callback1);
    }, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        return callback(null, newMessage);
      }
    });
  }).catch((err) => {
    return callback({
      error: err,
    }, null);
  });
};

exports.validate = (messageId, emailToken, callback) => {
  Message.findById(messageId).exec().then((message) => {
    if (!message) {
      callback({ error: 'Bad request' }, null);
    }
    const decodeToken = tokenGen.decode(emailToken).sub;
    if (message.validation_send_to.some(email => email === decodeToken)) {
      Message.findOneAndUpdate({ _id: message.id }, {
        $set: {
          'validate_by.email': decodeToken,
          'validate_by.validate_date': Date.now(),
          status: 'Message valide',
        },
      }).exec()
        .then((doc) => {
          return callback(null, true);
        })
        .catch((err) => {
          return callback({ error: err }, null);
        });
    } else {
      return callback({ error: 'Non authorise' }, null);
    }
  }).catch((err) => {
   return callback({
      error: err,
    }, null);
  });
};

exports.updateMessageStatus = (msgId, status) => {
  Message.findOneAndUpdate({ _id: msgId }, { $set: { status } }).exec();
};

exports.updateMessageCouchdb = (msgId, couchdb) => {
  Message.findOneAndUpdate({ _id: msgId }, { $set: { couchdb } }).exec();
};

exports.updateMessageNotification = (msgId, notification) => {
  Message.findOneAndUpdate({ _id: msgId }, { $set: { notification } }).exec();
};

exports.findById = (msgId, callback) => {
  Message.findById(msgId, (err, message) => {
    callback(err, message);
  });
};

exports.get = (query, {
  sort = {
    _id: 1
  },
  limit = 10,
  skip = 0
}, callback) => {
  const getQuery = Message.find(query).limit(limit).skip(skip).sort(sort);

  getQuery.exec().then((doc) => {
    if (!doc) {
      return callback(null, false);
    }

    return callback(null, doc);
  }).catch((err) => {
    return callback({
      error: err
    }, null);
  });
};

exports.del = (query, callback) => {
  const getQuery = Message.find(query);
  getQuery.exec().then((doc) => {
    if (!doc) {
      return callback(null, false);
    }

    doc.remove(callback);
  }).catch((err) => {
    return callback({
      error: err
    }, null);
  });
};
