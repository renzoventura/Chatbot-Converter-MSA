var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');


// restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// bot creation
var connector = new builder.ChatConnector({
    appId: "e00c72e9-7a71-4d06-806e-b8308c1dbb0a",
    appPassword: "gNPW69349$_juhfzcKJNG}="
});

//listen
server.post('/api/messages', connector.listen());

//receive
var bot = new builder.UniversalBot(connector, function (session) {

    session.send('Sorry I did not understand that.');
});

// calls luis
luis.startDialog(bot);
 