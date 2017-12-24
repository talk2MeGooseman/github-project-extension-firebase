'use strict';const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true });

// Set env configs by firebase functions:config:set github.secret="SECRET"
// Access set env configs via functions.config()
const db = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.helloSaveWorld = functions.https.onRequest((request, response) => {
  var saveRef = db.collection("save");
  saveRef.doc("World").set({
    location: 'Milky Way' });


  response.status(200).end();
});

exports.broadcastSaveData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.send(req.query);
  });
});