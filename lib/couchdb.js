const config = require('config');
const PouchDB = require('pouchdb');
const Message = require('./message');

// setup couchdb connexion
const couchdbUrl = config.get('Couchdb.COUCHDB_URL');
const username = config.get('Couchdb.admin_username');
const password = config.get('Couchdb.admin_password');

exports.add = (messageId, callback) => {
  Message.findById(messageId, (err, message) => {
    if (err) {
      Message.updateMessageStatus(message.id, 'Couchdb Failed');
      callback({ error: err }, null);
    }

    const db = new PouchDB(couchdbUrl, {
      auth: {
        username,
        password,
      },
    });

    const couchMessage = {
      _id: message.id,
      coderef: message.coderef,
      headings: message.headings,
      contents: message.contents,
      links: message.links,
      sender: message.sender,
      create_date: message.deliver_date,
    };

    db.put(couchMessage)
      .then((doc) => {
        Message.updateMessageStatus(
          message.id,
          { status: "Message en cours d'envoi" },
        );
        Message.updateMessageCouchdb(message.id, doc);

        return callback(null, doc);
      })
      .catch(err2 => callback({ error: err2 }, null));
  });
};
