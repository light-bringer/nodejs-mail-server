'use strict'

const Q = require('q')
  , _ = require('lodash')
  , config = require(__dirname + '/../../config')
  , appDir = config.appDir
  , nodemailer = require("nodemailer");

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
let googleconf;
if (fs.existsSync(appDir + '/conf/google.conf.json')) {
    // Do something
    googleconf = require(appDir + '/conf/google.conf.json');
}


console.log(googleconf)

const oauth2Client = new OAuth2(
     process.env['GOOGLE_CLIENT_ID'] || googleconf.web.client_id, // ClientID
     process.env['GOOGLE_CLIENT_SECRET'] || googleconf.web.client_secret, // Client Secret
     process.env['GOOGLE_REDIRECT_URI'] || googleconf.web.redirect_uris // Redirect URL
);

oauth2Client.setCredentials({
     refresh_token: process.env['GOOGLE_REFRESH_TOKEN'] || googleconf.web.refresh_token
});

module.exports.hello = (req, res, next)=> {
  res.json({
    message: "Hello World"
  });
}

module.exports.sendMail = (req, res, next)=> {
  if(_.isNil(req.body)) {
    res.status(500).send({
      message : "Body is Empty."
    });
    if(_.isNil(req.body.to)) {
      res.status(500).send({
        message : "To Field is Empty."
      });
    }
    else if(_.isNil(req.body.body)) {
      res.status(500).send({
        message : "Body Field is Empty."
      });
    }
    else if(_.isNil(req.body.subject)) {
      res.status(500).send({
        message : "Subject Field is Empty."
      });
    }
  }
  else {
    let accessToken = oauth2Client.refreshAccessToken()
     .then(res => res.credentials.access_token);
    
    let smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "megatron.notification.bot@gmail.com",
          clientId: process.env['GOOGLE_CLIENT_ID'] || googleconf.web.client_id,
          clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || googleconf.web.client_secret,
          refreshToken: process.env['GOOGLE_REFRESH_TOKEN'] || googleconf.web.refresh_token,
          accessToken: accessToken
        }
      });
      let maildetails = mailbody(req.body);
      let mailOptions = {
        from: '"Debapriya Das", <megatron.notification.bot@gmail.com>',
        to: maildetails.to,
        subject: mailbody.subject,
        generateTextFromHTML: true,
        html: mailbody.body
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
  return data;
}