const async = require('async');

const genPass = require('../services/password_gen.js');
const userLib = require('../lib/user');

function createUserObject({
  login,
  company,
  main_email,
  password = genPass(), // par defaut si pas de mot de pass dans le body
}) {
  if (!password || password.length < 8) {
    return {
      login, company, main_email, password: genPass(),
    };
  }
  return {
    login, company, main_email, password,
  };
}

// Create user with
exports.createNewUser = ({ body }, res, next) => {
  const userObjects = createUserObject(body);

  async.detect(userObjects, (userObject, callback) => { // Cherche les valeurs vides
    if (!userObject) {
      return callback(null, true);
    }
    return callback();
  }, (err, result) => {
    if (!result) {
      // Tous les champs sont renseignés
      userLib.addUser(userObjects, (liberr, newUser) => {
        if (liberr) {
          return res.status(500).send({ error: `Erreur à /route/authentication.js/userCreate:userLib.addUser msg:${liberr.error}` });
        }
        return res.json({ newUser, unhashPassword: userObjects.password });
      });
    } else {
      // le champ 'result' n'est pas renseigné
      return res.status(422).send({ error: `Vous devez fournir le champ: ${Object.keys(result)}` });
    }
  });
};
