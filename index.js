module.exports = function(options) {

    var RequestValidator = require('./request-validator'),
        jsonParser = require('body-parser').json(),
        app = options.express,
        route = options.route || "/",
        appId = options.applicationId || "",
        launchCallback = null,
        endedCallback = null,
        intents = {};

    app.post(route, jsonParser, RequestValidator, function(req, res) {

        if(req.body.session.application.applicationId == appId || !appId.length) {

            switch(req.body.request.type) {

                case "LaunchRequest":
                    if(launchCallback)
                        launchCallback(req, res);
                    else
                        throw ("LaunchRequest not handled")
                    break;
                case "IntentRequest":

                    if(!req.body.session.attributes)
                        req.body.session.attributes = {};

                    if(intents[req.body.request.intent.name])
                        intents[req.body.request.intent.name](req, res, req.body.request.intent.slots, req.body.session.attributes);
                    else
                        throw ("IntentRequest for `" + req.body.request.intent.name + "` not handled")
                    break;
                case "SessionEndedRequest":
                    if(endedCallback)
                        endedCallback(req, res, req.body.request.reason);
                    res.json({});
                    break;
            }
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

    this.send = function(req, res, options, sessionAttributes) {

        if(!("shouldEndSession" in options))
            options.shouldEndSession = true;

        var response = {
            version: req.body.version,
            sessionAttributes: (sessionAttributes || req.body.session.attributes),
            response: {
                shouldEndSession: options.shouldEndSession
            }
        }

        if(options.outputSpeech && options.outputSpeech.length) {
            response.response.outputSpeech = {
                type: "PlainText",
                text: options.outputSpeech
            };
        } else if(options.outputSSML && options.outputSSML.length) {
            response.response.outputSpeech = {
                type: "SSML",
                ssml: options.outputSSML
            };
        }

        if(options.reprompt && options.reprompt.length) {
            response.response.reprompt = {
                outputSpeech: {
                    type: "PlainText",
                    text: options.reprompt
                }
            };
        } else if(options.repromptSSML && options.repromptSSML.length) {
            response.response.reprompt = {
                outputSpeech: {
                    type: "SSML",
                    ssml: options.repromptSSML
                }
            };
        }

        if(options.card) {
            response.response.card = options.card;
        }

        res.header("Content-Type", "application/json; charset=utf-8");
        res.json(response);

    };

    this.buildCard = function(title, content) {
        return this.buildSimpleCard(title, content);
    };

    this.buildSimpleCard = function(title, content) {
        var card = {};
        card.type = "Simple";
        card.title = title;
        card.content = content;
        return card;
    }

    this.buildStandardCard = function(title, text, smallImageUrl,largeImageUrl)
    {
        var card = {};
        card.type = "Standard";
        card.title = title;
        card.text = text;
        card.image = {};
        card.image.smallImageUrl = smallImageUrl;
        card.image.largeImageUrl = largeImageUrl;
        return card;
    }

    this.buildLinkAccountCard = function(text)
    {
        var card = {};
        card.type = "LinkAccount";
        card.text = text;
        return card;
    }

};
