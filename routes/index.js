var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.query['hub.verify_token'] === config.fb.webhook) {
		res.send(req.query['hub.challenge']);
		console.log("Verified")
	} else {
		res.send('Error, wrong token');
	}
});


module.exports = router;
