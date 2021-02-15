/**
 * @author jsbxyyx
 */
import * as http from './http.js';
import * as util from './util.js';

const host = 'https://gitee.com/api/v5';
const base64 = new util.Base64();

function createRepo(token, name, description, callback) {
  let url = host + '/user/repos';
  http.exchange({
    url: url,
    data: {
      access_token: token,
      name: name,
      description: "密码Home小程序数据仓库，勿删，勿删，勿删！！！",
      private: true,
      has_issues: true,
      has_projects: true,
      has_wiki: true,
      auto_init: true
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function(res) {
        callback(res.data, res.statusCode, res.header);
    },
    fail: function(error) {},
    complete: function() {}
  });
}

function getFile(token, user, repo, path, callback) {
  let url = host + '/repos/' + user + '/' + repo + '/contents/' + path;
  http.exchange({
    url: url,
    data: {
      access_token: token,
      repo: '',
      ref: 'master',
      path: ''
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      callback(res.data, res.statusCode, res.header);
    },
    fail: function(error) {console.log(error);},
    complete: function() {}
  });
}

function createOrUpdateFile(token, user, repo, path, content, callback) {
  getFile(token, user, repo, path, function(data, statusCode, header) {
    let sha = data['sha'];
    let method = "PUT";
    if (sha == null) {
      method = "POST";
    }
    _createOrUpdateFile(token, user, repo, path, content, sha, method, callback);
  })
}

function _createOrUpdateFile(token, user, repo, path, content, sha, method, callback) {
  let url = host + '/repos/' + user + '/' + repo + '/contents/' + path;
  content = base64.encode(content);
  http.exchange({
    url: url,
    data: {
      access_token: token,
      repo: '',
      branch: 'master',
      path: '',
      message: 'Update message by 密码Home',
      sha: sha,
      content: content,
    },
    header: {
      'content-type': 'application/json'
    },
    method: method,
    success: function(res) {
      callback(res.data, res.statusCode, res.header);
    },
    fail: function(error) {},
    complete: function() {}
  });
}

function deleteFile(token, user, repo, path, callback) {
  getFile(token, user, repo, path, function(data, statusCode, header) {
    let sha = data['sha'];
    _deleteFile(token, user, repo, path, sha, callback);
  });
}

function _deleteFile(token, user, repo, path, sha, callback) {
  let url = host + '/repos/' + user + '/' + repo + '/contents/' + path;
  http.exchange({
    url: url,
    data: {
      access_token: token,
      repo: '',
      branch: 'master',
      path: '',
      message: 'Update message by 密码Home',
      sha: sha
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'DELETE',
    success: function(res) {
      callback(res.data, res.statusCode, res.header);
    },
    fail: function(error) {},
    complete: function() {}
  });
}

module.exports = {
  createRepo: createRepo,
  createOrUpdateFile: createOrUpdateFile,
  deleteFile: deleteFile,
  getFile: getFile,
}