const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const secret = require('config').get('SECRET_TOKEN_KEY');

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
