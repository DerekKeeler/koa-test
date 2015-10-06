'use strict';

const request = require('supertest'),
  app = require('../index.js');

describe('GET Data', function() {
  it('should respond with JSON Data', function(done) {
    request(app.listen())
    .get('/')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(done);
  });
});
