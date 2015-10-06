'use strict';

const app = require('koa')(),
  router = require('koa-router')();

router.get('/', function *(next){
  this.type = 'json';
  this.status = 200;
  this.body = {
    'test': 'This is a test response!'
  };
});

app
.use(router.routes())
.use(router.allowedMethods());

module.exports = app;
if (!module.parent){
  app.listen(3000);
  console.log('Application is running on http://localhost:3000/');
}
