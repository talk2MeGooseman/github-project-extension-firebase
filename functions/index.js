'use strict';var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);let setExtensionConfigured = (() => {var _ref = (0, _asyncToGenerator3.default)(






















































  function* (channel_id) {
    try {
      const token = signToken(getSecret());

      let response = yield axios({
        method: 'PUT',
        url: `${TWITCH_BASE_EXTENSION_URL}/${EXTENSION_ID}/${EXTENSION_VERSION}/required_configuration?channel_id=${channel_id}`,
        data: {
          "required_configuration": CONFIG_KEY },

        headers: {
          'Content-Type': 'application/json',
          'Client-id': EXTENSION_ID,
          'Authorization': `Bearer ${token}` } });



      return yield response.json;
    } catch (error) {
      console.log(error);
    }
  });return function setExtensionConfigured(_x) {return _ref.apply(this, arguments);};})();let setBroadcasterGithubUser = (() => {var _ref2 = (0, _asyncToGenerator3.default)(

  function* (username, decoded) {
    const { data } = yield axios.get(`${GITHUB_BASE_URL}/users/${username}`);

    var saveRef = db.collection(BROADCASTER_COLLECTION);
    const user = {
      user_id: decoded.user_id,
      github_user: {
        login: data.login,
        avatar_url: data.avatar_url,
        repos_url: data.repos_url,
        public_repos: data.public_repos } };



    saveRef.doc(decoded.channel_id).set(user);

    return user;
  });return function setBroadcasterGithubUser(_x2, _x3) {return _ref2.apply(this, arguments);};})();let updateBroadcasterGithubUserInfo = (() => {var _ref3 = (0, _asyncToGenerator3.default)(

  function* (avatar_url, selected_repos, decoded) {
    var saveRef = db.collection(BROADCASTER_COLLECTION);
    return saveRef.doc(decoded.channel_id).set({
      github_user: {
        avatar_url: avatar_url },

      selected_repos: selected_repos },
    { merge: true });
  });return function updateBroadcasterGithubUserInfo(_x4, _x5, _x6) {return _ref3.apply(this, arguments);};})();let updateSelectedRepos = (() => {var _ref4 = (0, _asyncToGenerator3.default)(

  function* (selected_repos, decoded) {
    var saveRef = db.collection(BROADCASTER_COLLECTION);
    return saveRef.doc(decoded.channel_id).set({
      selected_repos: selected_repos },
    { merge: true });
  });return function updateSelectedRepos(_x7, _x8) {return _ref4.apply(this, arguments);};})();let getGithubUserRepos = (() => {var _ref5 = (0, _asyncToGenerator3.default)(

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
  });return function getGithubUserRepos(_x9, _x10) {return _ref5.apply(this, arguments);};})();let getSelectedRepos = (() => {var _ref6 = (0, _asyncToGenerator3.default)(

  function* (channel_id, selected_repos) {
    var reposRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id).collection(REPOS_COLLECTION);

    return selected_repos.map((() => {var _ref7 = (0, _asyncToGenerator3.default)(function* (repo_id) {
        const doc = yield reposRef.doc(repo_id).get();
        return doc.data();
      });return function (_x13) {return _ref7.apply(this, arguments);};})());
  });return function getSelectedRepos(_x11, _x12) {return _ref6.apply(this, arguments);};})();let getBroadcasterRepos = (() => {var _ref8 = (0, _asyncToGenerator3.default)(

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
  });return function getBroadcasterRepos(_x14) {return _ref8.apply(this, arguments);};})();let getBroadcasterInfo = (() => {var _ref9 = (0, _asyncToGenerator3.default)(

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
  });return function getBroadcasterInfo(_x15) {return _ref9.apply(this, arguments);};})();function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const functions = require('firebase-functions');const axios = require('axios');const jwt = require('jsonwebtoken');const secrets = require('./secrets'); // The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');admin.initializeApp(functions.config().firebase);const cors = require('cors')({ origin: true }); // Set env configs by firebase functions:config:set github.secret="SECRET"
