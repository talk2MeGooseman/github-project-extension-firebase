'use strict';var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const functions = require('firebase-functions');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true });

// Set env configs by firebase functions:config:set github.secret="SECRET"
// Access set env configs via functions.config()
const db = admin.firestore();

exports.helloSaveWorld = functions.https.onRequest((request, response) => {
  var saveRef = db.collection("save");
  saveRef.doc("World").set({
    location: 'Milky Way' });


  response.status(200).end();
});

exports.fetchBroadcasterGithubInfo = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    let response;
    let status_code;
    let decoded;
    let jwt_secret;


    if (functions.config().twitch) {
      jwt_secret = functions.config().twitch.secret;
    } else {
      jwt_secret = secrets['twitch']['secret'];
    }

    const { username } = req.param('data');
    const auth = req.param('auth');

    try {
      const jwt_secret_decoded = new Buffer(jwt_secret, 'base64');
      decoded = jwt.verify(auth.token, jwt_secret_decoded);
      console.log(decoded);
    } catch (err) {
      console.log('JWT was invalid');
      res.status(401).json({});
      return;
    }

    try {
      const { data } = yield axios.get(`https://api.github.com/users/${username}`);
      status_code = 200;

      var saveRef = db.collection("brodcasters");

      saveRef.doc(decoded.channel_id).set({
        user_id: decoded.user_id,
        github_user: {
          login: data.login,
          avatar_url: data.avatar_url,
          repos_url: data.repos_url,
          public_repos: data.public_repos } });



    } catch (error) {
      status_code = 400;
      response = {};
      console.log(error);
    }

    res.status(status_code).json({});
  }));
});