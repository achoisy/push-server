const async = require('async');

const tokenGen = require('../services/tokenGenerator');
const genPass = require('../services/password_gen.js');
const adminLib = require('../lib/admin');

function createAdminObject({
  login = null,
  email = null,
  password = genPass('Aa0!', 12), // par defaut si pas de mot de pass dans le body
}) {
  if (!password || password.length < 12) {
    return { login, email, password: genPass() };
  }
  return { login, email, password };
}

// Create user with
exports.createNewAdmin = ({
  body
}, res, next) => {
  const adminObjects = createAdminObject(body);

  async.detect(adminObjects, (adminObject, callback) => { // Cherche les valeurs vides
    if (adminObject === null) {
      return callback(null, true);
    }

    return callback();
  }, (err, result) => {
    if (result === undefined) {
      // Tous les champs sont renseignés
      adminLib.add(adminObjects, (liberr, newAdmin) => {
        if (liberr) {
          return res.status(500).send(`Erreur à /route/admin.js/createNewAdmin:adminLib.addAdmin msg:${JSON.stringify(liberr)}`);
        }
        const adminToken = tokenGen.encode(newAdmin.id);

        return res.json({
          create: true,
          newAdmin,
          unhashPassword: adminObjects.password,
          adminToken,
        });
      });
    }
    // le champ 'result' n'est pas renseigné
    return res.status(422).json({ create: false, message: 'Vous devez fournir les champs login et email' });
  });
};

exports.deleteAdmin = ({
  params: {
    id,
  },
}, res, next) => {
  adminLib.delete(id, (liberr, delAdmin) => {
    if (liberr) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(liberr)}`);
    }

    if (!delAdmin) {
      return res.status(204).json({ delete: false, message: 'empty request' });
    }

    return res.status(200).json({ delete: true, message: 'Message supprimé' });
  });
};

exports.getList = ({
  querymen: {
    query,
    cursor,
  },
}, res, next) => {
  adminLib.get(query, cursor, (err, adminList) => {
    if (err) {
      return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
    }

    if (!adminList) {
      return res.status(204).json({ get: false, message: 'empty request' });
    }

    return res.json({ get: true, adminList });
  });
};
