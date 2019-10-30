/**
 * @author jsbxyyx
 */
//index.js
//获取应用实例
const app = getApp();

import * as dao from '../../utils/dao.js';

Page({
  data: {
    list: []
  },
  edit: function(e) {
    let obj = e.currentTarget.dataset;
    app.aid = obj.id;
    wx.switchTab({
      url: '/pages/add/add',
    });
  },
  load: function() {
    let that = this;
    dao.getAllAccount(function(data, statusCode, header){
      if (statusCode == 200 && data.length > 0) {
        let list = [];
        for (let i in data) {
          let obj = data[i];
          let splits = dao.parsePath(obj.name);
          list.push({ id: obj.name, username: splits[1], type: splits[0] });
        }
        that.setData({ list: list });
      } else {
        wx.showToast({
          title: '暂无数据',
          icon: 'none',
          duration: 5000
        })
      }
    });
  },
  onLoad: function () {
    this.load();
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.load();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.load();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this;
    setTimeout(function () {
      that.setData({ list: [] });
    }, 1000);
  }
})
