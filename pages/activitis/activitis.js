const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    allList: null,
  },
  // 每次进入页面时执行
  attached() {
    var that = this;
    // 获取所有的活动
    wx.request({
      url: app.globalData.local_url + 'api/getActivityList',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            allList: res.data.data,
          });
          console.log('获取社区活动数据成功')
        } else {
          console.log('获取社区活动数据失败')
        }
      }
    })
  },
  methods: {
    getData(e) {
      // 定义搜索关键词
      var val = e.detail.value;
      var that = this;
      wx.request({
        // 调用获取活动数据列表API
        url: app.globalData.local_url + 'api/getActivityList?title=' + val,
        data: {},
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              allList: res.data.data,
            });
            console.log('搜索成功')
          } else {
            console.log('搜索失败')
          }
        }
      })
    },

    goInfo(e) {
      console.log("社区活动信息获取成功");
      var id = e.currentTarget.dataset.id;
      app.globalData.id = id;
      console.log('跳转到活动详情页');
      // 点击活动就进入到活动详情页，并传入id参数
      wx.navigateTo({
        url: '/pages/activity/reply/reply?id=' + id
      })
    }
  },
})