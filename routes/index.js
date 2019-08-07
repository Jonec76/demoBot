var express = require('express');
var router = express.Router();
var config = require('../config');
var axios = require('axios')

const POST_ID = config.fb.postId
var access_token = config.fb.token
var messages = config.messages

router.get('/', function (req, res, next) {
	if (req.query['hub.verify_token'] === config.fb.webhook) {
		res.send(req.query['hub.challenge']);
		console.log("Verified")
	} else {
		res.send('Error, wrong token');
	}
});

function getMessages(){
	return messages[Math.floor(Math.random()*messages.length)];
}

async function reply(comment_id, access_token){
	let message = getMessages()
	await axios.post("https://graph.facebook.com/v3.2/" + comment_id + "/comments?access_token=" + access_token,  {message: message}).catch(error => {})
}

router.post('/', function (req, res) {
	let body = req.body;
	body.entry.forEach(function (event) {
		if (event.hasOwnProperty('changes')) { 
			let commentBody = event["changes"][0]["value"]
			console.log(commentBody)
			if(commentBody.hasOwnProperty('comment_id') && commentBody["post_id"] === POST_ID){// 文章留言
				comment = event["changes"][0]["value"]["message"]
				let comment_id = commentBody["comment_id"]
				reply(comment_id, access_token)
			}
		}else if(event.hasOwnProperty('messaging')){
			// Handle the messaging event
		}
	})
})

module.exports = router;
