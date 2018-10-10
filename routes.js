const express = require('express')
, config = require(__dirname + '/config')
, appDir = config.appDir
, router = express.Router();

const mailer = require(appDir + 'app/controllers/mail');

router.get('/', mailer.hello);
//router.post('/api/sendmail', mailer.sendMail);


module.exports = router;