const app = getApp()
var list_url = app.globalData.apiUrl;
Page({
  data: {
    id: 0,
    info: {}
  },
  // 页面加载时触发。一个页面只会调用一次
  onLoad: function (options) {
      var that = this;
      this.setData({
        id: options.id
      })
      getloadData(that);
    },
})
function getloadData(that) {
  console.log("加载文章数据成功");
  wx.showToast({
    title: '加载中',
    icon: "loading",
    duration: 10000
  });
  wx.request({
    url: app.globalData.local_url + "api/getNewInfo?newsId=" + that.data.id + "&userId=" + app.globalData.userId,
    data: {},
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      console.log(res.data);
      wx.hideToast();
      res.data.data.content = formatImg(res.data.data.content);
      res.data.data.content = res.data.data.content.replace(/\<img/gi, '<img class="rich-img" ');
      that.setData({
        info: res.data.data,
      })
      // 隐藏加载框
      wx.hideLoading();
    },
    fail: function (res) {
    },
    complete: function (res) {
    },
  })
}
function formatImg(html) {
  var newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    var match = match.replace(/style=\"(.*)\"/gi, '<img class="rich-img" ');
    return match;
  });
  return newContent;
}