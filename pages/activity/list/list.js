const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    list: [],
  },
  // 进入页面后加载，根据用户id查询所有的健康档案记录
  attached: function () {
    var that = this;
    var get_url = app.globalData.local_url + "api/getRecordList?userId=" + app.globalData.userId;
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
            list: res.data.data,
          });
        } else {
          console.log("获取失败")
        }
      }
    })
  },
  methods: { 
    // 查看详细报告
    see(e) {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/activity/report/report?id=' + id
      })
    }
  }




})