const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    
    userInfo: null,
    isLogin: false,
    name: "",
    head: ""
  },
  //自定义组件
  attached:function(){

    const app = getApp();



    var that = this;
    console.log(app.globalData.isLogin);
    if (app.globalData.isLogin) {
      that.setData({
        isLogin: true,
        name: app.globalData.name,
        head: app.globalData.head,
      });

    }
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          userInfo: res.data
        })
      },
    });
    wx.getStorage({
      key: "isLogin",
      success: function (res) {
        that.setData({
          isLogin: res.data
        })
      },
    });
  },
  methods: {
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    saoyisao(){
      wx.scanCode({
        success: (res) => {
          var result = res.result;
          console.log(result);
          wx.navigateTo({
            url: '/pages/activity/info/info?id='+result
          })
  }
})
    },
    loginOut(){
      app.globalData.isLogin = false;
      app.globalData.name = "";
      app.globalData.userId = "";
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }, 2000);
      wx.showToast({
        title: '账号退出成功',
        icon: 'success',
        duration: 2000 //持续的时间
      });
    }
  }
})