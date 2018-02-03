"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.setExtensionConfigured = undefined;var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);let setExtensionConfigured = exports.setExtensionConfigured = (() => {var _ref = (0, _asyncToGenerator3.default)(








  function* (channel_id, secret) {
    const token = (0, _AuthToken.signToken)(secret);

    let response = yield (0, _axios2.default)({
      method: 'PUT',
      url: `${_Constants.TWITCH_BASE_EXTENSION_URL}/${_Constants.EXTENSION_ID}/${_Constants.EXTENSION_VERSION}/required_configuration?channel_id=${channel_id}`,
      data: {
        "required_configuration": _Constants.CONFIG_KEY },

      headers: {
        'Content-Type': 'application/json',
        'Client-id': _Constants.EXTENSION_ID,
        'Authorization': `Bearer ${token}` } });


  });return function setExtensionConfigured(_x, _x2) {return _ref.apply(this, arguments);};})();var _axios = require("axios");var _axios2 = _interopRequireDefault(_axios);var _Constants = require("./Constants");var _AuthToken = require("./AuthToken");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}