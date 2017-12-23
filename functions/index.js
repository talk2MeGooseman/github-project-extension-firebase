'use strict';const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');

// Set env configs by firebase functions:config:set github.secret="SECRET"
// Access set env configs via functions.config()
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//
// Example functions to store then uppercase string
//
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database().ref('/messages').push({
        original: original }).
    then(snapshot => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.redirect(303, snapshot.ref);
    });
});

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original').
onWrite(event => {
    // Grab the current value of what was written to the Realtime Database.
    const original = event.data.val();
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    return event.data.ref.parent.child('uppercase').set(uppercase);
});