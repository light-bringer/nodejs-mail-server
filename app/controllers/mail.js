'use strict'

const Q = require('q')
  , _ = require('lodash')
  , config = require(__dirname + '/../../config')
  , appDir = config.appDir
  

module.exports.hello = (req, res, next)=> {
  res.json({
    message: "Hello World"
  });
}