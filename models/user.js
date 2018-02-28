const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new mongoose.Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  company: String,
  coderef: String, // Alpha 3 code + code postal -- https://www.iso.org/obp/ui/fr/#search
  logo: String,
  description: String,
  main_email: { type: String, lowercase: true },
  validation_emails: [],
  timezone: String,
  profil: {
    titre: String,
    nom: String,
    prenom: String,
    telephone: {},
    mobile: {},
  },
  create_date: { type: Date, default: Date.now },
});

// On Save Hook, encrypt password
userSchema.pre('save', function crypto(next) {
  const user = this;
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) { return next(err); }

    return bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      user.password = hash;
      return next();
    });
  });
});

// pas de arrow fct => this.
userSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    return callback(null, isMatch);
  });
};

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
