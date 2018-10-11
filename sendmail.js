const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const googleconf = require('./conf/google.conf.json')

console.log(googleconf)

const oauth2Client = new OAuth2(
     googleconf.web.client_id, // ClientID
     googleconf.web.client_secret, // Client Secret
     googleconf.web.redirect_uris // Redirect URL
);


oauth2Client.setCredentials({
     refresh_token: googleconf.web.refresh_token
});

const accessToken = oauth2Client.refreshAccessToken()
     .then(res => res.credentials.access_token);

const smtpTransport = nodemailer.createTransport({
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
}
});


const mailOptions = {
     from: "megatron.notification.bot@gmail.com",
     to: "samarth.gr@efi.com",
     subject: "Node.js Email with Secure OAuth",
     generateTextFromHTML: true,
     html: "<b>test</b>"
};


smtpTransport.sendMail(mailOptions, (error, response) => {
     error ? console.log(error) : console.log(response);
     smtpTransport.close();
});
