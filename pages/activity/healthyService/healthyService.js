const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    list: []
  },
  /**
   * 进入页面时执行，获取健康服务数据列表
   */
  attached: function () {
    var get_url = app.globalData.local_url + "api/getHealthyServiceList";
    var that = this;
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
          console.log("获取健康服务失败")
        }
      }
    })
  },
  methods: {
    // 获取健康服务数据列表，根据服务名称查找
    getHealthyServiceList(e) {
      // 搜索框中的输入
      var val = e.detail.value;
      var get_url = app.globalData.local_url + "api/getHealthyServiceList?name=" + val;
      var that = this;
      wx.request({
        url: get_url,
        data: {
          name: val
        },
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
              console.log("查询健康服务失败")
          }
        }
      })
    }
  },
})