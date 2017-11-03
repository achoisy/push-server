const config = require('config');
const PouchDB = require('pouchdb');

// setup couchdb connexion 
const couchdbUrl = config.get('Couchdb.COUCHDB_URL');
const username = config.get('Couchdb.admin_username');
const password = config.get('Couchdb.admin_password');

exports.addMessage = (message, callback) => {
    const dbName = couchdbUrl.concat(message.coderef);
    const db = new PouchDB(dbName, {
        auth: {
          username,
          password,
        },    
    });
    const doc = {
        '_id': message.id,
        'headings': message.headings,
        'contents': message.contents,
        'links': message.links,
        'sender': message.sender,
    }
    db.put(doc)
    .then((doc) => {
        return callback(null,doc);
    })
    .catch((err) => {
        return callback({ error: err}, null);
    });
};