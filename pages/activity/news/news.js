const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    list: [],
    icon: "",
    Tab: [],
    TabCur: 0,
    types: "",
    index: 0,
    id: null,
    windowHeight: 0, //获取屏幕高度
    typeList: [],
    // 轮播图设置
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://img1.baidu.com/it/u=4038406728,511560852&fm=253&fmt=auto&app=120&f=JPEG?w=1080&h=608'
    }, {
      id: 1,
      type: 'image',
      url: 'https://img0.baidu.com/it/u=3733979832,2098457770&fm=253&fmt=auto&app=138&f=JPEG?w=409&h=240',
    }, {
      id: 2,
      type: 'image',
      url: 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2020%2F1112%2F4ef80281j00qjoi67001ud200u000gwg00it00al.jpg&thumbnail=660x2147483647&quality=80&type=jpg'
    }],
  },
  //自定义组件
  attached: function () {
    var that = this;
    // 获取屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    getTypeData(that, "")
  },
  methods: {
    // 类型选择
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        types: this.data.typeList[e.currentTarget.dataset.id].name,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
      getNewList(this, "")
    },
    // 搜索的时候调用
    getNewList(e) {
      var that = this;
      that.setData({
        icon: app.globalData.local_url,
      })
      var val = e.detail.value;
      getNewList(that, val);
    },
    // 跳转到详情页
    toDetail(e) {
      var id = e.currentTarget.dataset.id;
      app.globalData.id = id;
      wx.navigateTo({
        url: '/pages/basics/detailed/detailed?id=' + id
      })

    },
    // 一键呼救
    rescue(e) {
      if (!app.globalData.isLogin) {
        wx.navigateTo({
          url: '/pages/about/login/login'
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '确定呼救吗？',
          success: function (res) {
            console.log(res)
            if (res.confirm) {
              // 获取用户定位
              wx.getLocation({
                // wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
                type: 'wgs84',
                success(res) {
                  console.log(res)
                  // 纬度，范围为 -90~90，负数表示南纬
                  const lat = res.latitude
                  // 经度，范围为 -180~180，负数表示西经
                  const lng = res.longitude
                  var get_url = app.globalData.local_url + "api/rescue";
                  wx.request({
                    url: get_url,
                    data: {
                      lat: lat,
                      lng: lng,
                      userId: app.globalData.userId
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      if (res.data.code == 200) {
                        console.log("正在呼救")
                        wx.showToast({
                          title: '呼救成功',
                          icon: 'success',
                          duration: 2000 //持续的时间
                        });
                      } else {
                        wx.showToast({
                          title: '呼救失败',
                          icon: 'error',
                          duration: 2000 //持续的时间
                        })
                      }
                    }
                  })
                },
                fail: function (errInfo) {
                  console.info(errInfo)
                }
              })
            }
          }
        })
      }
    },
  }
})
// 获取养生知识数据
function getTypeData(that) {
  var get_url = app.globalData.local_url + "api/getTypeList";
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
          typeList: res.data.data
        });
        // 遍历设置数据
        for (let i in res.data.data) {
          that.setData({
            Tab: that.data.Tab.concat(res.data.data[i].name),
            types: res.data.data[0].name
          })
        }
        getNewList(that, "");
      } else {
        console.log("获取失败")
      }
    }
  })
}
// 根据标题和类型查询知识列表
function getNewList(that, val) {
  var get_url = app.globalData.local_url + "api/getNewList?title=" + val + "&userId=" + app.globalData.userId + "&type=" + that.data.types;
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
        console.log("资讯搜索失败")
      }
    }
  })
}