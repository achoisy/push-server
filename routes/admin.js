const async = require('async');

const tokenGen = require('../services/tokenGenerator');
const genPass = require('../services/password_gen.js');
const adminLib = require('../lib/admin');

function createAdminObject({
  login,
  email,
  password = genPass('Aa0!', 12), // par defaut si pas de mot de pass dans le body
}) {
  if (!password || password.length < 12) {
    return {
      login, email, password: genPass(),
    };
  }
  return {
    login, email, password,
  };
}

// Create user with
exports.createNewAdmin = ({ body }, res, next) => {
  const adminObjects = createAdminObject(body);

  async.detect(adminObjects, (adminObject, callback) => { // Cherche les valeurs vides
    if (!adminObject) {
      return callback(null, true);
    }

    return callback();
  }, (err, result) => {
    if (!result) {
      // Tous les champs sont renseignés
      adminLib.addAdmin(adminObjects, (liberr, newAdmin) => {
        if (liberr) {
          return res.status(500).send({ error: `Erreur à /route/admin.js/createNewAdmin:adminLib.addAdmin msg:${liberr.error}` });
        }
        const adminToken = tokenGen(newAdmin.id);

        return res.json({ newAdmin, unhashPassword: adminObjects.password, adminToken });
      });
    } else {
      // le champ 'result' n'est pas renseigné
      return res.status(422).send({ error: `Vous devez fournir le champ: ${Object.keys(result)}` });
    }
  });
};
