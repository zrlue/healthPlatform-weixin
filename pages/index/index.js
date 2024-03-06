//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cardCur: 0,
    PageCur: 'basics'
  },
  //事件处理函数
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
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
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                console.log(res)
                const lat = res.latitude
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
                      });
                    }
                  }
                })
              },
              fail: function (errInfo) {
                console.info(errInfo, '无法正确获取位置')
              }
            })
          }
        }
      })

    }
  },
})