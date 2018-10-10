const express = require('express')
, bodyParser = require('body-parser')
, _ = require('lodash');

const config = require(__dirname + '/config')
  , appDir = config.appDir
  , app = express();
  

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || config.port);

app.use((req, res, next)=> {
 res.header('Access-Control-Allow-Origin', '*');
 res.header( "Access-Control-Allow-Methods" , "GET,POST");
 res.header("Access-Control-Allow-Headers", '*');
 res.header("Access-Control-Expose-Headers", "*");

});
app.use('/api/', require(appDir + '/routes'));


let server =  app.listen(app.get('port'), (err)=> {
  if(err) {
    console.log("Server failed to start");
  }
  console.log(server.address());
  console.log("Express Server IP is:  " + server.address().address);
  console.log('Express server listening on port ' + server.address().port);

});
