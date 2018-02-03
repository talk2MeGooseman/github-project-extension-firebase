'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.getBroadcasterInfo = exports.getSelectedRepos = exports.setSelectedRepos = exports.saveGithubInfo = undefined;var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);let saveGithubInfo = exports.saveGithubInfo = (() => {var _ref = (0, _asyncToGenerator3.default)(

  function* (db, data, decoded) {
    var saveRef = db.collection(_Constants.BROADCASTER_COLLECTION);

    saveRef.doc(decoded.channel_id).set(data);
  });return function saveGithubInfo(_x, _x2, _x3) {return _ref.apply(this, arguments);};})();let setSelectedRepos = exports.setSelectedRepos = (() => {var _ref2 = (0, _asyncToGenerator3.default)(

  function* (db, selected_repos, decoded) {
    var saveRef = db.collection(_Constants.BROADCASTER_COLLECTION);
    yield saveRef.doc(decoded.channel_id).set({
      selected_repos: selected_repos },
    {
      merge: true });


    return getBroadcasterInfo(db, decoded.channel_id);
  });return function setSelectedRepos(_x4, _x5, _x6) {return _ref2.apply(this, arguments);};})();let getSelectedRepos = exports.getSelectedRepos = (() => {var _ref3 = (0, _asyncToGenerator3.default)(

  function* (db, channel_id, selected_repos) {
    var channelRef = db.collection(_Constants.BROADCASTER_COLLECTION).doc(channel_id);

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
  });return function getSelectedRepos(_x7, _x8, _x9) {return _ref3.apply(this, arguments);};})();let getBroadcasterInfo = exports.getBroadcasterInfo = (() => {var _ref4 = (0, _asyncToGenerator3.default)(

  function* (db, channel_id) {
    const channelRef = db.collection(_Constants.BROADCASTER_COLLECTION).doc(channel_id);
    try {
      const doc = yield channelRef.get();
      // returns promise till data is resolved
      return doc.data();
    } catch (error) {
      console.log(error);
      return null;
    }
  });return function getBroadcasterInfo(_x10, _x11) {return _ref4.apply(this, arguments);};})();var _Constants = require('./Constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}