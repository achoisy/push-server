const passport = require('passport');
const Authentication = require('./routes/authentication');
const User = require('./routes/user');
const Admin = require('./routes/admin');
const Message = require('./routes/message');
const passportService = require('./services/passport');

const requireUserAuth = passport.authenticate('jwtUserLogin', { session: false });
const requireAdminAuth = passport.authenticate('jwtAdminLogin', { session: false });

const requireUserSignin = passport.authenticate('localUserLogin', { session: false });
const requireAdminSignin = passport.authenticate('localAdminLogin', { session: false });


module.exports = (app) => {
  app.get('/', requireUserAuth, (req, res) => {
    res.send({ hi: 'there' });
  });

  // User routes
  app.post('/signin', requireUserSignin, Authentication.userSignin);

  app.post('/message', requireUserAuth, Message.create);
  
  // Validation message route
  app.get('/validatemessage/:id/:token', Message.validate);

  // Admin routes
  app.post('/admin', requireAdminSignin, (req, res) => {
    res.send({ hi: 'there Admin' });
  });
  app.post('/admin/create', Admin.createNewAdmin); // HACK: uniquement pour init admin
  app.post('/admin/user', requireAdminAuth, User.createNewUser);
  // app.post('/signup', Authentication.signup);
};
