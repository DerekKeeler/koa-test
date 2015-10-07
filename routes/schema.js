'use strict';

const
  db = require('monk')(require('../config/db')),
  wrap = require('co-monk'),
  router = require('koa-router')(),
  parse = require('co-body'),
  _ = require('lodash'),
  schemaName = 'test-schema',
  coDB = wrap(db.get('schema'));

function* getSchema() {
  for(let schema; typeof schema !== 'object';) {
    schema = yield coDB.findOne({ name: schemaName });

    // Seed value if non-existant
    coDB.insert({
      name: schemaName,
      data: {}
    });
  }
}

let getS = getSchema(),
  schema;

for(let i = 0; typeof schema !== 'object' && i < 5; i++) {
  schema = getS.next().value;

  if(i === 4){
    console.error('Could not connect to DB');
  }
}

router.get('/', function *(next){
  console.log(schema);

  this.type = 'json';
  this.body = schema;
});

router.get('/:key', function *(next){
  this.type = 'json';
  this.body = schema[this.params.key];
});

router.post('/', function *(next){
  const data = yield parse(this);
  // Need to validate this based on predefined types

  schema.data = data;
  this.body = schema;
});

router.put('/:key', function *(next){
  const
    data = yield parse(this),
    key = this.params.key;

  schema[key] = data;
  this.body = schema;
});

router.patch('/:key', function *(next){
  const
    data = yield parse(this),
    key = this.params.key;

  _.assign(schema[key], data);
  this.body = schema;
});

router.del('/:key', function *(next){
  delete schema[this.params.key];
  this.body = schema;
});

module.exports = {
  router,
  get(){
    return schema.data;
  }
};
