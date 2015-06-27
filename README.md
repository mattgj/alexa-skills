# Alexa Skills for Node
Alexa Skills for Node simplifies the process of adding new skills to Alexa. 

## Install
`npm install alexa-skills`

## Example
```
var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	AlexaSkills = require('alexa-skills'),
	app			= express(),
	port 		= process.env.PORT || 8080;


app.use(bodyParser.json());
var alexa = new AlexaSkills(app, '/');

alexa.launch(function(req, res) {

	var phrase = "Welcome to my app!";
	var options = {shouldEndSession: false, outputSpeech: phrase, reprompt: "What was that?"};
	alexa.send(req, res, options);

});

alexa.intent('Hello', function(req, res, slots) {

	var phrase = 'Hello World!';
	var options = {shouldEndSession: true, outputSpeech: phrase, card: alexa.buildCard("Card Title", phrase) };
	alexa.send(req, res, options);

});

alexa.ended(function(req, res, reason) {
	console.log(reason);
});

app.listen(port);
```
