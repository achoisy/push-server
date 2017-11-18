const querymen = require('querymen');

exports.adminSearch = new querymen.Schema({
  id: {
    type: String,
    paths: ['_id'],
  },
  email: {
    type: String,
    lowercase: true,
  },
  after: {
    type: Date,
    paths: ['create_date'],
    operator: '$gte',
  },
  before: {
    type: Date,
    paths: ['create_date'],
    operator: '$lte',
  },
});

exports.messageSearchAdmin = new querymen.Schema({
  user: {
    type: String,
    paths: ['sender.user_id'],
  },
  email: {
    type: String,
    lowercase: true,
  },
  after: {
    type: Date,
    paths: ['create_date'],
    operator: '$gte',
  },
  before: {
    type: Date,
    paths: ['create_date'],
    operator: '$lte',
  },
  coderef: {
    type: String,
  },
});

exports.messageSearch = new querymen.Schema({
  status: {
    type: [String],
  },
  after: {
    type: Date,
    paths: ['create_date'],
    operator: '$gte',
  },
  before: {
    type: Date,
    paths: ['create_date'],
    operator: '$lte',
  },
});

exports.userSearch = new querymen.Schema({
  login: {
    type: String,
  },
  after: {
    type: Date,
    paths: ['create_date'],
    operator: '$gte',
  },
  before: {
    type: Date,
    paths: ['create_date'],
    operator: '$lte',
  },
  coderef: {
    type: String,
  },
});
