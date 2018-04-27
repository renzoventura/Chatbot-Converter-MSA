var request = require('request');


//GETTING INFO FROM API
exports.getExchangeRate = function getData(url,session, callback){

    request.get(url ,function(err,res,body){    //NO NEED FOR AUTH ITS FREE
        if(err){
            console.log(err);
        }else {
            callback(body,session);
        }
    });
};


//GETTING INFO FOR AZURE EASY TABLES
exports.getUserBanks = function getData(url, session, username, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};





//QNA MAKER
//being called from usersbank.js
exports.postQnAResults = function getData(url, session, question, callback){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': "c5bbaff9e6384b649d968aa50248f88c",
            'Content-Type':'application/json'
        },
        json: {
            "question" : question
        }
      };
  
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body, session, question);
        }
        else{
            console.log(error);
        }
      });
  };


  //POST function 
  // is called from users 
  exports.postBank = function getData(url, username, Bank){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "bank" : Bank
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};


//DELETE
//why does it have a callback is it even needed??
exports.deleteBank = function deleteData(url,session, username ,bank, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username, bank);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};