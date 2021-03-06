/**
 * @author jsbxyyx
 */
import * as gb from './github.js';
import * as ge from './gitee.js';
import * as util from './util.js';

const platform_key = "platform";
const secret_key_prefix = 'secret:';
const token_key_prefix = 'token:';
const username_key = 'username';
const split_key = '#_#';

const support_platform = {
  'GitHub': gb,
  'Gitee': ge
};

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

function savePlatform(platform) {
  wx.setStorageSync(platform_key, platform);
}

function getPlatform() {
  return wx.getStorageSync(platform_key);
}

function deletePlatform() {
  wx.removeStorageSync(platform_key)
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

function saveUsernameTokenSecret(platform, username, token, secret, callback) {
  savePlatform(platform);
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
  if (!_check()) return;
  let g = support_platform[getPlatform()];
  g.createRepo(token, repo, repo, function (data, statusCode, header) {
    callback(data, statusCode, header);
  });
}

function getAllAccount(callback) {
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  if (!_check()) return;
  let g = support_platform[getPlatform()];
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
  if (!_check()) return;
  let g = support_platform[getPlatform()];
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
  if (!_check()) return;
  let path = util.encrypt(type + split_key + account, secret);
  let g = support_platform[getPlatform()];
  g.deleteFile(token, user, repo, path, function (data, statusCode, header) {
    callback(data, statusCode, header);
  });
}

function getAccount(id, callback) {
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  if (!_check()) return;
  let path = id;
  let g = support_platform[getPlatform()];
  g.getFile(token, user, repo, path, function(data, statusCode, header) {
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

function _check() {
  let platform = getPlatform();
  let user = getUsername();
  let repo = getRepo();
  let token = getToken(user);
  let secret = getSecret();
  if (platform == null || platform == '' || user == null || user == '' || repo == null || repo == '' || token  == null || token == '' || secret == null || secret == '') {
    wx.showModal({
      title: '提示',
      content: '您还未设置用户名，token相关信息，请完善！',
      showCancel: false,
      success: function(res) {
        if(res.confirm) {
          wx.switchTab({
            url: '/pages/me/me',
          });
        }
      }
    })
    return false;
  }
  return true;
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
