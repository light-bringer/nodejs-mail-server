'use strict'

const Q = require('q')
  , _ = require('lodash')
  , config = require(__dirname + '/../../config')
  , appDir = config.appDir
  , nodemailer = require("nodemailer");

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const googleconf = require(appDir + '/conf/google.conf.json')

console.log(googleconf)

const oauth2Client = new OAuth2(
     googleconf.web.client_id, // ClientID
     googleconf.web.client_secret, // Client Secret
     googleconf.web.redirect_uris // Redirect URL
);

oauth2Client.setCredentials({
     refresh_token: googleconf.web.refresh_token
});

module.exports.hello = (req, res, next)=> {
  res.json({
    message: "Hello World"
  });
}

module.exports.sendMail = (req, res, next)=> {
  if(_.isNil(req.body)) {
    res.status(500).send({
      message : "Body is Empty"
    });
  }
  else {
    let accessToken = oauth2Client.refreshAccessToken()
     .then(res => res.credentials.access_token);
    
    let smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "megatron.notification.bot@gmail.com",
          clientId: googleconf.web.client_id,
          clientSecret: googleconf.web.client_secret,
          refreshToken: googleconf.web.refresh_token,
          accessToken: accessToken
        }
      });
      let mailOptions = {
        from: "Debapriya Das, <megatron.notification.bot@gmail.com>",
        to: "yodebu@gmail.com",
        subject: "Node.js Email with Secure OAuth",
        generateTextFromHTML: true,
        html: "<b>test</b>"
      };
      smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.error(error);
          res.status(400).send({
            message: "Error"
          })
        }
        else {
          console.log(response);
          res.status(200).send({
            message: response
          })
        }
        smtpTransport.close();
      });
    }

}

function mailbody(body) {
  data = {};
  data['to'] = body.to;
  data['subject'] = body.subject;
  data['body'] = body.body;
  return data  
}