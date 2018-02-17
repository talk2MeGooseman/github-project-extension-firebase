'use strict';var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _firebaseFunctions = require('firebase-functions');var functions = _interopRequireWildcard(_firebaseFunctions);
var _firebaseAdmin = require('firebase-admin');var admin = _interopRequireWildcard(_firebaseAdmin);






var _axios = require('axios');var _axios2 = _interopRequireDefault(_axios);

var _secrets = require('./secrets');var _secrets2 = _interopRequireDefault(_secrets);
var _AuthToken = require('./AuthToken');




var _TwitchAPI = require('./TwitchAPI');


var _GithubAPI = require('./GithubAPI');



var _Firebase = require('./Firebase');






var _Constants = require('./Constants');function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}admin.initializeApp(functions.config().firebase); // Set env configs by firebase functions:config:set github.secret="SECRET"
// Access set env configs via functions.config()
const db = admin.firestore(); // The Firebase Admin SDK to access the Firebase Realtime Database. 
const cors = require('cors')({
  origin: true });


function getSecret() {
  if (functions.config().twitch) {
    return functions.config().twitch.secret;
  } else {
    return _secrets2.default['twitch']['secret'];
  }
}

exports.setBroadcasterGithubInfo = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    let decoded;

    const {
      username } =
    req.param('data');
    const auth = req.param('auth');
    const secret = getSecret();

    try {
      decoded = (0, _AuthToken.verifyToken)(auth.token, secret);
    } catch (err) {
      console.log('JWT was invalid', err);
      res.status(401).json({});
      return;
    }

    let response = {};
    let status_code = 200;
    try {
      response = yield (0, _GithubAPI.getUserGithub)(username, decoded);
      yield (0, _Firebase.saveGithubInfo)(db, response, decoded);
    } catch (error) {
      status_code = 400;
      console.log(error);
      response = {};
    }

    console.log(response);
    res.status(status_code).json(response);
  }));
});

exports.getBroadcasterGithubInfo = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    try {
      // Get token from header
      const token = req.get(_Constants.JWT_HEADER);
      const secret = getSecret();

      // Verify our token
      let decoded = (0, _AuthToken.verifyToken)(token, secret);

      // Get user info for channel with token
      let user = yield (0, _Firebase.getBroadcasterInfo)(db, decoded.channel_id);

      if (user) {
        res.status(200).json(user);
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
      const token = req.get(_Constants.JWT_HEADER);
      const secret = getSecret();
      let decoded;

      try {
        decoded = (0, _AuthToken.decodeToken)(token, secret);
      } catch (error) {
        console.log('Token was invalid');
        res.status(403).end();
      }

      let user = yield (0, _Firebase.getBroadcasterInfo)(db, decoded.channel_id);

      let repos = [];
      if (user && user.selected_repos) {
        repos = user.selected_repos.map(function (repo_id) {
          return user.repos.find(function (repo) {
            return repo.id === repo_id;
          });
        });
      }

      if (user && repos) {
        res.status(200).json({
          user,
          repos });

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

    const token = req.get(_Constants.JWT_HEADER);
    const secret = getSecret();
    const selected_repos = req.param('selected_repos');

    try {
      decoded = (0, _AuthToken.verifyToken)(token, secret);
    } catch (error) {
      console.log('JWT was invalid', err);
      res.status(401).json({
        error: err });

      return;
    }

    try {
      if (selected_repos.length === 0) {
        throw 'Must have at least one Github Project selected';
      }

      yield (0, _Firebase.setSelectedRepos)(db, selected_repos, decoded);
    } catch (error) {
      response = {
        error: 'something went wrong saving your selected repos' };

      status_code = 400;
    }

    res.status(status_code).json(response);
  }));
});

exports.setUserSelectedRepos = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    let response = {};
    let status_code = 200;
    let decoded;

    const {
      selected_repos } =
    req.param('data');
    const auth = req.param('auth');
    const secret = getSecret();

    // Validate token and fetch data
    try {
      decoded = (0, _AuthToken.verifyToken)(auth.token, secret);

      if (selected_repos.length === 0) {
        throw 'Must have at least one Github Project selected';
      }
    } catch (err) {
      console.log('JWT was invalid', err);
      res.status(401).json({
        error: err });

      return;
    }

    try {
      let user = yield (0, _Firebase.getBroadcasterInfo)(db, decoded.channel_id);

      if (user) {
        // Validate the selected repos belong to user
        let exists = selected_repos.every(function (repo_id) {
          return user.repos.find(function (repo) {
            return repo.id === repo_id;
          });
        });

        if (!exists) {
          res.status(400).json({
            error: 'Error happend during config, please start over' });

        }

        response = yield (0, _Firebase.setSelectedRepos)(db, selected_repos, decoded);
        status_code = 201;
      } else {
        res.status(400).json({
          error: 'Your Github information does not exist, please restart setup' });

      }

      (0, _TwitchAPI.setExtensionConfigured)(decoded.channel_id, getSecret());
    } catch (error) {
      status_code = 400;
      console.log(error);
    }

    res.status(status_code).json(response);
  }));
});

exports.refreshUsersRepos = functions.https.onRequest((req, res) => {
  cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    let decoded;

    const token = req.get(_Constants.JWT_HEADER);
    const secret = getSecret();

    try {
      decoded = (0, _AuthToken.verifyToken)(token, secret);
    } catch (err) {
      console.log('JWT was invalid', err);
      res.status(401).json({});
      return;
    }

    let response = {};
    let status_code = 200;
    try {
      let user = yield (0, _Firebase.getBroadcasterInfo)(db, decoded.channel_id);
      const repos = yield (0, _GithubAPI.getGithubRepos)(user.github_user.login, decoded.channel_id);
      yield (0, _Firebase.saveGithubRepos)(db, repos, decoded);
      response = { repos };
    } catch (error) {
      status_code = 400;
      console.log(error);
      response = {};
    }

    console.log(response);
    res.status(status_code).json(response);
  }));
});