/**
 * @author jsbxyyx
 */
// pages/add.js

const app = getApp()

import * as dao from '../../utils/dao.js';
import * as util from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: {
      id: '',
      type: '',
      username: '',
      password: ''
    },
    isPassword: true,
    clsType: 'hide',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    let that = this;
    let aid = app.aid;
    if (aid != null) {
      app.aid = null;
      that.setData({ "clsType": "show" });
      dao.getAccount(aid, function(data, statusCode, header){
        if (statusCode == 200) {
          let splits = dao.parsePath(data.name);
          let password = dao.decryptRawPassword(data.content);
          that.setData({
            account: {
              id: data.name,
              type: splits[0],
              username: splits[1],
              password: password
            }
          })
        } else {
          wx.showToast({
            title: '账号信息不存在, 可能在其他设备删除了!',
            icon: 'none',
            duration: 2000
          })
        }
      });
      return ;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this;
    setTimeout(function(){
      that.setData({
        account: null,
        isPassword: true,
        clsType: 'hide',
      });
    }, 1000);
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

  },
  save: function(e) {
    let val = e.detail.value;

    if (util.isEmpty(val.type) ||
      util.isEmpty(val.username) ||
      util.isEmpty(val.password)) {
      wx.showToast({
        title: '请完整填写表单',
        icon: 'none',
      });
      return;
    }

    let type = val.type;
    let username = val.username;
    let password = val.password;
    dao.saveOrUpdateAccount(type, username, password, function(data, statusCode, header){
      wx.showToast({
        title: '操作成功',
      });
      if (statusCode == 201) {
        wx.switchTab({
          url: '/pages/index/index',
        });
      }
    });
  },
  viewpasswd: function(e) {
    let that = this;
    this.setData({ isPassword: !that.data.isPassword });
  },
  deleteAccount: function(e) {
    let that = this;
    let id = that.data.account.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(res) {
        if (res.confirm) {
          dao.deleteAccountById(id, function(data, statusCode, header){
            if (statusCode == 404) {
              wx.showToast({
                title: '账户信息不存在，可能在其他设备已经删除',
                icon: 'none',
              });
              return ;
            }
            wx.showToast({
              title: '删除成功',
            });
            wx.switchTab({
              url: '/pages/index/index',
            });
          });
        }
      }
    });
  }
})