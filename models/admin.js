const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Define model
const adminSchema = new mongoose.Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, lowercase: true },
  profil: {
    titre: String,
    nom: String,
    prenom: String,
    telephone: {},
    mobile: {},
    timezone: String,
  },
  create_date: { type: Date, default: Date.now },
});

// On Save Hook, encrypt password
adminSchema.pre('save', function crypto(next) {
  const user = this;
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) { return next(err); }

    return bcrypt.hash(user.password, salt, null, (err1, hash) => {
      if (err1) { return next(err); }

      user.password = hash;
      return next();
    });
  });
});

// pas de arrow fct => this.
adminSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    return callback(null, isMatch);
  });
};

const ModelClass = mongoose.model('admin', adminSchema);

module.exports = ModelClass;
