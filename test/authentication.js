process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

/*
*  Test GET '/' with no auth
*/
describe("GET'/' with no auth", ()=> {
  it('it should GET unauthorized', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