// Access set env configs via functions.config()
const db = admin.firestore();const GITHUB_BASE_URL = 'https://api.github.com';const JWT_HEADER = 'x-extension-jwt';const BROADCASTER_COLLECTION = 'broadcasters';const REPOS_COLLECTION = 'repos';const TWITCH_BASE_EXTENSION_URL = 'https://api.twitch.tv/extensions';const EXTENSION_VERSION = '0.0.1';const EXTENSION_ID = 'yncbd7i177on3ia536r307nlvt8g1w';const EXTENSTION_USER_ID = '120750024';const CONFIG_KEY = 'config-1';function getSecret() {if (functions.config().twitch) {return functions.config().twitch.secret;} else {return secrets['twitch']['secret'];}}function decodeToken(token, secret) {const secret_decoded = new Buffer(secret, 'base64');return jwt.verify(token, secret_decoded);}function verifyToken(token, secret) {const decoded = decodeToken(token, secret);if (decoded.role != 'broadcaster') throw 'Must be broadcaster role.';return decoded;}function signToken(secret) {const secret_decoded = new Buffer(secret, 'base64');const tokenObj = { "user_id": EXTENSTION_USER_ID, "role": "external" };return jwt.sign(tokenObj, secret_decoded, { expiresIn: '1h' });}exports.setBroadcasterGithubInfo = functions.https.onRequest((req, res) => {cors(req, res, (0, _asyncToGenerator3.default)(function* () {
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
      let user = yield setBroadcasterGithubUser(username, decoded);
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

exports.viewBroadcasterData = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    try {
      const token = req.get(JWT_HEADER);
      const secret = getSecret();
      let decoded;

      try {
        decoded = decodeToken(token, secret);
      } catch (error) {
        console.log('Token was invalid');
        res.status(403).end();
      }

      let user = yield getBroadcasterInfo(decoded.channel_id);

      let repos = [];
      if (user) {
        let data = yield getSelectedRepos(decoded.channel_id, user.selected_repos);
        for (let index = 0; index < data.length; index++) {
          let repo = yield data[index];
          console.log(repo);
          repos.push(repo);
        }
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

exports.selectedReposOrder = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    let response = {};
    let status_code = 200;
    let decoded;

    const token = req.get(JWT_HEADER);
    const secret = getSecret();
    const selected_repos = req.param('selected_repos');

    try {
      decoded = verifyToken(token, secret);
    } catch (error) {
      console.log('JWT was invalid', err);
      res.status(401).json({ error: err });
      return;
    }

    try {
      if (selected_repos.length === 0) {
        throw 'Must have at least one Github Project selected';
      }

      yield updateSelectedRepos(selected_repos, decoded);
    } catch (error) {
      response = { error: 'something went wrong saving your selected repos' };
      status_code = 400;
    }

    res.status(status_code).json(response);
  }));
});

exports.updateBroadcasterGithubConfigs = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    let response = {};
    let status_code = 200;
    let decoded;

    const { avatar_url, selected_repos } = req.param('data');
    const auth = req.param('auth');
    const secret = getSecret();

    try {
      decoded = verifyToken(auth.token, secret);

      if (selected_repos.length === 0) {
        throw 'Must have at least one Github Project selected';
      }
    } catch (err) {
      console.log('JWT was invalid', err);
      res.status(401).json({ error: err });
      return;
    }

    try {
      let user = yield getBroadcasterInfo(decoded.channel_id);

      if (user) {
        let repos = yield getBroadcasterRepos(decoded.channel_id);
        let exists = selected_repos.every(function (repo_id) {
          return repos.find(function (repo) {
            return repo.id === repo_id;
          });
        });

        if (!exists) {
          res.status(400).json({ error: 'Error happend during config, please start over' });
        }

        let result = yield updateBroadcasterGithubUserInfo(avatar_url, selected_repos, decoded);
        status_code = 201;
        response = { result };

      } else {
        res.status(400).json({ error: 'Your Github information does not exist, please restart setup' });
      }

      setExtensionConfigured(decoded.channel_id);
    } catch (error) {
      status_code = 400;
      console.log(error);
    }

    res.status(status_code).json(response);
  }));
});