'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.getBroadcasterInfo = exports.getSelectedRepos = exports.setSelectedRepos = exports.saveGithubInfo = undefined;var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);let saveGithubInfo = exports.saveGithubInfo = (() => {var _ref = (0, _asyncToGenerator3.default)(








  function* (data, decoded) {
    var saveRef = db.collection(BROADCASTER_COLLECTION);

    saveRef.doc(decoded.channel_id).set(data);
  });return function saveGithubInfo(_x, _x2) {return _ref.apply(this, arguments);};})();let setSelectedRepos = exports.setSelectedRepos = (() => {var _ref2 = (0, _asyncToGenerator3.default)(

  function* (selected_repos, decoded) {
    var saveRef = db.collection(BROADCASTER_COLLECTION);
    yield saveRef.doc(decoded.channel_id).set({
      selected_repos: selected_repos },
    { merge: true });

    return getBroadcasterInfo(decoded.channel_id);
  });return function setSelectedRepos(_x3, _x4) {return _ref2.apply(this, arguments);};})();let getSelectedRepos = exports.getSelectedRepos = (() => {var _ref3 = (0, _asyncToGenerator3.default)(

  function* (channel_id, selected_repos) {
    var channelRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id);

    try {
      const doc = yield channelRef.get();
      // returns promise till data is resolved
      const userData = yield doc.data();
    } catch (error) {
      console.log(error);
      return null;
    }

    return userData.selected_repos.map(function (repo_id) {
      return userData.repos.find(function (repo) {return repo.id === repo_id;});
    });
  });return function getSelectedRepos(_x5, _x6) {return _ref3.apply(this, arguments);};})();let getBroadcasterInfo = exports.getBroadcasterInfo = (() => {var _ref4 = (0, _asyncToGenerator3.default)(

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
  });return function getBroadcasterInfo(_x7) {return _ref4.apply(this, arguments);};})();var _firebaseFunctions = require('firebase-functions');var functions = _interopRequireWildcard(_firebaseFunctions);var _firebaseAdmin = require('firebase-admin');var admin = _interopRequireWildcard(_firebaseAdmin);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}admin.initializeApp(functions.config().firebase); // Set env configs by firebase functions:config:set github.secret="SECRET"
// Access set env configs via functions.config()
const db = admin.firestore();const BROADCASTER_COLLECTION = 'broadcasters';