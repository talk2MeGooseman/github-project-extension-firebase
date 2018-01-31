'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.


getUserGithub = getUserGithub;exports.

















getGithubRepos = getGithubRepos;var _axios = require('axios');var _axios2 = _interopRequireDefault(_axios);var _Constants = require('./Constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}async function getUserGithub(username, decoded) {const { data } = await _axios2.default.get(`${_Constants.GITHUB_BASE_URL}/users/${username}`);const repos = await getGithubRepos(username, decoded.channel_id);const user = { user_id: decoded.user_id, github_user: { login: data.login, avatar_url: data.avatar_url, repos_url: data.repos_url, public_repos: data.public_repos }, repos };return user;}async function getGithubRepos(username, channel_id) {
  const { data } = await _axios2.default.get(`${_Constants.GITHUB_BASE_URL}/users/${username}/repos`, { type: 'all' });

  // Fetch the data we want from each repo
  return data.map(repo => {
    let { id, name, html_url, full_name, description, language } = repo;
    return {
      id: id.toString(),
      name,
      html_url,
      full_name,
      description,
      language };

  });
}