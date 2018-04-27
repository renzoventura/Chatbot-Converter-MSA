var builder = require('botbuilder');
var account = require('./ExchangeRateCard');
var bank = require('./UserBanks');
var qna = require('./QnAMaker');





exports.startDialog = function (bot) {
    //put api here
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/524d9e6c-051e-4c6e-b2c8-050c72e27763?subscription-key=5a929f0001c44918ad072184eca97c90&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    //HELLOINTENT
    bot.dialog('HelloIntent', function (session, args) {
        if (!isAttachment(session)) {
            //there is no entity needed just say hi. 
            // can fix later to ask if the ywant to log in
            session.send("Hello");
            // can fix later to ask if the ywant to log in
       }
    }).triggerAction({
        matches: 'HelloIntent'
    });

    //Exchange intent 
    bot.dialog('ExchangeRateIntent', function (session, args) {
        
                if (!isAttachment(session)) {
                    
                    // Pulls out the currency 1 and 2 entity from the session if it exists
                    var curr1Entity = builder.EntityRecognizer.findEntity(args.intent.entities, 'curr1');
                    var curr2Entity = builder.EntityRecognizer.findEntity(args.intent.entities, 'curr2');
                    // Checks if the the 2 entities were found
                    if (curr1Entity && curr2Entity) {
                        session.send("Converting currencies...");
                        //session.send("The exchange rate between " + curr1Entity.entity.toUpperCase() + " and " + curr2Entity.entity.toUpperCase() + " is ");
                        account.displayExchangeRateCards( curr1Entity.entity , curr2Entity.entity , session);
                    } else {
                        session.send("Currency you entered is not identified. Please try again.");
                    }
                }
            }).triggerAction({
                matches: 'ExchangeRateIntent'
            });


    //get user banks
    bot.dialog('UserBankIntent', [
            function (session, args, next) {
                session.dialogData.args = args || {};        
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter your name...");                
                } else {
                    next(); //skipping if there is a name already in session
                }
            },
            function (session, results, next) {
                if (!isAttachment(session)) {

                    if (results.response) {
                        session.conversationData["username"] = results.response;
                    }
                    
                    session.send("Retrieving...");
                    //this part not working
                    bank.displayUserBanks(session, session.conversationData["username"]);  
                    //session.send("worked!");
                }
            }
        ]).triggerAction({
            matches: 'UserBankIntent'
        });

      

        //logout
        //-----------NOT WORKING-----------
        //resolved
        bot.dialog('LogoutIntent', [
            function (session, args, next) {
                session.dialogData.args = args || {};        
                if (session.conversationData["username"]) {     //checks if user is logged on
                    session.send("Logging out...");   
                    session.endConversation(); //gives out "oops" error fix later 
                    session.send("Logged out."); 
                } else {
                    session.send("You are not logged on.");    
             
                }
            }, function (session,results,next){
                session.send("it reached");

            }
    
        ]).triggerAction({
            matches: 'LogoutIntent'
        });


        //QaA DIALOG LUIS
        //works
        bot.dialog('QnAIntent', [
            function (session, args, next) {
                session.dialogData.args = args || {};
                builder.Prompts.text(session, "What is your question?");
            },
            function (session, results, next) {
               // builder.Prompts.text(session, "1");
                qna.talkToQnA(session, results.response); //not working //jk found it didnt had qna global variable 
                //builder.Prompts.text(session, "2");
            }
        ]).triggerAction({
            matches: 'QnAIntent'
        });


        



        
        //POST
        //no working why?
        //has been defined in userbanks.js should be working cant find error
        bot.dialog('AddTicket', [
            function (session, args, next) {
                session.dialogData.args = args || {};        
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter your name...");                
                } else {
                    next(); // Skip if we entered name in session
                }
            },
            function (session, results, next) {
                if (!isAttachment(session)) {

                    if (results.response) {
                        session.conversationData["username"] = results.response;
                    }
                    // Pulls out the bank entity from the session if it exists
                    var bank = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'bank');
        
                    // if condition for the ticket entity exist?
                    if (bank) {
                        session.send('You are now with: ', bank.entity);
                        //has been defined but cant find anything
                        bank.sendBank(session, session.conversationData["username"], bank.entity); //PELASE WORK
        
                    } else {
                        //if enitity not found
                        session.send("No bank identified");
                    }
                }
            }
        ]).triggerAction({
            matches: 'AddTicket'
        });




//  DELETE
bot.dialog('deleteAccount', [
    function (session, args, next) {
        session.dialogData.args = args || {};
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Enter a username to setup your account.");
        } else {
            next(); // Skip if we already have entered a name in session
        }
    },
    function (session, results,next) {
    if (!isAttachment(session)) {

        // Pulls out the food entity from the session if it exists
        var bank = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'bank');

        // Checks if the for entity was found
        if (bank) {
            session.send('Now deleting \'%s\'...', bank.entity);
             //has been defined but cant find anything
            //has been defined in userbanks.js should be working cant find error

            bank.deleteBank(session, session.conversationData['username'] , bank.entity); //why is it not working //not a function???
            
        } else {
            session.send("No Bank identified! Please try again");
        }
    }

}        ]).triggerAction({
    matches: 'deleteAccount'
});




}

function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        return true;
    }
    else {
        return false;
    }
}