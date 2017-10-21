// Librairies pour tous les acces à la base user
const User = require('../models/user.js');

// callback (err, newuser)
exports.addUser = ({ login, company, main_email, password }, callback) => {
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
