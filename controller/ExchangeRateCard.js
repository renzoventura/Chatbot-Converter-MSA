var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getExchangeRate' in RestClient.js  with 'displayExchangeRateCards' as callback to get list of restaurant information
exports.displayExchangeRateCards = function getExchangeRate(curr1, curr2, session){
    var key = '8XWVUEG2ER4Y4QV4'
    
    var url ='https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency='+ curr1.toUpperCase() +'&to_currency=' + curr2.toUpperCase() +'&apikey=' + key;
    rest.getExchangeRate(url,session,displayExchangeRateCards);
}



//this function will call getExchangeRate function ABOVE.
function displayExchangeRateCards(message, session) {
    var attachment = [];
    var account = JSON.parse(message);

    //For each restaurant, add herocard with name, address, image and url in attachment
    for (var i in account) {

        var From_Currency_Code = account["Realtime Currency Exchange Rate"]["1. From_Currency Code"];

        var From_Currency_Name = account["Realtime Currency Exchange Rate"]["2. From_Currency Name"]; 

        var To_Currency_Code = account["Realtime Currency Exchange Rate"]["3. To_Currency Code"];
        
        var To_Currency_Name = account["Realtime Currency Exchange Rate"]["4. To_Currency Name"];

        var ConversionAmount = account["Realtime Currency Exchange Rate"]["5. Exchange Rate"];

        //is the message being sent
        var convertmessage = "The exchange rate between " + From_Currency_Name + " and " + To_Currency_Name + " is...";
        var conversionReply = "1 " + From_Currency_Code.toUpperCase() + " is equals to " + ConversionAmount.slice(0, 5) + " " + To_Currency_Code.toUpperCase();

    }
    session.send(convertmessage);
    session.send(conversionReply);
}