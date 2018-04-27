var rest = require('../API/Restclient');
var builder = require('botbuilder');

//GET
exports.displayUserBanks = function getUserBanks(session, username){
    var url = 'https://MSA-Contoso-Bank-Renzo.azurewebsites.net/tables/MSAContosoBanktables';
    rest.getUserBanks(url, session, username,handleUserBanks)
};
//call back called from thebanks
function handleUserBanks(message, session, username) {
    var userbankresponse = JSON.parse(message);
    var userbankslist = [];
    for (var index in userbankresponse) {       //iterate and take information from easytable xml
        var usernameReceived = userbankresponse[index].username;    //user
        var bank = userbankresponse[index].bank;        //their banks

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {  //can detec any lower or upper cases
            if(userbankresponse.length - 1) { //this if statement ensures there is a comma before every non last element
                userbankslist.push(bank);
            }
            else {
                userbankslist.push(bank + ', ');
            }

            
        }        
    }
    //finally show user their banks through the banks list we created
    session.send("Hi %s, you are with the following banks: %s", username, userbankslist);                
}



//POST
//will be called from lius directory to post request 
exports.sendBank = function postBank(session, username, bank){
    var url = "https://MSA-Contoso-Bank-Renzo.azurewebsites.net/tables/MSAContosoBanktables";
    rest.postBank(url, username, bank); //the post request
};








//DELETE
exports.deleteBank = function deleteBank(session,username,bank){
    var url = 'https://MSA-Contoso-Bank-Renzo.azurewebsites.net/tables/MSAContosoBanktables';

    rest.getUserBanks(url,session, username,function(message,session,username){
     var   userbankresponse = JSON.parse(message);

        for(var i in userbankresponse) {

            if (userbankresponse[i].bank === bank && userbankresponse[i].username === username) {

                console.log(userbankresponse[i]);
                //calling deleteBank from rest
                rest.deleteBank(url,session,username,bank, userbankresponse[i].id)

            }
        }


    });


};