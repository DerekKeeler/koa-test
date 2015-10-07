'use strict';

const
  router = require('koa-router')(),
  parse = require('co-body'),
  _ = require('lodash'),
  schema = require('./schema'),
  schemaRouter = schema.router,
  s = schema.get;

let stored = {};

router.use('/schema', schemaRouter.routes(), schemaRouter.allowedMethods());

router.get('/:key', function *(next){
  const key = this.params.key;

  if(key && s()[key]){
    // Would need to process this based on type
    this.body = stored[key];
  } else {
    this.status = 404;
  }
});

router.post('/:key', function *(next){
  const key = this.params.key;

  if(key && s()[key]){
    const data = yield parse(this);

    if(!stored[key]){
      stored[key] = [];
    }

    // Would need to process this based on type and validate data
    stored[key].push(data);

    this.body = stored[key][stored[key].length - 1];
  } else {
    this.status = 404;
  }
});

module.exports = router;
