# Alexa Skills for Node
Alexa Skills for Node simplifies the process of creating new skills for Alexa.

## Install
`npm install alexa-skills`

This module relies on the [node-x509 module](https://github.com/Southern/node-x509) for verifying that the request is coming from Amazon. If you are developing on a Windows machine, you will need to [install OpenSSL](http://slproweb.com/products/Win32OpenSSL.html) to the default location, "C:\\OpenSSL-Win32" or "C:\\OpenSSL-Win64", before installing alexa-skills. OpenSSL is required for node-x509 to compile.

## Supported Card Types

### Simple Card

``` buildSimpleCard(title, content) ```

### Standard Card

``` buildStandardCard(title, text, smallImageUrl,largeImageUrl) ```

### Account Link Card

``` buildLinkAccountCard(text) ```


## Supported Output Types

### PlainText

```
var phrase = 'Hello World!';
	var options = {
		shouldEndSession: true,
		outputSpeech: phrase,
		card: alexa.buildCard("Card Title", phrase)
	};
```

### SSML

```
var phrase = '<speak><say-as interpret-as="spell-out">hello</say-as></speak>';
	var options = {
		shouldEndSession: true,
		outputSSML: phrase
	};
```

## Session Manipulation

You can access session attributes from the 4th paramter passed to your intent function, `sessionAttributes`. Remember to pass it back as the 3rd paramter to `alexa.send(...)`.

### Example

Assumes you have an intent called `SessionIntent` with a slot called `city`.

```
alexa.intent('SessionTest', function(req, res, slots, sessionAttributes) {

    var phrase = "";
    if(sessionAttributes.previous)
    {
        phrase = 'You previously said "' + sessionAttributes.previous + '". I have replaced that with "' + slots.city.value + '". Please say another city name.';
    }
    else
    {
        phrase = 'You said "' + slots.city.value + '". Please say another city name.';
    }

    sessionAttributes.previous = slots.city.value;

    var options = {
        shouldEndSession: false,
        outputSpeech: phrase
    };

    alexa.send(req, res, options, sessionAttributes);
});
````


## Example
```javascript
var express 	= require('express'),
	AlexaSkills = require('alexa-skills'),
	app			= express(),
	port 		= process.env.PORT || 8080,
	alexa = new AlexaSkills({
		express: app, // required
		route: "/", // optional, defaults to "/"
		applicationId: "your_alexa_app_id" // optional, but recommended. If you do not set this leave it blank
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

alexa.intent('Spell hello', function(req, res, slots) {

	console.log(slots);

	var phrase = '<speak><say-as interpret-as="spell-out">hello</say-as></speak>!';
	var options = {
		shouldEndSession: true,
		outputSSML: phrase
	};

	alexa.send(req, res, options);
});

alexa.ended(function(req, res, reason) {
	console.log(reason);
});

app.listen(port);
```
