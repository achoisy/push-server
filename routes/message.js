// route for message
const config = require('config');
const Agenda = require('agenda');
const messageLib = require('../lib/message');

const mongoConnectionString = config.get('Agendadb');

const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
  },
});

exports.create = ({
  body,
  user,
}, res, next) => {
  console.log('body', body);
  // Create new message
  // Body: heading {}, contents {}, link[ type, url,description], deliver_date
  messageLib.addMessage(body, user, (err, message) => {
    if (err) {
      return res.status(500).send(`Erreur à /route/message create.messageLib.addMessage msg:${JSON.stringify(err)}`);
    }

    return res.json({ create: true, message });
  });
};

exports.validate = ({
  params: {
    id,
    token,
  },
}, res, next) => {
  // Validate message
  messageLib.validate(id, token, (err, response) => {
    if (err) {
      return res.status(500).send(`Erreur msg:${JSON.stringify(err)}`);
    }

    res.status(200).json({ validate: true, message: 'Merci pour la validation' }); // TODO: create response template in html. use mustach temp engine
    return next();
  });
};

exports.getAllByUserId = ({
  querymen: {
    cursor,
    query,
  },
  user,
}, res, next) => {
  const filter = {
    'sender.user_id': user.id,
    ...query,
  };
  messageLib.get(filter, cursor, (err, msgList) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!msgList) {
      return res.status(204).json({ get: true, message: 'empty request' });
    }

    return res.json({ get: true, msgList });
  });
};

exports.getById = ({
  params: {
    id,
  },
  querymen: {
    cursor,
  },
  user,
}, res, next) => {
  const filter = {
    'sender.user_id': user.id,
    _id: id,
  };
  messageLib.get(filter, cursor, (err, msg) => {
    if (err) {
      return res.status(500).send({ error: `Erreur msg: ${err.error}` });
    }

    if (!msg) {
      return res.status(204).json({ get: false, message: 'empty request' });
    }

    return res.json({ get: true, msg });
  });
};

exports.getAdmin = ({
  querymen: {
    query,
    cursor,
  },
}, res, next) => {
  messageLib.get(query, cursor, (err, msgList) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!msgList) {
      return res.status(204).json({ get: false, message: 'empty request' });
    }

    return res.json({ get: true, msgList });
  });
};

exports.getByIdAdmin = ({
  params: {
    id,
  },
  querymen: {
    cursor,
  },
}, res, next) => {
  const filter = {
    _id: id,
  };
  messageLib.get(filter, cursor, (err, msgList) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!msgList) {
      return res.status(204).json({ get: false, message: 'empty request' });
    }

    return res.json({ get: true, msgList });
  });
};

exports.delById = ({
  params: {
    id,
  },
  user,
}, res, next) => {
  const filter = {
    'sender.user_id': user.id,
    _id: id,
  };
  messageLib.del(filter, (err, msg) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!msg) {
      return res.status(204).json({ delete: false, message: 'empty request' });
    }

    return res.status(200).json({ delete: true, message: 'Message supprimé' });
  });
};

exports.delByIdAdmin = ({
  params: {
    id,
  },
  user,
}, res, next) => {
  const filter = {
    _id: id,
  };
  messageLib.del(filter, (err, msg) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!msg) {
      return res.status(204).json({ delete: false, message: 'empty request' });
    }

    return res.status(200).json({ delete: true, message: 'Message supprimé' });
  });
};

exports.send = ({ params: { id } }, res, next) => {
  messageLib.findById(id, (err, { deliver_date, _id }) => {
    if (err || !_id) {
      console.log('Message send err:', err);
      next(err);
    }

    if (deliver_date <= Date.now()) { // TODO: update time delivery
      console.log('Agenda Now');
      agenda.now('PushMessage', { messageId: _id });
    } else {
      console.log('Agenda Schedule');
      agenda.schedule(deliver_date, 'PushMessage', { messageId: _id });
    }
  });
};
