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

  // User routes
  app.post('/signin', requireUserSignin, Authentication.userSignin);
  app.post('/message', requireUserAuth, Message.create);
  
  // Validation message route
  app.get('/validatemessage/:id/:token', Message.validate);

  // Admin routes
  app.post('/admin/signin', requireAdminSignin, Authentication.adminSignin);
  app.delete('/admin/:id', requireAdminAuth, Admin.deleteAdmin);
  app.post('/admin/create', requireAdminAuth, Admin.createNewAdmin); // HACK: uniquement pour init admin
  
  // USER CRUD
  app.post('/admin/user', requireAdminAuth, User.create); // Create User
  app.get('/admin/user',requireAdminAuth, User.list);
  app.get('/admin/user/:id', requireAdminAuth, User.getById);
  app.delete('/admin/user/:id', requireAdminAuth, User.delById);
  app.put('/admin/user/:id',requireAdminAuth, User.updateById);
  // app.post('/signup', Authentication.signup);
};
