const config = require('config');
const Agenda = require('agenda');
const notification = require('../lib/notification');
const couchdb = require('../lib/couchdb');

const mongoConnectionString = config.get('Agendadb');

const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
  },
});

agenda.define('PushMessage', (job, done) => {
  couchdb.add(job.attrs.data.messageId, (err, message) => {
    if (err) {
      console.log('Couchdb err:', err);
      done(err);
    }
    console.log('Couchdb res:', message);

    notification.Push(message.id, (err1, res) => {
      if (err1) {
        console.log('Notification err:', err);
        done(err1);
      }

      console.log('Push', res);
      done();
    });
  });
});

agenda.on('ready', () => {
  console.log('agenda start');
  agenda.start();
});

module.exports = agenda;
