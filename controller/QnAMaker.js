var rest = require('../API/Restclient');

// function below called from restclient
//callback afterwards from ahndel
exports.talkToQnA = function postQnAResults(session, question){
    var url = "https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/b6b3f184-f36d-415a-8d72-5e7ad261ee9d/generateAnswer";
    rest.postQnAResults(url, session, question, handleQnA)
};

function handleQnA(body, session, question) {
    session.send(body.answers[0].answer);
};