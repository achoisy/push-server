const jwt = require('jwt-simple');
const secret = require('config').get('SECRET_TOKEN_KEY');


exports.encode = (userId) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userId, iat: timestamp }, secret);
};

exports.decode = (token) => {
  return jwt.decode(token, secret);
};
