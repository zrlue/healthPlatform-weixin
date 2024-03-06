const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    recordImg: []
  },
  /**
   * 页面加载时触发。一个页面只会调用一次
   * 根据报告id查询详细报告
   */
  onLoad: function (options) {
    var that = this;
    var get_url = app.globalData.local_url + "api/getRecord?recordId=" + options.id;
    wx.request({
      url: get_url,
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data);
          that.setData({
            info: res.data.data,
            recordImg: res.data.data.report
          });
        } else {
          console.log("获取档案信息失败")
        }
      }
    })
  },
  ViewImage(e) {
    // 在新页面中全屏预览图片
    wx.previewImage({
      urls: this.data.recordImg,
      current: e.currentTarget.dataset.url
    });
  },
})