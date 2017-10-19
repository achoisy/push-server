import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';

import User from '../models/user';
import { secret } from '../config';

// Create Local strategy
const loacOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(loacOptions, (email, password, done) => {
  // Email and password verif
  User.findOne({ email: email.toLowerCase() }).exec()
    .then((user) => {
      if (!user) { return done(null, false); }
      // Compare password
      return user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false); }

        return done(null, user);
      });
    })
    .catch((err) => {
      return done(err);
    });
});
// ========================================================================= //
// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret,
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub).exec()
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch(err => done(err, false));
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
