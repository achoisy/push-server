const jwt = require('jwt-simple');
const secret = require('config').get('SECRET_TOKEN_KEY');


module.exports = (userId) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userId, iat: timestamp }, secret);
};
