import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan'; // Logging framework for testing
import mongoose from 'mongoose';
import router from './router';

const config = require('./config');

// Connect to Mongodb
const mongodbUrl = config.MONGODB_CONNECT;
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl);

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
