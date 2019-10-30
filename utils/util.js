/**
 * @author jsbxyyx
 */
import {
  Base64
} from './base64.js';
import * as aes from './aes.js';

const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

const isEmpty = n => {
  let b = n == null || n.length === 0;
  return b;
}

const aesiv = aes.CryptoJS.enc.Utf8.parse("0000000000000000");

// + - | / _ | = $
function encrypt(str, key) {
  var aeskey = aes.CryptoJS.enc.Utf8.parse(key);
  var srcs = aes.CryptoJS.enc.Utf8.parse(str);
  var encrypted = aes.CryptoJS.AES.encrypt(srcs, aeskey, {
    iv: aesiv,
    mode: aes.CryptoJS.mode.CBC,
    padding: aes.CryptoJS.pad.Pkcs7
  });
  encrypted = encrypted.toString();
  return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '$');
}

// - + | _ / | $ =
function decrypt(str, key) {
  str = str.replace(/\-/g, '+').replace(/\_/g, '/').replace(/\$/g, '=');
  var aeskey = aes.CryptoJS.enc.Utf8.parse(key);
  var decrypt = aes.CryptoJS.AES.decrypt(str, aeskey, {
    iv: aesiv,
    mode: aes.CryptoJS.mode.CBC,
    padding: aes.CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(aes.CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  Base64: Base64,
  encrypt: encrypt,
  decrypt: decrypt,
}