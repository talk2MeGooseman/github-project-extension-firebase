'use strict';var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);let getGithubUser = (() => {var _ref = (0, _asyncToGenerator3.default)(
































  function* (username, decoded) {
    const { data } = yield axios.get(`${GITHUB_BASE_URL}/users/${username}`);

    var saveRef = db.collection(BROADCASTER_COLLECTION);
    saveRef.doc(decoded.channel_id).set({
      user_id: decoded.user_id,
      github_user: {
        login: data.login,
        avatar_url: data.avatar_url,
        repos_url: data.repos_url,
        public_repos: data.public_repos } },


    { merge: true });

    return data;
  });return function getGithubUser(_x, _x2) {return _ref.apply(this, arguments);};})();let getGithubUserRepos = (() => {var _ref2 = (0, _asyncToGenerator3.default)(

  function* (username, channel_id) {
    const { data } = yield axios.get(`${GITHUB_BASE_URL}/users/${username}/repos`, { type: 'all' });

    var batch = db.batch();
    var reposRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id).collection(REPOS_COLLECTION);

    data.forEach(function (repo) {
      let { name, html_url, full_name, description, language } = repo;
      let localRepoRef = reposRef.doc(`${repo.id}`);
      batch.set(localRepoRef, {
        name,
        html_url,
        full_name,
        description,
        language });

    });

    // Commit the batch
    return batch.commit().then(function () {
      return data;
    });
  });return function getGithubUserRepos(_x3, _x4) {return _ref2.apply(this, arguments);};})();let getBroadcasterRepos = (() => {var _ref3 = (0, _asyncToGenerator3.default)(



  function* (channel_id) {
    const reposRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id).collection(REPOS_COLLECTION);

    try {
      const reposCollection = yield reposRef.get();
      let repos = [];
      reposCollection.forEach(function (repoSnap) {
        let repoData = repoSnap.data();
        repoData.id = repoSnap.id;
        repos.push(repoData);
      });

      return repos;
    } catch (error) {
      console.log(error);
      return null;
    }
  });return function getBroadcasterRepos(_x5) {return _ref3.apply(this, arguments);};})();let getBroadcasterInfo = (() => {var _ref4 = (0, _asyncToGenerator3.default)(

  function* (channel_id) {
    const channelRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id);
    try {
      const doc = yield channelRef.get();
      // returns promise till data is resolved
      return doc.data();
    } catch (error) {
      console.log(error);
      return null;
    }
  });return function getBroadcasterInfo(_x6) {return _ref4.apply(this, arguments);};})();function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const functions = require('firebase-functions');const axios = require('axios');const jwt = require('jsonwebtoken');const secrets = require('./secrets'); // The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');admin.initializeApp(functions.config().firebase);const cors = require('cors')({ origin: true }); // Set env configs by firebase functions:config:set github.secret="SECRET"
// Access set env configs via functions.config()
const db = admin.firestore();const GITHUB_BASE_URL = 'https://api.github.com';const JWT_HEADER = 'x-extension-jwt';const BROADCASTER_COLLECTION = 'broadcasters';const REPOS_COLLECTION = 'repos';function getSecret() {if (functions.config().twitch) {return functions.config().twitch.secret;} else {return secrets['twitch']['secret'];}}function verifyToken(token, secret) {const secret_decoded = new Buffer(secret, 'base64');const decoded = jwt.verify(token, secret_decoded);if (decoded.role != 'broadcaster') throw 'Must be broadcaster role.';return decoded;}exports.setBroadcasterGithubInfo = functions.https.onRequest((req, res) => {cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    let response = {};
    let status_code = 200;
    let decoded;

    const { username } = req.param('data');
    const auth = req.param('auth');
    const secret = getSecret();

    try {
      decoded = verifyToken(auth.token, secret);
    } catch (err) {
      console.log('JWT was invalid', err);
      res.status(401).json({});
      return;
    }

    try {
      let user = getGithubUser(username, decoded);
      let repos = yield getGithubUserRepos(username, decoded.channel_id);
      response = {
        user,
        repos };

    } catch (error) {
      status_code = 400;
      console.log(error);
    }

    res.status(status_code).json(response);
  }));
});

exports.getBroadcasterGithubInfo = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    try {
      const token = req.get(JWT_HEADER);
      const secret = getSecret();

      // Should be generic
      let decoded = verifyToken(token, secret);
      let user = yield getBroadcasterInfo(decoded.channel_id);

      let repos;
      if (user) {
        repos = yield getBroadcasterRepos(decoded.channel_id);
      }

      if (user && repos) {
        res.status(200).json({ user, repos });
      } else {
        res.status(404).end();
      }

    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }));
});