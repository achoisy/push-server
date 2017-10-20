const config = require('config');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Logging framework for testing
const mongoose = require('mongoose');

const router = require('./router');


// Connect to Mongodb
const mongodbUrl = config.get('MONGODB_CONNECT');
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl, { useMongoClient: true });

const App = express();

// App Setup
// don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  // use morgan to log at command line
  App.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}
App.use(bodyParser.json({ type: '*/*' }));
router(App);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(App);
server.listen(port);
console.log('Server listening on: ', port);

module.exports = App; // for testing
