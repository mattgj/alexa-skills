module.exports = function(app, route) {

    var RequestValidator = require('./request-validator'),
        launchCallback = null,
        endedCallback = null,
        intents = {};

    app.post(route, RequestValidator, function(req, res) {

        switch(req.body.request.type) {

            case "LaunchRequest": 
                if(launchCallback) 
                    launchCallback(req, res); 
                break;
            case "IntentRequest": 
                if(intents[req.body.request.intent.name])
                    intents[req.body.request.intent.name](req, res, req.body.request.intent.slots);
                break;
            case "SessionEndedRequest": 
                if(endedCallback) 
                    endedCallback(req, res, req.body.request.reason);
                break;

        }

    });

    this.launch = function(callback) {
        launchCallback = callback;
    };

    this.intent = function(name, callback) {
        intents[name] = callback;
    };

    this.ended = function(callback) {
        endedCallback = callback;
    };

    this.send = function(req, res, options) {

        if(!"shouldEndSession" in options)
            options.shouldEndSession = true;

        var response = {
            version: req.body.version,
            sessionAttributes: req.body.session.attributes,
            response: {
                shouldEndSession: options.shouldEndSession
            }
        }

        if(options.outputSpeech && options.outputSpeech.length) {
            response.response.outputSpeech = {
                type: "PlainText",
                text: options.outputSpeech
            };
        }

        if(options.reprompt && options.reprompt.length) {
            response.response.reprompt = {
                outputSpeech: {
                    type: "PlainText",
                    text: options.reprompt
                }
            };
        }

        if(options.card) {
            response.response.card = options.card;
        }

        res.send(response);

    };

    this.buildCard = function(title, content) {
        return {
            "type": "Simple",
            "title": title,
            "content": content
        };
    };

};