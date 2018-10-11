'use strict'

const express = require('express')
, bodyParser = require('body-parser')
, _ = require('lodash')
, fs = require('fs')
, https = require('https');


const config = require(__dirname + '/config')
  , appDir = config.appDir
  , app = express();


const privateKey  = fs.readFileSync(appDir + '/certs/client-key.pem', 'utf8');
const certificate = fs.readFileSync(appDir + '/certs/client-cert.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || config.port);
app.set('https-port', process.env.HTTPSPORT || config.httpsport);


app.use((req, res, next)=> {
 res.header('Access-Control-Allow-Origin', '*');
 res.header( "Access-Control-Allow-Methods" , "GET,POST");
 res.header("Access-Control-Allow-Headers", '*');
 res.header("Access-Control-Expose-Headers", "*");
 next();
});

app.use('/', require(appDir + '/routes.js'));

let httpsserver = https.createServer(credentials, app);


let server =  app.listen(app.get('port'), err=> {
  if(err) {
    console.errror(err);
  }
  console.log(server.address());
  console.log("Express Server IP is:  " + server.address().address);
  console.log('Express server listening on port ' + server.address().port);
  

});

let httpssrv = httpsserver.listen(app.get('https-port'), err=> {
  if(err) {
    console.error(error);
  }
  console.log(httpssrv.address());
  console.log("Express Server HTTPS IP is:  " + httpssrv.address().address);
  console.log('Express server HTTPS listening on port ' + httpssrv.address().port);
});
  
