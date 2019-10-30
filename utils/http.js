/**
 * @author jsbxyyx
 */
const debug = true;

function exchange(options) {
  let url = options.url;
  let data = options.data;
  let header = options.header;
  let method = options.method;
  let success = options.success;
  let fail = options.fail;
  let complete = options.complete;
  wx.showLoading({
    title: '正在加载数据...',
  });
  wx.request({
    url: url,
    data: data,
    header: header,
    method: method,
    success: function(res) {
      wx.hideLoading();
      if (debug) {
        console.log(res);
      }
      let statusCode = res.statusCode;
      if (statusCode == 401) {
        wx.showModal({
          title: '提示',
          content: '您还未设置github相关信息，请完善！',
          showCancel: false,
          success: function(res) {
            if(res.confirm) {
              wx.switchTab({
                url: '/pages/me/me',
              });
            }
          }
        })
      } else {
        success(res);
      }
    },
    fail: fail,
    complete: complete
  })

}

module.exports = {
  exchange: exchange,
}