const app = getApp();
var save_url = app.globalData.local_url + "api/saveMeassage";
Page({
  data: {
    content:""
  },
  // 提交问诊内容
  save(e){
    var that = this;
    var content  = that.data.content
    if (content == ""){
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        success: function (res) {
          console.log("正在问诊")
        }
      })
      return;
    }
    wx.request({
      url: save_url,
      data: {
        context: that.data.content,
        userId :app.globalData.userId,
        pid: 0,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: "提交成功",
            icon: "success",
            duration: 10000
          });
          var timer = setTimeout(function () {
            clearTimeout(timer);
            wx.navigateBack()
          }, 1000);

        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {

            }
          })
        }
      }
    })
  },
  // 设置问诊内容
  getcontent: function (e) {
    var val = e.detail.value;
    this.setData({
      content: val
    });
  }, 
})