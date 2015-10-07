'use strict';

const
  // db = require('monk')(require('../config/db')),
  // Investigate using co straight
  router = require('koa-router')(),
  parse = require('co-body'),
  _ = require('lodash'),
  schemaName = 'test-schema';

let schema = {
    name: schemaName,
    data: {}
  };

router.get('/', function *(next){
  this.type = 'json';
  this.body = schema.data;
});

router.get('/:key', function *(next){
  this.type = 'json';
  this.body = schema.data[this.params.key];
});

router.post('/', function *(next){
  const data = yield parse(this);
  // Need to validate this based on predefined types

  schema.data = data;
  this.body = schema.data;
});

router.put('/:key', function *(next){
  const
    data = yield parse(this),
    key = this.params.key;

  schema.data[key] = data;
  this.body = schema;
});

router.patch('/:key', function *(next){
  const
    data = yield parse(this),
    key = this.params.key;

  _.assign(schema.data[key], data);
  this.body = schema.data;
});

router.del('/:key', function *(next){
  delete schema.data[this.params.key];
  this.body = schema.data;
});

module.exports = {
  router,
  get(){
    return schema.data;
  }
};
