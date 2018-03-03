'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var loopback = require('loopback');
var boot = require('loopback-boot');

const forestLiana = require('forest-loopback');

Raven.config('https://e63766d4bb0c489f9a98bd49581156ef@sentry.io/297792').install()

var app = module.exports = loopback();

app.use( forestLiana.init({
  modelsDir: __dirname + '/../common/models',  // The directory where all of your Loopback models are defined.
  secretKey: '262818171583bf9f325444fa69255b57e81899e022c25f6030239979a41dd1d1', // The secret key given my Forest.
  authKey: 'wKDr2vJ0nqqEj51Ma6Ooh3cfnopLlJf7', // Choose a secret authentication key.
  loopback: loopback // The loopback instance given by require('loopback').
}) );


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
