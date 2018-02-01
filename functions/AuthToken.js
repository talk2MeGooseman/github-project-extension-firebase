'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.


decodeToken = decodeToken;exports.




verifyToken = verifyToken;exports.






signToken = signToken;var _jsonwebtoken = require('jsonwebtoken');var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);var _Constants = require('./Constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function decodeToken(token, secret) {const secret_decoded = new Buffer(secret, 'base64');return _jsonwebtoken2.default.verify(token, secret_decoded);}function verifyToken(token, secret) {const decoded = decodeToken(token, secret);if (decoded.role != 'broadcaster') throw 'Must be broadcaster role.';return decoded;}function signToken(secret) {
  const secret_decoded = new Buffer(secret, 'base64');
  const tokenObj = {
    "user_id": _Constants.EXTENSTION_USER_ID,
    "role": "external" };


  return _jsonwebtoken2.default.sign(tokenObj, secret_decoded, {
    expiresIn: '1h' });

}