const Admin = require('../models/admin');

exports.add = ({ login, email, password }, callback) => {
  // Ajoute un nouveau user dans User
  Admin.findOne({ login }).exec()
    .then((existingUser) => {
      if (existingUser) {
        return null;
      }

      const admin = new Admin({
        login,
        password,
        email,
      });

      return admin.save();
    })
    .then((admin) => {
      if (!admin) {
        callback(null, false);
      }

      callback(null, admin);
    })
    .catch((err) => {
      callback({ error: err }, null);
    });
};

exports.delete = (adminId, callback) => {
  Admin.findByIdAndRemove(adminId).exec().then((deleteAdmin) => {
    if (!deleteAdmin) {
      throw new Error(`admin_id:${adminId} don't exist`);
    }

    callback(null, deleteAdmin);
  }).catch((err) => {
    callback({
      error: err,
    }, null);
  });
};

exports.get = (query, {
  sort = {
    _id: 1,
  },
  limit = 10,
  skip = 1,
}, callback) => {
  const getQuery = Admin.find(query).limit(limit).skip(skip).sort(sort);

  getQuery.exec().then((doc) => {
    if (!doc) {
      return callback(null, false);
    }

    return callback(null, doc);
  }).catch((err) => {
    callback({
      error: err,
    }, null);
  });
};
