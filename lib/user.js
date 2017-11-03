// Librairies pour tous les acces à la base user
const User = require('../models/user.js');

// callback (err, newuser)
exports.add = ({ login, company, main_email, password }, callback) => {
  // Ajoute un nouveau user dans User
  User.findOne({ login }).exec()
    .then((existingUser) => {
      if (existingUser) {
        return null;
      }

      const user = new User({
        login,
        password,
        company,
        main_email,
        validation_emails: { main_email },
      });

      return user.save();
    })
    .then((user) => {
      if (!user) {
        callback({ error: 'Login is in use' }, null);
      }

      callback(null, user);
    })
    .catch((err) => {
      callback({ error: err }, null);
    });
};

exports.getAll = (query, callback) => {
    User.find(query).exec()
    .then((userList) => {
       if (!userList) {
           callback({ message: 'Aucun user dans la base'}, null);
       } 
       
       callback(null, userList);
    })
    .catch((err) => {
        callback({ error: err}, null);
    });
};

exports.getById = (userId, callback) => {
    User.findById(userId).exec()
    .then((user) => {
       if (!user) {
           callback({ message: `Le user:${userId} n'existe pas, désolé !`}, null);
       } 
       
       callback(null, user);
    })
    .catch((err) => {
        callback({ error: err}, null);
    });
};

exports.delById = (userId, callback) => {
  User.findByIdAndRemove(userId).exec()
  .then((delUser) => {
      if (!delUser) {
          callback({ message: `Le user:${userId} n'existe pas, suppression impossible !`}, null);
      }
      
      callback(null, delUser);
  })
  .catch((err) => {
     callback({ error: err}, null); 
  });
};

exports.updateById = (userId, body, callback) => {
  User.findByIdAndUpdate(userId, { $set: body }).exec()
  .then((updateUser) => {
      if (!updateUser) {
          callback({ message: `Le user:${userId} n'est pas mise à jour.`}, null);
      }
      
      callback(null, updateUser);
  })
  .catch((err) => {
     callback({error: err}, null); 
  });
};
