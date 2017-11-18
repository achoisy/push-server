// Librairies pour tous les acces à la base user
const User = require('../models/user.js');

// callback (err, newuser)
exports.add = ({
  login,
  company,
  main_email,
  coderef,
  password,
}, callback) => {
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
        coderef,
        validation_emails: main_email,
      });

      return user.save();
    })
    .then((user) => {
      if (!user) {
        callback(null, false);
      }

      callback(null, user);
    })
    .catch((err) => {
      callback({ error: err }, null);
    });
};
exports.getAll = (query, {
  sort = {
    _id: 1,
  },
  limit = 10,
  skip = 1,
}, callback) => {
  User.find(query).limit(limit).skip(skip).sort(sort)
    .exec()
    .then((userList) => {
      if (!userList) {
        callback(null, false);
      }

      callback(null, userList);
    })
    .catch((err) => {
      callback({
        error: err,
      }, null);
    });
};

exports.getById = (userId, callback) => {
  User.findById(userId).exec().then((user) => {
    if (!user) {
      callback(null, false);
    }

    callback(null, user);
  }).catch((err) => {
    callback({
      error: err,
    }, null);
  });
};

exports.delById = (userId, callback) => {
  User.findByIdAndRemove(userId).exec().then((delUser) => {
    if (!delUser) {
      callback(null, false);
    }

    callback(null, delUser);
  }).catch((err) => {
    callback({
      error: err,
    }, null);
  });
};

exports.updateById = (userId, body, callback) => {
  User.findByIdAndUpdate(userId, { $set: body })
    .exec()
    .then((updateUser) => {
      if (!updateUser) {
        callback(null, false);
      }

      callback(null, updateUser);
    }).catch((err) => {
      callback({
        error: err,
      }, null);
    });
};
