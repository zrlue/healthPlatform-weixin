const app = getApp();
Page({
  data: {
    userName: null,
    userPass: null,
  },
  userName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPass: function (e) {
    this.setData({
      userPass: e.detail.value
    })
  },
  login() {
    var userName = this.data.userName;
    var userPass = this.data.userPass;
    wx.request({
      url: app.globalData.local_url + 'api/loginUser',
      data: {
        userName: userName,
        passWord: userPass
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          // 初始化全局变量
          app.globalData.isLogin = true;
          app.globalData.userId = res.data.data.id;
          console.log(res.data.data.id);
          app.globalData.name = res.data.data.nickName;
          app.globalData.head = res.data.data.headIcon;
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000 //持续的时间
          });
          //两秒跳转首页
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }, 2000);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000 //持续的时间
          });
        }
      }
    })
  }
});