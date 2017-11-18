// Message Lib for connection to mongodb database and couchDb
const config = require('config');
const async = require('async');
const Message = require('../models/message');
const tokenGen = require('../services/tokenGenerator');
const Email = require('../services/email');

exports.addMessage = ({
  headings,
  contents,
  links,
  deliver_date = Date.now(),
}, user, callback) => {
  const message = new Message({
    coderef: user.coderef,
    headings,
    contents,
    links,
    validation_send_to: user.validation_emails,
    sender: {
      user_id: user._id,
      company: user.company,
      logo: user.logo,
    },
    status: 'pending',
    deliver_date, // epoc timestamp in millisecond
  });
  message.save().then((message) => {
    // send validation email with token and save in message database.
    async.each(message.validation_send_to, (email, callback) => {
      const emailToken = tokenGen.encode(email);
      const validation_url = `http://localhost:3090/validatemessage/${message.id}/${emailToken}`;
      Email.sendmail(message, email, validation_url, callback);
    }, (err) => {
      if (err)
        throw new Error(err)

      callback(null, message);
    });
  }).catch((err) => {
    callback({
      error: err
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
          email: decodeToken,
          validate_date: Date.now(),
        },
      }).exec();

      return callback(null, true);
    }

    callback({ error: 'Non authorise' }, null);
  }).catch((err) => {
    callback({
      error: err
    }, null);
  });
};

exports.updateMessageStatus = (msgId, status) => {
  Message.findOneAndUpdate({ _id: msgId }, { $set: { status } }).exec();
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
    callback({
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
    callback({
      error: err
    }, null);
  });
};
