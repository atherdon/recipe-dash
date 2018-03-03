'use strict';


const loopback    = require('loopback');
const boot        = require('loopback-boot');

const forestLiana = require('forest-loopback');

const Raven = require('raven');
Raven.config('https://e63766d4bb0c489f9a98bd49581156ef@sentry.io/297792').install();


try {

  if ( process.env.NODE_ENV === 'development' || !process.env.NODE_ENV ) {
    // only use in development 
    require('dotenv').load();
    // config = require('../providers.json');  
  } else {
    // config = require('../providers.production.json');  
  }

  // console.log(config);
} catch (err) {
  
  Raven.captureException(err);
  process.exit(1); // fatal
}


var app = module.exports = loopback();

app.use( 
  forestLiana.init({
    modelsDir: __dirname + '/../common/models',  // The directory where all of your Loopback models are defined.
    secretKey: '262818171583bf9f325444fa69255b57e81899e022c25f6030239979a41dd1d1', // The secret key given my Forest.
    authKey: 'wKDr2vJ0nqqEj51Ma6Ooh3cfnopLlJf7', // Choose a secret authentication key.
    loopback: loopback // The loopback instance given by require('loopback').
  }) 
);


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
