var rest = require('../API/Restclient');
var builder = require('botbuilder');


//POST
//will be called from lius directory to post request 
exports.sendBank = function postBank(session, username, bank){
    var url = 'https://MSA-Contoso-Bank-Renzo.azurewebsites.net/tables/MSAContosoBanktables';
    rest.postBank(url, username, bank); //the post request
};
