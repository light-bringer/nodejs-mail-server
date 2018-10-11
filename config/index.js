'use strict'

const isThere = require('is-there');
let currentEnv = process.env.NODE_ENV || 'development';

currentEnv = currentEnv.toLowerCase();
const envFilePath = __dirname + "/env/" + currentEnv + ".js";

var environmentOptions, projectName;

if(!isThere(envFilePath))
  console.log("Environment File is Missing");
else
  environmentOptions = require(envFilePath);
console.log(__dirname)
projectName = environmentOptions.projectName || "barebone-node-api-server";

module.exports = {
  httpsport : environmentOptions.server.httpsport,
  port: environmentOptions.server.port,
  serverHost: environmentOptions.server.host + ':' +environmentOptions.server.port,
  appDir: __dirname.match(new RegExp("(.*\/("+ projectName +")\/)(.*)$"))[1]
}