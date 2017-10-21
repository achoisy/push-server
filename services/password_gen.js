// Generate password
// Passe pattern in string and lenght
const randomize = require('randomatic');


module.exports = (pattern = 'Aa0', length = 8, options = {}) => {
  return randomize(pattern, length, options);
};
