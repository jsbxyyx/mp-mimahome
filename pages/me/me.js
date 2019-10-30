/**
 * @author jsbxyyx
 */
// pages/me/me.js
const app = getApp();

import * as util from '../../utils/util.js';
import * as dao from '../../utils/dao.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideSync: 'hide',
    hideGithub: 'hide',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      hideGithub: 'show',
    })
  },
  save: function(e) {
    let that = this;
    let val = e.detail.value;
    let username = val.username;
    let token = val.token;
    let secret = val.secret;
    if (util.isEmpty(username) ||
      util.isEmpty(token) ||
      util.isEmpty(secret)) {
      wx.showToast({
        title: '表单请填写完整',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (secret.length != 16) {
      wx.showToast({
        title: '加密密钥格式不正确，例子：1234567812345678',
        icon: 'none',
        duration: 2000,
      });
    }
    let localUsername = dao.getUsername();
    if (!util.isEmpty(localUsername)) {
      wx.showModal({
        title: '提示',
        content: '本地存在用户名，token，密钥信息，是否覆盖？',
        success: function(res) {
          if (res.confirm) {
            that.create(username, token, secret);
          }
        }
      })
      return;
    }
    that.create(username, token, secret);
  },
  create: function(username, token, secret) {
    let that = this;
    dao.saveUsernameTokenSecret(username, token, secret, function (data, statusCode, header) {
      if (statusCode == 404) {
        wx.showToast({
          title: '请开通相应的权限！！！',
          icon: 'none',
          duration: 3000
        });
        dao.deleteUsernameTokenSecret();
        return;
      }
      that.setData({
        me: null
      });
      wx.showToast({
        title: '保存成功',
      });
      wx.switchTab({
        url: '/pages/index/index',
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})