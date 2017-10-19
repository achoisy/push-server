import jwt from 'jwt-simple';
import { secret } from '../config';
import User from '../models/user';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, secret);
}

exports.signin = ({ user }, res, next) => {
  // User has already had their email and password auth'd
  // We just need to give them a tokenForUser
  return res.json({ token: tokenForUser(user) });
};

exports.signup = ({ body }, res, next) => {
  const { email, password } = body;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }
  // See if duplicate email in user collection
  User.findOne({ email: email.toLowerCase() }).exec()
    .then((existingUser) => {
      if (existingUser) {
        return null;
      }

      const user = new User({
        email,
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
