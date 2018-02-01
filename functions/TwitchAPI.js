"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.








setExtensionConfigured = setExtensionConfigured;var _axios = require("axios");var _axios2 = _interopRequireDefault(_axios);var _Constants = require("./Constants");var _AuthToken = require("./AuthToken");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}async function setExtensionConfigured(channel_id, secret) {
  const token = (0, _AuthToken.signToken)(secret);

  let response = await (0, _axios2.default)({
    method: 'PUT',
    url: `${_Constants.TWITCH_BASE_EXTENSION_URL}/${_Constants.EXTENSION_ID}/${_Constants.EXTENSION_VERSION}/required_configuration?channel_id=${channel_id}`,
    data: {
      "required_configuration": _Constants.CONFIG_KEY },

    headers: {
      'Content-Type': 'application/json',
      'Client-id': _Constants.EXTENSION_ID,
      'Authorization': `Bearer ${token}` } });


}