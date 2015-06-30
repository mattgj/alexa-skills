# Alexa Skills for Node
Alexa Skills for Node simplifies the process of creating new skills for Alexa.

## Install
`npm install alexa-skills`

This module relies on the [node-x509 module](https://github.com/Southern/node-x509) for verifying that the request is coming from Amazon. If you are developing on a Windows machine, you will need to [install OpenSSL](http://slproweb.com/products/Win32OpenSSL.html) to the default location, "C:\\OpenSSL-Win32" or "C:\\OpenSSL-Win64", before installing alexa-skills. OpenSSL is required for node-x509 to compile.

## Example
```javascript
var express 	= require('express'),
	AlexaSkills = require('alexa-skills'),
	app			= express(),
	port 		= process.env.PORT || 8080,
	alexa = new AlexaSkills({
		express: app, // required
		route: "/", // optional, defaults to "/"
		applicationId: "your_alexa_app_id" // optional, but recommended
	});

alexa.launch(function(req, res) {

	var phrase = "Welcome to my app!";
	var options = {
		shouldEndSession: false,
		outputSpeech: phrase,
		reprompt: "What was that?"
	};

	alexa.send(req, res, options);
});

alexa.intent('Hello', function(req, res, slots) {

	console.log(slots);

	var phrase = 'Hello World!';
	var options = {
		shouldEndSession: true,
		outputSpeech: phrase,
		card: alexa.buildCard("Card Title", phrase)
	};

	alexa.send(req, res, options);
});

alexa.ended(function(req, res, reason) {
	console.log(reason);
});

app.listen(port);
```
