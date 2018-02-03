'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.getGithubRepos = exports.getUserGithub = undefined;var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);let getUserGithub = exports.getUserGithub = (() => {var _ref = (0, _asyncToGenerator3.default)(


  function* (username, decoded) {
    const { data } = yield _axios2.default.get(`${_Constants.GITHUB_BASE_URL}/users/${username}`);
    const repos = yield getGithubRepos(username, decoded.channel_id);

    const user = {
      user_id: decoded.user_id,
      github_user: {
        login: data.login,
        avatar_url: data.avatar_url,
        repos_url: data.repos_url,
        public_repos: data.public_repos },

      repos };


    return user;
  });return function getUserGithub(_x, _x2) {return _ref.apply(this, arguments);};})();let getGithubRepos = exports.getGithubRepos = (() => {var _ref2 = (0, _asyncToGenerator3.default)(

  function* (username, channel_id) {
    const { data } = yield _axios2.default.get(`${_Constants.GITHUB_BASE_URL}/users/${username}/repos`, { type: 'all' });

    // Fetch the data we want from each repo
    return data.map(function (repo) {
      let { id, name, html_url, full_name, description, language } = repo;
      return {
        id: id.toString(),
        name,
        html_url,
        full_name,
        description,
        language };

    });
  });return function getGithubRepos(_x3, _x4) {return _ref2.apply(this, arguments);};})();var _axios = require('axios');var _axios2 = _interopRequireDefault(_axios);var _Constants = require('./Constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}