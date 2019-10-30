/**
 * @author jsbxyyx
 */
import * as g from './github.js';
import * as util from './util.js';

const secret_key_prefix = 'secret:';
const token_key_prefix = 'token:';
const username_key = 'username';
const split_key = '#_#';

function saveSecret(username, secret) {
  wx.setStorageSync(secret_key_prefix + username, secret);
}

function deleteSecret(username) {
  wx.removeStorageSync(secret_key_prefix + username)
}

function _getSecret(username) {
  return wx.getStorageSync(secret_key_prefix + username);
}

function getSecret() {
  return _getSecret(getUsername());
}

function saveUsername(username) {
  wx.setStorageSync(username_key, username);
}

function getUsername() {
  return wx.getStorageSync(username_key);
}

function deleteUsername() {
  wx.removeStorageSync(username_key)
}

function saveToken(username, token) {
  wx.setStorageSync(token_key_prefix + username, token);
}

function deleteToken(username) {
  wx.removeStorageSync(token_key_prefix + username);
}

function getToken(username) {
  return wx.getStorageSync(token_key_prefix + username);
}

function saveUsernameTokenSecret(username, token, secret, callback) {
  saveUsername(username);
  saveToken(username, token);
  saveSecret(username, secret);
  createRepo(callback);
}

function deleteUsernameTokenSecret() {
  let username = getUsername();
  deleteSecret(username);
  deleteToken(username);
  deleteUsername();
}

function getRepo() {
    return 'mmh';
}

function createRepo(callback) {
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  g.createRepo(token, repo, repo, function (data, statusCode, header) {
    callback(data, statusCode, header);
  });
}

function getAllAccount(callback) {
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  g.getFile(token, user, repo, "", function(data, statusCode, header){
    callback(data, statusCode, header)
  });
}

function saveOrUpdateAccount(type, account, password, callback) {
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  let secret = getSecret();
  let path = util.encrypt(type + split_key + account, secret);
  let content = util.encrypt(password, secret);
  
  g.createOrUpdateFile(token, user, repo, path, content, function(data, statusCode, header){
    callback(data, statusCode, header);
  });
}

function deleteAccountById(id, callback) {
  let splits = parsePath(id);
  deleteAccount(splits[0], splits[1], callback);
}

function deleteAccount(type, account, callback) {
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  let secret = getSecret();
  let path = util.encrypt(type + split_key + account, secret);;
  g.deleteFile(token, user, repo, path, function (data, statusCode, header) {
    callback(data, statusCode, header);
  });
}

function getAccount(id, callback) {
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  let path = id;
  g.getFile(token, user, repo, path, function(data, statusCode, header){
    callback(data, statusCode, header);
  });
}

function decryptRawPassword(rawPassword) {
  let secret = getSecret();
  return util.decrypt(new util.Base64().decode(rawPassword), secret);
}

function parsePath(path) {
  let str = util.decrypt(path, getSecret());
  let splits = str.split(split_key);
  return splits;
}

module.exports = {
  getUsername: getUsername,
  saveUsernameTokenSecret: saveUsernameTokenSecret,
  deleteUsernameTokenSecret: deleteUsernameTokenSecret,
  createRepo: createRepo,
  saveOrUpdateAccount: saveOrUpdateAccount,
  deleteAccount: deleteAccount,
  deleteAccountById: deleteAccountById,
  getAllAccount: getAllAccount,
  getSecret: getSecret,
  parsePath: parsePath,
  getAccount: getAccount,
  decryptRawPassword: decryptRawPassword,
}
