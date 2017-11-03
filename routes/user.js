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
exports.create = ({ body }, res, next) => {
  const userObjects = createUserObject(body);

  async.detect(userObjects, (userObject, callback) => { // Cherche les valeurs vides
    if (!userObject) {
      return callback(null, true);
    }
    return callback();
  }, (err, result) => {
    if (!result) {
      // Tous les champs sont renseignés
      userLib.add(userObjects, (liberr, newUser) => {
        if (liberr) {
          return res.status(500).send(`Erreur à /route/user.js/create:userLib.add msg:${liberr.error}`);
        }
        return res.json({ newUser, unhashPassword: userObjects.password });
      });
    }
    // le champ 'result' n'est pas renseigné
    return res.status(422).send({ error: `Vous devez fournir le champ: ${Object.keys(result)}` });
  });
};

exports.list = (req , res, next) => {
    userLib.getAll({}, (err, userList )=> {
        if (err) {
            if (err.message) {
                return res.status(204).send(err.message);
            }
            return res.status(500).send(`Erreur à /route/user.js/list:userLib.get msg:${err}`);
        }
        
        return res.status(200).json(userList);
    });
};

exports.getById = ({ params: { id } }, res, next) => {
    userLib.getById(id, (err, user )=> {
        if (err) {
            if (err.message) {
                return res.status(204).send(err.message);
            }
            return res.status(500).send(`Erreur à /route/user.js/getById:userLib.getById msg:${err}`);
        }
        
        return res.status(200).json(user);
    });
};

exports.delById = ({ params: { id } }, res, next) => {
    userLib.delById(id, (err, delUser) => {
        if (err) {
            if (err.message) {
                return res.status(204).send(err.message);
            }
            return res.status(500).send(`Erreur à /route/user.js/delById:userLib.delById msg:${err}`);
        }

        return res.status(200).json(delUser);
    });
};

exports.updateById = ({ params: { id }, body }, res, next) => {
    userLib.updateById(id, body, (err, updateUser) => {
       if (err) {
           if (err.message) {
               return res.status(204).send(err.message);
           }
           return res.status(500).send(`Erreur à /route/user.js/updateById:userLib.updateById msg:${err}`);
       }
       
       return res.status(200).json(updateUser);
    });
};

