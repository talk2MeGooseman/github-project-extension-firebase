'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.getGithubRepos = exports.getUserGithub = undefined;var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);let getUserGithub = exports.getUserGithub = (() => {var _ref = (0, _asyncToGenerator3.default)(














  function* (username, decoded) {
    const creds = getCredentials();
    const { data } = yield _axios2.default.get(`${_Constants.GITHUB_BASE_URL}/users/${username}`, {
      params: (0, _extends3.default)({},
      creds) });


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

  function* (username, channel_id, page = 1) {
    const creds = getCredentials();
    const { data, headers } = yield _axios2.default.get(`${_Constants.GITHUB_BASE_URL}/users/${username}/repos`, {
      params: (0, _extends3.default)({
        type: 'all',
        per_page: 100,
        sort: 'pushed',
        page: page },
      creds) });



    // Format the data we want from each repo
    let repos = data.map(function (repo) {
      let { id, name, html_url, full_name, description, language } = repo;
      return {
        id: id.toString(),
        name,
        html_url,
        full_name,
        description,
        language };

    });

    // Check if there any other pages, then fetch them
    const pagesHeader = headers['link'];
    if (pagesHeader && pagesHeader.includes(`rel="last"`)) {
      // Fetch next page
      let pagedRepos = yield getGithubRepos(username, channel_id, page + 1);
      // Append to the end of the repos array to keep order
      repos = repos.concat(pagedRepos);
    }

    return repos;
  });return function getGithubRepos(_x3, _x4) {return _ref2.apply(this, arguments);};})();var _axios = require('axios');var _axios2 = _interopRequireDefault(_axios);var _firebaseFunctions = require('firebase-functions');var functions = _interopRequireWildcard(_firebaseFunctions);var _Constants = require('./Constants');function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function getCredentials() {if (functions.config().github) {return { client_id: functions.config().github.client_id, client_secret: functions.config().github.client_secret };} else {return {};}}