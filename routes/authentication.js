const jwt = require('jwt-simple');
const secret = require('config').get('SECRET_TOKEN_KEY');


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, secret);
}

exports.signin = ({ user }, res, next) => {
  // User has already had their email and password auth'd
  // We just need to give them a tokenForUser
  return res.json({ token: tokenForUser(user) });
};


/*
exports.signup = ({ body }, res, next) => {
  const { login, password } = body;

  if (!login || !password) {
    return res.status(422).send({ error: 'Vous devez fournir un login et un mot de passe.' });
  }
  // See if duplicate email in user collection
  User.findOne({ login }).exec()
    .then((existingUser) => {
      if (existingUser) {
        return null;
      }

      const user = new User({
        login,
        password,
      });

      return user.save();
    })
    .then((user) => {
      if (!user) {
        return res.status(422).send({ error: 'Email is in use' });
      }

      return res.json({ token: tokenForUser(user) });
    })
    .catch((err) => {
      console.error('error:', err);
    });
  return '';
};
*/
