import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan'; // Logging framework for testing
import mongoose from 'mongoose';
import router from './router';

// Config files load
dotenv.config({ silent: true });

// Connect to Mongodb
const mongodbUrl = process.env.MONGODB_CONNECT;
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl);

const App = express();

// App Setup
// App.use(morgan('combined'));
App.use(bodyParser.json({ type: '*/*' }));
router(App);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(App);
server.listen(port);
console.log('Server listening on: ', port);
