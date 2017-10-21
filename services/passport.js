const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const Admin = require('../models/admin');
const User = require('../models/user');
const secret = require('config').get('SECRET_TOKEN_KEY');

const loacOptions = { usernameField: 'login' };

// Create Local admin strategy
const localAdminLogin = new LocalStrategy(loacOptions, (login, password, done) => {
  // Login and password verif
  Admin.findOne({ login }).exec()
    .then((admin) => {
      if (!admin) { return done(null, false); }
      // Compare password
      return admin.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false); }

        return done(null, admin);
      });
    })
    .catch((err) => {
      return done(err);
    });
});

// =========================================================================
// Create Local user strategy
const localUserLogin = new LocalStrategy(loacOptions, (login, password, done) => {
  // Login and password verif
  User.findOne({ login }).exec()
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

// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret,
};

// ========================================================================= //
// Create JWT Admin Strategy
const jwtAdminLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  Admin.findById(payload.sub).exec()
    .then((admin) => {
      if (admin) {
        return done(null, admin);
      }
      return done(null, false);
    })
    .catch(err => done(err, false));
});

// ========================================================================= //
// Create JWT User Strategy
const jwtUserLogin = new JwtStrategy(jwtOptions, (payload, done) => {
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
passport.use('jwtAdminLogin', jwtAdminLogin);
passport.use('jwtUserLogin', jwtUserLogin);

passport.use('localAdminLogin', localAdminLogin);
passport.use('localUserLogin', localUserLogin);
