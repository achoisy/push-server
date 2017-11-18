const passport = require('passport');
const querymen = require('querymen'); // TODO: create schema
const {
  adminSearch,
  messageSearchAdmin,
  messageSearch,
  userSearch,
} = require('./services/querymen_schema');
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

  // MESSAGE CRUD
  app.post('/message', requireUserAuth, Message.create);
  app.get('/message', requireUserAuth, querymen.middleware(messageSearch), Message.getAllByUserId);
  app.get('/message/:id', requireUserAuth, querymen.middleware(), Message.getById);
  app.delete('/message/:id', requireUserAuth, Message.delById);
  // app.put('/message/:id', requireUserAuth, Message.updateById); // TODO

  // Validation message route
  app.get('/validatemessage/:id/:token', Message.validate, Message.send);

  // Admin routes
  app.post('/admin/signin', requireAdminSignin, Authentication.adminSignin);
  app.get('/admin/', requireAdminAuth, querymen.middleware(adminSearch), Admin.getList);
  app.delete('/admin/:id', requireAdminAuth, Admin.deleteAdmin);
  app.post('/admin/create', requireAdminAuth, Admin.createNewAdmin);
  // app.post('/admin/create', Admin.createNewAdmin); // HACK: uniquement pour init admin

  app.get('/admin/message', requireAdminAuth, querymen.middleware(messageSearchAdmin), Message.getAdmin);
  app.get('/admin/message/:id', requireAdminAuth, querymen.middleware(), Message.getByIdAdmin);
  app.delete('/admin/message/:id', requireAdminAuth, Message.delByIdAdmin);
  // app.put('/admin/message/:id',requireAdminAuth, Message.updateByIdAdmin); // TODO

  // USER CRUD
  app.get('/admin/user/:id', requireAdminAuth, User.getById);
  app.delete('/admin/user/:id', requireAdminAuth, User.delById);
  app.put('/admin/user/:id', requireAdminAuth, User.updateById);
  app.post('/admin/user', requireAdminAuth, User.create); // Create User
  app.get('/admin/user', requireAdminAuth, querymen.middleware(userSearch), User.list);
};
