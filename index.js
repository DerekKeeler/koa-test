'use strict';

const
  app = require('koa')(),
  route = require('./routes/route'),
  port = process.env.PORT || 3000,
  env = process.env.NODE_ENV || 'development';

app
.use(function *(next){
  try {
    yield next;
  } catch (err) {
    this.type = 'json';
    this.status = err.status || 500;
    this.body = {'error': 'Things broke. Oh no!'};
    // delegating error to the regular applications
    this.app.emit('error', err, this);
  }
})
.use(route.routes())
.use(route.allowedMethods());

module.exports = app;
if(!module.parent) {
  app.listen(port);
  console.log('Application is running on port', port);
}
