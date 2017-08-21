const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase! this is awesome");
    console.log(request);
    console.log(response);
});

exports.listenToSymptoms = functions.database.ref('/u001/symptoms/{symptomId}').onWrite(event => {
    const symptom = event.data.val();
    console.log("A write has been executed!!!");
    console.log(symptom);
}); 