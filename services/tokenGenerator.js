const jwt = require('jwt-simple');
const secret = require('config').get('SECRET_TOKEN_KEY');


module.exports = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, secret);
};
