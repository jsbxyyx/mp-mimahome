/**
 * @author jsbxyyx
 */
//index.js
//获取应用实例
const app = getApp();

import * as dao from '../../utils/dao.js';
import * as util from '../../utils/util.js'

Page({
  data: {
    allList: [],
    list: [],
    keyword: '',
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
          if (splits[1] == '' || splits[0] == '') {
            continue;
          }
          list.push({ id: obj.name, username: splits[1], type: splits[0] });
        }
        that.setData({
          allList: list,
          list: list
        });
      } else {
        wx.showToast({
          title: '暂无数据',
          icon: 'none',
          duration: 5000
        })
      }
    });
  },
  searchInput: function(e) {
    let v = e.detail.value;
    this.setData({
      keyword: v
    })
  },
  searchClear: function() {
    this.setData({
      keyword: ''
    })
  },
  searchByKeyword: function() {
    let that = this;
    let keyword = this.data.keyword;
    if (util.isEmpty(keyword)) {
      that.setData({
        list: that.data.allList
      })
      return;
    }
    let filterList = util.fuzzyQuery(that.data.allList, ['username', 'type'], keyword);
    that.setData({
      list: filterList
    })
  },
  goTop: function(e) {
    let top = e.currentTarget.dataset['top'];
    wx.pageScrollTo({
      scrollTop: top,
      duration: 300
    });
  },
  onLoad: function () {
    this.load();
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    // this.load();
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
    // let that = this;
    // setTimeout(function () {
    //   that.setData({ list: [] });
    // }, 1000);
  }
})
