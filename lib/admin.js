const Admin = require('../models/admin');

exports.addAdmin = ({ login, email, password }, callback) => {
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
        callback({ error: 'Login is in use' }, null);
      }

      callback(null, admin);
    })
    .catch((err) => {
      callback({ error: err }, null);
    });
};
