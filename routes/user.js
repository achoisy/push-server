// const async = require('async');
const _ = require('lodash');
const genPass = require('../services/password_gen.js');
const userLib = require('../lib/user');

function createUserObject({
  login = null,
  company = null,
  main_email = null,
  coderef = null,
  password = genPass(), // par defaut si pas de mot de pass dans le body
}) {
  if (!password || password.length < 8) {
    return {
      login,
      company,
      main_email,
      coderef,
      password: genPass(),
    };
  }
  return {
    login,
    company,
    main_email,
    coderef,
    password,
  };
}

// Create user with
exports.create = ({
  body,
}, res) => {
  const userObjects = createUserObject(body);
  const userTest = _.every(userObjects, userObject => userObject !== null);

  if (userTest) {
    // Tous les champs sont renseignés
    userLib.add(userObjects, (liberr, newUser) => {
      if (liberr) {
        return res.status(500).send(`Erreur à /route/user.js/create:userLib.add msg:${JSON.stringify(liberr)}`);
      }
      return res.json({ create: true, newUser, unhashPassword: userObjects.password });
    });
  } else {
    return res.status(422).json({ create: false, message: 'Vous devez fournir les champs login et email' });
  }
};

exports.list = ({
  querymen: {
    query,
    cursor,
  },
}, res, next) => {
  userLib.getAll(query, cursor, (err, userList) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!userList) {
      return res.status(204).json({ get: false, message: 'empty request' });
    }

    return res.status(200).json({ get: true, userList });
  });
};

exports.getById = ({
  params: {
    id,
  },
}, res, next) => {
  userLib.getById(id, (err, user) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!user) {
      return res.status(204).json({ get: false, message: 'empty request' });
    }

    return res.status(200).json({ get: true, user });
  });
};

exports.delById = ({
  params: {
    id,
  },
}, res, next) => {
  userLib.delById(id, (err, delUser) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!delUser) {
      return res.status(204).json({ delete: false, message: 'empty request' });
    }
    return res.status(200).json({ delete: true, delUser });
  });
};

exports.updateById = ({
  params: {
    id,
  },
  body,
}, res, next) => {
  userLib.updateById(id, body, (err, updateUser) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!updateUser) {
      return res.status(204).json({ update: false, message: 'empty request' });
    }

    return res.status(200).json({ update: true, updateUser });
  });
};
